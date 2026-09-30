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
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger in ms. */
  delay?: number;
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

  return (
    <div
      ref={ref}
      style={shown ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "reveal transition-[opacity,transform] duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
