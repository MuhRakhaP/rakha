import { cn } from "cn";
import { Clock3, LogIn, LogOut, Timer } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import {
  Avatar,
  BarChart,
  BottomNav,
  Caption,
  Card,
  Chip,
  MetricTile,
  PhoneCanvas,
  ProgressBar,
  Screen,
  SectionCard,
  Stack,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * CLOCKORA dashboard.
 *
 * Structure read from `D:\clockora\lib\dashboard_screen.dart`: a greeting, a
 * daily-attendance card, a team panel, a monthly summary grid, quick actions,
 * and a weekly productivity chart. The source splits those across two columns
 * on a wide layout; a phone gets one column, so this is the mobile ordering.
 *
 * The real app leads with an attendance card. Here that card is the hero: one
 * panel carrying today's state, the check-in time, and the day's progress.
 * Figures are invented and deliberately modest.
 */
export function ClockoraHome() {
  const t = tokensFor("clockora");
  const d = DUMMY.clockora;

  const stats = [
    { icon: <LogIn className="h-5 w-5" />, label: "Check In", value: "08:02" },
    { icon: <Timer className="h-5 w-5" />, label: "Working", value: "05:12" },
    { icon: <LogOut className="h-5 w-5" />, label: "Check Out", value: "--:--" },
  ];

  return (
    <PhoneCanvas>
      <Screen
        tokens={t}
        title="Good Morning, Angga"
        subtitle="Thursday, 02 October 2026"
        nav
      >
        <Stack gap="md">
          {/* Hero: today's state. */}
          <Card tokens={t}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Caption tokens={t}>Daily Attendance</Caption>
                <p className={cn(TYPE.section, "mt-1 font-semibold")}>
                  On shift since 08:02
                </p>
              </div>
              <Chip tokens={t} tone="success">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-emerald-600"
                />
                Active
              </Chip>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {stats.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <span
                    aria-hidden="true"
                    className="block"
                    style={{ color: t.primary }}
                  >
                    {stat.icon}
                  </span>
                  <p
                    className={cn(TYPE.label, "mt-1.5 truncate")}
                    style={{ color: t.onSurfaceVariant }}
                  >
                    {stat.label}
                  </p>
                  <p className={cn(TYPE.metricSm, "mt-1 truncate")}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <Caption tokens={t}>Progress today</Caption>
                <span className={cn(TYPE.label, "font-semibold tabular-nums")}>
                  64%
                </span>
              </div>
              <ProgressBar tokens={t} value={0.64} />
            </div>
          </Card>

          {/* Team list with avatars and status chips. */}
          <SectionCard tokens={t} title="Team Pulse" trailing={<Chip tokens={t} tone="primary">Active</Chip>}>
            <ul className="flex flex-col gap-3">
              {d.staff.map((person) => (
                <li key={person.name} className="flex items-center gap-3">
                  <Avatar tokens={t} name={person.name} />
                  <span className={cn(TYPE.body, "min-w-0 flex-1 truncate")}>
                    {person.name}
                  </span>
                  <Chip
                    tokens={t}
                    tone={person.state === "late" ? "warning" : "success"}
                  >
                    {person.state === "late" ? "Late" : "Present"}
                  </Chip>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Monthly summary. Labels are short so a tile never wraps. */}
          <div className="grid grid-cols-2 gap-3">
            {d.summary.map((tile) => (
              <MetricTile
                key={tile.label}
                tokens={t}
                label={tile.label}
                value={tile.value}
              />
            ))}
          </div>

          <SectionCard tokens={t} title="Quick Actions">
            <ul className="flex flex-col gap-2">
              {d.quickActions.map((action) => (
                <li
                  key={action}
                  className="flex min-h-13 items-center justify-between gap-3 px-3"
                  style={{ background: t.neutral, borderRadius: 12 }}
                >
                  <span className={cn(TYPE.body, "truncate")}>{action}</span>
                  <span aria-hidden="true" style={{ color: t.primary }}>
                    ›
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            tokens={t}
            title="Weekly Productivity"
            trailing={
              <span
                aria-hidden="true"
                className="shrink-0"
                style={{ color: t.onSurfaceVariant }}
              >
                <Clock3 className="h-5 w-5" />
              </span>
            }
          >
            <BarChart tokens={t} items={d.weeklyBars} suffix="h" max={12} />
          </SectionCard>
        </Stack>
      </Screen>

      <BottomNav tokens={t} items={d.nav} active="Home" />
    </PhoneCanvas>
  );
}