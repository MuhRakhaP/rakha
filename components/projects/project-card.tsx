import Link from "next/link";

import { CountUp } from "@/components/ui/count-up";
import { ProjectBadges } from "@/components/projects/project-badges";
import { ProjectCtas } from "@/components/projects/project-ctas";
import { ProjectVisual } from "@/components/projects/project-visual";
import { cn } from "cn";
import type { Project } from "@/data/projects";

import { DevicePreview, drawsScreens, hasDevice, preferredScreen } from "./device-preview";

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
 * What the card shows instead of the case study's three paragraphs: one
 * sentence of problem, and the one figure that came out of it.
 *
 * `cardProblem` is its own field rather than `problem` truncated with CSS,
 * because truncation lands wherever the width happens to run out. Each line is
 * written in the same entry as the paragraph it came from.
 *
 * The figure counts up on scroll, and it sits in a tinted block of its own so a
 * reader's eye lands on it before the sentence above. Where the CV records no
 * outcome there is no block: THINKPOS and KOPIFLOW render only the problem, and
 * an empty block would advertise that something is missing.
 *
 * `resultsIndex` reads the source sentence straight from `results`, so the
 * number on the card and the sentence in the case study come from one place.
 * An out-of-range index drops the metric rather than printing an index error.
 */
function CardSummary({ project }: { project: Project }) {
  const metric = project.cardMetric;
  const source = metric ? project.results?.[metric.resultsIndex] : undefined;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base leading-relaxed text-muted-foreground">
        {project.cardProblem ?? project.problem ?? "Not documented."}
      </p>

      {metric && source ? (
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="font-heading text-title font-semibold tracking-[-0.02em] text-foreground tabular-nums">
            <CountUp value={metric.value} suffix={metric.suffix} />
          </p>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">
            {metric.label}
          </p>
          <p className="mt-2 text-sm leading-snug text-muted-foreground">
            {source}
          </p>
        </div>
      ) : null}
    </div>
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
  wide = false,
}: {
  project: Project;
  /** Keep the page's heading order intact: 2 under a bare h1, 3 under an h2. */
  headingLevel?: 2 | 3;
  variant?: "default" | "featured";
  /** Set on the one card that is in the first viewport. */
  priority?: boolean;
  /**
   * Set when this card spans both grid columns because the row would otherwise
   * end with one card alone beside an empty cell.
   *
   * The media box goes landscape for it. At 1120px the card's default 5:4 ratio
   * would be a 896px image area taller than the lead card it sits below, and a
   * diagram drawn for a 333px phone card would scale its labels to three times
   * their intended size. 16:9 keeps the block near the height of a normal card.
   */
  wide?: boolean,
}) {
  const featured = variant === "featured";
  const tech = pickCardTech(project, featured ? 6 : 4);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  // `wide` does not change the media box shape, only its placement. Below 640px
  // the card stacks, so the box is the same 5:4 a normal card uses: at 16:9 and
  // 335px wide the diagram measured 188px tall and its labels came out at 10.1px,
  // under the floor. In the row layout at 640px and up, `sm:self-stretch` sets
  // the height from the flex line and the aspect ratio stops applying, which is
  // what makes the media match its own column.
  const mediaAspect = featured ? "aspect-16/10" : "aspect-5/4";

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
        // Side by side above 640px. A full-width card that stacked its media
        // on top ran to 1047px, as tall as the lead card, and scaled a diagram
        // drawn for a 333px phone card up to 39px labels. Halving the media
        // keeps the label scale near a normal card and the block to the height
        // of a row instead of the height of the lead.
        wide && "sm:flex-row sm:items-stretch",
      )}
    >
      {/* The media box. Two shapes because two things provide it: a device
          preview carries its own aspect ratio inline, so it is the element that
          takes the wide layout directly, while a drawn diagram has no box of
          its own and needs one here. */}
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
          className={cn(
            wide && "sm:w-1/2 sm:self-stretch sm:border-r sm:border-b-0",
          )}
        />
      ) : (
        <div
          className={cn(
            "relative w-full shrink-0 overflow-hidden border-b border-border",
            mediaAspect,
            wide && "sm:w-1/2 sm:self-stretch sm:border-r sm:border-b-0",
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

      {/* Caption under a recreation mockup. The badge that used to float on the
          artwork is gone: it read as a watermark over the image, and the owner
          asked for the disclosure under the box instead. Only a card showing
          drawn screens gets one, because a card showing a capture has nothing
          to disclose. `mt-2` and left-aligned so it reads as a caption to the
          picture above, not as a second title under the image. */}
      {drawsScreens(project) ? (
        <p
          role="note"
          className="px-5 pt-0 pb-1 text-xs leading-snug text-muted-foreground"
        >
          Concept preview. Actual screenshots coming soon.
        </p>
      ) : null}

      <div
        className={cn(
          "flex flex-1 flex-col gap-3",
          featured ? "p-6" : "p-5",
          wide && "sm:justify-center",
        )}
      >
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

        <CardSummary project={project} />

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