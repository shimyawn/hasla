"""Write reports and JSON output to the filesystem."""

from __future__ import annotations

import json
import logging
from datetime import date
from pathlib import Path

from .config import DATA_OUTPUT_DIR, REPORTS_DIR
from .models import DailyRunResult, LLMAnalysisOutput, ScoredListing

logger = logging.getLogger(__name__)


def publish(
    run_result: DailyRunResult,
    report_md: str,
) -> tuple[Path, Path]:
    """Write the Markdown report and JSON output. Returns (report_path, json_path)."""
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    DATA_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    today = run_result.run_date.isoformat()

    report_path = REPORTS_DIR / f"{today}.md"
    json_path = DATA_OUTPUT_DIR / f"{today}.json"

    report_path.write_text(report_md, encoding="utf-8")
    logger.info("Report written: %s", report_path)

    json_data = run_result.model_dump(mode="json")
    json_path.write_text(json.dumps(json_data, ensure_ascii=False, indent=2), encoding="utf-8")
    logger.info("JSON output written: %s", json_path)

    return report_path, json_path


def write_failure_log(run_date: date, errors: list[str]) -> Path:
    """Write a failure log when the run fails, preserving the previous report."""
    log_path = REPORTS_DIR / f"{run_date.isoformat()}_failure.log"
    log_path.write_text("\n".join(errors), encoding="utf-8")
    logger.info("Failure log written: %s", log_path)
    return log_path
