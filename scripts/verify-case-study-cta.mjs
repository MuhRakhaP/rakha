/**
 * Verify "View Case Study" survives on ProjectCard and is gone from the hero.
 *
 * Reads the /projects listing DOM, which renders ProjectCard for every
 * project, and the case study hero for the same slugs.
 *
 * Run: node scripts/verify-case-study-cta.mjs
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

// Only these three have caseStudy: true, so only they should ever show a
// "View Case Study" CTA anywhere. ai-helpdesk-assistant and
// outstanding-delivery-automation are not case studies and must not.
const CASE_STUDY_SLUGS = ["terahome", "thinkpos", "clockora"];

const NON_CASE_STUDY_SLUGS = [
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

    // --- cards on /projects must still offer the case study link ---
    const listPage = await context.newPage();
    await listPage.goto(`${BASE}/projects`, { waitUntil: "networkidle", timeout: 30_000 });

    const allSlugs = [...CASE_STUDY_SLUGS, ...NON_CASE_STUDY_SLUGS];

    const cardLinks = await listPage.evaluate((allSlugs) => {
      const out = {};
      for (const slug of allSlugs) {
        // ProjectCard links to /projects/<slug> from the heading, and the
        // "View Case Study" CTA links to the same href.
        const anchors = Array.from(
        document.querySelectorAll(`a[href="/projects/${slug}"]`),
      );
        out[slug] = {
          total: anchors.length,
          viewCaseStudy: anchors.filter(
            (a) => a.textContent.trim() === "View Case Study",
          ).length,
        };
      }
      return out;
    }, allSlugs);

    for (const slug of CASE_STUDY_SLUGS) {
      const info = cardLinks[slug];
      const ok = info.viewCaseStudy >= 1;
      if (!ok) failures++;
      console.log(
        `${ok ? "PASS" : "FAIL"} /projects card ${slug} :: has-View-Case-Study` +
          ` :: anchors=${info.total} cta=${info.viewCaseStudy}`,
      );
    }

    // --- heroes must not offer it ---
    for (const slug of CASE_STUDY_SLUGS) {
      const page = await context.newPage();
      await page.goto(`${BASE}/projects/${slug}`, {
        waitUntil: "networkidle",
        timeout: 30_000,
      });

      const hero = await page.evaluate(() => {
        const el = document.querySelector("main header");
        if (!el) return { present: false, viewCaseStudy: 0, hrefs: [] };
        const anchors = Array.from(el.querySelectorAll("a"));
        return {
          present: true,
          viewCaseStudy: anchors.filter(
            (a) => a.textContent.trim() === "View Case Study",
          ).length,
          hrefs: anchors.map((a) => a.getAttribute("href")),
        };
      });

      const ok = hero.present && hero.viewCaseStudy === 0;
      if (!ok) failures++;
      console.log(
        `${ok ? "PASS" : "FAIL"} hero ${slug} :: no-View-Case-Study` +
          ` :: count=${hero.viewCaseStudy} hrefs=${JSON.stringify(hero.hrefs)}`,
      );
      await page.close();
    }

    // --- non case studies must never show the CTA, in card or hero ---
    for (const slug of NON_CASE_STUDY_SLUGS) {
      const info = cardLinks[slug];
      const ok = info.viewCaseStudy === 0;
      if (!ok) failures++;
      console.log(
        `${ok ? "PASS" : "FAIL"} /projects card ${slug} :: no-View-Case-Study` +
          ` :: cta=${info.viewCaseStudy}`,
      );
    }

    for (const slug of NON_CASE_STUDY_SLUGS) {
      const page = await context.newPage();
      const res = await page.goto(`${BASE}/projects/${slug}`, {
        waitUntil: "networkidle",
        timeout: 30_000,
      });
      const hero = await page.evaluate(() => {
        const el = document.querySelector("main header");
        if (!el) return { present: false, viewCaseStudy: 0, hrefs: [] };
        const anchors = Array.from(el.querySelectorAll("a"));
        return {
          present: true,
          viewCaseStudy: anchors.filter(
            (a) => a.textContent.trim() === "View Case Study",
          ).length,
          hrefs: anchors.map((a) => a.getAttribute("href")),
        };
      });
      const ok = hero.viewCaseStudy === 0;
      if (!ok) failures++;
      console.log(
        `${ok ? "PASS" : "FAIL"} hero ${slug} :: no-View-Case-Study` +
          ` :: status=${res.status()} count=${hero.viewCaseStudy}` +
          ` hrefs=${JSON.stringify(hero.hrefs)}`,
      );
      await page.close();
    }

    await listPage.close();
    await browser.close();
  } finally {
    await stopServer();
  }

  console.log(`\nfailures: ${failures}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(async (err) => {
  console.error(err);
  await stopServer();
  process.exit(1);
});