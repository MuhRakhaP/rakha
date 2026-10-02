import { DUMMY } from "@/data/mock-screens";

import {
  AppBar,
  BarRow,
  MicroLabel,
  Panel,
  PhoneScreen,
  Pill,
  Stack,
  StatTile,
  TabBar,
} from "../primitives";

/**
 * CLOCKORA dashboard.
 *
 * Layout read from `D:\clockora\lib\dashboard_screen.dart`. The source splits
 * the body into an attendance card, a team pulse panel and a weekly chart on
 * one side, and a monthly summary grid plus quick actions on the other. On a
 * phone those collapse to a single column, so the recreation stacks them in the
 * source's mobile order: attendance, team pulse, summary tiles, quick actions,
 * then the chart.
 *
 * Tab labels are the app's own, in order.
 */
export function ClockoraHome() {
  const d = DUMMY.clockora;

  return (
    <PhoneScreen>
      <AppBar title="Dashboard" tint="bg-[#4A148C] text-white" />

      <div className="flex-1 overflow-hidden p-2">
        <Stack gap="md">
          <div>
            <p className="text-sm font-bold tracking-tight">
              Good Morning, Angga
            </p>
            <p className="mt-0.5 text-[0.5625rem] text-muted-foreground">
              Thursday, 02 October 2026
            </p>
          </div>

          <Panel title="Daily Attendance">
            <div className="mb-2 flex items-center justify-end">
              <Pill tone="good">ACTIVE</Pill>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <StatTile label="Check In" value="08:02" tint="bg-blue-500" />
              <StatTile
                label="Working Time"
                value="05:12"
                tint="bg-[#4A148C]"
              />
              <StatTile label="Check Out" value="--:--" tint="bg-orange-500" />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <MicroLabel>Progress Today</MicroLabel>
              <span className="text-[0.5rem] font-semibold text-brand">64%</span>
            </div>
            <span className="mt-1 block h-2 w-full overflow-hidden rounded-full bg-muted">
              <span className="block h-full w-[64%] rounded-full bg-brand" />
            </span>
          </Panel>

          <Panel title="Team Pulse">
            <div className="mb-1.5 flex items-center justify-end">
              <Pill tone="brand">ACTIVE</Pill>
            </div>
            <ul className="flex flex-col gap-1.5">
              {d.staff.map((person) => (
                <li key={person.name} className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 rounded-full bg-muted"
                  />
                  <span className="flex-1 truncate text-[0.5625rem]">
                    {person.name}
                  </span>
                  <Pill tone={person.state === "late" ? "warn" : "good"}>
                    {person.state}
                  </Pill>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Monthly summary: a fixed two-column grid in the source. */}
          <div className="grid grid-cols-2 gap-1.5">
            {d.summary.map((tile) => (
              <StatTile key={tile.label} label={tile.label} value={tile.value} />
            ))}
          </div>

          <Panel title="Quick Actions">
            <ul className="flex flex-col gap-1.5">
              {d.quickActions.map((action) => (
                <li
                  key={action}
                  className="flex items-center justify-between rounded-md bg-brand-weak/60 px-2 py-1.5"
                >
                  <span className="text-[0.5625rem] font-medium">{action}</span>
                  <span aria-hidden="true" className="text-[0.5rem] text-brand">
                    ›
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Weekly Productivity"
            subtitle="Hours worked per day"
          >
            <BarRow
              suffix="h"
              items={d.weeklyBars.map((bar) => ({
                label: bar.day,
                value: bar.value,
              }))}
              max={12}
            />
          </Panel>
        </Stack>
      </div>

      <TabBar items={d.nav} active="Home" />
    </PhoneScreen>
  );
}