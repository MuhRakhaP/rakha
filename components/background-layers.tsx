/**
 * The page's fixed background layers: grid, then aurora on the hero and footer
 * only, then grain over everything.
 *
 * One component rather than three, because they are three layers of a single
 * picture and they have to stack in a fixed order. Each is `aria-hidden` and
 * `pointer-events-none`: none of them carry information, and none of them may
 * intercept a click.
 *
 * The aurora is confined to the hero and the footer rather than the whole page
 * on purpose. It is a 40px-blurred, always-moving field, and running it behind
 * every section would make reading worse rather than better. Two slow regions
 * at the two ends of the document is the dose that works.
 */
export function BackgroundLayers() {
  return (
    <>
      <div
        aria-hidden="true"
        className="page-grid pointer-events-none fixed inset-0 z-0"
      />

      <div
        aria-hidden="true"
        className="noise-overlay pointer-events-none fixed inset-0 z-[1]"
      />

      {/* Behind the hero, so it needs no z-index of its own to sit under
          content that is already positioned. */}
      <div
        aria-hidden="true"
        className="aurora pointer-events-none absolute inset-0 opacity-60"
      />
    </>
  );
}

/**
 * The aurora's counterpart at the foot of the page, where it closes the
 * composition the way it opened it.
 */
export function FooterAurora() {
  return (
    <div
      aria-hidden="true"
      className="aurora pointer-events-none absolute inset-0 opacity-40"
    />
  );
}
