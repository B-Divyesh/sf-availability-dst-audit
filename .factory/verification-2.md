# Independent verification 2 — PASS

Verified candidate: `7494dae746f64d9ef009547f74fd7c370398be64` (`7494dae`)

Verified URL: <https://availability-dst-audit.sociobot.in/> on 2026-08-28.

## Verdict

**PASS.** The deployed static web product matches the candidate artifact and meets the researched brief: it converts recurring local hours and IANA zones into an auditable DST matrix, identifies the relevant civil-time failures, and exports CSV/ICS expected-slot fixtures. No P0, P1, or P2 defects were found.

The earlier P1 stale-results contrast failure is fixed in this candidate: changing a populated configuration replaces the old matrix with a high-contrast "Fixture needs a fresh run" state, removes the table, and disables both exports until rerun.

## Reproducibility and quality gates

- Clean checkout was already exactly `7494dae` with no working-tree changes. `npm ci` completed (61 packages; `npm audit` reported 0 vulnerabilities).
- `npm test`: **7/7** Vitest tests passed.
- `npm run build`: passed (`tsc --noEmit && vite build`) and produced `dist/`.
- `npm run test:e2e`: **6/6** Playwright tests passed on desktop Chromium and 390 x 844 mobile against the exact `npm run preview` production artifact.
- No lint script is defined; the available static type check is part of the production build.
- Build budgets: JS **16,312 B** raw / **6.25 KB gzip** (under 200 KB); CSS **14,268 B** raw / **4.01 KB gzip** (under 50 KB); WebP hero **139,032 B** (under 300 KB). No runtime fonts are shipped.
- Live Lighthouse mobile performance preset: **97 Performance**, **100 Accessibility**; FCP **1.5 s**, LCP **1.5 s**, CLS **0**, TBT **180 ms**. The run used the installed Playwright Chromium and `--disable-full-page-screenshot`; it completed with exit code 0 and no runtime error.

## Independent product exercise

All cases below were driven through Chromium against the production build, with console/page error capture and then repeated on the live custom domain where relevant.

- Normal DST fixture: `Europe/London` weekday `09:00-17:00`, compared with `America/New_York`, from `2026-03-23` through `2026-04-03`. It reported the organizer boundary `2026-03-29: UTC+00:00 -> UTC+01:00`; Monday `2026-03-30` remained `09:00-17:00` local and became `08:00-16:00` UTC. CSV and ICS downloads were enabled with names `availability-fixture-2026-03-23.csv` and `.ics`.
- Missing civil time: enabled Sunday `2026-03-29 01:30-02:30` in London produced `Missing local time` and an `Invalid` row.
- Ambiguous civil time: Sunday `2026-10-25 01:30-02:30` in London produced `Ambiguous local time` and a `Review` row.
- Invalid/recovery paths: `EST` was rejected with the IANA-zone error; an end date before start was rejected; a 371-day date difference was rejected; and disabling every weekday was rejected. Restoring valid values ran a fresh matrix successfully.
- Stale protection: editing a field after a result showed the stale notice, replacement state, no result table, and disabled exports. The existing regression test covers desktop and 390px mobile.
- Storage and exports: the last successful configuration persisted only to localStorage; downloads were browser-created CSV/ICS blobs.

## Accessibility, responsive, and interaction checks

- One `h1`, `main`, `lang="en"`, title, labels, skip link, legal pages, image alt text, and semantic table/caption were present.
- `@axe-core/playwright` found **0 serious/critical** violations for populated results, stale results, missing-time results, and live normal results. Live Lighthouse accessibility was 100.
- Keyboard-only smoke: first Tab reached the visible skip link; Enter ran the audit. The organizer-zone focus style computed to signal-green `rgb(141, 240, 166)`, solid, 2px.
- At 390px, document `scrollWidth == clientWidth == 390`; the intended result table remains horizontally scrollable inside its labelled wrapper. The 44px-or-larger form/button controls were usable.
- Under emulated `prefers-reduced-motion: reduce`, transition duration became `0.00001s` and smooth scrolling was disabled.
- No console errors or uncaught page errors occurred in the independent local or live browser runs.

## Privacy, PWA, delivery, and deployment identity

- Browser request capture recorded **no third-party runtime requests**. Source inspection and live CSP confirm no analytics, tracking pixels, CDN fonts/scripts, or schedule transmission: computation is browser-local, localStorage holds preferences, and fixtures are Blob downloads.
- Live policy headers: HSTS; `Content-Security-Policy` with `default-src 'self'`, `connect-src 'self'`, and `frame-ancestors 'none'`; `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; and camera/microphone/geolocation denied by Permissions Policy.
- Cache policy is correct for static delivery: HTML is short-revalidated (`public, must-revalidate, max-age=30`), hashed JS/CSS/images are `public, max-age=31536000, immutable`, and `/sw.js` is `no-cache`.
- Service worker check on the live origin: registration and controller both resolved to `/sw.js`; cache `availability-dst-audit-v1` existed; `registration.update()` succeeded; after service-worker control, an offline reload rendered the complete audit shell. This product has offline support but no web manifest, so it is not tested as an installable PWA.
- Deployment identity: live `/` SHA-256 was `8be4dae40827b91319f41bff3a2e45ed9e302ccc9178ab968c27853c1aaafb0c`, exactly equal to `dist/index.html`. Live hashes also exactly matched candidate `dist` for `main-BHCus8Qe.js`, `style-C2Dg30Um.css`, both hero assets, and `public/sw.js`.

## Defects by severity

- **P0:** none.
- **P1:** none.
- **P2:** none.
- **P3 / known product limits (not defects):** v1 deliberately supports one continuous window per weekday and models declared wall-clock hours, not vendor-specific buffers, overrides, holidays, or proprietary scheduler rules. Timezone accuracy depends on the browser/OS IANA data, as disclosed in the product.

## Scope

This is a static web application, not a library/CLI or backend. Package-consumer, API, concurrency, persistence-boundary, and health/build-identity checks do not apply. The only persistence is disclosed localStorage; the relevant offline/service-worker behavior was tested above.
