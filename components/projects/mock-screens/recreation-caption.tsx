import { RECREATION_CAPTION } from "@/data/mock-screens";

/**
 * The permanent label on a UI recreation.
 *
 * A recreation is drawn by hand from source code, so it must never be
 * mistakable for a capture of a running app. This caption is the guarantee:
 * it is visible text, it carries `role="note"` so assistive technology
 * announces it as an aside rather than as content, and it is the wording the
 * visual-check harness asserts verbatim.
 *
 * It has no close button and no state, so it cannot be dismissed.
 */
export function RecreationCaption() {
  return (
    <p
      role="note"
      data-testid="recreation-caption"
      className="rounded-md border border-dashed border-brand/40 bg-brand-weak/40 px-2.5 py-1.5 text-[0.6875rem] leading-snug font-medium text-brand"
    >
      {RECREATION_CAPTION}
    </p>
  );
}