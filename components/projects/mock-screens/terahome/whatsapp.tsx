import { RefreshCcw, WifiOff } from "lucide-react";

import {
  Caption,
  Card,
  Chip,
  SectionCard,
  Stack,
} from "../primitives";
import { TYPE, tokensFor } from "../tokens";

/**
 * TERAHOME notification centre, authored at 1280x800.
 *
 * The capture environment blocks all outbound traffic, so a live capture would
 * have shown a misleading provider error. This layout is read from
 * `D:\terahome\apps\isp\app\(dashboard)\whatsapp\page.tsx`: the heading with a
 * refresh button and a connection pill, sender credentials, the common
 * variables, a template, and the message log.
 *
 * The pill reads disconnected and the log rows are invented, because no provider
 * was contacted and nothing here should look like a real delivery record.
 */
export function TerahomeWhatsApp() {
  const t = tokensFor("terahome");

  const variables = [
    ["$_FULLNAME", "Customer name"],
    ["$_INVOICE", "Invoice number"],
    ["$_TOTALBILL", "Total bill"],
    ["$_DUEDATE", "Due date"],
  ];

  const logs = [
    { status: "SENT", tone: "success" as const, who: "Kedai Contoh" },
    { status: "QUEUED", tone: "warning" as const, who: "Warung Contoh" },
    { status: "FAILED", tone: "error" as const, who: "Kafe Contoh" },
  ];

  return (
    <div
      className="flex h-full min-h-0 flex-col"
      style={{ background: t.background, color: t.onSurface }}
    >
      <header
        className="flex shrink-0 items-center justify-between gap-6 border-b px-8 py-5"
        style={{ borderColor: t.outline, background: t.surface }}
      >
        <div>
          <h3 className={TYPE.title}>Notification center</h3>
          <p className={`${TYPE.body} mt-1`} style={{ color: t.onSurfaceVariant }}>
            Manage automated WhatsApp alerts and track delivery status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex min-h-12 items-center gap-2 border px-5"
            style={{ borderColor: t.outline, borderRadius: 999 }}
          >
            <RefreshCcw className="h-5 w-5" style={{ color: t.onSurfaceVariant }} />
            <span className={`${TYPE.label} font-medium`}>Refresh logs</span>
          </span>
          <Chip tokens={t} tone="error">
            <WifiOff className="h-4 w-4" />
            Disconnected
          </Chip>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-6 overflow-hidden px-8 py-6">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Hero: what actually happened. */}
          <SectionCard tokens={t} title="Message log" className="min-h-0 flex-1">
            <ul className="flex flex-col gap-3">
              {logs.map((row) => (
                <li
                  key={row.who}
                  className="flex items-center gap-4 px-4 py-3"
                  style={{ background: t.surfaceHigh, borderRadius: 12 }}
                >
                  <Chip tokens={t} tone={row.tone}>
                    {row.status}
                  </Chip>
                  <span className={`${TYPE.body} min-w-0 flex-1`}>{row.who}</span>
                  <Caption tokens={t}>Payment reminder</Caption>
                  <span className={`${TYPE.label} tabular-nums`} style={{ color: t.onSurfaceVariant }}>
                    02 Oct 09:12
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div className="flex w-[22rem] shrink-0 flex-col gap-6">
          <Card tokens={t}>
            <Caption tokens={t}>Sender number</Caption>
            <Stack gap="sm" className="mt-3">
              {["API endpoint", "API token", "Sender phone"].map((field) => (
                <div key={field}>
                  <Caption tokens={t}>{field}</Caption>
                  <p className={`${TYPE.body} mt-1`} style={{ color: t.onSurfaceVariant }}>
                    Not set
                  </p>
                </div>
              ))}
            </Stack>
          </Card>

          <Card tokens={t}>
            <Caption tokens={t}>Common variables</Caption>
            <ul className="mt-3 flex flex-col gap-2">
              {variables.map(([token, description]) => (
                <li key={token} className="flex items-center gap-3">
                  <code
                    className={`${TYPE.label} rounded px-2 py-1 font-mono`}
                    style={{ background: t.neutral, color: t.onNeutral }}
                  >
                    {token}
                  </code>
                  <span className={`${TYPE.label}`} style={{ color: t.onSurfaceVariant }}>
                    {description}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}