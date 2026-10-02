import Image from "next/image";

import { BrowserFrame } from "@/components/projects/browser-frame";
import { PhoneFrame } from "@/components/projects/phone-frame";

import { getScreenDef, RECREATION_CAPTION } from "@/data/mock-screens";
import type { Project } from "@/data/projects";

import { getMockScreens } from "@/components/projects/mock-screens/registry";
import { ScaledCanvas } from "@/components/projects/mock-screens/scaled-canvas";
import { LOGICAL } from "@/components/projects/mock-screens/tokens";

/**
 * The device on a landing-page project card.
 *
 * Priority order:
 *  1. a real capture, drawn in the frame that matches the project type;
 *  2. the labeled recreation named by `screenId`;
 *  3. nothing.
 *
 * Case 3 is a real possibility and must stay empty. A previous version fell
 * back to whichever screen happened to be registered first, so asking for a
 * screen that did not exist produced a wrong screen under a label claiming it
 * was the right one. Nothing is drawn instead.
 *
 * The frame follows the screen's own definition rather than the project's
 * type. A web screen is authored at 1280x800 and belongs in a browser frame;
 * forcing one into a 360x780 phone does not scale it, it just crushes it.
 *
 * A capture never receives the caption. A recreation always does, on screen and
 * in its accessible name, because nothing else distinguishes it from a
 * photograph of a running app.
 */
export function DevicePreview({
  project,
  screenId,
}: {
  project: Project;
  /** Which recreated screen to draw. Ignored when a real capture exists. */
  screenId: string;
}) {
  // A capture for this exact screen wins. A web project with any capture at
  // all falls back to its first one, because a browser shot beats a drawing.
  const exact = project.screenshots.find((s) => s.id === screenId);
  const shot =
    exact ?? (project.type === "mobile" ? undefined : project.screenshots[0]);

  if (shot) {
    const image = (
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        className="h-auto w-full"
        sizes="(max-width: 640px) 80vw, 30vw"
      />
    );
    return project.type === "mobile" ? (
      <PhoneFrame>{image}</PhoneFrame>
    ) : (
      <BrowserFrame>{image}</BrowserFrame>
    );
  }

  const Component = getMockScreens(project.slug)[screenId];
  const def = getScreenDef(project.slug, screenId);
  if (!Component || !def) return null;

  const logical = def.logical === "web" ? LOGICAL.web : LOGICAL.phone;
  const name = screenId.replace(/-/g, " ");
  const alt = `Concept screen for ${project.name}: ${name}. ${RECREATION_CAPTION}`;

  const canvas = (
    <ScaledCanvas
      logicalWidth={logical.width}
      logicalHeight={logical.height}
    >
      <Component />
    </ScaledCanvas>
  );

  return (
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