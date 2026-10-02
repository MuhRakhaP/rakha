"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ShowcaseItem {
  id: string;
  label: string;
  kind: "real" | "recreation";
  /** `phone` cards get a fixed device width; `browser` cards fill their column. */
  width: "phone" | "browser";
  content: React.ReactNode;
}

/**
 * The only client component in this feature.
 *
 * It owns two things: which card is current, and the roving keyboard focus. The
 * screens arrive as already-rendered server elements, so nothing about a
 * drawing depends on client state.
 *
 * Layout, narrow and medium (below `lg`): one flat scroll-snap row, every card
 * the same size, the row padded so its own overflow never reaches the page.
 *
 * Layout, `lg` and up: the row fits side by side, so the current card is full
 * size and sits on top while its neighbours scale to 90% and tuck underneath
 * it. No tilt, no perspective, no 3D.
 *
 * Everything that moves is a transform or a colour, so `motion-reduce` switches
 * all of it off in one place.
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
      className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:items-center lg:justify-center lg:gap-0 lg:overflow-visible lg:pb-0"
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
              "relative flex shrink-0 snap-start flex-col items-center gap-2 rounded-2xl p-2 text-left",
              "transition-transform motion-reduce:transition-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              // A device width. It has to clear the widest screen's own minimum
              // content width, or the frame ends up narrower than the drawing
              // inside it and the text gets clipped rather than wrapped.
              item.width === "phone"
                ? "w-[17.5rem] lg:w-[16rem]"
                : "w-[22rem] lg:w-[26rem]",
              // Wide enough for the row to sit side by side: the current card is
              // full size and on top, the rest step back and overlap it.
              on
                ? "z-10 lg:scale-100"
                : "z-0 lg:scale-90 lg:-mx-4",
            ].join(" ")}
          >
            <span className="w-full truncate text-xs font-medium text-muted-foreground">
              {item.label}
            </span>
            <span className="flex w-full justify-center">{item.content}</span>
          </button>
        );
      })}
    </div>
  );
}