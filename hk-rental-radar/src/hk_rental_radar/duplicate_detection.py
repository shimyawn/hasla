"""Duplicate detection and content fingerprinting."""

from __future__ import annotations

import hashlib
import re
from typing import Optional

from .models import RentalListing


def compute_content_hash(listing: RentalListing) -> str:
    """SHA-256 of stable fields — changes when rent/area/title changes."""
    parts = [
        listing.listing_id,
        str(listing.monthly_rent_hkd),
        str(listing.saleable_area_sqft or ""),
        str(listing.gross_area_sqft or ""),
        (listing.title or "").strip().lower(),
        (listing.estate_name or "").strip().lower(),
        (listing.district or "").strip().lower(),
        str(listing.bedrooms or ""),
    ]
    payload = "|".join(parts)
    return hashlib.sha256(payload.encode()).hexdigest()


def _fingerprint(listing: RentalListing) -> str:
    """Probabilistic fingerprint for cross-ID duplicate detection.

    Two listings with the same fingerprint are very likely the same property
    listed by different agents.
    """
    estate = re.sub(r"\s+", "", (listing.estate_name or "").lower())
    rent_bucket = round(listing.monthly_rent_hkd / 500) * 500
    area = listing.saleable_area_sqft or listing.gross_area_sqft or 0
    area_bucket = round(area / 50) * 50
    bedrooms = listing.bedrooms or 0
    district = re.sub(r"\s+", "", (listing.district or "").lower())
    return f"{district}:{estate}:{rent_bucket}:{area_bucket}:{bedrooms}"


def find_duplicates(
    listings: list[RentalListing],
) -> dict[str, list[str]]:
    """Return a mapping fingerprint → [listing_ids] for groups with > 1 entry."""
    groups: dict[str, list[str]] = {}
    for listing in listings:
        fp = _fingerprint(listing)
        groups.setdefault(fp, []).append(listing.listing_id)
    return {fp: ids for fp, ids in groups.items() if len(ids) > 1}


def mark_duplicates(
    listings: list[RentalListing],
    duplicate_groups: dict[str, list[str]],
) -> set[str]:
    """Return set of listing_ids to suppress (keep only the first in each group)."""
    suppress: set[str] = set()
    for ids in duplicate_groups.values():
        # Keep the listing with the most data; suppress the rest
        ranked = sorted(
            [l for l in listings if l.listing_id in ids],
            key=lambda l: (
                l.saleable_area_sqft is not None,
                l.estate_name is not None,
                l.available_from is not None,
                -l.monthly_rent_hkd,  # prefer lower rent if tied
            ),
            reverse=True,
        )
        for duplicate in ranked[1:]:
            suppress.add(duplicate.listing_id)
    return suppress
