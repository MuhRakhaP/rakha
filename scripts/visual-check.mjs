/**
 * Visual + accessibility check harness.
 *
 * Starts `next start` on a fixed port, screenshots every page at two widths,
 * and reports horizontal overflow plus axe-core colour-contrast violations.
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

const PAGES = [
  { path: "/", name: "home" },
  { path: "/projects", name: "projects" },
  { path: "/projects/terahome", name: "project-terahome" },
  { path: "/projects/thinkpos", name: "project-thinkpos" },
  { path: "/about", name: "about" },
  { path: "/experience", name: "experience" },
  { path: "/contact", name: "contact" },
];

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

const isWindows = process.platform === "win32";
const report = [];
let server = null;
let shuttingDown = false;

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

  const text = report.join("\n");
  writeFileSync(path.join(OUT_DIR, "report.txt"), text + "\n", "utf8");
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
        await page.goto(BASE + target.path, {
          waitUntil: "networkidle",
          timeout: 30_000,
        });
        await page.waitForTimeout(250);

        await page.screenshot({
          path: path.join(OUT_DIR, `${target.name}-${viewport.name}.png`),
          fullPage: true,
        });

        if (viewport.name === "mobile") {
          const { overflow, offenders } = await findOverflow(page);
          const status = overflow > 1 ? "FAIL" : "pass";
          report.push(
            `[overflow @390] ${target.path} -> ${status}` +
              (overflow > 1 ? ` (+${overflow}px)` : ""),
          );
          if (overflow > 1) {
            for (const o of offenders) {
              report.push(`    offender <${o.tag}> right=${o.right} .${o.cls}`);
            }
          }
        } else {
          const results = await new AxeBuilder({ page })
            .withRules(["color-contrast"])
            .analyze();

          const violations = results.violations.filter((v) =>
            v.nodes.some((n) => n.any.length > 0),
          );

          report.push(
            `[contrast @1440] ${target.path} -> ${
              violations.length === 0 ? "pass" : "FAIL"
            } (${violations.length} rule(s))`,
          );
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
  } finally {
    await stopServer();
  }

  console.log(report.join("\n"));
  console.log(`\nScreenshots + report.txt written to ${OUT_DIR}`);
  await shutdown(0);
}

main().catch(async (err) => {
  console.error(err);
  await shutdown(1);
});
