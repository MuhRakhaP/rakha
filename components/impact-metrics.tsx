import { CountUp } from "@/components/ui/count-up";
import { impactMetrics } from "@/data/impact";

/**
 * The hero's three figures, as one strip rather than three cards.
 *
 * A card each would be three boxes saying the same kind of thing, and the
 * numbers are one thought: the size of the work, and what it changed. A
 * bordered row with hairline dividers keeps them related and costs one
 * horizontal line instead of three.
 *
 * Read as a plain list so the order is the one a person reads: the figure, then
 * what it measures, then the evidence for it. A description list would put the
 * label first and make a screen reader announce the caption before the number.
 *
 * `CountUp` is here because the figures arrive before the sentences that
 * explain them, and drawing the eye to a figure as it lands is the point. It
 * exposes the final value to assistive tech and hides the animated digits, so
 * nothing is announced twice, and it renders the final value with no animation
 * under reduced motion.
 */
export function ImpactMetrics() {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-6 sm:grid-cols-3">
      {impactMetrics.map((metric) => (
        <li key={metric.label} className="flex flex-col gap-1">
          <span className="font-heading text-title font-semibold tracking-[-0.02em] text-foreground tabular-nums">
            <CountUp value={metric.value} suffix={metric.suffix} />
          </span>
          <span className="text-sm font-medium text-foreground">{metric.label}</span>
          <span className="text-xs leading-snug text-muted-foreground">
            {metric.proof}
          </span>
        </li>
      ))}
    </ul>
  );
}