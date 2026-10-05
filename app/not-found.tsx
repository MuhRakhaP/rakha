import Link from "next/link";

import { Reveal } from "@/components/reveal";

/**
 * The 404 reveals itself and then stops.
 *
 * A glitch effect was asked for here and deliberately not built: it marks
 * nothing, it repeats if the page is left open, and it fights the one job this
 * screen has, which is getting the reader to the projects. The status line
 * arriving first and the message second is the version that actually
 * communicates the sequence.
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <Reveal>
        <p className="text-sm font-medium text-muted-foreground">404</p>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
      </Reveal>
      <Reveal delay={160}>
        <p className="max-w-prose text-muted-foreground">
          That page does not exist. It may have been moved, or the link may be
          wrong.
        </p>
      </Reveal>
      <Reveal delay={240}>
        <Link
          href="/projects"
          className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 transition-colors hover:text-brand hover:decoration-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Browse projects
        </Link>
      </Reveal>
    </div>
  );
}
