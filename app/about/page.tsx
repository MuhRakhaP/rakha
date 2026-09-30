import type { Metadata } from "next";
import Link from "next/link";

import { ProjectCard } from "@/components/projects/project-card";
import { buttonVariants } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { certification, education, summary } from "@/lib/experience";
import { skillGroups } from "@/lib/skills";
import { ClosingCta } from "@/components/closing-cta";

export const metadata: Metadata = {
  title: "About",
  description:
    "Muhammad Rakha Putra — Software Engineer. Background, education, certification, and the tools and technologies he works with.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-12 py-6">
      <header className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          About
        </h1>
        <p className="max-w-2xl text-lg">{summary}</p>
      </header>

      <section className="flex flex-col gap-4 border-t border-border pt-10">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          How I work
        </h2>
        <div className="flex max-w-2xl flex-col gap-4 text-muted-foreground">
          <p>
            I work across the full software development lifecycle — from
            requirements analysis and system design through development,
            testing, and deployment, into the maintenance that keeps systems
            running in production.
          </p>
          <p>
            Most of my work sits close to the business: internal systems,
            operations platforms, and the integrations that connect them. I
            build the backend services and REST APIs, design the database
            underneath them, and then make sure the thing is actually deployed,
            monitored, and maintainable.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t border-border pt-10">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Education
        </h2>
        <div className="flex flex-col gap-1">
          <p className="font-medium">{education.school}</p>
          <p className="text-sm text-muted-foreground">
            {education.major} · {education.period} · {education.location}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4 border-t border-border pt-10">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Certification
        </h2>
        <div className="flex flex-col gap-1">
          <p className="font-medium">{certification.name}</p>
          <p className="text-sm text-muted-foreground">
            {certification.issuer} · {certification.date}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-6 border-t border-border pt-10">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Skills &amp; Competencies
        </h2>
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.category}>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
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

      <section className="flex flex-col gap-6 border-t border-border pt-10">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Projects
        </h2>
        <ul className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug} className="flex">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
        <div>
          <Link href="/projects" className={buttonVariants({ variant: "outline" })}>
            All projects
          </Link>
        </div>
      </section>

      <ClosingCta />
    </div>
  );
}
