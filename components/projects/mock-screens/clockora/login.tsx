import { Fingerprint, Lock, LogIn, UserRound } from "lucide-react";

import { Field, PrimaryButton } from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * CLOCKORA sign-in, authored at 360x780.
 *
 * Layout read from `D:\clockora\lib\login_screen.dart`: a full-bleed page, no
 * card, holding in order the fingerprint glyph, the wordmark, the tagline, a
 * username field, a password field, a full-width log in button, and a
 * forgot-password link.
 *
 * The wordmark is the app's own text. The version line the app prints in debug
 * builds is build metadata rather than design, so it is left out.
 */
export function ClockoraLogin() {
  const t = tokensFor("clockora");

  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-7 px-7"
      style={{ background: t.background, color: t.onSurface }}
    >
      <span
        aria-hidden="true"
        className="flex h-24 w-24 items-center justify-center rounded-full"
        style={{ background: t.primaryContainer }}
      >
        <Fingerprint className="h-12 w-12" style={{ color: t.primary }} />
      </span>

      <div className="text-center">
        <h3 className={`${TYPE.title} font-bold`}>Clockora</h3>
        <p className={`${TYPE.body} mt-1`} style={{ color: t.onSurfaceVariant }}>
          Attendance management made simple
        </p>
      </div>

      <div className="flex w-full flex-col gap-4">
        <Field
          tokens={t}
          label="Username"
          placeholder="Masukkan username"
          icon={<UserRound className="h-5 w-5" />}
        />
        <Field
          tokens={t}
          label="Password"
          placeholder="Masukkan password"
          icon={<Lock className="h-5 w-5" />}
          trailing="show"
        />
      </div>

      <div className="w-full">
        <PrimaryButton tokens={t} icon={<LogIn className="h-5 w-5" />}>
          Log In
        </PrimaryButton>
      </div>

      <span className={`${TYPE.body} font-medium`} style={{ color: t.primary }}>
        Forgot Password?
      </span>
    </div>
  );
}