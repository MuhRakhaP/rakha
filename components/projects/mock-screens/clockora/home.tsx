import { CheckCircle2, Clock3, Timer } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import {
  Avatar,
  BottomNav,
  Caption,
  Card,
  Chip,
  ColumnChart,
  ProgressRing,
  Screen,
  SectionCard,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * CLOCKORA home, authored at 360x780.
 *
 * Structure read from `D:\clockora\lib\dashboard_screen.dart`, reduced to fit
 * a fixed height without scrolling: the attendance card is the hero, then the
 * team list, then the weekly chart. The real screen has a four-tile summary
 * grid and a quick-action list as well; those are dropped rather than stacked,
 * because a screen that scrolls inside a picture reads as a broken embed.
 */
export function ClockoraHome() {
  const t = tokensFor("clockora");
  const d = DUMMY.clockora;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Screen
        tokens={t}
        subtitle="Thursday, 2 Oct"
        title="Selamat pagi, Angga"
      >
        {/* Hero: today's state, the thing the screen is actually about. */}
        <Card tokens={t}>
          <div className="flex items-center justify-between gap-3">
            <Caption tokens={t}>Daily attendance</Caption>
            <Chip tokens={t} tone="success">
              <CheckCircle2 className="h-4 w-4" />
              On shift
            </Chip>
          </div>

          <div className="mt-4 flex items-center gap-5">
            <ProgressRing tokens={t} value={0.64} size={104}>
              <span
                className="text-xs font-medium"
                style={{ color: t.onSurfaceVariant }}
              >
                Progress
              </span>
              <span className="text-xl leading-tight font-semibold tabular-nums">
                64%
              </span>
            </ProgressRing>

            <dl className="flex min-w-0 flex-1 flex-col gap-3">
              <div>
                <dt className={`${TYPE.label} flex items-center gap-1.5`} style={{ color: t.onSurfaceVariant }}>
                  <CheckCircle2 className="h-4 w-4" />
                  Check in
                </dt>
                <dd className="mt-0.5 text-lg leading-none font-semibold tabular-nums">
                  08:02
                </dd>
              </div>
              <div>
                <dt className={`${TYPE.label} flex items-center gap-1.5`} style={{ color: t.onSurfaceVariant }}>
                  <Timer className="h-4 w-4" />
                  Hours
                </dt>
                <dd className="mt-0.5 text-lg leading-none font-semibold tabular-nums">
                  05:12
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        {/* Team list: avatars and status chips. */}
        <SectionCard tokens={t} title="Team pulse">
          <ul className="flex flex-col gap-3">
            {d.staff.map((person) => (
              <li key={person.name} className="flex items-center gap-3">
                <Avatar tokens={t} name={person.name} size={36} />
                <span className={`${TYPE.body} min-w-0 flex-1`}>{person.name}</span>
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

        {/* Weekly hours as a real chart. */}
        <SectionCard
          tokens={t}
          title="Weekly hours"
          trailing={
            <span aria-hidden="true" style={{ color: t.onSurfaceVariant }}>
              <Clock3 className="h-5 w-5" />
            </span>
          }
        >
          <ColumnChart
            tokens={t}
            items={d.weeklyBars.map((bar) => ({
              label: bar.label,
              value: bar.value,
            }))}
            suffix="h"
          />
        </SectionCard>
      </Screen>

      <BottomNav tokens={t} items={d.nav} active="Home" />
    </div>
  );
}