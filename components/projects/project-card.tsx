import Link from "next/link";

import { ProjectBadges } from "@/components/projects/project-badges";
import { ProjectCtas } from "@/components/projects/project-ctas";
import { ProjectVisual } from "@/components/projects/project-visual";
import { tokensFor } from "@/components/projects/mock-screens/tokens";
import type { Project } from "@/data/projects";

import { DevicePreview, hasDevice, preferredScreen } from "./device-preview";

/** Technologies shown on the card — a small, fixed slice of the full stack. */
function CardTech({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Flatten the grouped tech into a short list for the card. */
function pickCardTech(project: Project, limit = 4): string[] {
  const flat = project.technologies.flatMap((group) => group.items);
  return flat.slice(0, limit);
}

export function ProjectCard({
  project,
  headingLevel = 3,
}: {
  project: Project;
  /** Keep the page's heading order intact: 2 under a bare h1, 3 under an h2. */
  headingLevel?: 2 | 3;
}) {
  const tech = pickCardTech(project);
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article
      className="group relative flex w-full flex-col overflow-hidden rounded-lg border border-border transition-[transform,box-shadow,border-color] duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_4px_12px_-2px_oklch(0_0_0/0.10)] focus-within:border-brand focus-within:ring-2 focus-within:ring-ring"
      // Each card carries its own warm tint, the same one the home page uses,
      // so a row of cards reads as one warm family rather than a single flat
      // colour.
      style={{ background: tokensFor(project.slug).accentWash }}
    >
      {/* The visual box is 5:4 on every card, matching the home page, so a
          row of cards lines up whether it shows devices or an abstract
          stand-in. Projects with a UI render the angled device cluster; the
          rest get the abstract composition. */}
      {hasDevice(project) ? (
        <DevicePreview project={project} screenId={preferredScreen(project)} />
      ) : (
        <div className="relative block aspect-5/4 w-full overflow-hidden border-b border-border">
          <ProjectVisual
            project={project}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <ProjectBadges project={project} />

        <Heading className="font-heading text-base font-semibold tracking-[-0.01em]">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {project.name}
          </Link>
        </Heading>

        <p className="text-sm text-muted-foreground">{project.shortDescription}</p>

        <CardTech items={tech} />

        {/* z-10: the title's stretched ::after link paints above static
            content, so without this the CTAs are unclickable. */}
        <div className="relative z-10 mt-auto pt-1">
          <ProjectCtas project={project} size="sm" />
        </div>
      </div>
    </article>
  );
}
