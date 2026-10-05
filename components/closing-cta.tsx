import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

/**
 * The closing CTA.
 *
 * It was a left-aligned heading, one sentence, and two buttons in a row at the
 * bottom of the page, which is the same shape as every other block on the site
 * and therefore carried no more weight than any of them. It is now the one
 * full-width band on the page: centred, its own top and bottom rule, and a
 * heading a size above a section title. There is exactly one filled button, the
 * one action worth taking first; the two profile links beside it are outline so
 * the accent is not spent three times in three buttons.
 *
 * Email is the primary because it is the channel that reaches a person. The
 * contact page carries the form, which opens the visitor's own mail client.
 */
export function ClosingCta() {
  return (
    <section
      data-testid="closing-cta"
      className="py-section flex flex-col items-center gap-6 border-y border-border text-center"
    >
      <div className="flex max-w-2xl flex-col gap-3">
        <h2 className="font-heading text-title font-semibold tracking-[-0.02em]">
          Interested in working together?
        </h2>
        <p className="text-muted-foreground">
          Open to full-stack, backend, mobile, and automation work. Email is the
          fastest way to reach me, and I read everything that comes in.
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <a
          href={`mailto:${site.email}`}
          className={buttonVariants({ variant: "glow", size: "xl" })}
        >
          Email me
        </a>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "xl" })}
        >
          LinkedIn
          <span className="sr-only">(opens in a new tab)</span>
        </a>
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "xl" })}
        >
          GitHub
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>

      <Link
        href="/contact"
        className="text-sm text-brand underline-offset-4 hover:decoration-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        Or send a message through the contact page
      </Link>
    </section>
  );
}