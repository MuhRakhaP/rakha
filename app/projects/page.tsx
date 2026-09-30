import type { Metadata } from "next";

import { ProjectFilter } from "@/components/projects/project-filter";
import { ProjectGrid } from "@/components/projects/project-grid";
import { projects, PROJECT_TYPES, type ProjectType } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects: ISP billing and network management, point of sale, attendance, coffee business management, and support automation.",
  alternates: { canonical: "/projects" },
};

const VALID = new Set(PROJECT_TYPES.map((option) => option.value));

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const filter: ProjectType | "all" =
    type && VALID.has(type as ProjectType) ? (type as ProjectType) : "all";

  const visible =
    filter === "all"
      ? projects
      : projects.filter((project) => project.type === filter);

  const counts = Object.fromEntries(
    PROJECT_TYPES.map((option) => [
      option.value,
      option.value === "all"
        ? projects.length
        : projects.filter((project) => project.type === option.value).length,
    ]),
  ) as Record<(typeof PROJECT_TYPES)[number]["value"], number>;

  return (
    <div className="flex flex-col gap-10">
      <header className="max-w-2xl">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 text-muted-foreground">
          Products and systems I have designed, built, and maintained — across
          web, mobile, backend, and AI.
        </p>
      </header>

      <ProjectFilter counts={counts} />

      <ProjectGrid projects={visible} />
    </div>
  );
}
