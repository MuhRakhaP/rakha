import { DUMMY } from "@/data/mock-screens";

import {
  AppBar,
  MicroLabel,
  PhoneScreen,
  Stack,
  StaticDevicePanel,
  TabBar,
} from "../primitives";

/**
 * CLOCKORA attendance / check-in screen.
 *
 * Layout read from `D:\clockora\lib\sections\attendance_section.dart`: a
 * camera panel on one side and a control panel on the other, where the control
 * panel is a location line, a "Field Attendance" checkbox, an optional location
 * name field, and two large check-in and check-out buttons.
 *
 * A phone recreation stacks those two panels. The camera feed, the GPS fix and
 * the rooted/jailbreak device check cannot be recreated, so the camera panel is
 * a labelled static block instead of an imitation of a live preview.
 */
export function ClockoraCheckIn() {
  const d = DUMMY.clockora;

  return (
    <PhoneScreen>
      <AppBar title="Attendance" tint="bg-[#4A148C] text-white" />

      <div className="flex flex-1 flex-col gap-3 overflow-hidden p-2">
        {/* Camera panel: static, because a real feed is not reproducible. */}
        <StaticDevicePanel
          title="Camera panel"
          detail="Front-camera preview needs a device. Shown as a static placeholder."
        />

        {/* Control panel. */}
        <Stack gap="sm" className="flex-1">
          <p className="text-[0.5625rem] tabular-nums text-muted-foreground">
            Location: -6.200000, 106.816666
          </p>

          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-[3px] border border-border bg-background"
            />
            <span className="text-[0.5625rem]">
              Field Attendance (Outside Office)
            </span>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="rounded-md bg-emerald-700 py-2.5 text-center text-[0.625rem] font-bold tracking-[0.06em] text-white uppercase">
                Check In
              </span>
              <MicroLabel>Records entry time</MicroLabel>
            </div>
            <div className="flex flex-col gap-1">
              <span className="rounded-md bg-rose-700 py-2.5 text-center text-[0.625rem] font-bold tracking-[0.06em] text-white uppercase">
                Check Out
              </span>
              <MicroLabel>Records exit time</MicroLabel>
            </div>
          </div>

          <MicroLabel>
            Device security, geolocation and connectivity checks are not recreated.
          </MicroLabel>
        </Stack>
      </div>

      <TabBar items={d.nav} active="Absen" />
    </PhoneScreen>
  );
}