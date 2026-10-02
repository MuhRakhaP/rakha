import { HOME_HERO_SCREEN } from "@/data/mock-screens";
import type { Project } from "@/data/projects";

import { RecreationCaption } from "@/components/projects/mock-screens/recreation-caption";
import { tokensFor } from "@/components/projects/mock-screens/tokens";

import { drawsScreens } from "../device-preview";
import { HomeProjectCard } from "./home-project-card";

/**
 * A grid of project cards.
 *
 * A plain two column grid. An earlier version was a horizontal strip with the
 * centre card scaled up and the others down, which meant nothing lined up: the
 * cards had different heights, the devices inside them sat at different sizes,
 * and the text below each device started at a different y position. A grid with
 * `items-stretch` and one fixed-ratio media box solves all three at once.
 *
 * It is a server component. The strip used to be the one client component here,
 * purely to hold the selected index for the scale and the dot controls. With a
 * grid there is no selection, no scaling and no horizontal scroll, so there is
 * no state left to own and no reason to ship the tree to the browser.
 */
export function HomeShowcase({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  const cards = projects.map((project) => {
    const screenId = HOME_HERO_SCREEN[project.slug] ?? project.mockScreens?.[0] ?? "";
    return (
      <li key={project.slug} className="flex">
        <HomeProjectCard
          project={project}
          screenId={screenId}
          accent={tokensFor(project.slug).accentWash}
        />
      </li>
    );
  });

  // The caption discloses drawings, so it appears exactly when this group
  // actually draws one. Deciding that from the project data rather than from
  // what gets rendered gets it wrong whenever a project holds both.
  const anyRecreation = projects.some(drawsScreens);

  return (
    <div data-testid="project-showcase" className="flex flex-col gap-4">
      <ul className="grid items-stretch gap-6 sm:grid-cols-2">{cards}</ul>
      {anyRecreation ? (
        <div className="max-w-md">
          <RecreationCaption />
        </div>
      ) : null}
    </div>
  );
}