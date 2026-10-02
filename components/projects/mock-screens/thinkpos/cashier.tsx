import { DUMMY } from "@/data/mock-screens";

import {
  AppBar,
  Button,
  Field,
  MicroLabel,
  PhoneScreen,
  Pill,
  Stack,
  StaticDevicePanel,
} from "../primitives";

/**
 * THINKPOS cashier checkout.
 *
 * Layout read from `D:\thinkpos\lib\sections\cashier_section.dart`. The source
 * splits into a product list on the left and a cart panel on the right at 600px
 * and above; below that it stacks the product list and adds a mobile cart
 * summary bar. A phone recreation therefore gets the stacked form, with the
 * cart promoted to its own panel because that is the screen's real subject.
 *
 * Order preserved from the source: header buttons, search, category chips,
 * product grid; then the cart's header, line items, and the totals block
 * (Subtotal, Diskon (%), Total Akhir) above the pay button.
 *
 * Thermal receipt printing cannot be shown, so it is a labelled static block.
 */
export function ThinkPosCashier() {
  const d = DUMMY.thinkpos;

  const subtotal = d.cart.reduce((sum, line) => sum + line.qty * line.price, 0);
  const rupiah = (value: number) =>
    `Rp ${value.toLocaleString("id-ID")}`;

  return (
    <PhoneScreen>
      <AppBar title="Kasir" />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Product list: header row, search, category chips, grid. */}
        <div className="flex flex-col gap-2 border-b border-border bg-muted/40 p-2">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[0.625rem] font-semibold">Bill #001</span>
            <div className="flex items-center gap-1">
              <Pill tone="good">Input Kas</Pill>
              <Pill>Daftar Nota</Pill>
              <Pill tone="brand">Tambah Nota</Pill>
            </div>
          </div>

          <Field placeholder="Cari produk..." />

          <div className="flex items-center gap-1">
            {d.categories.map((category, i) => (
              <Pill key={category} tone={i === 0 ? "brand" : "neutral"}>
                {category}
              </Pill>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {d.products.slice(0, 6).map((product) => (
              <div
                key={product.name}
                className="relative flex flex-col gap-0.5 rounded-lg border border-border bg-card p-1.5"
              >
                <span
                  aria-hidden="true"
                  className="h-6 rounded bg-muted"
                />
                <span className="truncate text-[0.5rem] font-semibold">
                  {product.name}
                </span>
                <span className="text-[0.5rem] font-semibold text-brand">
                  {rupiah(product.price)}
                </span>
                <span className="text-[0.4375rem] text-muted-foreground">
                  Sisa: {product.stock}
                </span>
                {product.stock <= 5 && (
                  <span className="absolute top-1 right-1 rounded bg-rose-600 px-1 py-px text-[0.375rem] font-semibold text-white">
                    Stok Tipis
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cart panel: header, line items, totals, pay button. */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden p-2">
          <div className="flex items-center justify-between gap-2 border-b border-border pb-1.5">
            <span className="text-[0.6875rem] font-bold">Keranjang Belanja</span>
            <span className="text-[0.5rem] text-muted-foreground">Bill #001</span>
          </div>

          <ul className="flex flex-col gap-1">
            {d.cart.map((line) => (
              <li
                key={line.name}
                className="flex items-center gap-1.5 rounded-md border border-border/60 bg-card px-1.5 py-1"
              >
                <span className="flex-1 truncate text-[0.5625rem]">
                  {line.name}
                </span>
                <span className="text-[0.5rem] tabular-nums text-muted-foreground">
                  − {line.qty} +
                </span>
                <span className="text-[0.5625rem] font-semibold tabular-nums text-brand">
                  {rupiah(line.qty * line.price)}
                </span>
              </li>
            ))}
          </ul>

          <Stack gap="sm" className="mt-auto">
            <div className="flex items-center justify-between text-[0.5625rem]">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="tabular-nums">{rupiah(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-[0.5625rem]">
              <span className="text-muted-foreground">Diskon (%)</span>
              <span className="tabular-nums">{d.discountPct}</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-brand-weak px-2 py-1.5">
              <span className="text-[0.625rem] font-bold">Total Akhir</span>
              <span className="text-[0.8125rem] font-bold tabular-nums text-brand">
                {rupiah(subtotal)}
              </span>
            </div>
            <Button tone="brand">Proses Pembayaran</Button>
          </Stack>
        </div>

        <div className="px-2 pb-2">
          <StaticDevicePanel
            title="Thermal printer"
            detail="Receipt output needs a physical ESC/POS printer, so it is not recreated."
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border bg-card px-2 py-1">
        <MicroLabel>Cashier</MicroLabel>
        <MicroLabel>Dashboard · Kasir · Shift · Produk · Pelanggan</MicroLabel>
      </div>
    </PhoneScreen>
  );
}