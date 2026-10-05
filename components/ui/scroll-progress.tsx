"use client";

import { useEffect, useRef } from "react";

/**
 * A two pixel reading-progress bar.
 *
 * It answers a question the reader is already asking, which is how far down the
 * page they are and how much is left, so it earns its place on a long case
 * study in a way decoration would not.
 *
 * Width is written straight to the node's transform on each scroll frame. That
 * is a compositor-only property and it skips React entirely, so scrolling never
 * queues a re-render. The percentage is kept out of the DOM entirely: a bare
 * bar carries no information a screen reader needs, and announcing a running
 * total on every frame would be noise.
 *
 * The colour is the existing brand accent. No new hue was introduced for it.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = bar.current;
    if (!node) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      node.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-brand/15"
    >
      <div
        ref={bar}
        className="h-full w-full origin-left bg-[linear-gradient(90deg,var(--brand),var(--brand-2))]"
      />
    </div>
  );
}
