# Polish 1 — review finding closure

Base reviewed: `1e8d147707c49e8df572194101db06ff47b1e395`
Repair commit: recorded after this document is committed.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rewrote the first screen with the plain job headline, named people who publish availability, a one-click sample action, stated outcome, and three short facts. | `tests/claims.spec.ts` sample audit; `.factory/evidence/local-demo/screenshot-desktop.png`; local `/?demo=1` check. |
| F-1-2 | Added direct `/?demo=1` and `/demo/` entry, realistic completed London/New York sample, persistent banner, Reset demo, Start for real, and a separate `demo:` storage key. | `@claim:demo-isolation`; `.factory/demo.md`; local `/?demo=1` screenshot. |
| F-1-3 | Added `.factory/claims.json` with one tagged browser test for each published claim and a `test:claims` script. | All seven commands in `claims.json` passed on desktop and mobile. |
| F-1-4 | Replaced broad untestable landing promises with seven scoped claims. Tests cover sample rows, IANA offset behavior, missing/repeated times, CSV/ICS downloads, local-only requests, demo storage, and offline reload. | `@claim:sample-audit`, `@claim:browser-iana`, `@claim:time-edge-cases`, `@claim:exports`, `@claim:privacy-local`, `@claim:demo-isolation`, `@claim:offline-reload`. |
| F-1-5 | Rewrote README to match the scoped product claims and documented the demo and claim commands. | README review; all claim commands above; `npm test` passed. |
| F-1-6 | Replaced metaphors and specialist-first language throughout the landing page and README. Recorded the word-count and terminology audit. | `.factory/copy-audit.md`; local desktop and 390px screenshots. |
| F-1-7 | Added a styled `404.html` and Azure Static Web Apps 404 rewrite. | `tests/smoke.spec.ts` “product-owned 404”; local `/404.html`; deploy check pending below. |
| F-1-8 | Added canonical, OG, Twitter, and Apple-touch metadata; consistent four-link headers; complete footers; demo sitemap entries; and build wording. | `tests/smoke.spec.ts` legal/404 checks; source review of all routes; local verify report. |

## Regression closure

The earlier stale-result contrast finding remains fixed. Changing a completed configuration replaces the table with a high-contrast rerun state. `tests/smoke.spec.ts` “replaces stale audit output with an accessible rerun state” passed on desktop and 390px.

## Local evidence

- `.factory/evidence/local-demo/verify.json`: title `Demo — Availability DST Audit`, `lang=en`, one h1, main landmark, no missing image alt text, no console errors.
- `.factory/evidence/local-demo/screenshot-desktop.png` and `screenshot-mobile.png`: completed sample audit at the required 390px and desktop layouts.
- Playwright Axe integration found no serious or critical issues in the completed sample and stale state. The standalone `@axe-core/cli` binary could not start because this worker has no system Chrome; it was superseded by the installed Playwright Chromium integration.

## Deployment re-check

The deployed URL, response status, screenshots, and route checks are appended to `.factory/handoff.md` after deployment.
