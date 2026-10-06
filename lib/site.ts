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
/**
 * Years in professional roles, as one string every part of the site reads.
 *
 * Sourced from the CV's own figure and from the dated roles in
 * `lib/experience.ts`, which start 09/2022. It is interpolated rather than
 * typed per page, because it used to be written out in seven places and two of
 * them had already drifted into different sentences.
 *
 * TODO: update to "5+" in Sept 2027, or the moment the CV says so.
 */
export const yearsExperience = "4+";

/** The year the first role started, paired with the figure above. */
export const careerStart = 2022;

export const site = {
  name: "Muhammad Rakha Putra",
  shortName: "Rakha",
  /** The CV's current job title. */
  role: "Software Engineer",
  /**
   * The one sentence the hero says about the work.
   *
   * Twelve words, one claim, no list. It used to be the CV headline verbatim,
   * which is a keyword string rather than a sentence: three pipe-separated
   * fragments that read as an ATS dump because that is what it was.
   * `stackLine` below carries the keywords this line gave up, so nothing that
   * matched a search drops off the page.
   *
   * "Full Stack Developer" moves to `stackLine` rather than disappearing: it is
   * the ATS keyword the earlier passes insisted on keeping.
   */
  headline: "Software Engineer building business systems and AI integrations.",

  /**
   * The keyword line under the headline, where a keyword list belongs.
   *
   * Format mirrors the CV's own headline line, separators and all, so the
   * string an ATS reads matches the string on the CV. Both role keywords and
   * the years figure are here, and the years come from `yearsExperience` so the
   * two cannot drift apart.
   */
  stackLine: `Full Stack Developer | Laravel + Node.js + TypeScript | ${yearsExperience} Years Building Systems`,

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
 * The deployment origin.
 *
 * Read in three places at once: `metadataBase` for canonical URLs and Open Graph
 * images, the sitemap, and robots.txt. Change it here and all three move. A
 * trailing slash would double up in the paths built from it, so there is none.
 */
export const SITE_URL = "https://mrakha.vercel.app";
