# Availability DST Audit — polish 1 handoff

Work order: `availability-dst-audit-polish-1`
Base: `1e8d147707c49e8df572194101db06ff47b1e395`
Repair commits: `d47f8d44aa823779fde01234b36910e5c692e7be`, `2e2e6cdfe9395a919a2912dfcf55315b603659f7`.

## Delivered

- Plain first screen for people who publish booking availability.
- One-click `/?demo=1` sample sandbox and `/demo/` entry, with separate `demo:` local storage, reset, and discard-on-exit behavior.
- Completed London/New York March 2026 sample audit with CSV and ICS downloads.
- Tested claims registry, demo documentation, copy audit, catalog description, and a full browser claim suite.
- Product-owned 404, Static Web Apps rewrite, route metadata, consistent navigation and legal footers.
- Mobile navigation and demo banner layout that retain 390px width without document overflow.
- Stable build asset names and a service-worker shell that caches the sample route for offline reload.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Run each exact command listed in `.factory/claims.json` to verify every visitor-facing claim from `/?demo=1`.

## Evidence

- Fresh `npm ci`: 61 packages installed, 0 vulnerabilities.
- `npm test`: 7/7 Vitest tests passed.
- `npm run build`: passed; writes `dist/` with root `index.html`. Initial JavaScript is 17.45 KB (6.60 KB gzip) and CSS is 15.37 KB (4.21 KB gzip). Runtime WebP hero is 139.03 KB.
- `npx playwright test tests/claims.spec.ts`: 16/16 passed across desktop and 390px mobile.
- Every individual command from `.factory/claims.json` passed (each runs desktop and mobile): sample audit, browser IANA, exports, time edge cases, demo isolation, privacy-local requests, and offline reload.
- `npx playwright test tests/smoke.spec.ts --project desktop`: 4/4 passed.
- `npx playwright test tests/smoke.spec.ts --project mobile-390`: 4/4 passed.
- Local `verify-url.sh` against `http://127.0.0.1:4173/?demo=1`: HTTP 200, correct title and language, one h1, main landmark, zero missing image alt attributes, zero unlabeled buttons, and zero console/page errors. Screenshots and JSON are in ignored `.factory/evidence/local-demo/`.
- Playwright Axe integration has zero serious or critical findings for the completed demo and stale result state. The standalone axe CLI could not run because the worker has no system Chrome binary; Playwright’s supplied Chromium ran the equivalent Axe scan.

## Deployment

Deployed `dist/` through the configured Azure Static Web Apps work order to <https://witty-beach-05061050f.7.azurestaticapps.net> and <https://availability-dst-audit.sociobot.in>.

- The custom domain returned HTTP 200 for the demo and each legal route.
- A cold live `/?demo=1` browser check found title `Demo — Availability DST Audit`, its visible demo banner, 10 completed rows, working Reset demo and Start for real controls, one h1/main landmark, 390px no-overflow layout, and no console errors.
- Live Privacy and Terms each had their distinct correct title, one h1, and main landmark. This specifically verifies the service worker now uses network-first navigation rather than returning the cached home document for legal routes.
- `/not-a-real-page` returned the designed 404 with status 404, product title, one h1, main landmark, and a sample-audit link.
- `dist/index.html` and live `/` matched SHA-256: `726d7b3d2c38bb4343f7939a1c1ac3d70d617438e2cf592d5bc8f7d34beac1a5`.

## Known scope

The product supports one continuous working window per weekday. It checks declared wall-clock hours using the browser timezone database; it does not model proprietary scheduler rules, overrides, holidays, buffers, or notice periods.
