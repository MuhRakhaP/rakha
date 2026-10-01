"use client";

import Image from "next/image";

import { ProjectFrame } from "@/components/projects/project-frame";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Project } from "@/data/projects";

/**
 * Screenshot gallery. A grid of real captures that opens a keyboard
 * accessible lightbox.
 *
 * Nothing here is generated: the caller does not render this at all when there
 * are no screenshots. Each shot's real width and height drive next/image so
 * the box is reserved correctly and the aspect ratio is never guessed.
 */
export function ProjectGallery({
  screenshots,
  project,
}: {
  screenshots: Project["screenshots"];
  /** Used only to pick the frame; the frame itself comes from project.type. */
  project: Project;
}) {
  if (screenshots.length === 0) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {screenshots.map((shot) => (
        <li key={shot.src}>
          <Dialog>
            <DialogTrigger
              render={
                // Always a real <button> so the trigger keeps native keyboard
                // semantics; the frame goes inside it.
                <button
                  type="button"
                  className="block w-full cursor-zoom-in rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                />
              }
            >
              <ProjectFrame
                project={project}
                shot={shot}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <span className="sr-only">Open image: {shot.alt}</span>
            </DialogTrigger>

            <DialogContent
              showCloseButton
              className="max-w-[calc(100%-2rem)] sm:max-w-4xl"
            >
              <DialogTitle className="sr-only">{shot.alt}</DialogTitle>
              <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                className="h-auto max-h-[75vh] w-full object-contain"
              />
              <p className="text-xs text-muted-foreground">{shot.alt}</p>
            </DialogContent>
          </Dialog>
        </li>
      ))}
    </ul>
  );
}
