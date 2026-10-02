import { cn } from "cn";
import { RefreshCcw, WifiOff } from "lucide-react";

import {
  Card,
  Caption,
  Chip,
  Field,
  SectionCard,
  Stack,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * TERAHOME WhatsApp notification centre — a screen with no capture.
 *
 * The capture environment blocks all outbound traffic, so a live capture would
 * have shown a misleading provider error. This layout is read from
 * `D:\terahome\apps\isp\app\(dashboard)\whatsapp\page.tsx` instead.
 *
 * Order preserved from the source: the "Notification Center" heading with a
 * refresh button and a connection pill, then sender credentials, the common
 * variables, a template, and finally the Message Logs table whose columns are
 * STATUS, RECIPIENT, MESSAGE CONTENT and SENT AT.
 *
 * The pill reads disconnected and the log rows are invented, because no provider
 * was contacted and nothing here should look like a real delivery record.
 */
export function TerahomeWhatsApp() {
  const t = tokensFor("terahome");

  const variables = [
    ["$_FULLNAME", "Customer full name"],
    ["$_CUSTOMERID", "Customer ID/Code"],
    ["$_PLAN", "Service package"],
    ["$_INVOICE", "Invoice number"],
    ["$_TOTALBILL", "Total bill (IDR)"],
    ["$_DUEDATE", "Due date"],
    ["$_PAYMENTLINK", "Payment link (masked)"],
  ];

  const logs = [
    { status: "SENT", tone: "success" as const, recipient: "Kedai Contoh", at: "02 Oct 09:12" },
    { status: "QUEUED", tone: "warning" as const, recipient: "Warung Contoh", at: "02 Oct 09:14" },
    { status: "FAILED", tone: "error" as const, recipient: "Kafe Contoh", at: "02 Oct 09:15" },
  ];

  return (
    <div
      className="flex h-full min-h-0 flex-col"
      style={{ background: t.background, color: t.onSurface }}
    >
      <header
        className="flex shrink-0 flex-wrap items-start justify-between gap-3 border-b px-4 py-3"
        style={{ borderColor: t.outline, background: t.surface }}
      >
        <div className="min-w-0">
          <h3 className={cn(TYPE.title, "font-semibold")}>Notification Center</h3>
          <p className={cn(TYPE.body, "mt-1")} style={{ color: t.onSurfaceVariant }}>
            Manage automated WhatsApp alerts and track message delivery status.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="inline-flex min-h-11 items-center gap-2 border px-3"
            style={{ borderColor: t.outline, borderRadius: 999 }}
          >
            <RefreshCcw className="h-5 w-5" style={{ color: t.onSurfaceVariant }} />
            <span className={cn(TYPE.label, "font-medium")}>Refresh logs</span>
          </span>
          <Chip tokens={t} tone="error">
            <WifiOff className="h-4 w-4" />
            WA API disconnected
          </Chip>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto grid max-w-3xl gap-4">
          <Card tokens={t}>
            <Caption tokens={t}>Sender Number</Caption>
            <p className={cn(TYPE.body, "mt-1")} style={{ color: t.onSurfaceVariant }}>
              Configure MPWA/Fonnte credentials here.
            </p>
            <Stack gap="sm" className="mt-3">
              <Field tokens={t} label="API Endpoint URL" value="Not configured" />
              <Field tokens={t} label="API Token" value="Not configured" />
              <Field
                tokens={t}
                label="Sender Phone Number (MPWA)"
                value="Not configured"
              />
            </Stack>
          </Card>

          <Card tokens={t}>
            <Caption tokens={t}>Common Variables</Caption>
            <ul className="mt-3 flex flex-col gap-2">
              {variables.map(([token, description]) => (
                <li key={token} className="flex min-w-0 items-baseline gap-2">
                  <code
                    className={cn(TYPE.label, "shrink-0 rounded px-1.5 py-0.5 font-mono")}
                    style={{ background: t.neutral, color: t.onNeutral }}
                  >
                    {token}
                  </code>
                  <span className={cn(TYPE.label, "truncate")} style={{ color: t.onSurfaceVariant }}>
                    {description}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card tokens={t}>
            <Caption tokens={t}>Payment Reminder</Caption>
            <p className={cn(TYPE.body, "mt-3")}>
              Halo $_FULLNAME, tagihan $_INVOICE sebesar $_TOTALBILL jatuh tempo
              $_DUEDATE.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className="inline-flex min-h-11 items-center px-4 font-semibold"
                style={{ background: t.primary, color: t.onPrimary, borderRadius: 999 }}
              >
                <span className={TYPE.label}>Save</span>
              </span>
              <span
                className="inline-flex min-h-11 items-center px-4 font-semibold"
                style={{ border: `1px solid ${t.outline}`, borderRadius: 999 }}
              >
                <span className={TYPE.label}>Cancel</span>
              </span>
            </div>
          </Card>
        </div>

        <SectionCard tokens={t} title="Message Logs" className="mx-auto mt-4 max-w-3xl">
          <ul className="flex flex-col gap-3">
            {logs.map((row) => (
              <li key={row.at} className="flex flex-wrap items-center gap-3">
                <Chip tokens={t} tone={row.tone}>
                  {row.status}
                </Chip>
                <span className={cn(TYPE.body, "min-w-0 flex-1 truncate")}>
                  {row.recipient}
                </span>
                <span className={cn(TYPE.label, "shrink-0")} style={{ color: t.onSurfaceVariant }}>
                  Payment Reminder
                </span>
                <span className={cn(TYPE.label, "shrink-0 tabular-nums")} style={{ color: t.onSurfaceVariant }}>
                  {row.at}
                </span>
              </li>
            ))}
          </ul>
          <p className={cn(TYPE.label, "mt-3")} style={{ color: t.onSurfaceVariant }}>
            Rows are illustrative. No provider was contacted, so nothing here is a
            real delivery record.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}