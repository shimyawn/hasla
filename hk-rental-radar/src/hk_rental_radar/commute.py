"""Static MTR commute time estimates.

All times are approximate door-to-door minutes.
They assume:
  - 5 min walk to nearest MTR station
  - Standard MTR journey time (off-peak)
  - 5 min walk from station to destination

Update with real measured times once on the ground.
Destinations:
  CENTRAL_DEST  — Central station area (exact building adjusts ±10 min)
  CITYU_DEST    — Kowloon Tong MTR + ~8 min walk to City University main campus
"""

from __future__ import annotations

# (central_minutes, cityu_minutes)
# None means data not available — do not infer
DISTRICT_COMMUTE: dict[str, tuple[int, int]] = {
    # Hong Kong Island
    "Kennedy Town": (25, 55),
    "Sai Ying Pun": (20, 50),
    "Sheung Wan": (12, 45),
    "Central": (5, 40),
    "Admiralty": (8, 42),
    "Wan Chai": (12, 43),
    "Causeway Bay": (15, 45),
    "Happy Valley": (18, 48),
    "North Point": (22, 48),
    "Quarry Bay": (25, 50),
    "Sai Wan Ho": (27, 52),
    "Shau Kei Wan": (30, 55),
    "Chai Wan": (35, 58),
    "Aberdeen": (35, 60),
    "Stanley": (55, 75),
    # Kowloon — Tsim Sha Tsui / Jordan
    "Tsim Sha Tsui": (22, 35),
    "Jordan": (25, 30),
    "Yau Ma Tei": (28, 25),
    "Mong Kok": (32, 22),
    "Prince Edward": (34, 20),
    # Kowloon — west / Olympic area
    "Olympic": (33, 23),
    "Tai Kok Tsui": (37, 25),
    "Nam Cheong": (28, 25),
    "West Kowloon": (25, 28),
    "Austin": (24, 29),
    # Kowloon — inner
    "Sham Shui Po": (35, 25),
    "Cheung Sha Wan": (38, 27),
    "Lai Chi Kok": (40, 28),
    "Ho Man Tin": (32, 18),
    "Kowloon Tong": (38, 10),
    "Kowloon City": (35, 18),
    "To Kwa Wan": (35, 20),
    "Hung Hom": (28, 22),
    "Wong Tai Sin": (42, 20),
    "Tsz Wan Shan": (45, 22),
    "Kowloon Bay": (45, 25),
    "Ngau Tau Kok": (48, 28),
    "Kwun Tong": (50, 30),
    "Lam Tin": (52, 32),
    "Yau Tong": (55, 35),
    # New Territories (likely out of budget range but included for completeness)
    "Sha Tin": (55, 35),
    "Tai Po": (70, 45),
    "Tsuen Wan": (50, 45),
    "Tuen Mun": (75, 65),
    "Yuen Long": (80, 70),
}

# Nearest MTR station per district (for display purposes)
DISTRICT_NEAREST_MTR: dict[str, str] = {
    "Kennedy Town": "Kennedy Town (WIL)",
    "Sai Ying Pun": "Sai Ying Pun (WIL)",
    "Sheung Wan": "Sheung Wan (HKL)",
    "Central": "Central (HKL/TWL)",
    "Admiralty": "Admiralty (HKL/ISL)",
    "Wan Chai": "Wan Chai (ISL)",
    "Causeway Bay": "Causeway Bay (ISL)",
    "Happy Valley": "Causeway Bay (ISL)",
    "North Point": "North Point (ISL)",
    "Quarry Bay": "Quarry Bay (ISL)",
    "Sai Wan Ho": "Sai Wan Ho (ISL)",
    "Shau Kei Wan": "Shau Kei Wan (ISL)",
    "Chai Wan": "Chai Wan (ISL)",
    "Tsim Sha Tsui": "Tsim Sha Tsui (TWL/EAL)",
    "Jordan": "Jordan (TWL)",
    "Yau Ma Tei": "Yau Ma Tei (TWL)",
    "Mong Kok": "Mong Kok (TWL/KWL)",
    "Prince Edward": "Prince Edward (TWL/KWL)",
    "Olympic": "Olympic (TCL)",
    "Tai Kok Tsui": "Olympic (TCL)",
    "Nam Cheong": "Nam Cheong (TML/TCL)",
    "West Kowloon": "Austin (TCL/HSR)",
    "Austin": "Austin (TCL/HSR)",
    "Ho Man Tin": "Ho Man Tin (TML)",
    "Kowloon Tong": "Kowloon Tong (KWL/EAL)",
    "Hung Hom": "Hung Hom (TML/EAL)",
}


def get_commute_times(district: str | None) -> tuple[int | None, int | None]:
    """Return (central_minutes, cityu_minutes) for a district, or (None, None)."""
    if not district:
        return None, None
    data = DISTRICT_COMMUTE.get(district)
    if data is None:
        return None, None
    return data


def get_nearest_mtr(district: str | None) -> str | None:
    if not district:
        return None
    return DISTRICT_NEAREST_MTR.get(district)
