import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { TYPE_LABEL } from "@/components/projects/project-badges";
import type { Project } from "@/data/projects";

import { DevicePreview } from "./device-preview";

/**
 * One project card.
 *
 * Order, top to bottom: device, category and name, description, stack, action.
 * Everything is left aligned.
 *
 * `flex flex-col` with the action on `mt-auto` is what makes a row of cards line
 * up. The grid stretches every card to the height of the tallest one, the
 * description is allowed to run to whatever length it needs, and the button
 * sits on the bottom edge of all of them rather than floating mid-card where a
 * short description happens to end.
 *
 * The whole card is one link. A separate button inside a clickable card would be
 * an interactive element inside another interactive element: unreachable by
 * keyboard, and flagged by axe. The visible action is styled as a button but is
 * part of the one link, which carries its own label so the name is not read
 * twice.
 */
export function HomeProjectCard({
  project,
  screenId,
  accent,
}: {
  project: Project;
  screenId: string;
  /** Warm wash from the project's own palette. */
  accent: string;
}) {
  // A short, honest slice of the stack: four is what fits on two lines at card
  // width, and the full list is on the case study.
  const tech = project.technologies
    .flatMap((group) => group.items)
    .slice(0, 4);

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`View case study: ${project.name}`}
      data-testid="home-project-card"
      data-screen-id={screenId}
      className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-border transition-colors hover:border-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none"
      style={{ background: accent }}
    >
      <DevicePreview project={project} screenId={screenId} />

      <div className="flex flex-1 flex-col gap-3 p-5 text-left">
        <div className="flex flex-col gap-1">
          <span className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
            {TYPE_LABEL[project.type]}
          </span>
          <h3 className="font-heading text-xl leading-tight font-semibold tracking-[-0.02em]">
            {project.name}
          </h3>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.shortDescription}
        </p>

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

        {/* mt-auto pins the action to the bottom of every card in the row. */}
        <span className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-4 text-sm font-semibold text-background transition-colors group-hover/card:bg-brand group-hover/card:text-white motion-reduce:transition-none">
          View case study
          <ArrowRight aria-hidden="true" className="size-4" />
        </span>
      </div>
    </Link>
  );
}