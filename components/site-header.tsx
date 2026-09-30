import Link from "next/link";

import { site } from "@/lib/site";

const NAV = [
  { href: "/projects", label: "Projects" },
  // TODO(Phase B): add About, Experience, Contact once those pages exist
];

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border py-5">
      <Link
        href="/"
        className="font-heading text-sm font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {site.name}
      </Link>

      <nav aria-label="Main">
        <ul className="flex items-center gap-5">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
