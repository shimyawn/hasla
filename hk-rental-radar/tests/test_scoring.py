"""Tests for scoring and hard filters."""

from __future__ import annotations

from datetime import datetime

import pytest

from hk_rental_radar.models import RentalListing
from hk_rental_radar.scoring import (
    passes_hard_filters,
    rank_listings,
    score_listing,
)

_NOW = datetime(2026, 7, 29, 12, 0, 0)


def _make_listing(**kwargs) -> RentalListing:  # type: ignore[return]
    defaults = dict(
        listing_id="test-001",
        url="https://en.28hse.com/en/rent/detail/1",
        title="Test Listing",
        district="Olympic",
        estate_name="Test Estate",
        monthly_rent_hkd=28000,
        bedrooms=2,
        saleable_area_sqft=650,
        commute_to_central_minutes=33,
        commute_to_cityu_minutes=23,
        collected_at=_NOW,
    )
    defaults.update(kwargs)
    return RentalListing(**defaults)


class TestHardFilters:
    def test_passes_good_listing(self) -> None:
        listing = _make_listing()
        passed, reason = passes_hard_filters(listing)
        assert passed
        assert reason is None

    def test_rejects_below_rent_minimum(self) -> None:
        listing = _make_listing(monthly_rent_hkd=20000)
        passed, reason = passes_hard_filters(listing)
        assert not passed
        assert reason is not None

    def test_rejects_above_rent_maximum(self) -> None:
        listing = _make_listing(monthly_rent_hkd=45000)
        passed, reason = passes_hard_filters(listing)
        assert not passed

    def test_rejects_studio(self) -> None:
        listing = _make_listing(bedrooms=0)
        passed, reason = passes_hard_filters(listing)
        assert not passed

    def test_rejects_central_over_60_min(self) -> None:
        listing = _make_listing(commute_to_central_minutes=65)
        passed, reason = passes_hard_filters(listing)
        assert not passed
        assert "Central" in (reason or "")

    def test_rejects_cityu_over_60_min(self) -> None:
        listing = _make_listing(commute_to_cityu_minutes=70)
        passed, reason = passes_hard_filters(listing)
        assert not passed
        assert "CityU" in (reason or "")

    def test_allows_missing_commute(self) -> None:
        listing = _make_listing(
            commute_to_central_minutes=None,
            commute_to_cityu_minutes=None,
        )
        passed, _ = passes_hard_filters(listing)
        assert passed  # can't reject based on unknown data


class TestScoring:
    def test_score_is_between_0_and_100(self) -> None:
        listing = _make_listing()
        result = score_listing(listing)
        assert 0 <= result.score <= 100

    def test_serviced_apartment_penalized(self) -> None:
        normal = _make_listing(serviced_apartment=False)
        serviced = _make_listing(listing_id="test-002", serviced_apartment=True)
        r_normal = score_listing(normal)
        r_serviced = score_listing(serviced)
        assert r_normal.score > r_serviced.score
        assert "penalty_serviced" in r_serviced.score_breakdown

    def test_pool_improves_score(self) -> None:
        no_pool = _make_listing(swimming_pool=False, clubhouse=False)
        with_pool = _make_listing(listing_id="test-003", swimming_pool=True, clubhouse=True)
        r_no = score_listing(no_pool)
        r_yes = score_listing(with_pool)
        assert r_yes.score > r_no.score

    def test_missing_commute_incurs_penalty(self) -> None:
        known = _make_listing(commute_to_central_minutes=33, commute_to_cityu_minutes=23)
        unknown = _make_listing(listing_id="test-004", commute_to_central_minutes=None, commute_to_cityu_minutes=None)
        r_known = score_listing(known)
        r_unknown = score_listing(unknown)
        assert r_known.score > r_unknown.score
        assert "penalty_no_commute" in r_unknown.score_breakdown

    def test_rank_listings_sorted_descending(self) -> None:
        listings = [
            _make_listing(listing_id="a", monthly_rent_hkd=35000, saleable_area_sqft=400),
            _make_listing(listing_id="b", monthly_rent_hkd=28000, saleable_area_sqft=650),
            _make_listing(listing_id="c", monthly_rent_hkd=28000, swimming_pool=True, saleable_area_sqft=700),
        ]
        ranked = rank_listings(listings)
        scores = [r.score for r in ranked]
        assert scores == sorted(scores, reverse=True)

    def test_new_listing_freshness_score(self) -> None:
        new_listing = _make_listing(is_new_today=True)
        old_listing = _make_listing(listing_id="test-005", is_new_today=False)
        r_new = score_listing(new_listing)
        r_old = score_listing(old_listing)
        assert r_new.score_breakdown["freshness"] > r_old.score_breakdown["freshness"]
