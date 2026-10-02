import Image from "next/image";

import { BrowserFrame } from "@/components/projects/browser-frame";
import { PhoneFrame } from "@/components/projects/phone-frame";

import { getScreenDef, RECREATION_CAPTION } from "@/data/mock-screens";
import type { Project } from "@/data/projects";

import { getMockScreens } from "@/components/projects/mock-screens/registry";
import { ScaledCanvas } from "@/components/projects/mock-screens/scaled-canvas";
import { LOGICAL } from "@/components/projects/mock-screens/tokens";

/**
 * Aspect of the media box every card uses, and how much of that height a device
 * is allowed to take.
 *
 * The fit is derived rather than hard-coded. A device of logical aspect `d`
 * scaled so its height is `fill` of the box height needs a width of
 * `d * fill / boxAspect`, as a fraction of the box width. Solving it here means
 * a phone (360x780) and a browser screen (1280x800) both land inside the same
 * box without either being cropped, and changing either ratio does not
 * silently break the other.
 */
const MEDIA_ASPECT = 4 / 3;
const MEDIA_FILL = 0.92;

function fitWidthPercent(logical: { width: number; height: number }): number {
  const deviceAspect = logical.width / logical.height;
  const pct = (deviceAspect * MEDIA_FILL / MEDIA_ASPECT) * 100;
  return Math.min(100, Math.round(pct * 100) / 100);
}

/**
 * The device on a project card.
 *
 * Priority order:
 *  1. a real capture, drawn in the frame that matches the project type;
 *  2. the labeled recreation named by `screenId`;
 *  3. nothing.
 *
 * Case 3 is a real possibility and stays empty. An earlier version fell back to
 * whichever screen happened to be registered first, so asking for a screen that
 * did not exist drew the wrong screen under a label claiming it was the right
 * one.
 *
 * Everything sits inside one fixed-ratio box, which is what makes the cards line
 * up: two devices of very different shapes still occupy the same space.
 *
 * A capture never receives the caption. A recreation always does, on screen and
 * in its accessible name.
 */
export function DevicePreview({
  project,
  screenId,
}: {
  project: Project;
  /** Which recreated screen to draw. Ignored when a real capture exists. */
  screenId: string;
}) {
  // A capture for this exact screen wins. A web project with any capture at all
  // falls back to its first one, because a browser shot beats a drawing.
  const exact = project.screenshots.find((s) => s.id === screenId);
  const shot =
    exact ?? (project.type === "mobile" ? undefined : project.screenshots[0]);

  return (
    <div
      data-testid="device-media"
      className="relative w-full shrink-0 overflow-hidden border-b border-border bg-muted/40"
      style={{ aspectRatio: `${MEDIA_ASPECT}` }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-3">
        {shot ? (
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            // Contained, never covered: a 16:10 capture in a 4:3 box must not
            // lose its edges, and a phone mockup must not be cropped to fit.
            className="max-h-full max-w-full object-contain"
            sizes="(max-width: 768px) 90vw, 40vw"
          />
        ) : (
          <Recreation project={project} screenId={screenId} />
        )}
      </div>
    </div>
  );
}

/** A drawn screen, framed and scaled to the width the box allows it. */
function Recreation({
  project,
  screenId,
}: {
  project: Project;
  screenId: string;
}) {
  const Component = getMockScreens(project.slug)[screenId];
  const def = getScreenDef(project.slug, screenId);
  if (!Component || !def) return null;

  const logical = def.logical === "web" ? LOGICAL.web : LOGICAL.phone;
  const name = screenId.replace(/-/g, " ");
  const alt = `Concept screen for ${project.name}: ${name}. ${RECREATION_CAPTION}`;

  const canvas = (
    <ScaledCanvas logicalWidth={logical.width} logicalHeight={logical.height}>
      <Component />
    </ScaledCanvas>
  );

  return (
    <div style={{ width: `${fitWidthPercent(logical)}%` }} className="min-w-0">
      <span
        role="img"
        aria-label={alt}
        data-testid="recreation-figure"
        data-screen-id={screenId}
        data-frame={def.frame}
        data-logical-width={logical.width}
        className="block w-full"
      >
        {def.frame === "browser" ? (
          <BrowserFrame>{canvas}</BrowserFrame>
        ) : (
          <PhoneFrame>{canvas}</PhoneFrame>
        )}
      </span>
    </div>
  );
}

/**
 * True when this card will show a drawn screen rather than a capture.
 *
 * Only true when the named screen genuinely exists, so a card is never counted
 * as having a recreation that will not be drawn.
 */
export function isRecreated(project: Project, screenId: string): boolean {
  if (project.screenshots.some((s) => s.id === screenId)) return false;
  if (project.type === "mobile" && project.screenshots.length > 0) return false;
  return Boolean(getMockScreens(project.slug)[screenId]);
}