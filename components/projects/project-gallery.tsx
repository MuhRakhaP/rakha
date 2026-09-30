"use client";

import { useState } from "react";
import Image from "next/image";

import { DeviceFrame } from "@/components/projects/device-frame";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * Screenshot gallery. A grid of real captures that opens a keyboard
 * accessible lightbox. Nothing here is generated — if there are no
 * screenshots, the section is not rendered by the caller at all.
 */
export function ProjectGallery({
  screenshots,
  type,
}: {
  screenshots: { src: string; alt: string }[];
  /** Mobile projects render inside a device frame. */
  type: "web" | "mobile" | "backend" | "ai";
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (screenshots.length === 0) return null;

  const framed = type === "mobile";

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {screenshots.map((shot, index) => (
          <li
            key={shot.src}
            className={framed ? "flex justify-center" : undefined}
          >
            <Dialog
              open={activeIndex === index}
              onOpenChange={(open) => setActiveIndex(open ? index : null)}
            >
              <DialogTrigger
                render={
                  framed ? (
                    <DeviceFrame className="w-full max-w-64 cursor-zoom-in">
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        width={1080}
                        height={1920}
                        className="h-auto w-full"
                      />
                    </DeviceFrame>
                  ) : (
                    <button
                      type="button"
                      className="block w-full cursor-zoom-in overflow-hidden rounded-md border border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        width={1600}
                        height={1000}
                        className="h-auto w-full"
                      />
                    </button>
                  )
                }
              >
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
                  width={framed ? 1080 : 1600}
                  height={framed ? 1920 : 1000}
                  className="h-auto max-h-[75vh] w-full object-contain"
                />
                <p className="text-xs text-muted-foreground">{shot.alt}</p>
              </DialogContent>
            </Dialog>
          </li>
        ))}
      </ul>
    </>
  );
}
