import { DUMMY } from "@/data/mock-screens";

import {
  AppBar,
  BarRow,
  DataRows,
  MicroLabel,
  Panel,
  PhoneScreen,
  Pill,
  Stack,
  StatTile,
  TrendLine,
} from "../primitives";

/**
 * THINKPOS reports, admin variant.
 *
 * Layout read from `D:\thinkpos\lib\sections\legacy_report_section.dart`: a
 * header, a five-tile KPI board, a revenue trend line, then paired tables and
 * charts, a weekday bar chart, and a cash audit log table. The screen is one
 * long page with no tabs in the admin variant.
 *
 * Section titles, KPI labels and table headers are the app's own strings.
 * Every figure is invented, and the movements are mixed so the panel reads as
 * a working screen rather than a highlight reel.
 */
export function ThinkPosReports() {
  const d = DUMMY.thinkpos;

  return (
    <PhoneScreen>
      <AppBar title="Laporan" />

      <div className="flex-1 overflow-hidden p-2">
        <Stack gap="md">
          <div>
            <h3 className="text-xs font-bold">Business Intelligence Dashboard</h3>
            <p className="mt-0.5 text-[0.5rem] text-muted-foreground">
              Periode: 01 Sep 2026 - 02 Oct 2026
            </p>
            <div className="mt-1.5 flex items-center gap-1">
              <Pill tone="brand">Barber</Pill>
              <Pill>Export</Pill>
              <Pill tone="brand">Range</Pill>
            </div>
          </div>

          {/* Five-tile KPI board. */}
          <div className="grid grid-cols-2 gap-1.5">
            {d.reportKpis.map((kpi) => (
              <StatTile key={kpi.label} label={kpi.label} value={kpi.value} />
            ))}
          </div>

          <Panel
            title="Tren Pertumbuhan Pendapatan"
            subtitle="Lintasan kinerja keuangan harian"
          >
            <TrendLine points={d.revenueTrend} />
            <MicroLabel>14 hari</MicroLabel>
          </Panel>

          <Panel
            title="Peringkat Produk"
            subtitle="Produk terlaris berdasarkan pendapatan"
          >
            <DataRows
              head={["Produk & Inventori", "Qty", "Omset"]}
              rows={d.topProducts.map((p) => [p.name, p.qty, p.revenue])}
            />
          </Panel>

          <Panel
            title="Rincian Pengeluaran"
            subtitle="Biaya operasional pada periode ini"
          >
            <DataRows
              head={["Deskripsi", "Kategori", "Total"]}
              rows={d.expenses.map((e) => [e.desc, e.category, e.total])}
            />
          </Panel>

          <Panel title="Pangsa Kategori" subtitle="Pendapatan berdasarkan kategori">
            <BarRow
              suffix="%"
              items={d.categoryShare.map((c) => ({ label: c.name, value: c.pct }))}
              max={100}
            />
          </Panel>

          <Panel title="Metode Pembayaran" subtitle="Pembagian metode">
            <BarRow
              suffix="%"
              items={d.paymentShare.map((p) => ({ label: p.name, value: p.pct }))}
              max={100}
            />
          </Panel>

          <Panel
            title="Musiman Mingguan"
            subtitle="Pendapatan berdasarkan hari dalam seminggu"
          >
            <BarRow
              suffix="h"
              items={d.weekdayBars.map((w) => ({ label: w.day, value: w.value }))}
            />
          </Panel>

          <Panel
            title="Top Performers (Capster)"
            subtitle="Berdasarkan layanan yang diselesaikan"
          >
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
                  <span className="text-[0.5rem] text-muted-foreground">
                    {person.cuts} Services completed
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Audit Log laci kas"
            subtitle="Riwayat lengkap pergerakan kas"
          >
            <DataRows
              head={["Tanggal/Waktu", "Hak Akses", "Deskripsi", "Total", "Saldo Akhir"]}
              rows={d.auditLog.map((row) => [
                row.time,
                <Pill
                  key={`${row.time}-type`}
                  tone={row.type === "OUT" ? "bad" : "good"}
                >
                  {row.type}
                </Pill>,
                row.desc,
                row.amount,
                row.balance,
              ])}
            />
          </Panel>
        </Stack>
      </div>
    </PhoneScreen>
  );
}