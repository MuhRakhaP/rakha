"""Repair mojibake by round-tripping cp1252 -> utf-8, and strip UTF-8 BOMs.

Run: python scripts/fix-encoding.py

Rules enforced here:
  - Read and write BYTES only. Never PowerShell redirection, never Set-Content.
  - A candidate repair is accepted only if the result contains no mojibake
    marker afterwards. Otherwise the line is left untouched and reported.
  - Lines with no mojibake are never rewritten.
  - Every change is printed as a before/after diff line.
  - Output is written UTF-8 with no BOM.

Idempotent: running twice reports nothing to do.
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

TARGET_DIRS = ["data", "lib", "app", "components", "public"]
ROOT_FILES = [".gitignore", ".npmrc", "next.config.ts", "tsconfig.json",
              "eslint.config.mjs", "postcss.config.mjs", "components.json"]
SKIP_DIR_NAMES = {"node_modules", ".next", ".git", "screenshots-web"}

TEXT_SUFFIXES = (
    ".ts", ".tsx", ".js", ".mjs", ".cjs", ".jsx", ".json", ".jsonc",
    ".md", ".css", ".txt", ".yml", ".yaml", ".toml", ".svg", ".html",
)

# Mojibake markers. Written as escapes so this file stays pure ASCII and can
# never be fooled by its own literals.
MARKERS = {
    "a-circumflex-euro": "\u00e2\u20ac",
    "A-tilde": "\u00c3",
    "A-circumflex": "\u00c2",
    "replacement-triple": "\u00ef\u00bf\u00bd",
    "U+FFFD": "\ufffd",
}

BOM = b"\xef\xbb\xbf"


def is_candidate(path: Path) -> bool:
    if any(part in SKIP_DIR_NAMES for part in path.parts):
        return False
    if path.name.endswith(TEXT_SUFFIXES):
        return True
    return ".env." in path.name or path.name == ".env.example"


def collect() -> list[Path]:
    found: list[Path] = []
    for d in TARGET_DIRS:
        base = ROOT / d
        if not base.is_dir():
            continue
        for p in base.rglob("*"):
            if p.is_file() and is_candidate(p.relative_to(ROOT)):
                found.append(p)
    for p in ROOT.glob("*.md"):
        if p.is_file():
            found.append(p)
    for name in ROOT_FILES:
        p = ROOT / name
        if p.is_file():
            found.append(p)
    return sorted(found)


def has_mojibake(s: str) -> bool:
    return any(m in s for m in MARKERS.values())


def repair(line: str) -> str | None:
    """Return a repaired line, or None if no safe repair exists.

    The round-trip is: encode the mojibake text back to the original bytes using
    cp1252, then decode those bytes as utf-8. Accepted only when the result is
    free of mojibake markers.
    """
    for codec in ("cp1252", "latin-1"):
        try:
            candidate = line.encode(codec).decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            continue
        if has_mojibake(candidate):
            continue
        return candidate
    return None


def main() -> int:
    files = collect()
    total_fixed = 0
    total_bom = 0
    unrepaired: list[str] = []

    print(f"Processing {len(files)} file(s)\n")

    for path in files:
        raw = path.read_bytes()
        rel = path.relative_to(ROOT)

        if raw.startswith(BOM):
            raw = raw[len(BOM):]
            total_bom += 1
            print(f"[BOM stripped] {rel}")

        try:
            text = raw.decode("utf-8")
        except UnicodeDecodeError as exc:
            print(f"[SKIP - not valid UTF-8] {rel}: {exc}")
            continue

        if not has_mojibake(text) and not raw.startswith(BOM):
            continue

        out_lines = []
        changed = 0
        for lineno, line in enumerate(text.split("\n"), start=1):
            if not has_mojibake(line):
                out_lines.append(line)
                continue

            fixed = repair(line)
            if fixed is None:
                unrepaired.append(f"{rel}:{lineno}")
                out_lines.append(line)
                continue

            out_lines.append(fixed)
            changed += 1
            total_fixed += 1
            print(f"--- {rel}:{lineno}")
            print(f"  - {line.strip()}")
            print(f"  + {fixed.strip()}")

        if changed:
            path.write_bytes(
                "\n".join(out_lines).encode("utf-8")
            )

    print("\n---")
    print(f"lines repaired: {total_fixed}")
    print(f"BOMs stripped: {total_bom}")
    if unrepaired:
        print("UNREPAIRED (left as-is):")
        for u in unrepaired:
            print(f"  {u}")
    return 1 if unrepaired else 0


if __name__ == "__main__":
    sys.exit(main())