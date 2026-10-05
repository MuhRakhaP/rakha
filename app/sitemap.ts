import type { MetadataRoute } from "next";

import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

/**
 * Every page a crawler should see, built from the same project list the site
 * renders. Adding a project adds its URL here without anyone remembering.
 *
 * TODO: `SITE_URL` is still a placeholder domain. See the note in `lib/site.ts`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/experience`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      // An in-development project is the least finished thing on the site, so it
      // is the lowest priority of the six rather than the same as a production
      // case study.
      priority: project.status === "production" ? 0.8 : 0.5,
    })),
  ];
}