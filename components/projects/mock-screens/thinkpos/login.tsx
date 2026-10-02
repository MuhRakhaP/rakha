import {
  Button,
  Field,
  MicroLabel,
  PhoneScreen,
  Stack,
} from "../primitives";

/**
 * THINKPOS sign-in screen.
 *
 * Layout read from `D:\thinkpos\lib\login_screen.dart`: a centred white card
 * (max 400 wide) holding, in order, a logo block, a heading, a
 * label-above-field pair for the username, the same for the password, and one
 * full-width elevated button.
 *
 * The logo asset is deliberately not reproduced. A neutral block stands in its
 * place, because copying a brand mark into a hand-drawn recreation would imply
 * it is the real thing.
 */
export function ThinkPosLogin() {
  return (
    <PhoneScreen>
      <div className="flex flex-1 items-center justify-center bg-muted/60 p-3">
        <div className="flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          {/* Neutral stand-in for the app's logo asset. */}
          <div
            aria-hidden="true"
            className="mx-auto h-14 w-14 rounded-xl border border-border bg-brand-weak"
          />

          <h3 className="text-center text-sm font-bold">Login Thinkpos</h3>

          <Stack gap="sm" className="mt-1">
            <Field label="Username:" placeholder="Masukkan username" />
            <Field label="Password:" placeholder="Masukkan password" />
          </Stack>

          <Button tone="brand">Login</Button>

          <MicroLabel>Recreated layout. Credentials are not real.</MicroLabel>
        </div>
      </div>
    </PhoneScreen>
  );
}