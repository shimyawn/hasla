"""Tests for normalization helpers."""

from __future__ import annotations

import pytest

from hk_rental_radar.normalization import (
    normalize_district,
    parse_area,
    parse_rent,
    sqft_to_sqm,
    sqm_to_sqft,
)


@pytest.mark.parametrize(
    "raw, expected",
    [
        ("Olympic", "Olympic"),
        ("奧運", "Olympic"),
        ("olympic", "Olympic"),
        ("何文田", "Ho Man Tin"),
        ("ho man tin", "Ho Man Tin"),
        ("堅尼地城", "Kennedy Town"),
        ("kennedy town", "Kennedy Town"),
        ("九龍塘", "Kowloon Tong"),
        ("西九龍", "West Kowloon"),
        ("中環", "Central"),
        (None, None),
        ("Unknown District XYZ", None),
    ],
)
def test_normalize_district(raw: str | None, expected: str | None) -> None:
    assert normalize_district(raw) == expected


@pytest.mark.parametrize(
    "raw, expected_sqft",
    [
        ("650 ft²", 650),
        ("650sqft", 650),
        ("650 square feet", 650),
        ("60 m²", sqm_to_sqft(60)),
        ("60sqm", sqm_to_sqft(60)),
        ("HK$28,000", None),  # not an area string
        (None, None),
    ],
)
def test_parse_area(raw: str | None, expected_sqft: int | None) -> None:
    result, _ = parse_area(raw)
    assert result == expected_sqft


@pytest.mark.parametrize(
    "raw, expected",
    [
        ("HK$28,000/月", 28000),
        ("$33,000", 33000),
        ("27500", 27500),
        ("HK$ 25,000", 25000),
        (None, None),
        ("N/A", None),
    ],
)
def test_parse_rent(raw: str | None, expected: int | None) -> None:
    assert parse_rent(raw) == expected


def test_sqm_to_sqft_round_trip() -> None:
    sqm = 60.0
    sqft = sqm_to_sqft(sqm)
    back = sqft_to_sqm(sqft)
    assert abs(back - sqm) < 1.0
