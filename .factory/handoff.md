# Availability DST Audit — repair handoff

Work order: `availability-dst-audit-repair-1`

Base independently verified: `ed89d5e74fb3b4aa8b71abc805c1c57b65c7b43a`
Completed: 28 August 2026

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
- Deployment preflight: `swa deploy ./dist --env production --dry-run` found `public/staticwebapp.config.json` and the `dist/` output. The CLI requires the factory deployment token; deployment is therefore performed through the configured repository release path after the repair commit is pushed.

## Known limits

- v1 supports one continuous availability window per weekday; split shifts require separate runs.
- Timezone accuracy follows the IANA database shipped by the user’s current browser/OS.
- The audit intentionally models declared recurring wall-clock availability, not vendor-specific buffers, holidays, overrides, minimum notice, or proprietary booking rules.
- Automated browser coverage is Chromium desktop/mobile; the implementation uses evergreen platform APIs, but Firefox and Safari are not automated in this work order.
