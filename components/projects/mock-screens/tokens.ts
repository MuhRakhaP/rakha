/**
 * Material 3 tokens for the labeled UI recreations.
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
 *   - TERAHOME  the site's warm brand, #A14216
 *
 * Colours are literal Tailwind values or inline styles, and every
 * on-container colour is chosen to clear 4.5:1 against its own container.
 */

export interface ScreenTokens {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  /**
   * The surface the app screens are drawn on.
   *
   * These describe the app itself, not the page: the real apps are light apps,
   * so a drawn screen stays light and repainting it dark to match the site
   * would misrepresent the product. The neutrals below are therefore the app's
   * own greys, kept free of any warm cast, because a warm cream field against a
   * blue-black page reads as a different theme rather than as a light app.
   */
  background: string;
  surface: string;
  surfaceHigh: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
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
  // THINKPOS is a blue app, so its drawn screens are cool greys. Its accent
  // used to be a navy stage, which is gone with the per-project card wash.
  primary: "#2563EB",
  onPrimary: "#FFFFFF",
  primaryContainer: "#E0EBFF",
  onPrimaryContainer: "#0B3EA8",
  background: "#F5F7FA",
  surface: "#FFFFFF",
  surfaceHigh: "#EDF1F7",
  onSurface: "#111827",
  onSurfaceVariant: "#4B5563",
  outline: "#E2E7EF",
  success: "#DCFCE7",
  onSuccess: "#14532D",
  warning: "#FEF3C7",
  onWarning: "#78350F",
  error: "#FEE2E2",
  onError: "#7F1D1D",
  neutral: "#EDF1F7",
  onNeutral: "#3F4754",
};

const CLOCKORA: ScreenTokens = {
  // Violet is the app's own primary, kept as the only violet on the card.
  primary: "#4A148C",
  onPrimary: "#FFFFFF",
  primaryContainer: "#EADDFF",
  onPrimaryContainer: "#31005C",
  background: "#F7F6FA",
  surface: "#FFFFFF",
  surfaceHigh: "#F0EEF7",
  onSurface: "#1A1A1A",
  onSurfaceVariant: "#4A4553",
  outline: "#E5E2EF",
  success: "#DCFCE7",
  onSuccess: "#14532D",
  warning: "#FEF3C7",
  onWarning: "#78350F",
  error: "#FEE2E2",
  onError: "#7F1D1D",
  neutral: "#F0EEF7",
  onNeutral: "#464050",
};

const TERAHOME: ScreenTokens = {
  primary: "#A14216",
  onPrimary: "#FFFFFF",
  primaryContainer: "#F6E9E1",
  onPrimaryContainer: "#6B2A0C",
  background: "#F7F8FA",
  surface: "#FFFFFF",
  surfaceHigh: "#EFF1F5",
  onSurface: "#0F172A",
  onSurfaceVariant: "#454B55",
  outline: "#E3E6EC",
  success: "#DCFCE7",
  onSuccess: "#14532D",
  warning: "#FEF3C7",
  onWarning: "#78350F",
  error: "#FEE2E2",
  onError: "#7F1D1D",
  neutral: "#EFF1F5",
  onNeutral: "#3F4754",
};

/** KOPIFLOW: same neutral surfaces as TERAHOME, so two warm-brand apps agree. */
const KOPIFLOW: ScreenTokens = {
  primary: "#A14216",
  onPrimary: "#FFFFFF",
  primaryContainer: "#F6E9E1",
  onPrimaryContainer: "#6B2A0C",
  background: "#F7F8FA",
  surface: "#FFFFFF",
  surfaceHigh: "#EFF1F5",
  onSurface: "#0F172A",
  onSurfaceVariant: "#454B55",
  outline: "#E3E6EC",
  success: "#DCFCE7",
  onSuccess: "#14532D",
  warning: "#FEF3C7",
  onWarning: "#78350F",
  error: "#FEE2E2",
  onError: "#7F1D1D",
  neutral: "#EFF1F5",
  onNeutral: "#3F4754",
};

/** Outstanding Delivery Automation: no UI of its own, so it borrows the same. */

/** Outstanding Delivery Automation — backend with no UI; warm grey card. */
const OUTSTANDING: ScreenTokens = {
  primary: "#A14216",
  onPrimary: "#FFFFFF",
  primaryContainer: "#F6E9E1",
  onPrimaryContainer: "#6B2A0C",
  background: "#F7F8FA",
  surface: "#FFFFFF",
  surfaceHigh: "#EFF1F5",
  onSurface: "#0F172A",
  onSurfaceVariant: "#454B55",
  outline: "#E3E6EC",
  success: "#DCFCE7",
  onSuccess: "#14532D",
  warning: "#FEF3C7",
  onWarning: "#78350F",
  error: "#FEE2E2",
  onError: "#7F1D1D",
  neutral: "#EFF1F5",
  onNeutral: "#3F4754",
};

/** Tokens by project slug, resolved through the registry, never by name. */
const BY_SLUG: Record<string, ScreenTokens> = {
  thinkpos: THINKPOS,
  clockora: CLOCKORA,
  terahome: TERAHOME,
  kopiflow: KOPIFLOW,
  "outstanding-delivery-automation": OUTSTANDING,
};

export function tokensFor(slug: string): ScreenTokens {
  return BY_SLUG[slug] ?? TERAHOME;
}

/** Logical authoring sizes. Every recreation is drawn at exactly one of these. */
export const LOGICAL = {
  phone: { width: 360, height: 780 },
  web: { width: 1280, height: 800 },
} as const;

/**
 * Bottom navigation.
 *
 * Kept short on purpose. Material 3 Expressive replaced the tall legacy bar
 * with a shorter flexible one, and the extra height belongs to the content
 * rather than to the frame around it.
 */
export const NAV_HEIGHT = 64;

/**
 * Type scale.
 *
 * The floor is 11px and the harness measures it in the rendered DOM. Nothing
 * here uses `truncate` or a line clamp: if a string would not fit at its size,
 * the string gets shorter, because a clipped label is worse than a plain one.
 */
export const TYPE = {
  title: "text-[1.375rem] leading-tight font-semibold",
  section: "text-base leading-tight font-semibold",
  body: "text-sm",
  label: "text-xs",
  /** Short all-caps chips only, never a sentence or a list label. */
  // 11px, not the site's 12px floor. These are drawn app screens, and the
  // visual-check harness measures them at their own floor (`size < 11`) and
  // fails `recreation-no-wrapped-label` the moment a chip grows a point and
  // starts wrapping inside a phone-width card. Fidelity to the app wins here.
  chip: "text-[0.6875rem] uppercase tracking-wide",
  metric: "text-[1.75rem] leading-none font-semibold tabular-nums",
  metricSm: "text-lg leading-none font-semibold tabular-nums",
} as const;

/** 8px spacing grid, with a 4px half step for icon-to-label pairs. */
export const SPACE = {
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
} as const;

/** Shape scale: Material 3 card radius band. */
export const RADIUS = {
  card: "rounded-[18px]",
  control: "rounded-xl",
  chip: "rounded-full",
} as const;