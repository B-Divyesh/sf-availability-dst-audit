# Availability DST Audit — polish round 3 handoff

Work order: `availability-dst-audit-polish-3`

Reviewed candidate: `596393ae61ad99b472c61f2aece8fa648224407c`

Review commit: `e1b939c646d7c7e9925be25104e1de473a6f3388`

Repair commits: `e2db8be6208b7193ea75fc853d07d0434c3e2744`, `e077349`

Live URL: <https://availability-dst-audit.sociobot.in/>
Deployment: `16d56dfd-8b30-4640-bb9a-e1d412207cce`

## Delivered

- Rejected timezone-qualified and floating calendar events instead of treating their wall-clock digits as UTC. Valid UTC calendar events still compare exactly.
- Extended the registered comparison claim across CSV, valid UTC calendar, `TZID`, and floating-time branches.
- Added multiple working windows per weekday with add/remove controls, overlap validation, exports, comparison, saved-config migration, and split demo data.
- Raised effective phone targets to 44 × 44 px across navigation, demo controls, file controls, text links, footer links, and new window controls.
- Rebuilt `/offline.html` with complete metadata, the shared page shell, legal links, route focus, and plain recovery copy.
- Applied every remaining copy correction and refreshed the claim registry, demo notes, copy audit, design record, README, and verb-first catalog description.
- Fingerprinted compiled assets and injected those exact filenames into service-worker cache v9, so immutable caching cannot retain old app code.
- Preserved the Time Boundary Console identity, original observatory artwork, Vite/TypeScript stack, and static deployment class.

The full finding-by-finding map is in `.factory/polish-3.md`.

## Run and verify

Use Node.js 20 or later:

    npm ci
    npm test
    npm run build
    npm run test:e2e

Run every exact command in `.factory/claims.json`. The production artifact is `dist/`.

## Verification evidence

- Clean clone of the repaired commit: `npm ci` installed 61 packages with zero vulnerabilities.
- Unit suite: 10/10 passed.
- Claim suite: all 12 exact registry commands passed separately on desktop and 390 px, 2/2 per claim.
- Combined browser suite: 41 passed; one desktop run was intentionally skipped because the target-size audit is defined only for the 390 px project.
- Browser Axe integration: zero serious or critical findings across the populated app, demo, stale state, legal routes, Offline, and 404.
- Local verifier: root, demo, Offline, Privacy, Terms, and 404 all reported correct title, `lang=en`, one h1, main, alt coverage, and no console errors.
- Live cold verifier: the same six pages passed. A real missing route returned HTTP 404 with the product-owned title and h1.
- Live interaction audit: 12 sample rows, two split-Wednesday rows, one boundary row, successful UTC calendar match, zoned/floating rejection, no stale success verdict, no third-party requests, no console errors, no 390 px overflow, and no undersized interactive targets.
- Live demo isolation: a seeded real key survived unchanged; the demo key remained separate and was removed by Start for real.
- Live offline check: a fresh demo visit gained service-worker control and reloaded the complete sample with the network disabled.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.7 s, TBT 20 ms, CLS 0.
- Production sizes: app JS 26.64 KB raw / 9.18 KB gzip; CSS 18.14 KB raw / 4.67 KB gzip; hero WebP 139.03 KB.
- Deployment identity: local and live `index.html` SHA-256 both `019c801014153a3814178526d01d34bb123173d65277efe8b311a358c4a04fd8`.
- Screenshots and verifier JSON: `.factory/evidence/polish-3/local/` and `.factory/evidence/polish-3/live/`.

## Known gaps

None. The documented scope remains intentional: this browser-local tool audits declared weekly hours and imported UTC files; it does not reproduce proprietary scheduler rules.
