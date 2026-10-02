import { cn } from "cn";
import { Lock, LogIn, Store, UserRound } from "lucide-react";

import { Field, PhoneCanvas, PrimaryButton } from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * THINKPOS sign-in.
 *
 * Structure read from `D:\thinkpos\lib\login_screen.dart`: a centred white card
 * holding, in order, the logo, a heading, a label-above-field pair for the
 * username, the same for the password, and one full-width button.
 *
 * The logo is the app's PNG asset plus a "POS SYSTEM" text fallback. Neither is
 * copied: an asset is a brand mark, and a bare wordmark adds nothing. A neutral
 * store glyph stands in, which is also what the app's own side rail uses.
 */
export function ThinkPosLogin() {
  const t = tokensFor("thinkpos");

  return (
    <PhoneCanvas>
      <div
        className="flex h-full items-center justify-center p-5"
        style={{ background: t.background }}
      >
        <div
          className="flex w-full flex-col gap-5 border p-6"
          style={{
            background: t.surface,
            borderColor: t.outline,
            borderRadius: 18,
            boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
          }}
        >
          <span
            aria-hidden="true"
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{ background: t.primaryContainer }}
          >
            <Store className="h-10 w-10" style={{ color: t.primary }} />
          </span>

          <h3 className={cn(TYPE.title, "text-center font-semibold")}>
            Login Thinkpos
          </h3>

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
    </PhoneCanvas>
  );
}