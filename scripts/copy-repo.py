"""Copy a source repo into the temp workdir, excluding everything sensitive.

Read-only against the source: never writes to it, never runs git there.
Excludes .git, node_modules, any .env*, uploads, build output, and keys.

Usage: python scripts/copy-repo.py <src> <dst>
"""

import shutil
import sys
from pathlib import Path

# Directory names never copied.
SKIP_DIRS = {
    ".git",
    "node_modules",
    ".next",
    ".turbo",
    "dist",
    "build",
    "out",
    "uploads",
    "coverage",
    ".dart_tool",
    ".idea",
    ".vscode",
    ".gradle",
    "temp",
    "backups",
    "logs",
}

# File suffixes/patterns never copied.
SKIP_SUFFIXES = {".pem", ".key", ".p12", ".pfx", ".log", ".tsbuildinfo"}

# Exact filenames never copied.
SKIP_NAMES = {
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    "login.json",
    "refresh.json",
}

COPY_SKIP = shutil.ignore_patterns(
    ".git",
    "node_modules",
    ".next",
    ".turbo",
    "dist",
    "build",
    "out",
    "coverage",
    ".dart_tool",
    ".gradle",
    ".env",
    ".env.*",
    "*.pem",
    "*.key",
    "*.log",
    "uploads",
    "*.tsbuildinfo",
)


def main() -> int:
    src = Path(sys.argv[1]).resolve()
    dst = Path(sys.argv[2]).resolve()

    if not src.is_dir():
        print(f"source missing: {src}")
        return 1

    if dst.exists():
        print(f"destination exists, removing first: {dst}")
        shutil.rmtree(dst)

    shutil.copytree(
        src,
        dst,
        ignore=COPY_SKIP,
        symlinks=False,
        ignore_dangling_symlinks=True,
    )

    # Post-pass: remove anything matching the strict lists that ignore_patterns
    # may have let through (e.g. nested "uploads" dirs).
    removed = 0
    for root, dirs, files in os_walk(dst):
        for d in list(dirs):
            if d in SKIP_DIRS:
                shutil.rmtree(Path(root) / d, ignore_errors=True)
                dirs.remove(d)
                removed += 1
        for f in files:
            if f in SKIP_NAMES or Path(f).suffix in SKIP_SUFFIXES:
                (Path(root) / f).unlink(missing_ok=True)
                removed += 1

    total = sum(1 for _ in dst.rglob("*") if _.is_file())
    print(f"copied {src} -> {dst}")
    print(f"files in copy: {total}")
    print(f"extra removals: {removed}")

    # Confirm no env file survived.
    survivors = [
        str(p.relative_to(dst))
        for p in dst.rglob("*")
        if p.is_file()
        and (p.name == ".env" or p.name.startswith(".env."))
        and ".env.example" not in p.name
        and ".env.sample" not in p.name
        and ".env.template" not in p.name
    ]
    if survivors:
        print("ERROR: env files present in copy:")
        for s in survivors:
            print(f"  {s}")
        return 1

    print("verified: no .env files in the copy")
    return 0


def os_walk(root: Path):
    import os

    return os.walk(root)


if __name__ == "__main__":
    sys.exit(main())