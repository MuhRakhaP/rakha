import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/data/projects";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No projects in this category yet.
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.slug} className="flex">
          <ProjectCard project={project} headingLevel={2} />
        </li>
      ))}
    </ul>
  );
}
