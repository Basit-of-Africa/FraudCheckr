"""
Name matching for FraudCheckr name-match reports.

The EFCC's conviction tables contain names only: no dates of birth or ID
numbers. Name matching therefore can only ever suggest *possible* records for a
person to review. The rules below are deliberately conservative:

* Names are compared as sets of words, so order does not matter
  ("BAMIDELE ABDULMUMUNI" = "ABDULMUMUNI BAMIDELE").
* Titles and honorifics (DR, ALHAJI, CHIEF, ...) are ignored.
* Close spellings of the same word count as matches ("MOHAMMED" ~ "MUHAMMAD").
* Sharing a single word is never a match: "JOHN OKAFOR" and "JOHN ADEBAYO" are
  different people.
* A one-word query can only produce low-confidence results for review.

Match types, strongest first:
    exact     every word matches exactly, in any order (two or more words)
    strong    every word matches, allowing spelling variants
    possible  one name's words are all in the other, which has extra words
    weak      only for one-word queries
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from difflib import SequenceMatcher

TITLES = {
    "MR", "MRS", "MS", "MISS", "DR", "PROF", "PROFESSOR", "ENGR", "ENGINEER", "ARC", "BARR", "BARRISTER",
    "CHIEF", "HON", "HONOURABLE", "HONORABLE", "ALH", "ALHAJI", "ALHAJA", "ALHAJJI", "HAJIA", "HAJIYA",
    "MALAM", "MALLAM", "PASTOR", "REV", "REVEREND", "EVANG", "PRINCE", "PRINCESS", "OBA", "SIR", "LADY",
    "COL", "CAPT", "CAPTAIN", "GEN", "MAJ", "LT", "SGT", "CPL", "AIG", "DSP", "ASP", "CSP", "ESQ", "JNR",
    "JR", "SNR", "SR", "MV",
}

# Common spelling variants, mapped to one form before comparison.
CANONICAL = {
    **dict.fromkeys(["MOHAMMED", "MOHAMMAD", "MOHAMED", "MUHAMMED", "MUHAMMAD", "MUHAMAD", "MOHAMMADU", "MUHAMMADU"], "MUHAMMAD"),
    **dict.fromkeys(["ABUBAKAR", "ABUBAKARR", "ABUBAKKAR", "ABUBAKR"], "ABUBAKAR"),
    **dict.fromkeys(["IBRAHIM", "IBRAHEEM", "IBRAHIMA"], "IBRAHIM"),
    **dict.fromkeys(["YUSUF", "YUSSUF", "YUSUPH", "YUSUFF", "YUSSUFF"], "YUSUF"),
    **dict.fromkeys(["SULEIMAN", "SULAIMAN", "SULEMAN", "SULAYMAN", "SULAIMON"], "SULEIMAN"),
    **dict.fromkeys(["ABDULLAHI", "ABDULLAH", "ABDALLAH"], "ABDULLAHI"),
    **dict.fromkeys(["OLUWASEUN", "OLUWASEUNI"], "OLUWASEUN"),
    **dict.fromkeys(["CHUKWUEMEKA", "CHUKWUMEKA"], "CHUKWUEMEKA"),
}

FUZZY_THRESHOLD = 0.85  # minimum similarity for two words to count as the same name


@dataclass(frozen=True)
class NameMatch:
    match_type: str  # exact | strong | possible | weak
    confidence: float
    reason: str


def name_tokens(name: str | None) -> list[str]:
    """Upper-case words of a name, without punctuation, titles or duplicates (order kept)."""
    text = re.sub(r"[^A-Z0-9' ]+", " ", (name or "").upper()).replace("'", "")
    seen: list[str] = []
    for word in text.split():
        if word in TITLES or len(word) < 2 or word.isdigit():
            continue
        word = CANONICAL.get(word, word)
        if word not in seen:
            seen.append(word)
    return seen


def _similarity(a: str, b: str) -> float:
    if a == b:
        return 1.0
    # Very short words must match exactly; fuzzy matching them is meaningless.
    if min(len(a), len(b)) < 4:
        return 0.0
    return SequenceMatcher(None, a, b).ratio()


def _pair_words(query: list[str], candidate: list[str]) -> list[float]:
    """Greedy one-to-one pairing of query words to candidate words; returns the scores of matched pairs."""
    pairs = sorted(
        ((_similarity(q, c), qi, ci) for qi, q in enumerate(query) for ci, c in enumerate(candidate)),
        reverse=True,
    )
    used_q: set[int] = set()
    used_c: set[int] = set()
    scores: list[float] = []
    for score, qi, ci in pairs:
        if score < FUZZY_THRESHOLD:
            break
        if qi in used_q or ci in used_c:
            continue
        used_q.add(qi)
        used_c.add(ci)
        scores.append(score)
    return scores


def match_name(query: str, candidate: str) -> NameMatch | None:
    """Compare a searched name with a recorded name. Returns None when they should not be linked."""
    return match_tokens(name_tokens(query), name_tokens(candidate))


def match_tokens(q: list[str], c: list[str]) -> NameMatch | None:
    """match_name() for names already split by name_tokens()."""
    if not q or not c:
        return None

    scores = _pair_words(q, c)
    matched = len(scores)
    if matched == 0:
        return None

    if len(q) == 1:
        # One word cannot distinguish between people.
        return NameMatch("weak", round(0.4 * scores[0], 2), "Only one name was searched; a single name cannot identify a person")

    if matched < 2:
        return None  # sharing one name (e.g. a common first name) is not a match

    average = sum(scores) / matched
    if matched == len(q) == len(c):
        if average == 1.0:
            order = "" if q == c else " (in a different order)"
            return NameMatch("exact", 1.0, f"All {matched} names match exactly{order}")
        return NameMatch("strong", round(0.9 * average, 2), f"All {matched} names match, allowing for spelling differences")

    if matched == min(len(q), len(c)):
        extra = "the record" if len(c) > len(q) else "the searched name"
        return NameMatch(
            "possible",
            round(0.75 * average * matched / max(len(q), len(c)) + 0.15, 2),
            f"{matched} of {max(len(q), len(c))} names match; {extra} has additional names",
        )

    # Some names match but each side also has names the other lacks: too weak to report.
    return None


class NameIndex:
    """
    Pre-tokenised names for a list of records, with a lookup by the first three
    letters of each word. A record is only compared in full when it shares a word
    start with the query; spelling variants almost always share their first letters.
    """

    def __init__(self, records: list[dict]):
        self.records = records
        self.names: list[list[tuple[str, list[str]]]] = []  # per record: [(recorded name, tokens), ...]
        self.by_prefix: dict[str, set[int]] = {}
        for i, record in enumerate(records):
            entries = [record.get("name", "")]
            entries += [a.strip() for a in (record.get("aliases") or "").split(";") if a.strip()]
            tokenised = [(name, name_tokens(name)) for name in entries]
            self.names.append(tokenised)
            for _name, tokens in tokenised:
                for token in tokens:
                    self.by_prefix.setdefault(token[:3], set()).add(i)

    def candidates(self, query_tokens: list[str]) -> list[int]:
        found: set[int] = set()
        for token in query_tokens:
            found |= self.by_prefix.get(token[:3], set())
        return sorted(found)
