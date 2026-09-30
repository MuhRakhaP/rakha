"use client";

import { useEffect, useState } from "react";

import { cn } from "cn";

export interface SectionLink {
  id: string;
  title: string;
}

/**
 * Desktop-only in-page navigation for a case study. Highlights the section
 * currently in view. Hidden below `lg` where it would eat vertical space.
 */
export function SectionNav({ sections }: { sections: SectionLink[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    if (sections.length === 0) return;

    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => node !== null);

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      // A band near the top of the viewport: whichever heading sits there is
      // the one the reader is on.
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length < 2) return null;

  return (
    <nav
      aria-label="Case study sections"
      className="sticky top-8 hidden self-start lg:block"
    >
      <ul className="flex flex-col gap-1 border-l border-border pl-4">
        {sections.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isActive
                    ? "font-medium text-brand"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {section.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
