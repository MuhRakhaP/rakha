import Link from "next/link";
import { ArrowRight, Download, ExternalLink } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import type { Project } from "@/data/projects";

type Size = "sm" | "default" | "lg";

/**
 * CTAs rendered purely by field presence. A missing field renders no button at
 * all — never a disabled one, never a fabricated link.
 *
 * Today every project renders one button, the case study, plus the private
 * source note where it applies. There is no live demo anywhere on this site: a
 * "Live demo coming soon" button is a promise with no date, and a grid of them
 * makes a portfolio look unfinished rather than private.
 *
 * TODO: Add live demo URL when ready. Ask Rakha for permission first.
 * The URLs live in `Project.links` (`demo`, `apk`, `source`); fill a key only
 * when a real, public, working link exists, and render it from that object
 * rather than restoring the per-project fields this file used to read.
 *
 * These are real links styled with the button variants rather than the Base UI
 * Button primitive, so they keep native link semantics and announce as links.
 *
 * `hideCaseStudy` suppresses the "View Case Study" link on the case study page
 * itself, where the link would point at the page already being read.
 */
export function ProjectCtas({
  project,
  size = "default",
  className,
  hideCaseStudy = false,
}: {
  project: Project;
  size?: Size;
  className?: string;
  hideCaseStudy?: boolean;
}) {
  const buttonClass = buttonVariants({ size });

  const links: { key: string; node: React.ReactNode }[] = [];

  if (project.caseStudy && !hideCaseStudy) {
    links.push({
      key: "case-study",
      node: (
        <Link
          href={`/projects/${project.slug}`}
          // Solid, not outline. It was an outline with an accent border and it
          // read as the quieter of the two things on a card next to the title
          // link, when it is the one action the card exists to sell. The fill is
          // `--primary` at the token's own foreground: #0A0E1A on #3B82F6
          // measures 5.24 and clears AA for normal text, where white on the same
          // blue measures 3.68 and would not.
          //
          // `min-h-10` lifts it to 40px off the size scale, which stops at
          // `lg`/36px and then jumps to `xl`/44px with its own padding. 40px is
          // the target the card wants without the button outweighing the metric
          // block above it.
          className={buttonVariants({
            variant: "default",
            size,
            className: "min-h-10 gap-2 px-4 hover:bg-primary/85",
          })}
        >
          View Case Study
          <ArrowRight aria-hidden="true" data-icon="inline-end" className="size-4" />
        </Link>
      ),
    });
  }

  if (project.liveDemo) {
    links.push({
      key: "live-demo",
      node: (
        <a
          href={project.liveDemo}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          Live Demo
          <ExternalLink aria-hidden="true" data-icon="inline-end" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ),
    });
  }

  if (project.downloadApk) {
    links.push({
      key: "download-apk",
      node: (
        <a
          href={project.downloadApk}
          target="_blank"
          rel="noopener noreferrer"
          download
          className={buttonVariants({ variant: "secondary", size })}
        >
          Download APK
          <Download aria-hidden="true" data-icon="inline-end" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ),
    });
  }

  if (project.github) {
    links.push({
      key: "github",
      node: (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "ghost", size })}
        >
          Source
          <ExternalLink aria-hidden="true" data-icon="inline-end" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ),
    });
  } else if (project.sourcePrivate) {
    links.push({
      key: "source-private",
      node: (
        // A small muted badge on its own line below the buttons, so the
        // honest disclosure stays visible without competing with them.
        <span className="basis-full">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground">
            Source code: Private
          </span>
        </span>
      ),
    });
  }

  if (links.length === 0) return null;

  return (
    <div className={className ?? "flex flex-wrap items-center gap-2"}>
      {links.map((link) => (
        <span key={link.key}>{link.node}</span>
      ))}
    </div>
  );
}
