/**
 * KOPIFLOW screenshot capture.
 *
 * Captures real UI from the locally running production build and writes it to
 * the portfolio's public/projects/kopiflow/ as WebP.
 *
 * Safety properties enforced here:
 *   - every request is checked against an allowlist; non-local hosts are
 *     blocked at the browser level, so no capture can leak off the machine
 *   - the page's own text is scanned before the file is kept; anything outside
 *     the dummy-data allowlist discards the capture, never blurs it
 *   - image sanity is checked with sharp: real dimensions, not blank, not a
 *     single flat colour
 *
 * Waits are bounded: 30s per screen, polled every 3s, 15min for the project.
 */

import { createHash } from "node:crypto";
import { readFileSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";
import { chromium } from "playwright";

const BASE = process.env.KOPIFLOW_BASE ?? "http://127.0.0.1:3201";
const EMAIL = process.env.KOPIFLOW_EMAIL ?? "owner@example.test";
const PASSWORD = process.env.KOPIFLOW_PASSWORD ?? "DummyPass!2026";

const OUT_DIR = path.resolve("public/projects/kopiflow");
const STATE_DIR = path.join(process.env.TEMP ?? ".", "portfolio-shots");

const VIEWPORT = { width: 1440, height: 900 };
const PER_SCREEN_TIMEOUT_MS = 30_000;
const POLL_MS = 3_000;
const PROJECT_BUDGET_MS = 15 * 60_000;

const CRASH_TEXT = [
  "Application error",
  "Internal Server Error",
  "Unhandled Runtime Error",
  "Cannot GET",
  "This page could not be found",
];

/** Hosts the browser may contact. Everything else is aborted before any bytes flow. */
const ALLOWED_HOSTS = new Set(["127.0.0.1", "localhost", "[::1]"]);

/**
 * Screens to capture. `expect` is the text that proves the screen rendered;
 * `anyHeading` accepts any non-empty h1/h2 when the page has no fixed heading.
 */
const SCREENS = [
  { name: "login", route: "/login", expect: "Email", file: "login", anon: true },
  { name: "dashboard", route: "/", expect: "Dashboard", file: "dashboard" },
  { name: "pembelian", route: "/pembelian", expect: "Pembelian", file: "pembelian" },
  { name: "produksi", route: "/produksi", expect: "Produksi", file: "produksi" },
  { name: "biaya", route: "/biaya", expect: "Biaya", file: "biaya" },
  { name: "penjualan", route: "/penjualan", expect: "Penjualan", file: "penjualan" },
  { name: "customers", route: "/customers", anyHeading: true, file: "customers" },
  { name: "suppliers", route: "/suppliers", expect: "Supplier", file: "suppliers" },
  { name: "laporan", route: "/laporan", anyHeading: true, file: "laporan" },
  { name: "users", route: "/users", expect: "Pengguna", file: "users" },
  { name: "saldo-awal-stok", route: "/stok/saldo-awal", expect: "Saldo Awal", file: "saldo-awal" },
];

const KILL_STYLE =
  "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}";

const log = (m) => console.log(m);

/**
 * Pre-save safety scan. Returns a list of problems; an empty list means the
 * capture may be kept. Anything non-empty discards the file outright.
 */
function scanText(text) {
  const problems = [];
  const seen = new Set();

  const add = (label, sample) => {
    const key = `${label}|${sample}`;
    if (seen.has(key)) return;
    seen.add(key);
    problems.push({ label, sample: String(sample).slice(0, 48) });
  };

  // Emails: only @example.com / @example.test are acceptable.
  for (const m of text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) ?? []) {
    if (!/@example\.(com|test)\b/i.test(m)) add("non-allowlist email", m);
  }

  // Phone-like numbers. The dummy seed uses a 0xxx-xxxx-xxxx shape.
  for (const match of text.match(/(?<!\d)(?:\+?62|0)[\d\s-]{8,15}(?!\d)/g) ?? []) {
    if (!/^0\d{2,4}[-\s]?\d{3,4}[-\s]?\d{3,4}$/.test(match.trim())) {
      add("phone-like number", match.trim());
    }
  }

  // Any IPv4 literal is suspicious: KOPIFLOW has no network screens, and the
  // allowlisted documentation ranges would be legitimate if present.
  for (const m of text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) ?? []) {
    add("IPv4 literal", m);
  }

  // Secret-shaped strings.
  const secretPatterns = [
    ["JWT-like token", /\beyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}/g],
    ["sk- key", /\bsk-[A-Za-z0-9]{8,}/g],
    ["Bearer token", /\bBearer\s+[A-Za-z0-9._-]{8,}/g],
    ["password assignment", /\bpassword\s*[:=]\s*\S+/gi],
    ["private key marker", /-----BEGIN [A-Z ]*PRIVATE KEY-----/g],
    ["bcrypt hash", /\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}/g],
  ];
  for (const [label, re] of secretPatterns) {
    // The value is never printed, only the fact that something matched.
    if (re.test(text)) add(label, "<redacted>");
  }

  // External domains: anything not example.com/test is a leak.
  for (const m of text.match(/\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|io|id|co\.id|ac\.id|sslip\.io)\b/gi) ?? []) {
    if (!/^example\.(com|test)$/i.test(m)) add("external domain", m);
  }

  return problems;
}

/** Image sanity: exact dimensions, not blank, not a single flat colour. */
async function imageSanity(pngBuffer) {
  const meta = await sharp(pngBuffer).metadata();
  if (meta.width !== VIEWPORT.width || meta.height !== VIEWPORT.height) {
    return {
      ok: false,
      reason: `dimensions ${meta.width}x${meta.height}, expected ${VIEWPORT.width}x${VIEWPORT.height}`,
    };
  }

  const stats = await sharp(pngBuffer).resize(64, 64, { fit: "inside" }).raw().toBuffer({ resolveWithObject: true });
  const ch = stats.info.channels;
  const data = stats.data;

  let min = 255;
  let max = 0;
  const buckets = new Set();
  for (let i = 0; i < data.length; i += ch) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum < min) min = lum;
    if (lum > max) max = lum;
    buckets.add(`${data[i] >> 4},${data[i + 1] >> 4},${data[i + 2] >> 4}`);
  }

  if (buckets.size <= 2) {
    return {
      ok: false,
      reason: `near single-colour image (${buckets.size} distinct colours, luma range ${Math.round(max - min)})`,
    };
  }

  return {
    ok: true,
    width: meta.width,
    height: meta.height,
    distinctColours: buckets.size,
    lumaRange: Math.round(max - min),
    bytes: pngBuffer.length,
  };
}

async function waitForText(page, needle, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const hit = await page.evaluate(
      (n) => (document.body.innerText || "").toLowerCase().includes(n.toLowerCase()),
      needle,
    );
    if (hit) return true;
    await delay(POLL_MS);
  }
  return false;
}

async function waitForAnyHeading(page, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const hit = await page.evaluate(() => {
      const h = document.querySelector("h1, h2");
      return !!h && (h.textContent || "").trim().length > 0;
    });
    if (hit) return true;
    await delay(POLL_MS);
  }
  return false;
}

/** Install the network allowlist and the animation-killing stylesheet. */
async function prepareContext(browser) {
  const blockedHosts = [];

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
    locale: "en-US",
    timezoneId: "Asia/Jakarta",
  });

  await context.route("**/*", async (route) => {
    let url;
    try {
      url = new URL(route.request().url());
    } catch {
      return route.abort();
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") return route.abort();
    if (ALLOWED_HOSTS.has(url.hostname)) return route.continue();
    blockedHosts.push(url.hostname);
    return route.abort();
  });

  return { context, blockedHosts };
}

/**
 * Screenshot + safety scan + sanity + WebP write. Returns a result record.
 * The file is only written when every check passes.
 */
async function captureOne(page, screen) {
  const png = await page.screenshot({ fullPage: false, animations: "disabled", caret: "hide" });

  if (png.length < 5_000) {
    return { name: screen.name, status: "BLOCKED", reason: `png too small (${png.length} bytes)` };
  }

  const text = await page.evaluate(() => document.body.innerText || "");
  const problems = scanText(text);
  if (problems.length > 0) {
    return {
      name: screen.name,
      status: "BLOCKED",
      reason: `safety scan: ${problems.map((p) => `${p.label} "${p.sample}"`).slice(0, 4).join(", ")}`,
      safetyProblems: problems,
    };
  }

  const sanity = await imageSanity(png);
  if (!sanity.ok) {
    return { name: screen.name, status: "BLOCKED", reason: `image sanity: ${sanity.reason}` };
  }

  const outPath = path.join(OUT_DIR, `${screen.file}.webp`);
  await sharp(png).webp({ quality: 85 }).toFile(outPath);

  const bytes = statSync(outPath).size;
  const sha256 = createHash("sha256").update(readFileSync(outPath)).digest("hex");

  return {
    name: screen.name,
    status: "CAPTURED",
    file: `public/projects/kopiflow/${screen.file}.webp`,
    route: screen.route,
    width: sanity.width,
    height: sanity.height,
    bytes,
    sha256,
    distinctColours: sanity.distinctColours,
    lumaRange: sanity.lumaRange,
    safetyScan: "clean",
  };
}

async function main() {
  const started = Date.now();
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(STATE_DIR, { recursive: true });

  const browser = await chromium.launch();
  const results = [];

  // ---- anonymous context first, so the login screen shows the form --------
  {
    const { context, blockedHosts } = await prepareContext(browser);
    const page = await context.newPage();
    await page.addStyleTag({ content: KILL_STYLE });
    const screen = SCREENS[0];
    try {
      await page.goto(`${BASE}${screen.route}`, { waitUntil: "networkidle", timeout: PER_SCREEN_TIMEOUT_MS });
      // Fill with placeholders so no real credential shape is on screen.
      await page.fill("#email", EMAIL);
      await page.fill("#password", "DummyPass!2026");
      const ok = await waitForText(page, screen.expect, 10_000);
      if (!ok) throw new Error(`expected "${screen.expect}" never appeared`);
      const entry = await captureOne(page, screen);
      results.push(entry);
      log(`[${screen.name}] ${entry.status}${entry.reason ? " " + entry.reason : ""}`);
    } catch (err) {
      results.push({ name: screen.name, status: "BLOCKED", reason: err.message });
      log(`[${screen.name}] BLOCKED ${err.message}`);
    }
    await context.close();
    globalThis.__blockedAnon = blockedHosts;
  }

  // ---- authenticated context --------------------------------------------
  const { context, blockedHosts } = await prepareContext(browser);
  const page = await context.newPage();
  await page.addStyleTag({ content: KILL_STYLE });

  let signedIn = false;
  try {
    log(`[auth] signing in as ${EMAIL}`);
    await page.goto(`${BASE}/login`, { waitUntil: "networkidle", timeout: PER_SCREEN_TIMEOUT_MS });
    await page.fill("#email", EMAIL);
    await page.fill("#password", PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL((u) => !u.pathname.startsWith("/login"), { timeout: PER_SCREEN_TIMEOUT_MS });
    signedIn = true;
    log(`[auth] ok, landed on ${new URL(page.url()).pathname}`);
  } catch (err) {
    log(`[auth] FAILED: ${err.message}`);
  }

  if (!signedIn) {
    await browser.close();
    writeFileSync(
      path.join(STATE_DIR, "kopiflow-capture.json"),
      JSON.stringify({ results, blockedHosts: [], aborted: "login failed" }, null, 2),
      "utf8",
    );
    log("\nNo session, so authenticated screens cannot be captured. Stopping.");
    process.exit(1);
  }

  for (const screen of SCREENS.slice(1)) {
    if (Date.now() - started > PROJECT_BUDGET_MS) {
      log(`\n!! project budget of ${PROJECT_BUDGET_MS / 60000} min exhausted, stopping early`);
      results.push({ name: "(remaining)", status: "BLOCKED", reason: "project time budget exhausted" });
      break;
    }

    try {
      const res = await page.goto(BASE + screen.route, {
        waitUntil: "networkidle",
        timeout: PER_SCREEN_TIMEOUT_MS,
      });
      const status = res ? res.status() : 0;
      if (status !== 200) throw new Error(`HTTP ${status}`);

      const ready = screen.expect
        ? await waitForText(page, screen.expect, PER_SCREEN_TIMEOUT_MS)
        : await waitForAnyHeading(page, PER_SCREEN_TIMEOUT_MS);
      if (!ready) throw new Error(`expected "${screen.expect ?? "any heading"}" not found within ${PER_SCREEN_TIMEOUT_MS / 1000}s`);

      const bodyText = await page.evaluate(() => document.body.innerText || "");
      const crash = CRASH_TEXT.find((c) => bodyText.includes(c));
      if (crash) throw new Error(`crash text on page: "${crash}"`);

      // Let charts settle: wait for the network to be idle and fonts to load.
      await page.evaluate(() => document.fonts?.ready);

      const entry = await captureOne(page, screen);
      results.push(entry);
      log(`[${screen.name}] ${entry.status}${entry.reason ? " " + entry.reason : ""}`);
    } catch (err) {
      results.push({ name: screen.name, status: "BLOCKED", reason: err.message });
      log(`[${screen.name}] BLOCKED ${err.message}`);
    }
  }

  await context.close();
  await browser.close();

  const allBlocked = [...blockedHosts, ...(globalThis.__blockedAnon ?? [])];
  const captured = results.filter((r) => r.status === "CAPTURED");
  const blockedScreens = results.filter((r) => r.status !== "CAPTURED");

  writeFileSync(
    path.join(STATE_DIR, "kopiflow-capture.json"),
    JSON.stringify({ results, blockedHosts: [...new Set(allBlocked)] }, null, 2),
    "utf8",
  );

  log("\n=== blocked outbound hosts ===");
  log(allBlocked.length === 0 ? "none - every request stayed on localhost" : [...new Set(allBlocked)].join(", "));
  log(`\ncaptured ${captured.length}, blocked ${blockedScreens.length}, elapsed ${Math.round((Date.now() - started) / 1000)}s`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});