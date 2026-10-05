"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a number up from zero when it first scrolls into view.
 *
 * Every value it is given comes from the CV. The animation is not decoration
 * here: on a case study the reader arrives at the figure before they arrive at
 * the sentence explaining it, so drawing the eye to it as it lands is the point.
 *
 * Two things keep it honest for assistive tech. The final value is exposed as
 * the element's accessible name, so a screen reader announces "88 percent"
 * immediately instead of "zero" and then a stream of numbers. And the visible
 * digits are `aria-hidden`, so nothing is announced twice.
 *
 * Reduced motion renders the final value with no animation at all.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1500,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  // The ref stays on the outer span: it is observed, and it is the element whose
  // box the threshold is measured against.
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / duration);
      // ease-out, so it decelerates into the final figure instead of stopping
      // dead, which is what makes a number feel counted rather than swapped.
      setShown(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const startCounting = () => {
      if (reduced.matches) {
        frame = requestAnimationFrame(() => setShown(value));
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    // Reduced motion still has to land on the right number, it just gets there
    // in one frame. Checked inside a frame rather than set directly, so this
    // effect never schedules a render synchronously.
    if (reduced.matches) {
      startCounting();
      return () => {
        if (frame) cancelAnimationFrame(frame);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          startCounting();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {/* The final value as real text, for assistive technology, and the
          animated digits hidden from it. `aria-label` on a bare span is
          prohibited, which axe reported on every figure on the page. */}
      <span className="sr-only">
        {value}
        {suffix}
      </span>
      <span aria-hidden="true">
        {shown}
        {suffix}
      </span>
    </span>
  );
}
