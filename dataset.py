"""
Load FraudCheckr's canonical convictions dataset (data/convictions.csv).

The CSV is built by scripts/build_dataset.py from the EFCC source tables in
data/source/. This module only reads it and shapes each row for the API; it does
not re-clean, re-split or de-duplicate records, because the build has already
done that deterministically.
"""

from __future__ import annotations

import csv
from pathlib import Path
from typing import Any

CANONICAL_PATH = Path(__file__).resolve().parent / "data" / "convictions.csv"


def _prison_term_label(custodial_months: str, community_service: str, sentence: str) -> str:
    if custodial_months:
        months = float(custodial_months)
        if months >= 12 and months % 12 == 0:
            years = int(months // 12)
            return f"{years} YEAR{'S' if years != 1 else ''}"
        if months >= 1 and months == int(months):
            return f"{int(months)} MONTH{'S' if months != 1 else ''}"
        weeks = round(months * 4.345)
        return f"{weeks} WEEK{'S' if weeks != 1 else ''}"
    if community_service == "yes":
        return "COMMUNITY SERVICE"
    if sentence:
        return "SEE SENTENCE"
    return "NOT STATED"


def to_api_record(row: dict[str, str]) -> dict[str, Any]:
    """Shape one canonical CSV row into the API's ConvictionRecord fields."""
    months = row.get("custodial_months") or ""
    return {
        # Fields the frontend and API clients already use
        "name": row["name"],
        "offense": row.get("offence") or "NOT STATED",
        "court": row.get("court") or row.get("court_as_recorded") or "NOT STATED",
        "prison_term": _prison_term_label(months, row.get("community_service", ""), row.get("sentence", "")),
        "prison_term_months": int(round(float(months))) if months else None,
        "fine": row.get("fine_naira") or None,
        "restitution": row.get("restitution") or None,
        # Provenance and detail added by the canonical dataset
        "record_id": row["record_id"],
        "aliases": row.get("aliases") or None,
        "defendant_type": row.get("defendant_type") or None,
        "co_defendants": row.get("co_defendants") or None,
        "charge_number": row.get("charge_number") or None,
        "offence_category": row.get("offence_category") or None,
        "court_as_recorded": row.get("court_as_recorded") or None,
        "court_type": row.get("court_type") or None,
        "court_state": row.get("court_state") or None,
        "judge": row.get("judge") or None,
        "date_filed": row.get("date_filed") or None,
        "date_of_conviction": row.get("date_of_conviction") or None,
        "sentence": row.get("sentence") or None,
        "option_of_fine": row.get("option_of_fine") == "yes",
        "forfeiture": row.get("forfeiture") == "yes",
        "source_table": row.get("source_table") or None,
        "source_serial": row.get("source_serial") or None,
        "quality_flags": [f for f in (row.get("quality_flags") or "").split(";") if f],
    }


def load_canonical_records(path: Path = CANONICAL_PATH) -> list[dict[str, Any]]:
    with path.open(encoding="utf-8", newline="") as handle:
        return [to_api_record(row) for row in csv.DictReader(handle)]
