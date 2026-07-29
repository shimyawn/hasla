"""HTML parser for 28Hse search result pages.

ALL CSS selectors live here. Update this file when 28Hse changes its markup.
Run `hk-rental-radar validate-parser <saved_page.html>` to check coverage.

NOTE: Selectors below are best-guess placeholders. Verify against a real
saved search result page before relying on them.
"""

from __future__ import annotations

import logging
import re
from datetime import date, datetime
from typing import Any, Optional
from urllib.parse import urljoin

from bs4 import BeautifulSoup, Tag

logger = logging.getLogger(__name__)

BASE_URL = "https://en.28hse.com"

# ---------------------------------------------------------------------------
# CSS selectors — all in one place for easy update
# ---------------------------------------------------------------------------
SEL = {
    # Listing container
    "listing_items": "div.item, div.prop-item, li.listing-item",
    # Within each item
    "listing_link": "a.item-link, a.item-title, a[href*='/rent/detail/'], a[href*='/en/rent/']",
    "title": "div.item-title a, h3.item-title, span.item-title",
    "rent": "div.item-price, span.price, div.price, span.item-price",
    "district": "div.item-district, span.district, div.prop-district",
    "estate": "div.item-estate, span.estate-name, div.estate",
    "bedrooms": "span.room-num, span.bedroom, div.bedrooms",
    "area": "span.item-area, span.area, div.area",
    "facilities": "span.facility, div.facilities, ul.amenity-list",
    "available_date": "span.available-date, div.avail-from",
    "listing_date": "span.post-date, div.listing-date, time",
    "agent": "div.agent-name, span.agent, div.source-tag",
    "description": "div.item-desc, p.description, div.prop-desc",
    "images": "div.item-photo img, div.photo-wrap img, img.main-photo",
    # Pagination
    "next_page": "a.next, a[rel='next'], li.next a, .pagination a:last-child",
    # Total count
    "total_count": "span.total-count, div.result-count, h2.result-count",
}

# Keywords that suggest serviced apartment
SERVICED_KEYWORDS = {"serviced", "service apartment", "服務式", "服务式"}

# Keywords that suggest facilities
POOL_KEYWORDS = {"swimming pool", "pool", "泳池", "游泳池"}
CLUBHOUSE_KEYWORDS = {"clubhouse", "club house", "會所", "会所"}


class Hse28Parser:
    def __init__(self, html: str, page_url: str = "") -> None:
        self._soup = BeautifulSoup(html, "html.parser")
        self._page_url = page_url
        self._missing_fields: dict[str, int] = {}
        self._total_items = 0

    def parse_listings(self) -> list[dict[str, Any]]:
        """Parse all listing items from the page. Returns raw dicts."""
        items = self._soup.select(SEL["listing_items"])
        self._total_items = len(items)
        results = []
        for item in items:
            try:
                parsed = self._parse_item(item)
                if parsed:
                    results.append(parsed)
            except Exception as exc:
                logger.warning("Failed to parse listing item: %s", exc)
        self._log_coverage()
        return results

    def parse_total_count(self) -> Optional[int]:
        el = self._soup.select_one(SEL["total_count"])
        if not el:
            return None
        m = re.search(r"(\d[\d,]*)", el.get_text())
        if m:
            return int(m.group(1).replace(",", ""))
        return None

    def parse_next_page_url(self) -> Optional[str]:
        el = self._soup.select_one(SEL["next_page"])
        if not el:
            return None
        href = el.get("href", "")
        if not href or href == "#":
            return None
        return urljoin(BASE_URL, str(href))

    # ------------------------------------------------------------------
    def _parse_item(self, item: Tag) -> Optional[dict[str, Any]]:
        link_el = item.select_one(SEL["listing_link"])
        if not link_el:
            self._track_missing("listing_link")
            return None

        href = link_el.get("href", "")
        url = urljoin(BASE_URL, str(href))
        listing_id = self._extract_listing_id(str(href))
        if not listing_id:
            return None

        title = self._text(item, "title") or link_el.get_text(strip=True)
        rent_raw = self._text(item, "rent")
        district_raw = self._text(item, "district")
        estate_raw = self._text(item, "estate")
        bedrooms_raw = self._text(item, "bedrooms")
        area_raw = self._text(item, "area")
        available_raw = self._text(item, "available_date")
        listing_date_raw = self._text(item, "listing_date")
        agent_raw = self._text(item, "agent")
        desc_raw = self._text(item, "description")

        images = [
            str(img.get("src", ""))
            for img in item.select(SEL["images"])
            if img.get("src")
        ]

        facility_text = " ".join(
            el.get_text(" ", strip=True)
            for el in item.select(SEL["facilities"])
        ).lower()
        desc_lower = (desc_raw or "").lower()
        combined_text = facility_text + " " + desc_lower

        return {
            "listing_id": listing_id,
            "url": url,
            "title": title,
            "rent_raw": rent_raw,
            "district_raw": district_raw,
            "estate_raw": estate_raw,
            "bedrooms_raw": bedrooms_raw,
            "area_raw": area_raw,
            "available_raw": available_raw,
            "listing_date_raw": listing_date_raw,
            "agent_raw": agent_raw,
            "description_raw": desc_raw,
            "image_urls": images,
            "has_pool": any(k in combined_text for k in POOL_KEYWORDS),
            "has_clubhouse": any(k in combined_text for k in CLUBHOUSE_KEYWORDS),
            "is_serviced": any(k in combined_text for k in SERVICED_KEYWORDS),
        }

    def _text(self, item: Tag, selector_key: str) -> Optional[str]:
        el = item.select_one(SEL[selector_key])
        if el:
            return el.get_text(" ", strip=True) or None
        self._track_missing(selector_key)
        return None

    def _track_missing(self, key: str) -> None:
        self._missing_fields[key] = self._missing_fields.get(key, 0) + 1

    def _log_coverage(self) -> None:
        if self._total_items == 0:
            logger.warning("No listing items found on page — selectors may need updating")
            return
        for field, count in self._missing_fields.items():
            pct = count / self._total_items * 100
            logger.info("Parser field '%s' missing in %.0f%% of items", field, pct)

    @staticmethod
    def _extract_listing_id(href: str) -> Optional[str]:
        """Extract numeric ID from URLs like /en/rent/detail/12345."""
        m = re.search(r"/(\d{5,})", href)
        if m:
            return m.group(1)
        # Fallback: use the full path segment
        parts = [p for p in href.split("/") if p]
        if parts:
            return parts[-1]
        return None

    def coverage_report(self) -> dict[str, Any]:
        return {
            "total_items": self._total_items,
            "missing_fields": self._missing_fields,
        }
