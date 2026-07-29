"""Core data models for HK Rental Radar."""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class PriceRecord(BaseModel):
    recorded_at: datetime
    rent_hkd: int


class RentalListing(BaseModel):
    source: str = "28Hse"
    listing_id: str
    url: str
    title: str
    district: Optional[str] = None
    estate_name: Optional[str] = None
    address: Optional[str] = None
    monthly_rent_hkd: int = Field(gt=0)
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    saleable_area_sqft: Optional[int] = None
    gross_area_sqft: Optional[int] = None
    furnished: Optional[bool] = None
    serviced_apartment: bool = False
    swimming_pool: Optional[bool] = None
    clubhouse: Optional[bool] = None
    lift: Optional[bool] = None
    available_from: Optional[date] = None
    listing_date: Optional[date] = None
    agent_or_owner: Optional[str] = None
    nearest_mtr: Optional[str] = None
    walk_to_mtr_minutes: Optional[int] = None
    commute_to_central_minutes: Optional[int] = None
    commute_to_cityu_minutes: Optional[int] = None
    description_original: Optional[str] = None
    description_excerpt: Optional[str] = None
    image_urls: list[str] = []
    collected_at: datetime

    # Tracking fields (populated from DB on subsequent runs)
    first_seen_at: Optional[datetime] = None
    last_seen_at: Optional[datetime] = None
    price_history: list[PriceRecord] = []
    previous_rent: Optional[int] = None
    is_new_today: bool = False
    is_price_reduced: bool = False
    content_hash: Optional[str] = None


class ScoredListing(BaseModel):
    listing: RentalListing
    score: float
    score_breakdown: dict[str, float]
    passed_hard_filter: bool
    rejection_reason: Optional[str] = None


class LLMRecommendation(BaseModel):
    listing_id: str
    score: int = Field(ge=0, le=100)
    confidence: str  # high|medium|low
    category: str  # best_overall|best_value|best_commute|best_facilities|stretch
    one_line_summary_ko: str
    reasons_ko: list[str]
    concerns_ko: list[str]
    questions_for_agent_ko: list[str]
    verified_facts: list[str]
    uncertain_claims: list[str]


class MarketSummary(BaseModel):
    listing_count_reviewed: int
    qualified_count: int
    new_listing_count: int
    price_reduction_count: int
    summary_ko: str


class RejectedListing(BaseModel):
    listing_id: str
    reason_ko: str


class LLMAnalysisOutput(BaseModel):
    market_summary: MarketSummary
    recommendations: list[LLMRecommendation]
    rejected_notable_listings: list[RejectedListing]


class DailyRunResult(BaseModel):
    run_date: date
    listings_collected: int = 0
    listings_after_filter: int = 0
    listings_sent_to_llm: int = 0
    analysis: Optional[LLMAnalysisOutput] = None
    article_ko: Optional[str] = None
    report_path: Optional[str] = None
    json_path: Optional[str] = None
    errors: list[str] = []
