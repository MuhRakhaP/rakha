import type { Project } from "@/data/projects";

/**
 * How a project's multi-tenancy works, rendered as a lead plus five notes.
 *
 * Whether these are checked against the implementation travels with the notes
 * themselves, in `project.multiTenant.verified`, rather than living in the page
 * that renders them. A claim and its confidence belong in one place: the day one
 * project is re-checked and the next is not, a page-level flag would mark both.
 *
 * All three projects carrying notes have been verified, so the section renders no
 * caveat. When a fourth multi-tenant project is added without that flag, the
 * caveat comes back on its own.
 */
export function MultiTenantArchitecture({ project }: { project: Project }) {
  const multiTenant = project.multiTenant;
  if (!multiTenant) return null;

  // Five notes in two columns leaves one card alone on the last row, so the last
  // one takes the full width instead. The alternative is a half-empty row, which
  // is the same orphan this site fixed in the projects grid.
  const lastIndex = multiTenant.points.length - 1;

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-3xl text-sm text-foreground">{multiTenant.lead}</p>

      <dl className="grid gap-4 sm:grid-cols-2">
        {multiTenant.points.map((point, index) => (
          <div
            key={point.title}
            className={`flex flex-col gap-1.5 rounded-xl border border-border bg-card p-5 ${
              index === lastIndex ? "sm:col-span-2" : ""
            }`}
          >
            <dt className="text-xs font-medium tracking-[0.08em] text-brand uppercase">
              {point.title}
            </dt>
            <dd className="text-sm leading-relaxed text-muted-foreground">
              {point.detail}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}