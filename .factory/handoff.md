# Availability DST Audit — review handoff

Work order: `availability-dst-audit-review-1`
Completed: 28 August 2026

## Result

Independent adversarial review is **FAIL**. No product code was changed. The full report is `.factory/review-1.md`.

The deployed product's manual DST audit works, but it does not meet this review's product contract: its first screen is not plain about the job/audience/first click, `/demo` is a 404 and no isolated sample-data mode exists, `.factory/claims.json` and claim-tagged tests are absent, and the deployed 404 is Azure's generic page. The report also records unlisted landing/README claims, copy counts/rewrites, and missing route metadata/navigation requirements.

## Verification performed

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

All commands passed locally: 7 Vitest tests, production build to `dist/`, and 6 Playwright smoke tests. Fresh deployed-browser checks ran at 390 x 844 and 1440 x 900. The manual London/New York fixture rendered and export controls enabled; request capture contained only the product origin and no console/page errors. These checks do not substitute for the missing demo and per-claim tests.

## Required next steps

Implement every finding in `.factory/review-1.md`, beginning with F-1-1 through F-1-5 and F-1-7. Add and test `/demo` before claiming privacy, offline, export, or DST-detection behaviour. Re-run an adversarial review from a clean clone and deployed browser after repair.

---

# Previous repair handoff

Work order: `availability-dst-audit-repair-1`

Base independently verified: `ed89d5e74fb3b4aa8b71abc805c1c57b65c7b43a`

Repair implementation: `9703ba64db4dd98174f71934d2027f6c95550c4d`
Completed: 28 August 2026

## Verification 2 release verdict — PASS

Independent verification of deployed candidate `7494dae746f64d9ef009547f74fd7c370398be64` at <https://availability-dst-audit.sociobot.in/> passed on 2026-08-28. The live HTML, JS, CSS, artwork, and service worker hashes exactly match the candidate production build. `npm ci`, `npm test` (7/7), `npm run build`, and `npm run test:e2e` (6/6 desktop + 390px mobile) passed; independent DST boundary/error-recovery, keyboard, axe, privacy/network, headers/cache, service-worker update/offline, and live-deployment checks passed. Lighthouse mobile: 97 Performance, 100 Accessibility, 1.5 s LCP, 0 CLS.

There are no P0/P1/P2 defects. Detailed, reproducible evidence is in `.factory/verification-2.md`.

## Release-blocking repair

The independent verifier's P1 stale-result contrast failure is repaired. Previously, changing a populated configuration left the old result matrix in the accessibility tree and visually faded it with `opacity: .42`; this reduced retained text as low as 2.41:1 contrast.

Changing a populated configuration now replaces the outdated matrix with a clear, high-contrast **“Fixture needs a fresh run”** state. It keeps the exact stale warning, explains why the old fixture is hidden, disables CSV/ICS exports, and requires a rerun before fresh results are shown. No visible stale text is opacity-muted.

`tests/smoke.spec.ts` has an exact regression test for the verifier's London/New York audit followed by a comparison-zone change. On both desktop and 390px mobile it asserts the stale notice, replacement state, removed matrix, disabled exports, and no serious/critical axe violations.

## Product behavior retained

- Local-first weekly-hours, IANA-zone, and date-range audit through a maximum 371-day window.
- Civil-time treatment of spring-forward missing times, fall-back repeated times, boundary rows, UTC projection, comparison-zone projection, and duration drift.
- CSV and UTC ICS expected-slot fixture downloads after a current audit only.
- Local configuration storage, no analytics or third-party runtime requests, offline shell support, privacy/terms pages, and Azure Static Web Apps security/cache configuration.
- The documented single-mode Time Boundary Console visual system and original Factory-generated observatory artwork are unchanged. See `.factory/design.md` for provenance and visual rationale.

## How to run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

`npm run build` type-checks with `tsc --noEmit` and writes the static Azure artifact to `dist/`, including `dist/index.html`. There is no separate lint or package-consumer surface for this static web product. Playwright is pinned to `1.58.2`, matching the provided Chromium binary.

## Exact verification evidence

All checks below were run against the repaired production build served locally by `npm run preview` on 28 August 2026.

- `npm ci`: completed; 61 packages installed; **0 vulnerabilities**.
- `npm test`: **7/7** Vitest timezone, validation, matrix, CSV, and ICS tests passed.
- `npm run build`: passed and produced `dist/`; initial JS **16.31 KB** (6.25 KB gzip), CSS **14.27 KB** (4.01 KB gzip), and WebP hero **139.03 KB**, all within the static-web budgets.
- `npm run test:e2e`: **6/6** Playwright tests passed across desktop Chromium and 390×844 mobile. This includes the stale-result axe regression, normal DST run, downloads, persistence, legal pages, and 390px overflow assertion.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/`: HTTP 200; title present; `lang="en"`; one `h1`; `main` present; zero images missing alt; zero unlabeled buttons; zero console/page errors.
- Direct browser checks: initial and stale-result axe scans had **zero serious/critical** violations; first Tab reached the visible skip link; Space activated the Run audit button; stale state had no table and no `data-stale` opacity rule; CSV/ICS were disabled.
- Offline/update checks: after service-worker control, an offline reload retained the audit shell. `sw.js` uses a versioned cache, `skipWaiting`, cache cleanup, and client claiming. The public Static Web Apps config sets `sw.js` to `Cache-Control: no-cache` and hashed `/assets/*` to one-year immutable caching.
- Privacy/network checks: runtime request capture contained only `http://127.0.0.1:4173`; static inspection found localStorage-only preferences, Blob downloads, no analytics/tracking, no CDN fonts/scripts, and self-only CSP `connect-src`.
- Responsive/browser checks: at 390×844, `scrollWidth == clientWidth == 390`; all browser checks had zero console/page errors.
- Lighthouse mobile (simulated throttling): **Performance 100, Accessibility 100, Best Practices 100, SEO 100**; LCP **1.7 s**, CLS **0**, Total Blocking Time **40 ms**, Speed Index **0.9 s**.
- Production deployment: Azure Static Web Apps deployed `dist/` to `https://witty-beach-05061050f.7.azurestaticapps.net` using the configured `sf-availability-dst-audit` production app and `public/staticwebapp.config.json`.
- Live identity: the Azure hostname and `https://availability-dst-audit.sociobot.in/` both returned SHA-256 `8be4dae40827b91319f41bff3a2e45ed9e302ccc9178ab968c27853c1aaafb0c`, exactly matching `dist/index.html`. The custom domain responded HTTP 200 with HSTS, self-only CSP, `nosniff`, strict referrer policy, and camera/microphone/geolocation denial.
- Live smoke: `verify-url.sh` against the custom domain found title/lang/one-h1/main/alt/button-label requirements satisfied and zero console/page errors. The live London/New York → Berlin stale-state run had zero serious/critical axe violations, no retained matrix, disabled exports, and same-origin-only runtime requests.

## Known limits

- v1 supports one continuous availability window per weekday; split shifts require separate runs.
- Timezone accuracy follows the IANA database shipped by the user’s current browser/OS.
- The audit intentionally models declared recurring wall-clock availability, not vendor-specific buffers, holidays, overrides, minimum notice, or proprietary booking rules.
- Automated browser coverage is Chromium desktop/mobile; the implementation uses evergreen platform APIs, but Firefox and Safari are not automated in this work order.
