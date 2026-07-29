"""Abstract base crawler with rate limiting and robots.txt compliance."""

from __future__ import annotations

import logging
import time
from abc import ABC, abstractmethod
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

import httpx

from ..config import settings

logger = logging.getLogger(__name__)


class CrawlerError(Exception):
    pass


class AccessDeniedError(CrawlerError):
    """Raised when the site blocks the request — do not retry."""


class BaseCrawler(ABC):
    def __init__(self) -> None:
        self._robot_parsers: dict[str, RobotFileParser] = {}
        self._last_request_at: float = 0.0
        self._client = httpx.Client(
            headers={"User-Agent": settings.crawler_user_agent},
            follow_redirects=True,
            timeout=settings.crawler_timeout_seconds,
        )

    def close(self) -> None:
        self._client.close()

    def __enter__(self) -> "BaseCrawler":
        return self

    def __exit__(self, *_: object) -> None:
        self.close()

    # ------------------------------------------------------------------
    def can_fetch(self, url: str) -> bool:
        """Check robots.txt before fetching a URL."""
        parsed = urlparse(url)
        base = f"{parsed.scheme}://{parsed.netloc}"
        if base not in self._robot_parsers:
            rp = RobotFileParser()
            rp.set_url(f"{base}/robots.txt")
            try:
                rp.read()
            except Exception as exc:
                logger.warning("Could not read robots.txt for %s: %s", base, exc)
                # Conservative: allow if robots.txt is unreachable
                rp.allow_all = True  # type: ignore[attr-defined]
            self._robot_parsers[base] = rp
        return self._robot_parsers[base].can_fetch(settings.crawler_user_agent, url)

    def fetch(self, url: str, *, allow_redirects: bool = True) -> str:
        """Rate-limited fetch. Raises AccessDeniedError on 403/429."""
        if not self.can_fetch(url):
            raise AccessDeniedError(f"robots.txt disallows: {url}")

        elapsed = time.monotonic() - self._last_request_at
        if elapsed < settings.crawler_delay_seconds:
            time.sleep(settings.crawler_delay_seconds - elapsed)

        logger.debug("GET %s", url)
        try:
            resp = self._client.get(url)
        except httpx.RequestError as exc:
            raise CrawlerError(f"Network error fetching {url}: {exc}") from exc
        finally:
            self._last_request_at = time.monotonic()

        if resp.status_code == 403:
            raise AccessDeniedError(f"403 Forbidden: {url}")
        if resp.status_code == 429:
            raise AccessDeniedError(f"429 Rate limited: {url}")
        if resp.status_code == 404:
            raise CrawlerError(f"404 Not found: {url}")
        if resp.status_code >= 400:
            raise CrawlerError(f"HTTP {resp.status_code}: {url}")

        return resp.text

    @abstractmethod
    def collect(self) -> list[dict]:
        """Fetch and return raw listing dicts."""
        ...
