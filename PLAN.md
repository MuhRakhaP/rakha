# Portfolio Roadmap

## In Progress
- [ ] Admin panel mockup — improve visuals based on user feedback
- [ ] Multi-tenant screenshot — replace mockup with real screenshots when available

## Planned — Need Rakha's Input
- [ ] Live demo URLs for 6 projects (ask Rakha first)
- [ ] APK download links for THINKPOS and CLOCKORA
- [ ] GitHub repository links (for open-source projects)
- [ ] Portrait photo (professional, neutral background)
- [ ] Actual multi-tenant screenshots
- [ ] KOPIFLOW tenant count — only add when production data exists

## Planned — Technical
- [ ] SITE_URL — replace `https://rakha.dev` with the real domain when ready
- [ ] SEO optimization — meta descriptions per page
- [ ] Open Graph images per project
- [ ] Analytics setup (Plausible or Umami)
- [ ] Sitemap submission to Google Search Console
- [ ] Add "Multi-Tenant SaaS Architecture" to Skills section — DONE (exists in Backend & Databases)
- [ ] Improve footer text size — DONE (links bumped to text-base)
- [ ] Hero section layout balance — DONE (two-column with info panel on right)
- [ ] THINKPOS Result — DONE (changed to "Full POS system replacing manual paper-based checkout")
- [ ] AI Helpdesk Tech stack — DONE (removed duplicate PostgreSQL, REST API removed)
- [ ] Case study spacing consistency — DONE (Section component unifies spacing)

## Completed
- [x] Deep space minimalist redesign
- [x] 6 projects, 3 of them multi-tenant SaaS (THINKPOS, CLOCKORA, KOPIFLOW)
- [x] Skills grid (the accordion was removed; every group is open)
- [x] Education & Certifications section
- [x] CV PDF sync
- [x] Download CV CTA
- [x] Case study page for all 6 projects
- [x] Admin panel mockup for THINKPOS, CLOCKORA, KOPIFLOW
- [x] Multi-Tenant Architecture section for SaaS projects
- [x] Multi-tenant architecture notes verified against the implementation
- [x] Disclaimer removed from 3 SaaS case studies
- [x] Consistency across 3 SaaS case studies (5 notes each, same layout)
- [x] 3 project-specific admin panel mockups (THINKPOS, CLOCKORA, KOPIFLOW)
- [x] KOPIFLOW Result → Scope (no tenant count)
- [x] THINKPOS Result updated to "Full POS system replacing manual paper-based checkout"
- [x] AI Helpdesk Tech stack cleaned (duplicate PostgreSQL removed, REST API removed)
- [x] KOPIFLOW Result → Scope (no tenant count)
- [x] Hero section two-column layout with info panel
- [x] Footer text size improved
- [x] Admin panel mockups are project-specific (THINKPOS/CLOCKORA/KOPIFLOW)
- [x] sitemap.ts and robots.ts
- [x] Mockup mobile responsive (horizontal scroll at 375px)

## Blocked
- Live demo URLs (need permission from Rakha)
- Actual screenshots (need product access)
- Coffee businesses count (no production data yet — KOPIFLOW is MVP)
- KOPIFLOW tenant count — only add when production data exists

## Notes
- `KOPIFLOW` is the only project the CV does not mention at all. It is on the
  site as an MVP with eleven real screenshots, and nothing about it is CV-backed.
- The KOPIFLOW result line carries no tenant count on purpose. The earlier "5+"
  had no CV line and no screenshot behind it. The figure is still unverified.
- `multiTenant.verified` travels with the notes in `data/projects.ts`. Flip it to
  false on a project whose architecture changes, and the "pending verification"
  line comes back on its own.