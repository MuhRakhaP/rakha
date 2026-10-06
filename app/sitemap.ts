import type { MetadataRoute } from "next";

import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/site";

/**
 * Every page a crawler should see, built from the same project list the site
 * renders. Adding a project adds its URL here without anyone remembering.
 *
 * No `lastModified`. It used to be `new Date()`, which meant every URL claimed
 * to have changed at the moment it was crawled, so a crawler had no way to tell
 * a page that moved from a page that did not. Omitting the field says "no
 * reliable date", which is the truth: the real one is the commit date of the
 * file that last changed each route, and git is not readable from a build.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/experience`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.6 },
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      // An in-development project is the least finished thing on the site, so it
      // is the lowest priority of the six rather than the same as a production
      // case study.
      priority: project.status === "production" ? 0.8 : 0.5,
    })),
  ];
}