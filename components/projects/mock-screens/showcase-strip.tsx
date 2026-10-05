import Image from "next/image";

import { BrowserFrame } from "@/components/projects/browser-frame";
import { PhoneFrame } from "@/components/projects/phone-frame";

import {
  CLOCKORA_SCREENS,
  RECREATION_CAPTION,
  TERAHOME_SCREENS,
  THINKPOS_SCREENS,
  type MockScreenDef,
} from "@/data/mock-screens";
import type { Project } from "@/data/projects";

import { getMockScreens } from "./registry";
import { RecreationCaption } from "./recreation-caption";
import { ScaledCanvas } from "./scaled-canvas";
import { ScreenSwitcher, type ShowcaseItem } from "./screen-switcher";
import { LOGICAL } from "./tokens";

const DEFS: Record<string, Record<string, MockScreenDef>> = {
  thinkpos: THINKPOS_SCREENS,
  clockora: CLOCKORA_SCREENS,
  terahome: TERAHOME_SCREENS,
};

export interface ShowcaseScreen {
  id: string;
  kind: "real" | "recreation";
  /** Real captures have no definition, so the headline falls back to the alt. */
  headline: string;
  subline: string;
  shot?: Project["screenshots"][number];
  def?: MockScreenDef;
  note?: string;
}

/**
 * Decide what the showcase shows, screen by screen.
 *
 * This is the switching rule, in one place: a screen id listed in
 * `project.mockScreens` renders as a recreation, unless the project also has a
 * real capture carrying that same `id`, in which case the capture is used and
 * the recreation is dropped entirely. A screen can therefore never appear
 * twice, which is what the visual-check harness asserts.
 */
export function resolveShowcaseScreens(project: Project): ShowcaseScreen[] {
  return (project.mockScreens ?? []).map((id) => {
    const shot = project.screenshots.find((s) => s.id === id);
    if (shot) {
      return {
        id,
        kind: "real",
        headline: shot.alt,
        subline: "Captured from a local demo build.",
        shot,
      };
    }
    const def = DEFS[project.slug]?.[id];
    return {
      id,
      kind: "recreation",
      headline: def?.headline ?? id,
      subline: def?.subline ?? "",
      def,
      note: def?.note,
    };
  });
}

/**
 * One framed screen at its fixed logical size.
 *
 * The caption lives in the strip, once, not here. The wording still travels
 * with each screen inside its accessible name, so a screen reader announces it
 * per image.
 */
export function ShowcaseFigure({
  project,
  screen,
}: {
  project: Project;
  screen: ShowcaseScreen;
}) {
  const isRecreation = screen.kind === "recreation";
  const def = screen.def;
  const web = def?.frame === "browser";
  const logical = def?.logical === "web" ? LOGICAL.web : LOGICAL.phone;

  const body =
    !isRecreation && screen.shot ? (
      <Image
        src={screen.shot.src}
        alt={screen.shot.alt}
        width={screen.shot.width}
        height={screen.shot.height}
        className="h-auto w-full"
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 30vw"
      />
    ) : (() => {
        const Component = getMockScreens(project.slug)[screen.id];
        return Component ? <Component /> : null;
      })();

  // A drawn screen is scaled from a fixed logical size; a capture is an image
  // at its own pixel size and is left alone.
  const content = isRecreation ? (
    <ScaledCanvas logicalWidth={logical.width} logicalHeight={logical.height}>
      {body}
    </ScaledCanvas>
  ) : (
    body
  );

  const framed = web ? (
    <BrowserFrame>{content}</BrowserFrame>
  ) : (
    <PhoneFrame>{content}</PhoneFrame>
  );

  const accessibleName = isRecreation
    ? `${def?.alt ?? screen.headline}. ${RECREATION_CAPTION}`
    : screen.shot?.alt;

  return (
    <span
      role={isRecreation ? "img" : undefined}
      aria-label={accessibleName}
      data-testid={isRecreation ? "recreation-figure" : undefined}
      data-screen-id={screen.id}
      data-frame={isRecreation ? (web ? "browser" : "phone") : undefined}
      data-logical-width={isRecreation ? logical.width : undefined}
      className="block w-full"
    >
      {framed}
    </span>
  );
}

/**
 * The strip: one tinted card per screen, each a short headline and subline
 * above the device, plus a single caption under the whole row.
 *
 * Real captures go through the same card, so a project holding a mix reads as
 * one deliberate row. A capture never receives the caption.
 */
export function ShowcaseStrip({
  project,
  screens,
}: {
  project: Project;
  screens: ShowcaseScreen[];
}) {
  if (screens.length === 0) return null;

  const hasRecreations = screens.some((s) => s.kind === "recreation");

  const items: ShowcaseItem[] = screens.map((screen) => ({
    id: screen.id,
    kind: screen.kind,
    width: screen.def?.frame === "browser" ? "browser" : "phone",
    headline: screen.headline,
    subline: screen.subline,
    content: <ShowcaseFigure project={project} screen={screen} />,
  }));

  return (
    <div data-testid="project-showcase" className="flex flex-col gap-4">
      <ScreenSwitcher items={items} label={`${project.name} screens`} />
      {hasRecreations ? (
        <div className="max-w-md">
          <RecreationCaption />
        </div>
      ) : null}
    </div>
  );
}