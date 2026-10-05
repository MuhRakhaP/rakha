import { cn } from "cn";

import { skillGroups } from "@/lib/skills";

/**
 * Every skill group, open, as a grid of cards.
 *
 * It was an accordion with one group open and the rest behind a click. That is
 * the wrong control for a list someone is scanning: it hides two thirds of the
 * answer behind six taps, and it made the only thing visible on arrival the
 * group that happened to be first. Open groups cost more height and answer the
 * question immediately, which is the whole trade.
 *
 * No counts on the group titles. The number of skills in a category is not
 * information about the person, it is a fact about the taxonomy.
 *
 * The core row at the top is curation, not a claim: the first five are the tools
 * the CV's own summary names, in its order, and Docker because every role on the
 * timeline owns a container or a CI/CD pipeline. They are repeated rather than
 * moved, so nothing disappears from its group and nothing is counted twice in
 * the reader's eye.
 */
const CORE = [
  "Laravel",
  "Node.js",
  "TypeScript",
  "PostgreSQL",
  "Next.js",
  "Docker",
];

export function SkillsGrid({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <section aria-labelledby="core-skills-heading" className="flex flex-col gap-3">
        <h3
          id="core-skills-heading"
          className="text-xs font-medium tracking-[0.08em] text-brand uppercase"
        >
          Core
        </h3>
        <ul className="flex flex-wrap gap-2">
          {CORE.map((skill) => (
            <li
              key={skill}
              className="rounded-lg border border-brand/40 bg-brand-weak px-3 py-1.5 text-sm font-medium text-foreground"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <li
            key={group.category}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5"
          >
            <h3 className="font-heading text-base font-semibold tracking-[-0.01em]">
              {group.category}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}