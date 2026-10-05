/**
 * A route change in the App Router does not remount anything by itself, so the
 * next page swaps in with no transition at all. A template does remount on every
 * navigation, which is the only built-in way to get an exit-free entrance here
 * without a client-side router wrapper.
 *
 * Deliberately 400ms and fade-plus-slide only. Anything longer reads as lag on
 * a navigation, and a scale or stagger on top of this would be motion for its
 * own sake. The header and footer live in the layout, so they stay put and do
 * not flicker while the page body arrives.
 *
 * The animation runs once per mount via a keyframe rather than a state flip, so
 * there is no first-paint flash of the hidden state and nothing to hydrate
 * before the content is visible. The reduced-motion block in globals.css
 * collapses the duration, and the end state is the visible one.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
