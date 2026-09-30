import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Project } from "@/data/projects";

type Size = "sm" | "default" | "lg";

/**
 * CTAs rendered purely by field presence. A missing field renders no button at
 * all — never a disabled one, never a fabricated link.
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
  const buttons: { key: string; node: React.ReactNode }[] = [];

  if (project.caseStudy) {
    buttons.push({
      key: "case-study",
      node: (
        <Button variant="outline" size={size} render={<Link href={`/projects/${project.slug}`} />}>
          View Case Study
        </Button>
      ),
    });
  }

  if (project.liveDemo) {
    buttons.push({
      key: "live-demo",
      node: (
        <Button
          size={size}
          render={
            <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" />
          }
        >
          Live Demo
          <ExternalLink aria-hidden="true" data-icon="inline-end" />
          <span className="sr-only">(opens in a new tab)</span>
        </Button>
      ),
    });
  }

  if (project.downloadApk) {
    buttons.push({
      key: "download-apk",
      node: (
        <Button
          variant="secondary"
          size={size}
          render={
            <a
              href={project.downloadApk}
              target="_blank"
              rel="noopener noreferrer"
              download
            />
          }
        >
          Download APK
          <Download aria-hidden="true" data-icon="inline-end" />
          <span className="sr-only">(opens in a new tab)</span>
        </Button>
      ),
    });
  }

  if (project.github) {
    buttons.push({
      key: "github",
      node: (
        <Button
          variant="ghost"
          size={size}
          render={
            <a href={project.github} target="_blank" rel="noopener noreferrer" />
          }
        >
          Source
          <ExternalLink aria-hidden="true" data-icon="inline-end" />
          <span className="sr-only">(opens in a new tab)</span>
        </Button>
      ),
    });
  }

  if (buttons.length === 0) return null;

  return (
    <div className={className ?? "flex flex-wrap items-center gap-2"}>
      {buttons.map((button) => (
        <span key={button.key}>{button.node}</span>
      ))}
    </div>
  );
}
