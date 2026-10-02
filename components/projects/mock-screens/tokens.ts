/**
 * Material 3 style tokens for the labeled UI recreations.
 *
 * Material 3 rules the parts that matter here: one shape scale, hairline
 * outlines instead of heavy shadows, an 8px spacing grid, tonal containers for
 * status rather than saturated fills, and type that never drops below a
 * readable floor.
 *
 * Each app keeps the primary colour its own source code uses, so a recreation
 * still reads as that product:
 *   - THINKPOS  `AppColors.primary` in lib/theme/app_theme.dart -> #2563EB
 *   - CLOCKORA  the inlined `Color(0xFF4A148C)` in lib/main.dart
 *   - TERAHOME  falls back to the site's brand token
 *
 * Colours are stored as literal Tailwind classes rather than arbitrary values
 * so the build can see them statically, and every on-container colour is chosen
 * to clear 4.5:1 against its own container.
 */

export interface ScreenTokens {
  /** Primary, used for the main action and the active nav indicator. */
  primary: string;
  onPrimary: string;
  /** Tonal container behind primary-coloured text. */
  primaryContainer: string;
  onPrimaryContainer: string;
  /** Page and card surfaces. */
  background: string;
  surface: string;
  surfaceHigh: string;
  /** Text. */
  onSurface: string;
  onSurfaceVariant: string;
  /** Hairline border colour. */
  outline: string;
  /** Filled-tonal status chips. */
  success: string;
  onSuccess: string;
  warning: string;
  onWarning: string;
  error: string;
  onError: string;
  neutral: string;
  onNeutral: string;
}

const THINKPOS: ScreenTokens = {
  primary: "#2563EB",
  onPrimary: "#FFFFFF",
  primaryContainer: "#E0EBFF",
  onPrimaryContainer: "#0B3EA8",
  background: "#F7F8FA",
  surface: "#FFFFFF",
  surfaceHigh: "#EFF2F7",
  onSurface: "#111827",
  onSurfaceVariant: "#4B5563",
  outline: "#DDE3EC",
  success: "#DCFCE7",
  onSuccess: "#14532D",
  warning: "#FEF3C7",
  onWarning: "#78350F",
  error: "#FEE2E2",
  onError: "#7F1D1D",
  neutral: "#EEF1F5",
  onNeutral: "#4B5563",
};

const CLOCKORA: ScreenTokens = {
  primary: "#4A148C",
  onPrimary: "#FFFFFF",
  primaryContainer: "#EADDFF",
  onPrimaryContainer: "#31005C",
  background: "#F8F9FE",
  surface: "#FFFFFF",
  surfaceHigh: "#F1EFF7",
  onSurface: "#1A1A1A",
  onSurfaceVariant: "#4A4553",
  outline: "#E2DFEA",
  success: "#DCFCE7",
  onSuccess: "#14532D",
  warning: "#FEF3C7",
  onWarning: "#78350F",
  error: "#FEE2E2",
  onError: "#7F1D1D",
  neutral: "#F1EFF7",
  onNeutral: "#4A4553",
};

const TERAHOME: ScreenTokens = {
  primary: "#A14216",
  onPrimary: "#FFFFFF",
  primaryContainer: "#F6E9E1",
  onPrimaryContainer: "#6B2A0C",
  background: "#FBFAF8",
  surface: "#FFFFFF",
  surfaceHigh: "#F1EFEA",
  onSurface: "#0F172A",
  onSurfaceVariant: "#4A4540",
  outline: "#E3DED5",
  success: "#DCFCE7",
  onSuccess: "#14532D",
  warning: "#FEF3C7",
  onWarning: "#78350F",
  error: "#FEE2E2",
  onError: "#7F1D1D",
  neutral: "#F1EFEA",
  onNeutral: "#4A4540",
};

/** Tokens by project slug, resolved through the registry rather than by name. */
const BY_SLUG: Record<string, ScreenTokens> = {
  thinkpos: THINKPOS,
  clockora: CLOCKORA,
  terahome: TERAHOME,
};

export function tokensFor(slug: string): ScreenTokens {
  return BY_SLUG[slug] ?? TERAHOME;
}

/** One shared phone aspect for every recreation: roughly 9:19.5. */
export const PHONE_ASPECT = { aspectRatio: "9 / 19.5" } as const;

/**
 * Type scale. The floor is 11px and the harness enforces it, which is why
 * every screen below carries far less content than the real app: a recreation
 * has to stay legible at phone size rather than mimic the app's density.
 */
export const TYPE = {
  /** Large top title. */
  title: "text-[1.375rem] leading-tight", // 22px
  section: "text-base leading-tight font-semibold", // 16px
  body: "text-sm", // 14px
  label: "text-xs", // 12px
  /** Short all-caps chips only. Never for sentences or list labels. */
  chip: "text-[0.6875rem] uppercase tracking-wide", // 11px
  metric: "text-xl leading-none font-semibold tabular-nums",
  metricSm: "text-lg leading-none font-semibold tabular-nums",
} as const;

/** 8px spacing grid. */
export const SPACE = {
  xs: "gap-1", // 4px  (half step, for icon-to-label pairs)
  sm: "gap-2", // 8px
  md: "gap-4", // 16px
  lg: "gap-6", // 24px
} as const;

/** Shape scale: one card radius, per the Material 3 brief. */
export const RADIUS = {
  card: "rounded-[18px]",
  control: "rounded-xl",
  chip: "rounded-full",
} as const;

/** Height of the bottom navigation, so scroll areas can clear it. */
export const NAV_HEIGHT = 64;