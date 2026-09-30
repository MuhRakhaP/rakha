"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { cn } from "cn";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "backend", label: "Backend" },
  { value: "ai", label: "AI" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

/**
 * The only interactive part of the index. Writes the choice to the URL so the
 * grid itself stays a Server Component and the filter is linkable.
 */
export function ProjectFilter({ counts }: { counts: Record<FilterValue, number> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const current = (searchParams.get("type") ?? "all") as FilterValue;
  const active = FILTERS.some((f) => f.value === current) ? current : "all";

  const select = useCallback(
    (value: FilterValue) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") params.delete("type");
      else params.set("type", value);
      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `/projects?${query}` : "/projects", {
          scroll: false,
        });
      });
    },
    [router, searchParams],
  );

  return (
    <div
      role="group"
      aria-label="Filter projects by type"
      aria-busy={pending || undefined}
      className="flex flex-wrap gap-2"
    >
      {FILTERS.map((option) => {
        const isActive = active === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => select(option.value)}
            aria-pressed={isActive}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
              isActive
                ? "border-brand bg-brand-weak text-brand"
                : "border-border bg-background text-muted-foreground hover:border-brand hover:text-foreground",
            )}
          >
            {option.label}
            <span className="ml-1.5 tabular-nums opacity-60">
              {counts[option.value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
