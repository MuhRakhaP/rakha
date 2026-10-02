import { RECREATION_CAPTION } from "@/data/mock-screens";

/**
 * The label on a strip of UI recreations.
 *
 * A recreation is drawn by hand from source code, so it must never be
 * mistakable for a capture of a running app. This caption is the guarantee: it
 * is visible text, it carries `role="note"` so assistive technology announces it
 * as an aside rather than as content, and it is the wording the visual-check
 * harness asserts verbatim.
 *
 * It appears once per strip rather than under every card, because one clear
 * statement about the whole row is enough and repeating it four times buries
 * it. Each screen still carries the wording in its own accessible name, so the
 * fact travels with the individual image.
 *
 * It has no close button and no state, so it cannot be dismissed.
 */
export function RecreationCaption() {
  return (
    <p
      role="note"
      data-testid="recreation-caption"
      className="rounded-lg border border-dashed border-brand/40 bg-brand-weak/50 px-3 py-2 text-xs leading-snug font-medium text-brand"
    >
      {RECREATION_CAPTION}
    </p>
  );
}