"""Name-match reports against the real dataset. Run: python -m pytest tests"""

import pytest

import main


@pytest.fixture(scope="module", autouse=True)
def loaded_data():
    from dataset import load_canonical_records

    main.convictions_data = load_canonical_records()
    yield


def report(name, aliases=(), location=None, limit=10):
    return main.build_screening_report(query_name=name, aliases=list(aliases), location=location, limit=limit)


def test_exact_match_found_with_neutral_wording():
    r = report("SALAUDEEN ISMAIL")
    assert r["status"] == "match"
    assert r["matches"][0]["record"]["record_id"] == "FC2020-0624"
    assert "does not show that the record is about this person" in r["summary_text"]


def test_reversed_name_order_still_matches():
    r = report("ISMAIL SALAUDEEN")
    assert r["matches"][0]["record"]["record_id"] == "FC2020-0624"
    assert r["matches"][0]["match_type"] == "exact"


def test_recorded_alias_is_matched():
    r = report("JANE MILLER")
    top = r["matches"][0]
    assert top["record"]["record_id"] == "FC2020-0624"
    assert "alias" in top["reason"]


def test_single_name_is_review_only():
    r = report("JOHN")
    assert r["status"] == "review"
    assert all(m["match_type"] == "weak" for m in r["matches"])
    assert "single name" in r["summary_text"]


def test_unknown_name_is_clear_but_not_a_clean_bill():
    r = report("ZZQX NONEXISTENT PERSON")
    assert r["status"] == "clear"
    assert "not evidence that the person has no conviction" in r["summary_text"]


def test_hidden_records_are_never_returned():
    # FC2020-0747-2 was discharged and acquitted and is hidden via data/record_actions.csv
    r = report("OLORUNWA BABATUNDE IDOWU")
    assert all(m["record"]["record_id"] != "FC2020-0747-2" for m in r["matches"])


def test_location_annotates_but_does_not_change_match_type():
    with_loc = report("SALAUDEEN ISMAIL", location="KANO")["matches"][0]
    without = report("SALAUDEEN ISMAIL")["matches"][0]
    assert with_loc["match_type"] == without["match_type"] == "exact"
    assert with_loc["confidence"] <= without["confidence"]


def test_shared_first_name_does_not_match():
    r = report("JOHN ZZQXNOTANAME")
    assert r["status"] == "clear"
