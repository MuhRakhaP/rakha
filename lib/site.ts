/**
 * Site-level facts. Sourced from the CV — do not add anything not in it.
 * Phone number is intentionally omitted: it must not be published.
 */
export const site = {
  name: "Muhammad Rakha Putra",
  shortName: "Rakha",
  role: "Software Engineer",
  secondaryRole: "Full-Stack",
  email: "mrakha184@gmail.com",
  github: "https://github.com/MuhRakhaP",
  linkedin: "https://linkedin.com/in/muhammad-rakha-putra",
  locale: "en_US",
  /** Public resume URL. Set when a public PDF is hosted. Null by default — never link the private CV PDF. */
  resumeUrl: null,
} as const;

/**
 * TODO: set to the real deployment origin before publishing.
 * "example.com" is IANA-reserved and cannot resolve to a real site.
 */
export const SITE_URL = "https://example.com";
