import type { Project } from "@/data/projects";

export const TYPE_LABEL: Record<Project["type"], string> = {
  web: "Web",
  mobile: "Mobile",
  backend: "Backend",
  ai: "AI",
};

export const STATUS_LABEL: Record<Project["status"], string> = {
  production: "Production",
  // The only in-development project today is KOPIFLOW; "Coming Soon" reads
  // better on a card than the internal status name.
  "in-development": "Coming Soon",
};

/**
 * The type pill and status pill. Both are data-driven — nothing here knows
 * any project by name.
 */
export function ProjectBadges({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  return (
    <div className={className ?? "flex flex-wrap items-center gap-2"}>
      <span className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
        {TYPE_LABEL[project.type]}
      </span>
      {project.status === "in-development" && (
        <span className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {STATUS_LABEL[project.status]}
        </span>
      )}
    </div>
  );
}
