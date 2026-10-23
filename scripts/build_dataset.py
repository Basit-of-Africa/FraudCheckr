"""
Build FraudCheckr's canonical convictions dataset from the EFCC source tables.

Inputs  (data/source/):
    efcc_narrative_2020.csv               EFCC "Narrative of Convictions 2020" (original text)
    efcc_narrative_2021_2024_merged.csv   EFCC narratives 2023, 2022, 2021, 2020*, 2024 joined
                                          (*the 2020 table in this file is corrupted and ignored)

Outputs (data/):
    convictions.csv        one row per convicted defendant; the single source of truth
    excluded_rows.csv      source rows that were dropped, with the reason
    QUALITY_REPORT.md      counts, coverage and flag totals for this build

Run from the repository root:
    python scripts/build_dataset.py          # rebuild
    python scripts/build_dataset.py --check  # verify committed files match a fresh build

The build is deterministic: the same inputs always produce the same output,
including record IDs. It fails loudly if validation checks do not pass.

Deliberately NOT published: nominal complainant (often a victim's name),
correctional facility, expected date of release, and investigating section.
"""

from __future__ import annotations

import csv
import io
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "data" / "source"
OUT_DIR = ROOT / "data"

SOURCE_2020 = SOURCE_DIR / "efcc_narrative_2020.csv"
SOURCE_MERGED = SOURCE_DIR / "efcc_narrative_2021_2024_merged.csv"

# Column positions in every EFCC narrative table.
C_SN, C_NAME, C_CHARGE, C_OFFENCE, C_COURT, C_JUDGE, C_FILED, C_CONVICTED, C_SENTENCE = range(9)
C_ZONE = 11

# How each table wrote its dates (verified against the data; see QUALITY_REPORT.md).
#   slash: order used by dd/mm/yyyy-style strings
#   iso_swapped: True when a spreadsheet tool misread day-first strings as month-first,
#                so "2023-08-02" in the file really means 8 February 2023.
TABLE_DATE_RULES = {
    2020: {"slash": "mdy", "iso_swapped": False},
    2021: {"slash": "mdy", "iso_swapped": False},
    2022: {"slash": "mdy", "iso_swapped": False},
    2023: {"slash": "dmy", "iso_swapped": True},
    2024: {"slash": "dmy", "iso_swapped": True},
}

OUTPUT_COLUMNS = [
    "record_id",
    "name",
    "aliases",
    "defendant_type",
    "co_defendants",
    "charge_number",
    "offence",
    "offence_category",
    "court",
    "court_as_recorded",
    "court_type",
    "court_state",
    "judge",
    "date_filed",
    "date_of_conviction",
    "conviction_date_precision",
    "sentence",
    "custodial_months",
    "community_service",
    "option_of_fine",
    "fine_naira",
    "restitution",
    "forfeiture",
    "efcc_zone",
    "source_table",
    "source_serial",
    "quality_flags",
]

NULL_TOKENS = {"", "N/A", "NA", "N.A", "NIL", "NILL", "NONE", "NULL", "-", "--", "NOT APPLICABLE", "NAN", "0"}

# --------------------------------------------------------------------------- #
# Generic helpers
# --------------------------------------------------------------------------- #


def clean(value: str | None) -> str:
    """Collapse PDF line breaks and repeated spaces; upper-case."""
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value)).strip().upper()


def nullish(value: str) -> bool:
    return clean(value).strip(" .,") in NULL_TOKENS


def read_tables(path: Path) -> list[list[list[str]]]:
    """Split a narrative CSV into tables, one per 'S/N' header row."""
    with path.open(encoding="utf-8", newline="") as handle:
        rows = list(csv.reader(handle))
    tables: list[list[list[str]]] = []
    current = None
    for row in rows:
        if row and row[0].strip().upper() == "S/N":
            current = []
            tables.append(current)
            continue
        if current is None or not any(cell.strip() for cell in row):
            continue
        current.append(row + [""] * (14 - len(row)))
    return tables


# --------------------------------------------------------------------------- #
# Dates
# --------------------------------------------------------------------------- #

MONTHS = {
    m: i
    for i, names in enumerate(
        [
            ("JAN", "JANUARY"), ("FEB", "FEBRUARY"), ("MAR", "MARCH"), ("APR", "APRIL"),
            ("MAY",), ("JUN", "JUNE"), ("JUL", "JULY"), ("AUG", "AUGUST"),
            ("SEP", "SEPT", "SEPTEMBER"), ("OCT", "OCTOBER"), ("NOV", "NOVEMBER"), ("DEC", "DECEMBER"),
        ],
        start=1,
    )
    for m in names
}
MONTH_RE = "|".join(sorted(MONTHS, key=len, reverse=True))


def _safe_date(y: int, m: int, d: int) -> date | None:
    try:
        return date(y, m, d)
    except ValueError:
        return None


def parse_date(raw: str, rules: dict) -> tuple[str, str, list[str]]:
    """
    Returns (iso_date_or_empty, precision, flags).
    precision is one of: day, month, year, none.
    rules: {"slash": "dmy"|"mdy", "iso_swapped": bool, "uncertain": bool}
    """
    text = clean(raw)
    flags: list[str] = []
    if nullish(text):
        return "", "none", flags

    # Excel serial number (e.g. 45564)
    if re.fullmatch(r"\d{5}", text):
        d = date(1899, 12, 30) + timedelta(days=int(text))
        return d.isoformat(), "day", ["date_from_spreadsheet_serial"]

    # ISO, possibly with a time part
    m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})(?: 00:00:00)?", text)
    if m:
        y, a, b = int(m[1]), int(m[2]), int(m[3])
        if rules["iso_swapped"] and b <= 12:
            d = _safe_date(y, b, a)
            if a != b:
                flags.append("date_day_month_corrected")
        else:
            d = _safe_date(y, a, b)
        if rules.get("uncertain") and a != b and a <= 12 and b <= 12:
            flags.append("date_order_uncertain")
        return (d.isoformat(), "day", flags) if d else ("", "none", ["date_unparseable"])

    # Slash / dot / dash with a 4-digit year
    m = re.fullmatch(r"(\d{1,2})\s*[/.\-]\s*(\d{1,2})\s*[/.\-]\s*(\d{4}|\d{2})", text)
    if m:
        a, b, y = int(m[1]), int(m[2]), int(m[3])
        if y < 100:
            y += 2000
        if a > 12 and b <= 12:
            d = _safe_date(y, b, a)
            if rules["slash"] == "mdy":
                flags.append("date_order_differs_from_table")
        elif b > 12 and a <= 12:
            d = _safe_date(y, a, b)
            if rules["slash"] == "dmy":
                flags.append("date_order_differs_from_table")
        elif rules["slash"] == "dmy":
            d = _safe_date(y, b, a)
        else:
            d = _safe_date(y, a, b)
        if rules.get("slash_uncertain") and a != b and a <= 12 and b <= 12:
            flags.append("date_order_uncertain")
        return (d.isoformat(), "day", flags) if d else ("", "none", ["date_unparseable"])

    # Written dates: "27TH APRIL, 2023", "JUNE 21ST 2024", "21 JUNE 2024"
    t = text.replace(",", " ").replace(".", " ")
    t = re.sub(r"(\d+)(ST|ND|RD|TH)\b", r"\1", t)
    t = re.sub(r"\s+", " ", t).strip()
    m = re.fullmatch(rf"(\d{{1,2}}) (?:OF )?({MONTH_RE}) (\d{{4}})", t)
    if m:
        d = _safe_date(int(m[3]), MONTHS[m[2]], int(m[1]))
        return (d.isoformat(), "day", flags) if d else ("", "none", ["date_unparseable"])
    m = re.fullmatch(rf"({MONTH_RE}) (\d{{1,2}}) (\d{{4}})", t)
    if m:
        d = _safe_date(int(m[3]), MONTHS[m[1]], int(m[2]))
        return (d.isoformat(), "day", flags) if d else ("", "none", ["date_unparseable"])
    m = re.fullmatch(rf"({MONTH_RE}) (\d{{4}})", t)
    if m:
        return f"{int(m[2]):04d}-{MONTHS[m[1]]:02d}", "month", flags
    m = re.fullmatch(r"(\d{4})", t)
    if m:
        return m[1], "year", flags
    return "", "none", ["date_unparseable"]


def zone_key(raw: str) -> str:
    z = clean(raw).replace(" ", "")
    return {"HQ": "HEADQUARTERS", "ABUJAZC": "ABUJA"}.get(z, z)


def _median(values: list[float]) -> float | None:
    values = sorted(values)
    if not values:
        return None
    mid = len(values) // 2
    return values[mid] if len(values) % 2 else (values[mid - 1] + values[mid]) / 2


def decide_date_rules(year: int, rows: list[list[str]]) -> tuple[list[dict], list[dict]]:
    """
    Different EFCC zones compiled their tables differently, and a spreadsheet tool
    later converted some day-first dates as if they were month-first. Decide, for
    each contiguous block of rows from one zone, how to read its dates:

      * slash order: from unambiguous text dates in the block (first or second part > 12)
      * ISO swap:    whether ISO dates sit closer to nearby unambiguous dates, and run
                     more smoothly in row order, when day and month are swapped

    Returns (rules per row, decision log per block).
    """
    default = TABLE_DATE_RULES[year]
    blocks: list[tuple[int, int, str]] = []
    start = 0
    for i in range(1, len(rows) + 1):
        if i == len(rows) or zone_key(rows[i][C_ZONE]) != zone_key(rows[start][C_ZONE]):
            blocks.append((start, i, zone_key(rows[start][C_ZONE])))
            start = i

    def slash_votes(block_rows):
        dmy = mdy = 0
        for r in block_rows:
            for col in (C_FILED, C_CONVICTED):
                m = re.fullmatch(r"(\d{1,2})\s*[/.\-]\s*(\d{1,2})\s*[/.\-]\s*\d{2,4}", clean(r[col]))
                if m:
                    a, b = int(m[1]), int(m[2])
                    dmy += a > 12 and b <= 12
                    mdy += b > 12 and a <= 12
        return dmy, mdy

    # Table-level evidence, used for blocks too small to judge on their own
    t_dmy, t_mdy = slash_votes(rows)
    table_slash = default["slash"]
    if t_dmy + t_mdy >= 3 and max(t_dmy, t_mdy) / (t_dmy + t_mdy) >= 0.8:
        table_slash = "dmy" if t_dmy > t_mdy else "mdy"
    table_iso = [
        int(m[3]) for r in rows
        if (m := re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})(?: 00:00:00)?", clean(r[C_CONVICTED])))
    ]
    table_iso_genuine = bool(table_iso) and sum(d > 12 for d in table_iso) / len(table_iso) > 0.05

    per_row: list[dict] = [dict(default) for _ in rows]
    log: list[dict] = []
    for lo, hi, zone in blocks:
        block = rows[lo:hi]

        # Slash order from unambiguous text dates
        dmy_votes, mdy_votes = slash_votes(block)
        votes = dmy_votes + mdy_votes
        if votes >= 3 and max(dmy_votes, mdy_votes) / votes >= 0.8:
            slash = "dmy" if dmy_votes > mdy_votes else "mdy"
            slash_uncertain = False
        elif votes < 3:
            slash, slash_uncertain = table_slash, False
        else:
            slash, slash_uncertain = default["slash"], True

        # ISO swap: evidence from conviction dates
        iso_rows = {}
        anchors = {}
        for i, r in enumerate(block):
            text = clean(r[C_CONVICTED])
            m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})(?: 00:00:00)?", text)
            if m:
                iso_rows[i] = (int(m[1]), int(m[2]), int(m[3]))
                continue
            iso, precision, _flags = parse_date(text, {"slash": slash, "iso_swapped": False})
            if precision != "day" or re.fullmatch(r"\d{5}", text):
                continue
            parts = re.match(r"(\d{1,2})\s*[/.\-]\s*(\d{1,2})\s*[/.\-]", text)
            if parts and int(parts[1]) <= 12 and int(parts[2]) <= 12:
                continue  # ambiguous slash date: not an anchor
            anchors[i] = date.fromisoformat(iso)

        decision, reason = default["iso_swapped"], "table default"
        uncertain = False
        if iso_rows and len(iso_rows) < 8 and table_iso_genuine:
            decision, reason = False, "small block; whole table's ISO dates include days > 12, so they are genuine"
        elif iso_rows:
            day_gt_12 = sum(1 for (_y, _m, d) in iso_rows.values() if d > 12)
            if day_gt_12 / len(iso_rows) > 0.05:
                decision, reason = False, f"{day_gt_12} ISO dates have day > 12, so they are genuine"
            else:
                def scores(swap: bool):
                    resolved = {}
                    for i, (y, a, b) in iso_rows.items():
                        resolved[i] = _safe_date(y, b, a) if swap else _safe_date(y, a, b)
                    anchor_gaps = []
                    for i, d in resolved.items():
                        near = [anchors[j] for j in range(i - 3, i + 4) if j in anchors]
                        if d and near:
                            anchor_gaps.append(min(abs((d - n).days) for n in near))
                    sequence = [resolved.get(i) or anchors.get(i) for i in range(len(block))]
                    sequence = [d for d in sequence if d]
                    seq_gaps = [abs((b2 - a2).days) for a2, b2 in zip(sequence, sequence[1:])]
                    return _median(anchor_gaps), len(anchor_gaps), _median(seq_gaps)

                a_keep, n_anchor, s_keep = scores(False)
                a_swap, _, s_swap = scores(True)
                if n_anchor >= 5 and a_keep is not None and a_swap is not None and min(a_keep, a_swap) < 0.7 * max(a_keep, a_swap):
                    decision = a_swap < a_keep
                    reason = f"anchor gap median {a_keep} as written vs {a_swap} swapped ({n_anchor} anchors)"
                elif len(iso_rows) >= 8 and s_keep is not None and s_swap is not None and min(s_keep, s_swap) < 0.7 * max(s_keep, s_swap):
                    decision = s_swap < s_keep
                    reason = f"row-order gap median {s_keep} as written vs {s_swap} swapped"
                else:
                    uncertain = True
                    reason = "evidence inconclusive; table default used and ambiguous dates flagged"

        rules = {"slash": slash, "slash_uncertain": slash_uncertain, "iso_swapped": decision, "uncertain": uncertain}
        for i in range(lo, hi):
            per_row[i] = rules
        log.append({
            "table": year, "zone": zone or "(blank)", "rows": hi - lo, "slash_order": slash,
            "slash_votes": f"{dmy_votes} day-first / {mdy_votes} month-first", "iso_dates": len(iso_rows),
            "iso_swapped": decision, "reason": reason if iso_rows else "no ISO dates in block",
        })
    return per_row, log


# --------------------------------------------------------------------------- #
# Names
# --------------------------------------------------------------------------- #

ORG_WORDS = re.compile(
    r"\b(LTD|LIMITED|PLC|INC|ENTERPRISES?|VENTURES?|COMPANY|CO\.|NIG(ERIA)?\s+(LTD|LIMITED)|"
    r"SERVICES|GLOBAL|RESOURCES|INVESTMENTS?|CONCEPTS?|INTERNATIONAL|INT'?L|HOLDINGS|"
    r"ASSOCIATES|CONSTRUCTION|AGENCY|FOUNDATION|BUREAU|ENERGY|OIL\s+AND\s+GAS|PETROLEUM|"
    r"TRADING|SOLUTIONS|NIGERIA\s+LTD|MICROFINANCE|BANK)\b"
)
# Runs after "A.K.A"-style markers are normalised to the word AKA. Word boundaries
# stop it matching inside names such as AKANBI or ABUBAKAR.
ALIAS_RE = re.compile(r"\s*\(?\s*\b(?:AKA|ALSO KNOWN AS|ALIAS)\b\s*[:\-]?\s*(?P<alias>.+?)\s*\)?\s*$")
_NUMW = r"\d+|ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN"
_OTHERS = r"ORS|0RS|ORTHERS|OTHERS?|OR|ANORS?|ANOTHER"
UNNAMED_CO_DEF = re.compile(
    rf"(?:\s*(?:&|,|\bAND\b)\s*(?P<n1>{_NUMW})?\s*\b(?:{_OTHERS})\b\.?"   # "& ORS", "AND 2 OTHERS"
    rf"|\s+(?P<n2>{_NUMW})\s+(?:{_OTHERS})\b\.?"                          # "X 3 ORS"
    rf"|\s*&\s*(?P<n3>\d+))\s*$"                                          # "X & 5"
)
PREFIX_RE = re.compile(r"^(?:FRN|F\.R\.N\.?|FEDERAL REPUBLIC OF NIGERIA|THE STATE|STATE|COP|IGP)\s*(?:V\.?|VS\.?|VERSUS)\s*", re.I)
WORD_NUM = {"ONE": 1, "TWO": 2, "THREE": 3, "FOUR": 4, "FIVE": 5, "SIX": 6, "SEVEN": 7, "EIGHT": 8, "NINE": 9, "TEN": 10}


def split_names(raw: str) -> tuple[list[tuple[str, list[str]]], int, list[str]]:
    """
    Returns ([(name, aliases), ...], unnamed_co_defendant_count, flags).
    Only splits when every resulting part looks like a full name.
    """
    flags: list[str] = []
    text = clean(raw)
    text = PREFIX_RE.sub("", text).strip(" .,;")
    text = text.replace("’", "'")

    # Normalise alias markers ("A.K.A", "A,K,A", "A/K/A") to a single token first,
    # so the comma inside "A,K,A" is not mistaken for a name separator.
    text = re.sub(r"\bA\s*[.,/]\s*K\s*[.,/]\s*A\b\.?", " AKA ", text)
    text = re.sub(r"\s+", " ", text).strip()

    unnamed = 0
    m = UNNAMED_CO_DEF.search(text)
    if m and m.start() > 0:
        count = m.group("n1") or m.group("n2") or m.group("n3")
        unnamed = int(count) if count and count.isdigit() else WORD_NUM.get(count or "", 1)
        text = text[: m.start()].strip(" ,;&")
        flags.append("unnamed_co_defendants")

    looks_like_name = lambda p: len(p.split()) >= 2 or bool(ORG_WORDS.search(p))

    # Numbered lists ("(1) A (2) B", "1. A 2. B", "A 2. B") always mark separate defendants.
    segments = [
        s.strip(" .,;&")
        for s in re.split(r"\(\s*\d{1,2}\s*\)|(?:^|(?<=\s))\d{1,2}\s*\.(?=\s*[A-Z])|(?<=[A-Z])\d{1,2}\s*\.(?=\s*[A-Z])", text)
        if s.strip(" .,;&")
    ]
    if len(segments) > 1:
        flags.append("numbered_defendant_list")

    names: list[str] = []
    for seg in segments:
        parts = [p.strip(" .,") for p in re.split(r"\s*[;,&]\s*|\s+AND\s+", seg) if p.strip(" .,")]
        # An alias marker belongs to the part before it; keep those joined.
        if len(parts) > 1 and all(looks_like_name(p) or p.startswith("AKA ") for p in parts) and not any(
            p.startswith("AKA ") for p in parts
        ):
            names += parts
        else:
            names.append(seg)
            if len(parts) > 1:
                flags.append("multiple_names_unsplit")

    result = []
    for n in names:
        aliases: list[str] = []
        am = ALIAS_RE.search(n)
        if am and am.start() > 0:
            aliases = [a.strip(" .,()") for a in re.split(r"\s*(?:/|;|\bAKA\b)\s*", am.group("alias")) if a.strip(" .,()")]
            n = n[: am.start()]
        n = re.sub(r"\s+", " ", n).strip(" .,()")
        if n:
            result.append((n, aliases))
    return result, unnamed, flags


# --------------------------------------------------------------------------- #
# Charge numbers, offences, courts, judges
# --------------------------------------------------------------------------- #


def clean_charge_number(raw: str) -> str:
    text = clean(raw)
    if nullish(text):
        return ""
    # PDF extraction inserts spaces where cells wrapped ("FHC/EN/CR/1 56/2021")
    return re.sub(r"\s+", "", text).strip(".,")


OFFENCE_CATEGORIES = [
    ("Money laundering", r"LAU?N?DER|PROCEEDS|NOMINEE"),
    ("Bribery and corruption", r"BRIBE|CORRUPT|GRATIFICATION|ABUSE OF OFFICE|INFLATION OF CONTRACT"),
    ("Illegal oil bunkering / petroleum", r"BUNKER|PETROLEUM|CRUDE|AGO\b|PMS\b|DIESEL|ILLEGAL DEALING IN PETROLEUM"),
    ("Illegal mining", r"MIN+ING|MINERAL"),
    ("Currency and foreign-exchange offences", r"NAIRA|CURRENCY|DOLLAR|MUTILAT|TAMPER|HAWKING|SPRAYING|FOREIGN EXCHANGE|FOREX|BDC|BU?REAU ?DE ?CHANGE|TRADING OF NOTES"),
    ("Forgery and fraudulent documents", r"FORG|UTTER|FRAUDULENT DOCUMENT|FALSE DOCUMENT|FAKE DOCUMENT|DOCUMENTS? CONTAINING|COUNTERFEIT"),
    ("Impersonation", r"IMP?E?R?S[O0]N|PERSONAT|IMPESON"),
    ("Cybercrime / internet fraud", r"CYBER|INTERNET|COMPUTER|ONLINE|CRF\b|IDENTITY THEFT|ROMANCE|PHISH|HACK|BEC\b"),
    ("Obtaining by false pretence / advance fee fraud", r"PRETE?N|OBT\b|O\.B\.T|ADVANCE FEE|AFF\b|419"),
    ("Cheating", r"CHEAT"),
    ("Stealing / theft / breach of trust", r"STEAL|STOLEN|THEFT|BR[AE]+CH OF TRUST|CBT\b|CONVERSION|MIS+APPROPRIAT|EMBEZZL|DIVERSION|UNA?U?TH?ORI[SZ]ED WITHDRAWAL"),
    ("Conspiracy", r"CONSPIRA"),
    ("Electoral offences", r"VOTE BUY|VOTE SELL|ELECTORAL"),
    ("Tax and customs", r"\bTAX|CUSTOMS|DUTY|SMUGGL"),
    ("Issuance of dud cheque", r"DUD CHEQUE|DUD CHECK|CHEQUE"),
    ("Other fraud", r"FRAUD|DECEIT|DECEPTION|SCAM"),
]


def categorise_offence(offence: str) -> str:
    if not offence:
        return "Not stated"
    for label, pattern in OFFENCE_CATEGORIES:
        if re.search(pattern, offence):
            return label
    return "Other"


STATE_BY_PLACE = {
    # FCT
    "ABUJA": "FCT", "FCT": "FCT", "MAITAMA": "FCT", "KUBWA": "FCT", "BWARI": "FCT", "APO": "FCT", "JABI": "FCT",
    "GWAGWALADA": "FCT", "GWAGWALA DA": "FCT", "GWD": "FCT", "KWALI": "FCT", "KUJE": "FCT", "NYANYA": "FCT",
    "JIKWOYI": "FCT", "KURUDU": "FCT", "ZUBA": "FCT", "WUSE": "FCT", "GARKI": "FCT", "LUGBE": "FCT", "ABJ": "FCT",
    "KARU": "FCT", "MPAPE": "FCT", "AZHATA": "FCT", "MATAMA": "FCT", "NYAYA": "FCT", "LIFE CAMP": "FCT",
    # States and principal court towns
    "LAGOS": "Lagos", "IKEJA": "Lagos", "IKOYI": "Lagos", "IGBOSERE": "Lagos", "TAFAWA BALEWA SQUARE": "Lagos",
    "BENIN": "Edo", "EDO": "Edo", "AUCHI": "Edo",
    "ENUGU": "Enugu", "NSUKKA": "Enugu",
    "AWKA": "Anambra", "ANAMBRA": "Anambra", "ONITSHA": "Anambra",
    "ABEOKUTA": "Ogun", "OGUN": "Ogun", "IJEBU": "Ogun", "SAGAMU": "Ogun", "OTA": "Ogun",
    "IBADAN": "Oyo", "OYO": "Oyo", "OGBOMOSO": "Oyo",
    "ILORIN": "Kwara", "KWARA": "Kwara",
    "PORT HARCOURT": "Rivers", "PH": "Rivers", "RIVERS": "Rivers",
    "ASABA": "Delta", "WARRI": "Delta", "DELTA": "Delta", "EFFURUN": "Delta",
    "KADUNA": "Kaduna", "ZARIA": "Kaduna",
    "KANO": "Kano", "GOMBE": "Gombe", "UYO": "Akwa Ibom", "AKWA IBOM": "Akwa Ibom",
    "MAIDUGURI": "Borno", "BORNO": "Borno", "SOKOTO": "Sokoto", "MAKURDI": "Benue", "BENUE": "Benue",
    "OSOGBO": "Osun", "OSHOGBO": "Osun", "OSUN": "Osun", "ILESA": "Osun",
    "AKURE": "Ondo", "ONDO": "Ondo", "ADO EKITI": "Ekiti", "ADO-EKITI": "Ekiti", "EKITI": "Ekiti",
    "LOKOJA": "Kogi", "KOGI": "Kogi", "JOS": "Plateau", "PLATEAU": "Plateau", "LAFIA": "Nasarawa",
    "NASARAWA": "Nasarawa", "YOLA": "Adamawa", "ADAMAWA": "Adamawa", "BAUCHI": "Bauchi", "MINNA": "Niger",
    "NIGER": "Niger", "JALINGO": "Taraba", "TARABA": "Taraba", "DAMATURU": "Yobe", "YOBE": "Yobe",
    "DUTSE": "Jigawa", "JIGAWA": "Jigawa", "KATSINA": "Katsina", "GUSAU": "Zamfara", "ZAMFARA": "Zamfara",
    "BIRNIN KEBBI": "Kebbi", "KEBBI": "Kebbi", "CALABAR": "Cross River", "CROSS RIVER": "Cross River",
    "OWERRI": "Imo", "IMO": "Imo", "UMUAHIA": "Abia", "ABA": "Abia", "ABIA": "Abia", "ABAKALIKI": "Ebonyi",
    "EBONYI": "Ebonyi", "YENAGOA": "Bayelsa", "BAYELSA": "Bayelsa",
}
PLACE_RE = re.compile(r"\b(" + "|".join(sorted(map(re.escape, STATE_BY_PLACE), key=len, reverse=True)) + r")\b")
STATE_CAPITAL = {
    "FCT": "Abuja", "Lagos": "Lagos", "Edo": "Benin", "Enugu": "Enugu", "Anambra": "Awka", "Ogun": "Abeokuta",
    "Oyo": "Ibadan", "Kwara": "Ilorin", "Rivers": "Port Harcourt", "Delta": "Asaba", "Kaduna": "Kaduna",
    "Kano": "Kano", "Gombe": "Gombe", "Akwa Ibom": "Uyo", "Borno": "Maiduguri", "Sokoto": "Sokoto",
    "Benue": "Makurdi", "Osun": "Osogbo", "Ondo": "Akure", "Ekiti": "Ado-Ekiti", "Kogi": "Lokoja",
    "Plateau": "Jos", "Nasarawa": "Lafia", "Adamawa": "Yola", "Bauchi": "Bauchi", "Niger": "Minna",
    "Taraba": "Jalingo", "Yobe": "Damaturu", "Jigawa": "Dutse", "Katsina": "Katsina", "Zamfara": "Gusau",
    "Kebbi": "Birnin Kebbi", "Cross River": "Calabar", "Imo": "Owerri", "Abia": "Umuahia", "Ebonyi": "Abakaliki",
    "Bayelsa": "Yenagoa",
}


def court_type_of(text: str) -> str:
    if re.search(r"\bF\.?\s?H\.?\s?C(?:\b|\d)|\bFCH\b|FEDERAL HIGH|FED\.? HIGH", text):
        return "Federal High Court"
    if re.search(r"\bFCT\b|\bF\.C\.T\b|MAITAMA|MATAMA|KUBWA|BWARI|GWAGWALA|KWALI|KUJE|NYANYA|NYAYA|JIKWOYI|KURUDU|APO\b|JABI|ZUBA|LIFE CAMP", text):
        return "FCT High Court"
    if re.search(r"SPECIAL OFFENCES", text):
        return "Special Offences Court (Lagos)"
    if re.search(r"MAGISTRATE|\bMC\b|CHIEF MAG", text):
        return "Magistrate Court"
    if re.search(r"COURT OF APPEAL|SUPREME", text):
        return "Appellate court"
    if re.search(r"NATIONAL INDUSTRIAL", text):
        return "National Industrial Court"
    if re.search(r"SHARIA|CUSTOMARY|AREA COURT", text):
        return "Sharia / customary / area court"
    if re.search(r"\bS\.?H\.?C\b|\bSHB\b|\bLSHC\b|H[IO]G[HN] COURT|\bH\.?C\.?T?(?:\b|\d|NO)|\bHC\d|HIGH CT|STATE HC|VA?C?OCATION COURT", text):
        return "State High Court"
    return ""


def place_of(text: str) -> tuple[str, str]:
    """Return (place, state) for the most specific place named in a court string."""
    m = PLACE_RE.search(text)
    if not m:
        return "", ""
    place = m.group(1)
    state = STATE_BY_PLACE[place]
    if place in {"ABJ", "FCT", "PH", "GWD", "GWAGWALA DA"}:
        place = {"ABJ": "ABUJA", "FCT": "ABUJA", "PH": "PORT HARCOURT", "GWD": "GWAGWALADA", "GWAGWALA DA": "GWAGWALADA"}[place]
    return place.title(), state


def charge_prefix(charge: str) -> str:
    """e.g. 'FHC/IL/106C/2022' -> 'FHC/IL'; 'KWS/45C/2020' -> 'KWS'."""
    if not charge:
        return ""
    parts = charge.split("/")
    if parts[0] == "FHC" and len(parts) > 1 and re.fullmatch(r"[A-Z]{1,4}", parts[1]):
        return f"FHC/{parts[1]}"
    if re.fullmatch(r"[A-Z]{2,5}", parts[0]):
        return parts[0]
    return ""


def clean_judge(raw: str) -> str:
    text = clean(raw)
    if nullish(text):
        return ""
    text = re.sub(r"^(HON\.?\s*)?(JUSTICE|JUST\.|J\.)\s*", "", text)
    text = re.sub(r"^HON\.?\s*", "", text)
    text = text.strip(" .,")
    return f"JUSTICE {text}" if text else ""


# --------------------------------------------------------------------------- #
# Sentences
# --------------------------------------------------------------------------- #

NUM_WORDS = {
    "ONE": 1, "TWO": 2, "THREE": 3, "FOUR": 4, "FIVE": 5, "SIX": 6, "SEVEN": 7, "EIGHT": 8, "NINE": 9,
    "TEN": 10, "ELEVEN": 11, "TWELVE": 12, "THIRTEEN": 13, "FOURTEEN": 14, "FIFTEEN": 15, "SIXTEEN": 16,
    "SEVENTEEN": 17, "EIGHTEEN": 18, "NINETEEN": 19, "TWENTY": 20, "TWENTY-ONE": 21, "TWENTY ONE": 21,
    "TWENTY-FIVE": 25, "TWENTY FIVE": 25, "THIRTY": 30, "FORTY": 40, "FIFTY": 50, "A": 1, "AN": 1, "I": 1,
}
NUM_RE = r"(\d+(?:\.\d+)?|" + "|".join(sorted(map(re.escape, NUM_WORDS), key=len, reverse=True)) + r")"
TERM_RE = re.compile(
    NUM_RE + r"\s*(?:\(\s*(\d+)\s*\)\s*)?(YEARS?|YRS?|MONTHS?|MONTH'S|MNTHS?|WEEKS?|DAYS?)\b"
)
AMOUNT_RE = re.compile(
    r"(?P<cur>N|₦|#|NGN|\$|USD|US\$|£|GBP|€|EUR)?\s*(?P<num>\d{1,3}(?:(?:,\s?|\s)\d{3})+(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)"
    r"\s*(?P<mult>MILLION|M\b|K\b)?\s*(?P<cur2>NAIRA|USD|DOLLARS?|POUNDS?|EUROS?)?"
)
WORD_AMOUNTS = [
    (r"ONE MILLION", 1_000_000), (r"TWO MILLION", 2_000_000), (r"FIVE MILLION", 5_000_000),
    (r"ONE HUNDRED AND FIFTY THOUSAND", 150_000), (r"TWO HUNDRED AND FIFTY THOUSAND", 250_000),
    (r"FIVE HUNDRED THOUSAND", 500_000), (r"THREE HUNDRED THOUSAND", 300_000), (r"TWO HUNDRED THOUSAND", 200_000),
    (r"ONE HUNDRED THOUSAND", 100_000), (r"FIFTY THOUSAND", 50_000), (r"TWENTY THOUSAND", 20_000),
    (r"TWENTY[- ]FIVE THOUSAND", 25_000), (r"TEN THOUSAND", 10_000),
]


def _to_number(token: str) -> float | None:
    token = token.strip()
    if re.fullmatch(r"\d+(?:\.\d+)?", token):
        return float(token)
    return NUM_WORDS.get(token)


def parse_sentence(raw: str, table_year: int) -> dict:
    text = clean(raw)
    out = {
        "sentence": text if not nullish(text) else "",
        "custodial_months": "",
        "community_service": "",
        "option_of_fine": "",
        "fine_naira": "",
        "restitution": "",
        "forfeiture": "",
        "flags": [],
    }
    if not out["sentence"]:
        out["flags"].append("sentence_missing")
        return out

    # 2023 table shorthand: "10 YEARS/10,000" (custodial / fine)
    shorthand = re.fullmatch(r"(.+?)\s*/\s*([\d,\.]+)", text)
    working = text
    shorthand_fine = None
    if shorthand and TERM_RE.search(shorthand.group(1)):
        working = shorthand.group(1)
        shorthand_fine = shorthand.group(2)

    # Custodial terms (ignore those that are community service)
    custodial = []
    community = False
    for m in TERM_RE.finditer(working):
        after = working[m.end(): m.end() + 40]
        before = working[max(0, m.start() - 15): m.start()]
        value = _to_number(m.group(1))
        paren = m.group(2)
        if value is None:
            continue
        if paren and float(paren) != value:
            out["flags"].append("sentence_number_conflict")
        unit = m.group(3)
        months = value * 12 if unit.startswith("Y") else value if unit.startswith("M") else value / 4.345 if unit.startswith("W") else value / 30.44
        if re.search(r"COMMUNITY|NON[- ]?CUSTODIAL", after[:30]):
            community = True
            continue
        if re.search(r"PROBATION|SUSPENDED|AFTER|WITHIN|DAYS? OF", after[:20] + before):
            continue
        if re.search(r"TOTAL", before) and re.search(r"CONCURRENT", text):
            # "7 years on each count, totalling 175 years, to run concurrently"
            out["flags"].append("concurrent_total_ignored")
            continue
        custodial.append(months)
    if re.search(r"COMMUNITY SERVICE|NON[- ]?CUSTODIAL", text):
        community = True
    if re.search(r"\bLIFE\b", text):
        out["flags"].append("life_sentence")
    if re.search(r"SUSPENDED", text):
        out["flags"].append("suspended_sentence")
    if re.search(r"ACQUIT|DISCHARGED AND|DISCHARGED &|STRUCK OUT|NOT GUILTY", text):
        # The source table lists this as a conviction, but the text mentions an acquittal or discharge.
        out["flags"].append("sentence_mentions_acquittal_or_discharge")
    if custodial and max(custodial) > 12 * 50:
        # Almost certainly a typo in the source (e.g. "110 YEARS"); do not guess.
        out["flags"].append("custodial_term_implausible")
        custodial = []
    if custodial:
        out["custodial_months"] = str(round(max(custodial), 1)).removesuffix(".0")
        if len(set(custodial)) > 1:
            out["flags"].append("multiple_terms_max_used")
    out["community_service"] = "yes" if community else "no"

    # Fine / option of fine
    has_option = bool(
        re.search(r"OPTION|\bOR\s+(?:TO\s+)?(?:PAY(?:MENT)?\s+(?:OF\s+)?)?(?:A\s+)?(?:FINE|N\s?\d|#|₦|\d)|IN LIEU", text)
    ) or bool(shorthand_fine)
    if re.search(r"\bNO\s+OPTION|WITHOUT\s+(?:AN?\s+|THE\s+)?OPTION", text) and not re.search(r"\bWITH\s+(?:AN?\s+)?OPTION", text):
        has_option = False
    out["option_of_fine"] = "yes" if has_option else "no"

    fines: list[float] = []
    restitutions: list[str] = []
    for m in AMOUNT_RE.finditer(text):
        cur = (m.group("cur") or "") + (m.group("cur2") or "")
        num_text = m.group("num").replace(",", "").replace(" ", "")
        try:
            amount = float(num_text)
        except ValueError:
            continue
        if m.group("mult") in ("MILLION", "M"):
            amount *= 1_000_000
        elif m.group("mult") == "K":
            amount *= 1_000
        context_before = text[max(0, m.start() - 60): m.start()]
        context_after = text[m.end(): m.end() + 12]
        is_foreign = bool(re.search(r"\$|USD|DOLLAR|£|GBP|POUND|€|EUR", cur + context_after[:8]))
        is_naira = bool(re.search(r"N|₦|#|NGN|NAIRA", cur)) or "NAIRA" in context_after
        # Skip things that are clearly not money: years, term lengths, counts, IMEI etc.
        if not cur and not re.search(r"NAIRA", context_after) and amount < 1000:
            continue
        if re.search(r"(YEARS?|MONTHS?|WEEKS?|DAYS?|COUNTS?)\b", context_after[:8]):
            continue
        if re.search(r"IMEI|CHAS+IS|NO[:.]?\s*$|PLATE|REG", context_before[-14:]):
            continue
        last_rest = max((x.end() for x in re.finditer(r"RESTITU|REFUND|PAY BACK|COMPENSAT", context_before)), default=-1)
        last_fine = max((x.end() for x in re.finditer(r"FINE|OPTION|\bOR\b|IN LIEU", context_before)), default=-1)
        if last_rest > last_fine or (last_rest == last_fine == -1 and re.search(r"TO (?:THE )?VICTIM", context_after + text[m.end(): m.end() + 30])):
            label = ("USD " if is_foreign else "NGN ") + f"{amount:,.2f}".removesuffix(".00")
            restitutions.append(label)
            continue
        if is_foreign:
            continue
        if re.search(r"FINE|OPTION|\bOR\b|PAY|IN LIEU", context_before[-40:]) or is_naira:
            fines.append(amount)
    for pattern, value in WORD_AMOUNTS:
        if re.search(pattern + r"\s*NAIRA", text) and value not in fines and not re.search(r"RESTITU", text):
            fines.append(float(value))
    if shorthand_fine:
        try:
            fines.append(float(shorthand_fine.replace(",", "")))
        except ValueError:
            pass
    if fines:
        out["fine_naira"] = str(int(max(fines)))
        if len(set(fines)) > 1:
            out["flags"].append("multiple_fines_max_used")
    if restitutions:
        out["restitution"] = "; ".join(dict.fromkeys(restitutions))
    elif re.search(r"RESTITU", text):
        out["restitution"] = "ordered (amount not stated)"

    out["forfeiture"] = "yes" if re.search(r"FORFEIT|AUCTION", text) else "no"

    if not custodial and not fines and not community and not restitutions:
        out["flags"].append("sentence_not_parsed")
    return out


# --------------------------------------------------------------------------- #
# Build
# --------------------------------------------------------------------------- #


def load_source_tables() -> list[tuple[int, str, list[list[str]]]]:
    """Return [(year, source_file, rows)] with each table's year verified."""
    merged = read_tables(SOURCE_MERGED)
    original_2020 = read_tables(SOURCE_2020)
    if len(merged) != 5 or len(original_2020) != 1:
        raise SystemExit(f"Unexpected table layout: merged={len(merged)} 2020={len(original_2020)}")

    tables = []
    for rows, fname in [(t, SOURCE_MERGED.name) for t in merged] + [(original_2020[0], SOURCE_2020.name)]:
        years = Counter(re.findall(r"20\d\d", " ".join(r[C_CONVICTED] for r in rows)))
        year = int(years.most_common(1)[0][0])
        tables.append((year, fname, rows))

    # The merged file's copy of 2020 lost rows where '#' (used for Naira) was read as a comment.
    # Use the original 2020 file instead.
    tables = [t for t in tables if not (t[0] == 2020 and t[1] == SOURCE_MERGED.name)]
    years = sorted(t[0] for t in tables)
    if years != [2020, 2021, 2022, 2023, 2024]:
        raise SystemExit(f"Expected one table per year 2020-2024, found {years}")
    return sorted(tables)


GENERIC_PREFIXES = {"CR", "REF", "CHARGE", "SUIT", "M", "MOT", "C", "TEMP", "EFCC"}


def learn_prefix_courts(tables) -> dict[str, tuple[str, str, str]]:
    """
    Learn which court a charge-number prefix belongs to, from rows where both
    are recorded. A prefix is only used when >= 80% of at least 5 rows agree.
    """
    votes: dict[str, Counter] = defaultdict(Counter)
    for _year, _f, rows in tables:
        for r in rows:
            prefix = charge_prefix(clean_charge_number(r[C_CHARGE]))
            court = clean(r[C_COURT])
            ctype = court_type_of(court)
            place, state = place_of(court)
            if prefix and ctype and state:
                votes[prefix][(ctype, place, state)] += 1
    learned = {}
    for prefix, counter in votes.items():
        (best, n), total = counter.most_common(1)[0], sum(counter.values())
        if prefix in GENERIC_PREFIXES:
            continue  # used by many courts; never infer a court from these
        if total >= 5 and n / total >= 0.8:
            learned[prefix] = best
    return learned


def build():
    tables = load_source_tables()
    prefix_courts = learn_prefix_courts(tables)

    records: list[dict] = []
    excluded: list[dict] = []
    date_log: list[dict] = []

    for year, fname, rows in tables:
        row_rules, block_log = decide_date_rules(year, rows)
        date_log += block_log
        for r, rules in zip(rows, row_rules):
            serial = clean(r[C_SN])
            src = {"source_table": f"EFCC Narrative of Convictions {year}", "source_serial": serial}
            flags: list[str] = []

            if not re.fullmatch(r"\d+", serial):
                excluded.append({**src, "source_file": fname, "reason": "row is not a numbered record", "name_as_recorded": clean(r[C_NAME])})
                continue

            # ---- column-shift repairs -------------------------------------------------
            offence_raw, court_raw = clean(r[C_OFFENCE]), clean(r[C_COURT])
            if re.fullmatch(r"\d{5}", court_raw):
                # Ilorin 2024 block: a spreadsheet date sits in the court column
                court_raw = ""
                flags.append("court_column_held_date")
            elif (
                not court_type_of(court_raw)
                and categorise_offence(court_raw) not in ("Other", "Not stated")
                and (nullish(offence_raw) or re.search(r"/\S*\d", offence_raw))
            ):
                # Enugu 2024 block (and a few others): offence written in the court column
                if not nullish(offence_raw) and not clean_charge_number(r[C_CHARGE]):
                    r = list(r)
                    r[C_CHARGE] = offence_raw  # the charge number had slid into the offence column
                offence_raw, court_raw = court_raw, ""
                flags.append("offence_court_columns_swapped")
            elif not court_type_of(court_raw) and (
                re.match(r"(HON\.?\s*)?JUSTICE\b", court_raw)
                or re.search(r"\bESQ\b", court_raw)
                or re.fullmatch(r"[\d/\-\. ]+", court_raw)
            ):
                court_raw = ""
                flags.append("court_column_held_other_value")

            names, unnamed, name_flags = split_names(r[C_NAME])
            flags += name_flags
            if not names:
                excluded.append({**src, "source_file": fname, "reason": "no defendant name", "name_as_recorded": clean(r[C_NAME])})
                continue

            charge = clean_charge_number(r[C_CHARGE])
            offence = "" if nullish(offence_raw) else offence_raw.strip(" .,")
            court_clean = "" if nullish(court_raw) else court_raw.strip(" .,")

            ctype = court_type_of(court_clean)
            place, state = place_of(court_clean)
            if not court_clean:
                learned = prefix_courts.get(charge_prefix(charge))
                if learned:
                    ctype, place, state = learned
                    flags.append("court_inferred_from_charge_number")
                else:
                    flags.append("court_missing")
            if court_clean and not ctype:
                flags.append("court_type_unclear")
            if not place and state:
                place = STATE_CAPITAL.get(state, "")
            court_label = ", ".join(x for x in (ctype, place) if x) if ctype else court_clean

            filed, _filed_prec, f_flags = parse_date(r[C_FILED], rules)
            convicted, conv_prec, c_flags = parse_date(r[C_CONVICTED], rules)
            flags += [f"filed_{x}" for x in f_flags if x not in ("date_day_month_corrected", "date_order_uncertain")]
            flags += [f"conviction_{x}" for x in c_flags if x != "date_day_month_corrected"]
            if "date_day_month_corrected" in c_flags:
                flags.append("conviction_date_day_month_corrected")
            if not convicted:
                flags.append("conviction_date_missing")
            elif abs(int(convicted[:4]) - year) > 1:
                flags.append("conviction_year_outside_table_year")
            if filed and convicted and len(filed) == 10 and len(convicted) == 10 and filed > convicted:
                flags.append("filed_after_conviction")

            sentence = parse_sentence(r[C_SENTENCE], year)
            flags += sentence.pop("flags")

            if not offence:
                flags.append("offence_missing")
            if not charge:
                flags.append("charge_number_missing")

            zone = clean(r[C_ZONE]).replace(" ", "")
            zone = {"HQ": "HEADQUARTERS", "HEADQUARTERS": "HEADQUARTERS", "ABUJAZC": "ABUJA", "PORTHARCOURT": "PORT HARCOURT"}.get(zone, clean(r[C_ZONE]))
            zone = "" if nullish(zone) else zone.title()

            if len(names) > 1 and re.search(
                r"\b(1ST|2ND|3RD|\d+TH|FIRST|SECOND|THIRD|FOURTH)\s+(?:AND\s+\w+\s+)?(DEFENDANTS?|ACCUSED|CONVICTS?)\b",
                sentence["sentence"],
            ):
                # The outcome may differ between the defendants named in this row.
                flags.append("sentence_names_specific_defendants")

            co_defs = [n for n, _ in names]
            for i, (name, aliases) in enumerate(names, start=1):
                rec_flags = list(flags)
                if len(name.split()) == 1 and not ORG_WORDS.search(name):
                    rec_flags.append("single_word_name")
                if re.search(r"\d", name):
                    rec_flags.append("name_contains_digits")
                others = [n for n in co_defs if n != name]
                if unnamed:
                    others.append(f"{unnamed} unnamed")
                record_id = f"FC{year}-{int(serial):04d}" + (f"-{i}" if len(names) > 1 else "")
                records.append({
                    "record_id": record_id,
                    "name": name,
                    "aliases": "; ".join(aliases),
                    "defendant_type": "organisation" if ORG_WORDS.search(name) else "individual",
                    "co_defendants": "; ".join(others),
                    "charge_number": charge,
                    "offence": offence,
                    "offence_category": categorise_offence(offence),
                    "court": court_label,
                    "court_as_recorded": court_clean,
                    "court_type": ctype,
                    "court_state": state,
                    "judge": clean_judge(r[C_JUDGE]),
                    "date_filed": filed,
                    "date_of_conviction": convicted,
                    "conviction_date_precision": conv_prec,
                    **sentence,
                    "efcc_zone": zone,
                    **src,
                    "quality_flags": ";".join(sorted(set(rec_flags))),
                })

    # ---- duplicate handling -------------------------------------------------------
    # The same conviction can appear in two yearly tables. Keep the first (earlier table)
    # when name, charge number and conviction date all match.
    seen: dict[tuple, str] = {}
    deduped = []
    for rec in records:
        if rec["charge_number"] and rec["date_of_conviction"]:
            key = (rec["name"], rec["charge_number"], rec["date_of_conviction"])
            if key in seen:
                excluded.append({
                    "source_table": rec["source_table"], "source_serial": rec["source_serial"],
                    "source_file": "", "reason": f"duplicate of {seen[key]}", "name_as_recorded": rec["name"],
                })
                continue
            seen[key] = rec["record_id"]
        deduped.append(rec)

    # Possible duplicates (same name + charge number, different dates) are kept but flagged.
    by_case = defaultdict(list)
    for rec in deduped:
        if rec["charge_number"]:
            by_case[(rec["name"], rec["charge_number"])].append(rec)
    for group in by_case.values():
        if len(group) > 1:
            for rec in group:
                rec["quality_flags"] = ";".join(sorted(set(filter(None, rec["quality_flags"].split(";") + ["possible_duplicate"]))))

    return deduped, excluded, prefix_courts, date_log


# --------------------------------------------------------------------------- #
# Validation and reporting
# --------------------------------------------------------------------------- #


ACTIONS_PATH = OUT_DIR / "record_actions.csv"


def validate(records: list[dict]) -> list[str]:
    errors = []
    ids = [r["record_id"] for r in records]
    if len(ids) != len(set(ids)):
        errors.append("record_id values are not unique")
    if ACTIONS_PATH.exists():
        known = set(ids)
        with ACTIONS_PATH.open(encoding="utf-8", newline="") as fh:
            for row in csv.DictReader(fh):
                if row["record_id"] not in known:
                    errors.append(f"record_actions.csv refers to unknown record {row['record_id']} (IDs changed?)")
                if row["action"] not in ("hide", "note"):
                    errors.append(f"record_actions.csv: unknown action {row['action']!r} for {row['record_id']}")
                if row["action"] == "note" and not row["note"].strip():
                    errors.append(f"record_actions.csv: note action without note text for {row['record_id']}")
    for r in records:
        if not r["name"]:
            errors.append(f"{r['record_id']}: empty name")
        for field in ("date_filed", "date_of_conviction"):
            v = r[field]
            if v and not re.fullmatch(r"\d{4}(-\d{2}(-\d{2})?)?", v):
                errors.append(f"{r['record_id']}: bad {field} {v!r}")
        if r["custodial_months"] and float(r["custodial_months"]) > 12 * 60:
            errors.append(f"{r['record_id']}: implausible custodial term {r['custodial_months']}")
        if r["fine_naira"] and not r["fine_naira"].isdigit():
            errors.append(f"{r['record_id']}: non-numeric fine {r['fine_naira']}")
        if set(r) != set(OUTPUT_COLUMNS):
            errors.append(f"{r['record_id']}: column mismatch")
    return errors


def pct(n: int, d: int) -> str:
    return f"{(100 * n / d):.1f}%" if d else "n/a"


def write_report(records, excluded, prefix_courts, date_log, source_rows: int) -> str:
    n = len(records)
    flags = Counter(f for r in records for f in r["quality_flags"].split(";") if f)
    by_year = Counter(r["source_table"][-4:] for r in records)
    conv_years = Counter(r["date_of_conviction"][:4] for r in records if r["date_of_conviction"])
    filled = lambda col: sum(1 for r in records if r[col])
    clean_records = sum(1 for r in records if not r["quality_flags"])

    lines = [
        "# FraudCheckr dataset quality report",
        "",
        "Generated by `scripts/build_dataset.py`. Do not edit by hand; rebuild instead.",
        "",
        "## Summary",
        "",
        f"- Source rows read: **{source_rows:,}** (EFCC Narrative of Convictions tables, 2020 to 2024)",
        f"- Published records: **{n:,}** (one per defendant)",
        f"- Excluded source rows: **{len(excluded):,}** (see `excluded_rows.csv`)",
        f"- Records with no quality flags: **{clean_records:,}** ({pct(clean_records, n)})",
        "",
        "## Records by source table",
        "",
        "| Table | Records |",
        "|---|---:|",
        *[f"| {y} | {c:,} |" for y, c in sorted(by_year.items())],
        "",
        "## Records by year of conviction",
        "",
        "| Year | Records |",
        "|---|---:|",
        *[f"| {y} | {c:,} |" for y, c in sorted(conv_years.items())],
        f"| Not stated | {n - sum(conv_years.values()):,} |",
        "",
        "## Field completeness",
        "",
        "| Field | Filled | Share |",
        "|---|---:|---:|",
        *[
            f"| {col} | {filled(col):,} | {pct(filled(col), n)} |"
            for col in (
                "charge_number", "offence", "court", "court_state", "judge", "date_filed",
                "date_of_conviction", "sentence", "custodial_months", "fine_naira", "restitution",
            )
        ],
        "",
        "## Offence categories",
        "",
        "| Category | Records |",
        "|---|---:|",
        *[f"| {k} | {v:,} |" for k, v in Counter(r["offence_category"] for r in records).most_common()],
        "",
        "## Court types",
        "",
        "| Court type | Records |",
        "|---|---:|",
        *[f"| {k or 'Unclear / not stated'} | {v:,} |" for k, v in Counter(r["court_type"] for r in records).most_common()],
        "",
        "## Quality flags",
        "",
        "A flag does not mean a record is wrong. It marks something a reader or reviewer should know.",
        "",
        "| Flag | Records |",
        "|---|---:|",
        *[f"| `{k}` | {v:,} |" for k, v in flags.most_common()],
        "",
        "## Charge-number prefixes used to recover missing courts",
        "",
        "Learned from rows where both the charge number and the court are recorded (at least 5 rows, 80% agreement).",
        "",
        "| Prefix | Court |",
        "|---|---|",
        *[f"| `{p}` | {t}, {pl or st} |" for p, (t, pl, st) in sorted(prefix_courts.items())],
        "",
        "## How dates were read, by zone block",
        "",
        "EFCC zones compiled their tables differently, and a spreadsheet tool later misread some",
        "day-first dates as month-first. Each contiguous block of rows from one zone was tested",
        "separately. Blocks of 20 or more rows are listed.",
        "",
        "| Table | Zone | Rows | Text dates read as | Votes | ISO dates | ISO swapped | Reason |",
        "|---|---|---:|---|---|---:|---|---|",
        *[
            f"| {d['table']} | {d['zone']} | {d['rows']} | {d['slash_order']} | {d['slash_votes']} | {d['iso_dates']} | {('yes' if d['iso_swapped'] else 'no') if d['iso_dates'] else 'n/a'} | {d['reason']} |"
            for d in date_log if d["rows"] >= 20
        ],
        "",
        f"Smaller blocks ({sum(1 for d in date_log if d['rows'] < 20)} blocks, "
        f"{sum(d['rows'] for d in date_log if d['rows'] < 20):,} rows, mostly the 2021 table, which interleaves zones) "
        "were decided from whole-table evidence.",
        "",
    ]
    return "\n".join(lines)


FACTS_PATH = ROOT / "Frontend" / "src" / "lib" / "datasetFacts.json"


def dataset_facts(records: list[dict]) -> str:
    """Headline figures for the website, so public copy always matches the data served."""
    hidden = set()
    if ACTIONS_PATH.exists():
        with ACTIONS_PATH.open(encoding="utf-8", newline="") as fh:
            hidden = {row["record_id"] for row in csv.DictReader(fh) if row["action"] == "hide"}
    records = [r for r in records if r["record_id"] not in hidden]
    tables = sorted({int(r["source_table"][-4:]) for r in records})
    states = {r["court_state"] for r in records if r["court_state"]}
    facts = {
        "records": len(records),
        "firstTableYear": tables[0],
        "lastTableYear": tables[-1],
        "courts": len({r["court"] for r in records if r["court_type"]}),
        "states": len(states - {"FCT"}),
        "includesFct": "FCT" in states,
        "efccZones": len({r["efcc_zone"] for r in records if r["efcc_zone"]}),
        "offenceCategories": len({r["offence_category"] for r in records} - {"Other", "Not stated"}),
        "withChargeNumberPct": round(100 * sum(1 for r in records if r["charge_number"]) / len(records)),
    }
    return json.dumps(facts, indent=2) + "\n"


def _csv_text(rows: list[dict], fieldnames: list[str]) -> str:
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=fieldnames, lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    return buffer.getvalue()


def main() -> int:
    check_only = "--check" in sys.argv[1:]
    records, excluded, prefix_courts, date_log = build()
    source_rows = sum(len(rows) for _y, _f, rows in load_source_tables())

    errors = validate(records)
    if errors:
        print("Validation failed:")
        for e in errors[:50]:
            print("  -", e)
        return 1

    outputs = {
        OUT_DIR / "convictions.csv": _csv_text(records, OUTPUT_COLUMNS),
        OUT_DIR / "excluded_rows.csv": _csv_text(
            excluded, ["source_table", "source_serial", "source_file", "reason", "name_as_recorded"]
        ),
        OUT_DIR / "QUALITY_REPORT.md": write_report(records, excluded, prefix_courts, date_log, source_rows),
        FACTS_PATH: dataset_facts(records),
    }

    if check_only:
        stale = [
            path.relative_to(ROOT).as_posix()
            for path, text in outputs.items()
            if not path.exists() or path.read_text(encoding="utf-8") != text
        ]
        if stale:
            print("Out of date (run python scripts/build_dataset.py):", ", ".join(stale))
            return 1
        print(f"Dataset is up to date: {len(records):,} records")
        return 0

    for path, text in outputs.items():
        path.write_text(text, encoding="utf-8", newline="")
    print(f"Wrote {len(records):,} records to data/convictions.csv ({len(excluded):,} source rows excluded)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
