# HK Rental Radar

Daily Hong Kong rental listing monitor for a specific household:

- Person A works in **Central** (Hong Kong Island)
- Person B is a postgraduate student at **City University of Hong Kong** (Kowloon Tong)
- Target rent: HKD 25,000–35,000 / month
- Both commutes within 60 minutes

Every day the pipeline collects listings from [28Hse](https://en.28hse.com),
normalizes and deduplicates them, scores them deterministically, sends the
top-ranked results to Claude for Korean-language analysis, and writes a
Markdown report to `reports/YYYY-MM-DD.md`.

---

## Quick Start

### 1. Prerequisites

- Python 3.12+
- An [Anthropic API key](https://console.anthropic.com/)

### 2. Install

```bash
cd hk-rental-radar
pip install -e ".[dev]"
```

### 3. Configure

```bash
cp .env.example .env
# Edit .env — add your ANTHROPIC_API_KEY
```

Review `config/preferences.yaml` and `config/searches.yaml`.
The search URLs in `searches.yaml` are placeholders — verify them against
the live 28Hse site before first use.

### 4. Validate parser (recommended before first real crawl)

Save a 28Hse search result page as HTML and run:

```bash
hk-rental-radar validate-parser /path/to/saved_page.html
```

Update the selectors in `src/hk_rental_radar/parsers/hse28.py` if coverage
is low, then re-run validation.

### 5. Test with dry run

```bash
hk-rental-radar crawl --dry-run --cache
```

This fetches only the first page of each search and caches the HTML. No
detail pages are requested.

### 6. Full pipeline

```bash
hk-rental-radar run
```

Or step by step:

```bash
hk-rental-radar crawl              # → data/raw_listings.json
hk-rental-radar analyze            # → data/analysis.json (calls Claude)
hk-rental-radar report             # → reports/YYYY-MM-DD.md
```

---

## Commands

| Command | Description |
|---------|-------------|
| `hk-rental-radar crawl` | Fetch search pages, save raw JSON |
| `hk-rental-radar analyze` | Normalize, score, call Claude, save analysis |
| `hk-rental-radar report` | Render Markdown report from analysis JSON |
| `hk-rental-radar run` | Full pipeline (crawl → analyze → report) |
| `hk-rental-radar validate-parser FILE` | Test parser against saved HTML |

All commands accept `--debug` for verbose logging.

---

## GitHub Actions (automated daily run)

1. Add `ANTHROPIC_API_KEY` as a repository secret in GitHub Settings → Secrets.
2. The workflow at `.github/workflows/daily_rental_report.yml` runs at
   00:13 HKT daily and commits the report to the repository.
3. Use **Actions → Run workflow** for a manual trigger.
4. Pass `dry_run: true` to test without calling Claude.

---

## Project structure

```
hk-rental-radar/
├── config/
│   ├── preferences.yaml    ← Household profile (budget, areas, commute limits)
│   └── searches.yaml       ← 28Hse search URLs to crawl
├── prompts/
│   ├── analysis_system.txt ← Claude system prompt for JSON analysis
│   └── article_system.txt  ← Claude system prompt for Korean article
├── templates/
│   └── daily_report.md.j2  ← Jinja2 Markdown template
├── src/hk_rental_radar/
│   ├── config.py           ← Settings (pydantic-settings + YAML loaders)
│   ├── models.py           ← Pydantic data models
│   ├── database.py         ← SQLAlchemy 2 + SQLite persistence
│   ├── crawlers/
│   │   ├── base.py         ← Abstract crawler (robots.txt, rate limiting)
│   │   └── hse28.py        ← 28Hse concrete crawler
│   ├── parsers/
│   │   └── hse28.py        ← HTML parser (all CSS selectors centralized here)
│   ├── normalization.py    ← District names, area units, rent parsing
│   ├── duplicate_detection.py ← Content hash + probabilistic dedup
│   ├── commute.py          ← Static MTR journey time table
│   ├── scoring.py          ← Deterministic scoring before LLM
│   ├── llm_analysis.py     ← Anthropic API calls (analyze + article)
│   ├── report.py           ← Jinja2 rendering
│   ├── publisher.py        ← Write reports to filesystem
│   └── cli.py              ← Click CLI
├── tests/
│   ├── fixtures/
│   │   └── hse28_search_page.html  ← Sanitized HTML for parser tests
│   ├── test_parsers.py
│   ├── test_scoring.py
│   ├── test_normalization.py
│   └── test_duplicate_detection.py
├── reports/                ← Generated Markdown reports (committed)
├── data/output/            ← Generated JSON output (committed)
├── .env.example
├── pyproject.toml
└── requirements.txt
```

---

## Compliance notes

- Reads and respects `robots.txt` before every crawl.
- Applies a configurable delay between requests (default 2.5 s).
- Uses an identifiable User-Agent including a contact email.
- Never downloads or republishes listing images.
- Stores only short excerpts of listing descriptions, not full copies.
- Every report links back to the original 28Hse listing.
- Does not bypass login, CAPTCHA, or anti-bot measures.

If 28Hse changes its markup or robots.txt, update `parsers/hse28.py`
and re-run `validate-parser` before the next scheduled run.

---

## Running tests

```bash
cd hk-rental-radar
pytest
```

Tests use only local fixture files — no network calls.

---

## Updating parser selectors

When 28Hse updates its HTML:

1. Save a search result page (File → Save Page As in Chrome).
2. Run `hk-rental-radar validate-parser saved_page.html`.
3. Update the `SEL` dict in `src/hk_rental_radar/parsers/hse28.py`.
4. Re-run validation until all key fields show < 20% missing.
5. Update the test fixture if needed.
