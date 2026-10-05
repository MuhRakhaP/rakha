import { cn } from "cn";

/**
 * A string that types itself once, in CSS.
 *
 * No JavaScript and no timer: the clip is a width animation stepped once per
 * character, so the text is in the DOM from the first byte and a screen reader
 * reads the whole string rather than an empty box that fills in later.
 *
 * `steps` is derived from the string length, which is why `chars` exists as an
 * override: a step count that does not match the length either clips the tail
 * or reveals several characters per tick.
 *
 * Under reduced motion the animation is never applied, so the class here is
 * only a clipped inline-block with the full string inside it.
 */
export function TypingText({
  text,
  className,
  chars,
  delay = 150,
  duration = 1800,
}: {
  text: string;
  className?: string;
  /** Characters to step over. Defaults to the string length. */
  chars?: number;
  delay?: number;
  duration?: number;
}) {
  const steps = chars ?? text.length;

  return (
    <span
      className={cn("hero-role-type", className)}
      style={
        {
          "--steps": steps,
          "--type-duration": `${duration}ms`,
          "--type-delay": `${delay}ms`,
        } as React.CSSProperties
      }
    >
      {text}
    </span>
  );
}
