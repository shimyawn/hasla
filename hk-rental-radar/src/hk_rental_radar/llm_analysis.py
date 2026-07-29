"""Claude API integration — two-step: JSON analysis then Korean article."""

from __future__ import annotations

import json
import logging
from pathlib import Path

import anthropic
from pydantic import ValidationError

from .config import PROMPTS_DIR, settings
from .models import LLMAnalysisOutput, RentalListing, ScoredListing

logger = logging.getLogger(__name__)


def _load_prompt(name: str) -> str:
    path = PROMPTS_DIR / name
    return path.read_text(encoding="utf-8")


def _listing_to_dict(sl: ScoredListing) -> dict:
    l = sl.listing
    return {
        "listing_id": l.listing_id,
        "url": l.url,
        "title": l.title,
        "district": l.district,
        "estate_name": l.estate_name,
        "monthly_rent_hkd": l.monthly_rent_hkd,
        "bedrooms": l.bedrooms,
        "saleable_area_sqft": l.saleable_area_sqft,
        "gross_area_sqft": l.gross_area_sqft,
        "furnished": l.furnished,
        "swimming_pool": l.swimming_pool,
        "clubhouse": l.clubhouse,
        "serviced_apartment": l.serviced_apartment,
        "available_from": l.available_from.isoformat() if l.available_from else None,
        "nearest_mtr": l.nearest_mtr,
        "commute_to_central_minutes": l.commute_to_central_minutes,
        "commute_to_cityu_minutes": l.commute_to_cityu_minutes,
        "is_new_today": l.is_new_today,
        "is_price_reduced": l.is_price_reduced,
        "previous_rent_hkd": l.previous_rent,
        "description_excerpt": l.description_excerpt,
        "deterministic_score": sl.score,
        "score_breakdown": sl.score_breakdown,
    }


def analyze_listings(
    scored_listings: list[ScoredListing],
) -> LLMAnalysisOutput:
    """Call Claude to rank and evaluate the top qualified listings.

    Returns a validated LLMAnalysisOutput.
    """
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    system_prompt = _load_prompt("analysis_system.txt")

    payload = [_listing_to_dict(sl) for sl in scored_listings]
    user_message = f"Listings to analyze (JSON array):\n\n{json.dumps(payload, ensure_ascii=False, indent=2)}"

    logger.info("Sending %d listings to Claude (%s)", len(scored_listings), settings.anthropic_model)

    response = client.messages.create(
        model=settings.anthropic_model,
        max_tokens=4096,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    )

    raw_text = response.content[0].text  # type: ignore[union-attr]

    # Extract JSON block if wrapped in markdown
    import re
    json_match = re.search(r"```(?:json)?\s*([\s\S]+?)```", raw_text)
    json_str = json_match.group(1) if json_match else raw_text

    try:
        data = json.loads(json_str)
        return LLMAnalysisOutput.model_validate(data)
    except (json.JSONDecodeError, ValidationError) as exc:
        logger.error("Failed to parse LLM analysis output: %s\nRaw: %s", exc, raw_text[:500])
        raise


def generate_article(analysis: LLMAnalysisOutput, listings_by_id: dict[str, ScoredListing]) -> str:
    """Call Claude to write a Korean-language daily article based on the analysis JSON."""
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    system_prompt = _load_prompt("article_system.txt")

    # Build enriched payload for article generation
    enriched = analysis.model_dump(mode="json")
    # Attach listing facts needed for the article
    for rec in enriched.get("recommendations", []):
        lid = rec.get("listing_id")
        if lid and lid in listings_by_id:
            sl = listings_by_id[lid]
            rec["_listing"] = _listing_to_dict(sl)

    user_message = f"입력 JSON:\n\n{json.dumps(enriched, ensure_ascii=False, indent=2)}"

    logger.info("Generating Korean article via Claude")

    response = client.messages.create(
        model=settings.anthropic_model,
        max_tokens=4096,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    )

    return response.content[0].text  # type: ignore[union-attr]
