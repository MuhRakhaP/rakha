import { Plus, Receipt, Wallet } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import {
  Caption,
  Card,
  Chip,
  MetricTile,
  Screen,
  SectionCard,
  Sparkline,
  Stack,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * THINKPOS dashboard, authored at 360x780.
 *
 * The real screen (`lib/sections/dashboard_overview_section.dart`) opens with a
 * seven-tile KPI grid, then a three-card analytics row, then the transactions
 * table. Seven tiles at this width would be a wall of unreadable numbers, so
 * the app's information hierarchy and its own strings are kept while the top
 * line gets the room it deserves: one hero metric with a trend, the supporting
 * figures, and quick actions.
 *
 * Every label here is the app's own. Figures are invented.
 */
export function ThinkPosDashboard() {
  const t = tokensFor("thinkpos");
  const d = DUMMY.thinkpos;

  const quickActions = [
    { icon: <Plus className="h-5 w-5" />, label: "Nota baru" },
    { icon: <Wallet className="h-5 w-5" />, label: "Input kas" },
    { icon: <Receipt className="h-5 w-5" />, label: "Daftar nota" },
  ];

  return (
    <Screen tokens={t} subtitle={d.store} title="Dashboard">
      <Stack gap="md">
        {/* Hero metric. */}
        <Card tokens={t}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <Caption tokens={t}>Omset</Caption>
              <p className={`${TYPE.metric} mt-2`}>Rp 4,3 jt</p>
            </div>
            <Chip tokens={t} tone="primary">
              Shift aktif
            </Chip>
          </div>
          <div className="mt-4">
            <Sparkline tokens={t} points={d.revenueTrend} />
            <div className="mt-1.5 flex items-center justify-between">
              <Caption tokens={t}>14 hari</Caption>
              <span className={`${TYPE.label} tabular-nums`} style={{ color: t.onSurfaceVariant }}>
                Rp 2,1 jt
              </span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <MetricTile tokens={t} label="Laci kas" value="Rp 1,6 jt" />
          <MetricTile tokens={t} label="Profit" value="Rp 3,6 jt" />
          <MetricTile tokens={t} label="Total tip" value="Rp 95 rb" />
          <MetricTile tokens={t} label="Pesanan" value="38" />
        </div>

        <SectionCard tokens={t} title="Aksi cepat">
          <ul className="grid grid-cols-3 gap-2">
            {quickActions.map((action) => (
              <li
                key={action.label}
                className="flex min-h-14 flex-col items-center justify-center gap-1.5 px-1 text-center"
                style={{ background: t.neutral, borderRadius: 12 }}
              >
                <span aria-hidden="true" style={{ color: t.primary }}>
                  {action.icon}
                </span>
                <span className={`${TYPE.chip} normal-case tracking-normal`}>
                  {action.label}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard tokens={t} title="Transaksi hari ini">
          <ul className="flex flex-col gap-3">
            {d.transactions.slice(0, 3).map((row) => (
              <li key={row.bill} className="flex items-center gap-3">
                <span className={`${TYPE.label} tabular-nums`}>{row.bill}</span>
                <span className={`${TYPE.label} min-w-0 flex-1`} style={{ color: t.onSurfaceVariant }}>
                  {row.customer}
                </span>
                <Chip tokens={t} tone={row.method === "Cash" ? "success" : "primary"}>
                  {row.method}
                </Chip>
              </li>
            ))}
          </ul>
        </SectionCard>
      </Stack>
    </Screen>
  );
}