"""Read-only scan for mojibake and UTF-8 BOM across the portfolio source.

Run: python scripts/scan-encoding.py
Prints file, line number, and count for every hit. Changes nothing.
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SCAN_DIRS = ["data", "lib", "app", "components", "public"]
SKIP_DIR_NAMES = {"node_modules", ".next", ".git", "screenshots-web"}

# Mojibake markers. Written as escapes so this file stays pure ASCII and the
# scanner can never be fooled by its own literals.
PATTERNS = {
    "a-circumflex-euro (â€)": "\u00e2\u20ac",
    "A-tilde (Ã)": "\u00c3",
    "A-circumflex (Â)": "\u00c2",
    "replacement-char-triple (ï¿½)": "\u00ef\u00bf\u00bd",
    "U+FFFD replacement char": "\ufffd",
}

TEXT_SUFFIXES = (
    ".ts", ".tsx", ".js", ".mjs", ".cjs", ".jsx", ".json", ".jsonc",
    ".md", ".css", ".txt", ".yml", ".yaml", ".toml", ".svg", ".html",
)

BOM = b"\xef\xbb\xbf"


def is_candidate(path: Path) -> bool:
    if any(part in SKIP_DIR_NAMES for part in path.parts):
        return False
    name = path.name
    if name.endswith(TEXT_SUFFIXES):
        return True
    if ".env." in name or name == ".env.example":
        return True
    # Extensionless config at the repo root is in scope: .gitignore and
    # friends have carried mojibake before.
    return name == ".gitignore" or name == ".npmrc"


def collect() -> list[Path]:
    found: list[Path] = []
    for d in SCAN_DIRS:
        base = ROOT / d
        if not base.is_dir():
            continue
        for p in base.rglob("*"):
            if p.is_file() and is_candidate(p.relative_to(ROOT)):
                found.append(p)
    for p in ROOT.glob("*.md"):
        if p.is_file():
            found.append(p)
    return sorted(found)


def main() -> int:
    files = collect()
    total_hits = 0
    bom_files = 0
    print(f"Scanned candidate text files: {len(files)}\n")

    for path in files:
        raw = path.read_bytes()
        rel = path.relative_to(ROOT)

        if raw.startswith(BOM):
            bom_files += 1
            print(f"[BOM] {rel} - UTF-8 BOM present")

        try:
            text = raw.decode("utf-8")
        except UnicodeDecodeError as exc:
            print(f"[DECODE-FAIL] {rel} - not valid UTF-8: {exc}")
            continue

        for lineno, line in enumerate(text.splitlines(), start=1):
            for label, pat in PATTERNS.items():
                count = line.count(pat)
                if count:
                    total_hits += count
                    snippet = line.strip()
                    if len(snippet) > 90:
                        snippet = snippet[:90] + "..."
                    print(
                        f"{rel}:{lineno}  {label} x{count}  |  {snippet}"
                    )

    print("\n---")
    print(f"mojibake occurrences: {total_hits}")
    print(f"files with BOM: {bom_files}")
    print(f"files scanned: {len(files)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())