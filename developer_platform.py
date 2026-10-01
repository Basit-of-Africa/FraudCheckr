"""
Developer platform persistence and billing helpers.

This module implements a lightweight SQLite-backed developer account system
for issuing paid API keys behind Paystack.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import secrets
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib import error, request


UTC = timezone.utc


class PostgresConnection:
    def __init__(self, connection: Any):
        self._connection = connection

    def __enter__(self):
        self._connection.__enter__()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return self._connection.__exit__(exc_type, exc_value, traceback)

    def execute(self, query: str, parameters: Any = None):
        return self._connection.execute(query.replace("?", "%s"), parameters)

    def executescript(self, script: str) -> None:
        script = script.replace(
            "INTEGER PRIMARY KEY AUTOINCREMENT",
            "BIGSERIAL PRIMARY KEY",
        )
        for statement in script.split(";"):
            if statement.strip():
                self.execute(statement)

    def commit(self) -> None:
        self._connection.commit()

    def close(self) -> None:
        self._connection.close()


def now_iso() -> str:
    return datetime.now(UTC).isoformat()


def parse_iso(value: str | None) -> datetime | None:
    if not value:
        return None
    return datetime.fromisoformat(value)


def hash_secret(secret: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac(
        "sha256",
        secret.encode("utf-8"),
        salt.encode("utf-8"),
        120000,
    ).hex()


def create_password_hash(password: str) -> tuple[str, str]:
    salt = secrets.token_hex(16)
    return hash_secret(password, salt), salt


def verify_secret(secret: str, salt: str, expected_hash: str) -> bool:
    actual_hash = hash_secret(secret, salt)
    return hmac.compare_digest(actual_hash, expected_hash)


def generate_api_key() -> tuple[str, str]:
    raw_token = secrets.token_urlsafe(32)
    key = f"fchk_live_{raw_token}"
    return key[:12], key


@dataclass
class SessionUser:
    id: int
    email: str
    created_at: str


@dataclass
class ApiKeyRecord:
    id: int
    key_prefix: str
    status: str
    created_at: str
    last_used_at: str | None


@dataclass
class AuthenticatedApiKey:
    api_key_id: int
    key_prefix: str
    user: SessionUser


@dataclass
class ScreeningReportRecord:
    report_id: str
    user_id: int
    query_name: str
    query_aliases: list[str]
    query_location: str | None
    query_reference: str | None
    status: str
    confidence: float
    summary_text: str
    exact_matches: int
    possible_matches: int
    total_matches: int
    created_at: str


class DeveloperPlatform:
    def __init__(
        self,
        db_path: str | None = None,
        *,
        database_url: str | None = None,
    ):
        default_path = Path(__file__).parent / "developer_platform.db"
        self.database_url = database_url or (
            os.getenv("DATABASE_URL") if db_path is None else None
        )
        self.db_path = db_path or os.getenv("DEVELOPER_PLATFORM_DB", str(default_path))

    def _connect(self) -> Any:
        if self.database_url:
            try:
                import psycopg
                from psycopg.rows import dict_row
            except ImportError as exc:
                raise RuntimeError("Install psycopg to use DATABASE_URL") from exc

            return PostgresConnection(
                psycopg.connect(self.database_url, row_factory=dict_row)
            )

        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        connection = sqlite3.connect(self.db_path)
        connection.row_factory = sqlite3.Row
        return connection

    def initialize(self) -> None:
        with self._connect() as connection:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS developer_users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    password_salt TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS developer_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    token_hash TEXT NOT NULL,
                    expires_at TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES developer_users(id)
                );

                CREATE TABLE IF NOT EXISTS developer_subscriptions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    reference TEXT NOT NULL UNIQUE,
                    status TEXT NOT NULL,
                    amount_kobo INTEGER NOT NULL,
                    currency TEXT NOT NULL,
                    plan_name TEXT NOT NULL,
                    authorization_url TEXT,
                    access_code TEXT,
                    paid_at TEXT,
                    active_until TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES developer_users(id)
                );

                CREATE TABLE IF NOT EXISTS developer_api_keys (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    key_prefix TEXT NOT NULL,
                    key_hash TEXT NOT NULL,
                    key_salt TEXT NOT NULL,
                    status TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    last_used_at TEXT,
                    FOREIGN KEY (user_id) REFERENCES developer_users(id)
                );

                CREATE TABLE IF NOT EXISTS screening_reports (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    report_id TEXT NOT NULL UNIQUE,
                    user_id INTEGER NOT NULL,
                    query_name TEXT NOT NULL,
                    query_aliases_json TEXT NOT NULL,
                    query_location TEXT,
                    query_reference TEXT,
                    status TEXT NOT NULL,
                    confidence REAL NOT NULL,
                    summary_text TEXT NOT NULL DEFAULT '',
                    exact_matches INTEGER NOT NULL,
                    possible_matches INTEGER NOT NULL,
                    total_matches INTEGER NOT NULL,
                    matches_json TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES developer_users(id)
                );

                CREATE TABLE IF NOT EXISTS developer_api_usage_windows (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    api_key_id INTEGER NOT NULL,
                    window_start TEXT NOT NULL,
                    request_count INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    UNIQUE(api_key_id, window_start),
                    FOREIGN KEY (api_key_id) REFERENCES developer_api_keys(id)
                );

                CREATE TABLE IF NOT EXISTS request_rate_limits (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    rate_limit_key TEXT NOT NULL,
                    window_start TEXT NOT NULL,
                    request_count INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    UNIQUE(rate_limit_key, window_start)
                );

                CREATE TABLE IF NOT EXISTS developer_login_attempt_windows (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    attempt_key TEXT NOT NULL,
                    window_start TEXT NOT NULL,
                    attempt_count INTEGER NOT NULL DEFAULT 0,
                    failed_count INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    UNIQUE(attempt_key, window_start)
                );

                CREATE TABLE IF NOT EXISTS conviction_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    record_json JSONB NOT NULL
                );
                """
            )
            self._ensure_column(connection, "screening_reports", "query_reference", "TEXT")
            self._ensure_column(connection, "screening_reports", "summary_text", "TEXT NOT NULL DEFAULT ''")

    def get_conviction_records(self) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                "SELECT record_json FROM conviction_records ORDER BY id"
            ).fetchall()

        return [
            json.loads(row["record_json"])
            if isinstance(row["record_json"], str)
            else row["record_json"]
            for row in rows
        ]

    def replace_conviction_records(self, records: list[dict[str, Any]]) -> None:
        with self._connect() as connection:
            connection.execute("DELETE FROM conviction_records")
            if self.database_url:
                insert_sql = "INSERT INTO conviction_records (record_json) VALUES (?::jsonb)"
            else:
                insert_sql = "INSERT INTO conviction_records (record_json) VALUES (?)"

            for record in records:
                connection.execute(insert_sql, (json.dumps(record),))

    def _ensure_column(
        self,
        connection: Any,
        table_name: str,
        column_name: str,
        column_definition: str,
    ) -> None:
        if self.database_url:
            columns = {
                row["name"]
                for row in connection.execute(
                    """
                    SELECT column_name AS name
                    FROM information_schema.columns
                    WHERE table_schema = current_schema() AND table_name = ?
                    """,
                    (table_name,),
                ).fetchall()
            }
        else:
            columns = {
                row["name"]
                for row in connection.execute(f"PRAGMA table_info({table_name})").fetchall()
            }
        if column_name not in columns:
            connection.execute(
                f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}"
            )

    def create_user(self, email: str, password: str) -> SessionUser:
        normalized_email = email.strip().lower()
        password_hash, password_salt = create_password_hash(password)
        created_at = now_iso()

        with self._connect() as connection:
            cursor = connection.execute(
                """
                INSERT INTO developer_users (email, password_hash, password_salt, created_at)
                VALUES (?, ?, ?, ?)
                RETURNING id
                """,
                (normalized_email, password_hash, password_salt, created_at),
            )
            return SessionUser(
                id=cursor.fetchone()["id"],
                email=normalized_email,
                created_at=created_at,
            )

    def authenticate_user(self, email: str, password: str) -> SessionUser | None:
        normalized_email = email.strip().lower()
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM developer_users WHERE email = ?",
                (normalized_email,),
            ).fetchone()

        if row is None:
            return None

        if not verify_secret(password, row["password_salt"], row["password_hash"]):
            return None

        return SessionUser(
            id=row["id"],
            email=row["email"],
            created_at=row["created_at"],
        )

    def create_session(self, user_id: int) -> str:
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
        created_at = now_iso()
        expires_at = (datetime.now(UTC) + timedelta(days=30)).isoformat()

        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO developer_sessions (user_id, token_hash, expires_at, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (user_id, token_hash, expires_at, created_at),
            )

        return raw_token

    def revoke_session(self, token: str) -> None:
        token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        with self._connect() as connection:
            connection.execute(
                "DELETE FROM developer_sessions WHERE token_hash = ?",
                (token_hash,),
            )

    def get_login_attempt_status(
        self,
        attempt_key: str,
        window_seconds: int = 300,
    ) -> dict[str, Any]:
        now = datetime.now(UTC)
        window_start = datetime.fromtimestamp(
            int(now.timestamp()) - (int(now.timestamp()) % window_seconds),
            UTC,
        ).isoformat()

        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT attempt_count, failed_count
                FROM developer_login_attempt_windows
                WHERE attempt_key = ? AND window_start = ?
                """,
                (attempt_key, window_start),
            ).fetchone()

        if row is None:
            return {"attempt_count": 0, "failed_count": 0, "window_start": window_start}

        return {
            "attempt_count": row["attempt_count"],
            "failed_count": row["failed_count"],
            "window_start": window_start,
        }

    def record_login_attempt(
        self,
        attempt_key: str,
        failed: bool,
        window_seconds: int = 300,
    ) -> dict[str, Any]:
        now = datetime.now(UTC)
        window_start = datetime.fromtimestamp(
            int(now.timestamp()) - (int(now.timestamp()) % window_seconds),
            UTC,
        ).isoformat()
        created_at = now_iso()

        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO developer_login_attempt_windows (
                    attempt_key, window_start, attempt_count, failed_count, created_at, updated_at
                )
                VALUES (?, ?, 0, 0, ?, ?)
                ON CONFLICT(attempt_key, window_start) DO NOTHING
                """,
                (attempt_key, window_start, created_at, created_at),
            )

            row = connection.execute(
                """
                SELECT attempt_count, failed_count
                FROM developer_login_attempt_windows
                WHERE attempt_key = ? AND window_start = ?
                """,
                (attempt_key, window_start),
            ).fetchone()

            attempt_count = int(row["attempt_count"]) if row else 0
            failed_count = int(row["failed_count"]) if row else 0
            updated_attempt_count = attempt_count + 1
            updated_failed_count = failed_count + (1 if failed else 0)

            connection.execute(
                """
                UPDATE developer_login_attempt_windows
                SET attempt_count = ?, failed_count = ?, updated_at = ?
                WHERE attempt_key = ? AND window_start = ?
                """,
                (
                    updated_attempt_count,
                    updated_failed_count,
                    created_at,
                    attempt_key,
                    window_start,
                ),
            )

        return {
            "attempt_count": updated_attempt_count,
            "failed_count": updated_failed_count,
            "window_start": window_start,
        }

    def get_user_for_session(self, token: str) -> SessionUser | None:
        token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT u.*
                FROM developer_sessions s
                JOIN developer_users u ON u.id = s.user_id
                WHERE s.token_hash = ? AND s.expires_at > ?
                ORDER BY s.id DESC
                LIMIT 1
                """,
                (token_hash, now_iso()),
            ).fetchone()

        if row is None:
            return None

        return SessionUser(
            id=row["id"],
            email=row["email"],
            created_at=row["created_at"],
        )

    def create_payment_intent(self, user_id: int, amount_kobo: int, plan_name: str) -> dict[str, Any]:
        user = self.get_user_by_id(user_id)
        if user is None:
            raise ValueError("Developer user not found")

        plan = self.get_plan_by_name(plan_name)
        if plan is None:
            raise ValueError("Invalid plan name")

        if plan["price_kobo"] != amount_kobo:
            raise ValueError("Plan amount does not match configured price")

        if plan["price_kobo"] <= 0:
            raise ValueError("Payment initialization is not required for free plans")

        paystack_secret = os.getenv("PAYSTACK_SECRET_KEY")
        if not paystack_secret:
            raise RuntimeError("PAYSTACK_SECRET_KEY is not configured")

        reference = f"fchk_{secrets.token_hex(12)}"
        callback_url = os.getenv("PAYSTACK_CALLBACK_URL", "http://localhost:3000/developers")
        payload = {
            "email": user.email,
            "amount": amount_kobo,
            "reference": reference,
            "callback_url": callback_url,
            "metadata": {
                "user_id": user.id,
                "plan_name": plan_name,
            },
        }

        data = json.dumps(payload).encode("utf-8")
        req = request.Request(
            "https://api.paystack.co/transaction/initialize",
            data=data,
            method="POST",
            headers={
                "Authorization": f"Bearer {paystack_secret}",
                "Content-Type": "application/json",
            },
        )

        try:
            with request.urlopen(req, timeout=20) as response:
                body = json.loads(response.read().decode("utf-8"))
        except error.HTTPError as exc:
            details = exc.read().decode("utf-8", errors="ignore")
            raise RuntimeError(f"Paystack initialize failed: {details}") from exc
        except error.URLError as exc:
            raise RuntimeError("Unable to reach Paystack") from exc

        if not body.get("status"):
            raise RuntimeError(body.get("message", "Unable to initialize Paystack payment"))

        payment_data = body["data"]
        created_at = now_iso()
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO developer_subscriptions (
                    user_id, reference, status, amount_kobo, currency, plan_name,
                    authorization_url, access_code, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    user_id,
                    reference,
                    "pending",
                    amount_kobo,
                    "NGN",
                    plan_name,
                    payment_data.get("authorization_url"),
                    payment_data.get("access_code"),
                    created_at,
                    created_at,
                ),
            )

        return {
            "reference": reference,
            "authorization_url": payment_data.get("authorization_url"),
            "access_code": payment_data.get("access_code"),
            "amount_kobo": amount_kobo,
            "plan_name": plan_name,
        }

    def verify_webhook_signature(self, payload: bytes, signature: str | None) -> bool:
        secret = os.getenv("PAYSTACK_SECRET_KEY")
        if not secret or not signature:
            return False

        digest = hmac.new(secret.encode("utf-8"), payload, hashlib.sha512).hexdigest()
        return hmac.compare_digest(digest, signature)

    def apply_successful_payment(self, event: dict[str, Any]) -> dict[str, Any]:
        data = event.get("data") or {}
        reference = data.get("reference")
        if not reference:
            raise ValueError("Missing Paystack reference")

        with self._connect() as connection:
            subscription = connection.execute(
                "SELECT * FROM developer_subscriptions WHERE reference = ?",
                (reference,),
            ).fetchone()

            if subscription is None:
                raise ValueError("Unknown payment reference")

            paid_at = now_iso()
            active_until = (datetime.now(UTC) + timedelta(days=30)).isoformat()
            connection.execute(
                """
                UPDATE developer_subscriptions
                SET status = ?, paid_at = ?, active_until = ?, updated_at = ?
                WHERE reference = ?
                """,
                ("active", paid_at, active_until, paid_at, reference),
            )

            api_key = self.create_or_rotate_api_key(subscription["user_id"], connection)

        return {
            "reference": reference,
            "status": "active",
            "active_until": active_until,
            "api_key": api_key,
        }

    def create_or_rotate_api_key(
        self,
        user_id: int,
        connection: Any | None = None,
    ) -> str:
        owns_connection = connection is None
        if connection is None:
            connection = self._connect()

        try:
            connection.execute(
                "UPDATE developer_api_keys SET status = 'revoked' WHERE user_id = ? AND status = 'active'",
                (user_id,),
            )
            key_prefix, raw_key = generate_api_key()
            salt = secrets.token_hex(16)
            key_hash = hash_secret(raw_key, salt)
            connection.execute(
                """
                INSERT INTO developer_api_keys (
                    user_id, key_prefix, key_hash, key_salt, status, created_at
                )
                VALUES (?, ?, ?, ?, 'active', ?)
                """,
                (user_id, key_prefix, key_hash, salt, now_iso()),
            )
            if owns_connection:
                connection.commit()
            return raw_key
        finally:
            if owns_connection:
                connection.close()

    def list_api_keys(self, user_id: int) -> list[ApiKeyRecord]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT id, key_prefix, status, created_at, last_used_at
                FROM developer_api_keys
                WHERE user_id = ?
                ORDER BY id DESC
                """,
                (user_id,),
            ).fetchall()

        return [
            ApiKeyRecord(
                id=row["id"],
                key_prefix=row["key_prefix"],
                status=row["status"],
                created_at=row["created_at"],
                last_used_at=row["last_used_at"],
            )
            for row in rows
        ]

    def has_active_subscription(self, user_id: int) -> bool:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT 1
                FROM developer_subscriptions
                WHERE user_id = ? AND status = 'active' AND active_until > ?
                ORDER BY id DESC
                LIMIT 1
                """,
                (user_id, now_iso()),
            ).fetchone()
        return row is not None

    def get_latest_subscription(self, user_id: int) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT reference, status, amount_kobo, currency, plan_name, active_until, paid_at, created_at
                FROM developer_subscriptions
                WHERE user_id = ?
                ORDER BY id DESC
                LIMIT 1
                """,
                (user_id,),
            ).fetchone()

        return dict(row) if row else None

    def authenticate_api_key(self, raw_key: str) -> AuthenticatedApiKey | None:
        if len(raw_key) < 12:
            return None

        key_prefix = raw_key[:12]
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT k.id, k.key_prefix, k.key_hash, k.key_salt, u.id AS user_id, u.email, u.created_at
                FROM developer_api_keys k
                JOIN developer_users u ON u.id = k.user_id
                WHERE k.status = 'active' AND k.key_prefix = ?
                ORDER BY k.id DESC
                LIMIT 1
                """,
                (key_prefix,),
            ).fetchone()

            if row is None:
                return None

            if not verify_secret(raw_key, row["key_salt"], row["key_hash"]):
                return None

            connection.execute(
                "UPDATE developer_api_keys SET last_used_at = ? WHERE id = ?",
                (now_iso(), row["id"]),
            )

            return AuthenticatedApiKey(
                api_key_id=row["id"],
                key_prefix=row["key_prefix"],
                user=SessionUser(
                    id=row["user_id"],
                    email=row["email"],
                    created_at=row["created_at"],
                ),
            )

    def check_rate_limit(
        self,
        *,
        api_key_id: int,
        limit: int,
        window_seconds: int = 60,
    ) -> dict[str, Any]:
        now = datetime.now(UTC)
        window_start = now.replace(second=0, microsecond=0)
        window_key = window_start.isoformat()
        reset_at = window_start + timedelta(seconds=window_seconds)
        created_at = now_iso()

        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO developer_api_usage_windows (
                    api_key_id, window_start, request_count, created_at, updated_at
                )
                VALUES (?, ?, 0, ?, ?)
                ON CONFLICT(api_key_id, window_start) DO NOTHING
                """,
                (api_key_id, window_key, created_at, created_at),
            )

            row = connection.execute(
                """
                SELECT id, request_count
                FROM developer_api_usage_windows
                WHERE api_key_id = ? AND window_start = ?
                """,
                (api_key_id, window_key),
            ).fetchone()

            request_count = int(row["request_count"]) if row else 0
            if request_count >= limit:
                retry_after = max(1, int((reset_at - now).total_seconds()))
                return {
                    "allowed": False,
                    "limit": limit,
                    "remaining": 0,
                    "retry_after": retry_after,
                    "reset_at": reset_at.isoformat(),
                }

            updated_count = request_count + 1
            connection.execute(
                """
                UPDATE developer_api_usage_windows
                SET request_count = ?, updated_at = ?
                WHERE api_key_id = ? AND window_start = ?
                """,
                (updated_count, created_at, api_key_id, window_key),
            )

        return {
            "allowed": True,
            "limit": limit,
            "remaining": max(0, limit - updated_count),
            "retry_after": 0,
            "reset_at": reset_at.isoformat(),
        }

    def check_request_rate_limit(
        self,
        rate_limit_key: str,
        limit: int,
        window_seconds: int = 60,
    ) -> dict[str, Any]:
        now = datetime.now(UTC)
        window_start = datetime.fromtimestamp(
            int(now.timestamp()) - (int(now.timestamp()) % window_seconds),
            UTC,
        ).isoformat()
        reset_at = datetime.fromtimestamp(
            int(now.timestamp()) - (int(now.timestamp()) % window_seconds) + window_seconds,
            UTC,
        )
        created_at = now_iso()

        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO request_rate_limits (
                    rate_limit_key, window_start, request_count, created_at, updated_at
                )
                VALUES (?, ?, 0, ?, ?)
                ON CONFLICT(rate_limit_key, window_start) DO NOTHING
                """,
                (rate_limit_key, window_start, created_at, created_at),
            )

            row = connection.execute(
                """
                SELECT request_count
                FROM request_rate_limits
                WHERE rate_limit_key = ? AND window_start = ?
                """,
                (rate_limit_key, window_start),
            ).fetchone()

            request_count = int(row["request_count"]) if row else 0
            if request_count >= limit:
                retry_after = max(1, int((reset_at - now).total_seconds()))
                return {
                    "allowed": False,
                    "limit": limit,
                    "remaining": 0,
                    "retry_after": retry_after,
                    "reset_at": reset_at.isoformat(),
                }

            updated_count = request_count + 1
            connection.execute(
                """
                UPDATE request_rate_limits
                SET request_count = ?, updated_at = ?
                WHERE rate_limit_key = ? AND window_start = ?
                """,
                (updated_count, created_at, rate_limit_key, window_start),
            )

        return {
            "allowed": True,
            "limit": limit,
            "remaining": max(0, limit - updated_count),
            "retry_after": 0,
            "reset_at": reset_at.isoformat(),
        }

    def get_available_plans(self) -> list[dict[str, Any]]:
        raw_plans = os.getenv("DEVELOPER_API_PLANS", "")
        if raw_plans:
            try:
                parsed_plans = json.loads(raw_plans)
                if isinstance(parsed_plans, list) and all(isinstance(item, dict) for item in parsed_plans):
                    return parsed_plans
            except json.JSONDecodeError:
                pass

        default_name = globals()["default_plan_name"]()
        return [
            {
                "name": "Free",
                "price_kobo": 0,
                "currency": "NGN",
                "description": "Basic access for small scale discovery and experimentation.",
                "api_call_quota": 100,
                "report_quota": 5,
                "export_enabled": False,
                "bulk_screening_enabled": False,
                "feature_list": [
                    "Discover conviction data with monthly search limits",
                    "Basic developer account and API access",
                    "No export or bulk screening support",
                ],
                "is_free": True,
            },
            {
                "name": default_name,
                "price_kobo": default_plan_amount_kobo(),
                "currency": "NGN",
                "description": "Developer plan for API access, screening reports, and exports.",
                "api_call_quota": 1000,
                "report_quota": 50,
                "export_enabled": True,
                "bulk_screening_enabled": True,
                "feature_list": [
                    "Full paid access to developer API endpoints",
                    "Export search results and screening reports",
                    "Bulk screening support and higher quotas",
                ],
                "is_free": False,
            },
            {
                "name": "Business",
                "price_kobo": int(os.getenv("DEVELOPER_API_BUSINESS_PLAN_AMOUNT_KOBO", "1500000")),
                "currency": "NGN",
                "description": "Higher-usage plan for growing compliance teams.",
                "api_call_quota": 10000,
                "report_quota": 250,
                "export_enabled": True,
                "bulk_screening_enabled": True,
                "feature_list": [
                    "Higher monthly API and report quotas",
                    "Priority support and usage analytics",
                    "Built for teams and mid-market compliance workflows",
                ],
                "is_free": False,
            },
            {
                "name": "Enterprise",
                "price_kobo": int(os.getenv("DEVELOPER_API_ENTERPRISE_PLAN_AMOUNT_KOBO", "5000000")),
                "currency": "NGN",
                "description": "Custom plan with premium support and enterprise features.",
                "api_call_quota": -1,
                "report_quota": -1,
                "export_enabled": True,
                "bulk_screening_enabled": True,
                "feature_list": [
                    "Unlimited quotas with enterprise-level SLAs",
                    "Dedicated onboarding and premium support",
                    "Custom data export and integration support",
                ],
                "is_free": False,
            },
        ]

    def get_plan_by_name(self, plan_name: str) -> dict[str, Any] | None:
        normalized = plan_name.strip().lower()
        for plan in self.get_available_plans():
            if plan["name"].strip().lower() == normalized:
                return plan
        return None

    def get_user_by_id(self, user_id: int) -> SessionUser | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT id, email, created_at FROM developer_users WHERE id = ?",
                (user_id,),
            ).fetchone()

        if row is None:
            return None

        return SessionUser(
            id=row["id"],
            email=row["email"],
            created_at=row["created_at"],
        )

    def create_screening_report(
        self,
        *,
        user_id: int,
        query_name: str,
        query_aliases: list[str],
        query_location: str | None,
        query_reference: str | None,
        status: str,
        confidence: float,
        summary_text: str,
        exact_matches: int,
        possible_matches: int,
        total_matches: int,
        matches: list[dict[str, Any]],
    ) -> str:
        report_id = f"scr_{secrets.token_urlsafe(12)}"
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO screening_reports (
                    report_id, user_id, query_name, query_aliases_json, query_location,
                    query_reference, status, confidence, summary_text,
                    exact_matches, possible_matches, total_matches, matches_json, created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    report_id,
                    user_id,
                    query_name,
                    json.dumps(query_aliases),
                    query_location,
                    query_reference,
                    status,
                    confidence,
                    summary_text,
                    exact_matches,
                    possible_matches,
                    total_matches,
                    json.dumps(matches),
                    now_iso(),
                ),
            )
        return report_id

    def get_screening_report(self, user_id: int, report_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT *
                FROM screening_reports
                WHERE user_id = ? AND report_id = ?
                """,
                (user_id, report_id),
            ).fetchone()

        if row is None:
            return None

        return {
            "report_id": row["report_id"],
            "query": {
                "full_name": row["query_name"],
                "aliases": json.loads(row["query_aliases_json"]),
                "location": row["query_location"],
                "reference": row["query_reference"],
            },
            "status": row["status"],
            "confidence": row["confidence"],
            "summary_text": row["summary_text"],
            "summary": {
                "exact_matches": row["exact_matches"],
                "possible_matches": row["possible_matches"],
                "total_matches": row["total_matches"],
            },
            "matches": json.loads(row["matches_json"]),
            "audit": {
                "created_at": row["created_at"],
                "dataset_version": os.getenv("DATASET_VERSION", now_iso()[:10]),
                "source": "EFCC public convictions dataset",
            },
        }

    def list_screening_reports(self, user_id: int, limit: int = 20) -> list[ScreeningReportRecord]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT report_id, user_id, query_name, query_aliases_json, query_location,
                       query_reference, status, confidence, summary_text,
                       exact_matches, possible_matches, total_matches, created_at
                FROM screening_reports
                WHERE user_id = ?
                ORDER BY id DESC
                LIMIT ?
                """,
                (user_id, limit),
            ).fetchall()

        return [
            ScreeningReportRecord(
                report_id=row["report_id"],
                user_id=row["user_id"],
                query_name=row["query_name"],
                query_aliases=json.loads(row["query_aliases_json"]),
                query_location=row["query_location"],
                query_reference=row["query_reference"],
                status=row["status"],
                confidence=row["confidence"],
                summary_text=row["summary_text"],
                exact_matches=row["exact_matches"],
                possible_matches=row["possible_matches"],
                total_matches=row["total_matches"],
                created_at=row["created_at"],
            )
            for row in rows
        ]


def default_plan_amount_kobo() -> int:
    return int(os.getenv("DEVELOPER_API_PLAN_AMOUNT_KOBO", "500000"))


def default_plan_name() -> str:
    return os.getenv("DEVELOPER_API_PLAN_NAME", "Developer API Monthly")
