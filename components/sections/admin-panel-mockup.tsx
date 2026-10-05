import type { Project } from "@/data/projects";

/**
 * A drawn tenant-administration panel: sidebar, header, table, per-row actions.
 *
 * It exists because the three SaaS projects have no screenshot of the one screen
 * where tenancy is visible, and a claim about data isolation with nothing to look
 * at is a claim. It is drawn rather than photographed for that reason, and it
 * says so in a caption that belongs to the component rather than to whoever
 * remembers to add one.
 *
 * Everything in it is invented and obviously so: the tenants are generic, no
 * customer is named, and the counts are small. That is what makes it safe to
 * publish and what would make it worthless as evidence, which is why the caption
 * sits directly under it.
 *
 * All of it comes from the project as data. A barbershop's tenants are
 * barbershops, an attendance platform's are companies with employees, a coffee
 * platform's are coffee businesses: one component, three different nouns, because
 * a single generic table across three case studies reads as a template filling a
 * gap rather than as each product's own admin.
 *
 * The panel is one static composition with no state of its own. The buttons are
 * drawn, not wired: they are furniture in a picture, so they are not focusable.
 */
export function AdminPanelMockup({ project }: { project: Project }) {
  const panel = project.tenantPanel;
  if (!panel) return null;

  const [nameHeading, planHeading, sizeHeading, statusHeading] = panel.columns;

  return (
    <figure className="flex flex-col gap-3">
      <div className="card-stage overflow-hidden rounded-xl border border-border">
        <div className="flex flex-col sm:flex-row">
          {/* Sidebar. Drawn, not a real nav: the whole panel is furniture. */}
          <div className="flex shrink-0 flex-col gap-1 border-b border-border p-3 sm:w-44 sm:border-r sm:border-b-0">
            <p className="px-2 pt-1 pb-2 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Tenants
            </p>
            {panel.tenants.map((tenant, index) => (
              <span
                key={tenant.name}
                className={`rounded-md px-2 py-1.5 text-xs ${
                  index === 0 ? "bg-brand-weak text-foreground" : "text-muted-foreground"
                }`}
              >
                {tenant.name}
              </span>
            ))}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <p className="font-heading text-sm font-semibold text-foreground">
                Tenant Management — Admin Panel
              </p>
              {/* The add action lives in the header now. It was a bullet at the
                  bottom of the sidebar, which read as another tenant. */}
              <span className="rounded-md border border-brand/40 bg-brand-weak px-2.5 py-1 text-xs font-medium text-foreground">
                {panel.addLabel}
              </span>
            </div>

            {/* A real <table> would be the honest element, and a table of
                invented rows is a table a screen reader reads out loud as if it
                were data. Divs keep the shape and drop the semantics, which is
                the right way to draw a picture of a table.

                The horizontal scroll is the mobile answer: at 375px five columns
                do not fit, and squeezing them turns every cell into a stack of
                two-letter fragments. `min-w` holds the row readable and the box
                scrolls sideways instead of clipping anything.

                `tabIndex` and `role="region"` are what make that scroll usable
                without a mouse: a scroll container that cannot be focused is
                unreachable content for a keyboard user, and WCAG 2.1.1 asks for
                every scrollable region to be operable that way. The label says
                what scrolls, so the focus stop announces itself. */}
            <div
              role="region"
              aria-label={`${nameHeading}, ${planHeading}, ${sizeHeading} and ${statusHeading} for each tenant. Scrolls sideways.`}
              tabIndex={0}
              className="-mx-1 overflow-x-auto px-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <div className="min-w-[34rem]">
                <div className="grid grid-cols-[minmax(0,1.5fr)_0.8fr_0.6fr_0.7fr_7.5rem] gap-3 border-b border-border pb-2 text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
                  <span>{nameHeading}</span>
                  <span>{planHeading}</span>
                  <span className="text-right">{sizeHeading}</span>
                  <span>{statusHeading}</span>
                  <span>Actions</span>
                </div>
                {panel.tenants.map((tenant) => (
                  <div
                    key={tenant.name}
                    className="grid grid-cols-[minmax(0,1.5fr)_0.8fr_0.6fr_0.7fr_7.5rem] items-center gap-3 border-b border-border/60 py-2.5 text-xs last:border-b-0"
                  >
                    <span className="truncate font-medium text-foreground">
                      {tenant.name}
                    </span>
                    <span className="text-muted-foreground">{tenant.plan}</span>
                    <span className="text-right text-muted-foreground tabular-nums">
                      {tenant.size}
                    </span>
                    {/* Status is a dot plus a word, never the colour alone: in
                        forced-colors mode the dot disappears and the word is
                        what still carries the state. */}
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <span
                        aria-hidden="true"
                        className={`size-2 rounded-full ${
                          tenant.status === "Active" ? "bg-success" : "bg-[#fbbf24]"
                        }`}
                      />
                      {tenant.status}
                    </span>
                    <span className="flex gap-1.5">
                      <span className="rounded-md border border-border px-2 py-1 text-muted-foreground">
                        View
                      </span>
                      <span className="rounded-md border border-border px-2 py-1 text-muted-foreground">
                        Suspend
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <figcaption className="text-xs text-muted-foreground">
        Admin panel mockup — actual screenshots coming soon.
      </figcaption>
    </figure>
  );
}