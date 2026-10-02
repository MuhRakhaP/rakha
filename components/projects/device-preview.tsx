import Image from "next/image";

import { BrowserFrame } from "@/components/projects/browser-frame";
import { PhoneFrame } from "@/components/projects/phone-frame";

import { getScreenDef, RECREATION_CAPTION } from "@/data/mock-screens";
import type { Project } from "@/data/projects";

import { getMockScreens } from "@/components/projects/mock-screens/registry";
import { ScaledCanvas } from "@/components/projects/mock-screens/scaled-canvas";
import { LOGICAL, tokensFor } from "@/components/projects/mock-screens/tokens";

/**
 * Shape of the media box on every card. One ratio for all four projects, which
 * is what makes the text below every device start on the same line: if mobile
 * and web cards used different boxes, their titles would not line up across a
 * row. A 5:4 box is wide enough for an angled pair of browser frames and tall
 * enough for a phone at a believable size.
 *
 * The home page widens the box to 4:3 for web projects so the browser pair
 * fills it instead of floating in a tall box; the /projects grid keeps 5:4
 * everywhere because its rows mix mobile and web cards.
 */
const MEDIA_ASPECT = {
  "5:4": 5 / 4,
  "4:3": 4 / 3,
} as const;

export type MediaAspect = keyof typeof MEDIA_ASPECT;

/**
 * Device widths as a fraction of the box, how far each one is tucked under
 * its neighbour, and how far it is lifted off the vertical centre.
 *
 * Every device in a composition gets the same width. Unequal widths would give
 * the frames unequal heights, and the strip rule is that phones match phones
 * and browsers match browsers: the row reads as composed only when the devices
 * line up. Depth comes from the rotation, the overlap, the lift and the
 * shadow, not from resizing the devices against each other.
 *
 * Phones are 90% of their old size so a mobile card no longer swallows the
 * web card next to it, and the fan is tightened so the three phones span
 * about the same height as the browser pair: the two kinds of card read as
 * equally weighted. Browsers are wider and barely rotated, and the pair is
 * staggered vertically (back up, front down) so the composition fills the box
 * instead of hovering in its middle.
 *
 * Angling a device grows its bounding box, so a device sized to fill the box
 * upright no longer fits once rotated. These numbers are chosen so the rotated
 * bounding box still clears the box edges, which the visual-check harness
 * measures directly rather than taking on trust.
 */
const COMPOSITION: Record<
  "phone" | "browser",
  { width: number; rotate: number; marginLeft: number; z: number; lift: number }[]
> = {
  phone: [
    { width: 23, rotate: -18, marginLeft: 0, z: 0, lift: -4 },
    { width: 23, rotate: 14, marginLeft: -10, z: 0, lift: 0 },
    { width: 23, rotate: -3, marginLeft: -12, z: 10, lift: 3 },
  ],
  browser: [
    { width: 54, rotate: -5, marginLeft: 0, z: 0, lift: -10 },
    { width: 54, rotate: 3, marginLeft: -20, z: 10, lift: 8 },
  ],
};

/** One thing to draw inside the box: either a real capture or a recreation. */
interface Slot {
  kind: "capture" | "recreation";
  screenId: string;
  /** Present when kind is "capture". */
  shot?: Project["screenshots"][number];
}

/**
 * Pick what to show, in priority order.
 *
 * A project with real captures shows them: two for a browser so the pair reads
 * as one focused view and one detail view, rather than two of the same page.
 * A project with none shows its recreations, with the sign-in screen left out:
 * it is the least informative screen it owns, and the box only has room for two
 * or three.
 */
function pickSlots(project: Project, limit: number): Slot[] {
  if (project.screenshots.length > 0) {
    const shots = project.screenshots.slice(0, limit);
    return shots.map((shot) => ({
      kind: "capture",
      screenId: shot.id ?? "capture",
      shot,
    }));
  }

  const registered = getMockScreens(project.slug);
  const ids = (project.mockScreens ?? []).filter(
    (id) => Boolean(registered[id]) && getScreenDef(project.slug, id),
  );
  const withoutLogin = ids.filter((id) => id !== "login");
  const chosen = (withoutLogin.length >= 2 ? withoutLogin : ids).slice(0, limit);

  return chosen.map((id) => ({ kind: "recreation", screenId: id }));
}

/** The device in one slot, framed and scaled to the width it is given. */
function SlotDevice({
  project,
  slot,
  widthPct,
}: {
  project: Project;
  slot: Slot;
  widthPct: number;
}) {
  if (slot.kind === "capture" && slot.shot) {
    const shot = slot.shot;
    const image = (
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        // Contained, never covered: a 16:10 capture in a 5:4 box must not lose
        // its edges, and a phone mockup must not be cropped to fit.
        className="h-auto w-full"
        sizes="(max-width: 768px) 60vw, 20vw"
      />
    );
    return (
      <span className="block w-full" style={{ width: `${widthPct}%` }}>
        {project.type === "mobile" ? (
          <PhoneFrame>{image}</PhoneFrame>
        ) : (
          <BrowserFrame>{image}</BrowserFrame>
        )}
      </span>
    );
  }

  const Component = getMockScreens(project.slug)[slot.screenId];
  const def = getScreenDef(project.slug, slot.screenId);
  if (!Component || !def) return null;

  const logical = def.logical === "web" ? LOGICAL.web : LOGICAL.phone;
  const name = slot.screenId.replace(/-/g, " ");

  return (
    <span
      role="img"
      aria-label={`Concept screen for ${project.name}: ${name}. ${RECREATION_CAPTION}`}
      data-testid="recreation-figure"
      data-screen-id={slot.screenId}
      data-frame={def.frame}
      data-logical-width={logical.width}
      className="block"
      style={{ width: `${widthPct}%` }}
    >
      {def.frame === "browser" ? (
        <BrowserFrame>
          <ScaledCanvas logicalWidth={logical.width} logicalHeight={logical.height}>
            <Component />
          </ScaledCanvas>
        </BrowserFrame>
      ) : (
        <PhoneFrame>
          <ScaledCanvas logicalWidth={logical.width} logicalHeight={logical.height}>
            <Component />
          </ScaledCanvas>
        </PhoneFrame>
      )}
    </span>
  );
}

/**
 * The angled device cluster at the top of a project card.
 *
 * Devices are rotated and overlapped rather than stood up flat, because a row
 * of upright rectangles reads as a screenshot dump. The front device carries the
 * project's primary action; the ones behind show other parts of the same app.
 *
 * A recreation always carries its caption in its accessible name. A capture
 * never does, because there is nothing to disclose.
 */
export function DevicePreview({
  project,
  screenId,
  aspect = "5:4",
}: {
  project: Project;
  /** Preferred screen for a single-device project. */
  screenId: string;
  /** Media box shape. The home page widens web cards to 4:3. */
  aspect?: MediaAspect;
}) {
  const tokens = tokensFor(project.slug);
  const isPhone = project.type === "mobile";
  const layout = COMPOSITION[isPhone ? "phone" : "browser"];

  // Honour the preferred screen first, then fill the remaining slots.
  const slots = pickSlots(project, layout.length);
  if (slots.length === 0) return null;

  // The preferred screen only overrides when everything on show is drawn. If
  // any slot holds a real capture, swapping one out for a drawing would replace
  // evidence of the actual product with a concept, so the captures stand and
  // the preference is ignored.
  if (slots.every((s) => s.kind === "recreation") && !slots.some((s) => s.screenId === screenId)) {
    if (screenId && getScreenDef(project.slug, screenId)) {
      slots[0] = { kind: "recreation", screenId };
    }
  }
  const arranged = slots.slice(0, layout.length);

  return (
    <div
      data-testid="device-media"
      className="relative w-full shrink-0 overflow-hidden border-b border-border"
      style={{
        aspectRatio: `${MEDIA_ASPECT[aspect]}`,
        // Warm chrome on every card: the wash comes from the project's warm
        // card palette, never from the app's own cool primary colour. The
        // screens inside the devices keep their authentic hues.
        backgroundImage: `radial-gradient(120% 90% at 50% 0%, ${tokens.cardWash} 0%, ${tokens.accentWash} 60%, ${tokens.accentWash} 100%)`,
      }}
    >
      {/* Dot texture, borrowed from the hero so the two do not disagree. */}
      <span aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 opacity-60" />

      <div
        className="absolute inset-0 flex items-center justify-center p-3 sm:p-4"
        style={{ perspective: "1400px" }}
      >
        {arranged.map((slot, index) => {
          const spec = layout[index];
          return (
            <div
              key={`${slot.kind}-${slot.screenId}-${index}`}
              className="relative shrink-0 [transform-style:preserve-3d]"
              style={{
                width: `${spec.width}%`,
                marginLeft: index === 0 ? 0 : `${spec.marginLeft}%`,
                zIndex: spec.z,
                transform: `rotate(${spec.rotate}deg) translateY(${spec.lift}%)`,
              }}
            >
              {/* A large soft shadow plus a thin light rim, so the device lifts
                  off the wash instead of sitting flat on it. Browsers get the
                  heavier shadow so the pair balances the phones. */}
              <div
                className={
                  isPhone
                    ? "rounded-[1.75rem] shadow-[0_22px_44px_-14px_rgba(35,28,24,0.38)] ring-1 ring-white/45"
                    : "rounded-lg shadow-[0_30px_60px_-16px_rgba(35,28,24,0.5)] ring-1 ring-white/45"
                }
              >
                <SlotDevice project={project} slot={slot} widthPct={100} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Whether this project has anything to put in the media box.
 *
 * A project with no capture and no recreation gets a text stand-in instead, so
 * the card still occupies the same space and the row still lines up.
 */
export function hasDevice(project: Project): boolean {
  return pickSlots(project, 1).length > 0;
}

/**
 * True when this card will show a drawn screen rather than a capture.
 *
 * Only true when the named screen genuinely exists, so a card is never counted
 * as having a recreation that will not be drawn.
 */
export function isRecreated(project: Project, screenId: string): boolean {
  if (project.screenshots.length > 0) return false;
  return Boolean(getMockScreens(project.slug)[screenId]);
}

/**
 * Whether this card draws at least one screen rather than showing captures.
 *
 * This is the question the caption has to answer, so it asks the same picker
 * the card does. Deciding it from `project.screenshots` instead gets it wrong
 * in the case that matters most: a project holding both a recreation registry
 * and a capture list can end up drawing one and showing the other.
 */
export function drawsScreens(project: Project): boolean {
  return pickSlots(project, COMPOSITION[project.type === "mobile" ? "phone" : "browser"].length).some(
    (slot) => slot.kind === "recreation",
  );
}

/**
 * The screen a card or hero prefers to lead with.
 *
 * The sign-in screen is deliberately skipped: it is the least informative
 * screen a project owns, and a hero that opens on a login form reads as a
 * placeholder. Falls back to the first declared screen when there is no
 * alternative.
 */
export function preferredScreen(project: Project): string {
  return (
    project.mockScreens?.find((id) => id !== "login") ??
    project.mockScreens?.[0] ??
    ""
  );
}