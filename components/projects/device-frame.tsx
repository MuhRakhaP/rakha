import { cn } from "cn";

/**
 * A pure CSS/Tailwind device frame. No mockup library, no generated UI — it
 * only frames a real screenshot.
 */
export function DeviceFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-foreground/15 bg-foreground/5 p-1.5 shadow-sm",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-background">
        {/* status-bar strip */}
        <div
          aria-hidden="true"
          className="flex h-6 items-center justify-between px-4 text-[0.6rem] font-medium text-muted-foreground"
        >
          <span>9:41</span>
          <span className="tracking-tight">•••</span>
        </div>
        {children}
        {/* home indicator */}
        <div
          aria-hidden="true"
          className="flex h-5 items-center justify-center"
        >
          <span className="h-1 w-16 rounded-full bg-foreground/25" />
        </div>
      </div>
    </div>
  );
}
