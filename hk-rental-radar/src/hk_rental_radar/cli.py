"""CLI entry point — commands: crawl, analyze, report, run, validate-parser."""

from __future__ import annotations

import json
import logging
import sys
from datetime import date, datetime
from pathlib import Path

import click

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("hk_rental_radar")


@click.group()
@click.option("--debug", is_flag=True, help="Enable debug logging")
def cli(debug: bool) -> None:
    """HK Rental Radar — daily Hong Kong rental report generator."""
    if debug:
        logging.getLogger().setLevel(logging.DEBUG)


@cli.command()
@click.option("--dry-run", is_flag=True, help="Fetch only first page, no detail pages")
@click.option("--cache", is_flag=True, help="Cache fetched HTML pages for this run")
@click.option("--output", default="data/raw_listings.json", show_default=True)
def crawl(dry_run: bool, cache: bool, output: str) -> None:
    """Crawl 28Hse search pages and save raw listing dicts to JSON."""
    from .config import settings
    from .crawlers.hse28 import Hse28Crawler
    from .database import init_db

    if dry_run:
        import os
        os.environ["DRY_RUN"] = "true"
        # Reload settings to pick up env change
        settings.dry_run = True

    init_db()
    out_path = Path(output)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with Hse28Crawler(use_cache=cache) as crawler:
        results = crawler.collect()

    out_path.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    click.echo(f"Saved {len(results)} raw listings → {out_path}")


@cli.command()
@click.argument("raw_json", default="data/raw_listings.json")
@click.option("--output", default="data/analysis.json", show_default=True)
def analyze(raw_json: str, output: str) -> None:
    """Normalize, score, deduplicate, then call Claude for analysis."""
    from datetime import date, datetime

    from .commute import get_commute_times, get_nearest_mtr
    from .config import settings
    from .database import get_session, init_db, load_listing_history, upsert_listing
    from .duplicate_detection import compute_content_hash, find_duplicates, mark_duplicates
    from .llm_analysis import analyze_listings, generate_article
    from .models import DailyRunResult, RentalListing
    from .normalization import normalize_district, parse_area, parse_rent
    from .scoring import rank_listings

    init_db()
    raw = json.loads(Path(raw_json).read_text(encoding="utf-8"))
    now = datetime.now()
    today = date.today()

    # Build RentalListing objects
    listings: list[RentalListing] = []
    for item in raw:
        try:
            district = normalize_district(item.get("district_raw"))
            rent = parse_rent(item.get("rent_raw"))
            if not rent:
                continue

            area_sqft, area_source = parse_area(item.get("area_raw"))
            is_gross = area_source in ("unknown",) and area_sqft is not None

            central_min, cityu_min = get_commute_times(district)
            nearest_mtr = get_nearest_mtr(district)

            listing = RentalListing(
                listing_id=item["listing_id"],
                url=item["url"],
                title=item.get("title", ""),
                district=district,
                estate_name=item.get("estate_raw"),
                monthly_rent_hkd=rent,
                saleable_area_sqft=None if is_gross else area_sqft,
                gross_area_sqft=area_sqft if is_gross else None,
                swimming_pool=item.get("has_pool"),
                clubhouse=item.get("has_clubhouse"),
                serviced_apartment=bool(item.get("is_serviced")),
                commute_to_central_minutes=central_min,
                commute_to_cityu_minutes=cityu_min,
                nearest_mtr=nearest_mtr,
                description_excerpt=(item.get("description_raw") or "")[:300] or None,
                image_urls=item.get("image_urls", [])[:5],
                collected_at=now,
            )
            listing.content_hash = compute_content_hash(listing)
            listings.append(listing)
        except Exception as exc:
            logger.warning("Skipping malformed listing: %s", exc)
            continue

    # Enrich from DB history and upsert
    with get_session() as session:
        for listing in listings:
            history = load_listing_history(session, listing.listing_id)
            if history:
                listing.first_seen_at = history["first_seen_at"]
                listing.last_seen_at = history["last_seen_at"]
                listing.price_history = history["price_history"]
                listing.previous_rent = history["previous_rent"]
                listing.is_new_today = False
                listing.is_price_reduced = (
                    listing.previous_rent is not None
                    and listing.monthly_rent_hkd < listing.previous_rent
                )
            else:
                listing.is_new_today = True
            upsert_listing(session, listing, now)
        session.commit()

    # Deduplicate
    dup_groups = find_duplicates(listings)
    suppressed = mark_duplicates(listings, dup_groups)
    if suppressed:
        logger.info("Suppressing %d probable duplicate listings", len(suppressed))
    unique_listings = [l for l in listings if l.listing_id not in suppressed]

    # Score and filter
    scored = rank_listings(unique_listings)
    qualified = [s for s in scored if s.passed_hard_filter]
    top_for_llm = qualified[: settings.max_listings_for_llm]

    click.echo(
        f"Total: {len(listings)} → deduplicated: {len(unique_listings)} → "
        f"qualified: {len(qualified)} → sending to LLM: {len(top_for_llm)}"
    )

    if not top_for_llm:
        click.echo("No qualified listings to analyze.")
        sys.exit(0)

    # LLM
    analysis = analyze_listings(top_for_llm)
    listings_by_id = {s.listing.listing_id: s for s in top_for_llm}
    article_ko = generate_article(analysis, listings_by_id)

    # Persist
    run_result = DailyRunResult(
        run_date=today,
        listings_collected=len(listings),
        listings_after_filter=len(qualified),
        listings_sent_to_llm=len(top_for_llm),
        analysis=analysis,
        article_ko=article_ko,
    )

    out_path = Path(output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(
        json.dumps(run_result.model_dump(mode="json"), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    click.echo(f"Analysis saved → {out_path}")


@cli.command()
@click.argument("analysis_json", default="data/analysis.json")
def report(analysis_json: str) -> None:
    """Render Markdown report from analysis JSON and publish to reports/."""
    from .models import DailyRunResult
    from .publisher import publish
    from .report import render_report
    from .scoring import rank_listings

    data = json.loads(Path(analysis_json).read_text(encoding="utf-8"))
    run_result = DailyRunResult.model_validate(data)

    # For rendering we need scored_listings — rebuild minimal stubs
    # (full listing data is in the analysis JSON for the article)
    article_ko = run_result.article_ko or ""
    report_md = render_report(run_result, [], article_ko)

    report_path, json_path = publish(run_result, report_md)
    click.echo(f"Report: {report_path}")
    click.echo(f"JSON:   {json_path}")


@cli.command()
@click.option("--dry-run", is_flag=True)
@click.option("--cache", is_flag=True)
def run(dry_run: bool, cache: bool) -> None:
    """Full pipeline: crawl → analyze → report."""
    from pathlib import Path
    ctx = click.get_current_context()
    ctx.invoke(crawl, dry_run=dry_run, cache=cache, output="data/raw_listings.json")
    ctx.invoke(analyze, raw_json="data/raw_listings.json", output="data/analysis.json")
    ctx.invoke(report, analysis_json="data/analysis.json")


@cli.command("validate-parser")
@click.argument("html_file", type=click.Path(exists=True))
def validate_parser(html_file: str) -> None:
    """Test the 28Hse parser against a saved HTML file and report coverage."""
    from .parsers.hse28 import Hse28Parser

    html = Path(html_file).read_text(encoding="utf-8")
    parser = Hse28Parser(html, html_file)
    items = parser.parse_listings()
    report = parser.coverage_report()
    total_count = parser.parse_total_count()

    click.echo(f"\nParsed {len(items)} listing items")
    if total_count:
        click.echo(f"Reported total on page: {total_count}")
    click.echo(f"\nField coverage (out of {report['total_items']} items):")
    for field, missing in sorted(report["missing_fields"].items()):
        total = report["total_items"] or 1
        pct_missing = missing / total * 100
        status = "OK" if pct_missing < 20 else "WARN" if pct_missing < 50 else "FAIL"
        click.echo(f"  [{status}] {field}: missing in {missing}/{total} ({pct_missing:.0f}%)")

    if items:
        click.echo("\nFirst parsed item:")
        click.echo(json.dumps(items[0], ensure_ascii=False, indent=2))
