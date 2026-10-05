/**
 * Site-level facts. Sourced from the CV — do not add anything not in it.
 *
 * Source of truth: `CV_Muhammad_Rakha_Putra.pdf` in the repo root, plus the
 * revision the owner supplied directly. Where the two disagree, the file and
 * this record are listed in the hand-off notes.
 *
 * `phone` is published because the owner's CV revision lists it in its contact
 * line. It is deliberately kept out of the hero: a phone number competes with
 * the two actions the hero asks for, and the footer and /contact are where a
 * visitor looks for one.
 */
export const site = {
  name: "Muhammad Rakha Putra",
  shortName: "Rakha",
  /** The CV's current job title. */
  role: "Software Engineer",
  /**
   * The one line that names both roles, the stack, and the years.
   *
   * The CV's headline line is "Full Stack Developer | Laravel + Node.js +
   * TypeScript | 4+ Years Building Business Systems". `role` above now leads
   * with "Software Engineer", which is the current CV job title, so this line
   * keeps "Full Stack Developer" for the ATS keyword while carrying the newer
   * title too. Both phrases are on the CV, in different places, so the line is
   * a merge of two real lines rather than a new claim.
   *
   * It is data rather than markup so the hero, the page metadata, and any share
   * card all read the same string, and so there is one place to edit it.
   */
  headline:
    "Full Stack Developer · Software Engineer | Laravel + Node.js + TypeScript | 4+ Years Building Production Systems",

  /**
   * The same line for search results and link previews.
   *
   * Composed from what is already above: the two roles, the stack from
   * `headline`, and the categories the six case studies actually cover. No
   * figure appears here, because a figure in a meta description has nothing
   * behind it on the page it describes.
   */
  metaDescription:
    "Software Engineer and Full Stack Developer building backend systems, multi-tenant SaaS platforms, delivery automation, and AI integrations with Laravel, Node.js, TypeScript, PostgreSQL, and Next.js.",
  email: "mrakha184@gmail.com",
  phone: "+62 812 9691 4059",
  phoneHref: "tel:+6281296914059",
  location: "Jakarta, Indonesia",
  github: "https://github.com/MuhRakhaP",
  linkedin: "https://linkedin.com/in/muhammad-rakha-putra",
  locale: "en_US",
  /**
   * Public resume URL, served from `public/cv.pdf`.
   *
   * That file is a byte-for-byte copy of the CV in the repo root, which stays
   * out of git through the `CV_*.pdf` rule. Replacing the CV means replacing
   * both files; nothing else on the site has to change.
   */
  resumeUrl: "/cv.pdf",
} as const;

/**
 * TODO: replace with the real deployment origin before publishing.
 *
 * "rakha.dev" is a placeholder domain, and it is used in three places at once:
 * `metadataBase` for canonical URLs and Open Graph images, the sitemap, and
 * robots.txt. Until it points at the deployed site, every absolute URL the site
 * emits is wrong, which is worse than a relative one because search engines
 * index the wrong address. Nothing else has to change when the real domain
 * arrives.
 */
export const SITE_URL = "https://mrakha.vercel.app";
