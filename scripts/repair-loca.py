"""Surgical fix for the Yoon Meoli TTFs.

OTS rejects the source files because the loca table goes non-monotonic at
glyph 17146 (offset drops to 0 from 1.6 MB). loca[i+1] - loca[i] is the
length of glyph i's data; any decreasing offset means a glyph with a
negative-length data slice, which OTS treats as fatal.

Strategy:
  1. Open the font in lazy mode and grab the raw loca + glyf bytes from
     the reader (avoids the broken-glyf decompile path).
  2. Decode the loca offsets according to head.indexToLocFormat.
  3. Walk the offsets — wherever the next offset is lower than the last
     valid one, clamp it to the last valid offset. That makes the
     affected glyph a zero-length entry (effectively a /.notdef
     reference) while keeping the file structurally sound.
  4. Re-encode loca, swap the table's bytes back into the reader, and
     save the font as WOFF1.

The broken glyphs are far past anything Korean-relevant (glyph 17146 is
deep into Hanja / extended-CJK territory which this site never renders),
so zeroing them out has no visible effect.
"""
import struct
from pathlib import Path
from fontTools.ttLib import TTFont, getTableModule
from fontTools.ttLib.tables._l_o_c_a import table__l_o_c_a

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src' / 'fonts'


def repair(src_path: Path, out_path: Path) -> None:
    print(f'\n-> {src_path.name}')

    # Read whole file ourselves so we can patch loca before letting
    # fontTools touch it.
    raw = src_path.read_bytes()

    # Parse the table directory manually to find loca and head tables.
    # SFNT header: 4-byte sfntVersion + 2-byte numTables + 6 bytes padding
    num_tables = struct.unpack('>H', raw[4:6])[0]
    tables = {}
    for i in range(num_tables):
        entry = raw[12 + i * 16: 12 + (i + 1) * 16]
        tag = entry[0:4].decode('ascii', errors='replace')
        # checksum (uint32) + offset (uint32) + length (uint32)
        _, offset, length = struct.unpack('>III', entry[4:16])
        tables[tag] = (offset, length)

    # Pull head.indexToLocFormat (offset 50 in the head table)
    head_off, _ = tables['head']
    loca_format = struct.unpack('>h', raw[head_off + 50: head_off + 52])[0]
    # 0 = short (uint16, value*2), 1 = long (uint32)

    loca_off, loca_len = tables['loca']
    loca_raw = raw[loca_off: loca_off + loca_len]

    if loca_format == 0:
        n = loca_len // 2
        offsets = list(struct.unpack(f'>{n}H', loca_raw))
        offsets = [o * 2 for o in offsets]
    else:
        n = loca_len // 4
        offsets = list(struct.unpack(f'>{n}I', loca_raw))

    print(f'  loca entries: {n}, format: {"short" if loca_format == 0 else "long"}')

    # Repair: clamp non-monotonic offsets to the previous valid offset.
    fixed = [offsets[0]]
    repaired_count = 0
    for i in range(1, len(offsets)):
        nxt = offsets[i]
        if nxt < fixed[-1]:
            fixed.append(fixed[-1])  # zero-length glyph
            repaired_count += 1
        else:
            fixed.append(nxt)
    print(f'  repaired offsets: {repaired_count}')

    # Re-encode loca
    if loca_format == 0:
        new_loca = struct.pack(f'>{len(fixed)}H', *[o // 2 for o in fixed])
    else:
        new_loca = struct.pack(f'>{len(fixed)}I', *fixed)

    # Now load with fontTools using the patched loca. Easiest way: write
    # the patched TTF to a temp buffer with loca replaced, then load that.
    # Replace loca bytes at the same offset (lengths must match — which they
    # do because we only swapped values, not entry count).
    assert len(new_loca) == loca_len, f'loca length mismatch: {len(new_loca)} vs {loca_len}'
    patched = bytearray(raw)
    patched[loca_off: loca_off + loca_len] = new_loca

    # Save patched bytes to a temp file, then re-serialize as WOFF1
    tmp_ttf = src_path.with_suffix('.patched.ttf')
    tmp_ttf.write_bytes(bytes(patched))

    try:
        font = TTFont(str(tmp_ttf), lazy=True, recalcBBoxes=False,
                      recalcTimestamp=False)
        # Force name decompile so it gets re-sorted on save
        _ = font['name'].names
        if 'DSIG' in font:
            del font['DSIG']
        font.flavor = 'woff'
        font.save(str(out_path))
        font.close()
    finally:
        tmp_ttf.unlink(missing_ok=True)

    print(f'  {src_path.stat().st_size:,}  ->  {out_path.stat().st_size:,}')


def main():
    for stem in ('yoon-meoli-light', 'yoon-meoli-ultralight'):
        src = SRC / f'{stem}.ttf'
        out = SRC / f'{stem}.woff'
        repair(src, out)
    print('\nDone.')


if __name__ == '__main__':
    main()
