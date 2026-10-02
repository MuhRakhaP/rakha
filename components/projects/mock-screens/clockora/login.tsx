import { Button, Field, MicroLabel, PhoneScreen } from "../primitives";

/**
 * CLOCKORA sign-in screen.
 *
 * Layout read from `D:\clockora\lib\login_screen.dart`: a full-bleed page, no
 * card, holding in order a circular badge with the product glyph, the wordmark,
 * the tagline, a username field, a password field with a visibility toggle, a
 * full-width log in button, a forgot password link, and a version line.
 *
 * The glyph is drawn as a neutral rounded block rather than reproduced, and the
 * wordmark is the app's own product name.
 */
export function ClockoraLogin() {
  return (
    <PhoneScreen>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5">
        {/* Neutral stand-in for the fingerprint glyph. */}
        <div
          aria-hidden="true"
          className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-weak"
        >
          <span className="h-9 w-9 rounded-lg border-2 border-brand/40" />
        </div>

        <div className="text-center">
          <h3 className="text-base font-bold tracking-tight">Clockora</h3>
          <p className="mt-1 text-[0.5625rem] text-muted-foreground">
            Attendance management made simple
          </p>
        </div>

        <div className="mt-2 flex w-full flex-col gap-3">
          <Field label="Username" placeholder="Username" />
          <Field label="Password" placeholder="Password" />
        </div>

        <Button tone="brand">Log In</Button>

        <span className="text-[0.5625rem] font-medium text-brand underline">
          Forgot Password?
        </span>

        <MicroLabel>v0.0.0-example · Recreated layout</MicroLabel>
      </div>
    </PhoneScreen>
  );
}