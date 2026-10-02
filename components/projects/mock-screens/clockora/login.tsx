import { cn } from "cn";
import { Fingerprint, Lock, LogIn, UserRound } from "lucide-react";

import { Field, PhoneCanvas, PrimaryButton } from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * CLOCKORA sign-in.
 *
 * Layout read from `D:\clockora\lib\login_screen.dart`: a full-bleed page with
 * no card, holding in order the fingerprint glyph, the wordmark, the tagline,
 * a username field, a password field with a visibility affordance, a full-width
 * log in button, and a forgot-password link.
 *
 * The wordmark is real text, as it is in the app. The version line the app
 * prints in debug builds is left out: it carries build metadata, not design.
 */
export function ClockoraLogin() {
  const t = tokensFor("clockora");

  return (
    <PhoneCanvas>
      <div
        className="flex h-full flex-col items-center justify-center gap-6 px-6"
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
          <h3 className={cn(TYPE.title, "font-bold tracking-tight")}>
            Clockora
          </h3>
          <p
            className={cn(TYPE.body, "mt-1")}
            style={{ color: t.onSurfaceVariant }}
          >
            Attendance management made simple
          </p>
        </div>

        <div className="mt-2 flex w-full flex-col gap-4">
          <Field
            tokens={t}
            label="Username"
            placeholder="Username"
            icon={<UserRound className="h-5 w-5" />}
          />
          <Field
            tokens={t}
            label="Password"
            placeholder="Password"
            icon={<Lock className="h-5 w-5" />}
            trailing="show"
          />
        </div>

        <div className="w-full">
          <PrimaryButton
            tokens={t}
            icon={<LogIn className="h-5 w-5" />}
          >
            Log In
          </PrimaryButton>
        </div>

        <span
          className={cn(TYPE.body, "font-medium underline")}
          style={{ color: t.primary }}
        >
          Forgot Password?
        </span>
      </div>
    </PhoneCanvas>
  );
}