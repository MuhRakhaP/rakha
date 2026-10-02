import { cn } from "cn";
import { Download, Trophy } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import {
  BarChart,
  Card,
  Caption,
  Chip,
  FilterChip,
  MetricTile,
  PhoneCanvas,
  Screen,
  SectionCard,
  Stack,
  StaticDevicePanel,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * THINKPOS reports.
 *
 * `lib/sections/legacy_report_section.dart` is one long page: a header, a
 * five-tile KPI board, a revenue trend, then paired tables and charts, a
 * weekday chart, and a cash audit log. At phone width that whole page is
 * unreadable, so this keeps the real period filters and the real section titles
 * but shows the two a reader actually lands on: the summary tiles and the
 * revenue bars, followed by the weekday chart the app calls "Musiman Mingguan".
 *
 * Every label is the app's own string. Figures are invented.
 */
export function ThinkPosReports() {
  const t = tokensFor("thinkpos");
  const d = DUMMY.thinkpos;

  const periods = ["Hari ini", "7 hari", "Bulan ini", "Custom"];

  return (
    <PhoneCanvas>
      <Screen
        tokens={t}
        title="Laporan"
        subtitle="Periode: 01 Sep 2026 - 02 Oct 2026"
      >
        <Stack gap="md">
          <div className="flex gap-2 overflow-x-auto">
            {periods.map((period, index) => (
              <FilterChip key={period} tokens={t} selected={index === 2}>
                {period}
              </FilterChip>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Chip tokens={t} tone="primary">Barber</Chip>
            <Chip tokens={t} tone="neutral">
              <Download className="h-4 w-4" />
              Export
            </Chip>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {d.reportKpis.slice(0, 4).map((kpi) => (
              <MetricTile
                key={kpi.label}
                tokens={t}
                label={kpi.label}
                value={kpi.value}
              />
            ))}
          </div>

          <SectionCard tokens={t} title="Musiman Mingguan">
            <BarChart tokens={t} items={d.weekdayBars} suffix="h" max={6} />
          </SectionCard>

          <SectionCard tokens={t} title="Metode Pembayaran">
            <BarChart
              tokens={t}
              items={d.paymentShare.map((p) => ({ label: p.name, value: p.pct }))}
              suffix="%"
              max={100}
            />
          </SectionCard>

          <SectionCard
            tokens={t}
            title="Top Performers (Capster)"
            trailing={
              <span aria-hidden="true" className="shrink-0" style={{ color: t.primary }}>
                <Trophy className="h-5 w-5" />
              </span>
            }
          >
            <ul className="flex flex-col gap-3">
              {d.staff.map((person) => (
                <li key={person.name} className="flex items-center gap-3">
                  <span className={cn(TYPE.body, "min-w-0 flex-1 truncate")}>
                    {person.name}
                  </span>
                  <span className={cn(TYPE.label, "shrink-0 tabular-nums")} style={{ color: t.onSurfaceVariant }}>
                    {person.cuts} potong
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <Card tokens={t}>
            <Caption tokens={t}>Peringkat Produk</Caption>
            <ul className="mt-2 flex flex-col gap-2">
              {d.topProducts.slice(0, 3).map((product, index) => (
                <li key={product.name} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="w-4 shrink-0 text-center font-semibold tabular-nums"
                    style={{ color: t.onSurfaceVariant }}
                  >
                    {index + 1}
                  </span>
                  <span className={cn(TYPE.body, "min-w-0 flex-1 truncate")}>
                    {product.name}
                  </span>
                  <span className={cn(TYPE.label, "shrink-0 font-semibold tabular-nums")}>
                    {product.revenue}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <StaticDevicePanel
            tokens={t}
            icon={<Download className="h-10 w-10" style={{ color: t.onSurfaceVariant }} />}
            title="Excel export not recreated"
            detail="The Excel export writes to a real device path, so nothing is drawn for it here."
          />
        </Stack>
      </Screen>
    </PhoneCanvas>
  );
}