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
 */
export function ProjectCtas({
  project,
  size = "default",
  className,
}: {
  project: Project;
  size?: Size;
  className?: string;
}) {
  const buttonClass = buttonVariants({ size });

  const links: { key: string; node: React.ReactNode }[] = [];

  if (project.caseStudy) {
    links.push({
      key: "case-study",
      node: (
        <Link
          href={`/projects/${project.slug}`}
          className={buttonVariants({ variant: "outline", size })}
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
        <span className="text-muted-foreground text-sm">
          Source code: Private
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
