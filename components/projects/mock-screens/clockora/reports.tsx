import { cn } from "cn";
import { Trophy } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import {
  Avatar,
  BarChart,
  Card,
  Caption,
  PhoneCanvas,
  Screen,
  SectionCard,
  Stack,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * CLOCKORA attendance analytics.
 *
 * Structure read from `D:\clockora\lib\sections\report_section.dart`: three
 * stacked blocks, each a section title followed by a chart or list — department
 * lateness, a fourteen-day attendance trend, then top performers.
 *
 * Two things carried from reading the source rather than from looking at it:
 *  - this screen is not in the bottom navigation. It is reached from the owner
 *    dashboard through the "Visual Analytics" tile, so there is no nav here and
 *    inventing one would be a design change rather than a copy;
 *  - the lateness chart draws two bars per department with no legend, so the two
 *    series are labelled here instead of leaving the reader guessing.
 */
export function ClockoraReports() {
  const t = tokensFor("clockora");
  const d = DUMMY.clockora;

  return (
    <PhoneCanvas>
      <Screen
        tokens={t}
        title="Attendance Analytics"
        subtitle="Reached from the dashboard's Visual Analytics tile, not the tab bar"
      >
        <Stack gap="md">
          <SectionCard tokens={t} title="Department Lateness">
            <div className="mb-3 flex items-center gap-4">
              <span className={cn(TYPE.label, "flex items-center gap-1.5")}>
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ background: t.primary }}
                />
                Total days
              </span>
              <span className={cn(TYPE.label, "flex items-center gap-1.5")}>
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ background: t.error, outline: `1px solid ${t.onError}` }}
                />
                Late days
              </span>
            </div>
            <BarChart
              tokens={t}
              items={d.departments.map((dept) => ({
                label: dept.name,
                value: dept.total,
              }))}
              max={45}
            />
            <div className="mt-4">
              <Caption tokens={t}>Late days</Caption>
              <div className="mt-2">
                <BarChart
                  tokens={t}
                  items={d.departments.map((dept) => ({
                    label: dept.name,
                    value: dept.late,
                  }))}
                  max={45}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard tokens={t} title="14-Day Attendance Trend">
            <ul className="flex flex-col gap-3">
              {[
                { label: "Attendance", points: d.attendanceTrend },
                { label: "Late", points: d.lateTrend },
              ].map((series) => (
                <li key={series.label}>
                  <Caption tokens={t}>{series.label}</Caption>
                  <div className="mt-1.5">
                    <BarChart
                      tokens={t}
                      items={series.points.map((value, index) => ({
                        label: String(index + 1),
                        value,
                      }))}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard
            tokens={t}
            title="Top Performers This Month"
            trailing={
              <span aria-hidden="true" className="shrink-0" style={{ color: t.warning }}>
                <Trophy className="h-5 w-5" />
              </span>
            }
          >
            <ul className="flex flex-col gap-2">
              {d.topPerformers.map((person, index) => (
                <li key={person.name}>
                  <Card tokens={t} className="flex items-center gap-3 p-3">
                    <span
                      aria-hidden="true"
                      className="w-5 shrink-0 text-center font-semibold tabular-nums"
                      style={{ color: t.onSurfaceVariant }}
                    >
                      {index + 1}
                    </span>
                    <Avatar tokens={t} name={person.name} size={36} />
                    <span className={cn(TYPE.body, "min-w-0 flex-1 truncate")}>
                      {person.name}
                    </span>
                    <span className={cn(TYPE.body, "shrink-0 font-semibold tabular-nums")}>
                      {person.days}d
                    </span>
                  </Card>
                </li>
              ))}
            </ul>
          </SectionCard>
        </Stack>
      </Screen>
    </PhoneCanvas>
  );
}