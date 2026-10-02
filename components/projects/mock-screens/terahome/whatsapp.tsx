import {
  BrowserScreen,
  DataRows,
  MicroLabel,
  Pill,
  Stack,
} from "../primitives";

/**
 * TERAHOME WhatsApp notification centre — a screen with no capture.
 *
 * The capture environment blocks all outbound traffic, so a live capture of
 * this page would have shown a misleading provider error. The layout below is
 * read from
 * `D:\terahome\apps\isp\app\(dashboard)\whatsapp\page.tsx` instead.
 *
 * Order preserved from the source: the "Notification Center" heading with a
 * refresh button and a connection pill, then a sender-credentials card, a
 * common-variables card, per-template cards, and finally the Message Logs table
 * whose columns are STATUS, RECIPIENT, MESSAGE CONTENT and SENT AT.
 *
 * The connection pill deliberately reads disconnected, and the log rows are
 * invented: no provider was ever contacted, so nothing here claims a message
 * was delivered.
 */
export function TerahomeWhatsApp() {
  return (
    <BrowserScreen>
      <div className="flex items-start justify-between gap-4 border-b border-border bg-muted/40 px-3 py-2.5">
        <div>
          <h3 className="text-sm font-bold tracking-tight">Notification Center</h3>
          <p className="mt-0.5 text-[0.625rem] text-muted-foreground">
            Manage automated WhatsApp alerts and track message delivery status.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-md border border-border bg-card px-2 py-1 text-[0.5rem] font-bold tracking-[0.08em] uppercase">
            Refresh Logs
          </span>
          <Pill tone="bad">WA API: Disconnected</Pill>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Sender credentials card. */}
          <section className="rounded-lg border border-border bg-card p-2.5 sm:col-span-1">
            <MicroLabel>Sender Number</MicroLabel>
            <p className="mt-1 text-[0.5625rem] text-muted-foreground">
              Configure MPWA/Fonnte credentials here.
            </p>
            <Stack gap="sm" className="mt-2">
              <label className="flex flex-col gap-0.5">
                <MicroLabel>API Endpoint URL</MicroLabel>
                <span className="rounded border border-border bg-muted/50 px-1.5 py-1 text-[0.5625rem] text-muted-foreground">
                  Not configured
                </span>
              </label>
              <label className="flex flex-col gap-0.5">
                <MicroLabel>API Token</MicroLabel>
                <span className="rounded border border-border bg-muted/50 px-1.5 py-1 text-[0.5625rem] text-muted-foreground">
                  Not configured
                </span>
              </label>
              <label className="flex flex-col gap-0.5">
                <MicroLabel>Sender Phone Number (MPWA)</MicroLabel>
                <span className="rounded border border-border bg-muted/50 px-1.5 py-1 text-[0.5625rem] text-muted-foreground">
                  Not configured
                </span>
              </label>
            </Stack>
          </section>

          {/* Common variables card. */}
          <section className="rounded-lg border border-border bg-card p-2.5 sm:col-span-1">
            <MicroLabel>Common Variables</MicroLabel>
            <ul className="mt-1.5 flex flex-col gap-1">
              {[
                ["$_FULLNAME", "Customer full name"],
                ["$_CUSTOMERID", "Customer ID/Code"],
                ["$_PLAN", "Service package subscribed"],
                ["$_INVOICE", "Invoice number"],
                ["$_TOTALBILL", "Total bill amount (IDR)"],
                ["$_DUEDATE", "Due date"],
                ["$_PAYMENTLINK", "Payment link (Masked)"],
              ].map(([token, desc]) => (
                <li key={token} className="flex items-baseline gap-1.5">
                  <code className="rounded bg-muted px-1 py-px font-mono text-[0.5rem]">
                    {token}
                  </code>
                  <span className="truncate text-[0.5rem] text-muted-foreground">
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Template card. */}
          <section className="rounded-lg border border-border bg-card p-2.5 sm:col-span-1">
            <MicroLabel>Payment Reminder</MicroLabel>
            <p className="mt-1 rounded border border-border bg-muted/50 px-1.5 py-1.5 text-[0.5rem] leading-snug">
              Halo $_FULLNAME, tagihan $_INVOICE sebesar $_TOTALBILL jatuh tempo
              $_DUEDATE.
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="rounded-md bg-brand px-2 py-1 text-[0.5rem] font-semibold tracking-[0.06em] text-background uppercase">
                Save
              </span>
              <span className="rounded-md border border-border px-2 py-1 text-[0.5rem] font-semibold tracking-[0.06em] uppercase">
                Cancel
              </span>
            </div>
          </section>
        </div>

        {/* Message logs. */}
        <section className="mt-3 rounded-lg border border-border bg-card p-2.5">
          <MicroLabel>Message Logs</MicroLabel>
          <div className="mt-1.5">
            <DataRows
              head={["STATUS", "RECIPIENT", "MESSAGE CONTENT", "SENT AT"]}
              rows={[
                [
                  <Pill key="s1" tone="good">
                    SENT
                  </Pill>,
                  "Kedai Contoh",
                  "Payment Reminder",
                  "02 Oct 09:12",
                ],
                [
                  <Pill key="s2" tone="warn">
                    QUEUED
                  </Pill>,
                  "Warung Contoh",
                  "Payment Reminder",
                  "02 Oct 09:14",
                ],
                [
                  <Pill key="s3" tone="bad">
                    FAILED
                  </Pill>,
                  "Kafe Contoh",
                  "Payment Reminder",
                  "02 Oct 09:15",
                ],
              ]}
            />
          </div>
          <p className="mt-2 text-[0.5rem] text-muted-foreground">
            Rows are illustrative. No provider was contacted, so nothing here is
            a real delivery record.
          </p>
        </section>
      </div>
    </BrowserScreen>
  );
}