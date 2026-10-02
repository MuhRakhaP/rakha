import { cn } from "cn";

/**
 * Phone chrome for a recreation.
 *
 * One slim dark bezel, one outer radius, a punch-hole camera, and nothing else:
 * no notch bar, no second border, no inner frame. The screen fills the bezel
 * edge to edge, which is what modern devices look like and what keeps the
 * drawing from reading as a picture pasted into a case.
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
      {/* 8px bezel, single 2rem radius. */}
      <div
        className="relative overflow-hidden bg-neutral-900 p-2 shadow-[0_2px_8px_rgba(16,24,40,0.12)]"
        style={{ borderRadius: "2rem" }}
      >
        {/* Punch-hole camera, decorative only. */}
        <span
          aria-hidden="true"
          className="absolute top-2.5 left-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-neutral-700 ring-1 ring-neutral-600"
        />

        {/* The screen. Clipped to the bezel's inner radius, no extra frame. */}
        <div
          className="overflow-hidden"
          style={{ borderRadius: "calc(2rem - 8px)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}