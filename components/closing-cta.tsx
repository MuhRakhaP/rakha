import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

/**
 * Closing CTA: "Interested in working together?" + "Get in Touch" button.
 * Use once per page at the bottom.
 */
export function ClosingCta() {
  return (
    <section data-testid="closing-cta" className="border-t border-border pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Interested in working together?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Open to full-stack, backend, mobile, and automation work.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className={buttonVariants({
              size: "lg",
              className: "hover:bg-brand hover:text-white",
            })}
          >
            Get in Touch
          </Link>
          <a
            href={`mailto:${site.email}`}
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "hover:border-brand hover:text-brand",
            })}
          >
            Email Me
          </a>
        </div>
      </div>
    </section>
  );
}