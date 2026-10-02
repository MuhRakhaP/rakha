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
 * saying so. The composition is a warm card with the dot texture and one
 * clear, filled illustration drawn from the project's own concepts — a
 * support chat for an assistant, a monitoring dashboard for a backend —
 * never a placeholder box and never a fake screenshot.
 */
export function AbstractVisual({ project }: { project: Project }) {
  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full flex-col overflow-hidden bg-card px-4 py-4 sm:px-5"
    >
      <span className="hero-grid pointer-events-none absolute inset-0 opacity-60" />

      {project.type === "ai" ? (
        <AiVisual />
      ) : project.type === "backend" ? (
        <BackendVisual />
      ) : (
        <GenericVisual project={project} />
      )}
    </div>
  );
}

/**
 * An assistant has no screen to photograph, so the illustration shows what it
 * does instead: one clear support exchange where the assistant answers from
 * the knowledge base. The wording is generic and the whole thing is
 * decorative, so it can never be mistaken for a real capture. The retrieval
 * details live on the case study, not on the card.
 */
function AiVisual() {
  return (
    <div className="relative flex h-full flex-col rounded-xl border border-border bg-background/70 p-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand-weak text-brand">
          <Bot className="size-4" strokeWidth={2} />
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          Support assistant
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3 py-4">
        <div className="flex justify-end">
          <span className="max-w-[80%] rounded-xl rounded-br-sm bg-foreground/90 px-3.5 py-2 text-xs leading-relaxed text-background">
            How do I reset my password?
          </span>
        </div>
        <div className="flex justify-start">
          <span className="max-w-[85%] rounded-xl rounded-bl-sm border border-border bg-card px-3.5 py-2 text-xs leading-relaxed text-foreground">
            Based on the knowledge base, here&apos;s how…
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-t border-border pt-3">
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-border" />
        <span className="size-2 rounded-full bg-border" />
      </div>
    </div>
  );
}

/**
 * A backend has no screen either, so the illustration shows the pipeline it
 * automates as a monitoring dashboard: a live header and a processing chart.
 * The bars are decorative and nothing here is a number or a claim; the
 * detailed flow lives on the case study.
 */
function BackendVisual() {
  return (
    <div className="relative flex h-full flex-col rounded-xl border border-border bg-background/70 p-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-medium text-muted-foreground">
          Delivery automation
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5 text-[0.6875rem] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-success" />
          Live
        </span>
      </div>

      <div className="flex flex-1 items-end gap-2 py-4">
        {[45, 70, 35, 85, 55, 75, 40].map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className="flex-1 rounded-t-md bg-brand/25"
          />
        ))}
      </div>

      <div className="flex gap-2 border-t border-border pt-3">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <span
            key={day}
            className="flex-1 text-center text-[0.625rem] text-muted-foreground"
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Fallback for a project type with no dedicated illustration: the type icon,
 * the type label and the project name, centred on the warm card.
 */
function GenericVisual({ project }: { project: Project }) {
  const icon =
    project.type === "backend" ? (
      <Server className="size-7" strokeWidth={1.75} />
    ) : project.type === "ai" ? (
      <Bot className="size-7" strokeWidth={1.75} />
    ) : (
      <Boxes className="size-7" strokeWidth={1.75} />
    );

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 px-6">
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