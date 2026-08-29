# Polish 4 — zero-finding closure

Reviewed candidate: `c5f518b66f95f697c80dc65e8160b0eccef02fbd`
Review: `082cb93dd4a4c4716a1e0029148e47d27d3120de`
Repair commit: `2b0b933201a0bc77f06a3a4b7dd79407c4e42272`
Production URL: <https://availability-dst-audit.sociobot.in/>

All reports and earlier polish records were read again. The table maps every historical finding to the current, live implementation and the evidence used in this round. Screenshot and verifier evidence is retained locally under `.factory/evidence/polish-4/`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the job-first heading, named audience, sample action, outcome, and three plain facts. | Live root cold check; `live/root/screenshot-mobile.png`; `@claim:sample-audit`. |
| F-1-2 | Retained `/demo/` and `?demo=1`, the isolated `demo:` key, completed sample, banner, Reset demo, and Start for real. | `@claim:demo-isolation`; live cold demo check; `live/demo/screenshot-mobile.png`. |
| F-1-3 | Retained `.factory/claims.json` with twelve one-to-one tagged browser claims. | Every exact registry command passed independently from a clean clone, 2/2 viewports each. |
| F-1-4 | Kept claim-backed expected rows, timezone behavior, boundary selection, time edges, exports, comparison dates, privacy, and offline behavior. | All twelve `@claim:*` commands; live same-origin request audit. |
| F-1-5 | Kept README product/privacy/offline statements aligned to the registry and demo. | Clean-clone claims matrix; live demo and offline reload checks. |
| F-1-6 | Retained the plain terminology and regenerated the exhaustive copy ledger after removing the last decorative label. | `.factory/copy-audit.md`; live root screenshot. |
| F-1-7 | Retained the styled product 404 and Azure 404 response override. | `product-owned 404 provides a semantic way back`; live `/not-a-real-polish-4` returned 404 with one h1/main. |
| F-1-8 | Retained per-route metadata, canonical URLs, shared header/footer, legal links, sitemap, and security headers. | `demo is a complete canonical route and route changes focus the page heading`; live verifier JSON for all six routes. |
| F-2-1 | Kept the completed demo report ahead of setup; it is visible in the first phone screen. | `demo is accessible and its completed report starts in the first mobile screen`; live verdict top `372px`; `live/demo/screenshot-mobile.png`. |
| F-2-2 | Retained the exact first-enabled-window rule; later rows are ordinary expected rows. | `@claim:first-boundary-window` (2/2); live demo has one clock-change row. |
| F-2-3 | Kept README wording identical to the tested first-enabled-window rule. | README review; `@claim:first-boundary-window`. |
| F-2-4 | Retained one vocabulary for audit results and expected availability files. | `.factory/copy-audit.md`; stale-state browser test. |
| F-2-5 | Retained `/demo/` as a metadata-complete canonical document. | `demo is a complete canonical route and route changes focus the page heading`; `live/demo/verify.json`. |
| F-2-6 | Retained h1 focus and polite announcement for navigation, back/forward, and legal routes. | `demo is a complete canonical route and route changes focus the page heading`; live Privacy and Back focus check. |
| F-2-7 | Retained local CSV/UTC-calendar comparison for missing, extra, shifted, and duration-changed slots. | `@claim:published-comparison` (2/2); live demo comparison result. |
| F-3-1 | Retained strict UTC-only calendar import and corrective errors for zoned/floating data. | `@claim:published-comparison`; unit test `accepts UTC calendar events and rejects timezone-qualified or floating calendar times`. |
| F-3-2 | Retained 44 px effective controls across the shared mobile shell. | `visible phone controls have effective targets of at least 44 by 44 pixels` (mobile project); live 390 px overflow check. |
| F-3-3 | Retained the metadata-complete Offline route and plain recovery copy. | `offline fallback uses the shared route skeleton and plain recovery copy`; `live/offline/verify.json`. |
| F-3-4 | Retained the exact “first enabled working window” wording. | `.factory/copy-audit.md`; `@claim:first-boundary-window`. |
| F-3-5 | Retained the precise result heading “Expected times in each timezone.” | Live demo cold audit; `live/demo/screenshot-desktop.png`. |
| F-3-6 | Retained spreadsheet/calendar wording and the explicit UTC requirement. | `@claim:published-comparison`; README and copy audit. |
| F-3-7 | Retained add/remove split-day windows across audit, exports, stored configuration, and the demo. | `@claim:multiple-daily-windows` (2/2); live 12-row demo. |
| F-4-1 | Removed the non-informative `FIG 01` figure label while retaining the useful image caption; removed its unused styling. | `landing illustration caption gives useful audit context without a decorative figure label` (desktop/mobile); live root cold check reports `hasFigureLabel: 0`; `live/root/screenshot-mobile.png`. |

## Deployment re-check

Built `dist/` and deployed it to the work-order Static Web App `sf-availability-dst-audit` with the Static Web Apps CLI. A fresh live root response contains the caption and `build polish-4`, with no `FIG 01`. The cold production audit confirmed: 12 demo rows, verdict at 372 px on a 390 × 844 screen, demo reset/exit isolation, same-origin requests only, focused Privacy and Back headings, a 404 for `/not-a-real-polish-4`, and a successful offline demo reload.

The live verifier records zero console errors and correct title/lang/h1/main/alt basics for root, demo, Privacy, Terms, Offline, and the product 404. Axe reported zero serious or critical violations on those six live routes. Lighthouse mobile scored Performance 99, Accessibility 100, Best Practices 100, and SEO 100 (FCP 1.0 s, LCP 1.6 s, TBT 70 ms, CLS 0).

No finding remains unresolved.
