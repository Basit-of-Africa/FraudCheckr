"""Copy the existing SQLite developer data and CSV corpus into Neon once."""

import argparse
import os
import sqlite3
from pathlib import Path

import pandas as pd

from data_cleaning import process_efcc_data
from developer_platform import DeveloperPlatform


DEVELOPER_TABLES = (
    "developer_users",
    "developer_sessions",
    "developer_subscriptions",
    "developer_api_keys",
    "screening_reports",
    "developer_api_usage_windows",
    "request_rate_limits",
    "developer_login_attempt_windows",
)


def ensure_target_is_empty(platform: DeveloperPlatform) -> None:
    tables = (*DEVELOPER_TABLES, "conviction_records")
    with platform._connect() as connection:
        populated_tables = [
            table
            for table in tables
            if connection.execute(f"SELECT COUNT(*) AS total FROM {table}").fetchone()["total"]
        ]

    if populated_tables:
        raise RuntimeError(
            "Neon target is not empty; refusing to merge migration data into: "
            + ", ".join(populated_tables)
        )


def migrate_developer_data(source_path: Path, platform: DeveloperPlatform) -> int:
    if not source_path.exists():
        print(f"SQLite source not found; skipping developer accounts: {source_path}")
        return 0

    source = sqlite3.connect(source_path)
    source.row_factory = sqlite3.Row
    try:
        available_tables = {
            row["name"]
            for row in source.execute(
                "SELECT name FROM sqlite_master WHERE type = 'table'"
            ).fetchall()
        }

        copied_rows = 0
        with platform._connect() as destination:
            for table in DEVELOPER_TABLES:
                if table not in available_tables:
                    continue

                rows = source.execute(f"SELECT * FROM {table}").fetchall()
                if not rows:
                    continue

                columns = rows[0].keys()
                column_sql = ", ".join(columns)
                placeholders = ", ".join("?" for _ in columns)
                insert_sql = (
                    f"INSERT INTO {table} ({column_sql}) VALUES ({placeholders})"
                )
                for row in rows:
                    destination.execute(insert_sql, tuple(row[column] for column in columns))
                copied_rows += len(rows)

            for table in DEVELOPER_TABLES:
                sequence_sql = """
                    SELECT setval(
                        pg_get_serial_sequence(?, 'id'),
                        COALESCE(MAX(id), 1),
                        COUNT(*) > 0
                    )
                    FROM """ + table
                destination.execute(sequence_sql, (table,))

        return copied_rows
    finally:
        source.close()


def load_processed_records(csv_path: Path) -> list[dict]:
    frame = pd.read_csv(csv_path, engine="python")
    return process_efcc_data(frame.to_dict(orient="records"))


def main() -> None:
    project_root = Path(__file__).parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--sqlite-path",
        type=Path,
        default=project_root / "developer_platform.db",
    )
    parser.add_argument(
        "--csv-path",
        type=Path,
        default=project_root / "efcc_convictions_updated.csv",
    )
    arguments = parser.parse_args()

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("Set DATABASE_URL to the Neon connection string before migrating")
    if not arguments.csv_path.exists():
        raise FileNotFoundError(f"Conviction CSV not found: {arguments.csv_path}")

    platform = DeveloperPlatform(database_url=database_url)
    platform.initialize()
    ensure_target_is_empty(platform)

    developer_rows = migrate_developer_data(arguments.sqlite_path, platform)
    conviction_records = load_processed_records(arguments.csv_path)
    platform.replace_conviction_records(conviction_records)

    print(f"Migrated {developer_rows} developer rows")
    print(f"Imported {len(conviction_records)} cleaned conviction records")


if __name__ == "__main__":
    main()