import Image from "next/image";
import {
  ArrowRight,
  Bot,
  Boxes,
  Cpu,
  Database,
  Server,
  Sparkles,
} from "lucide-react";

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
 * saying so. The composition is a warm card with the dot texture and a filled
 * illustration drawn from the project's own concepts — a chat exchange with a
 * RAG flow for an assistant, a monitoring dashboard for a backend — never a
 * placeholder box and never a fake screenshot.
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

/** Small labelled node used by the RAG flow. */
function FlowNode({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="flex min-w-0 flex-col items-center gap-1">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-brand-weak text-brand">
        {icon}
      </span>
      <span className="max-w-full truncate text-[0.625rem] font-medium text-muted-foreground">
        {label}
      </span>
    </span>
  );
}

/**
 * An assistant has no screen to photograph, so the illustration shows what it
 * does instead: a support chat where the assistant answers from the knowledge
 * base, with the retrieval-augmented flow underneath. The wording is generic
 * and the whole thing is decorative, so it can never be mistaken for a real
 * capture.
 */
function AiVisual() {
  return (
    <div className="relative flex h-full flex-col gap-3">
      {/* Chat window: a user question, the assistant answering from the
          knowledge base, and a typing indicator. */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-xl border border-border bg-background/70 p-3">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-brand-weak text-brand">
            <Bot className="size-3.5" strokeWidth={2} />
          </span>
          <span className="text-[0.6875rem] font-medium text-muted-foreground">
            Support assistant
          </span>
        </div>

        <div className="flex justify-end">
          <span className="max-w-[85%] rounded-lg rounded-br-sm bg-foreground/90 px-2.5 py-1.5 text-[0.6875rem] leading-snug text-background">
            How do I reset my password?
          </span>
        </div>

        <div className="flex justify-start">
          <span className="max-w-[90%] rounded-lg rounded-bl-sm border border-border bg-card px-2.5 py-1.5 text-[0.6875rem] leading-snug text-foreground">
            Based on the knowledge base, here&apos;s how…
          </span>
        </div>

        <div className="mt-auto flex items-center gap-1 px-1">
          <span className="size-1.5 rounded-full bg-border" />
          <span className="size-1.5 rounded-full bg-border" />
          <span className="size-1.5 rounded-full bg-border" />
        </div>
      </div>

      {/* RAG flow: Knowledge Base → LLM → Response. */}
      <div className="flex shrink-0 items-center justify-between gap-1 rounded-xl border border-border bg-background/70 px-3 py-2">
        <FlowNode icon={<Database className="size-3.5" strokeWidth={2} />} label="Knowledge Base" />
        <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
        <FlowNode icon={<Cpu className="size-3.5" strokeWidth={2} />} label="LLM" />
        <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
        <FlowNode icon={<Sparkles className="size-3.5" strokeWidth={2} />} label="Response" />
      </div>
    </div>
  );
}

/**
 * A backend has no screen either, so the illustration shows the pipeline it
 * automates: live sources, a processing chart, and the events it emits. The
 * labels are the project's own concepts, the bars are decorative, and nothing
 * here is a number or a claim.
 */
function BackendVisual() {
  const sources = ["EPS", "Auto In Portal", "Follow-ups"];
  const events = [
    "Delivery data retrieved",
    "Due date updated",
    "Supplier notified",
  ];

  return (
    <div className="relative flex h-full flex-col gap-3">
      {/* Live sources, drawn from the project's own concepts. */}
      <div className="flex shrink-0 flex-wrap items-center gap-1.5">
        {sources.map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-2 py-0.5 text-[0.6875rem] text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-success" />
            {label}
          </span>
        ))}
      </div>

      {/* Processing chart. Decorative bars, no numbers. */}
      <div className="flex min-h-0 flex-1 items-end gap-1.5 rounded-xl border border-border bg-background/70 p-3">
        {[45, 70, 35, 85, 55, 75, 40].map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className="flex-1 rounded-t-sm bg-brand/25"
          />
        ))}
      </div>

      {/* Events the pipeline emits. */}
      <div className="flex shrink-0 flex-col gap-1 rounded-xl border border-border bg-background/70 px-3 py-2">
        {events.map((line) => (
          <span
            key={line}
            className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground"
          >
            <span className="size-1 shrink-0 rounded-full bg-brand/50" />
            {line}
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