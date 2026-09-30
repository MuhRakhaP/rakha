import type { Metadata } from "next";
import Link from "next/link";

import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import { getFeaturedProjects, getProjectsByTags } from "@/data/projects";
import { skillGroups } from "@/lib/skills";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Hero copy: the CV summary trimmed to two sentences. `/about` keeps the
 * full `summary`. Nothing here is invented — it is the CV wording with the
 * second sentence shortened.
 */
const heroSummary =
  "Software Engineer with 3+ years of professional experience building and maintaining full-stack web applications, backend services, REST APIs, and business automation systems. Experienced from system design through deployment and maintenance.";

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

export default function HomePage() {
  const featured = getFeaturedProjects(4);
  const aiAndAutomation = getProjectsByTags(["ai", "automation"]);

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

      {/* Selected Projects */}
      <Reveal>
        <section className="flex flex-col gap-6 border-t border-border pt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-brand uppercase">
                Work
              </p>
              <h2 className="font-heading text-2xl font-semibold tracking-[-0.015em]">
                Selected Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="text-sm text-brand underline-offset-4 transition-colors hover:decoration-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              All projects
            </Link>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2">
            {featured.map((project) => (
              <li key={project.slug} className="flex">
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* AI & Automation */}
      {aiAndAutomation.length > 0 && (
        <Reveal>
          <section className="flex flex-col gap-6 border-t border-border pt-12">
            <div className="flex flex-col gap-2">
              <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-brand uppercase">
                Automation
              </p>
              <h2 className="font-heading text-2xl font-semibold tracking-[-0.015em]">
                AI &amp; Automation
              </h2>
              <p className="max-w-2xl text-muted-foreground">
                Systems that replace manual work with automated workflows, and
                assistants that ground their answers in real documentation.
              </p>
            </div>

            <ul className="flex flex-col gap-6">
              {aiAndAutomation.map((project) => (
                <li key={project.slug}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

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
            {skillGroups.map((group) => (
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
    </div>
  );
}
