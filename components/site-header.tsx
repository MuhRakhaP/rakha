"use client";

import Link from "next/link";
import { Menu, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { site } from "@/lib/site";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

/**
 * Sections the home page scroll-spy highlights, in document order.
 *
 * `about` leads because it is the first section on the page after the hero; the
 * loop below takes the last section whose top has passed the spy line, so the
 * order of this array has to match the order of the sections in the DOM or the
 * underline will mark the wrong link.
 *
 * `skills` and `education` are absent deliberately: there is no route behind
 * those links, so highlighting anything for them would light up a nav item that
 * points somewhere else entirely.
 */
const SPY_SECTIONS = [
  { id: "about", href: "/about" },
  { id: "projects", href: "/projects" },
  { id: "experience", href: "/experience" },
];

const SPY_LINE = 160;
const HIDE_AFTER = 120;

export function SiteHeader() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const listRef = useRef<HTMLUListElement>(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0, on: false });
  const [spyHref, setSpyHref] = useState<string | null>(null);

  const routeHref = NAV.find(
    (item) =>
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
  )?.href;

  const activeHref = spyHref ?? routeHref;

  const measureUnderline = () => {
    const list = listRef.current;
    const item = list?.querySelector<HTMLElement>(`[data-href="${activeHref}"]`);
    if (!list || !item) {
      setUnderline((u) => ({ ...u, on: false }));
      return;
    }
    setUnderline({ left: item.offsetLeft, width: item.offsetWidth, on: true });
  };

  useLayoutEffect(measureUnderline, [activeHref]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const readSpy = () => {
      if (pathname !== "/") {
        setSpyHref(null);
        return;
      }
      let current: string | null = null;
      for (const section of SPY_SECTIONS) {
        const node = document.getElementById(section.id);
        if (!node) continue;
        if (node.getBoundingClientRect().top <= SPY_LINE) current = section.href;
      }
      setSpyHref(current);
    };

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const goingDown = y > lastY.current;

      if (navRef.current?.contains(document.activeElement)) {
        lastY.current = y;
        return;
      }

      setHidden(goingDown && y > HIDE_AFTER && !reduced.matches && !menuOpen);
      lastY.current = y;
      readSpy();
    };

    onScroll();
    measureUnderline();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measureUnderline);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureUnderline);
    };
    // `measureUnderline` is rebuilt whenever the active tab changes, and the
    // active tab is already a dependency, so re-running on it covers both.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, activeHref, menuOpen]);

  const linkClass = (on: boolean) =>
    `inline-flex min-h-11 items-center text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
      on ? "text-brand" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#21262D] bg-[#0A0E1A]/80 backdrop-blur transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
      style={hidden ? { transform: "translateY(-100%)" } : undefined}
      ref={navRef}
      data-scrolled={scrolled || undefined}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-x-4 gap-y-3 px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between gap-x-4 gap-y-3 w-full h-14 lg:h-16">
          <Link
            href="/"
            className="font-heading inline-flex min-h-11 items-center text-sm lg:text-base font-semibold tracking-tight transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none truncate max-w-[200px]"
          >
            {site.name}
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <div className="flex items-center gap-5">
              <ul ref={listRef} className="relative flex items-center gap-5">
                {NAV.map((item) => {
                  const on = item.href === activeHref;
                  return (
                    <li key={item.href} data-href={item.href}>
                      <Link
                        href={item.href}
                        aria-current={on ? "page" : undefined}
                        className={linkClass(on)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
                {underline.on ? (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 h-0.5 rounded-full bg-brand transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
                    style={{ left: underline.left, width: underline.width }}
                  />
                ) : null}
              </ul>

              <a
                href={`mailto:${site.email}`}
                className="glow-accent inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-[box-shadow,background-color] duration-300 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none motion-reduce:transition-none"
              >
                Let&apos;s Talk
              </a>
            </div>
          </nav>

          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-11 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Mail className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
                {/* The label stays in the accessibility tree below `sm`, where the
                    button beside it is all there is room for. Hiding it outright
                    left the link with no accessible name at all. */}
                <span className="sr-only sm:not-sr-only">Let&apos;s Talk</span>
              </a>
              <DialogTrigger
                render={
                  <button
                    type="button"
                    aria-expanded={menuOpen}
                    aria-controls="site-menu"
                    className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-card focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  />
                }
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Menu</span>
              </DialogTrigger>
            </div>

            {/* One Dialog root owns both the trigger and the panel, which is the
                only arrangement Base UI wires up: two roots sharing one `open`
                state would each render its own overlay and focus trap. */}
            <DialogContent className="sm:max-w-sm" id="site-menu">
              <DialogTitle className="sr-only">Site menu</DialogTitle>
              <nav aria-label="Mobile" className="flex flex-col">
                {NAV.map((item) => {
                  const on = item.href === activeHref;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={on ? "page" : undefined}
                      className={`${linkClass(on)} w-full border-b border-border/50 py-3 last:border-b-0`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <a
                  href={`mailto:${site.email}`}
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Mail className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
                  Email me
                </a>
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}