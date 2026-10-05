import type { Metadata } from "next";

import { ProjectFilter } from "@/components/projects/project-filter";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Reveal } from "@/components/reveal";
import {
  countByType,
  parseProjectType,
  projects,
  sortProjectsByType,
} from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects: multi-tenant SaaS for coffee business management, point of sale, and attendance, plus ISP billing and network management and support automation.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filter = parseProjectType(type);

  // Same category order as the home page: web, mobile, backend, ai. The
  // filter views are single-type, so the sort only matters for "all".
  const visible = sortProjectsByType(
    filter === "all"
      ? [...projects]
      : [...projects].filter((project) => project.type === filter),
  );

  return (
    <div className="flex flex-col py-6">
      <Reveal>
        <header className="max-w-2xl">
          <h1 className="font-heading text-title font-semibold tracking-[-0.02em]">
            Projects
          </h1>
          <p className="mt-3 text-muted-foreground">
            Products and systems I have designed, built, and maintained, across
            web, mobile, backend, and AI.
          </p>
        </header>
      </Reveal>

      <div className="mt-section flex flex-col gap-10">
        <ProjectFilter counts={countByType()} />

        <ProjectGrid projects={visible} />
      </div>
    </div>
  );
}
