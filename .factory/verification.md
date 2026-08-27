# Independent verification — FAIL

Verified candidate: `ed89d5e74fb3b4aa8b71abc805c1c57b65c7b43a` (`ed89d5e`, detached clean checkout)

Verified URL: <https://availability-dst-audit.sociobot.in> on 2026-08-27

## Verdict

**FAIL.** The release-blocking accessibility gate is not met. A completed audit becomes an axe **serious** `color-contrast` failure as soon as the configuration changes and the stale-result state is shown.

## Defects

### P1 — stale result matrix fails text contrast

Reproduction:

1. Run a valid `Europe/London` / `America/New_York` audit from `2026-03-23` to `2026-04-03`.
2. Change the comparison zone to `Europe/Berlin` without rerunning.
3. Run axe on the stale page.

`#results[data-stale="true"] > :not(.stale-note) { opacity: .42; }` reduces all retained result text below required contrast. `@axe-core/playwright` reports `color-contrast` at **serious** severity: for example, `Audit verdict` is 2.48:1, `Organizer date` table headers are 2.41:1, and boundary text is 3.02:1. The stale notice itself is visible, but the old matrix remains readable/interactive enough to be exposed to users while failing the non-negotiable contrast requirement.

Suggested remediation: hide or replace the stale matrix with an accessible empty/stale state, or use a non-opacity treatment that keeps every exposed text/UI color at least 4.5:1 (3:1 only where the large-text rule genuinely applies). Re-run axe after changing a populated configuration.

## Evidence that passed

### Reproducibility and automated suites

- `npm ci`: completed, 60 packages added, 0 vulnerabilities.
- `npm test`: **7/7** Vitest tests passed.
- `npm run build`: passed (`tsc --noEmit && vite build`) and produced `dist/`.
- `npm run test:e2e`: **4/4** Playwright tests passed on desktop and 390px mobile after installing the pinned Chromium binary with `npx playwright install chromium`. The first invocation correctly reported the disposable environment's missing browser executable; it was not an application failure.
- No repository lint script exists. The build performs the available TypeScript check.

### Functional and boundary coverage (independent Chromium checks)

- Normal fixture: London weekday `09:00–17:00`, 2026-03-23 through 2026-04-03, reported `2026-03-29: UTC+00:00 → UTC+01:00`; Monday 2026-03-30 stayed `09:00–17:00` locally and became `08:00–16:00` UTC. CSV and ICS downloads were enabled with the expected `availability-fixture-2026-03-23.{csv,ics}` names.
- Stale protection: changing a field showed “Configuration changed. Run the audit again before exporting.” and disabled both exports.
- Invalid zone: `EST` was rejected with an IANA-zone error and focus moved to `#form-status`; recovery with `Europe/London` succeeded.
- Invalid weekly schedule: all days disabled was rejected.
- Missing civil time: Sunday 2026-03-29 `01:30–02:30` in London rendered `× Invalid`, `Missing local time`, and an unresolvable UTC window.
- Crossing the spring change: Sunday `00:30–02:30` rendered `! Review`, UTC `00:30–01:30`, and `Duration drift -60m` (separately re-run after the invalid-time case).
- Boundary limit: a 371-day difference was rejected with “Keep the audit window to 371 days or fewer.”
- Initial, populated, invalid-time, and legal-page axe scans had no serious/critical issues; only the populated stale state above fails.

### Browser, responsive, privacy, and delivery checks

- Desktop and 390px mobile rendered without horizontal document overflow (`scrollWidth == clientWidth == 390`); primary run control measured 358×48px and CSV control 174×44px on mobile. Visual inspection found the intentional stacked mobile layout and usable horizontally-scrollable fixture table.
- Keyboard: first Tab reaches the skip link; its computed focus ring is `rgb(141, 240, 166) solid 2px`. Form errors focus the alert region.
- Reduced motion: emulated `prefers-reduced-motion: reduce` gave `.button` a `0.00001s` transition and `html` `scroll-behavior: auto`.
- Offline: after service-worker control, an offline reload rendered the complete audit shell. The service worker has `Cache-Control: no-cache`, `skipWaiting`, and versioned-cache cleanup; its update path was source-reviewed.
- No console errors or page errors were observed in independent local or live runs. Browser request capture saw no outbound runtime requests beyond the tested origin. Static inspection confirms localStorage-only preferences, Blob downloads, no analytics, no CDN fonts/scripts, and a self-only CSP `connect-src`.
- Live production normal-flow check passed with the same London fixture, no console errors, and no external requests.

### Deployment identity, headers, and budgets

- The live `/` response body SHA-256 exactly matches candidate `dist/index.html`: `c221ac4384adf04fdb1a614a3e392a51e5d00d270710b30ec2a96b2398578072`.
- Live `main-C-JrSl3x.js`, `style-BrfrvNbN.css`, WebP/PNG artwork, and `sw.js` SHA-256 values exactly match `dist/`; therefore the tested live deployment matches the candidate artifact.
- Live headers include HSTS, CSP (`default-src 'self'`, `connect-src 'self'`, `frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, strict referrer policy, and camera/microphone/geolocation denial. Hashed JS/CSS have `public, max-age=31536000, immutable`; `/sw.js` is `no-cache`; HTML uses short revalidation (`max-age=30`).
- Build output: initial JS 15.84 KB (6.11 KB gzip), CSS 13.76 KB (3.95 KB gzip), WebP 139.03 KB. All are within the stated static-web budgets.

## Scope notes

This is a static web product, not a library/CLI or backend; pack/install, API, concurrency, persistence-boundary, and health checks do not apply. It has an offline service worker but no web manifest; the offline reload and update behavior were checked accordingly.
