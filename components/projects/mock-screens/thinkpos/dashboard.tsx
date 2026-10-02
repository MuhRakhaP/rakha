import { DUMMY } from "@/data/mock-screens";

import {
  AppBar,
  BarRow,
  DataRows,
  Field,
  MicroLabel,
  Panel,
  PhoneScreen,
  Pill,
  StatTile,
  Stack,
} from "../primitives";

const nav = [
  "Dashboard",
  "Kasir",
  "Shift",
  "Produk & Inventori",
  "Pelanggan & Poin",
  "Karyawan & Capster",
  "Laporan",
  "Pengaturan",
];

/**
 * THINKPOS admin dashboard.
 *
 * Layout read from `D:\thinkpos\lib\sections\dashboard_overview_section.dart`,
 * top to bottom: a conditional low-stock banner, a KPI grid of seven tiles,
 * then an analytics row of three cards (payment split, staff performance,
 * low-stock alerts), then the "Transaksi Hari Ini" table.
 *
 * The seven tile labels and the table's column headers are the app's own
 * strings. Values are invented.
 */
export function ThinkPosDashboard() {
  const d = DUMMY.thinkpos;

  const kpis = [
    { label: "Shift: Aktif", value: "09:00", sub: "Mulai: 09:00", tint: "bg-emerald-500" },
    { label: "Laci Kas", value: "Rp 1.620.000", tint: "bg-indigo-500" },
    { label: "Omset", value: "Rp 4.320.000", tint: "bg-blue-500" },
    { label: "Manajemen Pengeluaran", value: "Rp 640.000", tint: "bg-rose-500" },
    { label: "Profit", value: "Rp 3.680.000", tint: "bg-emerald-600" },
    { label: "Total Tip", value: "Rp 95.000", tint: "bg-orange-500" },
    { label: "Pesanan", value: "38", tint: "bg-violet-500" },
  ];

  return (
    <PhoneScreen>
      <AppBar title="Dashboard" />

      <div className="flex-1 overflow-hidden p-2">
        <Stack gap="md">
          {/* Conditional low-stock banner, as in the source. */}
          <div className="flex items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1.5">
            <div className="min-w-0">
              <p className="text-[0.5625rem] font-semibold text-amber-800">
                Peringatan Stok Tipis!
              </p>
              <p className="truncate text-[0.5rem] text-amber-900">
                Ada 2 produk yang stoknya hampir habis (&lt;= 5).
              </p>
            </div>
            <Pill tone="warn">Detail</Pill>
          </div>

          {/* KPI grid: 2 columns on a phone, as the source sets <600px -> 2. */}
          <div className="grid grid-cols-2 gap-1.5">
            {kpis.map((kpi) => (
              <StatTile
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                sub={kpi.sub}
                tint={kpi.tint}
              />
            ))}
          </div>

          {/* Analytics row, stacked on a phone. */}
          <Panel
            title="Payment Distribution"
            subtitle="Perbandingan QRIS vs Tunai hari ini"
          >
            <BarRow
              suffix="%"
              items={[
                { label: "Cash", value: d.paymentShare[0].pct },
                { label: "QRIS", value: d.paymentShare[1].pct },
                { label: "Transfer", value: d.paymentShare[2].pct },
              ]}
              max={100}
            />
          </Panel>

          <Panel title="Performa Capster" subtitle="Jumlah Potong Hari Ini">
            <ul className="flex flex-col gap-1.5">
              {d.staff.map((person) => (
                <li key={person.name} className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="h-3.5 w-3.5 rounded-full bg-muted"
                  />
                  <span className="flex-1 truncate text-[0.5625rem]">
                    {person.name}
                  </span>
                  <Pill tone="brand">{person.cuts}x</Pill>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Peringatan Inventori"
            subtitle="Item di bawah ambang batas (5)"
          >
            <ul className="flex flex-col gap-1.5">
              {d.products
                .filter((product) => product.stock <= 5)
                .map((product) => (
                  <li key={product.name} className="flex items-center gap-1.5">
                    <span className="flex-1 truncate text-[0.5625rem]">
                      {product.name}
                    </span>
                    <span className="text-[0.5rem] text-rose-700">
                      Sisa: {product.stock}
                    </span>
                  </li>
                ))}
            </ul>
          </Panel>

          <Panel
            title="Transaksi Hari Ini"
            subtitle="Daftar transaksi yang dilakukan hari ini"
          >
            <DataRows
              head={["Nomor Nota", "Pelanggan", "Waktu", "Metode", "Total", "Tip"]}
              rows={d.transactions.map((t) => [
                t.bill,
                t.customer,
                t.time,
                t.method,
                t.total,
                t.tip,
              ])}
            />
          </Panel>

          <Field label="Pencarian layar" placeholder="Cari produk atau pelanggan" />
        </Stack>
      </div>

      {/* The admin rail is a left navigation on wide layouts only; the phone
          layout keeps the same items in a compact strip so the order is still
          legible. */}
      <div className="border-t border-border bg-card px-1.5 py-1">
        <MicroLabel>{nav.join(" · ")}</MicroLabel>
      </div>
    </PhoneScreen>
  );
}