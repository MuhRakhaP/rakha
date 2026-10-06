import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card for every page that does not generate its own.
 *
 * A route without one shares a link with no preview at all, which on a portfolio
 * is the difference between a card and a bare URL. Case studies override this
 * with their own name and tagline through `app/projects/[slug]/opengraph-image.tsx`.
 *
 * The background is the site's own `--background` value and the accent its
 * `--brand`, written as literals because `ImageResponse` renders outside the
 * page and cannot read CSS custom properties.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0e1a",
          color: "#e5e7eb",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#3b82f6" }}>
          {site.role}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 34, color: "#9ca3af", lineHeight: 1.35 }}>
            {site.headline}
          </div>
          {/* The keyword line carries what the sentence above leaves out: both
              role keywords and the years figure, so a shared card still reads
              for an ATS-style match. */}
          <div style={{ fontSize: 26, color: "#6b7280", lineHeight: 1.35 }}>
            {site.stackLine}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#9ca3af" }}>
          {site.location}
        </div>
      </div>
    ),
    size,
  );
}