# Availability DST Audit — build handoff

Work order: `availability-dst-audit-build-1`

Completed: 27 August 2026

## What shipped

- A complete local-first audit flow for weekly organizer hours, organizer/comparison IANA zones, and date ranges up to 371 days.
- Civil-time resolution through the browser’s IANA data, including explicit detection of nonexistent spring-forward times and duplicated fall-back times.
- A dated expected-slot matrix showing declared organizer hours, UTC fixture hours, comparison-zone projections, duration, and text-labeled findings.
- DST boundary identification and first-scheduled-window flags after each offset change.
- Downloadable CSV evidence and UTC-based ICS fixtures generated from the same audited rows. Invalid missing-time rows are omitted from ICS; ambiguous rows use the earlier occurrence and are labeled for review.
- Local configuration persistence, no server processing or analytics, repeat-visit offline support, explicit offline messaging, and stale-result protection after form changes.
- Responsive behavior verified at 390×844, keyboard-native forms/actions, designed focus states, reduced-motion handling, and readable table overflow.
- Purpose-built “Time Boundary Console” visual system plus original Factory-generated pixel observatory artwork. Prompt, tool, review criteria, and provenance are recorded in `.factory/design.md` and `assets/src/`.
- Privacy and terms pages, MIT license, README, service worker, robots/sitemap files, and Azure Static Web Apps security/cache headers.

## How to run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

The exact deploy command is `npm run build`. Output lands in `dist/`, with `dist/index.html` at its root.

Verification performed against the production build served by `npm run preview`:

- `npm test`: 7/7 unit and timezone fixture tests passed.
- `npm run test:e2e`: 4/4 desktop and 390px Chromium tests passed, covering the audit, boundary matrix, persisted configuration, CSV/ICS downloads, legal pages, horizontal overflow, console errors, and axe checks.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, title present, `lang="en"`, exactly one `h1`, main landmark present, zero images missing alt, zero unlabeled buttons, zero console/page errors.
- Axe: zero serious or critical violations on the populated audit and both legal pages.
- Lighthouse mobile: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**.
- Lighthouse key metrics: **LCP 1.7s, CLS 0, Total Blocking Time 10ms, Speed Index 0.9s**.
- Production asset sizes: **15.84 KB JS** (6.11 KB gzip), **13.76 KB CSS** (3.95 KB gzip), **139.03 KB WebP hero**; all remain below the factory budgets.
- Reproducibility: `npm ci`, tests, and build completed with zero package vulnerabilities.

## Known limits

- v1 supports one continuous availability window per weekday. Split shifts can be audited as separate runs.
- Timezone accuracy follows the IANA database shipped with the user’s browser/OS; the UI and terms tell users to keep it current.
- The audit models declared recurring wall-clock availability only. It intentionally does not model vendor-specific buffers, holidays, date overrides, minimum notice, or proprietary booking rules.
- Automated browser coverage is Chromium desktop/mobile. The implementation uses evergreen platform APIs, but Firefox and Safari were not automated in this work order.

## Suggested next steps

- Add multiple intervals per weekday if users need lunch breaks or split shifts in one fixture.
- Add optional import of a vendor-exported slot CSV for direct expected-versus-observed diffing, without adding calendar account sync.
- Run automated Firefox/WebKit smoke coverage in CI when those browser binaries are available.
