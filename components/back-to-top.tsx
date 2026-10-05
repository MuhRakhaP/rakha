"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/** Scroll distance before the control appears. */
const SHOW_AFTER = 500;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          // Honour the OS setting rather than animating a scroll the reader has
          // asked not to see.
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      aria-label="Back to top"
      className={`fixed right-4 bottom-4 z-40 flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-[0_6px_16px_-6px_rgba(35,28,24,0.3)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-brand hover:text-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <ArrowUp aria-hidden="true" className="size-4" />
    </button>
  );
}
