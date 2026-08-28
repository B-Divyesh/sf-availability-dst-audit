# Availability DST Audit — polish 1 handoff

Work order: `availability-dst-audit-polish-1`
Base: `1e8d147707c49e8df572194101db06ff47b1e395`
Repair commit: appended after commit and deployment.

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

The final Azure Static Web Apps deployment and cold live checks are recorded after the repair commit is pushed.

## Known scope

The product supports one continuous working window per weekday. It checks declared wall-clock hours using the browser timezone database; it does not model proprietary scheduler rules, overrides, holidays, buffers, or notice periods.
