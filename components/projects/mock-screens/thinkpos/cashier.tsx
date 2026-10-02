import { cn } from "cn";
import { Minus, Plus, Printer, Search, Trash2 } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import {
  Card,
  Caption,
  Chip,
  FilterChip,
  Field,
  PhoneCanvas,
  PrimaryButton,
  Screen,
  SectionCard,
  Stack,
  StaticDevicePanel,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * THINKPOS cashier checkout.
 *
 * The real screen (`lib/sections/cashier_section.dart`) splits at 600px: a
 * product list on the left and a fixed cart panel on the right. Below that it
 * stacks the product list and adds a mobile cart summary bar that opens a sheet
 * holding the cart. A phone recreation therefore gets the stacked form, and the
 * sheet is what the source actually shows at this size.
 *
 * Order preserved: search, category chips, product grid; the cart sits behind
 * the sheet, and the sticky bar carries the count and the total exactly as the
 * mobile summary does.
 *
 * Thermal receipt printing needs a physical ESC/POS device, so it is a labelled
 * static block rather than an invented print preview.
 */
export function ThinkPosCashier() {
  const t = tokensFor("thinkpos");
  const d = DUMMY.thinkpos;

  const rupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
  const total = d.cart.reduce((sum, line) => sum + line.qty * line.price, 0);
  const count = d.cart.reduce((sum, line) => sum + line.qty, 0);

  return (
    <PhoneCanvas>
      <Screen
        tokens={t}
        title="Kasir"
        subtitle="Bill #001"
        action={<Chip tokens={t} tone="primary">Umum</Chip>}
      >
        <Stack gap="md">
          <Field
            tokens={t}
            placeholder="Cari produk..."
            icon={<Search className="h-5 w-5" />}
          />

          <div className="flex gap-2 overflow-x-auto">
            {d.categories.map((category, index) => (
              <FilterChip
                key={category}
                tokens={t}
                selected={index === 0}
              >
                {category}
              </FilterChip>
            ))}
          </div>

          {/* Product grid: name and price, as the real cards show. */}
          <div className="grid grid-cols-2 gap-3">
            {d.products.slice(0, 6).map((product) => (
              <Card key={product.name} tokens={t} className="relative p-3">
                <span
                  aria-hidden="true"
                  className="mb-2 block h-14 w-full rounded-lg"
                  style={{ background: t.surfaceHigh }}
                />
                <p className={cn(TYPE.body, "truncate font-medium")}>
                  {product.name}
                </p>
                <p
                  className={cn(TYPE.body, "mt-1.5 truncate font-semibold tabular-nums")}
                  style={{ color: t.primary }}
                >
                  {rupiah(product.price)}
                </p>
                <p className={cn(TYPE.label, "mt-1 tabular-nums")} style={{ color: t.onSurfaceVariant }}>
                  Sisa {product.stock}
                </p>
                {product.stock <= 5 ? (
                  <span className="absolute top-4 right-4">
                    <Chip tokens={t} tone="error">
                      Tipis
                    </Chip>
                  </span>
                ) : null}
              </Card>
            ))}
          </div>

          {/* The cart sheet the mobile layout opens. */}
          <SectionCard tokens={t} title="Keranjang Belanja" trailing={<Chip tokens={t}>{count} item</Chip>}>
            <ul className="flex flex-col gap-3">
              {d.cart.map((line) => (
                <li
                  key={line.name}
                  className="flex flex-col gap-2 px-3 py-2"
                  style={{ background: t.surfaceHigh, borderRadius: 12 }}
                >
                  {/* Name and line total on one row, controls beneath. A single
                      row cannot hold a name, a three-part stepper, a delete
                      affordance and a price at phone width. */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn(TYPE.body, "min-w-0 flex-1 truncate")}>
                      {line.name}
                    </span>
                    <span
                      className={cn(TYPE.label, "shrink-0 font-semibold tabular-nums")}
                    >
                      {rupiah(line.qty * line.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex shrink-0 items-center">
                      <Stepper
                        icon={<Minus className="h-4 w-4" />}
                        label={`Kurangi ${line.name}`}
                      />
                      <span className={cn(TYPE.label, "w-4 text-center tabular-nums")}>
                        {line.qty}
                      </span>
                      <Stepper
                        icon={<Plus className="h-4 w-4" />}
                        label={`Tambah ${line.name}`}
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center"
                      style={{ color: t.onError }}
                    >
                      <Trash2 className="h-5 w-5" />
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Caption tokens={t}>Subtotal</Caption>
                <span className={cn(TYPE.body, "tabular-nums")}>{rupiah(total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <Caption tokens={t}>Diskon (%)</Caption>
                <span className={cn(TYPE.body, "tabular-nums")}>{d.discountPct}</span>
              </div>
            </div>
          </SectionCard>

          <StaticDevicePanel
            tokens={t}
            icon={<Printer className="h-10 w-10" style={{ color: t.onSurfaceVariant }} />}
            title="Thermal printer not recreated"
            detail="Receipt output needs a physical ESC/POS device, so there is nothing to draw here."
          />
        </Stack>
      </Screen>

      {/* Sticky cart bar: the mobile summary from the same source file. */}
      <div
        className="flex shrink-0 items-center gap-3 border-t px-4 py-3"
        style={{ borderColor: t.outline, background: t.surface }}
      >
        <div className="min-w-0 flex-1">
          <span className={cn(TYPE.label, "block truncate")} style={{ color: t.onSurfaceVariant }}>
            {count} item di keranjang
          </span>
          <p className={cn(TYPE.metricSm, "mt-1 truncate")}>{rupiah(total)}</p>
        </div>
        <PrimaryButton tokens={t} full={false}>
          Proses Pembayaran
        </PrimaryButton>
      </div>
    </PhoneCanvas>
  );
}

function Stepper({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  const t = tokensFor("thinkpos");
  return (
    <span
      aria-hidden="true"
      title={label}
      className="flex h-11 w-11 items-center justify-center border"
      style={{ borderColor: t.outline, borderRadius: 999 }}
    >
      {icon}
    </span>
  );
}