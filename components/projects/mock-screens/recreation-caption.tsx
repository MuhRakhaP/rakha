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
 * It appears once per strip, small and left-aligned beneath the row, rather
 * than repeated on every card where it would only compete with the content.
 * Each screen still carries the wording in its own accessible name, so the fact
 * travels with the individual image.
 *
 * It has no close button and no state, so it cannot be dismissed.
 */
export function RecreationCaption() {
  return (
    <p
      role="note"
      data-testid="recreation-caption"
      className="text-xs leading-snug text-muted-foreground"
    >
      {RECREATION_CAPTION}
    </p>
  );
}