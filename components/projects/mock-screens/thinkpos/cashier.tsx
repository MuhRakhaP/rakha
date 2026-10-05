import { CreditCard, Minus, Plus, Search } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import {
  Caption,
  Card,
  Chip,
  FilterChip,
  Field,
  PrimaryButton,
  Screen,
  SectionCard,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * THINKPOS cashier, authored at 360x780.
 *
 * The real screen (`lib/sections/cashier_section.dart`) splits at 600px into a
 * product list and a fixed cart. Below that it stacks the product list and adds
 * a mobile cart summary bar that opens a sheet holding the cart, which is what
 * this width shows.
 *
 * Order kept from the source: search, category chips, product grid, then the
 * cart behind its sheet, with the sticky bar carrying count and total exactly as
 * the mobile summary does. Thermal receipt printing needs a physical ESC/POS
 * device, so nothing is drawn for it and no invented print preview appears.
 */
export function ThinkPosCashier() {
  const t = tokensFor("thinkpos");
  const d = DUMMY.thinkpos;

  const rupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
  const total = d.cart.reduce((sum, line) => sum + line.qty * line.price, 0);
  const count = d.cart.reduce((sum, line) => sum + line.qty, 0);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Screen tokens={t} subtitle="Bill #001" title="Kasir" action={<Chip tokens={t} tone="primary">Umum</Chip>}>
        <Field
          tokens={t}
          placeholder="Cari produk"
          icon={<Search className="h-5 w-5" />}
        />

        <div className="flex gap-2">
          {d.categories.map((category, index) => (
            <FilterChip key={category} tokens={t} selected={index === 0}>
              {category}
            </FilterChip>
          ))}
        </div>

        {/* Hero: the product grid, the screen's actual subject. */}
        <div className="grid grid-cols-3 gap-2.5">
          {d.products.slice(0, 6).map((product) => (
            <Card key={product.name} tokens={t} className="relative p-2.5">
              <span
                aria-hidden="true"
                className="mb-2 block h-10 w-full rounded-lg"
                style={{ background: t.surfaceHigh }}
              />
              <p className={`${TYPE.body} font-medium`}>{product.name}</p>
              {/* A price never wraps: "Rp 150.000" broken across two lines reads
                  as two numbers. At body size it is 80px in a 78px column, so
                  it sits one step down at label size, which is also how the
                  drawing reads at card scale. */}
              <p
                className={`${TYPE.label} mt-0.5 font-semibold whitespace-nowrap tabular-nums`}
                style={{ color: t.primary }}
              >
                {rupiah(product.price)}
              </p>
            </Card>
          ))}
        </div>

        {/* The cart sheet the mobile layout opens. */}
        <SectionCard
          tokens={t}
          title="Keranjang"
          trailing={<Chip tokens={t}>{count} item</Chip>}
        >
          <ul className="flex flex-col gap-2">
            {d.cart.map((line) => (
              <li
                key={line.name}
                className="flex items-center justify-between gap-2"
              >
                <span className={`${TYPE.body}`}>{line.name}</span>
                <Stepper
                  tokens={t}
                  icon={<Minus className="h-4 w-4" />}
                  label={`Kurangi ${line.name}`}
                />
                <span className={`${TYPE.label} w-4 text-center tabular-nums`}>
                  {line.qty}
                </span>
                <Stepper
                  tokens={t}
                  icon={<Plus className="h-4 w-4" />}
                  label={`Tambah ${line.name}`}
                />
                <span className={`${TYPE.label} font-semibold tabular-nums`}>
                  {rupiah(line.qty * line.price)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between">
            <Caption tokens={t}>Subtotal</Caption>
            <span className={`${TYPE.body} font-semibold tabular-nums`}>
              {rupiah(total)}
            </span>
          </div>
        </SectionCard>
      </Screen>

      {/* Sticky cart bar, from the same file's mobile summary.

          `color` is set here because this bar is a sibling of <Screen>, not a
          child of it: <Screen> is what gives every other element in this
          recreation its ink, so without it this bar inherited the portfolio's
          pale foreground and drew dark-on-dark text on its own white surface. */}
      <div
        className="flex shrink-0 items-center gap-3 border-t px-5 py-3"
        style={{ borderColor: t.outline, background: t.surface, color: t.onSurface }}
      >
        <div className="min-w-0 flex-1">
          <Caption tokens={t}>{count} item</Caption>
          <p className={`${TYPE.metricSm} mt-0.5`}>{rupiah(total)}</p>
        </div>
        <PrimaryButton tokens={t} full={false} icon={<CreditCard className="h-5 w-5" />}>
          Bayar
        </PrimaryButton>
      </div>
    </div>
  );
}

function Stepper({
  tokens,
  icon,
  label,
}: {
  tokens: ReturnType<typeof tokensFor>;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span
      aria-hidden="true"
      title={label}
      className="flex h-11 w-11 items-center justify-center border"
      style={{ borderColor: tokens.outline, borderRadius: 999 }}
    >
      {icon}
    </span>
  );
}