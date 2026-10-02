import { Trophy } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import {
  Avatar,
  BarRows,
  Caption,
  ColumnChart,
  Screen,
  SectionCard,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * CLOCKORA analytics, authored at 360x780.
 *
 * Structure read from `D:\clockora\lib\sections\report_section.dart`: stacked
 * blocks, each a title and a chart. Reduced to the two that carry the argument
 * — lateness by team, and the fourteen-day trend — plus the performers list.
 *
 * Two things carried from the source rather than from looking at it:
 *  - this screen is not in the bottom navigation. It is reached from the owner
 *    dashboard's "Visual Analytics" tile, so no nav bar is drawn here; adding
 *    one would be a design change rather than a copy;
 *  - the lateness chart draws two bars per department with no legend, so the
 *    two series are labelled rather than left ambiguous.
 */
export function ClockoraReports() {
  const t = tokensFor("clockora");
  const d = DUMMY.clockora;

  const trend = d.attendanceTrend
    .map((value, i) => ({ label: String(i + 1), value }))
    .slice(0, 14);

  return (
    <Screen
      tokens={t}
      subtitle="Dari dashboard"
      title="Analitik"
    >
      {/* Hero: the trend the screen is built around. */}
      <SectionCard tokens={t} title="14-day trend">
        <ColumnChart tokens={t} items={trend} height={132} />
      </SectionCard>

      <SectionCard tokens={t} title="Lateness by team">
        <div className="mb-2 flex items-center gap-4">
          <span className={`${TYPE.label} flex items-center gap-1.5`}>
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: t.primary }}
            />
            Total
          </span>
          <span className={`${TYPE.label} flex items-center gap-1.5`}>
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: t.error, outline: `1px solid ${t.onError}` }}
            />
            Late
          </span>
        </div>
        <BarRows
          tokens={t}
          items={d.departments.map((dept) => ({ label: dept.name, value: dept.total }))}
        />
      </SectionCard>

      <SectionCard
        tokens={t}
        title="Top performers"
        trailing={
          <span aria-hidden="true" style={{ color: t.warning }}>
            <Trophy className="h-5 w-5" />
          </span>
        }
      >
        <ul className="flex flex-col gap-3">
          {d.topPerformers.map((person, index) => (
            <li key={person.name} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="w-4 text-center font-semibold tabular-nums"
                style={{ color: t.onSurfaceVariant }}
              >
                {index + 1}
              </span>
              <Avatar tokens={t} name={person.name} size={34} />
              <span className={`${TYPE.body} min-w-0 flex-1`}>{person.name}</span>
              <span className={`${TYPE.label} font-semibold tabular-nums`}>
                {person.days} d
              </span>
            </li>
          ))}
        </ul>
        <Caption tokens={t}>Present days this month</Caption>
      </SectionCard>
    </Screen>
  );
}