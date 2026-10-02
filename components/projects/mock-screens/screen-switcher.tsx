"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ShowcaseItem {
  id: string;
  /** Short headline above the frame. */
  label: string;
  /** `real` for a capture, `recreation` for a hand-drawn one. */
  kind: "real" | "recreation";
  /** Rendered card body. Already carries its own caption when a recreation. */
  content: React.ReactNode;
}

/**
 * The only client component in this feature.
 *
 * It owns two things and nothing else: which card is current, and the roving
 * keyboard focus. The screens themselves arrive as already-rendered server
 * elements, so nothing about a recreation depends on client state.
 *
 * Layout follows the strip brief: three across on desktop, and a scroll-snap
 * row on a phone so the cards step one at a time without the page ever
 * overflowing sideways.
 */
export function ScreenSwitcher({
  items,
  label,
}: {
  items: ShowcaseItem[];
  label: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow keys, Home and End move between cards. Roving tabindex means the
  // group is one tab stop, which is the expected pattern for a strip.
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

  // Keep the current card in view when the strip is selected by touch.
  useEffect(() => {
    refs.current[active]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "auto",
    });
  }, [active]);

  if (items.length === 0) return null;

  return (
    <div
      role="group"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={(node) => {
            refs.current[index] = node;
          }}
          type="button"
          onClick={() => setActive(index)}
          aria-pressed={active === index}
          tabIndex={active === index ? 0 : -1}
          data-testid="showcase-card"
          data-screen-id={item.id}
          data-screen-kind={item.kind}
          className={`group/card flex min-w-0 snap-start flex-col gap-2 rounded-xl border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none ${
            active === index
              ? "border-brand/50 bg-brand-weak/50"
              : "border-border bg-card hover:border-brand/30"
          } sm:min-w-0`}
        >
          <span className="text-[0.6875rem] font-semibold">{item.label}</span>
          <span className="flex justify-center">{item.content}</span>
        </button>
      ))}
    </div>
  );
}