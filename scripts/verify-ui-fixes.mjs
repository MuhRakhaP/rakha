/**
 * Verify the two UI fixes by asserting on rendered DOM, not on source text.
 *
 * 1. The case study hero must not link to the case study page it is already on.
 * 2. The CV-name subtitle must not render when it merely repeats the tagline,
 *    compared ignoring case, punctuation and whitespace.
 *
 * Boots the production build the same way visual-check does, then reads the
 * DOM. Run: node scripts/verify-ui-fixes.mjs
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import { createServer } from "node:net";
import path from "node:path";
import process from "node:process";

import { chromium } from "playwright";

const PORT = 3111;
const BASE = `http://127.0.0.1:${PORT}`;
const BUILD_ID = path.resolve(".next", "BUILD_ID");

const SLUGS = [
  "terahome",
  "thinkpos",
  "clockora",
  "kopiflow",
  "ai-helpdesk-assistant",
  "outstanding-delivery-automation",
];

const isWindows = process.platform === "win32";
let server = null;

function portInUse(port) {
  return new Promise((resolve) => {
    const socket = createServer();
    socket.once("error", () => resolve(true));
    socket.once("listening", () => socket.close(() => resolve(false)));
    socket.listen(port, "127.0.0.1");
  });
}

function killTree(pid) {
  if (!pid) return;
  try {
    if (isWindows) {
      spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
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
  throw new Error(`server did not respond within ${timeoutMs}ms`);
}

/** Normalise the same way the page does, to predict the expected subtitle. */
function normalise(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/**
 * Slugs whose subtitle must be absent entirely, with the reason. terahome is
 * the regression guard for the "&" -> "and" fold: its CV title differs from the
 * tagline only by the ampersand, so it must not render.
 */
const MUST_HIDE_SUBTITLE = {
  terahome: "cvName differs from tagline only by '&' vs 'and'",
};

async function main() {
  if (!existsSync(BUILD_ID)) {
    console.error(`No production build at ${BUILD_ID}. Run "pnpm build" first.`);
    process.exit(1);
  }
  if (await portInUse(PORT)) {
    console.error(`Port ${PORT} is in use.`);
    process.exit(1);
  }

  server = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)], {
    cwd: process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    detached: !isWindows,
  });

  let failures = 0;
  try {
    await waitForServer();
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });

    for (const slug of SLUGS) {
      const page = await context.newPage();
      const res = await page.goto(`${BASE}/projects/${slug}`, {
        waitUntil: "networkidle",
        timeout: 30_000,
      });

      const found = await page.evaluate(() => {
        const hero = document.querySelector("main header");
        const heroHref = hero
          ? Array.from(hero.querySelectorAll("a")).map((a) => a.getAttribute("href"))
          : [];
        const selfLinks = heroHref.filter((h) => h === window.location.pathname);

        const ownPath = window.location.pathname;

        // Card links to the same page are correct and must survive. Scoped to
        // the "More Projects" list so site-header nav links do not match.
        const cardLinks = Array.from(
          document.querySelectorAll(`#more a[href="${ownPath}"]`),
        ).length;

        const heroTagline = hero
          ? (hero.querySelector("p.text-lg")?.textContent ?? "")
          : "";

        // The subtitle is the muted paragraph directly under the tagline,
        // not the tagline itself. Excluding the tagline node means the check
        // measures a real duplicate rather than flagging the tagline.
        const subtitle = (() => {
          if (!hero) return null;
          const taglineEl = hero.querySelector("p.text-lg");
          const muted = Array.from(hero.querySelectorAll("p")).find(
            (p) =>
              p !== taglineEl &&
              p.className.includes("text-muted-foreground") &&
              !p.className.includes("uppercase") &&
              p.textContent.trim().length > 0,
          );
          return muted ? muted.textContent.trim() : null;
        })();

        return {
          heroHref,
          selfLinks,
          cardLinks,
          heroTagline: heroTagline.trim(),
          subtitle,
        };
      });

      // 1. no self-referencing link inside the hero
      const selfLinkOk = found.selfLinks.length === 0;
      if (!selfLinkOk) failures++;
      console.log(
        `${selfLinkOk ? "PASS" : "FAIL"} ${slug} :: no-self-link-in-hero` +
          (selfLinkOk ? "" : ` :: ${found.selfLinks.join(",")}`),
      );

      // 2. subtitle absent, or present and genuinely different from the tagline.
      const subtitle = found.subtitle;
      const subtitleIsDuplicate =
        subtitle !== null &&
        normalise(subtitle) === normalise(found.heroTagline);
      const dupOk = !subtitleIsDuplicate;
      if (!dupOk) failures++;
      console.log(
        `${dupOk ? "PASS" : "FAIL"} ${slug} :: no-duplicate-subtitle` +
          ` :: tagline=${JSON.stringify(found.heroTagline)}` +
          ` subtitle=${JSON.stringify(subtitle)}` +
          (dupOk ? "" : "  <-- subtitle repeats tagline"),
      );

      // 3. explicit guard: slugs known to render no subtitle at all.
      const mustHide = MUST_HIDE_SUBTITLE[slug];
      if (mustHide) {
        const hiddenOk = subtitle === null;
        if (!hiddenOk) failures++;
        console.log(
          `${hiddenOk ? "PASS" : "FAIL"} ${slug} :: subtitle-must-be-hidden` +
            ` :: ${mustHide}` +
            ` :: rendered=${JSON.stringify(subtitle)}`,
        );
      }

      console.log(
        `     hero links: ${JSON.stringify(found.heroHref)}` +
          ` | card self-links in #more: ${found.cardLinks}`,
      );

      await page.close();
      void res;
    }

    await browser.close();
  } finally {
    await stopServer();
  }

  console.log(`\nfailures: ${failures}`);
  await stopServer();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(async (err) => {
  console.error(err);
  await stopServer();
  process.exit(1);
});