import Image from "next/image";

import { ArchitectureVisual } from "@/components/projects/architecture-visual";
import type { Project } from "@/data/projects";

/**
 * The visual for a project. When a thumbnail exists it is rendered as an
 * image; otherwise the project's own architecture is drawn — never an empty
 * grey box, and never a fake screenshot.
 *
 * The architecture is preferred over an illustration because it is data this
 * repo already holds and can defend: node names, groupings, and connections
 * taken from the project. An invented bar chart or a support chat with invented
 * messages was decoration standing in for a screen the project does not have.
 */
export function ProjectVisual({
  project,
  sizes,
  priority = false,
}: {
  project: Project;
  sizes?: string;
  priority?: boolean;
}) {
  if (project.thumbnail) {
    return (
      <Image
        src={project.thumbnail}
        alt={`${project.name} interface`}
        fill
        sizes={sizes}
        preload={priority}
        // Scale the image itself, never the card. The parent frame has a
        // fixed aspect ratio and overflow-hidden, so this cannot reflow.
        className="object-cover motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03]"
      />
    );
  }

  return <ArchitectureVisual project={project} />;
}