import type { Metadata } from "next";
import Link from "next/link";

import { EducationSection } from "@/components/education-section";
import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/reveal";
import { SkillsGrid } from "@/components/skills-grid";
import { buttonVariants } from "@/components/ui/button";
import { ClosingCta } from "@/components/closing-cta";
import { projects } from "@/data/projects";
import { summary } from "@/lib/experience";

export const metadata: Metadata = {
  title: "About",
  description:
    "Muhammad Rakha Putra, Full Stack Developer. Multi-tenant SaaS platforms, backend services, and business systems, with education, certifications, and the tools he works with.",
  alternates: { canonical: "/about" },
};

/**
 * The facts beside the story, for a reader who wants them without reading.
 */
const FACTS = [
  { label: "Role", value: "Software Engineer" },
  { label: "Currently", value: "PT. Terasys Virtual" },
  { label: "Based in", value: "Jakarta, Indonesia" },
  { label: "Focus", value: "Backend services, REST APIs, business systems" },
  { label: "Experience", value: "4+ years, four employers since 2022" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col py-6">
      <Reveal>
        <header className="flex flex-col gap-4">
          <h1 className="font-heading text-title font-semibold tracking-[-0.02em]">
            About
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">{summary}</p>
        </header>
      </Reveal>

      {/* Story left, facts right. */}
      <div className="py-section grid gap-12 border-t border-border lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
        <section className="flex flex-col gap-6">
          <h2 className="font-heading text-section font-semibold tracking-[-0.015em]">
            How I work
          </h2>
          <div className="flex max-w-2xl flex-col gap-4 text-muted-foreground">
            <Reveal>
              <p>
                I work across the full software development lifecycle, from
                requirements analysis and system design through development,
                testing, and deployment, into the maintenance that keeps systems
                running in production.
              </p>
            </Reveal>
            <Reveal delay={90}>
              <p>
                Most of my work sits close to the business: internal systems,
                operations platforms, and the integrations that connect them. I
                build the backend services and REST APIs, design the database
                underneath them, and then make sure the thing is actually
                deployed, monitored, and maintainable.
              </p>
            </Reveal>
          </div>
        </section>

        <Reveal delay={120}>
          <aside className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
            <h2 className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
              At a glance
            </h2>
            <dl className="flex flex-col gap-4">
              {FACTS.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1">
                  <dt className="text-xs font-medium tracking-[0.08em] text-brand uppercase">
                    {fact.label}
                  </dt>
                  <dd className="text-sm">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </Reveal>
      </div>

      <EducationSection heading="Education & Certifications" />

      <section className="py-section border-t border-border">
        <h2 className="font-heading text-section font-semibold tracking-[-0.015em]">
          Skills &amp; Competencies
        </h2>
        <div className="mt-10">
          <SkillsGrid />
        </div>
      </section>

      <section className="py-section border-t border-border">
        <h2 className="font-heading text-section font-semibold tracking-[-0.015em]">
          Projects
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug} className="flex">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
        <div>
          <Link href="/projects" className={buttonVariants({ variant: "outline", size: "xl" })}>
            All projects
          </Link>
        </div>
      </section>

      <ClosingCta />
    </div>
  );
}
