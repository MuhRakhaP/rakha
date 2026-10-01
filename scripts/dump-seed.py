"""Read-only dump of the seeded KOPIFLOW data, for eyeballing dummy content.

Prints business columns only. Never selects a password hash, token, or any
column whose name contains hash/token/secret/password.

Usage: python scripts/dump-seed.py
"""

import subprocess
import sys

CONTAINER = "shot-kopiflow-db"
DB_USER = "shotadmin"
DB_NAME = "kopiflow_shot"

QUERIES = [
    ("users", "SELECT email, name, role, is_active FROM users"),
    ("suppliers", "SELECT name, contact, address FROM suppliers ORDER BY name"),
    ("customers", "SELECT name, contact, address FROM customers ORDER BY name"),
    ("pembelian", "SELECT date::text, coffee_type, weight_kg, price_per_kg, total_price FROM pembelian ORDER BY date"),
    ("produksi", "SELECT date::text, product_name, input_weight_kg, output_weight_kg, loss_kg FROM produksi ORDER BY date"),
    ("biaya_tk", "SELECT date::text, jenis, nama_pekerja, nominal FROM biaya_tenaga_kerja ORDER BY date"),
    ("biaya_op", "SELECT date::text, sub_kategori, deskripsi, nominal FROM biaya_operasional ORDER BY date"),
    ("penjualan", "SELECT date::text, total_price FROM penjualan ORDER BY date"),
    ("stok", "SELECT coffee_type, stock_kind, type, quantity_kg, balance_after FROM stok_movements ORDER BY id LIMIT 12"),
]


def psql(sql: str) -> str:
    assert sql.strip().upper().startswith("SELECT"), "only SELECT allowed"
    res = subprocess.run(
        ["docker", "exec", "-i", CONTAINER, "psql", "-U", DB_USER, "-d", DB_NAME, "-At", "-F", " | ", "-c", sql],
        capture_output=True,
        text=True,
    )
    if res.returncode != 0:
        return f"ERROR: {res.stderr.strip()[:200]}"
    return res.stdout


def main() -> int:
    for label, sql in QUERIES:
        print(f"\n=== {label} ===")
        out = psql(sql).rstrip()
        if not out:
            print("  (no rows)")
            continue
        for line in out.splitlines():
            print(f"  {line}")
    return 0


if __name__ == "__main__":
    sys.exit(main())