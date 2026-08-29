# Polish 3 — cumulative finding closure

Base review commit: `e1b939c646d7c7e9925be25104e1de473a6f3388`

Reviewed candidate: `596393ae61ad99b472c61f2aece8fa648224407c`

Repair commits: `e2db8be6208b7193ea75fc853d07d0434c3e2744`, `e077349`, `55c0c9b`

Deployment: `459aec1e-f0f3-4ab7-8b37-da43ba662e95`

Live URL: <https://availability-dst-audit.sociobot.in/>

Every review-1, review-2, and review-3 finding was rechecked. Earlier repairs remain present; round-three changes close the seven remaining findings.

## Review 1 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the job-first headline, named audience, sample action, adjacent outcome, and three facts on the first screen. | `@claim:sample-audit`; `.factory/evidence/polish-3/live/root/screenshot-mobile.png`; live root CTA top 468 px at 390 × 844. |
| F-1-2 | Kept direct `?demo=1` and canonical `/demo/`, separate `demo:` storage, persistent banner, Reset demo, Start for real, and immediate completed results. | `@claim:demo-isolation`, `@claim:sample-audit`; `.factory/evidence/polish-3/live/demo/screenshot-mobile.png`; live `/?demo=1` has 12 rows. |
| F-1-3 | Expanded `.factory/claims.json` to 12 claims, each with exactly one tagged browser test. | Every exact registry command passed 2/2 from a clean clone. |
| F-1-4 | Kept tests for sample rows, timezone rules, boundary selection, edge cases, exports, comparison dates, privacy, and browser-only work. | `tests/claims.spec.ts`; full clean-clone claim run; live demo request origins contained only the product origin. |
| F-1-5 | Kept README claims aligned with the registry and added tested split-day and strict-UTC behavior. | README; all 12 `@claim:*` tests. |
| F-1-6 | Retained plain job language and one output vocabulary; rewrote the remaining calendar and boundary terms. | `.factory/copy-audit.md`; no sentence over 22 words and no banned term. |
| F-1-7 | Preserved the product-owned 404 and Azure 404 response override. | `product-owned 404 provides a semantic way back`; live `/not-a-real-polish-3-final` returned 404 with the product title and h1. |
| F-1-8 | Preserved route-specific metadata, shared navigation/footer, legal links, focus management, social image, and build identity. | `demo is a complete canonical route and route changes focus the page heading`; live verify reports for root, demo, Privacy, Terms, and 404. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Kept the completed demo report before setup. The verdict and two full sample rows fit in the first phone screen. | `demo is accessible and its completed report starts in the first mobile screen`; live verdict top 334 px and second row bottom 827 px at 390 × 844. |
| F-2-2 | Kept the exact first-enabled-window boundary algorithm and negative checks for every later row. | `@claim:first-boundary-window`; live demo has one boundary row. |
| F-2-3 | Kept the README boundary wording identical to the tested rule. | README; `@claim:first-boundary-window`. |
| F-2-4 | Kept one plain vocabulary for audit results and expected availability files. | `.factory/copy-audit.md`; stale-state browser test. |
| F-2-5 | Kept `/demo/` as a complete canonical document and gave direct `?demo=1` the same title, descriptions, canonical, h1, and focus behavior. | `demo is a complete canonical route and route changes focus the page heading`; live `/demo/` verify JSON and cold `?demo=1` metadata check. |
| F-2-6 | Kept route and hash focus movement plus polite announcements. Added the same behavior to the offline route. | Route-focus browser test; offline-shell browser test; live offline h1 was focused. |
| F-2-7 | Kept local spreadsheet/calendar comparison for missing, extra, shifted, and duration-changed slots. | `@claim:published-comparison`; live demo reports one of each seeded finding. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | Calendar imports now accept only explicit UTC values ending in `Z`. Zoned and floating events fail with a corrective message, and stale match output is cleared. The registered claim now exercises CSV, valid UTC calendar data, `TZID`, and floating data. | Unit test `accepts UTC calendar events and rejects timezone-qualified or floating calendar times`; `@claim:published-comparison`; live cold audit passed all four branches. |
| F-3-2 | Raised header, footer, demo, file, text-link, and window controls to 44 px effective targets with at least 8 px between adjacent controls. | `visible phone controls have effective targets of at least 44 by 44 pixels`; zero failures across root, demo, Privacy, Terms, Offline, and 404 at 390 px; live target audit also returned none. |
| F-3-3 | Replaced the inline fallback with a built route using the shared header, navigation, footer, legal links, metadata, favicon, stylesheet, focus script, and plain recovery wording. | `offline fallback uses the shared route skeleton and plain recovery copy`; `.factory/evidence/polish-3/live/offline/screenshot-mobile.png`; live `/offline.html`. |
| F-3-4 | Replaced “first post-change window” with the exact tested first-enabled-window rule. | Copy audit; exact live-copy assertion; `@claim:first-boundary-window`. |
| F-3-5 | Renamed the table heading to “Expected times in each timezone.” | Live heading assertion; `.factory/evidence/polish-3/live/demo/screenshot-mobile.png`. |
| F-3-6 | Rewrote import instructions and controls as spreadsheet/calendar language, states the UTC requirement at selection, and defines UTC in README. | `@claim:published-comparison`; README and copy audit; live zoned/floating rejection checks. |
| F-3-7 | Added repeatable add/remove working-window controls, overlap validation, multi-row auditing/export/comparison, storage migration, and a split Wednesday in the demo. | `@claim:multiple-daily-windows`; unit test `includes multiple non-overlapping working windows on one weekday`; live demo has 12 rows and two rows on each Wednesday. |

## Additional closure found during self-review

Compiled JS, CSS, and image assets now use content hashes before receiving immutable cache headers. The build injects the exact fingerprinted filenames into service-worker cache v9.

Evidence: `production assets are fingerprinted and included in the offline cache`; live HTML loads `app-sI9yq48s.js`, and live `sw.js` lists every generated asset.

## Final evidence

- Clean-clone install: 61 packages, zero audit vulnerabilities.
- Unit: 10/10 passed.
- Claims: all 12 registry commands passed independently on desktop and 390 px, 2/2 each.
- Combined Playwright suite: 41 passed, one intentional desktop skip for the mobile-only target audit.
- Axe: zero serious/critical findings in the browser suite.
- Local verifier: root, demo, Offline, Privacy, Terms, and 404 had titles, `lang=en`, one h1, main, complete image alternatives, and zero console errors.
- Live verifier: the same six documents passed after deployment; screenshots are under `.factory/evidence/polish-3/live/`.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.7 s, TBT 20 ms, CLS 0.
- Build: app JS 27.15 KB raw / 9.30 KB gzip; CSS 18.14 KB raw / 4.67 KB gzip; hero WebP 139.03 KB.
- Deployment identity: live and local `index.html` SHA-256 both `52d5ce88ca6d8849a4fb7f85d5f897746160fd56dc0fa1d47ef5110e9a7a22b2`.

No finding remains unresolved.
