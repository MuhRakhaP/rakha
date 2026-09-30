import { site } from "@/lib/site";

const CONTACT = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "GitHub", value: "github.com/MuhRakhaP", href: site.github },
  { label: "LinkedIn", value: "linkedin.com", href: site.linkedin },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {site.name} — {site.role}
        </p>

        <ul className="flex flex-wrap items-center gap-4">
          {CONTACT.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"
                }
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {item.label}
                {item.href.startsWith("mailto:") && (
                  <span className="sr-only"> — {item.value}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
