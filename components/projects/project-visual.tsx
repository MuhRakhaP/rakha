import Image from "next/image";

import { TYPE_LABEL } from "@/components/projects/project-badges";
import type { Project } from "@/data/projects";

/**
 * The visual for a project. When a thumbnail exists it is rendered as an
 * image; otherwise the project name becomes the visual.
 *
 * The text-first branch is a deliberate composition — accent-tinted panel,
 * oversized name, type label — not an empty grey box standing in for a
 * missing image.
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
        priority={priority}
        // Scale the image itself, never the card. The parent frame has a
        // fixed aspect ratio and overflow-hidden, so this cannot reflow.
        className="object-cover motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03]"
      />
    );
  }

  return (
    // Warm card surface with a restrained accent wash across the top only,
    // rather than a solid block of accent. The label and name sit on the
    // card surface below the band, never on the tint.
    <div
      aria-hidden="true"
      className="relative flex h-full w-full flex-col overflow-hidden bg-card"
    >
      <span className="absolute inset-x-0 top-0 h-2/5 bg-brand-weak" />
      <div className="relative mt-auto flex flex-col items-center gap-2 px-6 pt-6 pb-5">
        <span className="text-[0.6875rem] font-medium tracking-[0.08em] text-brand uppercase">
          {TYPE_LABEL[project.type]}
        </span>
        <span className="text-center font-heading text-2xl font-semibold tracking-[-0.02em] text-foreground sm:text-3xl">
          {project.name}
        </span>
      </div>
    </div>
  );
}
