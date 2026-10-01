/**
 * Visual + accessibility + layout regression harness.
 *
 * Starts `next start` on a fixed port, measures every route at five widths,
 * and reports:
 *   - horizontal overflow at every width (not just 390)
 *   - axe-core colour-contrast violations
 *   - case study layout: content column width, nav/content relationship
 *   - exactly one ClosingCta, positioned below More Projects
 *   - case study section order in the DOM
 *   - SectionNav anchor targets resolve
 *   - mojibake in rendered HTML or visible text
 *
 * The server is always torn down: try/finally covers thrown errors, signal
 * handlers cover Ctrl+C, and on Windows the whole process tree is killed.
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import { createServer } from "node:net";
import path from "node:path";
import process from "node:process";

import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const PORT = 3111;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT_DIR = path.resolve("screenshots-web");
const BUILD_ID = path.resolve(".next", "BUILD_ID");

const CASE_STUDY_SLUGS = [
  "terahome",
  "thinkpos",
  "clockora",
  "kopiflow",
  "ai-helpdesk-assistant",
  "outstanding-delivery-automation",
];

const STATIC_PAGES = [
  { path: "/", name: "home" },
  { path: "/projects", name: "projects" },
  { path: "/about", name: "about" },
  { path: "/experience", name: "experience" },
  { path: "/contact", name: "contact" },
];

const PAGES = [
  ...STATIC_PAGES,
  ...CASE_STUDY_SLUGS.map((slug) => ({
    path: `/projects/${slug}`,
    name: `project-${slug}`,
    caseStudy: true,
  })),
];

const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 900 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

/**
 * Required case study section order. Titles are the <h2> text rendered by the
 * Section component. "Key Features" is the heading for the features section.
 * A section that is omitted for a project is skipped, never reordered.
 */
const SECTION_ORDER = [
  "Overview",
  "Problem",
  "Solution",
  "Key Features",
  "Tech Stack",
  "My Contribution",
  "Architecture",
  "Engineering Decisions",
  "Challenges",
  "Results",
  "Gallery",
  "More Projects",
];

const MOJIBAKE = [
  { label: "â€", pat: "â€" },
  { label: "Ã", pat: "Ã" },
  { label: "Â", pat: "Â" },
  { label: "U+FFFD", pat: "�" },
];

const isWindows = process.platform === "win32";
const report = [];
const rows = [];
let failures = 0;
let server = null;
let shuttingDown = false;

function record(route, width, check, ok, detail = "") {
  if (!ok) failures++;
  rows.push({ route, width, check, ok, detail });
}

/** Is anything still listening on the port? */
function portInUse(port) {
  return new Promise((resolve) => {
    const socket = createServer();
    socket.once("error", () => resolve(true));
    socket.once("listening", () => socket.close(() => resolve(false)));
    socket.listen(port, "127.0.0.1");
  });
}

/** Kill the child, and on Windows the whole tree it spawned. */
function killTree(pid) {
  if (!pid) return;
  try {
    if (isWindows) {
      spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], {
        stdio: "ignore",
      });
    } else {
      process.kill(-pid, "SIGKILL");
    }
  } catch {
    /* already gone */
  }
}

async function stopServer() {
  if (!server || server.exitCode !== null) {
    server = null;
    return;
  }
  const { pid } = server;
  killTree(pid);
  try {
    await Promise.race([
      new Promise((resolve) => server.once("exit", resolve)),
      delay(5000),
    ]);
  } catch {
    /* ignore */
  }
  server = null;
  killTree(pid);
}

async function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  await stopServer();

  const leftover = await portInUse(PORT);
  if (leftover) {
    console.error(
      `\nFATAL: something is still listening on port ${PORT}. Kill it manually.`,
    );
  } else {
    console.log(`\nPort ${PORT} released — no leftover server.`);
  }

  writeFileSync(
    path.join(OUT_DIR, "report.txt"),
    report.join("\n") + "\n",
    "utf8",
  );
  process.exit(leftover ? 1 : code);
}

process.on("SIGINT", () => shutdown(130));
process.on("SIGTERM", () => shutdown(143));
process.on("uncaughtException", async (err) => {
  console.error(err);
  await shutdown(1);
});

async function waitForServer(timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (server && server.exitCode !== null) {
      throw new Error(`next start exited early with code ${server.exitCode}`);
    }
    try {
      const res = await fetch(BASE, { signal: AbortSignal.timeout(4000) });
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await delay(500);
  }
  throw new Error(`server did not respond on ${PORT} within ${timeoutMs}ms`);
}

/** Elements wider than the viewport, i.e. what causes the overflow. */
async function findOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const overflow = doc.scrollWidth - doc.clientWidth;
    if (overflow <= 1) return { overflow: 0, offenders: [] };

    const limit = doc.clientWidth + 1;
    const offenders = [];
    for (const el of document.body.querySelectorAll("*")) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      if (rect.right > limit || rect.left < -1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.getAttribute("class") ?? "").slice(0, 70),
          right: Math.round(rect.right),
        });
      }
      if (offenders.length >= 6) break;
    }
    return { overflow, offenders };
  });
}

/**
 * Case study layout measurement.
 *
 * The content column is found structurally rather than by test id: it is the
 * element that is a sibling of the nav, is not the nav, and contains the
 * Overview section. This keeps the check honest against the real DOM.
 */
async function measureCaseStudy(page) {
  return page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="Case study sections"]');

    // Content column: sibling of the nav that owns the #overview section.
    let content = null;
    if (nav && nav.parentElement) {
      for (const sib of nav.parentElement.children) {
        if (sib === nav) continue;
        if (sib.querySelector && sib.querySelector("#overview")) {
          content = sib;
          break;
        }
      }
    }

    const grid = nav && nav.parentElement ? nav.parentElement : null;

    const navRect = nav ? nav.getBoundingClientRect() : null;
    const contentRect = content ? content.getBoundingClientRect() : null;
    const gridRect = grid ? grid.getBoundingClientRect() : null;

    // More Projects bottom, in document coordinates.
    const more = document.getElementById("more");
    const moreRect = more ? more.getBoundingClientRect() : null;

    // ClosingCta: heading text match, independent of any test id.
    const ctaHeading = Array.from(document.querySelectorAll("h2")).find(
      (h) => h.textContent.trim() === "Interested in working together?",
    );
    const ctaSection = ctaHeading ? ctaHeading.closest("section") : null;
    const ctaRect = ctaSection ? ctaSection.getBoundingClientRect() : null;

    // Section headings, in DOM order.
    const headings = Array.from(document.querySelectorAll("h2"))
      .map((h) => h.textContent.trim())
      .filter((t) => t.length > 0);

    // Nav anchors and whether their targets exist.
    const navLinks = nav
      ? Array.from(nav.querySelectorAll("a")).map((a) => {
          const href = a.getAttribute("href") ?? "";
          const id = href.startsWith("#") ? href.slice(1) : "";
          return { href, exists: id ? !!document.getElementById(id) : false };
        })
      : [];

    return {
      hasNav: !!nav,
      hasContent: !!content,
      navRect: navRect
        ? {
            left: Math.round(navRect.left),
            right: Math.round(navRect.right),
            width: Math.round(navRect.width),
          }
        : null,
      contentRect: contentRect
        ? {
            left: Math.round(contentRect.left),
            right: Math.round(contentRect.right),
            width: Math.round(contentRect.width),
          }
        : null,
      gridWidth: gridRect ? Math.round(gridRect.width) : null,
      moreBottom: moreRect
        ? Math.round(moreRect.bottom + window.scrollY)
        : null,
      ctaCount: document.querySelectorAll('[data-testid="closing-cta"]').length,
      ctaHeadingCount: document.querySelectorAll("h2").length
        ? Array.from(document.querySelectorAll("h2")).filter(
            (h) => h.textContent.trim() === "Interested in working together?",
          ).length
        : 0,
      ctaTop: ctaRect ? Math.round(ctaRect.top + window.scrollY) : null,
      headings,
      navLinks,
    };
  });
}

/**
 * Scroll the whole page once so IntersectionObserver reveals fire.
 * Without this, axe skips anything still at opacity-0 inside a <Reveal>
 * and reports a false pass on the sections below the fold.
 */
async function settleReveals(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 120));
  });
  await page.waitForTimeout(200);
}

async function main() {
  if (!existsSync(BUILD_ID)) {
    console.error(
      `No production build found at ${BUILD_ID}.\n` +
        `Run "pnpm build" before "pnpm visual-check".`,
    );
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  if (await portInUse(PORT)) {
    console.error(`Port ${PORT} is already in use. Stop that process first.`);
    process.exit(1);
  }

  console.log(`Starting "next start" on port ${PORT}…`);
  server = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    detached: !isWindows,
  });

  try {
    await waitForServer();
    console.log("Server is up.\n");

    const browser = await chromium.launch();

    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
      });

      for (const target of PAGES) {
        const page = await context.newPage();

        const res = await page.goto(BASE + target.path, {
          waitUntil: "networkidle",
          timeout: 30_000,
        });
        const status = res ? res.status() : 0;
        record(target.path, viewport.name, "http-200", status === 200, `got ${status}`);

        await page.waitForTimeout(250);

        // (d) Horizontal overflow at EVERY width.
        const { overflow, offenders } = await findOverflow(page);
        record(
          target.path,
          viewport.name,
          "no-overflow",
          overflow <= 1,
          overflow > 1 ? `+${overflow}px` : "",
        );
        if (overflow > 1) {
          for (const o of offenders) {
            report.push(`    offender <${o.tag}> right=${o.right} .${o.cls}`);
          }
        }

        // (e) charset meta + html lang in the rendered head.
        const headInfo = await page.evaluate(() => {
          const meta = document.querySelector("meta[charset]");
          const httpEquiv = document.querySelector(
            'meta[http-equiv="Content-Type" i]',
          );
          return {
            lang: document.documentElement.getAttribute("lang") ?? "",
            charset: (meta?.getAttribute("charset") ?? "").toLowerCase(),
            httpEquiv: (httpEquiv?.getAttribute("content") ?? "").toLowerCase(),
          };
        });
        const hasCharset =
          headInfo.charset === "utf-8" ||
          headInfo.httpEquiv.includes("utf-8");
        record(
          target.path,
          viewport.name,
          "head-charset-utf8",
          hasCharset,
          `charset=${headInfo.charset || "-"} equiv=${headInfo.httpEquiv || "-"}`,
        );
        record(
          target.path,
          viewport.name,
          "html-lang-en",
          headInfo.lang.toLowerCase() === "en",
          `lang=${headInfo.lang || "(none)"}`,
        );

        // (e) Mojibake in visible text and in the served HTML.
        const textAndHtml = await page.evaluate(() => {
          const html = document.documentElement.outerHTML;
          return { text: document.body.innerText || "", html };
        });
        for (const m of MOJIBAKE) {
          const inText = textAndHtml.text.includes(m.pat);
          const inHtml = textAndHtml.html.includes(m.pat);
          record(
            target.path,
            viewport.name,
            `no-mojibake-${m.label}`,
            !inText && !inHtml,
            inText ? "in text" : inHtml ? "in html" : "",
          );
        }

        if (target.caseStudy) {
          const m = await measureCaseStudy(page);

          // (a) Content column geometry at >= 1024px.
          if (viewport.width >= 1024) {
            const okWidth =
              m.hasContent &&
              m.contentRect.width >= 600 &&
              m.gridWidth > 0 &&
              m.contentRect.width >= 0.55 * m.gridWidth;
            record(
              target.path,
              viewport.name,
              "content-col-geometry",
              okWidth,
              m.hasContent
                ? `content=${m.contentRect.width}px grid=${m.gridWidth}px ratio=${
                    m.gridWidth ? (m.contentRect.width / m.gridWidth).toFixed(2) : "n/a"
                  }`
                : "no content column found",
            );

            const toRight =
              m.hasNav &&
              m.hasContent &&
              m.contentRect.left >= m.navRect.right;
            record(
              target.path,
              viewport.name,
              "content-right-of-nav",
              toRight,
              `nav.right=${m.navRect?.right} content.left=${m.contentRect?.left}`,
            );

            const noOverlap =
              m.hasNav &&
              m.hasContent &&
              m.contentRect.left >= m.navRect.left &&
              m.contentRect.right > m.navRect.right;
            record(
              target.path,
              viewport.name,
              "no-nav-overlap",
              noOverlap,
              `content.left=${m.contentRect?.left} nav.left=${m.navRect?.left}`,
            );
          } else {
            // Mobile/tablet: nav must not consume horizontal space.
            const hidden = m.hasNav ? m.navRect.width === 0 : true;
            record(
              target.path,
              viewport.name,
              "nav-no-horizontal-space",
              hidden,
              m.hasNav ? `nav width=${m.navRect.width}px` : "nav absent",
            );
          }

          // (b) Exactly one ClosingCta, below More Projects.
          record(
            target.path,
            viewport.name,
            "closing-cta-once",
            m.ctaCount === 1 && m.ctaHeadingCount === 1,
            `testid=${m.ctaCount} heading=${m.ctaHeadingCount}`,
          );

          if (m.moreBottom !== null && m.ctaTop !== null) {
            record(
              target.path,
              viewport.name,
              "closing-cta-below-more",
              m.ctaTop > m.moreBottom,
              `cta.top=${m.ctaTop} more.bottom=${m.moreBottom}`,
            );
          } else {
            record(
              target.path,
              viewport.name,
              "closing-cta-below-more",
              false,
              "More Projects or ClosingCta not measurable",
            );
          }

          // (c) Section order.
          const observed = m.headings.filter((h) => SECTION_ORDER.includes(h));
          let orderOk = observed.length > 0;
          let cursor = -1;
          const seen = new Set();
          for (const h of observed) {
            const idx = SECTION_ORDER.indexOf(h);
            if (idx <= cursor || seen.has(h)) {
              orderOk = false;
              break;
            }
            cursor = idx;
            seen.add(h);
          }
          record(
            target.path,
            viewport.name,
            "section-order",
            orderOk,
            orderOk ? observed.join(" > ") : observed.join(" > "),
          );

          // (f) SectionNav anchors resolve.
          const brokenLinks = m.navLinks.filter((l) => !l.exists);
          record(
            target.path,
            viewport.name,
            "nav-anchors-exist",
            m.navLinks.length === 0 ? true : brokenLinks.length === 0,
            brokenLinks.length ? `broken: ${brokenLinks.map((l) => l.href).join(",")}` : "",
          );
        }

        await page.screenshot({
          path: path.join(OUT_DIR, `${target.name}-${viewport.name}.png`),
          fullPage: true,
        });

        // Contrast at BOTH ends of the range — text wrapping differs, and the
        // below-the-fold reveals must be visible before axe will look.
        await settleReveals(page);

        const results = await new AxeBuilder({ page })
          .withRules(["color-contrast"])
          .analyze();

        const violations = results.violations.filter((v) =>
          v.nodes.some((n) => n.any.length > 0),
        );

        record(
          target.path,
          viewport.name,
          "contrast",
          violations.length === 0,
          `${violations.length} rule(s)`,
        );
        if (violations.length > 0) {
          report.push(`    [contrast] ${target.path} @${viewport.width}`);
          for (const v of violations) {
            report.push(`    ${v.id} (${v.nodes.length} node(s))`);
            for (const n of v.nodes.slice(0, 5)) {
              report.push(`      ${n.target.join(" ")} :: ${n.any[0]?.message ?? ""}`);
            }
          }
        }

        await page.close();
      }

      await context.close();
    }

    await browser.close();
    // (e) OG route responses, fetched while the server is still up.
    for (const slug of CASE_STUDY_SLUGS) {
      const route = `/projects/${slug}/opengraph-image`;
      try {
        const res = await fetch(BASE + route);
        const buf = Buffer.from(await res.arrayBuffer());
        const ctype = res.headers.get("content-type") ?? "";
        let clean = true;
        let detail = `bytes=${buf.length} type=${ctype}`;

        if (res.status !== 200) {
          clean = false;
          detail = `status ${res.status}`;
        } else if (/^text\/|^application\/(json|xml)/.test(ctype)) {
          const asText = buf.toString("utf8");
          for (const m of MOJIBAKE) {
            if (asText.includes(m.pat)) {
              clean = false;
              detail = `mojibake ${m.label} in OG body`;
            }
          }
        }

        record(route, "-", "og-encoding", clean, detail);
      } catch (err) {
        record(route, "-", "og-encoding", false, String(err));
      }
    }

    await browser.close();
  } finally {
    await stopServer();
  }

  // Table output.
  const widths = [...new Set(rows.map((r) => r.width))];
  const routeCol = [...new Set(rows.map((r) => r.route))];
  const checkCol = [...new Set(rows.map((r) => r.check))];

  console.log("\nroute".padEnd(38) + widths.map((w) => w.padStart(10)).join(""));
  for (const route of routeCol) {
    let line = route.padEnd(38);
    for (const w of widths) {
      const cell = rows.find((r) => r.route === route && r.width === w);
      line += (cell ? (cell.ok ? "PASS" : "FAIL") : "-").padStart(10);
    }
    console.log(line);
  }

  // Full measurement detail, so a PASS is auditable and not just a word.
  report.push("");
  report.push("=== MEASUREMENTS ===");
  for (const r of rows) {
    if (!r.detail) continue;
    if (
      r.check === "content-col-geometry" ||
      r.check === "content-right-of-nav" ||
      r.check === "no-nav-overlap" ||
      r.check === "closing-cta-below-more" ||
      r.check === "closing-cta-once" ||
      r.check === "section-order" ||
      r.check === "nav-no-horizontal-space" ||
      r.check === "nav-anchors-exist" ||
      r.check === "og-encoding" ||
      r.check.startsWith("no-mojibake") ||
      r.check === "no-overflow" ||
      r.check === "head-charset-utf8"
    ) {
      report.push(
        `${r.ok ? "PASS" : "FAIL"} ${r.route} @${r.width} :: ${r.check} :: ${r.detail}`,
      );
    }
  }

  console.log("\n=== FAILURES ===");
  const failed = rows.filter((r) => !r.ok);
  if (failed.length === 0) {
    console.log("none");
  } else {
    for (const f of failed) {
      console.log(`FAIL ${f.route} @${f.width} :: ${f.check} :: ${f.detail}`);
    }
  }

  const summary = [
    `\nchecks: ${rows.length}, failures: ${failures}`,
    `checks per width: ${widths.join(", ")}`,
    `routes: ${routeCol.length}`,
    `check types: ${checkCol.join(", ")}`,
  ].join("\n");
  console.log(summary);

  console.log(`\nScreenshots + report.txt written to ${OUT_DIR}`);
  await shutdown(failures === 0 ? 0 : 1);
}

main().catch(async (err) => {
  console.error(err);
  await shutdown(1);
});