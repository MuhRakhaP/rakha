import { RecreationCaption } from "@/components/projects/mock-screens/recreation-caption";

import { CLOCKORA_SCREENS, HOME_HERO_SCREEN, TERAHOME_SCREENS, THINKPOS_SCREENS } from "@/data/mock-screens";
import type { Project } from "@/data/projects";

import { tokensFor } from "@/components/projects/mock-screens/tokens";

import { HomeProjectCard } from "./home-project-card";
import { HomeProjectStrip, type HomeStripItem } from "./home-project-strip";
import { isRecreated } from "./device-preview";

const DEFS: Record<string, Record<string, { headline: string; subline: string }>> =
  {
    thinkpos: THINKPOS_SCREENS,
    clockora: CLOCKORA_SCREENS,
    terahome: TERAHOME_SCREENS,
  };

/**
 * The landing-page project strip.
 *
 * Every project gets a card. One that has a real capture shows it; one that has
 * a labeled recreation shows the recreation instead; anything else falls back to
 * the plain text visual, which is what the old grid card already did. Nothing
 * is left empty and nothing is presented as a capture when it is not.
 */
export function HomeShowcase({ projects }: { projects: Project[] }) {
  const items: HomeStripItem[] = projects.map((project) => {
    const screenId = HOME_HERO_SCREEN[project.slug] ?? project.mockScreens?.[0] ?? "";
    const def = DEFS[project.slug]?.[screenId];

    return {
      slug: project.slug,
      label: project.name,
      card: (
        <HomeProjectCard
          project={project}
          screenId={screenId}
          headline={def?.headline ?? project.tagline}
          subline={def?.subline ?? project.shortDescription}
          accent={tokensFor(project.slug).accentWash}
        />
      ),
    };
  });

  if (items.length === 0) return null;

  const anyRecreation = projects.some((p) => {
    const screenId = HOME_HERO_SCREEN[p.slug] ?? p.mockScreens?.[0] ?? "";
    return isRecreated(p, screenId);
  });

  return (
    <div data-testid="project-showcase" className="flex flex-col gap-4">
      <HomeProjectStrip items={items} label="Featured projects" />
      {anyRecreation ? (
        <div className="max-w-md">
          <RecreationCaption />
        </div>
      ) : null}
    </div>
  );
}