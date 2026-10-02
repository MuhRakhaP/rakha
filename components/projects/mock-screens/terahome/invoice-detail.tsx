import { cn } from "cn";
import { FileText, Printer } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import { Card, Caption, Chip, SectionCard, Stack } from "../primitives";
import { TYPE, tokensFor } from "../tokens";

const inv = DUMMY.terahome.invoice;

/**
 * TERAHOME invoice detail — the one screen that could not be captured.
 *
 * Every visit to `/billing/<id>` in the running app crashes with React error
 * #310: the page returns early while loading and again when the invoice is
 * missing, but calls `useState` after both returns, so the hook count changes
 * between renders. That is a real product bug, recorded rather than worked
 * around.
 *
 * The layout is therefore read from
 * `D:\terahome\apps\isp\app\(dashboard)\billing\[id]\page.tsx` rather than from a
 * browser: a back link and a print receipt button, an invoice number with a
 * status badge and the two dates, then billed-to and payment method, then the
 * service line items, then subtotal and total bill.
 *
 * Values are the same fictional invoice the rest of the portfolio's dummy data
 * uses.
 */
export function TerahomeInvoiceDetail() {
  const t = tokensFor("terahome");

  return (
    <div
      className="flex h-full min-h-0 flex-col"
      style={{ background: t.background, color: t.onSurface }}
    >
      <header
        className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3"
        style={{ borderColor: t.outline, background: t.surface }}
      >
        <span className={cn(TYPE.body, "font-semibold")}>‹ Invoices</span>
        <span
          className="inline-flex min-h-11 items-center gap-2 border px-3"
          style={{ borderColor: t.outline, borderRadius: 999 }}
        >
          <Printer className="h-5 w-5" style={{ color: t.onSurfaceVariant }} />
          <span className={cn(TYPE.label, "font-medium")}>Print receipt</span>
        </span>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <Stack gap="md" className="mx-auto max-w-3xl">
          <Card tokens={t}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center"
                  style={{ background: t.primaryContainer, borderRadius: 14 }}
                >
                  <FileText className="h-6 w-6" style={{ color: t.primary }} />
                </span>
                <div className="min-w-0">
                  <Caption tokens={t}>Invoice Number</Caption>
                  <p className={cn(TYPE.section, "mt-1 font-semibold")}>
                    {inv.number}
                  </p>
                </div>
              </div>
              <Chip tokens={t} tone="warning">
                {inv.status}
              </Chip>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="min-w-0">
                <Caption tokens={t}>Date</Caption>
                <p className={cn(TYPE.body, "mt-1")}>{inv.date}</p>
              </div>
              <div className="min-w-0">
                <Caption tokens={t}>Due Date</Caption>
                <p className={cn(TYPE.body, "mt-1")} style={{ color: t.onError }}>
                  {inv.dueDate}
                </p>
              </div>
            </div>
          </Card>

          <Card tokens={t}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <Caption tokens={t}>Billed To</Caption>
                <p className={cn(TYPE.body, "mt-1 font-semibold")}>
                  {inv.customerName}
                </p>
                <p className={cn(TYPE.label, "tabular-nums")} style={{ color: t.onSurfaceVariant }}>
                  {inv.customerCode}
                </p>
                <p className={cn(TYPE.label, "tabular-nums")} style={{ color: t.onSurfaceVariant }}>
                  {inv.customerPhone}
                </p>
              </div>
              <div className="min-w-0 sm:text-right">
                <Caption tokens={t}>Payment Method</Caption>
                <p className={cn(TYPE.body, "mt-1 truncate font-semibold")}>
                  Xendit Digital Payment
                </p>
                <p
                  className={cn(TYPE.label, "truncate")}
                  style={{ color: t.onSurfaceVariant }}
                >
                  Virtual Account, QRIS, E-Wallet
                </p>
              </div>
            </div>
          </Card>

          <SectionCard tokens={t} title="Service Details">
            <ul className="flex flex-col gap-3">
              {inv.lineItems.map((item) => (
                <li
                  key={item.description}
                  className="flex items-center justify-between gap-3 px-3 py-2"
                  style={{ background: t.surfaceHigh, borderRadius: 12 }}
                >
                  <div className="min-w-0">
                    <p className={cn(TYPE.body, "truncate font-medium")}>
                      {item.description}
                    </p>
                    <p className={cn(TYPE.label, "tabular-nums")} style={{ color: t.onSurfaceVariant }}>
                      1 Unit x {item.unitPrice}
                    </p>
                  </div>
                  <span className={cn(TYPE.body, "shrink-0 font-semibold tabular-nums")}>
                    {item.amount}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <Card tokens={t}>
            <div className="flex items-center justify-between">
              <Caption tokens={t}>Subtotal</Caption>
              <span className={cn(TYPE.body, "tabular-nums")}>{inv.subtotal}</span>
            </div>
            <div
              className="mt-3 flex items-center justify-between px-3 py-3"
              style={{ background: t.primaryContainer, borderRadius: 14 }}
            >
              <span
                className={cn(TYPE.section, "font-semibold")}
                style={{ color: t.onPrimaryContainer }}
              >
                Total Bill
              </span>
              <span
                className={cn(TYPE.metric, "font-semibold")}
                style={{ color: t.onPrimaryContainer }}
              >
                {inv.total}
              </span>
            </div>
          </Card>
        </Stack>
      </div>
    </div>
  );
}