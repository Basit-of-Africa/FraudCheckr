"""Rules for name matching (see name_matching.py). Run: python -m pytest tests"""

import pytest

from name_matching import match_name, name_tokens


def kind(query, candidate):
    result = match_name(query, candidate)
    return result.match_type if result else None


@pytest.mark.parametrize(
    "query, candidate, expected",
    [
        # Same people
        ("ABDULMUMUNI BAMIDELE", "ABDULMUMUNI BAMIDELE", "exact"),
        ("BAMIDELE ABDULMUMUNI", "ABDULMUMUNI BAMIDELE", "exact"),  # surname-first order
        ("John Warimeme Ababe", "DR. JOHN WARIMEME ABABE", "exact"),  # title and case ignored
        ("ALHAJI MOHAMMED SANI", "MUHAMMAD SANI", "exact"),  # title + known spelling variant
        ("OLUWASEGUN ADEBAYO", "OLUWASEGUN ADEBAYOR", "strong"),  # small spelling difference
        ("ADEBAYO OLUWASEGUN", "ADEBAYO OLUWASEGUN JOHNSON", "possible"),  # record has an extra name
        ("ADEBAYO OLUWASEGUN JOHNSON", "ADEBAYO OLUWASEGUN", "possible"),  # query has an extra name
        # Different people: sharing one common name is not a match
        ("JOHN OKAFOR", "JOHN ADEBAYO", None),
        ("MUHAMMAD SANI", "MUHAMMAD BELLO", None),
        ("CHINEDU OKAFOR EMEKA", "CHINEDU OKAFOR IFEANYI", None),  # 2 of 3 shared, each has another
        # Short names are never matched fuzzily (old bug: "ALI" matched inside "ALIYU")
        ("ALI MUSA", "ALIYU MUSA", None),
        ("ALI", "ALIYU BELLO", None),
        # One-word searches can only be weak
        ("JOHN", "JOHN ADEBAYO", "weak"),
        ("OKAFOR", "OKAFOR CHINEDU", "weak"),
    ],
)
def test_match_types(query, candidate, expected):
    assert kind(query, candidate) == expected


def test_single_name_confidence_is_low():
    assert match_name("JOHN", "JOHN ADEBAYO").confidence <= 0.4


def test_confidence_order():
    exact = match_name("OLUWASEGUN ADEBAYO", "OLUWASEGUN ADEBAYO").confidence
    strong = match_name("OLUWASEGUN ADEBAYO", "OLUWASEGUN ADEBAYOR").confidence
    possible = match_name("OLUWASEGUN ADEBAYO", "OLUWASEGUN ADEBAYO JOHNSON").confidence
    assert exact > strong > possible


def test_tokens_strip_titles_punctuation_and_duplicates():
    assert name_tokens("Dr. (Mrs) Ngozi  Okafor-Okeke, ESQ") == ["NGOZI", "OKAFOR", "OKEKE"]
    assert name_tokens("JOHN JOHN DOE") == ["JOHN", "DOE"]
    assert name_tokens("") == []
