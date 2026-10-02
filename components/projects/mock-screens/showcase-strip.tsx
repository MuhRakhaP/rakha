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
import { ScreenSwitcher, type ShowcaseItem } from "./screen-switcher";
import { PHONE_ASPECT } from "./tokens";

const DEFS: Record<string, Record<string, MockScreenDef>> = {
  thinkpos: THINKPOS_SCREENS,
  clockora: CLOCKORA_SCREENS,
  terahome: TERAHOME_SCREENS,
};

export interface ShowcaseScreen {
  id: string;
  kind: "real" | "recreation";
  label: string;
  /** Set only when a real capture exists for this screen. */
  shot?: Project["screenshots"][number];
  /** Set only for a recreation. */
  def?: MockScreenDef;
  /** Optional note explaining a recreation that stands in for something. */
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
    if (shot) return { id, kind: "real", label: shot.alt, shot };

    const def = DEFS[project.slug]?.[id];
    return { id, kind: "recreation", label: def?.label ?? id, def, note: def?.note };
  });
}

/**
 * One framed screen: the device chrome, plus the note when the screen is a
 * drawing rather than a capture.
 *
 * The visible caption is deliberately NOT here. It appears once per strip, in
 * `ShowcaseStrip`, so it states the fact about the row rather than four times
 * over. The wording still travels with each screen inside its accessible name,
 * so a screen reader announces it per image.
 *
 * Exported because the hero needs it too. A project with no capture but with
 * recreations shows its first drawing at the top of the case study, never the
 * dashed "Screenshot coming soon" box, which would imply a capture is coming
 * rather than showing what is actually available.
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

  let body: React.ReactNode;
  if (!isRecreation && screen.shot) {
    const shot = screen.shot;
    body = (
      <Image
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        className="h-auto w-full"
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 30vw"
      />
    );
  } else {
    const Component = getMockScreens(project.slug)[screen.id];
    // One shared phone ratio across every recreation, set here so each screen
    // module does not have to remember it.
    body = Component ? (
      <div style={def?.frame === "browser" ? undefined : PHONE_ASPECT}>
        <Component />
      </div>
    ) : null;
  }

  const framed =
    def?.frame === "browser" ? (
      <BrowserFrame>{body}</BrowserFrame>
    ) : (
      <PhoneFrame>{body}</PhoneFrame>
    );

  // `role="img"` with the caption folded into the accessible name is the alt
  // text for a drawn screen: there is no <img> element, so the accessible name
  // is what a screen reader announces.
  const accessibleName = isRecreation
    ? `${def?.alt ?? screen.label}. ${RECREATION_CAPTION}`
    : screen.shot?.alt;

  return (
    <span className="flex w-full flex-col gap-2">
      <span
        role={isRecreation ? "img" : undefined}
        aria-label={accessibleName}
        data-testid={isRecreation ? "recreation-figure" : undefined}
        data-screen-id={screen.id}
        className="block w-full"
      >
        {framed}
      </span>
      {screen.note ? (
        <span className="text-xs leading-snug text-muted-foreground">
          {screen.note}
        </span>
      ) : null}
    </span>
  );
}

/**
 * The showcase strip: framed screens, one per card, with a single caption above
 * the row when any of them is a drawing.
 *
 * Real captures go through the same card, so a project holding a mix reads as
 * one deliberate row instead of two separate galleries. A capture never
 * receives the caption; that is the entire point of it.
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
    label: screen.label,
    kind: screen.kind,
    width: screen.def?.frame === "browser" ? "browser" : "phone",
    content: <ShowcaseFigure project={project} screen={screen} />,
  }));

  return (
    <div data-testid="project-showcase" className="flex flex-col gap-3">
      {hasRecreations ? <RecreationCaption /> : null}
      <ScreenSwitcher items={items} label={`${project.name} screens`} />
    </div>
  );
}