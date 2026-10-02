import { cn } from "cn";
import { Plus, Printer, Receipt, Wallet } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import {
  Card,
  Caption,
  Chip,
  MetricTile,
  PhoneCanvas,
  Screen,
  SectionCard,
  Sparkline,
  Stack,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * THINKPOS owner dashboard.
 *
 * The real screen (`lib/sections/dashboard_overview_section.dart`) opens with a
 * seven-tile KPI grid, then a three-card analytics row, then the transactions
 * table. Seven tiles at phone width would be a wall of truncated numbers, so
 * this keeps the app's information hierarchy and its own strings while giving
 * the top line the room it deserves: one hero metric with a sparkline, then the
 * supporting tiles, then quick actions.
 *
 * Tile labels and action names come from the source. Figures are invented and
 * deliberately unremarkable.
 */
export function ThinkPosDashboard() {
  const t = tokensFor("thinkpos");
  const d = DUMMY.thinkpos;

  const quickActions = [
    { icon: <Plus className="h-5 w-5" />, label: "Tambah Nota" },
    { icon: <Wallet className="h-5 w-5" />, label: "Input Kas" },
    { icon: <Receipt className="h-5 w-5" />, label: "Daftar Nota" },
    { icon: <Printer className="h-5 w-5" />, label: "Cetak Struk" },
  ];

  return (
    <PhoneCanvas>
      <Screen tokens={t} title="Dashboard" subtitle={d.store}>
        <Stack gap="md">
          {/* Hero metric with a sparkline. */}
          <Card tokens={t}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Caption tokens={t}>Omset</Caption>
                <p className={cn(TYPE.metric, "mt-2 truncate")}>Rp 4.320.000</p>
                <p className={cn(TYPE.label, "mt-2 truncate")} style={{ color: t.onSurfaceVariant }}>
                  14 hari terakhir
                </p>
              </div>
              <Chip tokens={t} tone="primary">
                Shift Aktif
              </Chip>
            </div>
            <div className="mt-3">
              <Sparkline tokens={t} points={d.revenueTrend} />
            </div>
          </Card>

          {/* Supporting tiles. Labels are the app's own, kept short. */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Laci Kas", value: "Rp 1,6 jt" },
              { label: "Profit", value: "Rp 3,6 jt" },
              { label: "Total Tip", value: "Rp 95.000" },
              { label: "Pesanan", value: "38" },
            ].map((tile) => (
              <MetricTile
                key={tile.label}
                tokens={t}
                label={tile.label}
                value={tile.value}
              />
            ))}
          </div>

          <SectionCard tokens={t} title="Quick Actions">
            <ul className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <li
                  key={action.label}
                  className="flex min-h-13 items-center gap-2 px-3"
                  style={{ background: t.neutral, borderRadius: 12 }}
                >
                  <span aria-hidden="true" className="shrink-0" style={{ color: t.primary }}>
                    {action.icon}
                  </span>
                  <span className={cn(TYPE.label, "truncate")}>{action.label}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard tokens={t} title="Transaksi Hari Ini">
            <ul className="flex flex-col gap-3">
              {d.transactions.slice(0, 3).map((row) => (
                <li key={row.bill} className="flex items-center gap-3">
                  <span className={cn(TYPE.label, "min-w-0 flex-1 truncate tabular-nums")}>
                    {row.bill}
                  </span>
                  <Chip tokens={t} tone={row.method === "Cash" ? "success" : "primary"}>
                    {row.method}
                  </Chip>
                  <span className={cn(TYPE.label, "shrink-0 font-semibold tabular-nums")}>
                    {row.total}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </Stack>
      </Screen>
    </PhoneCanvas>
  );
}