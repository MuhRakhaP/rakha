"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";

import { cn } from "cn";

import { Reveal } from "@/components/reveal";
import { PROJECT_TYPES, type ProjectType } from "@/data/projects";

/** Read from the data file rather than listed again: one set of filter labels. */
const FILTERS = PROJECT_TYPES;

type FilterValue = ProjectType | "all";

/**
 * The project type filter. The only interactive part of a projects listing.
 *
 * The choice is written to the URL, so the grid itself stays a Server
 * Component and every filtered view is linkable and survives a reload. It is
 * not `useState` filtering on the client: the same component then serves the
 * home page and /projects, and a home page that rewrites its own query string
 * loses the section anchors a reader arrived on.
 *
 * The underline is one element moved to the active tab's measured offset rather
 * than one element per tab. Five separate underlines would each need their own
 * transition and would drift out of alignment the moment the row wrapped onto
 * a second line on a narrow screen; a single measured one follows the row.
 */
export function ProjectFilter({
  counts,
  basePath = "/projects",
}: {
  counts: Record<FilterValue, number>;
  /** Where the filtered view lives. Both listings share one component. */
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const rowRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const current = (searchParams.get("type") ?? "all") as FilterValue;
  const active = FILTERS.some((f) => f.value === current) ? current : "all";

  // Measured before paint so the bar is never briefly drawn at the old tab.
  useLayoutEffect(() => {
    const row = rowRef.current;
    const button = row?.querySelector<HTMLElement>(`[data-value="${active}"]`);
    if (!row || !button) return;
    setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
  }, [active]);

  // A resize or a font swap moves the buttons without changing `active`.
  useEffect(() => {
    const measure = () => {
      const row = rowRef.current;
      const button = row?.querySelector<HTMLElement>(`[data-value="${active}"]`);
      if (!row || !button) return;
      setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
    };
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  const select = useCallback(
    (value: FilterValue) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") params.delete("type");
      else params.set("type", value);
      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${basePath}?${query}` : basePath, {
          scroll: false,
        });
      });
    },
    [basePath, router, searchParams],
  );

  return (
    <div
      ref={rowRef}
      role="group"
      aria-label="Filter projects by type"
      aria-busy={pending || undefined}
      className="relative flex flex-wrap gap-2 border-b border-border pb-3 transition-opacity duration-300 motion-reduce:transition-none"
    >
      {FILTERS.map((option, index) => {
        const isActive = active === option.value;
        return (
          <Reveal key={option.value} delay={index * 50}>
            <button
              type="button"
              data-value={option.value}
              onClick={() => select(option.value)}
              aria-pressed={isActive}
              className={cn(
                "relative rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                "cursor-pointer focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                isActive
                  ? "border-brand bg-brand-weak text-brand-lift"
                  : "border-border bg-background text-muted-foreground hover:border-brand hover:text-foreground",
              )}
            >
              {option.label}
              <span className="ml-1.5 tabular-nums opacity-60">
                {counts[option.value]}
              </span>
            </button>
          </Reveal>
        );
      })}

      {/* Underline sits under the row, not inside the button, so it can travel
          between tabs without either of them reflowing. */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 h-0.5 rounded-full bg-brand transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  );
}
