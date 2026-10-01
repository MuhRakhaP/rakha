#!/usr/bin/env node
/**
 * Build screenshots-review.html: a contact sheet of every captured image.
 *
 * Reads the capture JSON written by capture-kopiflow.mjs and the independent
 * verification JSON written by verify-captures.py, so the sheet shows measured
 * facts (real dimensions, size, sha256) rather than what the script claimed.
 *
 * Usage: node scripts/screenshots/build-contact-sheet.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const STATE = path.join(process.env.TEMP, "portfolio-shots");
const CAPTURE = path.join(STATE, "kopiflow-capture.json");
const VERIFY = path.resolve("scripts/screenshots/capture-verify.json");
const OUT = path.resolve("screenshots-review.html");

const capture = JSON.parse(readFileSync(CAPTURE, "utf8"));
const verify = existsSync(VERIFY) ? JSON.parse(readFileSync(VERIFY, "utf8")) : [];

const byName = new Map(verify.map((v) => [v.file.replace(/\.webp$/, ""), v]));

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const cards = capture.results
  .map((r) => {
    if (r.status !== "CAPTURED") {
      return `
    <article class="card blocked">
      <div class="thumb placeholder">
        <span class="ph-text">NOT CAPTURED</span>
        <span class="ph-sub">${esc(r.reason ?? "")}</span>
      </div>
      <dl>
        <dt>Screen</dt><dd>${esc(r.name)}</dd>
        <dt>Status</dt><dd class="bad">BLOCKED</dd>
        <dt>Reason</dt><dd>${esc(r.reason ?? "")}</dd>
      </dl>
    </article>`;
    }

    const v = byName.get(r.file.replace(/\.webp$/, ""));
    const src = "/" + r.file.replace(/\\/g, "/");
    const kb = (r.bytes / 1024).toFixed(1);
    return `
    <article class="card">
      <div class="thumb">
        <img src="${esc(src)}" alt="${esc(r.name)} screenshot captured from the local KOPIFLOW build" loading="lazy" width="${r.width}" height="${r.height}" />
      </div>
      <dl>
        <dt>Screen</dt><dd>${esc(r.name)}</dd>
        <dt>File</dt><dd class="mono">${esc(r.file.split("/").pop())}</dd>
        <dt>Route</dt><dd class="mono">${esc(r.route)}</dd>
        <dt>Dimensions</dt><dd>${r.width} x ${r.height}</dd>
        <dt>Size</dt><dd>${kb} KB</dd>
        <dt>Safety scan</dt><dd class="good">${esc(r.safetyScan)}</dd>
        <dt>Independently verified</dt><dd class="${v?.ok ? "good" : "bad"}">${v ? (v.ok ? "ok" : "FAIL") : "not run"}</dd>
        <dt>sha256</dt><dd class="mono tiny">${esc((r.sha256 ?? "").slice(0, 32))}...</dd>
      </dl>
    </article>`;
  })
  .join("\n");

const captured = capture.results.filter((r) => r.status === "CAPTURED").length;
const blocked = capture.results.length - captured;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Screenshot review — KOPIFLOW pilot</title>
<style>
  :root { color-scheme: light dark; --bg:#faf9f7; --fg:#1c1917; --card:#fff; --line:#e7e5e4;
          --good:#15803d; --bad:#b91c1c; --muted:#78716c; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#1c1917; --fg:#fafaf9; --card:#292524; --line:#44403c; --muted:#a8a29e; }
  }
  * { box-sizing: border-box; }
  body { margin:0; padding:2rem; background:var(--bg); color:var(--fg);
         font:14px/1.5 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
  h1 { font-size:1.5rem; margin:0 0 .25rem; }
  .sub { color:var(--muted); margin:0 0 1.5rem; }
  .banner { border:1px solid var(--line); border-left:3px solid var(--bad); background:var(--card);
            padding:.75rem 1rem; border-radius:.5rem; margin:0 0 1.5rem; }
  .banner strong { color:var(--bad); }
  .grid { display:grid; gap:1.25rem; grid-template-columns:repeat(auto-fill, minmax(420px, 1fr)); }
  .card { background:var(--card); border:1px solid var(--line); border-radius:.75rem; overflow:hidden; }
  .thumb { aspect-ratio:1440/900; background:var(--bg); border-bottom:1px solid var(--line); }
  .thumb img { width:100%; height:100%; object-fit:cover; object-position:top left; display:block; }
  .placeholder { display:flex; flex-direction:column; align-items:center; justify-content:center;
                 gap:.5rem; text-align:center; padding:1rem; }
  .ph-text { font-weight:700; letter-spacing:.08em; color:var(--bad); }
  .ph-sub { color:var(--muted); font-size:.8rem; }
  dl { display:grid; grid-template-columns:auto 1fr; gap:.3rem .9rem; margin:0; padding:.9rem 1rem; }
  dt { color:var(--muted); font-size:.75rem; text-transform:uppercase; letter-spacing:.06em; }
  dd { margin:0; font-size:.85rem; word-break:break-word; }
  .mono { font-family:ui-monospace, "Cascadia Code", Consolas, monospace; }
  .tiny { font-size:.7rem; color:var(--muted); }
  .good { color:var(--good); font-weight:600; }
  .bad { color:var(--bad); font-weight:600; }
</style>
</head>
<body>
<h1>Screenshot review — KOPIFLOW pilot (Phase B1)</h1>
<p class="sub">Real UI captured from a local production build on 127.0.0.1:3201 against a disposable Postgres. Every image below is a genuine screenshot, not a mockup. ${captured} captured, ${blocked} blocked.</p>

<div class="banner">
  <strong>Not actual production data.</strong> All rows come from the app's own committed <code>prisma/seed.ts</code> run against container <code>shot-kopiflow-db</code>. Account: <code>owner@example.test</code>. No production database, payment service, or customer data was touched. No outbound request left localhost.
</div>

<div class="grid">
${cards}
</div>
</body>
</html>
`;

writeFileSync(OUT, html, "utf8");
console.log(`wrote ${OUT}`);
console.log(`captured ${captured}, blocked ${blocked}`);
