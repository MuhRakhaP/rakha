import Image from "next/image";

import { cn } from "cn";

import { BrowserFrame } from "@/components/projects/browser-frame";
import { PhoneFrame } from "@/components/projects/phone-frame";

import { getScreenDef, RECREATION_CAPTION } from "@/data/mock-screens";
import type { Project } from "@/data/projects";

import { getMockScreens } from "@/components/projects/mock-screens/registry";
import { ScaledCanvas } from "@/components/projects/mock-screens/scaled-canvas";
import { LOGICAL } from "@/components/projects/mock-screens/tokens";

/**
 * Shape of the media box on every card.
 *
 * 5:4 is the default for the grid, because it is wide enough for an angled pair
 * of browser frames and tall enough for a phone at a believable size, and one
 * ratio for all cards is what makes the text below every device start on the
 * same line: if mobile and web cards used different boxes, their titles would
 * not line up across a row.
 *
 * 16:10 is the home page's lead treatment, where one card takes the full width
 * and a 5:4 box would leave a metre-wide band of empty stage around a phone.
 */
const MEDIA_ASPECT = {
  "5:4": 5 / 4,
  "4:3": 4 / 3,
  "16:10": 16 / 10,
  /**
   * The full-width card at the end of a two-column row. A three-item row would
   * otherwise leave the last cell half empty, and at 1120px wide the 5:4 box
   * would be an 896px band taller than the lead card it sits under.
   */
  "16:9": 16 / 9,
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
  sizes,
  priority,
}: {
  project: Project;
  slot: Slot;
  widthPct: number;
  sizes: string;
  priority: boolean;
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
        //
        // `brightness/contrast`, not `mix-blend-mode: multiply`. Multiply was
        // measured to be inert here: the device cluster sits inside a
        // 3D-transformed wrapper, so each frame blends against its own isolated
        // backdrop and the pixels come out identical.
        //
        // Applied to real captures only. A photograph of a light app is
        // unpredictable at any brightness, so dimming it is the only lever. A
        // recreation is not: its text is real DOM text at a known colour, and
        // the filter pushed those pairs to 2.75:1, which fails AA. Axe caught 22
        // nodes of it. The drawn screens keep their own authored colours, which
        // measure 8.06:1 at their worst pair, so they sit unfiltered and the
        // recreation card is a little brighter than its neighbour by intent.
        className="h-auto w-full brightness-[0.62] contrast-[1.1]"
        sizes={sizes}
        preload={priority}
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
      // No brightness filter, unlike the capture branch above. These are drawn
      // from known tokens, and dimming them failed WCAG AA on 22 text nodes at
      // the worst pair (2.75:1). Authored colours clear it at 8.06:1.
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
  sizes = "(max-width: 768px) 60vw, 20vw",
  priority = false,
  className,
}: {
  project: Project;
  /** Preferred screen for a single-device project. */
  screenId: string;
  /** Media box shape. The home page widens web cards to 4:3. */
  aspect?: MediaAspect;
  /**
   * How wide the capture inside the frame is rendered. It is not the width of the
   * media box: the devices sit at a percentage of it, so a full-width lead card
   * needs a much larger value than the grid default or the browser downloads a
   * 256px file and stretches it across 600px.
   */
  sizes?: string;
  /** Set on the capture that is the page's LCP element. Passed to next/image as
   * `preload`: `priority` is deprecated in Next 16 and no longer emits the
   * preload hint the lead card needs. */
  priority?: boolean;
  /**
   * Layout on the box itself, for the one card that sits beside its own text
   * rather than above it. `sm:w-1/2 sm:self-stretch` beats the `w-full` and the
   * inline aspect ratio, which is what makes the media fill the column instead
   * of keeping its own height.
   */
  className?: string;
}) {
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
      className={cn(
        "card-stage relative w-full shrink-0 overflow-hidden border-b border-border",
        className,
      )}
      style={{
        aspectRatio: `${MEDIA_ASPECT[aspect]}`,
      }}
    >
      {/* Dot texture, borrowed from the hero so the two do not disagree. */}
      <span aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 opacity-60" />

      {/* A recreation carries its own disclosure, so the media box itself says
          nothing: the script that draws it adds the "not a live screenshot"
          wording to every frame's accessible name, and each consumer site
          renders a visible caption under the box. The old badge lived here, a
          floating pill on the artwork, and the owner asked for it on the card
          instead, below the mockup, where it reads as a caption rather than as
          a watermark over the image. The badge has gone; the disclosure has
          not. */}

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center p-3 transition-transform duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-4",
          // The hover move lives on this wrapper, never on a device: each device
          // already carries its own rotate and translate from COMPOSITION, and a
          // second transform on the same element would cancel it.
          isPhone
            ? "motion-safe:group-hover/card:rotate-[3deg] motion-safe:group-hover/card:scale-[1.02]"
            : "motion-safe:group-hover/card:scale-[1.05]",
        )}
        style={{ perspective: "1400px" }}
      >
        {arranged.map((slot, index) => {
          const spec = layout[index];
          // `min-w-0` below is load-bearing. A capture is an <img> with
          // intrinsic width 1440, and that div is a flex item: with the default
          // `min-width: auto` the flex algorithm refuses to shrink it below its
          // content, so the device grew to the full intrinsic width and the page
          // scrolled sideways at every viewport (measured: 1514px of document
          // width at a 390px viewport, which is what visual-check reported as
          // "+1124px" at every breakpoint).
          return (
            <div
              key={`${slot.kind}-${slot.screenId}-${index}`}
              className="relative min-w-0 shrink-0 [transform-style:preserve-3d]"
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
                    ? "rounded-[1.75rem] shadow-[0_22px_44px_-14px_rgba(2,6,12,0.55)] ring-1 ring-white/10"
                    : "rounded-lg shadow-[0_30px_60px_-16px_rgba(2,6,12,0.65)] ring-1 ring-white/10"
                }
              >
                <SlotDevice
                  project={project}
                  slot={slot}
                  widthPct={100}
                  sizes={sizes}
                  priority={priority}
                />
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