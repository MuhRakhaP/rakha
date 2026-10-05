import Link from "next/link";

import { ProjectBadges } from "@/components/projects/project-badges";
import { ProjectCtas } from "@/components/projects/project-ctas";
import { ProjectVisual } from "@/components/projects/project-visual";
import { cn } from "cn";
import type { Project } from "@/data/projects";

import { DevicePreview, hasDevice, preferredScreen } from "./device-preview";

/** Technologies shown on the card, a short slice of the full stack. */
function CardTech({ items }: { items: string[] }) {
  if (items.length === 0) {
    // Outstanding Delivery has no documented technology list yet. Saying so beats
    // a stack invented to fill the row.
    return (
      <p className="text-xs text-muted-foreground">
        Stack not documented yet.
      </p>
    );
  }

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
function pickCardTech(project: Project, limit: number): string[] {
  return project.technologies.flatMap((group) => group.items).slice(0, limit);
}

/**
 * Problem, solution, result. The three lines a hiring manager reads before the
 * feature list, in the order they would ask for them.
 *
 * Every field is optional in the data because the CV does not document all three
 * for every project. What is missing is stated rather than filled in: a card
 * with no recorded outcome says the project has none yet, which is the truth for
 * an in-development build, where an invented percentage would not be.
 */
function ProblemSolutionResult({ project }: { project: Project }) {
  const result = project.results?.[0];
  const label = project.resultLabel ?? "Result";

  return (
    <dl className="grid gap-2.5 border-t border-border pt-3">
      <div>
        <dt className="text-xs font-medium tracking-[0.08em] text-brand uppercase">
          Problem
        </dt>
        <dd className="mt-0.5 text-sm leading-snug text-muted-foreground">
          {project.problem ?? "Not documented."}
        </dd>
      </div>

      <div>
        <dt className="text-xs font-medium tracking-[0.08em] text-brand uppercase">
          Solution
        </dt>
        <dd className="mt-0.5 text-sm leading-snug text-muted-foreground">
          {project.solution ?? "Not documented."}
        </dd>
      </div>

      <div>
        <dt className="text-xs font-medium tracking-[0.08em] text-brand uppercase">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm leading-snug text-muted-foreground">
          {result ?? "No outcome measured yet."}
        </dd>
      </div>
    </dl>
  );
}

/**
 * One project card, used by the home page, /projects, and /about.
 *
 * These were three card components: a whole-card link on the home page, a
 * stretched-link card with real CTAs everywhere else, and the same again at two
 * sizes. One card means a row of projects looks the same wherever a reader meets
 * it, and a fix to the card is a fix in one place.
 *
 * `variant="featured"` is the home page's lead treatment: a wider media box, a
 * larger name, and a deeper stack slice. It exists because TERAHOME and KOPIFLOW
 * have thirteen and eleven real screenshots respectively, and a card the size of
 * the others throws most of that away.
 *
 * The whole title is one link with a stretched ::after, and the CTAs sit above
 * it with `relative z-10`. That ordering is deliberate: a button inside a link
 * is unreachable by keyboard and flagged by axe.
 */
export function ProjectCard({
  project,
  headingLevel = 3,
  variant = "default",
  priority = false,
}: {
  project: Project;
  /** Keep the page's heading order intact: 2 under a bare h1, 3 under an h2. */
  headingLevel?: 2 | 3;
  variant?: "default" | "featured";
  /** Set on the one card that is in the first viewport. */
  priority?: boolean;
}) {
  const featured = variant === "featured";
  const tech = pickCardTech(project, featured ? 6 : 4);
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article
      data-testid="project-card"
      data-project={project.slug}
      data-variant={variant}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card",
        "transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:border-brand hover:shadow-[0_0_30px_-6px_var(--glow)] motion-safe:hover:-translate-y-1",
        "focus-within:border-brand focus-within:ring-2 focus-within:ring-ring",
      )}
    >
      {hasDevice(project) ? (
        <DevicePreview
          project={project}
          screenId={preferredScreen(project)}
          aspect={featured ? "16:10" : "5:4"}
          // A browser pair fills about 55% of its box, so the lead card's real
          // image width is roughly half the card. Stating the grid default here
          // would make the browser fetch a quarter-size file for it.
          sizes={
            featured
              ? "(max-width: 640px) 92vw, (max-width: 1024px) 92vw, 55vw"
              : undefined
          }
          priority={priority}
        />
      ) : (
        <div
          className={cn(
            "relative w-full shrink-0 overflow-hidden border-b border-border",
            featured ? "aspect-16/10" : "aspect-5/4",
          )}
        >
          <ProjectVisual
            project={project}
            priority={priority}
            sizes={
              featured
                ? "(max-width: 1024px) 100vw, 66vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
          />
        </div>
      )}

      <div className={cn("flex flex-1 flex-col gap-3", featured ? "p-6" : "p-5")}>
        <ProjectBadges project={project} />

        <Heading
          className={cn(
            "font-heading font-semibold tracking-[-0.02em]",
            featured ? "text-2xl" : "text-lg",
          )}
        >
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {project.name}
          </Link>
        </Heading>

        <p className={cn("text-muted-foreground", featured ? "text-base" : "text-sm")}>
          {project.tagline}
        </p>

        {/* What kind of product it is, before what it is built with: on the
            three multi-tenant projects this is the strongest line on the card
            and it belongs above the dependency list, not buried in it. */}
        {project.platform?.length ? (
          <ul className="flex flex-wrap gap-1.5">
            {project.platform.map((item) => (
              <li
                key={item}
                className="rounded-md border border-brand/40 bg-brand-weak px-2 py-0.5 text-xs font-medium text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        <ProblemSolutionResult project={project} />

        <CardTech items={tech} />

        {/* z-10: the title's stretched ::after link paints above static
            content, so without this the CTAs are unclickable. */}
        <div className="relative z-10 mt-auto pt-1">
          <ProjectCtas project={project} size={featured ? "default" : "sm"} />
        </div>
      </div>
    </article>
  );
}