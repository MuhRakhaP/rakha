import { Eye } from "lucide-react";
import { cn } from "cn";

import { NAV_HEIGHT, RADIUS, SPACE, TYPE, type ScreenTokens } from "./tokens";

/**
 * Shared building blocks for the labeled UI recreations.
 *
 * Two rules hold across the whole set, and the harness measures both in the
 * rendered DOM:
 *   - nothing scrolls. No `overflow: auto` or `overflow: scroll` appears inside
 *     a recreation, because a screen that scrolls inside a picture reads as a
 *     broken embed. Screens are composed to fit their height instead, which is
 *     why most of them carry less content than the real app.
 *   - nothing truncates. No `text-overflow: ellipsis` anywhere. A label that
 *     would not fit gets shortened at the source, not clipped at the edge.
 */

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

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
 * A screen: background, a large title, and the body.
 *
 * No scroll container anywhere. The body is a plain flex child that shrinks to
 * the space left after the header and the navigation, so its content is laid
 * out against a known height from the first paint.
 */
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
        <header className="flex shrink-0 items-start justify-between gap-3 px-5 pt-5 pb-4">
          <div>
            {subtitle ? (
              <p
                className={cn(TYPE.label, "mb-1")}
                style={{ color: tokens.onSurfaceVariant }}
              >
                {subtitle}
              </p>
            ) : null}
            <h3 className={TYPE.title}>{title}</h3>
          </div>
          {action}
        </header>
      ) : null}
      <div
        className={cn("flex min-h-0 flex-1 flex-col gap-4 px-5", !nav && "pb-5")}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export function Card({
  tokens,
  tone = "surface",
  className,
  children,
}: {
  tokens: ScreenTokens;
  tone?: "surface" | "high" | "primary";
  className?: string;
  children: React.ReactNode;
}) {
  const bg =
    tone === "high" ? tokens.surfaceHigh : tone === "primary" ? tokens.primaryContainer : tokens.surface;
  return (
    <div
      className={cn(
        RADIUS.card,
        "border p-4",
        tone === "surface" ? "shadow-[0_1px_2px_rgba(16,24,40,0.04)]" : "shadow-none",
        className,
      )}
      style={{ background: bg, borderColor: tokens.outline }}
    >
      {children}
    </div>
  );
}

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
        <h4 className={TYPE.section}>{title}</h4>
        {trailing}
      </div>
      {children}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Type                                                                */
/* ------------------------------------------------------------------ */

export function Caption({
  tokens,
  children,
}: {
  tokens: ScreenTokens;
  children: React.ReactNode;
}) {
  return (
    <p className={TYPE.label} style={{ color: tokens.onSurfaceVariant }}>
      {children}
    </p>
  );
}

/** Filled-tonal status chip. */
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
        "inline-flex items-center gap-1.5 px-2.5 py-1 font-medium whitespace-nowrap",
        TYPE.chip,
      )}
      style={{ background: bg, color: fg }}
    >
      {children}
    </span>
  );
}

/** Selectable filter chip: all-caps is allowed, these are short. */
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

/* ------------------------------------------------------------------ */
/* Metrics, avatars, actions                                           */
/* ------------------------------------------------------------------ */

/**
 * A metric tile. One line for the label, tabular figures, no clamping: the
 * caller shortens a value rather than letting it spill.
 */
export function MetricTile({
  tokens,
  label,
  value,
  flex,
}: {
  tokens: ScreenTokens;
  label: string;
  value: string;
  flex?: string;
}) {
  return (
    <Card tokens={tokens} className={cn("p-3", flex)}>
      <p className={TYPE.label} style={{ color: tokens.onSurfaceVariant }}>
        {label}
      </p>
      <p className={cn(TYPE.metricSm, "mt-1.5")}>{value}</p>
    </Card>
  );
}

/** Circular avatar showing initials. */
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

/** Primary action. 48px tall, past the 44px touch minimum. */
export function PrimaryButton({
  tokens,
  children,
  icon,
  full = true,
  large = false,
}: {
  tokens: ScreenTokens;
  children: React.ReactNode;
  icon?: React.ReactNode;
  full?: boolean;
  large?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold",
        large ? "min-h-14 px-6 text-base" : "min-h-12 px-5 text-sm",
        full && "w-full",
      )}
      style={{ background: tokens.primary, color: tokens.onPrimary, borderRadius: 14 }}
    >
      {icon}
      {children}
    </span>
  );
}

/** Secondary tonal action, same height as the primary. */
export function TonalButton({
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
        "inline-flex min-h-12 items-center justify-center gap-2 px-5 text-sm font-semibold",
        full && "w-full",
      )}
      style={{ background: tokens.neutral, color: tokens.onNeutral, borderRadius: 14 }}
    >
      {icon}
      {children}
    </span>
  );
}

/** Progress track, `value` in 0..1. */
export function ProgressBar({
  tokens,
  value,
}: {
  tokens: ScreenTokens;
  value: number;
}) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <span
      aria-hidden="true"
      className="block h-2 w-full overflow-hidden"
      style={{ background: tokens.neutral, borderRadius: 999 }}
    >
      <span
        className="block h-full"
        style={{ width: `${pct * 100}%`, background: tokens.primary, borderRadius: 999 }}
      />
    </span>
  );
}

/**
 * Progress ring, drawn as SVG so it is a real chart rather than two nested
 * divs. Used where the day's progress is the headline.
 */
export function ProgressRing({
  tokens,
  value,
  size = 116,
  children,
}: {
  tokens: ScreenTokens;
  value: number;
  size?: number;
  children?: React.ReactNode;
}) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  return (
    <span className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tokens.neutral}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tokens.primary}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Charts, as real SVG                                                 */
/* ------------------------------------------------------------------ */

/**
 * Vertical column chart with a labelled axis.
 *
 * Real SVG rather than styled divs, and drawn in logical pixels: the viewBox
 * matches the size the chart actually occupies, so a font size of 11 means 11px
 * instead of 11 squeezed into a 100-unit box. The harness measures text inside
 * a recreation, so a chart that quietly used 5px type would fail it.
 */
export function ColumnChart({
  tokens,
  items,
  suffix = "",
  width = 312,
  height = 140,
}: {
  tokens: ScreenTokens;
  items: readonly { label: string; value: number }[];
  suffix?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  const slot = width / items.length;
  const bar = Math.min(22, slot * 0.52);
  const plotBottom = height - 34;
  const plotTop = 10;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="w-full"
      role="img"
      aria-hidden="true"
    >
      {items.map((item, i) => {
        const h = ((item.value / max) * (plotBottom - plotTop));
        const cx = i * slot + slot / 2;
        return (
          <g key={item.label}>
            <text
              x={cx}
              y={plotBottom + 14}
              textAnchor="middle"
              fontSize="11"
              fill={tokens.onSurfaceVariant}
            >
              {item.label}
            </text>
            <text
              x={cx}
              y={plotBottom + 30}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill={tokens.onSurface}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {item.value}
              {suffix}
            </text>
            <rect
              x={cx - bar / 2}
              y={plotBottom - h}
              width={bar}
              height={h}
              rx={4}
              fill={tokens.primary}
            />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Horizontal bars, also SVG, for series whose labels are words. The label sits
 * above its own bar so a long department name has the full width available.
 */
export function BarRows({
  tokens,
  items,
  suffix = "",
  width = 312,
}: {
  tokens: ScreenTokens;
  items: readonly { label: string; value: number }[];
  suffix?: string;
  width?: number;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  const rowH = 34;
  return (
    <svg
      viewBox={`0 0 ${width} ${items.length * rowH}`}
      width={width}
      height={items.length * rowH}
      className="w-full"
      role="img"
      aria-hidden="true"
    >
      {items.map((item, i) => {
        const top = i * rowH;
        return (
          <g key={item.label}>
            <text
              x={0}
              y={top + 11}
              fontSize="11"
              fill={tokens.onSurfaceVariant}
            >
              {item.label}
            </text>
            <text
              x={width}
              y={top + 11}
              fontSize="11"
              fontWeight="600"
              textAnchor="end"
              fill={tokens.onSurface}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {item.value}
              {suffix}
            </text>
            <rect
              x={0}
              y={top + 17}
              width={width}
              height={8}
              rx={4}
              fill={tokens.neutral}
            />
            <rect
              x={0}
              y={top + 17}
              width={Math.max(4, (item.value / max) * width)}
              height={8}
              rx={4}
              fill={tokens.primary}
            />
          </g>
        );
      })}
    </svg>
  );
}

/** Sparkline for a hero metric. */
export function Sparkline({
  tokens,
  points,
  height = 40,
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
    const y = 30 - ((p - min) / span) * 26 - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  return (
    <svg
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      className="w-full"
      style={{ height, color: tokens.primary }}
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

/* ------------------------------------------------------------------ */
/* Bottom navigation                                                   */
/* ------------------------------------------------------------------ */

/**
 * Bottom navigation: 3 to 5 destinations, labels always visible, a pill
 * indicator behind the active one, equal widths so nothing shifts.
 *
 * The Material 3 Expressive guidance is to keep this bar short and give the
 * space to content, which is why the row is 64px rather than the older 80px.
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
      className="flex shrink-0 items-center border-t px-3"
      style={{
        height: NAV_HEIGHT,
        borderColor: tokens.outline,
        background: tokens.surface,
      }}
    >
      {items.map((item) => {
        const on = item === active;
        return (
          <span
            key={item}
            className="flex flex-1 items-center justify-center"
          >
            <span
              className={cn(
                "flex w-full items-center justify-center gap-1.5 px-1 py-2",
                RADIUS.chip,
              )}
              style={{
                background: on ? tokens.primaryContainer : "transparent",
                color: on ? tokens.onPrimaryContainer : tokens.onNeutral,
              }}
            >
              {/* Filled glyph when active, outlined when not: the Material 3
                  navigation-bar rule, and it needs no icon assets to hold. */}
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  background: on ? tokens.primary : "transparent",
                  border: on ? "none" : `1.5px solid ${tokens.onNeutral}`,
                }}
              />
              <span className={cn(TYPE.chip, "normal-case tracking-normal")}>
                {item}
              </span>
            </span>
          </span>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Form field                                                          */
/* ------------------------------------------------------------------ */

/**
 * Text field. 52px tall, so the touch target clears 44px. The label sits above
 * the box, matching how the real login screens compose them.
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
  label?: string;
  value?: string;
  placeholder?: string;
  icon?: React.ReactNode;
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
        className="flex min-h-13 items-center gap-2.5 border px-3"
        style={{
          background: tokens.surface,
          borderColor: tokens.outline,
          borderRadius: 12,
        }}
      >
        {icon ? (
          <span
            aria-hidden="true"
            className="shrink-0"
            style={{ color: tokens.onSurfaceVariant }}
          >
            {icon}
          </span>
        ) : null}
        <span
          className={cn(TYPE.body, "min-w-0 flex-1")}
          style={{
            color: value ? tokens.onSurface : tokens.onSurfaceVariant,
          }}
        >
          {value ?? placeholder}
        </span>
        {trailing === "show" ? (
          <Eye
            aria-hidden="true"
            className="h-5 w-5 shrink-0"
            style={{ color: tokens.onSurfaceVariant }}
          />
        ) : null}
      </span>
    </label>
  );
}