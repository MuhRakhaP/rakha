"use client";

import { useCallback, useRef, useState } from "react";

export interface HomeStripItem {
  slug: string;
  label: string;
  /** Pre-rendered card. Passed in from the server so the strip stays presentational. */
  card: React.ReactNode;
}

/**
 * The only client part of the landing-page showcase.
 *
 * It owns the selected index and nothing else. Cards arrive as server-rendered
 * elements, so the strip holds no knowledge of project data, tokens, or the
 * screens inside the devices.
 *
 * Layout follows the app-store screenshot pattern: the selected card at 105% and
 * the rest at 95%, overlapping softly. Below `lg` it becomes a flat scroll-snap
 * row, where every card is the same size because a scrolling row has no centre.
 *
 * Selection is driven by dots rather than by clicking a card, because each card
 * is already a link to its case study and nesting one control inside another
 * would leave the selection unreachable by keyboard.
 */
export function HomeProjectStrip({
  items,
  label,
}: {
  items: HomeStripItem[];
  label: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const last = items.length - 1;
      let next: number | null = null;
      if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
      else if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = last;
      if (next === null) return;
      event.preventDefault();
      setActive(next);
      refs.current[next]?.focus();
      refs.current[next]?.scrollIntoView({
        block: "nearest",
        inline: "center",
        behavior: "auto",
      });
    },
    [active, items.length],
  );

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      <div
        role="group"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:items-center lg:justify-center lg:gap-0 lg:overflow-visible lg:px-0"
      >
        {items.map((item, index) => {
          const on = active === index;
          return (
            <li
              key={item.slug}
              ref={(node) => {
                refs.current[index] = node;
              }}
              data-active={on ? "true" : "false"}
              className={[
                "w-[17.5rem] shrink-0 snap-start lg:w-[16.5rem]",
                "transition-transform motion-reduce:transition-none",
                on ? "z-10 lg:scale-105" : "z-0 lg:scale-95 lg:-mx-7",
              ].join(" ")}
            >
              {item.card}
            </li>
          );
        })}
      </div>

      {/* Selection control. One tab stop per dot, arrow keys handled above. */}
      <div className="flex items-center justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => {
              setActive(index);
              refs.current[index]?.scrollIntoView({
                block: "nearest",
                inline: "center",
                behavior: "auto",
              });
            }}
            aria-label={`Show ${item.label}`}
            aria-current={active === index}
            className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span
              aria-hidden="true"
              className={`h-2.5 rounded-full transition-all motion-reduce:transition-none ${
                active === index ? "w-6 bg-foreground" : "w-2.5 bg-border"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}