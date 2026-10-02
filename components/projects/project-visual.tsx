import Image from "next/image";
import { Bot, Boxes, Server } from "lucide-react";

import { TYPE_LABEL } from "@/components/projects/project-badges";
import type { Project } from "@/data/projects";

/**
 * The visual for a project. When a thumbnail exists it is rendered as an
 * image; otherwise an abstract composition stands in — never an empty grey
 * box, and never a fake screenshot.
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

  return <AbstractVisual project={project} />;
}

/**
 * Abstract stand-in for a project with no interface to photograph: an API or
 * an assistant has no screen, and pretending otherwise would be worse than
 * saying so. The composition is a warm card with the dot texture, a type
 * icon, the type label and the project name — a deliberate illustration, not
 * a placeholder box.
 */
export function AbstractVisual({ project }: { project: Project }) {
  const icon =
    project.type === "backend" ? (
      <Server className="size-7" strokeWidth={1.75} />
    ) : project.type === "ai" ? (
      <Bot className="size-7" strokeWidth={1.75} />
    ) : (
      <Boxes className="size-7" strokeWidth={1.75} />
    );

  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-card px-6"
    >
      <span className="hero-grid pointer-events-none absolute inset-0 opacity-60" />

      {/* Backend gets a small flow line: three nodes joined by a rule, a nod
          to the pipeline it automates rather than a screen it does not have. */}
      {project.type === "backend" && (
        <span className="relative flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-brand/40" />
          <span className="h-px w-6 bg-brand/40" />
          <span className="size-1.5 rounded-full bg-brand/60" />
          <span className="h-px w-6 bg-brand/40" />
          <span className="size-1.5 rounded-full bg-brand/40" />
        </span>
      )}

      <span className="relative flex size-14 items-center justify-center rounded-2xl border border-border bg-brand-weak text-brand">
        {icon}
      </span>

      <span className="relative text-[0.6875rem] font-medium tracking-[0.08em] text-brand uppercase">
        {TYPE_LABEL[project.type]}
      </span>
      <span className="relative text-center font-heading text-xl font-semibold tracking-[-0.02em] text-foreground">
        {project.name}
      </span>
    </div>
  );
}