"""Markdown report rendering via Jinja2."""

from __future__ import annotations

from datetime import date, datetime
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, StrictUndefined

from .config import TEMPLATES_DIR
from .models import DailyRunResult, LLMAnalysisOutput, ScoredListing


def render_report(
    run_result: DailyRunResult,
    scored_listings: list[ScoredListing],
    article_ko: str,
) -> str:
    """Render the final Markdown report using the Jinja2 template."""
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        undefined=StrictUndefined,
        autoescape=False,
    )

    # Custom filters
    env.filters["hkd"] = lambda v: f"HKD {v:,}" if v else "N/A"
    env.filters["sqft"] = lambda v: f"{v:,} ft²" if v else "N/A"
    env.filters["min"] = lambda v: f"{v} 분" if v else "미확인"
    env.filters["isodate"] = lambda v: v.isoformat() if v else "미확인"

    listings_by_id = {sl.listing.listing_id: sl for sl in scored_listings}

    template = env.get_template("daily_report.md.j2")
    return template.render(
        run_date=run_result.run_date,
        generated_at=datetime.now().strftime("%Y-%m-%d %H:%M HKT"),
        run_result=run_result,
        scored_listings=scored_listings,
        listings_by_id=listings_by_id,
        article_ko=article_ko,
        analysis=run_result.analysis,
    )
