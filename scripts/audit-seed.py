"""Read-only audit of the seeded KOPIFLOW database via psql over docker exec.

Reports row counts per table, then scans every text column for anything that
looks like real data: real email domains, public IPs, Indonesian phone numbers,
JWTs, secret markers, or password hashes.

Prints SELECT only. Secret-shaped values are redacted, never shown.

Usage:
  python scripts/audit-seed.py <container> <db-user> <db-name>
"""

import re
import subprocess
import sys

CONTAINER = sys.argv[1] if len(sys.argv) > 1 else "shot-kopiflow-db"
DB_USER = sys.argv[2] if len(sys.argv) > 2 else "shotadmin"
DB_NAME = sys.argv[3] if len(sys.argv) > 3 else "kopiflow_shot"

REAL_EMAIL = re.compile(
    r"@(?!(example\.(com|test)|roastery\.id)\b)[a-z0-9.-]+\.[a-z]{2,}", re.I
)
# An IPv4 literal: four dot-separated octets. Checked with ipaddress afterwards,
# because "Coffee Shop 88" and "Jl. Merdeka No. 12" are not addresses.
IPV4_LITERAL = re.compile(r"(?<![\d.])(?:\d{1,3}\.){3}\d{1,3}(?![\d.])")


def is_public_ip(text: str) -> bool:
    """True only for a syntactically valid IPv4 that is publicly routable."""
    import ipaddress

    for m in IPV4_LITERAL.finditer(text):
        candidate = m.group(0)
        try:
            addr = ipaddress.IPv4Address(candidate)
        except ValueError:
            continue
        if not (
            addr.is_private
            or addr.is_loopback
            or addr.is_link_local
            or addr.is_multicast
            or addr.is_reserved
            or addr.is_unspecified
        ):
            return True
    return False
PHONE = re.compile(r"(?<!\d)(?:\+?62|0)\d{8,13}(?!\d)")
JWT = re.compile(r"\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]+")
SECRET = re.compile(r"\b(sk-[A-Za-z0-9]{8,}|Bearer\s+\S+|BEGIN [A-Z ]*PRIVATE KEY)", re.I)
HASH = re.compile(r"\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}")

REDACT = {"secret", "jwt", "bcrypt-hash"}


def psql(sql: str) -> str:
    """Run SQL in the container and return stdout. Read-only queries only."""
    assert re.match(r"^\s*(SELECT|WITH)\b", sql, re.I), "only SELECT allowed"
    res = subprocess.run(
        ["docker", "exec", "-i", CONTAINER, "psql", "-U", DB_USER, "-d", DB_NAME, "-At", "-F", "|", "-c", sql],
        capture_output=True,
        text=True,
    )
    if res.returncode != 0:
        raise RuntimeError(res.stderr.strip()[:400])
    return res.stdout


def main() -> int:
    print("=== row counts ===")
    counts = psql(
        "SELECT relname, n_live_tup FROM pg_stat_user_tables "
        "WHERE n_live_tup > 0 ORDER BY relname;"
    )
    for line in counts.strip().splitlines():
        print(f"  {line}")

    print("\n=== text columns to scan ===")
    cols = psql(
        "SELECT table_name, column_name FROM information_schema.columns "
        "WHERE table_schema='public' "
        "AND data_type IN ('text','character varying','character') "
        "ORDER BY table_name, ordinal_position;"
    ).strip().splitlines()

    tables: dict[str, list[str]] = {}
    for line in cols:
        if "|" not in line:
            continue
        tbl, col = line.split("|", 1)
        tables.setdefault(tbl.strip(), []).append(col.strip())

    total_cols = sum(len(v) for v in tables.values())
    print(f"  {len(tables)} tables, {total_cols} text columns")

    print("\n=== scanning ===")
    findings = []
    scanned = 0

    for tbl, columns in tables.items():
        selects = " UNION ALL ".join(
            f"SELECT '{tbl}' AS t, '{col}' AS c, \"{col}\"::text AS v FROM \"{tbl}\" "
            f"WHERE \"{col}\" IS NOT NULL"
            for col in columns
        )
        sql = f"SELECT t, c, v FROM ({selects}) sub ORDER BY t, c;"
        try:
            rows = psql(sql)
        except RuntimeError as exc:
            print(f"  {tbl}: skipped ({str(exc)[:80]})")
            continue

        for line in rows.splitlines():
            if line.count("|") < 2:
                continue
            t, c, v = line.split("|", 2)
            scanned += 1
            if REAL_EMAIL.search(v):
                findings.append((t, c, "real-email", v[:60]))
            if is_public_ip(v):
                findings.append((t, c, "public-ip", v[:60]))
            if PHONE.search(v):
                findings.append((t, c, "phone", v[:60]))
            for label, pat in (("jwt", JWT), ("secret", SECRET), ("bcrypt-hash", HASH)):
                if pat.search(v):
                    findings.append((t, c, label, "<redacted>"))

    print(f"  values scanned: {scanned}")
    print()
    if findings:
        print("POTENTIAL REAL DATA / SECRET-SHAPED VALUES:")
        for t, c, label, shown in findings[:60]:
            print(f"  {t}.{c}: {label} -> {shown!r}")
        if len(findings) > 60:
            print(f"  ... and {len(findings) - 60} more")
        return 1

    print("clean: no real emails, public IPs, phones, JWTs, secrets, or hashes in text columns")
    return 0


if __name__ == "__main__":
    sys.exit(main())