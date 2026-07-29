"""28Hse search result crawler."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from ..config import load_searches, settings
from ..parsers.hse28 import Hse28Parser
from .base import AccessDeniedError, BaseCrawler, CrawlerError

logger = logging.getLogger(__name__)

# Page cache directory within a run (avoids re-fetching during development)
_CACHE_DIR = Path("data") / ".page_cache"


class Hse28Crawler(BaseCrawler):
    def __init__(self, use_cache: bool = False) -> None:
        super().__init__()
        self._use_cache = use_cache
        if use_cache:
            _CACHE_DIR.mkdir(parents=True, exist_ok=True)

    def collect(self) -> list[dict[str, Any]]:
        """Fetch all configured search URLs and return raw listing dicts."""
        searches = load_searches()
        all_results: list[dict[str, Any]] = []
        seen_ids: set[str] = set()

        for search in searches:
            url: str = search.get("url", "")
            label: str = search.get("label", url)
            max_pages: int = search.get("max_pages", settings.crawler_max_pages)

            if not url:
                logger.warning("Search entry has no URL: %s", search)
                continue

            logger.info("Crawling search: %s", label)
            try:
                results = self._crawl_search(url, label, max_pages, seen_ids)
                all_results.extend(results)
            except AccessDeniedError as exc:
                logger.error("Access denied — stopping crawl for this search: %s", exc)
                break
            except CrawlerError as exc:
                logger.error("Crawler error for '%s': %s", label, exc)
                continue

        logger.info("Collected %d unique raw listings", len(all_results))
        return all_results

    def _crawl_search(
        self,
        start_url: str,
        label: str,
        max_pages: int,
        seen_ids: set[str],
    ) -> list[dict[str, Any]]:
        results: list[dict[str, Any]] = []
        url: str | None = start_url
        page = 1

        while url and page <= max_pages:
            logger.info("  Page %d: %s", page, url)

            if settings.dry_run and page > 1:
                logger.info("  [dry-run] stopping after first page")
                break

            html = self._fetch_with_cache(url)
            parser = Hse28Parser(html, url)
            items = parser.parse_listings()

            new_on_page = 0
            for item in items:
                lid = item.get("listing_id")
                if lid and lid not in seen_ids:
                    seen_ids.add(lid)
                    item["search_label"] = label
                    results.append(item)
                    new_on_page += 1

            logger.info("  %d new items on page %d", new_on_page, page)

            if settings.dry_run:
                break

            next_url = parser.parse_next_page_url()
            if not next_url or next_url == url:
                break
            url = next_url
            page += 1

        return results

    def _fetch_with_cache(self, url: str) -> str:
        if self._use_cache:
            cache_key = url.replace("/", "_").replace(":", "").replace("?", "_")[:120]
            cache_path = _CACHE_DIR / f"{cache_key}.html"
            if cache_path.exists():
                logger.debug("Cache hit: %s", cache_path)
                return cache_path.read_text(encoding="utf-8")
            html = self.fetch(url)
            cache_path.write_text(html, encoding="utf-8")
            return html
        return self.fetch(url)
