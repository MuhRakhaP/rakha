import type { Metadata } from "next";
import Link from "next/link";

import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { getFeaturedProjects, getProjectsByTags } from "@/data/projects";
import { summary } from "@/lib/experience";
import { skillGroups } from "@/lib/skills";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const featured = getFeaturedProjects(4);
  const aiAndAutomation = getProjectsByTags(["ai", "automation"]);

  return (
    <div className="flex flex-col gap-16 py-6">
      {/* Hero */}
      <section className="flex flex-col gap-6">
        <p className="text-sm font-medium text-muted-foreground">
          {site.role} · {site.secondaryRole}
        </p>

        <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          {site.name}
        </h1>

        <p className="max-w-2xl text-lg text-muted-foreground">{summary}</p>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" render={<Link href="/projects" />}>
            View Projects
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<a href={`mailto:${site.email}`} />}
          >
            Let&apos;s Talk
          </Button>
        </div>

        <dl className="grid max-w-2xl gap-4 pt-2 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Currently
            </dt>
            <dd className="text-sm">
              Software Engineer at PT. Terasys Virtual
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Based in
            </dt>
            <dd className="text-sm">Indonesia</dd>
          </div>
        </dl>
      </section>

      {/* Selected Projects */}
      <section className="flex flex-col gap-6 border-t border-border pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Selected Projects
          </h2>
          <Link
            href="/projects"
            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
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

      {/* AI & Automation */}
      {aiAndAutomation.length > 0 && (
        <section className="flex flex-col gap-6 border-t border-border pt-12">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
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
      )}

      {/* Skills */}
      <section className="flex flex-col gap-6 border-t border-border pt-12">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Skills
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
    </div>
  );
}
