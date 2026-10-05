import { cn } from "cn";

import { Badge } from "@/components/ui/badge";
import { roles, type Role } from "@/lib/experience";

/**
 * The work history, newest first, as one timeline.
 *
 * Shared by the home page and /experience rather than written twice: the home
 * page used to carry a four-card employer grid and a one-line teaser pointing
 * at a second full timeline, so the same four roles appeared in three places
 * and the two copies could disagree. One component, two callers, each choosing
 * how many bullets a role gets.
 *
 * The rail is drawn per item, not once on the list, so the line stops at the
 * last marker instead of running past it. `left-[7px]` is the centre of the
 * 15px dot, which is what keeps the line running through the markers. It shows
 * on a phone as well as on a desktop: a timeline whose only visible part is the
 * desktop one is not a timeline, it is decoration.
 *
 * The date column is the reason for the sticky column at `lg`: it is the field
 * a reader scans first, and holding it while the bullets scroll past is what
 * makes four roles skimmable. It is `text-base` and full foreground, because
 * the date range was the smallest, greyest thing in the section.
 */
export function ExperienceTimeline({
  limit,
  headingLevel = 3,
}: {
  /** Bullets per role. Undefined shows every highlight the CV lists. */
  limit?: number;
  /** 2 on a page whose title is an h1, 3 under a section heading. */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <ol className="flex flex-col">
      {roles.map((role, index) => (
        <li
          key={`${role.company}-${role.period}`}
          className="relative grid gap-x-8 gap-y-3 pl-8 pb-10 last:pb-0 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-x-10 lg:pb-12"
        >
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-0 left-[7px] w-px bg-border last:hidden"
          />
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-1.5 left-0 size-[15px] rounded-full border-2 bg-background",
              // The current role is the one a reader is looking for, so its
              // marker is the accent and a filled centre. Every other marker is
              // an empty ring: a dot colour that means something beats a dot
              // that is decoration.
              isCurrent(role) ? "border-brand bg-brand" : "border-border",
            )}
          />

          <div className="flex flex-col gap-1 lg:sticky lg:top-24 lg:self-start">
            <Heading className="font-heading flex flex-wrap items-center gap-2 text-lg font-semibold tracking-[-0.015em]">
              {role.company}
              {isCurrent(role) ? <Badge variant="outline">Current</Badge> : null}
            </Heading>
            <p className="text-sm text-muted-foreground">
              {role.title} · {role.location}
            </p>
            <p className="text-base font-medium text-foreground tabular-nums">
              {role.period}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <ul className="flex list-disc flex-col gap-2 pl-5">
              {pickHighlights(role, limit).map((highlight) => (
                <li key={highlight} className="text-sm leading-relaxed text-muted-foreground">
                  {highlight}
                </li>
              ))}
            </ul>
            <span className="sr-only">
              Role {index + 1} of {roles.length}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** "Present" is the CV's own word for an ongoing role. */
function isCurrent(role: Role): boolean {
  return /present/i.test(role.period);
}

/**
 * The first N highlights, or all of them. The CV leads each role with the
 * bullets carrying its sourced percentages, so a cut takes them first and never
 * lands on weaker evidence than what it drops.
 */
function pickHighlights(role: Role, limit?: number): string[] {
  return limit === undefined ? role.highlights : role.highlights.slice(0, limit);
}