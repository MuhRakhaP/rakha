"use client";

import { useCallback, useRef, useState } from "react";

export interface ShowcaseItem {
  id: string;
  kind: "real" | "recreation";
  width: "phone" | "browser";
  /** Short benefit headline, verified against documented features. */
  headline: string;
  subline: string;
  content: React.ReactNode;
}

/**
 * The only client component in this feature.
 *
 * Layout follows the app-store screenshot pattern: one tinted card per screen,
 * a short headline and a one-line subline above the device, and a single focus
 * per card. Headlines are supplied as data by `ShowcaseStrip`, which reads them
 * from the project's own documented features.
 *
 * Below `lg`: a flat scroll-snap row, padded so its own overflow never reaches
 * the page. From `lg`: the row sits side by side, the selected card at 105% and
 * the others at 95%, overlapping softly. No tilt, no perspective.
 *
 * Everything that moves is a transform, so `motion-reduce` turns all of it off.
 */
export function ScreenSwitcher({
  items,
  label,
  accent,
}: {
  items: ShowcaseItem[];
  label: string;
  /** Warm wash behind every card, taken from the project's palette. */
  accent: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

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
        inline: "nearest",
        behavior: "auto",
      });
    },
    [active, items.length],
  );

  if (items.length === 0) return null;

  return (
    <div
      role="group"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:mx-0 sm:px-0 lg:items-center lg:justify-center lg:gap-0 lg:overflow-visible"
    >
      {items.map((item, index) => {
        const on = active === index;
        return (
          <button
            key={item.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={on}
            tabIndex={on ? 0 : -1}
            data-testid="showcase-card"
            data-screen-id={item.id}
            data-screen-kind={item.kind}
            data-active={on ? "true" : "false"}
            className={[
              "relative flex shrink-0 snap-start flex-col gap-3 rounded-2xl p-4 text-left",
              "transition-transform motion-reduce:transition-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              item.width === "phone"
                ? "w-[19rem] lg:w-[16rem]"
                : "w-[22rem] lg:w-[30rem]",
              on ? "z-10 lg:scale-105" : "z-0 lg:scale-95 lg:-mx-6",
            ].join(" ")}
            style={{ background: accent }}
          >
            <span className="block">
              <span className="block text-sm leading-snug font-semibold text-foreground">
                {item.headline}
              </span>
              <span className="mt-1 block text-xs leading-snug text-muted-foreground">
                {item.subline}
              </span>
            </span>
            <span className="flex w-full justify-center">{item.content}</span>
          </button>
        );
      })}
    </div>
  );
}