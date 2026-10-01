"""Find which commit introduced the mojibake, by scanning history.

Checks each commit touching a file for the mojibake markers, so the first
committing commit is identified rather than guessed.

Run: python scripts/find-corruption-source.py
"""

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FILES = ["data/projects.ts", "app/page.tsx", ".gitignore"]

MARKERS = ["\u00e2\u20ac", "\u00c3", "\u00c2", "\u00ef\u00bf\u00bd", "\ufffd"]

BOM = b"\xef\xbb\xbf"


def commits_for(path: str) -> list[str]:
    res = subprocess.run(
        ["git", "log", "--format=%h %s", "--", path],
        cwd=ROOT, capture_output=True, text=True,
    )
    out = []
    for line in res.stdout.strip().splitlines():
        if not line.strip():
            continue
        sha, subject = line.split(" ", 1)
        out.append((sha, subject))
    return out


def blob_at(rev: str, path: str) -> bytes | None:
    res = subprocess.run(
        ["git", "show", f"{rev}:{path}"],
        cwd=ROOT, capture_output=True,
    )
    if res.returncode != 0:
        return None
    return res.stdout


def main() -> int:
    for path in FILES:
        print(f"\n=== {path} ===")
        history = commits_for(path)
        # Walk newest -> oldest, report the boundary where mojibake appears.
        found_first_bad = None
        for sha, subject in history:
            blob = blob_at(sha, path)
            if blob is None:
                continue
            has_bom = blob.startswith(BOM)
            try:
                text = blob.decode("utf-8")
            except UnicodeDecodeError:
                print(f"  {sha}  NOT-UTF8  {subject}")
                found_first_bad = found_first_bad or (sha, subject, "not-utf8")
                continue
            counts = {m: text.count(m) for m in MARKERS if text.count(m)}
            if counts:
                if found_first_bad is None:
                    found_first_bad = (sha, subject, f"mojibake {counts}"
                                       + (" +BOM" if has_bom else ""))
                    print(f"  {sha}  MOJIBAKE {counts}"
                          f"{' +BOM' if has_bom else ''}  {subject}")
                    print("  ^ first commit in this file with mojibake "
                          "(newest-first scan)")
                else:
                    print(f"  {sha}  mojibake           {subject}")
            else:
                print(f"  {sha}  clean               {subject}")
                if found_first_bad is not None:
                    print(f"  -> introduced by {found_first_bad[0]} "
                          f"({found_first_bad[2]})")
                    break
        if found_first_bad is None:
            print("  no mojibake found in history")

    return 0


if __name__ == "__main__":
    sys.exit(main())