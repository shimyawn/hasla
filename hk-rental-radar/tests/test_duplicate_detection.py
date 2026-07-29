"""Tests for duplicate detection."""

from __future__ import annotations

from datetime import datetime

from hk_rental_radar.duplicate_detection import (
    compute_content_hash,
    find_duplicates,
    mark_duplicates,
)
from hk_rental_radar.models import RentalListing

_NOW = datetime(2026, 7, 29, 12, 0, 0)


def _listing(listing_id: str, **kwargs) -> RentalListing:  # type: ignore[return]
    defaults = dict(
        url=f"https://en.28hse.com/en/rent/detail/{listing_id}",
        title="Test",
        district="Olympic",
        estate_name="The Harbourside",
        monthly_rent_hkd=28000,
        bedrooms=2,
        saleable_area_sqft=650,
        collected_at=_NOW,
    )
    defaults.update(kwargs)
    return RentalListing(listing_id=listing_id, **defaults)


def test_content_hash_changes_on_rent_change() -> None:
    l1 = _listing("a", monthly_rent_hkd=28000)
    l2 = _listing("a", monthly_rent_hkd=26000)
    assert compute_content_hash(l1) != compute_content_hash(l2)


def test_content_hash_stable_for_same_data() -> None:
    l1 = _listing("a")
    l2 = _listing("a")
    assert compute_content_hash(l1) == compute_content_hash(l2)


def test_find_no_duplicates_when_all_unique() -> None:
    listings = [
        _listing("a", district="Olympic", estate_name="Estate A"),
        _listing("b", district="Jordan", estate_name="Estate B"),
        _listing("c", district="Ho Man Tin", estate_name="Estate C"),
    ]
    groups = find_duplicates(listings)
    assert groups == {}


def test_find_duplicates_same_estate_rent_area() -> None:
    # Same estate, same rent and area — different IDs but same property
    l1 = _listing("a", estate_name="The Harbourside", monthly_rent_hkd=28000, saleable_area_sqft=650)
    l2 = _listing("b", estate_name="The Harbourside", monthly_rent_hkd=28000, saleable_area_sqft=650)
    groups = find_duplicates([l1, l2])
    assert len(groups) == 1


def test_mark_duplicates_suppresses_extras() -> None:
    l1 = _listing("a", estate_name="The Harbourside", monthly_rent_hkd=28000, saleable_area_sqft=650)
    l2 = _listing("b", estate_name="The Harbourside", monthly_rent_hkd=28000, saleable_area_sqft=650)
    listings = [l1, l2]
    groups = find_duplicates(listings)
    suppressed = mark_duplicates(listings, groups)
    # Exactly one should be suppressed
    assert len(suppressed) == 1
    # The other must not be suppressed
    assert len({"a", "b"} - suppressed) == 1


def test_different_rent_not_duplicate() -> None:
    l1 = _listing("a", monthly_rent_hkd=28000)
    l2 = _listing("b", monthly_rent_hkd=30000)
    # Rent buckets differ by 500+, so fingerprints differ
    groups = find_duplicates([l1, l2])
    assert groups == {}
