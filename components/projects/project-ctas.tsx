import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import type { Project } from "@/data/projects";

type Size = "sm" | "default" | "lg";

/**
 * CTAs rendered purely by field presence. A missing field renders no button at
 * all — never a disabled one, never a fabricated link.
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
          // Solid near-black, same shape as the home card action: the "View
          // Case Study" button is one style across the whole site, so it never
          // competes with the card's own tint or with the page it sits on.
          className={buttonVariants({
            size,
            className:
              "min-h-11 rounded-xl bg-foreground px-4 font-semibold text-background hover:bg-brand hover:text-white",
          })}
        >
          View Case Study
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
