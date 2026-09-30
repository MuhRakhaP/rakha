import Link from "next/link";

import { ProjectBadges } from "@/components/projects/project-badges";
import { ProjectCtas } from "@/components/projects/project-ctas";
import { ProjectVisual } from "@/components/projects/project-visual";
import type { Project } from "@/data/projects";

/** Technologies shown on the card — a small, fixed slice of the full stack. */
function CardTech({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md border border-border px-1.5 py-0.5 text-xs text-muted-foreground"
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

export function ProjectCard({ project }: { project: Project }) {
  const tech = pickCardTech(project);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card focus-within:ring-2 focus-within:ring-ring">
      <div className="relative block aspect-16/10 w-full overflow-hidden border-b border-border">
        <ProjectVisual
          project={project}
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ProjectBadges project={project} />
        </div>

        <h3 className="font-heading text-base font-semibold tracking-tight">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {project.name}
          </Link>
        </h3>

        <p className="text-sm text-muted-foreground">{project.shortDescription}</p>

        <CardTech items={tech} />

        <div className="mt-auto pt-1">
          <ProjectCtas project={project} size="sm" />
        </div>
      </div>
    </article>
  );
}
