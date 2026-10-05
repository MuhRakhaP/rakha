import { cn } from "cn";

/**
 * Phone chrome for a recreation.
 *
 * A slim warm-charcoal bezel, one outer radius, a punch-hole camera, and
 * nothing else: no notch bar, no second border, no inner rounded box. The
 * bezel is warm charcoal rather than black so it sits with the page instead of
 * cutting a hard hole in it.
 *
 * This frame never receives a real capture. `ProjectFrame` uses it for
 * screenshots on mobile projects, so nothing here may reconstruct app UI.
 */
export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* 7px bezel, single radius, warm charcoal. */}
      <div className="relative overflow-hidden aspect-[9/19.5] p-[7px] shadow-[0_2px_10px_rgba(63,55,50,0.16)]">
        <div className="h-full w-full" style={{ background: "#3A332E", borderRadius: "2.25rem" }}>
          {/* Punch-hole camera, decorative only. */}
          <span
            aria-hidden="true"
            className="absolute top-[13px] left-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#2A2521] ring-1 ring-[#4C443E]"
          />
          {children}
        </div>
      </div>
    </div>
  );
}