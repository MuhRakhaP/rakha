import { DUMMY } from "@/data/mock-screens";

import {
  AppBar,
  MicroLabel,
  Panel,
  PhoneScreen,
  Stack,
  TrendLine,
} from "../primitives";

/**
 * CLOCKORA attendance analytics.
 *
 * Layout read from `D:\clockora\lib\sections\report_section.dart`: three
 * stacked blocks, each a section title followed by a fixed-height chart or
 * list — department lateness, a fourteen-day attendance trend, and top
 * performers.
 *
 * Two honest notes carried from reading the source rather than from looking at
 * the screen:
 *  - This screen is not in the bottom navigation. It is reached from the owner
 *    dashboard through the "Visual Analytics" tile, so the recreation shows no
 *    tab bar rather than inventing one.
 *  - The lateness chart draws two bars per department with no legend, so the
 *    recreation labels the pair explicitly instead of leaving it ambiguous.
 */
export function ClockoraReports() {
  const d = DUMMY.clockora;

  return (
    <PhoneScreen>
      <AppBar title="Attendance Analytics" tint="bg-[#4A148C] text-white" />

      <div className="flex-1 overflow-hidden p-2">
        <Stack gap="md">
          <div>
            <h3 className="text-xs font-bold">Department Lateness (Monthly)</h3>
            <MicroLabel>Blue: total days · Red: late days</MicroLabel>
            <ul className="mt-1.5 flex flex-col gap-1.5">
              {d.departments.map((dept) => (
                <li key={dept.name} className="flex flex-col gap-0.5">
                  <span className="text-[0.5rem] text-muted-foreground">
                    {dept.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className="block h-full rounded-full bg-blue-300"
                        style={{
                          width: `${(dept.total / 45) * 100}%`,
                        }}
                      />
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className="block h-full rounded-full bg-red-400"
                        style={{ width: `${(dept.late / 45) * 100}%` }}
                      />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Panel title="14-Day Attendance Trend">
            <div className="flex flex-col gap-1.5">
              <div>
                <MicroLabel>Attendance</MicroLabel>
                <TrendLine points={d.attendanceTrend} className="text-indigo-600" />
              </div>
              <div>
                <MicroLabel>Late</MicroLabel>
                <TrendLine points={d.lateTrend} className="text-red-500" />
              </div>
            </div>
          </Panel>

          <Panel title="Top Performers This Month">
            <ul className="flex flex-col gap-1.5">
              {d.topPerformers.map((person, index) => (
                <li
                  key={person.name}
                  className="flex items-center gap-1.5 rounded-md bg-muted/60 px-1.5 py-1"
                >
                  <span className="w-3 text-center text-[0.5625rem] font-bold text-amber-600">
                    {index + 1}
                  </span>
                  <span className="flex-1 truncate text-[0.5625rem]">
                    {person.name}
                  </span>
                  <span className="text-[0.5625rem] font-semibold text-emerald-700">
                    {person.days} Days
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <MicroLabel>
            Reached from the dashboard&apos;s &ldquo;Visual Analytics&rdquo;
            tile, not from the tab bar.
          </MicroLabel>
        </Stack>
      </div>
    </PhoneScreen>
  );
}