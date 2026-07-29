"""Settings and configuration loaders."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Paths relative to the project root (hk-rental-radar/)
_PROJECT_ROOT = Path(__file__).parent.parent.parent

CONFIG_DIR = _PROJECT_ROOT / "config"
PROMPTS_DIR = _PROJECT_ROOT / "prompts"
TEMPLATES_DIR = _PROJECT_ROOT / "templates"
REPORTS_DIR = _PROJECT_ROOT / "reports"
DATA_OUTPUT_DIR = _PROJECT_ROOT / "data" / "output"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_PROJECT_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    anthropic_api_key: str = Field(default="")
    anthropic_model: str = Field(default="claude-sonnet-5")

    # Crawler behaviour
    crawler_user_agent: str = Field(
        default=(
            "hk-rental-radar/0.1 "
            "(+https://github.com/shimyawn/hasla; hayeonhayeon0@gmail.com)"
        )
    )
    crawler_delay_seconds: float = Field(default=2.5)
    crawler_timeout_seconds: float = Field(default=30.0)
    crawler_max_pages: int = Field(default=10)
    dry_run: bool = Field(default=False)

    # LLM limits
    max_listings_for_llm: int = Field(default=20)

    # DB
    db_path: str = Field(default="data/hk_rental_radar.db")

    @property
    def db_url(self) -> str:
        return f"sqlite:///{_PROJECT_ROOT / self.db_path}"


def load_preferences() -> dict[str, Any]:
    path = CONFIG_DIR / "preferences.yaml"
    with path.open(encoding="utf-8") as f:
        return yaml.safe_load(f)  # type: ignore[return-value]


def load_searches() -> list[dict[str, Any]]:
    path = CONFIG_DIR / "searches.yaml"
    with path.open(encoding="utf-8") as f:
        data: dict[str, Any] = yaml.safe_load(f)
    return data.get("searches", [])


settings = Settings()
