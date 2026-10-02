import { DUMMY } from "@/data/mock-screens";

import {
  BrowserScreen,
  MicroLabel,
  Pill,
  Stack,
} from "../primitives";

const inv = DUMMY.terahome.invoice;

/**
 * TERAHOME invoice detail — the one screen that could not be captured.
 *
 * Every visit to `/billing/[id]` in the running app crashes with React error
 * #310: the page returns early while loading and again when the invoice is
 * missing, but calls `useState` after both returns, so the hook count changes
 * between renders. That is a real product bug, recorded rather than worked
 * around.
 *
 * The layout below is therefore read from
 * `D:\terahome\apps\isp\app\(dashboard)\billing\[id]\page.tsx` rather than from
 * a browser: a back link and a print receipt button, an invoice number with a
 * status badge and the two dates, then billed-to and payment method, then the
 * service line items, then subtotal and total bill.
 *
 * Values are the same fictional invoice the rest of the portfolio's dummy data
 * uses.
 */
export function TerahomeInvoiceDetail() {
  return (
    <BrowserScreen>
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-2">
        <span className="text-[0.5625rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          ‹ Invoices
        </span>
        <span className="rounded-md border border-border bg-card px-2 py-1 text-[0.5rem] font-bold tracking-[0.08em] uppercase">
          Print receipt
        </span>
      </div>

      <div className="flex-1 overflow-hidden p-3">
        <Stack gap="md" className="mx-auto max-w-[52rem]">
          {/* Invoice number, status, and the two dates. */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-9 w-9 rounded-lg bg-brand-weak"
              />
              <div>
                <MicroLabel>Invoice Number</MicroLabel>
                <p className="text-sm font-bold tracking-tight">{inv.number}</p>
              </div>
            </div>
            <Pill tone={inv.status === "PAID" ? "good" : "warn"}>
              {inv.status}
            </Pill>
            <div className="ml-auto grid grid-cols-2 gap-x-6">
              <div>
                <MicroLabel>Date</MicroLabel>
                <p className="text-[0.6875rem] font-semibold">{inv.date}</p>
              </div>
              <div>
                <MicroLabel>Due Date</MicroLabel>
                <p className="text-[0.6875rem] font-semibold text-rose-700">
                  {inv.dueDate}
                </p>
              </div>
            </div>
          </div>

          {/* Billed to, and the payment method. */}
          <div className="grid grid-cols-1 gap-6 border-y border-border py-4 sm:grid-cols-2">
            <div>
              <MicroLabel>Billed To:</MicroLabel>
              <p className="mt-1 text-sm font-bold">{inv.customerName}</p>
              <p className="text-[0.6875rem] text-muted-foreground">
                {inv.customerCode}
              </p>
              <p className="text-[0.6875rem] text-muted-foreground">
                {inv.customerPhone}
              </p>
            </div>
            <div className="sm:text-right">
              <MicroLabel>Payment Method:</MicroLabel>
              <p className="mt-1 text-[0.8125rem] font-semibold">
                Xendit Digital Payment
              </p>
              <p className="text-[0.6875rem] text-muted-foreground italic">
                Virtual Account, QRIS, E-Wallet
              </p>
            </div>
          </div>

          {/* Service line items. */}
          <div>
            <MicroLabel>Service Details:</MicroLabel>
            <ul className="mt-1.5 flex flex-col gap-1.5">
              {inv.lineItems.map((item) => (
                <li
                  key={item.description}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/40 px-3 py-2"
                >
                  <div>
                    <p className="text-[0.75rem] font-bold">{item.description}</p>
                    <p className="text-[0.625rem] text-muted-foreground">
                      1 Unit x {item.unitPrice}
                    </p>
                  </div>
                  <p className="text-[0.75rem] font-bold tabular-nums">
                    {item.amount}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Totals. */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-2 text-[0.75rem] font-semibold text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">{inv.subtotal}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-brand-weak px-3 py-2.5 text-brand">
              <span className="text-sm font-bold tracking-tight">Total Bill</span>
              <span className="text-lg font-bold tracking-tight tabular-nums">
                {inv.total}
              </span>
            </div>
          </div>
        </Stack>
      </div>
    </BrowserScreen>
  );
}