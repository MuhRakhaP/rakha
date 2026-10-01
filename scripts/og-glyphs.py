"""Report the OG-relevant strings and their non-ASCII codepoints.

Satori (next/og) needs a font containing the glyphs used in the OG image.
This lists exactly which non-ASCII characters reach the OG renderer so the
font coverage question can be answered with evidence rather than guessed.

Run: python scripts/og-glyphs.py
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main() -> int:
    t = (ROOT / "data/projects.ts").read_text(encoding="utf-8")

    print("=== project names rendered in OG ===")
    for m in re.finditer(r'^\s+name:\s*"([^"]+)"', t, re.M):
        s = m.group(1)
        na = sorted({f"U+{ord(c):04X} {c!r}" for c in s if ord(c) > 127})
        print(f"  {s!r} -> {na or 'ascii only'}")

    print("\n=== taglines rendered in OG ===")
    for m in re.finditer(r'tagline:\s*"([^"]+)"', t, re.S):
        s = m.group(1).strip()
        na = sorted({f"U+{ord(c):04X} {c!r}" for c in s if ord(c) > 127})
        print(f"  {s[:64]!r}...")
        print(f"      non-ascii: {na or 'ascii only'}")

    print("\n=== site.name (OG footer) ===")
    site = (ROOT / "lib/site.ts").read_text(encoding="utf-8")
    m = re.search(r'name:\s*"([^"]+)"', site)
    if m:
        s = m.group(1)
        na = sorted({f"U+{ord(c):04X} {c!r}" for c in s if ord(c) > 127})
        print(f"  {s!r} -> {na or 'ascii only'}")

    print("\n=== font wiring in opengraph-image.tsx ===")
    og = (ROOT / "app/projects/[slug]/opengraph-image.tsx").read_text(encoding="utf-8")
    for line in og.splitlines():
        if "fontFamily" in line or "fonts" in line.lower():
            print(f"  {line.strip()}")

    if "fontFamily" not in og:
        print("\n  No fontFamily declared: satori falls back to its built-in")
        print("  font. That built-in covers Latin-1 + em dash, which is all the")
        print("  OG strings above use. Verify visually on a device that the")
        print("  em dash renders as a glyph and not as a blank box.")
        return 0

    return 0


if __name__ == "__main__":
    sys.exit(main())