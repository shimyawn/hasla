"""Parser tests using the local fixture — no network calls."""

from __future__ import annotations

from pathlib import Path

import pytest

from hk_rental_radar.parsers.hse28 import Hse28Parser

FIXTURE = Path(__file__).parent / "fixtures" / "hse28_search_page.html"


@pytest.fixture()
def html() -> str:
    return FIXTURE.read_text(encoding="utf-8")


@pytest.fixture()
def parser(html: str) -> Hse28Parser:
    return Hse28Parser(html, "https://en.28hse.com/en/rent/search?page=1")


def test_parses_expected_item_count(parser: Hse28Parser) -> None:
    items = parser.parse_listings()
    assert len(items) == 5


def test_extracts_listing_id(parser: Hse28Parser) -> None:
    items = parser.parse_listings()
    ids = {item["listing_id"] for item in items}
    assert "100001" in ids
    assert "100003" in ids


def test_extracts_rent_raw(parser: Hse28Parser) -> None:
    items = parser.parse_listings()
    by_id = {item["listing_id"]: item for item in items}
    assert "28,000" in (by_id["100001"]["rent_raw"] or "")


def test_extracts_district(parser: Hse28Parser) -> None:
    items = parser.parse_listings()
    by_id = {item["listing_id"]: item for item in items}
    assert by_id["100001"]["district_raw"] == "Olympic"
    assert by_id["100003"]["district_raw"] == "Ho Man Tin"


def test_detects_swimming_pool(parser: Hse28Parser) -> None:
    items = parser.parse_listings()
    by_id = {item["listing_id"]: item for item in items}
    assert by_id["100001"]["has_pool"] is True
    assert by_id["100002"]["has_pool"] is False


def test_detects_serviced_apartment(parser: Hse28Parser) -> None:
    items = parser.parse_listings()
    by_id = {item["listing_id"]: item for item in items}
    assert by_id["100004"]["is_serviced"] is True
    assert by_id["100001"]["is_serviced"] is False


def test_extracts_images(parser: Hse28Parser) -> None:
    items = parser.parse_listings()
    by_id = {item["listing_id"]: item for item in items}
    assert len(by_id["100001"]["image_urls"]) >= 1
    assert len(by_id["100003"]["image_urls"]) >= 2


def test_parses_total_count(parser: Hse28Parser) -> None:
    parser.parse_listings()  # must call first to initialize
    count = parser.parse_total_count()
    assert count == 32


def test_parses_next_page(parser: Hse28Parser) -> None:
    parser.parse_listings()
    next_url = parser.parse_next_page_url()
    assert next_url is not None
    assert "page=2" in next_url


def test_urls_are_absolute(parser: Hse28Parser) -> None:
    items = parser.parse_listings()
    for item in items:
        assert item["url"].startswith("http"), f"Expected absolute URL, got: {item['url']}"
