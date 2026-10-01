"""Print the measured dimensions of every captured screenshot.

Reads the verification JSON written by verify-captures.py, so the numbers are
the file's real pixel size rather than anything the capture script claimed.

Usage: python scripts/screenshots/dims.py
"""

import json
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
VERIFY = REPO / "scripts/screenshots/capture-verify.json"

data = json.loads(VERIFY.read_text(encoding="utf-8"))
for row in data:
    print(f"{row['width']}x{row['height']}  {row['file']}")
