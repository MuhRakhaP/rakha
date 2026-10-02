import type { Metadata } from "next";
import Link from "next/link";

import { HomeShowcase } from "@/components/projects/home/home-showcase";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { ClosingCta } from "@/components/closing-cta";
import { projects, type Project } from "@/data/projects";
import { skillGroups, skillHighlights } from "@/lib/skills";
import { site } from "@/lib/site";
import { roles } from "@/lib/experience";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Hero copy: the shortest CV summary sentence, verbatim.
 * CV has 3 sentences; the shortest is the 3rd one.
 */
const heroSummary = "Experienced across the full software development lifecycle, from requirements analysis and system design to development, testing, deployment, and maintenance.";

/**
 * Skills shown in the hero panel, sliced out of `lib/skills.ts` so the panel
 * can only ever show skills the CV actually lists. Takes the first N of each
 * named category.
 */
const panelSkills = [
  ...(skillGroups.find((g) => g.category === "Frontend")?.items ?? []).slice(0, 2),
  ...(skillGroups.find((g) => g.category === "Backend")?.items ?? []).slice(0, 2),
  ...(skillGroups.find((g) => g.category === "Database")?.items ?? []).slice(0, 1),
  ...(skillGroups.find((g) => g.category === "DevOps")?.items ?? []).slice(0, 1),
];

/**
 * Projects grouped by type for "What I Build" section.
 *
 * Each project appears exactly once, under its own type, in the same order
 * /projects uses (web, mobile, backend, ai). An earlier version also matched
 * the "automation" tag, which put Outstanding Delivery Automation in both
 * Backend Systems and AI & Automation — the duplication this section now
 * avoids by grouping on `type` alone.
 */
function getProjectsByCategory() {
  const byType = new Map<Project["type"], Project[]>();
  for (const project of projects) {
    const list = byType.get(project.type) ?? [];
    list.push(project);
    byType.set(project.type, list);
  }

  const labels: Record<Project["type"], string> = {
    web: "Web Applications",
    mobile: "Mobile Applications",
    backend: "Backend Systems",
    ai: "AI & Automation",
  };

  return (Object.keys(labels) as Project["type"][])
    .map((type) => ({ label: labels[type], projects: byType.get(type) ?? [] }))
    .filter((category) => category.projects.length > 0);
}

export default function HomePage() {
  const categories = getProjectsByCategory();
  const latestRole = roles[0]; // latest role from experience.ts

  return (
    <div className="flex flex-col gap-16 py-6">
      {/* Hero */}
      <section className="relative -mx-5 overflow-hidden px-5 pt-10 pb-14 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
          <div className="flex flex-col gap-6">
            <p className="text-xs font-medium tracking-[0.08em] text-brand uppercase">
              {site.role} · {site.secondaryRole}
            </p>

            <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-[-0.025em] sm:text-5xl">
              {site.name}
            </h1>

            <p className="max-w-2xl text-lg tracking-[-0.01em] text-muted-foreground">
              {heroSummary}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className={buttonVariants({
                  size: "lg",
                  className: "hover:bg-brand hover:text-white",
                })}
              >
                View Projects
              </Link>
              <a
                href={`mailto:${site.email}`}
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "hover:border-brand hover:text-brand",
                })}
              >
                Let&apos;s Talk
              </a>
              {site.resumeUrl && (
                <a
                  href={site.resumeUrl}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    className: "hover:bg-secondary hover:text-secondary-foreground",
                  })}
                >
                  Download Resume
                </a>
              )}
            </div>
          </div>

          {/* Desktop-only context panel. Mobile keeps the single column. */}
          <aside className="hidden self-start lg:flex lg:flex-col lg:gap-6 lg:rounded-lg lg:border lg:border-border lg:bg-card lg:p-6">
            <div className="flex flex-col gap-1">
              <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-brand uppercase">
                Currently
              </p>
              <p className="text-sm font-medium">
                Software Engineer at PT. Terasys Virtual
              </p>
              <p className="text-sm text-muted-foreground">
                Jakarta, Indonesia
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                Works with
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {panelSkills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-md border border-border px-2 py-0.5 text-xs"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* What I Build. The only place project cards live on this page: each
          category is an even two column grid, and each card shows the devices
          itself rather than a placeholder. */}
      {categories.length > 0 && (
        <Reveal>
          <section className="flex flex-col gap-6 border-t border-border pt-12">
            <div className="flex flex-col gap-2">
              <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-brand uppercase">
                What I Build
              </p>
              <h2 className="font-heading text-2xl font-semibold tracking-[-0.015em]">
                What I Build
              </h2>
            </div>

            <ul className="flex flex-col gap-10">
              {categories.map((category) => (
                <li key={category.label}>
                  <h3 className="font-heading mb-4 text-lg font-semibold tracking-tight">
                    {category.label}
                  </h3>
                  <HomeShowcase projects={category.projects} />
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      {/* Experience Teaser */}
      <Reveal>
        <section className="flex flex-col gap-6 border-t border-border pt-12">
          <div className="flex flex-col gap-2">
            <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-brand uppercase">
              Experience
            </p>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.015em]">
              Experience
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              {latestRole.highlights[0]}
            </p>
          </div>
          <Link
            href="/experience"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-brand underline-offset-4 transition-colors hover:decoration-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            View full experience
          </Link>
        </section>
      </Reveal>

      {/* Skills */}
      <Reveal>
        <section className="flex flex-col gap-6 border-t border-border pt-12">
          <div className="flex flex-col gap-2">
            <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-brand uppercase">
              Toolkit
            </p>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.015em]">
              Skills
            </h2>
          </div>
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skillHighlights.map((group) => (
              <div key={group.category}>
                <dt className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
                  {group.category}
                </dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-border px-2 py-0.5 text-xs"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </Reveal>

      <ClosingCta />
    </div>
  );
}


