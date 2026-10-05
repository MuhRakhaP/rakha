"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

/**
 * A contact form that hands the message to the visitor's own mail client.
 *
 * There is no backend and no form service on this site, so this does the one
 * thing that is genuinely available without inventing infrastructure: it
 * composes a real RFC 6068 mailto and opens it. That is a real outcome, not a
 * fake success state, which is why there is no "sent" message here to be
 * dishonest about.
 *
 * Validation is the browser's own, plus a check that stops an empty body from
 * producing a blank email. Errors are text next to the field, not a colour and
 * a shake, because a shake tells a screen reader nothing.
 */
export function ContactForm() {
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!message) {
      event.preventDefault();
      setError("Add a message so there is something to send.");
      form.querySelector<HTMLTextAreaElement>("#message")?.focus();
      return;
    }

    setError(null);
    const subject = `Portfolio enquiry from ${name || "a visitor"}`;
    const body = `${message}\n\nFrom: ${name || "not given"}\nReply to: ${email || "not given"}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  // Two deliberate departures from the rest of the type here.
  // `border-control-border` rather than `border-input`: an empty text field is
  // the one control a visitor has to find before they can do anything, and
  // --input sits at 1.27 against the background. See the note on the token.
  // `text-base sm:text-sm`: iOS Safari zooms the page on focus for any input
  // under 16px and does not zoom back out, so the field is 16px on a phone and
  // matches body copy from the sm breakpoint up.
  const field =
    "w-full rounded-lg border border-control-border bg-card px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:text-sm";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className={field}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={field}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="What are you building?"
          aria-describedby={error ? "message-error" : undefined}
          aria-invalid={error ? true : undefined}
          className={field}
        />
      </div>

      {error ? (
        <p id="message-error" role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="glow" size="xl">
          Open in mail app
        </Button>
        <p className="text-xs text-muted-foreground">
          Opens your mail app addressed to {site.email}.
        </p>
      </div>
    </form>
  );
}
