"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "cn";

/**
 * One-shot scroll reveal: fade in with a short upward slide.
 *
 * Reduced-motion is handled in CSS (`.reveal` is forced visible under
 * `prefers-reduced-motion`), so this component does not need to branch on the
 * media query and never fires a synchronous setState.
 *
 * With JavaScript disabled the content would stay hidden, so `app/layout.tsx`
 * ships a `<noscript>` rule that forces every reveal visible.
 *
 * `variant="pop"` swaps the slide for a scale. It is here because badge-sized
 * rows read better growing into place than sliding, and adding it costs one
 * class rather than a second component with its own observer.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger in ms. */
  delay?: number;
  variant?: "rise" | "pop";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hidden =
    variant === "pop"
      ? "scale-[0.8] opacity-0"
      : "translate-y-3 opacity-0";

  return (
    <div
      ref={ref}
      style={shown ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "reveal transition-[opacity,transform] duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        shown ? "translate-y-0 scale-100 opacity-100" : hidden,
        className,
      )}
    >
      {children}
    </div>
  );
}
