import { cn } from "cn";
import { Camera, LogIn, LogOut, MapPin } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import {
  BottomNav,
  Card,
  Caption,
  PhoneCanvas,
  PrimaryButton,
  Screen,
  Stack,
  StaticDevicePanel,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * CLOCKORA attendance.
 *
 * Structure read from `D:\clockora\lib\sections\attendance_section.dart`: a
 * camera panel, then a control panel holding the location line, a
 * "Field Attendance" checkbox, an optional location-name field, and two large
 * check-in and check-out actions.
 *
 * The camera feed, the GPS fix and the rooted-device check cannot be drawn, so
 * the camera area is an explicitly labelled static card rather than an
 * imitation of a live preview. Saying so is the point of it.
 */
export function ClockoraCheckIn() {
  const t = tokensFor("clockora");
  const d = DUMMY.clockora;

  return (
    <PhoneCanvas>
      <Screen tokens={t} title="Attendance" nav>
        <Stack gap="md">
          <StaticDevicePanel
            tokens={t}
            icon={<Camera className="h-10 w-10" style={{ color: t.primary }} />}
            title="Camera and location are not recreated"
            detail="A real capture needs a device with a front camera, geolocation and a secure-storage check. This is a static placeholder."
          />

          <Card tokens={t}>
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="mt-0.5 shrink-0" style={{ color: t.primary }}>
                <MapPin className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <Caption tokens={t}>Location</Caption>
                <p className={cn(TYPE.body, "mt-1 tabular-nums")}>
                  -6.2000, 106.8167
                </p>
              </div>
            </div>

            <div
              className="mt-4 flex min-h-13 items-center gap-3 border px-3"
              style={{ borderColor: t.outline, borderRadius: 12 }}
            >
              <span
                aria-hidden="true"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
                style={{ background: t.primary }}
              >
                <CheckMark />
              </span>
              <span className={cn(TYPE.body, "truncate")}>
                Field Attendance (Outside Office)
              </span>
            </div>
          </Card>

          <div className="mt-auto flex flex-col gap-3">
            <PrimaryButton
              tokens={t}
              icon={<LogIn className="h-5 w-5" />}
            >
              Check In
            </PrimaryButton>
            <div
              className="flex min-h-13 items-center justify-center px-4"
              style={{
                background: t.error,
                color: t.onError,
                borderRadius: 14,
              }}
            >
              <span className={cn(TYPE.body, "inline-flex items-center gap-2 font-semibold")}>
                <LogOut className="h-5 w-5" />
                Check Out
              </span>
            </div>
          </div>
        </Stack>
      </Screen>

      <BottomNav tokens={t} items={d.nav} active="Absen" />
    </PhoneCanvas>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true" fill="none">
      <path
        d="M2 6.5 4.8 9.2 10 3.6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}