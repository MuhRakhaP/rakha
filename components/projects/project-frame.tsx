import Image from "next/image";

import { BrowserFrame } from "@/components/projects/browser-frame";
import { PhoneFrame } from "@/components/projects/phone-frame";
import type { Project } from "@/data/projects";

/**
 * Renders a real screenshot inside the frame that matches the project type.
 *
 * The frame is chosen by `project.type` from data, never by project name.
 * "backend" and "ai" get no frame at all: a browser or phone chrome would
 * misrepresent an API or an assistant as something it is not.
 *
 * Only real screenshots are ever placed inside a frame. When there is none,
 * this renders an empty frame with a muted label and no stand-in UI, so
 * nothing on the site can be mistaken for a capture.
 */
export function ProjectFrame({
  project,
  shot,
  sizes,
  priority = false,
  className,
}: {
  project: Project;
  /** Defaults to the project's thumbnail. */
  shot?: Project["screenshots"][number];
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  // No frame for API-only and assistant projects.
  if (project.type === "backend" || project.type === "ai") return null;

  const framed = project.type === "mobile";
  const Frame = framed ? PhoneFrame : BrowserFrame;

  // The thumbnail is the first real screenshot, so it carries the same src.
  const image = shot
    ? shot
    : project.thumbnail
      ? {
          src: project.thumbnail,
          alt: `${project.name} interface in a local demo workspace`,
          width: project.thumbnailWidth ?? 1440,
          height: project.thumbnailHeight ?? 900,
        }
      : null;

  // Honest empty state: a frame outline with a muted label, and deliberately no
  // placeholder UI. Nothing here pretends to be a screenshot.
  if (!image) {
    return (
      <div
        className={
          framed
            ? "mx-auto flex w-full max-w-56 items-center justify-center rounded-lg border border-dashed border-border bg-card/50 px-4 py-10 text-center"
            : "flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-card/50 px-4 py-14 text-center"
        }
      >
        <p className="text-xs text-muted-foreground">Screenshot coming soon</p>
      </div>
    );
  }

  return (
    <Frame className={className}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        className="h-auto w-full"
      />
    </Frame>
  );
}
