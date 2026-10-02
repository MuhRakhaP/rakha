/**
 * Small building blocks shared by the labeled UI recreations.
 *
 * These are presentational only: no state, no effects, no data fetching. They
 * exist so each recreated screen reads as a layout of regions - tile, panel,
 * row, bar - rather than as one hand-tuned blob of markup.
 *
 * Every value a component renders comes from `data/mock-screens.ts`, so the
 * numbers stay in one place and are obviously invented.
 */

/** Vertical stack with a consistent gap. */
export function Stack({
  gap = "sm",
  className = "",
  children,
}: {
  gap?: "xs" | "sm" | "md";
  className?: string;
  children: React.ReactNode;
}) {
  const gapClass = {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-3",
  }[gap];
  return <div className={`flex flex-col ${gapClass} ${className}`}>{children}</div>;
}

/** Uppercase micro-label, matching the section headers in both apps. */
export function MicroLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.5rem] leading-tight font-semibold tracking-[0.08em] text-muted-foreground uppercase">
      {children}
    </span>
  );
}

/** A white rounded panel: the base container inside every recreated screen. */
export function Panel({
  title,
  subtitle,
  action,
  className = "",
  bodyClassName = "",
  children,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={`rounded-lg border border-border bg-card p-2.5 ${className}`}>
      {(title || action) && (
        <header className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            {title && (
              <h4 className="truncate text-[0.6875rem] leading-tight font-semibold">
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="mt-0.5 truncate text-[0.5rem] text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </header>
      )}
      {children ? <div className={bodyClassName}>{children}</div> : null}
    </section>
  );
}

/** A KPI / stat tile: small label over a value, with an optional tint. */
export function StatTile({
  label,
  value,
  sub,
  tint,
}: {
  label: string;
  value: string;
  sub?: string;
  /** Any CSS background utility, applied to a small badge. */
  tint?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-2">
      {tint && <span className={`mb-1.5 block h-1 w-6 rounded-full ${tint}`} />}
      <MicroLabel>{label}</MicroLabel>
      <p className="mt-1 text-[0.8125rem] leading-none font-semibold tabular-nums">
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-[0.5rem] text-muted-foreground tabular-nums">{sub}</p>
      )}
    </div>
  );
}

/** Small pill used for statuses and filters. */
export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad" | "brand";
}) {
const toneClass = {
    neutral: "bg-muted text-muted-foreground",
    good: "bg-emerald-500/12 text-emerald-800",
    warn: "bg-amber-500/15 text-amber-800",
    bad: "bg-rose-500/12 text-rose-800",
    brand: "bg-brand-weak text-brand",
  }[tone];
  return (
    <span
      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[0.5rem] font-semibold whitespace-nowrap ${toneClass}`}
    >
      {children}
    </span>
  );
}

/** Fixed-width grid of columns, used for every numeric table in a recreation. */
export function DataRows({
  head,
  rows,
}: {
  head: readonly string[];
  rows: readonly (readonly React.ReactNode[])[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="grid gap-2 border-b border-border pb-1"
        style={{ gridTemplateColumns: head.map(() => "1fr").join(" ") }}
      >
        {head.map((cell) => (
          <MicroLabel key={cell}>{cell}</MicroLabel>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid gap-2"
          style={{ gridTemplateColumns: head.map(() => "1fr").join(" ") }}
        >
          {row.map((cell, j) => (
            <span
              key={j}
              className="truncate text-[0.5625rem] leading-tight tabular-nums"
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Horizontal bar chart drawn with plain divs.
 *
 * Pure CSS rather than a charting library: these are static pictures inside a
 * recreation, they never animate, and `motion-reduce` neutralises the
 * transition so the page honours `prefers-reduced-motion`.
 */
export function BarRow({
  items,
  suffix = "",
  max,
}: {
  items: readonly { label: string; value: number }[];
  suffix?: string;
  max?: number;
}) {
  const ceiling = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span className="w-5 shrink-0 text-[0.5rem] text-muted-foreground">
            {item.label}
          </span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-brand transition-[width] motion-reduce:transition-none"
              style={{ width: `${Math.max(2, (item.value / ceiling) * 100)}%` }}
            />
          </span>
          <span className="w-8 shrink-0 text-right text-[0.5rem] tabular-nums text-muted-foreground">
            {item.value}
            {suffix}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Sparkline-style trend line built from an inline SVG polyline.
 *
 * Hand-drawn on purpose: a recreated chart only has to convey "there is a
 * trend here", and an SVG keeps the component dependency-free and static.
 */
export function TrendLine({
  points,
  className = "text-brand",
}: {
  points: readonly number[];
  className?: string;
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
      className={`h-10 w-full ${className}`}
      aria-hidden="true"
    >
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Text field look-alike: a label and a bordered box with placeholder text. */
export function Field({
  label,
  value,
  placeholder,
  prefix,
}: {
  label?: string;
  value?: string;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      {label && <MicroLabel>{label}</MicroLabel>}
      <span className="flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1.5">
        {prefix && (
          <span className="shrink-0 text-[0.5625rem] text-muted-foreground">
            {prefix}
          </span>
        )}
        <span className="truncate text-[0.625rem]">
          {value ? (
            <span className="text-foreground">{value}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
      </span>
    </label>
  );
}

/** Primary button look-alike. */
export function Button({
  children,
  tone = "brand",
  full = true,
}: {
  children: React.ReactNode;
  tone?: "brand" | "good" | "bad" | "quiet";
  full?: boolean;
}) {
  const toneClass = {
    brand: "bg-brand text-background",
    good: "bg-emerald-700 text-white",
    bad: "bg-rose-700 text-white",
    quiet: "border border-border bg-background text-foreground",
  }[tone];
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-[0.5625rem] leading-tight font-semibold tracking-[0.06em] uppercase ${toneClass} ${full ? "w-full" : ""}`}
    >
      {children}
    </span>
  );
}

/**
 * Placeholder for hardware a recreation cannot show: a thermal printer or a
 * camera feed. Drawn as a neutral block and labelled, never imitated, so it
 * cannot be read as working hardware.
 */
export function StaticDevicePanel({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-muted/60 px-3 py-4 text-center"
    >
      <span className="h-8 w-5 rounded-sm border border-border bg-card" />
      <p className="text-[0.5625rem] leading-tight font-semibold">{title}</p>
      <p className="max-w-[22ch] text-[0.5rem] leading-tight text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

/** App bar: a coloured strip with a title and a trailing affordance. */
export function AppBar({
  title,
  tint = "bg-card",
  trailing,
}: {
  title: string;
  tint?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 border-b border-border px-2.5 py-2 ${tint}`}
    >
      <span className="truncate text-[0.6875rem] font-semibold">{title}</span>
      {trailing ?? <span className="h-3.5 w-3.5 rounded-full bg-muted" />}
    </div>
  );
}

/** Bottom navigation strip, mirroring the real tab order of each app. */
export function TabBar({
  items,
  active,
}: {
  items: readonly string[];
  active: string;
}) {
  return (
    <div className="flex items-stretch justify-between border-t border-border bg-card px-1 py-1.5">
      {items.map((item) => (
        <span
          key={item}
          className={`flex flex-1 flex-col items-center gap-1 rounded px-0.5 py-0.5 text-center ${
            item === active ? "text-brand" : "text-muted-foreground"
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-[3px] ${
              item === active ? "bg-brand" : "bg-muted"
            }`}
          />
          <span className="text-[0.4375rem] leading-none font-medium">{item}</span>
        </span>
      ))}
    </div>
  );
}

/** Every recreation renders inside one of these, at a phone's aspect ratio. */
export function PhoneScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex aspect-[9/19] w-full flex-col overflow-hidden rounded-[0.75rem] border border-border bg-background text-left">
      {children}
    </div>
  );
}

/** Wide variant for browser-framed recreations. */
export function BrowserScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex aspect-[16/10] w-full flex-col overflow-hidden rounded-md border border-border bg-background text-left">
      {children}
    </div>
  );
}