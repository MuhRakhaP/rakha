import Image from "next/image";

import { BrowserFrame } from "@/components/projects/browser-frame";
import { PhoneFrame } from "@/components/projects/phone-frame";

import { RECREATION_CAPTION } from "@/data/mock-screens";
import type { Project } from "@/data/projects";

import { getMockScreens } from "@/components/projects/mock-screens/registry";
import { ScaledCanvas } from "@/components/projects/mock-screens/scaled-canvas";
import { LOGICAL } from "@/components/projects/mock-screens/tokens";

/**
 * The device on a landing-page project card.
 *
 * Three cases, in priority order:
 *  1. a real capture, shown in the frame that matches the project type;
 *  2. a labeled UI recreation, authored at 360x780 and scaled to fit;
 *  3. nothing, in which case the caller falls back to the text visual.
 *
 * A capture never receives the caption. A recreation always does, both on screen
 * and in its accessible name, because there is no other signal that it is not a
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
  const shot =
    project.screenshots.find((s) => s.id === screenId) ??
    (project.type === "mobile" ? undefined : project.screenshots[0]);

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

  const registry = getMockScreens(project.slug);
  const Component = registry[screenId] ?? registry[Object.keys(registry)[0]];
  if (!Component) return null;

  const alt = `Concept screen for ${project.name}: ${screenId.replace(/-/g, " ")}. ${RECREATION_CAPTION}`;

  return (
    <span
      role="img"
      aria-label={alt}
      data-testid="recreation-figure"
      className="block w-full"
    >
      <PhoneFrame>
        <ScaledCanvas logicalWidth={LOGICAL.phone.width} logicalHeight={LOGICAL.phone.height}>
          <Component />
        </ScaledCanvas>
      </PhoneFrame>
    </span>
  );
}

/** True when this project's card will show a drawn screen rather than a capture. */
export function isRecreated(project: Project, screenId: string): boolean {
  if (project.screenshots.some((s) => s.id === screenId)) return false;
  if (project.type === "mobile") return Boolean(getMockScreens(project.slug)[screenId]);
  return false;
}