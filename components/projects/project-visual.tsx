import Image from "next/image";

import type { Project } from "@/data/projects";
import { projectImagePath } from "@/data/projects";

/**
 * The visual for a project. When a thumbnail exists it is rendered as an
 * image; otherwise the project name is set large as the visual. Text-first is
 * a deliberate design, not a broken-image placeholder.
 */
export function ProjectVisual({
  project,
  alt,
  className,
  sizes,
  priority = false,
}: {
  project: Project;
  /** Overrides the derived alt text. */
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (project.thumbnail) {
    return (
      <Image
        src={project.thumbnail}
        alt={alt ?? `${project.name} interface`}
        fill
        sizes={sizes}
        priority={priority}
        className={className ?? "object-cover"}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={
        className ??
        "flex h-full w-full items-center justify-center bg-muted px-6"
      }
    >
      <span className="text-center font-heading text-lg font-medium tracking-tight text-muted-foreground sm:text-xl">
        {project.name}
      </span>
    </div>
  );
}

/** True when the project has at least one real gallery image. */
export function hasScreenshots(project: Project) {
  return project.screenshots.length > 0;
}

/** The first gallery image, used as the hero shot when no thumbnail is set. */
export function heroScreenshot(project: Project) {
  return project.screenshots[0] ?? null;
}

export { projectImagePath };
