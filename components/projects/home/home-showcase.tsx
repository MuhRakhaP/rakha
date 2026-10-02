import type { Project } from "@/data/projects";

import { tokensFor } from "@/components/projects/mock-screens/tokens";

import { isRecreated } from "./device-preview";
import { HomeProjectCard } from "./home-project-card";
import { RecreationCaption } from "@/components/projects/mock-screens/recreation-caption";
import { HOME_HERO_SCREEN } from "@/data/mock-screens";

/**
 * The landing-page project grid.
 *
 * A plain two column grid. The earlier version was a horizontal strip with the
 * centre card scaled up and the others down, which meant nothing lined up: the
 * cards had different heights, the devices inside them sat at different sizes,
 * and the text below each device started at a different y position. A grid with
 * `items-stretch` and a fixed-ratio media box solves all three at once, because
 * every card occupies exactly the same box.
 *
 * It is a server component. There used to be a client strip here purely to hold
 * the selected index for the scale and the dot controls. With a grid there is no
 * selection, no scaling and no horizontal scroll, so there is no state left to
 * own and no reason to ship the tree to the browser.
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

  const anyRecreation = projects.some((p) => {
    const screenId = HOME_HERO_SCREEN[p.slug] ?? p.mockScreens?.[0] ?? "";
    return isRecreated(p, screenId);
  });

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