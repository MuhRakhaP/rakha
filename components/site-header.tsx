import Link from "next/link";

import { site } from "@/lib/site";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-border py-5">
      <Link
        href="/"
        className="font-heading text-sm font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {site.name}
      </Link>

      <nav aria-label="Main" className="flex flex-wrap items-center gap-4 sm:gap-5">
        <ul className="flex items-center gap-4 sm:gap-5">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <a
          href={`mailto:${site.email}`}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-brand hover:bg-brand-weak hover:text-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Let&apos;s Talk
        </a>
      </nav>
    </header>
  );
}
