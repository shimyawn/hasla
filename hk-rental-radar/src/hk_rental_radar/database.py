"""Database layer — SQLAlchemy 2 + SQLite."""

from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Optional

from sqlalchemy import Boolean, DateTime, Integer, String, Text, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column

from .config import settings
from .models import PriceRecord, RentalListing


class Base(DeclarativeBase):
    pass


class ListingRecord(Base):
    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    listing_id: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    source: Mapped[str] = mapped_column(String(50), default="28Hse")
    url: Mapped[str] = mapped_column(String(500))
    title: Mapped[str] = mapped_column(String(500))
    district: Mapped[Optional[str]] = mapped_column(String(100))
    estate_name: Mapped[Optional[str]] = mapped_column(String(200))
    monthly_rent_hkd: Mapped[int] = mapped_column(Integer)
    bedrooms: Mapped[Optional[int]] = mapped_column(Integer)
    saleable_area_sqft: Mapped[Optional[int]] = mapped_column(Integer)
    gross_area_sqft: Mapped[Optional[int]] = mapped_column(Integer)
    swimming_pool: Mapped[Optional[bool]] = mapped_column(Boolean)
    clubhouse: Mapped[Optional[bool]] = mapped_column(Boolean)
    serviced_apartment: Mapped[bool] = mapped_column(Boolean, default=False)
    commute_to_central_minutes: Mapped[Optional[int]] = mapped_column(Integer)
    commute_to_cityu_minutes: Mapped[Optional[int]] = mapped_column(Integer)
    content_hash: Mapped[Optional[str]] = mapped_column(String(64))
    description_excerpt: Mapped[Optional[str]] = mapped_column(Text)
    image_urls_json: Mapped[Optional[str]] = mapped_column(Text)
    price_history_json: Mapped[Optional[str]] = mapped_column(Text)
    first_seen_at: Mapped[datetime] = mapped_column(DateTime)
    last_seen_at: Mapped[datetime] = mapped_column(DateTime)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class RunRecord(Base):
    __tablename__ = "runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    run_date: Mapped[str] = mapped_column(String(10), index=True)
    started_at: Mapped[datetime] = mapped_column(DateTime)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    listings_collected: Mapped[int] = mapped_column(Integer, default=0)
    listings_qualified: Mapped[int] = mapped_column(Integer, default=0)
    error_count: Mapped[int] = mapped_column(Integer, default=0)
    report_path: Mapped[Optional[str]] = mapped_column(String(500))


def get_engine():  # type: ignore[return]
    db_url = settings.db_url
    Path(db_url.replace("sqlite:///", "")).parent.mkdir(parents=True, exist_ok=True)
    return create_engine(db_url, echo=False)


def init_db() -> None:
    Base.metadata.create_all(get_engine())


def get_session() -> Session:
    return Session(get_engine())


def upsert_listing(session: Session, listing: RentalListing, now: datetime) -> bool:
    """Insert or update a listing. Returns True if this is a new listing."""
    stmt = select(ListingRecord).where(ListingRecord.listing_id == listing.listing_id)
    existing = session.scalars(stmt).first()

    price_history: list[dict] = []

    if existing is None:
        record = ListingRecord(
            listing_id=listing.listing_id,
            source=listing.source,
            url=listing.url,
            title=listing.title,
            district=listing.district,
            estate_name=listing.estate_name,
            monthly_rent_hkd=listing.monthly_rent_hkd,
            bedrooms=listing.bedrooms,
            saleable_area_sqft=listing.saleable_area_sqft,
            gross_area_sqft=listing.gross_area_sqft,
            swimming_pool=listing.swimming_pool,
            clubhouse=listing.clubhouse,
            serviced_apartment=listing.serviced_apartment,
            commute_to_central_minutes=listing.commute_to_central_minutes,
            commute_to_cityu_minutes=listing.commute_to_cityu_minutes,
            content_hash=listing.content_hash,
            description_excerpt=listing.description_excerpt,
            image_urls_json=json.dumps(listing.image_urls),
            price_history_json=json.dumps([{"recorded_at": now.isoformat(), "rent_hkd": listing.monthly_rent_hkd}]),
            first_seen_at=now,
            last_seen_at=now,
            is_active=True,
        )
        session.add(record)
        return True
    else:
        if existing.price_history_json:
            price_history = json.loads(existing.price_history_json)
        if existing.monthly_rent_hkd != listing.monthly_rent_hkd:
            price_history.append({"recorded_at": now.isoformat(), "rent_hkd": listing.monthly_rent_hkd})

        existing.last_seen_at = now
        existing.monthly_rent_hkd = listing.monthly_rent_hkd
        existing.content_hash = listing.content_hash
        existing.price_history_json = json.dumps(price_history)
        existing.is_active = True
        return False


def load_listing_history(session: Session, listing_id: str) -> dict:
    """Return historical fields for enriching a fresh listing."""
    stmt = select(ListingRecord).where(ListingRecord.listing_id == listing_id)
    rec = session.scalars(stmt).first()
    if rec is None:
        return {}

    price_history = []
    if rec.price_history_json:
        raw = json.loads(rec.price_history_json)
        price_history = [PriceRecord(**r) for r in raw]

    previous_rent = None
    if len(price_history) >= 2:
        previous_rent = price_history[-2].rent_hkd

    return {
        "first_seen_at": rec.first_seen_at,
        "last_seen_at": rec.last_seen_at,
        "price_history": price_history,
        "previous_rent": previous_rent,
    }
