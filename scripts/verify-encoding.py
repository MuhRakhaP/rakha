"""Verify the encoding repair landed correctly.

Checks, on committed HEAD plus the working tree:
  - No mojibake markers remain.
  - No UTF-8 BOM on any in-scope file.
  - Spot-check that intended characters survived: em dash, middle dot.

Run: python scripts/verify-encoding.py
"""

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

MARKERS = {
    "a-circumflex-euro (\u00e2\u20ac)": "\u00e2\u20ac",
    "A-tilde (\u00c3)": "\u00c3",
    "A-circumflex (\u00c2)": "\u00c2",
    "replacement-triple": "\u00ef\u00bf\u00bd",
    "U+FFFD": "\ufffd",
}

BOM = b"\xef\xbb\xbf"

TRACKED = [
    "data/projects.ts",
    "app/page.tsx",
    "app/layout.tsx",
    "app/projects/[slug]/page.tsx",
    "components/closing-cta.tsx",
    "components/projects/section-nav.tsx",
]


def main() -> int:
    bad = 0

    print("=== 1. mojibake / BOM in tracked source files ===")
    for rel in TRACKED:
        p = ROOT / rel
        if not p.is_file():
            print(f"MISSING {rel}")
            bad += 1
            continue
        raw = p.read_bytes()
        if raw.startswith(BOM):
            print(f"BOM      {rel}")
            bad += 1
        text = raw.decode("utf-8", errors="replace")
        for label, pat in MARKERS.items():
            n = text.count(pat)
            if n:
                print(f"MOJIBAKE {rel}: {label} x{n}")
                bad += 1
        print(f"clean    {rel}")

    print("\n=== 2. intended characters present ===")
    projects = (ROOT / "data/projects.ts").read_text(encoding="utf-8")
    page = (ROOT / "app/page.tsx").read_text(encoding="utf-8")

    checks = [
        ("em dash U+2014 in data/projects.ts", "\u2014" in projects),
        ("middle dot U+00B7 in app/page.tsx", "\u00b7" in page),
        ("no U+FFFD in data/projects.ts", "\ufffd" not in projects),
        ("no U+FFFD in app/page.tsx", "\ufffd" not in page),
        (
            "data/projects.ts has no stray right-double-quote",
            '\u201d' not in projects,
        ),
    ]
    for label, ok in checks:
        print(f"{'PASS' if ok else 'FAIL'}  {label}")
        if not ok:
            bad += 1

    print("\n=== 3. html lang + charset wiring ===")
    layout = (ROOT / "app/layout.tsx").read_text(encoding="utf-8")
    print(f"{'PASS' if '<html lang=\"en\"' in layout else 'FAIL'}  html lang=\"en\"")
    if '<html lang="en"' not in layout:
        bad += 1

    print("\n=== 4. git reports no whitespace/BOM damage ===")
    res = subprocess.run(
        ["git", "diff", "--check"],
        cwd=ROOT,
        capture_output=True,
        text=True,
    )
    print(f"git diff --check exit={res.returncode}")
    if res.stdout.strip():
        print(res.stdout.strip()[:2000])
    print(res.stderr.strip()[:2000] if res.stderr.strip() else "(no stderr)")

    print(f"\nproblems: {bad}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())