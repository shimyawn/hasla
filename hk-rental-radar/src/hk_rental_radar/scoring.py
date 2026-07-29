"""Deterministic scoring — runs before LLM to avoid wasting tokens."""

from __future__ import annotations

from datetime import date, timedelta
from typing import Optional

from .models import RentalListing, ScoredListing

# Hard filter budget windows (wider than user target to catch negotiable listings)
RENT_MIN = 23_000
RENT_MAX = 38_000
COMMUTE_LIMIT = 60

# Target range for scoring
RENT_TARGET_MIN = 25_000
RENT_TARGET_MAX = 30_000
RENT_SOFT_MAX = 35_000


def passes_hard_filters(listing: RentalListing) -> tuple[bool, Optional[str]]:
    """Return (passes, reason_if_rejected)."""
    if not (RENT_MIN <= listing.monthly_rent_hkd <= RENT_MAX):
        return False, f"rent HKD {listing.monthly_rent_hkd:,} outside discovery range"

    if listing.bedrooms is not None and listing.bedrooms < 1:
        return False, "studio / zero bedroom"

    if (
        listing.commute_to_central_minutes is not None
        and listing.commute_to_central_minutes > COMMUTE_LIMIT
    ):
        return False, f"Central commute {listing.commute_to_central_minutes} min > 60"

    if (
        listing.commute_to_cityu_minutes is not None
        and listing.commute_to_cityu_minutes > COMMUTE_LIMIT
    ):
        return False, f"CityU commute {listing.commute_to_cityu_minutes} min > 60"

    return True, None


def _budget_score(rent: int) -> float:
    """0–20 points."""
    if RENT_TARGET_MIN <= rent <= RENT_TARGET_MAX:
        return 20.0
    if RENT_TARGET_MAX < rent <= RENT_SOFT_MAX:
        # Linear decay from 20 → 10
        return 20.0 - 10.0 * (rent - RENT_TARGET_MAX) / (RENT_SOFT_MAX - RENT_TARGET_MAX)
    if RENT_MIN <= rent < RENT_TARGET_MIN:
        # Slightly below target is fine
        return 18.0
    # Outside target but within discovery range
    return max(0.0, 10.0 - (rent - RENT_SOFT_MAX) / 1000)


def _commute_score(central: Optional[int], cityu: Optional[int]) -> float:
    """0–25 points. Missing data gives partial credit but no full score."""
    if central is None or cityu is None:
        return 8.0  # partial credit — cannot evaluate properly

    average = (central + cityu) / 2
    worst = max(central, cityu)
    imbalance = abs(central - cityu)

    score = 25.0
    score -= max(0.0, average - 25) * 0.35
    score -= max(0.0, worst - 40) * 0.50
    score -= max(0.0, imbalance - 15) * 0.15

    return max(0.0, min(25.0, score))


def _space_score(listing: RentalListing) -> float:
    """0–15 points based on usable area and bedroom count."""
    score = 0.0
    area = listing.saleable_area_sqft

    if area is None:
        if listing.gross_area_sqft:
            # Gross only — apply discount
            area = round(listing.gross_area_sqft * 0.75)
            score -= 2.0  # penalty for missing saleable
        else:
            return 3.0  # very limited data

    if area >= 700:
        score += 12.0
    elif area >= 600:
        score += 10.0
    elif area >= 500:
        score += 8.0
    elif area >= 400:
        score += 6.0
    else:
        score += 4.0

    if listing.bedrooms is not None:
        if listing.bedrooms >= 2:
            score += 3.0
        elif listing.bedrooms == 1:
            score += 1.0

    return max(0.0, min(15.0, score))


def _mtr_score(listing: RentalListing) -> float:
    """0–10 points."""
    walk = listing.walk_to_mtr_minutes
    if walk is None:
        # Estimate from commute data availability
        if listing.nearest_mtr:
            return 6.0
        return 4.0
    if walk <= 5:
        return 10.0
    if walk <= 10:
        return 8.0
    if walk <= 15:
        return 6.0
    if walk <= 20:
        return 4.0
    return 2.0


def _building_score(listing: RentalListing) -> float:
    """0–10 points based on available signals."""
    score = 5.0  # baseline (unknown)
    if listing.serviced_apartment:
        score -= 3.0
    if listing.lift is True:
        score += 2.0
    if listing.estate_name:
        score += 1.0  # named estate = more info available
    return max(0.0, min(10.0, score))


def _facility_score(listing: RentalListing) -> float:
    """0–5 points."""
    score = 0.0
    if listing.swimming_pool:
        score += 3.0
    if listing.clubhouse:
        score += 2.0
    return score


def _movein_score(listing: RentalListing, target: date = date(2026, 8, 31)) -> float:
    """0–5 points based on move-in date alignment."""
    if listing.available_from is None:
        return 2.0
    delta = (listing.available_from - target).days
    if -30 <= delta <= 30:
        return 5.0
    if -60 <= delta <= 60:
        return 3.0
    return 1.0


def _freshness_score(listing: RentalListing) -> float:
    """0–5 points. New listings and recent price drops score higher."""
    if listing.is_new_today:
        return 5.0
    if listing.is_price_reduced:
        return 4.0
    if listing.listing_date:
        age = (date.today() - listing.listing_date).days
        if age <= 7:
            return 3.0
        if age <= 14:
            return 2.0
        return 1.0
    return 2.0


def _reliability_score(listing: RentalListing) -> float:
    """0–5 points for data completeness."""
    score = 5.0
    missing = 0
    if listing.saleable_area_sqft is None:
        missing += 1
    if listing.available_from is None:
        missing += 1
    if listing.estate_name is None:
        missing += 1
    if listing.listing_date is None:
        missing += 1
    score -= missing * 1.0
    return max(0.0, score)


def score_listing(listing: RentalListing) -> ScoredListing:
    passed, rejection_reason = passes_hard_filters(listing)

    breakdown: dict[str, float] = {}
    breakdown["budget"] = _budget_score(listing.monthly_rent_hkd)
    breakdown["commute"] = _commute_score(
        listing.commute_to_central_minutes, listing.commute_to_cityu_minutes
    )
    breakdown["space"] = _space_score(listing)
    breakdown["mtr"] = _mtr_score(listing)
    breakdown["building"] = _building_score(listing)
    breakdown["facilities"] = _facility_score(listing)
    breakdown["movein"] = _movein_score(listing)
    breakdown["freshness"] = _freshness_score(listing)
    breakdown["reliability"] = _reliability_score(listing)

    # Penalties
    if listing.serviced_apartment:
        breakdown["penalty_serviced"] = -10.0

    if listing.saleable_area_sqft is None and listing.gross_area_sqft is None:
        breakdown["penalty_no_area"] = -5.0

    if listing.commute_to_central_minutes is None or listing.commute_to_cityu_minutes is None:
        breakdown["penalty_no_commute"] = -10.0

    total = round(max(0.0, min(100.0, sum(breakdown.values()))), 1)

    return ScoredListing(
        listing=listing,
        score=total,
        score_breakdown=breakdown,
        passed_hard_filter=passed,
        rejection_reason=rejection_reason,
    )


def rank_listings(listings: list[RentalListing]) -> list[ScoredListing]:
    """Score all listings and return sorted best-first."""
    scored = [score_listing(l) for l in listings]
    return sorted(scored, key=lambda s: s.score, reverse=True)
