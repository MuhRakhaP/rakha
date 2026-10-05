import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/reveal";
import type { Project } from "@/data/projects";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No projects in this category yet.
      </p>
    );
  }

  // Staggered by position in the list, capped so a long row does not leave the
  // last cards waiting: past the fifth card the delay stops growing.
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <li key={project.slug} className="flex">
          <Reveal className="flex w-full" delay={Math.min(index, 5) * 80}>
            <ProjectCard project={project} headingLevel={2} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
