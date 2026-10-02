import { Eye } from "lucide-react";
import { cn } from "cn";

import {
  NAV_HEIGHT,
  RADIUS,
  SPACE,
  TYPE,
  type ScreenTokens,
} from "./tokens";

/**
 * Shared building blocks for the labeled UI recreations.
 *
 * Every value a recreation renders comes from `tokens.ts` or from the dummy data
 * in `data/mock-screens.ts`. These components hold no state and run no effects,
 * so a recreation is a static picture that happens to be HTML.
 *
 * Two rules are enforced across the whole set, and the visual-check harness
 * measures them in the rendered DOM:
 *   - no computed font-size below 11px;
 *   - no text whose contrast against its own background falls under 4.5:1.
 */

/* -------------------------------------------------------------------------- */
/* Layout                                                                      */
/* -------------------------------------------------------------------------- */

export function Stack({
  gap = "sm",
  className,
  children,
}: {
  gap?: "xs" | "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col", SPACE[gap], className)}>{children}</div>
  );
}

/**
 * The scrollable body of a screen.
 *
 * `padBottom` reserves room for the bottom navigation plus a fade, so the last
 * row is never clipped behind the nav. Without it a real app shows the same
 * problem and it looks like a rendering fault rather than a design.
 */
export function ScrollBody({
  tokens,
  nav = false,
  className,
  children,
}: {
  tokens: ScreenTokens;
  /** True when a bottom nav sits below this area. */
  nav?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-y-auto px-3.5", className)}
      style={
        nav
          ? { paddingBottom: NAV_HEIGHT + 32, scrollPaddingBottom: NAV_HEIGHT }
          : undefined
      }
    >
      {/* Fade above the nav so content dissolves instead of being cut off. */}
      {nav ? (
        <div
          aria-hidden="true"
          className="pointer-events-none sticky bottom-0 -mt-10 h-10"
          style={{
            background: `linear-gradient(to top, ${tokens.background}, transparent)`,
          }}
        />
      ) : null}
      {children}
    </div>
  );
}

/** Page shell: background, large title row, and the body. */
export function Screen({
  tokens,
  title,
  subtitle,
  action,
  nav = false,
  children,
}: {
  tokens: ScreenTokens;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  nav?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex h-full min-h-0 flex-col"
      style={{ background: tokens.background, color: tokens.onSurface }}
    >
      {title ? (
        <header className="flex shrink-0 items-start justify-between gap-3 px-3.5 pt-5 pb-3">
          <div className="min-w-0">
            <h3 className={cn(TYPE.title, "font-semibold")}>{title}</h3>
            {subtitle ? (
              <p
                className={cn(TYPE.body, "mt-1")}
                style={{ color: tokens.onSurfaceVariant }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
          {action}
        </header>
      ) : null}
      <ScrollBody tokens={tokens} nav={nav} className="px-4">
        {children}
      </ScrollBody>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                    */
/* -------------------------------------------------------------------------- */

export function Card({
  tokens,
  tone = "surface",
  className,
  children,
}: {
  tokens: ScreenTokens;
  tone?: "surface" | "high";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        RADIUS.card,
        "border p-4",
        tone === "high" ? "shadow-none" : "shadow-[0_1px_2px_rgba(16,24,40,0.05)]",
        className,
      )}
      style={{
        background: tone === "high" ? tokens.surfaceHigh : tokens.surface,
        borderColor: tokens.outline,
      }}
    >
      {children}
    </div>
  );
}

/** A card with a heading row. */
export function SectionCard({
  tokens,
  title,
  trailing,
  className,
  children,
}: {
  tokens: ScreenTokens;
  title: string;
  trailing?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card tokens={tokens} className={className}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className={cn(TYPE.section, "font-semibold")}>{title}</h4>
        {trailing}
      </div>
      {children}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Type                                                                        */
/* -------------------------------------------------------------------------- */

/** Secondary text. Never all-caps, never below the 12px floor. */
export function Body({ tokens, children }: { tokens: ScreenTokens; children: React.ReactNode }) {
  return (
    <p className={TYPE.body} style={{ color: tokens.onSurfaceVariant }}>
      {children}
    </p>
  );
}

/** Small caption inside a card. */
export function Caption({
  tokens,
  children,
}: {
  tokens: ScreenTokens;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(TYPE.label, "truncate")}
      style={{ color: tokens.onSurfaceVariant }}
    >
      {children}
    </p>
  );
}

/** Filled-tonal chip. Tones are container + on-container pairs. */
export function Chip({
  tokens,
  children,
  tone = "neutral",
}: {
  tokens: ScreenTokens;
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "error";
}) {
  const map = {
    neutral: [tokens.neutral, tokens.onNeutral],
    primary: [tokens.primaryContainer, tokens.onPrimaryContainer],
    success: [tokens.success, tokens.onSuccess],
    warning: [tokens.warning, tokens.onWarning],
    error: [tokens.error, tokens.onError],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <span
      className={cn(
        RADIUS.chip,
        "inline-flex items-center gap-1 px-2.5 py-1 font-medium whitespace-nowrap",
        TYPE.chip,
      )}
      style={{ background: bg, color: fg }}
    >
      {children}
    </span>
  );
}

/** Selectable filter chip: All-caps is allowed here, they are short. */
export function FilterChip({
  tokens,
  children,
  selected = false,
}: {
  tokens: ScreenTokens;
  children: React.ReactNode;
  selected?: boolean;
}) {
  return (
    <span
      className={cn(RADIUS.chip, "px-3 py-1.5 font-medium whitespace-nowrap", TYPE.label)}
      style={
        selected
          ? { background: tokens.primary, color: tokens.onPrimary }
          : { background: tokens.neutral, color: tokens.onNeutral }
      }
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Metrics, avatars, actions                                                   */
/* -------------------------------------------------------------------------- */

/**
 * A metric tile. The label is one line only and the number is tabular, so a
 * tile never reflows when the value changes width.
 */
export function MetricTile({
  tokens,
  label,
  value,
  hint,
  flex,
}: {
  tokens: ScreenTokens;
  label: string;
  value: string;
  hint?: string;
  flex?: string;
}) {
  return (
    <Card tokens={tokens} className={cn("p-3", flex)}>
      <p
        className={cn(TYPE.label, "truncate")}
        style={{ color: tokens.onSurfaceVariant }}
      >
        {label}
      </p>
      <p className={cn(TYPE.metricSm, "mt-1.5 truncate")}>{value}</p>
      {hint ? (
        <p className={cn(TYPE.label, "mt-1 truncate")} style={{ color: tokens.onSuccess }}>
          {hint}
        </p>
      ) : null}
    </Card>
  );
}

/**
 * Text field look-alike: a label, then a bordered box with a leading glyph and
 * an optional trailing affordance, exactly as the real login screens compose
 * them. 52px tall, so the touch target clears 44px.
 */
export function Field({
  tokens,
  label,
  value,
  placeholder,
  icon,
  trailing,
}: {
  tokens: ScreenTokens;
  /** Optional: the cashier search field is placeholder-only, as in the app. */
  label?: string;
  value?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  /** `show` draws the password visibility toggle the app has. */
  trailing?: "show";
}) {
  return (
    <label className="flex flex-col gap-1.5">
      {label ? (
        <span className={TYPE.label} style={{ color: tokens.onSurfaceVariant }}>
          {label}
        </span>
      ) : null}
      <span
        className="flex min-h-13 items-center gap-2 border px-2.5 py-2"
        style={{
          background: tokens.surface,
          borderColor: tokens.outline,
          borderRadius: 12,
        }}
      >
        {icon ? (
          <span aria-hidden="true" className="shrink-0" style={{ color: tokens.onSurfaceVariant }}>
            {icon}
          </span>
        ) : null}
        <span
          className={cn(TYPE.body, "min-w-0 flex-1 truncate")}
          style={{ color: value ? tokens.onSurface : tokens.onSurfaceVariant }}
        >
          {value ?? placeholder}
        </span>
        {trailing === "show" ? (
          <Eye aria-hidden="true" className="h-5 w-5 shrink-0" style={{ color: tokens.onSurfaceVariant }} />
        ) : null}
      </span>
    </label>
  );
}

/** Circular avatar showing a person's initials. */
export function Avatar({
  tokens,
  name,
  size = 40,
}: {
  tokens: ScreenTokens;
  name: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        background: tokens.primaryContainer,
        color: tokens.onPrimaryContainer,
      }}
    >
      <span className={TYPE.label}>{initials}</span>
    </span>
  );
}

/**
 * Primary action button. 48px tall, comfortably past the 44px touch minimum the
 * harness enforces.
 */
export function PrimaryButton({
  tokens,
  children,
  icon,
  full = true,
}: {
  tokens: ScreenTokens;
  children: React.ReactNode;
  icon?: React.ReactNode;
  full?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 font-semibold",
        full && "w-full",
      )}
      style={{ background: tokens.primary, color: tokens.onPrimary, borderRadius: 14 }}
    >
      {icon}
      <span className={TYPE.body}>{children}</span>
    </span>
  );
}

/** Secondary / tonal button. */
export function TonalButton({
  tokens,
  children,
  icon,
}: {
  tokens: ScreenTokens;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 px-4 py-3 font-semibold",
        TYPE.body,
      )}
      style={{ background: tokens.neutral, color: tokens.onNeutral, borderRadius: 14 }}
    >
      {icon}
      {children}
    </span>
  );
}

/** Progress track. `value` is 0..1. */
export function ProgressBar({
  tokens,
  value,
  height = 8,
}: {
  tokens: ScreenTokens;
  value: number;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <span
      aria-hidden="true"
      className="block w-full overflow-hidden"
      style={{ height, background: tokens.neutral, borderRadius: height }}
    >
      <span
        className="block h-full"
        style={{
          width: `${pct * 100}%`,
          background: tokens.primary,
          borderRadius: height,
        }}
      />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Charts                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Sparkline. A small trend read at a glance, drawn as an inline SVG so nothing
 * animates and no chart library is pulled in for a static picture.
 */
export function Sparkline({
  tokens,
  points,
  height = 44,
}: {
  tokens: ScreenTokens;
  points: readonly number[];
  height?: number;
}) {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const span = max - min || 1;
  const step = 100 / Math.max(points.length - 1, 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = 30 - ((p - min) / span) * 26;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      style={{ height, width: "100%", color: tokens.primary }}
      aria-hidden="true"
    >
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Bar chart with a labelled axis. Values print beside each bar rather than
 * inside it, which is what keeps every label on one line.
 */
export function BarChart({
  tokens,
  items,
  suffix = "",
  max: ceiling,
}: {
  tokens: ScreenTokens;
  items: readonly { label: string; value: number }[];
  suffix?: string;
  max?: number;
}) {
  const top = ceiling ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3">
          <span
            className={cn(TYPE.label, "w-16 shrink-0 truncate")}
            style={{ color: tokens.onSurfaceVariant }}
          >
            {item.label}
          </span>
          <span
            className="h-2.5 min-w-0 flex-1 overflow-hidden"
            style={{ background: tokens.neutral, borderRadius: 999 }}
          >
            <span
              className="block h-full"
              style={{
                width: `${Math.max(3, (item.value / top) * 100)}%`,
                background: tokens.primary,
                borderRadius: 999,
              }}
            />
          </span>
          <span
            className={cn(TYPE.label, "w-14 shrink-0 text-right tabular-nums")}
            style={{ color: tokens.onSurface }}
          >
            {item.value}
            {suffix}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* Bottom navigation                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Bottom navigation with a pill behind the active destination.
 *
 * Rows are 64px tall, past the 44px touch minimum. The labels are the app's own
 * navigation names, taken from its source.
 */
export function BottomNav({
  tokens,
  items,
  active,
}: {
  tokens: ScreenTokens;
  items: readonly string[];
  active: string;
}) {
  return (
    <nav
      aria-label="Primary"
      className="shrink-0 overflow-x-auto border-t px-2 pb-2"
      style={{ borderColor: tokens.outline, background: tokens.surface }}
    >
      <ul className="flex min-w-max items-stretch justify-between">
        {items.map((item) => {
          const on = item === active;
          return (
            <li key={item} className="flex-1">
              <span
                className="flex min-h-14 flex-col items-center justify-center gap-1 px-1"
                style={{
                  background: on ? tokens.primaryContainer : "transparent",
                  color: on ? tokens.onPrimaryContainer : tokens.onNeutral,
                  borderRadius: 999,
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ background: on ? tokens.primary : tokens.outline }}
                />
                <span className={cn(TYPE.chip, "truncate")}>{item}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Static placeholders for hardware                                            */
/* -------------------------------------------------------------------------- */

/**
 * Placeholder for something a recreation cannot show, such as a camera feed or
 * a thermal printer. Drawn as a neutral block and labelled, never imitated, so
 * it cannot read as working hardware.
 */
export function StaticDevicePanel({
  tokens,
  icon,
  title,
  detail,
}: {
  tokens: ScreenTokens;
  icon?: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col items-center justify-center gap-2 rounded-[18px] border border-dashed px-4 py-6 text-center"
      style={{ borderColor: tokens.outline, background: tokens.surfaceHigh }}
    >
      {icon}
      <p className={cn(TYPE.body, "font-semibold")}>{title}</p>
      <p className={cn(TYPE.label)} style={{ color: tokens.onSurfaceVariant }}>
        {detail}
      </p>
    </div>
  );
}

/** Device shell used by every phone recreation, so they all share a ratio. */
export function PhoneCanvas({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full min-h-0 flex-col overflow-hidden">{children}</div>;
}