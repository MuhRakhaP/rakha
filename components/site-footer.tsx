import { FooterAurora } from "@/components/background-layers";
import { site } from "@/lib/site";

/**
 * Text labels, no brand glyphs. lucide v1 dropped its brand marks, and standing
 * a generic icon in for GitHub or LinkedIn would say less than the word does.
 */
const CONTACT = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "Phone", value: site.phone, href: site.phoneHref },
  { label: "GitHub", value: "github.com/MuhRakhaP", href: site.github },
  { label: "LinkedIn", value: "linkedin.com", href: site.linkedin },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-section overflow-hidden border-t border-border py-10">
      <FooterAurora />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-heading text-base font-semibold tracking-tight">
            {site.name}
          </p>
          <p className="text-sm text-muted-foreground">{site.role}</p>
        </div>

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {CONTACT.map((item) => {
            const external = !item.href.startsWith("mailto:");
            return (
              <li key={item.label}>
                <a
                  href={item.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="inline-flex min-h-11 items-center text-base text-muted-foreground underline-offset-4 transition-colors hover:text-brand hover:underline hover:decoration-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {item.label}
                  <span className="sr-only">
                    : {item.value}
                    {external ? " (opens in a new tab)" : ""}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Rendered from the clock rather than written out, so a page left alone
          for a year does not claim to have been written in the year it was
          built. `text-sm`: the footer was the smallest text on the site at
          `text-xs`, which is a poor place to be least readable. */}
      <p className="relative mt-6 text-sm text-muted-foreground">
        &copy; {year} {site.name}. Built with Next.js and Tailwind CSS.
      </p>
    </footer>
  );
}