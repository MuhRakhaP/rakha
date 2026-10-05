import type { Metadata } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";

import { BackToTop } from "@/components/back-to-top";
import { BackgroundLayers } from "@/components/background-layers";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_URL, site } from "@/lib/site";

import "./globals.css";

/**
 * Two text faces, because the site does two jobs with type.
 *
 * Inter is chosen over the previous Geist for one reason: at these sizes on a
 * dark ground, Inter's wider counters and taller x-height hold up better in the
 * muted grey the body copy uses, where a text cut with small counters starts to
 * grey out. Both ship through next/font, so there is no layout shift and no
 * render-blocking request to a third party.
 *
 * Archivo carries the display end, the name in the hero and every section
 * title. It was picked against Inter rather than by default: a neo-grotesque
 * with closed apertures and a tall cap height keeps its edges at 40 to 56px on a
 * near-black ground, where a lighter cut starts to look blurred. It is not a
 * second body face, so no paragraph anywhere uses it.
 */
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} · ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description:
    "Full Stack Developer building multi-tenant SaaS platforms, full-stack web applications, backend services, REST APIs, business systems, and automation.",
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} · ${site.role}`,
    description:
      "Full Stack Developer building multi-tenant SaaS platforms, full-stack web applications, backend services, REST APIs, business systems, and automation.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-dvh antialiased">
        <noscript>
          {/* Reveal starts hidden and needs JS to unhide. Without JS, show it. */}
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <BackgroundLayers />
        {/* Header sits outside the page container so its background and border
            run the full width of the viewport instead of stopping at the
            content edge, which read as a floating dark box. */}
        <SiteHeader />
        <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col px-5 sm:px-8 lg:px-10">
          {/* Programmatic focus target only · suppress the global outline so
              it does not draw a box around the whole page after a skip. */}
          {/* No `pt` for the header: it is `sticky`, which is in flow, so it
              already takes its own height out of the document. */}
          <main id="main" tabIndex={-1} className="flex-1 py-10 outline-none">
            {children}
          </main>
          <SiteFooter />
        </div>
        <BackToTop />
      </body>
    </html>
  );
}
