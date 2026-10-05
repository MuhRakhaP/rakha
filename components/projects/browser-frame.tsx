import { cn } from "cn";

/**
 * Pure CSS browser frame for a real screenshot.
 *
 * This frames an existing image. It never draws, generates, or reconstructs app
 * UI: the chrome below is decorative browser furniture, and the content is
 * always a real capture passed in as children.
 *
 * Decorative parts are aria-hidden so assistive technology announces only the
 * screenshot's own alt text. The frame itself is presentational.
 */
export function BrowserFrame({
  children,
  className,
  /** Rendered inside the chrome, aria-hidden. Never interactive. */
  url,
}: {
  children: React.ReactNode;
  className?: string;
  url?: string;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg border border-border bg-card shadow-[0_1px_2px_oklch(0_0_0/0.04)]",
        className,
      )}
    >
      {/* Browser chrome. Purely decorative: a frame, not a fake window. */}
      <div
        aria-hidden="true"
        className="flex items-center gap-2 border-b border-border bg-card px-3 py-2"
      >
        <span className="flex shrink-0 gap-1.5">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
        </span>
        {url ? (
          <span className="min-w-0 flex-1 truncate rounded bg-background px-2 py-0.5 font-mono text-[0.6875rem] text-muted-foreground">
            {url}
          </span>
        ) : (
          <span className="flex-1" />
        )}
      </div>

      {/* Real screenshot. Sizing is the caller's business via next/image.
          `max-w-full` keeps a 1440px capture inside a narrower frame: the img
          carries intrinsic dimensions, so without this the frame is widened by
          its content rather than the image being scaled to the frame. */}
      <div className="max-w-full overflow-hidden bg-background">{children}</div>
    </div>
  );
}
