"""Independent re-verification of captured screenshots.

Does NOT trust the capture script. Re-reads each file from disk and re-checks:
  - file exists, non-empty
  - real pixel dimensions via sharp
  - not a near single-colour image (blank or error page)
  - size under the 300 KB target and well under the 500 KB harness limit
  - sha256, for the review sheet

Prints a table. Exits non-zero if any file fails.

Usage: python scripts/verify-captures.py <dir> [max-bytes]
"""

import hashlib
import json
import subprocess
import sys
from pathlib import Path

DIR = Path(sys.argv[1])
MAX_BYTES = int(sys.argv[2]) if len(sys.argv) > 2 else 300_000

# WebP has no built-in decoder in the stdlib; use sharp through node so the
# check uses the same library the capture wrote with.
NODE_SNIPPET = r"""
const sharp = require('sharp');
const fs = require('fs');
// With `node -e`, argv[0] is the executable and argv[1] is the first user
// argument. slice(1) is correct here; slice(2) would silently skip one file.
const files = process.argv.slice(1);
(async () => {
  const out = [];
  for (const f of files) {
    try {
      const buf = fs.readFileSync(f);
      const meta = await sharp(buf).metadata();
      const stats = await sharp(buf).resize(64, 64, { fit: 'inside' }).raw().toBuffer({ resolveWithObject: true });
      const ch = stats.info.channels;
      const d = stats.data;
      let min = 255, max = 0;
      const buckets = new Set();
      for (let i = 0; i < d.length; i += ch) {
        const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        if (lum < min) min = lum;
        if (lum > max) max = lum;
        buckets.add((d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4));
      }
      out.push({
        file: f, ok: true, width: meta.width, height: meta.height,
        format: meta.format, bytes: buf.length,
        colours: buckets.size, luma: Math.round(max - min),
      });
    } catch (e) {
      out.push({ file: f, ok: false, error: String(e.message || e) });
    }
  }
  process.stdout.write(JSON.stringify(out));
})();
"""


def main() -> int:
    files = sorted(DIR.glob("*.webp"))
    if not files:
        print(f"no .webp files in {DIR}")
        return 1

    proc = subprocess.run(
        ["node", "-e", NODE_SNIPPET, *[str(f) for f in files]],
        capture_output=True,
        text=True,
        cwd=Path(__file__).resolve().parent.parent,
    )
    if proc.returncode != 0:
        print("sharp probe failed:", proc.stderr.strip()[:400])
        return 1

    stats = {Path(r["file"]).name: r for r in json.loads(proc.stdout)}

    print(f"{'file':26} {'dims':>12} {'size':>9} {'colours':>8} {'luma':>6}  verdict")
    print("-" * 78)

    failures = 0
    rows = []
    for f in files:
        s = stats.get(f.name, {})
        name = f.name
        size = f.stat().st_size
        sha = hashlib.sha256(f.read_bytes()).hexdigest()

        if not s.get("ok"):
            print(f"{name:26} {'-':>12} {size:>9} {'-':>8} {'-':>6}  FAIL ({s.get('error','unreadable')})")
            failures += 1
            continue

        problems = []
        if s["width"] != 1440 or s["height"] != 900:
            problems.append(f"dims {s['width']}x{s['height']} != 1440x900")
        if size < 5_000:
            problems.append(f"file suspiciously small ({size}B)")
        if size > MAX_BYTES:
            problems.append(f"over {MAX_BYTES//1000}KB target ({size}B)")
        if s["colours"] <= 2:
            problems.append(f"near single-colour ({s['colours']})")
        if s["luma"] < 10:
            problems.append(f"near-uniform luma ({s['luma']})")

        verdict = "ok" if not problems else "FAIL: " + "; ".join(problems)
        if problems:
            failures += 1

        print(f"{name:26} {s['width']}x{s['height']:>6} {size:>9} {s['colours']:>8} {s['luma']:>6}  {verdict}")
        rows.append({
            "file": name,
            "path": str(f),
            "width": s["width"],
            "height": s["height"],
            "bytes": size,
            "colours": s["colours"],
            "luma": s["luma"],
            "sha256": sha,
            "ok": not problems,
        })

    print(f"\n{len(files)} file(s), {failures} failure(s)")
    Path(__file__).resolve().parent.parent.joinpath("scripts/screenshots/capture-verify.json").write_text(
        json.dumps(rows, indent=2), encoding="utf-8", newline="\n"
    )
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())