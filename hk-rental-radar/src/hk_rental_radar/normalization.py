"""District name normalization and unit conversions."""

from __future__ import annotations

# Maps Chinese/English variants → canonical English district name
DISTRICT_MAP: dict[str, str] = {
    # Hong Kong Island
    "中環": "Central",
    "central": "Central",
    "上環": "Sheung Wan",
    "sheung wan": "Sheung Wan",
    "西營盤": "Sai Ying Pun",
    "sai ying pun": "Sai Ying Pun",
    "堅尼地城": "Kennedy Town",
    "kennedy town": "Kennedy Town",
    "西區": "Western District",
    "western district": "Western District",
    "灣仔": "Wan Chai",
    "wan chai": "Wan Chai",
    "銅鑼灣": "Causeway Bay",
    "causeway bay": "Causeway Bay",
    "跑馬地": "Happy Valley",
    "happy valley": "Happy Valley",
    "北角": "North Point",
    "north point": "North Point",
    "太古": "Quarry Bay",
    "quarry bay": "Quarry Bay",
    "西灣河": "Sai Wan Ho",
    "sai wan ho": "Sai Wan Ho",
    "筲箕灣": "Shau Kei Wan",
    "shau kei wan": "Shau Kei Wan",
    "柴灣": "Chai Wan",
    "chai wan": "Chai Wan",
    "南區": "Southern District",
    "southern district": "Southern District",
    "香港仔": "Aberdeen",
    "aberdeen": "Aberdeen",
    "赤柱": "Stanley",
    "stanley": "Stanley",
    # Kowloon
    "尖沙咀": "Tsim Sha Tsui",
    "tsim sha tsui": "Tsim Sha Tsui",
    "tst": "Tsim Sha Tsui",
    "佐敦": "Jordan",
    "jordan": "Jordan",
    "油麻地": "Yau Ma Tei",
    "yau ma tei": "Yau Ma Tei",
    "旺角": "Mong Kok",
    "mong kok": "Mong Kok",
    "太子": "Prince Edward",
    "prince edward": "Prince Edward",
    "深水埗": "Sham Shui Po",
    "sham shui po": "Sham Shui Po",
    "長沙灣": "Cheung Sha Wan",
    "cheung sha wan": "Cheung Sha Wan",
    "荔枝角": "Lai Chi Kok",
    "lai chi kok": "Lai Chi Kok",
    "奧運": "Olympic",
    "olympic": "Olympic",
    "大角咀": "Tai Kok Tsui",
    "tai kok tsui": "Tai Kok Tsui",
    "何文田": "Ho Man Tin",
    "ho man tin": "Ho Man Tin",
    "九龍塘": "Kowloon Tong",
    "kowloon tong": "Kowloon Tong",
    "九龍城": "Kowloon City",
    "kowloon city": "Kowloon City",
    "土瓜灣": "To Kwa Wan",
    "to kwa wan": "To Kwa Wan",
    "馬頭涌": "Ma Tau Wai",
    "ma tau wai": "Ma Tau Wai",
    "紅磡": "Hung Hom",
    "hung hom": "Hung Hom",
    "黃大仙": "Wong Tai Sin",
    "wong tai sin": "Wong Tai Sin",
    "慈雲山": "Tsz Wan Shan",
    "tsz wan shan": "Tsz Wan Shan",
    "九龍灣": "Kowloon Bay",
    "kowloon bay": "Kowloon Bay",
    "牛頭角": "Ngau Tau Kok",
    "ngau tau kok": "Ngau Tau Kok",
    "觀塘": "Kwun Tong",
    "kwun tong": "Kwun Tong",
    "藍田": "Lam Tin",
    "lam tin": "Lam Tin",
    "油塘": "Yau Tong",
    "yau tong": "Yau Tong",
    # West Kowloon / new developments
    "西九龍": "West Kowloon",
    "west kowloon": "West Kowloon",
    "南昌": "Nam Cheong",
    "nam cheong": "Nam Cheong",
    "柯士甸": "Austin",
    "austin": "Austin",
    # New Territories (partial)
    "沙田": "Sha Tin",
    "sha tin": "Sha Tin",
    "大埔": "Tai Po",
    "tai po": "Tai Po",
    "荃灣": "Tsuen Wan",
    "tsuen wan": "Tsuen Wan",
    "屯門": "Tuen Mun",
    "tuen mun": "Tuen Mun",
    "元朗": "Yuen Long",
    "yuen long": "Yuen Long",
}

# Preferred target districts per user profile
PREFERRED_DISTRICTS = {
    "Kennedy Town",
    "Sai Ying Pun",
    "Sheung Wan",
    "Olympic",
    "Tai Kok Tsui",
    "Ho Man Tin",
    "Jordan",
    "Kowloon Tong",
    "West Kowloon",
    "Nam Cheong",
    "Austin",
}


def normalize_district(raw: str | None) -> str | None:
    """Return canonical English district name or None if unrecognized."""
    if not raw:
        return None
    key = raw.strip().lower()
    return DISTRICT_MAP.get(key) or DISTRICT_MAP.get(raw.strip())


def is_preferred_district(district: str | None) -> bool:
    if not district:
        return False
    return district in PREFERRED_DISTRICTS


def sqm_to_sqft(sqm: float) -> int:
    return round(sqm * 10.764)


def sqft_to_sqm(sqft: float) -> float:
    return round(sqft / 10.764, 1)


def parse_area(raw: str | None) -> tuple[int | None, str]:
    """
    Parse area string like '750 ft²', '70 m²', '750sqft'.
    Returns (int_value_in_sqft, unit_detected).
    """
    if not raw:
        return None, "unknown"
    raw = raw.strip().replace(",", "")

    import re

    m = re.search(r"(\d+(?:\.\d+)?)\s*(ft²?|sqft|square feet?)", raw, re.IGNORECASE)
    if m:
        return round(float(m.group(1))), "sqft"

    m = re.search(r"(\d+(?:\.\d+)?)\s*(m²?|sqm|square met)", raw, re.IGNORECASE)
    if m:
        return sqm_to_sqft(float(m.group(1))), "sqm"

    # Bare number fallback — skip if the string looks like a price ($ or HK)
    if not re.search(r"[$HK]", raw, re.IGNORECASE):
        m = re.search(r"(\d+)", raw)
        if m:
            return int(m.group(1)), "unknown"

    return None, "unknown"


def parse_rent(raw: str | None) -> int | None:
    """Parse rent string like 'HK$28,000', '$28000/月'. Returns int HKD."""
    if not raw:
        return None
    import re

    raw = raw.replace(",", "").replace(" ", "")
    m = re.search(r"\d+", raw)
    if m:
        return int(m.group())
    return None
