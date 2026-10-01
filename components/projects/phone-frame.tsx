import { cn } from "cn";

/**
 * Pure CSS phone frame for a real screenshot.
 *
 * Frames an existing image only. It never draws or reconstructs app UI. The
 * notch and home indicator are aria-hidden decoration; the screenshot's own
 * alt text is what assistive technology announces.
 *
 * The frame preserves whatever aspect ratio the capture has: the caller
 * supplies width/height from the real file, and the image is sized inside a
 * portrait-safe shell rather than being cropped to a fixed ratio.
 */
export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-56 rounded-[1.75rem] border border-foreground/15 bg-foreground/5 p-1.5 shadow-[0_1px_3px_oklch(0_0_0/0.06)]",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-background">
        {/* Notch. Decorative only. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-10 flex h-5 items-center justify-center"
        >
          <span className="h-1 w-12 rounded-full bg-foreground/20" />
        </div>

        {/* The real capture. No cropping: h-auto keeps the source ratio. */}
        <div className="pt-4">{children}</div>

        {/* Home indicator. Decorative only. */}
        <div
          aria-hidden="true"
          className="flex h-4 items-center justify-center"
        >
          <span className="h-1 w-14 rounded-full bg-foreground/20" />
        </div>
      </div>
    </div>
  );
}
