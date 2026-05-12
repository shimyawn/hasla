"""Re-serialize the Yoon Meoli TTFs into properly-sorted WOFF1.

Two things going on:
  1. WOFF1 wrapper: shrinks ~45% via per-table zlib, and the WOFF1 directory
     is automatically written in canonical (tag-sorted) order — addressing
     OTS's 'Table directory is not correctly ordered' / 'bad rangeShift'
     complaints.
  2. Touching the 'name' table forces fontTools to decompile + recompile it,
     which re-sorts the name records (the original TTFs had unsorted records
     that Chrome's OTS rejected).

The 'glyf'/'loca' tables stay as raw bytes — we can't touch those without
choking on the broken offset table, but Chrome historically only enforced
strict loca ordering for WOFF2 (which normalises glyf+loca) and is more
lenient on WOFF1/TTF for that specific check. Worth a try; if Chrome still
balks, we'll need to repair the font in FontForge or swap families.
"""
from fontTools.ttLib import TTFont
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src' / 'fonts'

for stem in ('yoon-meoli-light', 'yoon-meoli-ultralight'):
    src = SRC / f'{stem}.ttf'
    out = SRC / f'{stem}.woff'
    print(f'\n-> {src.name}')

    font = TTFont(str(src), lazy=True, recalcBBoxes=False, recalcTimestamp=False)

    # Force-decompile the name table so fontTools re-sorts its records on save
    _ = font['name'].names
    # Also drop the DSIG (digital signature) table — it has no use on the web
    # and sometimes causes downstream tools to choke.
    if 'DSIG' in font:
        del font['DSIG']

    font.flavor = 'woff'
    font.save(str(out))
    font.close()

    print(f'  {src.stat().st_size:,}  ->  {out.stat().st_size:,}')

print('\nDone.')
