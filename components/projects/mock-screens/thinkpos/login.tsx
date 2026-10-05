import { Lock, LogIn, Store, UserRound } from "lucide-react";

import { Field, PrimaryButton } from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * THINKPOS sign-in, authored at 360x780.
 *
 * Structure read from `D:\thinkpos\lib\login_screen.dart`: a centred white card
 * holding, in order, the logo, a heading, a label-above-field pair for the
 * username, the same for the password, and one full-width button.
 *
 * The logo is the app's PNG asset plus a "POS SYSTEM" text fallback. Neither is
 * copied: an asset is a brand mark. A neutral store glyph stands in, which is
 * also what the app's own side rail uses.
 */
export function ThinkPosLogin() {
  const t = tokensFor("thinkpos");

  return (
    <div
      className="flex h-full items-center justify-center p-6"
      style={{ background: t.background, color: t.onSurface }}
    >
      {/* `color` on the white card, not just the outer surface: this screen does
          not go through <Screen>, so without it the heading inherited the
          portfolio's pale foreground and sat at 1.23:1 on white. */}
      <div className="flex w-full flex-col gap-6 p-6" style={{ background: t.surface, color: t.onSurface, borderRadius: 20, border: `1px solid ${t.outline}` }}>
        <span
          aria-hidden="true"
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{ background: t.primaryContainer }}
        >
          <Store className="h-10 w-10" style={{ color: t.primary }} />
        </span>

        <h3 className={`${TYPE.title} text-center`}>Login Thinkpos</h3>

        <div className="flex flex-col gap-4">
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

        <PrimaryButton tokens={t} icon={<LogIn className="h-5 w-5" />}>
          Login
        </PrimaryButton>
      </div>
    </div>
  );
}