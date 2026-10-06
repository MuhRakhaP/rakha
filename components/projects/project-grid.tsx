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
  // Two columns, not three, for the reason written on the home page grid: the
  // card now carries a one-line problem and a metric block, and a third column
  // squeezes both to four wrapped lines. An odd list gets its last card across
  // both columns rather than stranded in half a row.
  return (
    <ul className="grid items-stretch gap-6 sm:grid-cols-2">
      {projects.map((project, index, list) => {
        const orphan = list.length % 2 === 1 && index === list.length - 1;
        return (
          <li
            key={project.slug}
            className={orphan ? "sm:col-span-2" : "flex"}
          >
            <Reveal className="flex w-full" delay={Math.min(index, 5) * 80}>
              <ProjectCard
                project={project}
                headingLevel={2}
                wide={orphan}
              />
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
