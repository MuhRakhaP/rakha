import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { TYPE_LABEL } from "@/components/projects/project-badges";
import { AbstractVisual } from "@/components/projects/project-visual";
import type { Project } from "@/data/projects";

import { DevicePreview, hasDevice } from "../device-preview";

/**
 * One project card.
 *
 * Order, top to bottom: devices, name, badges, description, stack, action.
 * Everything is left aligned.
 *
 * `flex flex-col` with the action on `mt-auto` is what makes a row line up. The
 * grid stretches every card to the height of the tallest one, the description
 * runs to whatever length it needs, and the button sits on the bottom edge of
 * all of them rather than floating mid-card where a short description ends.
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

  const badges = [
    TYPE_LABEL[project.type],
    ...(project.status === "in-development" ? ["In development"] : []),
  ];

  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`View case study: ${project.name}`}
      data-testid="home-project-card"
      data-screen-id={screenId}
      className="group/card flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border transition-colors hover:border-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none"
      style={{ background: accent }}
    >
      {hasDevice(project) ? (
        <DevicePreview project={project} screenId={screenId} />
      ) : (
        <div
          data-testid="device-media"
          className="relative w-full shrink-0 overflow-hidden border-b border-border"
          style={{ aspectRatio: "5 / 4" }}
        >
          <AbstractVisual project={project} />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5 text-left">
        <h3 className="font-heading text-xl leading-tight font-semibold tracking-[-0.02em]">
          {project.name}
        </h3>

        {/* Category and status live here rather than inside the artwork, so the
            device shot stays a picture of the product and nothing else. */}
        <ul className="flex flex-wrap gap-1.5">
          {badges.map((badge) => (
            <li
              key={badge}
              className="rounded-full border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground"
            >
              {badge}
            </li>
          ))}
        </ul>

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

        {/* mt-auto pins the action to the bottom of every card in the row. The
            button is the same solid near-black on every card, matching the
            primary CTA on the rest of the site. */}
        <span className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-4 text-sm font-semibold text-background transition-colors group-hover/card:bg-brand group-hover/card:text-white motion-reduce:transition-none">
          View case study
          <ArrowRight aria-hidden="true" className="size-4" />
        </span>
      </div>
    </Link>
  );
}