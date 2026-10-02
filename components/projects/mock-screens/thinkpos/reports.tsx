import { Download } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import {
  Caption,
  Card,
  Chip,
  ColumnChart,
  FilterChip,
  MetricTile,
  Screen,
  SectionCard,
  Stack,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * THINKPOS reports, authored at 360x780.
 *
 * `lib/sections/legacy_report_section.dart` is one long page: a header, a
 * five-tile KPI board, a revenue trend, then paired tables and charts, a
 * weekday chart, and a cash audit log. At this width the whole page is
 * unreadable, so what is kept is what a reader actually lands on: the real
 * period filters, the summary tiles, and the weekday chart the app calls
 * "Musiman Mingguan".
 *
 * Every label is the app's own string. Figures are invented.
 */
export function ThinkPosReports() {
  const t = tokensFor("thinkpos");
  const d = DUMMY.thinkpos;

  const periods = ["Hari ini", "7 hari", "Bulan ini"];

  return (
    <Screen tokens={t} subtitle="1 Sep - 2 Okt" title="Laporan">
      <Stack gap="md">
        <div className="flex gap-2">
          {periods.map((period, index) => (
            <FilterChip key={period} tokens={t} selected={index === 2}>
              {period}
            </FilterChip>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Chip tokens={t} tone="primary">Barber</Chip>
          <Chip tokens={t}>
            <Download className="h-4 w-4" />
            Export
          </Chip>
        </div>

        {/* Hero: the weekday chart. */}
        <SectionCard tokens={t} title="Musiman mingguan">
          <ColumnChart
            tokens={t}
            items={d.weekdayBars.map((bar) => ({
              label: bar.label,
              value: bar.value,
            }))}
            suffix="h"
          />
        </SectionCard>

        <div className="grid grid-cols-2 gap-3">
          <MetricTile tokens={t} label="Kas masuk" value="Rp 4,1 jt" />
          <MetricTile tokens={t} label="Pesanan" value="38" />
        </div>

        <Card tokens={t}>
          <Caption tokens={t}>Metode pembayaran</Caption>
          <ul className="mt-3 flex flex-col gap-2">
            {d.paymentShare.map((row) => (
              <li key={row.name} className="flex items-center gap-3">
                <span className={`${TYPE.body} min-w-0 flex-1`}>{row.name}</span>
                <span className="h-2 w-24 overflow-hidden" style={{ background: t.neutral, borderRadius: 999 }}>
                  <span
                    className="block h-full"
                    style={{
                      width: `${row.pct}%`,
                      background: t.primary,
                      borderRadius: 999,
                    }}
                  />
                </span>
                <span className={`${TYPE.label} w-9 text-right tabular-nums`}>
                  {row.pct}%
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </Stack>
    </Screen>
  );
}