import { LogIn, LogOut } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import {
  BottomNav,
  Caption,
  Card,
  Chip,
  PrimaryButton,
  Screen,
  TonalButton,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * CLOCKORA check-in, authored at 360x780.
 *
 * The one action this screen exists for is the large check-in control, so it
 * is the hero and everything else is secondary.
 *
 * No camera or location panel is drawn. Both are wired in the source
 * (`camera`, `geolocator` in attendance_section.dart) but neither was verified
 * as reachable in a running build, and an unverified panel is an invented
 * feature. TODO-FIX-LATER.md records it.
 */
export function ClockoraCheckIn() {
  const t = tokensFor("clockora");
  const d = DUMMY.clockora;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Screen tokens={t} subtitle="Kamis, 2 Oktober" title="Absen">
        {/* Hero: the primary action, given the room it needs. */}
        <div className="flex flex-col gap-3">
          <PrimaryButton tokens={t} large icon={<LogIn className="h-6 w-6" />}>
            Check In
          </PrimaryButton>
          <TonalButton tokens={t} icon={<LogOut className="h-6 w-6" />}>
            Check Out
          </TonalButton>
        </div>

        {/* Status: what the app already knows about today. */}
        <Card tokens={t}>
          <div className="flex items-center justify-between gap-3">
            <Caption tokens={t}>Status</Caption>
            <Chip tokens={t} tone="success">
              On shift
            </Chip>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <dt className={TYPE.label} style={{ color: t.onSurfaceVariant }}>
                Check in
              </dt>
              <dd className="mt-1 text-xl leading-none font-semibold tabular-nums">
                08:02
              </dd>
            </div>
            <div>
              <dt className={TYPE.label} style={{ color: t.onSurfaceVariant }}>
                Hours
              </dt>
              <dd className="mt-1 text-xl leading-none font-semibold tabular-nums">
                05:12
              </dd>
            </div>
          </dl>
        </Card>

        {/* Today's note from the app's own shift model. */}
        <Card tokens={t}>
          <Caption tokens={t}>Shift</Caption>
          <p className={`${TYPE.body} mt-2`}>
            Open since 08:00. Closing the shift saves the daily summary.
          </p>
        </Card>
      </Screen>

      <BottomNav tokens={t} items={d.nav} active="Absen" />
    </div>
  );
}