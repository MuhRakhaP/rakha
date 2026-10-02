import { FileText, Printer } from "lucide-react";

import { DUMMY } from "@/data/mock-screens";

import { Card, Caption, Chip, SectionCard, Stack } from "../primitives";
import { TYPE, tokensFor } from "../tokens";

const inv = DUMMY.terahome.invoice;

/**
 * TERAHOME invoice detail, authored at 1280x800.
 *
 * Every visit to `/billing/<id>` in the running app crashes with React error
 * #310: the page returns early while loading and again when the invoice is
 * missing, but calls `useState` after both returns, so the hook count changes
 * between renders. A real product bug, recorded rather than worked around.
 *
 * The layout is read from
 * `D:\\terahome\\apps\\isp\\app\\(dashboard)\\billing\\[id]\\page.tsx`: a back
 * link and a print receipt button, an invoice number with a status badge and
 * the two dates, then billed-to and payment method, then the service line
 * items, then subtotal and total bill.
 */
export function TerahomeInvoiceDetail() {
  const t = tokensFor("terahome");

  return (
    <div
      className="flex h-full min-h-0 flex-col"
      style={{ background: t.background, color: t.onSurface }}
    >
      <header
        className="flex shrink-0 items-center justify-between gap-4 border-b px-8 py-5"
        style={{ borderColor: t.outline, background: t.surface }}
      >
        <span className={`${TYPE.body} font-semibold`}>&#8249; Invoices</span>
        <span
          className="inline-flex min-h-12 items-center gap-2 border px-5"
          style={{ borderColor: t.outline, borderRadius: 999 }}
        >
          <Printer className="h-5 w-5" style={{ color: t.onSurfaceVariant }} />
          <span className={`${TYPE.label} font-medium`}>Print receipt</span>
        </span>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden px-8 py-6">
        {/* Hero: what the customer owes. */}
        <Card tokens={t} tone="primary">
          <div className="flex items-center gap-5">
            <span
              aria-hidden="true"
              className="flex h-14 w-14 items-center justify-center"
              style={{ background: t.primary, borderRadius: 16 }}
            >
              <FileText className="h-7 w-7" style={{ color: t.onPrimary }} />
            </span>
            <div>
              <Caption tokens={t}>Total bill</Caption>
              <p className={`${TYPE.metric} mt-1`} style={{ color: t.onPrimaryContainer }}>
                {inv.total}
              </p>
            </div>
            <Chip tokens={t} tone="warning" >
              {inv.status}
            </Chip>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card tokens={t}>
            <Caption tokens={t}>Invoice number</Caption>
            <p className={`${TYPE.section} mt-1.5`}>{inv.number}</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <Caption tokens={t}>Date</Caption>
                <p className={`${TYPE.body} mt-1`}>{inv.date}</p>
              </div>
              <div>
                <Caption tokens={t}>Due date</Caption>
                <p className={`${TYPE.body} mt-1`} style={{ color: t.onError }}>
                  {inv.dueDate}
                </p>
              </div>
            </div>
          </Card>

          <Card tokens={t}>
            <Caption tokens={t}>Billed to</Caption>
            <p className={`${TYPE.section} mt-1.5`}>{inv.customerName}</p>
            <p className={`${TYPE.label} mt-1 tabular-nums`} style={{ color: t.onSurfaceVariant }}>
              {inv.customerCode}
            </p>
            <p className={`${TYPE.label} tabular-nums`} style={{ color: t.onSurfaceVariant }}>
              {inv.customerPhone}
            </p>
            <p className={`${TYPE.label} mt-4`} style={{ color: t.onSurfaceVariant }}>
              Xendit digital payment
            </p>
          </Card>
        </div>

        <SectionCard tokens={t} title="Service details" className="min-h-0 flex-1">
          <Stack gap="sm">
            {inv.lineItems.map((item) => (
              <div
                key={item.description}
                className="flex items-center justify-between gap-4 px-4 py-3"
                style={{ background: t.surfaceHigh, borderRadius: 12 }}
              >
                <div>
                  <p className={`${TYPE.body} font-medium`}>{item.description}</p>
                  <p className={`${TYPE.label} tabular-nums`} style={{ color: t.onSurfaceVariant }}>
                    1 unit x {item.unitPrice}
                  </p>
                </div>
                <span className={`${TYPE.body} font-semibold tabular-nums`}>
                  {item.amount}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-2">
              <Caption tokens={t}>Subtotal</Caption>
              <span className={`${TYPE.body} tabular-nums`}>{inv.subtotal}</span>
            </div>
          </Stack>
        </SectionCard>
      </div>
    </div>
  );
}
