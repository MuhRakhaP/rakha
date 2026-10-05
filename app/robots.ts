import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * TODO: `SITE_URL` is still a placeholder domain. See the note in `lib/site.ts`.
 *
 * The API routes are disallowed because there are none, and saying so is cheaper
 * than a crawler discovering it later.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}