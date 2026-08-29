# Availability DST Audit — polish 4 handoff

Work order: `availability-dst-audit-polish-4`
Repair commit: `2b0b933201a0bc77f06a3a4b7dd79407c4e42272`
Deployed URL: <https://availability-dst-audit.sociobot.in/>

## Delivered

- Removed the final decorative `FIG 01` label identified in review 4, kept its useful clock-change caption, and removed the now-unused figure-label style.
- Added a browser regression test that requires the useful caption and rejects a figure label.
- Updated the copy ledger for polish 4, route build identifiers, and the verb-first catalog description.
- Re-audited every finding from reviews 1–4. The complete ID-to-change-to-evidence mapping is in `.factory/polish-4.md`.
- Built and deployed the static `dist/` artifact to the work-order Azure Static Web App `sf-availability-dst-audit`.

## Run and verify

Use Node.js 20 or later:

    npm ci
    npm test
    npm run build
    npm run test:e2e

Run every exact command listed in `.factory/claims.json`; each command starts from the demo sandbox. The deployable artifact is `dist/`.

## Exact verification evidence

- Fresh clone: `npm ci` completed with zero vulnerabilities; `npm test` passed 10/10; `npm run build` created `dist/`.
- Fresh clone: all 12 exact claim commands passed independently in desktop and 390 px projects (2/2 each): `sample-audit`, `browser-timezone-rules`, `first-boundary-window`, `exports`, `time-edge-cases`, `comparison-date-change`, `published-comparison`, `multiple-daily-windows`, `demo-isolation`, `real-storage`, `privacy-local`, and `offline-reload`.
- Fresh clone: `npm run test:e2e` completed 44 selected browser checks across desktop and mobile (43 passed; one desktop-only target-size branch intentionally skipped by its test).
- Local verifier `/opt/fleet/lib/verify-url.sh` passed root, Demo, Privacy, Terms, Offline, and 404: correct title, `lang=en`, one h1, main landmark, image alternatives, and no console errors. Evidence: `.factory/evidence/polish-4/local/`.
- Live cold verifier passed the same six documents. Live screenshots and JSON are in `.factory/evidence/polish-4/live/`.
- Live interaction audit: root CTA points to `/demo/`; demo shows its banner, 12 rows, one clock-change row, and verdict at 372 px on a 390 × 844 screen. Demo writes only `demo:availability-dst-audit:config:v1`, Reset restores London, and Start for real removes that key while retaining seeded real data.
- Live privacy audit recorded only `https://availability-dst-audit.sociobot.in` requests across demo, export/reset/exit, and route checks. Live offline audit reloaded the completed demo after service-worker control with networking disabled.
- Live route/accessibility audit: root, Demo, Privacy, Terms, Offline, and a real missing route had one h1/main; Privacy and Back focused the h1; the missing route returned HTTP 404; Axe found zero serious or critical violations on all six routes.
- Production headers include CSP, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`. Sitemap lists root, Demo, Privacy, Terms, and Offline.
- Lighthouse mobile against production: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.6 s, TBT 70 ms, CLS 0. Report: `.factory/evidence/polish-4/live/lighthouse-mobile.json`.
- Build sizes: app JavaScript 27.15 KB raw / 9.30 KB gzip; CSS 18.07 KB raw / 4.66 KB gzip; runtime WebP hero 139.03 KB.

## Known gaps and next steps

None. The static, browser-local product intentionally audits declared weekly hours and imported UTC availability files; it does not claim to reproduce proprietary scheduler rules.
