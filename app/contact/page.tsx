import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { SITE_URL, site } from "@/lib/site";

const description =
  `Get in touch with ${site.name} by email at ${site.email}, or on GitHub and LinkedIn.`;

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact · ${site.name}`,
    description,
    url: `${SITE_URL}/contact`,
  },
  twitter: { title: `Contact · ${site.name}`, description },
};

const CHANNELS = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, external: false },
  { label: "GitHub", value: "github.com/MuhRakhaP", href: site.github, external: true },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/muhammad-rakha-putra",
    href: site.linkedin,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-16 py-6">
      <Reveal>
        <header className="flex max-w-2xl flex-col gap-4">
          <h1 className="font-heading text-title font-semibold tracking-[-0.02em]">
            Let&apos;s Talk
          </h1>
          <p className="text-muted-foreground">
            Open to work on full-stack engineering, backend services, and
            business systems. Email is the fastest way to reach me.
          </p>
        </header>
      </Reveal>

      {/* Form left, direct channels right. The form is the primary route, so it
          gets the wider column and the channels act as the fallback for anyone
          who would rather open their own mail app. */}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal className="min-w-0">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-heading text-section font-semibold tracking-[-0.015em]">
              Send a message
            </h2>
            <p className="mt-2 mb-6 text-sm text-muted-foreground">
              Fill this in and it opens in your mail app, addressed to me.
            </p>
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={90} className="min-w-0">
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-section font-semibold tracking-[-0.015em]">
              Or reach me directly
            </h2>
            <ul className="flex flex-col gap-3">
              {CHANNELS.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target={channel.external ? "_blank" : undefined}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:translate-y-0.5 hover:border-brand hover:shadow-[0_8px_24px_-10px_var(--glow)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <span className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
                      {channel.label}
                    </span>
                    <span className="text-sm break-all">{channel.value}</span>
                    {channel.external && (
                      <span className="sr-only">(opens in a new tab)</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
