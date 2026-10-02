"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Draws a screen at one fixed logical size and scales it to fit its container.
 *
 * Every recreation is authored at a known pixel size, a phone at 360x780 and a
 * browser at 1280x800, so the layout inside is completely independent of how
 * much room the page gives it. Nothing reflows: the same 360px column produces
 * the same wrap points at every screen size, only smaller.
 *
 * A CSS percentage cannot express this on its own, because `transform: scale()`
 * needs a unitless factor and there is no length-to-number conversion in CSS.
 * So the factor is measured here and applied as a transform.
 *
 * The outer box carries the logical aspect ratio, which is what keeps the
 * layout height equal to the scaled height: the space reserved in the document
 * is exactly the space the scaled screen occupies, with no slack and no
 * overlap.
 */
export function ScaledCanvas({
  logicalWidth,
  logicalHeight,
  children,
}: {
  logicalWidth: number;
  logicalHeight: number;
  children: React.ReactNode;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outer.current;
    if (!el) return;

    const measure = (width: number) => {
      if (width > 0) setScale(width / logicalWidth);
    };

    measure(el.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) measure(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [logicalWidth]);

  return (
    <div
      ref={outer}
      data-testid="recreation-frame"
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: `${logicalWidth} / ${logicalHeight}` }}
    >
      <div
        data-testid="recreation-screen"
        style={{
          width: logicalWidth,
          height: logicalHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}