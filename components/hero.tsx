"use client";

import Link from "next/link";
import { ArrowDownToLine } from "lucide-react";
import { useRef } from "react";

import { ImpactMetrics } from "@/components/impact-metrics";
import { buttonVariants } from "@/components/ui/button";
import { Starfield } from "@/components/ui/starfield";
import { TypingText } from "@/components/ui/typing-text";
import { site } from "@/lib/site";

/**
 * The hero.
 *
 * A client component because two things on it move on their own: the starfield
 * twinkle and the bloom that follows the pointer. Keeping them here rather than
 * marking the whole page client-side leaves the projects grid and the skills
 * grid on the server, which is where they belong.
 *
 * One column, centred, capped at the measure a paragraph can actually be read
 * at. It was two columns with a portrait on the right; with no photograph to put
 * there, the second column was a column of initials, and a circle of initials
 * beside a name is decoration competing with the name.
 *
 * Height is content-driven rather than a forced viewport, so the metrics land
 * above the fold on a laptop instead of below it.
 */
export function Hero({
  summary,
  availability,
}: {
  summary: string;
  /** Real availability status from the CV owner, shown with its dot. */
  availability: string;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const pointerFrame = useRef(0);

  // The bloom follows the pointer. The offset is written straight to the node,
  // because putting it in state would re-render this tree on every mouse move.
  // One animation frame in flight at a time, and the value is a transform
  // position, so nothing here triggers layout.
  function trackPointer(event: React.PointerEvent<HTMLElement>) {
    const node = heroRef.current;
    if (!node || pointerFrame.current) return;
    pointerFrame.current = requestAnimationFrame(() => {
      pointerFrame.current = 0;
      const box = node.getBoundingClientRect();
      node.style.setProperty("--mx", `${event.clientX - box.left}px`);
      node.style.setProperty("--my", `${event.clientY - box.top}px`);
    });
  }

  return (
    <section
      ref={heroRef}
      onPointerMove={trackPointer}
      className="relative -mx-5 flex flex-col justify-center overflow-hidden px-5 pt-12 pb-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 lg:py-24 min-w-0"
    >
      <div aria-hidden="true" className="hero-wash pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0 opacity-70" />
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="hero-pointer-glow pointer-events-none absolute inset-0" />
<Starfield />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-14 min-w-0">
        {/* Left: text column */}
        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left lg:w-2/3 min-w-0">
          {/* A status, not a category label. The headline says who he is and
              this says whether he is taking work, which the headline does not,
              and the dot marks a real state the owner supplied, so it sits
              still instead of pulsing. The badge sits below the buttons, not
              above the name: at the top it read as a category label for the
              headline, which is the one place a pill has nothing to add. Down
              here it answers the question the buttons raise, which is whether
              there is a next step. */}
          <p className="text-xs font-medium tracking-[0.18em] text-brand uppercase">
            <TypingText text={site.role} />
          </p>

          <h1 className="font-heading text-display font-semibold tracking-[-0.02em]">
            <span className="text-gradient">{site.name}</span>
          </h1>

          {/* The CV's headline line, verbatim. It is the one sentence on the
              page that names the role, the stack, and the years in a single
              line, so an ATS reads the same string the visitor does. Foreground
              rather than the accent: the name already spends the gradient, and
              this line was the hardest text on the page to read at 14px. */}
          <p className="max-w-2xl text-lg font-medium tracking-[-0.01em] text-foreground sm:text-xl">
            {site.headline}
          </p>

          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            {summary}
          </p>

          {/* Three actions, one filled. The projects link is the only thing on
              the site asking to be pressed first, and it matches the header
              button so the two never disagree about what matters. */}
          <div className="mt-1 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/projects"
              className={buttonVariants({ variant: "glow", size: "xl" })}
            >
              View projects
            </Link>
            {site.resumeUrl ? (
              <a
                href={site.resumeUrl}
                download
                className={buttonVariants({ variant: "outline", size: "xl" })}
              >
                Download CV
                <ArrowDownToLine aria-hidden="true" data-icon="inline-end" />
                <span className="sr-only">(PDF)</span>
              </a>
            ) : null}
            <a
              href={`mailto:${site.email}`}
              className={buttonVariants({ variant: "ghost", size: "xl" })}
            >
              Let&apos;s Talk
            </a>
          </div>

          <p className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand-weak px-4 py-1.5 text-sm font-medium text-foreground">
            <span aria-hidden="true" className="size-2 rounded-full bg-success" />
            {availability}
          </p>

          {/* Employer and city on their own line, separated by a real middot.
              The dot inherits the line's colour rather than the border token,
              which sits at 1.27 against the background and would render a
              separator nobody can see. */}
          <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-sm text-muted-foreground lg:justify-start">
            <span>{site.role} at PT. Terasys Virtual</span>
            <span aria-hidden="true">·</span>
            <span>{site.location}</span>
          </p>
        </div>

        {/* Right: info panel — replaces the old portrait slot. The portrait
            slot was a circle of initials, which read as decoration competing
            with the name. A small, dense fact box is what the right column was
            meant to be: dense, specific, scannable. */}
        <div className="lg:w-1/3 flex items-start min-w-0">
          <aside className="w-full rounded-xl border border-border bg-card p-5 text-sm min-w-0 overflow-hidden">
            {/* A panel label, not a heading. As an `h3` it skipped a level under the
              hero's `h1`, which axe reports, and nothing here is a section. */}
            <p className="mb-3 text-xs font-medium tracking-[0.08em] text-brand uppercase">
              Currently
            </p>
            <dl className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div>
                <dt className="text-xs font-medium tracking-[0.08em] text-brand uppercase">Role</dt>
                <dd>{site.role}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-[0.08em] text-brand uppercase">Employer</dt>
                <dd>PT. Terasys Virtual</dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-[0.08em] text-brand uppercase">Status</dt>
                <dd className="inline-flex items-center gap-2 text-foreground">
                  <span aria-hidden="true" className="size-2 rounded-full bg-success" />
                  {availability}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-[0.08em] text-brand uppercase">Location</dt>
                <dd>{site.location}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-[0.08em] text-brand uppercase">Availability</dt>
                <dd className="text-brand">Open to work</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>

      <ImpactMetrics />
    </section>
  );
}