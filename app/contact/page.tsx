import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Muhammad Rakha Putra by email, GitHub, or LinkedIn.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    external: false,
  },
  {
    label: "GitHub",
    value: "github.com/MuhRakhaP",
    href: site.github,
    external: true,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/muhammad-rakha-putra",
    href: site.linkedin,
    external: true,
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-10 py-6">
      <header className="flex max-w-2xl flex-col gap-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Let&apos;s Talk
        </h1>
        <p className="text-muted-foreground">
          Open to work on full-stack engineering, backend services, and
          business systems. Email is the fastest way to reach me.
        </p>
      </header>

      <ul className="grid max-w-2xl gap-4">
        {CHANNELS.map((channel) => (
          <li key={channel.label}>
            <a
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noopener noreferrer" : undefined}
              className="flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {channel.label}
              </span>
              <span className="text-sm">{channel.value}</span>
              {channel.external && (
                <span className="sr-only">(opens in a new tab)</span>
              )}
            </a>
          </li>
        ))}

        {site.resumeUrl && (
          <li>
            <a
              href={site.resumeUrl}
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "w-full justify-center",
              })}
            >
              Download Resume
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}