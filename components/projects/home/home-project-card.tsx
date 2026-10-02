import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { TYPE_LABEL } from "@/components/projects/project-badges";
import type { Project } from "@/data/projects";

import { DevicePreview } from "./device-preview";

/**
 * One project card on the landing page.
 *
 * Order is deliberate and matches the app-store screenshot pattern: category,
 * project name, the benefit line, the device, the stack, then the action.
 *
 * The whole card is a single link. Making the card a button and nesting a
 * second link inside it would produce an interactive element inside another
 * interactive element, which is unreachable by keyboard and flagged by axe. The
 * visible "View case study" is styled as a button but is part of the one link,
 * and the link carries its own accessible label so the name is not read twice.
 */
export function HomeProjectCard({
  project,
  screenId,
  headline,
  subline,
  accent,
}: {
  project: Project;
  screenId: string;
  headline: string;
  subline: string;
  /** Warm wash from the project's own palette. */
  accent: string;
}) {
  // A short, honest slice of the stack. Four is what fits on one line of pills
  // at card width, and the full list is on the case study.
  const tech = project.technologies
    .flatMap((group) => group.items)
    .slice(0, 4);

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`View case study: ${project.name}`}
      data-testid="home-project-card"
      data-screen-id={screenId}
      className="group/card flex flex-col gap-4 rounded-2xl p-4 transition-transform motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      style={{ background: accent }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          {TYPE_LABEL[project.type]}
        </span>
        <h3 className="font-heading text-2xl leading-tight font-semibold tracking-[-0.02em]">
          {project.name}
        </h3>
      </div>

      {/* Benefit line, above the device, written from documented features. */}
      <div className="flex flex-col gap-1">
        <p className="text-sm leading-snug font-semibold">{headline}</p>
        <p className="text-xs leading-snug text-muted-foreground">{subline}</p>
      </div>

      <div className="flex justify-center">
        <DevicePreview project={project} screenId={screenId} />
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {tech.map((item) => (
          <li
            key={item}
            className="rounded-full border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground"
          >
            {item}
          </li>
        ))}
      </ul>

      <span className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-4 text-sm font-semibold text-background transition-colors group-hover/card:bg-brand group-hover/card:text-white motion-reduce:transition-none">
        View case study
        <ArrowRight aria-hidden="true" className="size-4" />
      </span>
    </Link>
  );
}