# Check booking hours across clock changes — verification 3

Verified: 6 September 2026  
Live URL: <https://availability-dst-audit.sociobot.in/>  
Implementation candidate: `7d2b2717e0c9225e74104abe1e88ee23305820b4`  
Starting documentation revision: `2aacaf69a271f8ca2559246556d3f74c74c7f149`

## Verdict: **FAIL**

There are **2 findings**, both minor. There are **0 untested claims**. The audit calculations, sample sandbox, exports, file comparison, privacy behavior, offline reload, accessibility checks, and delivery checks passed. A successful worker run is not a product PASS under the zero-finding rule.

## First screen before scrolling

Fresh Chromium contexts opened the live root at 1440 × 900 and 390 × 844 with empty site data.

- Job: **“Check booking hours across clock changes.”**
- Audience: **“For people who publish availability, find hours that shift when daylight saving starts or ends.”**
- First action: **“Try it with sample data.”** The adjacent result says **“See a completed London–New York audit.”**

The action ended at 815 px on desktop and 516 px on phone. All three phone facts ended at 649 px. The 390 px page had no horizontal overflow. The first screen uses plain job words and no metaphor heading.

## Findings

### V3-1 — MINOR — A one-window audit uses the wrong plural

**Live result:** a real or demo audit with one expected window announces **“Audit complete: 1 expected windows computed.”**

**Why this fails:** the completion message is public product copy and is grammatically incorrect for a normal one-day audit. The copy audit lists only the 12-window form, so this state-specific sentence was missed.

**Evidence:** live one-day London/New York audit; `src/app.ts:377` always inserts “windows.” The result itself is correct.

**Fix:** select “window” when the row count is one and add a browser assertion for the one-window completion message.

### V3-2 — MINOR — Successful completion is presented with error semantics

**Live result:** after a successful audit, **“Audit complete: 12 expected windows computed.”** appears in the pink danger color. The same element keeps `role="alert"` for errors and success.

**Why this fails:** `.factory/design.md` reserves `#ff7a90` for invalid or missing values. A successful result therefore looks like an error, and an assertive alert is unnecessarily used for routine completion.

**Evidence:** live desktop and phone sample; `index.html:59` defines `#form-status` as an alert, `src/style.css:124` applies `var(--danger)`, and `src/app.ts:377` writes success into it. Axe reports no automated violation; this is a manual state-feedback finding.

**Fix:** give errors and success separate state styling and live-region behavior. Keep focused `role="alert"` for errors; announce completion through a polite status and use the verified-state color.

## One-click sample and isolation

- The root action opened `/demo/` in one click.
- The persistent label said **“Demo — sample data, nothing is saved.”** Reset and Start for real remained available.
- The sample showed 12 rows, both Wednesday windows (`09:00–12:00` and `13:00–17:00`), one 30 March boundary row, and the London offset change.
- The populated comparison showed 9 matched slots and one each missing, extra, shifted, and duration-changed.
- CSV had 12 data rows. Calendar output had 12 events. Both exports contained both Wednesday windows.
- Adding `18:00–19:00` as Wednesday window 3 produced 14 rows and included all three windows in both exports.
- Leaving window 3 empty focused the alert and named **“Wednesday window 3”**. Correcting it recovered successfully.
- Reset restored the 12-row, two-window sample. A seeded real storage value stayed byte-for-byte unchanged. Start for real removed the demo key and retained the real key.

## Normal, invalid, boundary, and recovery paths

- A real London/New York audit for 23 March–3 April produced 10 rows, one clock-change row, and one real storage key.
- Editing a completed audit removed stale rows, disabled both exports, and produced zero axe violations.
- `EST` and a reversed date range produced specific recovery messages in a focused alert.
- A 372-day inclusive range was rejected. The 371-day boundary completed with 265 expected windows.
- The London spring missing time and fall repeated time were marked. Fall output also reported the 60-minute duration change.
- A valid UTC calendar matched. Timezone-qualified calendar data was rejected. A selected CSV file compared successfully.
- No console or page error occurred in these live flows.

## Claims and clean-checkout commands

The documented setup worked from the clean checkout:

- `npm ci`: 61 packages, zero audit vulnerabilities.
- `npm test`: 11/11 passed.
- `npm run build`: passed and produced `dist/`.
- Every exact command in `.factory/claims.json`: 12 commands, 24/24 desktop and phone executions passed.
- `npm run test:e2e`: 47 passed and one intentional desktop skip for the phone-only target audit.
- Each of the 12 claim ids occurs in exactly one tagged browser test.

| Claim | Result | Complete evidence |
| --- | --- | --- |
| `sample-audit` | PASS 2/2 | 12 rows, both Wednesday windows, London boundary |
| `browser-timezone-rules` | PASS 2/2 | fixed local hours and different UTC windows before/after change |
| `first-boundary-window` | PASS 2/2 | 30 March alone marked; four later rows rejected as boundaries |
| `exports` | PASS 2/2 | CSV rows and UTC calendar event inspected |
| `time-edge-cases` | PASS 2/2 | missing/repeated times, omission, and earlier occurrence |
| `comparison-date-change` | PASS 2/2 | prior comparison date and flag |
| `published-comparison` | PASS 2/2 | four finding kinds, valid CSV/calendar, invalid calendar rejection |
| `multiple-daily-windows` | PASS 2/2 | three windows in audit, CSV, and six calendar starts across two Wednesdays |
| `demo-isolation` | PASS 2/2 | separate key, reset, discard, preserved real key |
| `real-storage` | PASS 2/2 | only one real form-configuration key |
| `privacy-local` | PASS 2/2 | selected-file comparison included in same-origin request capture |
| `offline-reload` | PASS 2/2 | isolated context restored the completed sample without network |

Landing, demo, state, legal, and README copy was cross-checked against the registry. No missing, false, partial, or untested public claim remains. The two findings concern feedback wording and presentation, not an untested operational promise.

## Accessibility, keyboard, phone, and motion

- The factory URL verifier passed Root, Demo, Privacy, Terms, Offline, and direct 404 documents with correct title, `lang`, one h1, one main, image alternatives, and zero console errors.
- Fresh live axe scans found zero violations of any severity on those six documents. The stale state also had zero serious or critical violations.
- Every visible enabled phone control passed the 44 × 44 px effective-target audit.
- The skip link was keyboard reachable and operable. Its focus outline was 2 px signal green. Route entry and Back focused the page h1.
- Reduced motion changed transition duration to `0.00001s` and scroll behavior to `auto`.
- A 200% text-size check retained the page content without document overflow.
- Screenshots were visually inspected at desktop and phone sizes. The stacked form and horizontally scrollable results remained usable.

## Privacy, offline, links, routes, and 404

- Live demo, exports, selected-file comparison, reset, and exit used only `https://availability-dst-audit.sociobot.in`.
- Service-worker update completed, cache `availability-dst-audit-v9` was active, and a network-disabled reload restored the demo label and all 12 rows.
- Root, Demo, Privacy, Terms, and Offline returned 200 with route-specific titles and the shared skeleton.
- A deliberately missing URL returned HTTP 404 with **“That page was not found”** and a route to the sample. This expected 404 is not a defect.
- Every actual page link, hash target, source link, sample download, favicon, Apple icon, social image, `robots.txt`, and `sitemap.xml` returned successfully.
- CSP, HSTS, content-type, referrer, and permissions headers were present. The CSP is delivered as a response header.

This is a static browser product. Backend tenant isolation, SQLite restart persistence, health, and 429 checks do not apply. CLI, library, and desktop consumer checks do not apply.

## Performance and deployed identity

Fresh mobile Lighthouse scored:

- Performance 99
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 1.1 s, LCP 1.6 s, TBT 110 ms, CLS 0

Build output was 28.82 KB raw JavaScript, 18.07 KB raw CSS, and a 139.03 KB loaded hero WebP. These pass the static-product budgets.

Live root HTML SHA-256 was `cc8823ab8c4b137f45d7b5d6d43d61c647e3a255fc66683f20217c0da8170e64`, exactly matching `dist/index.html`. All referenced hashed JavaScript, CSS, and image assets also matched. Only `.factory/handoff.md` differs between `7d2b271` and starting documentation SHA `2aacaf6`, so `7d2b271` is the implementation reviewed.

## Earlier finding disposition

All six reviews, both earlier verification reports, four polish records, and the prior handoff were read before retesting.

| Earlier finding | Current proof |
| --- | --- |
| Verification P1 — stale-result contrast | Fixed: stale rows disappear, exports disable, and live stale axe has zero serious/critical issues. |
| F-1-1 — unclear first screen | Fixed: job, audience, sample action, outcome, and facts fit both cold viewports. |
| F-1-2 — no isolated demo | Fixed: completed one-click sample, banner, separate key, reset, and safe exit passed live. |
| F-1-3 — no claim registry/tests | Fixed: 12 entries, one tag each, and 24/24 exact executions passed. |
| F-1-4 — unlisted landing claims | Fixed: current landing behavior maps to complete tagged tests. |
| F-1-5 — unlisted README claims | Fixed: README behavior maps to the registry; setup and build commands passed. |
| F-1-6 — jargon and metaphor copy | Fixed: current headings and instructions use the recorded plain terms. V3-1 is a new singular-state defect. |
| F-1-7 — third-party 404 | Fixed: a real missing URL returns the designed product 404 with HTTP 404. |
| F-1-8 — route metadata/navigation | Fixed: all routes have titles, metadata, shared navigation, footer, and focus behavior. |
| F-2-1 — demo below phone first screen | Fixed: verdict starts above 620 px and sample rows are immediately available. |
| F-2-2 — false boundary rows | Fixed: exactly one boundary marker; later rows are ordinary expected rows. |
| F-2-3 — false README boundary rule | Fixed: README uses the tested first-enabled-window rule. |
| F-2-4 — inconsistent result terms | Fixed: expected availability file, audit results, working windows, and published slots are consistent. |
| F-2-5 — incomplete Demo route | Fixed: `/demo/` is a full canonical route with its own title and h1. |
| F-2-6 — missing route focus | Fixed: route entry and Back focus the h1; the polite announcement is present. |
| F-2-7 — no published comparison | Fixed: live CSV/calendar comparison covers missing, extra, shifted, and duration changes. |
| F-3-1 — unsafe calendar import | Fixed: explicit UTC matches; zoned and floating values are rejected by the claim test. |
| F-3-2 — small phone targets | Fixed: no visible enabled target below 44 × 44 px. |
| F-3-3 — incomplete Offline route | Fixed: Offline has the shared skeleton, metadata, focus, and plain recovery action. |
| F-3-4 — imprecise boundary words | Fixed: copy names the first enabled working window. |
| F-3-5 — inaccurate table heading | Fixed: **“Expected times in each timezone.”** |
| F-3-6 — unexplained file abbreviations | Fixed: UI names spreadsheet/calendar files; README defines UTC. |
| F-3-7 — no split working hours | Fixed: two sample windows plus add/remove, audit, CSV, and calendar paths passed. |
| F-4-1 — decorative figure label | Fixed: `FIG 01` is absent; the useful caption remains. |
| F-6-1 — five untested legal/privacy claims | Fixed: the five statements are absent and no replacement untested claim was found. |
| F-6-2 — four incomplete claim tests | Fixed: both Wednesday windows, UTC change, calendar split windows, and selected-file privacy are asserted. |
| F-6-3 — wrong added-window number | Fixed: live alert names Wednesday window 3 and recovery succeeds. |

No earlier defect regressed. V3-1 and V3-2 are new minor findings in successful completion feedback.

## Evidence

- `.factory/evidence/verification-3/` contains URL verifier output, screenshots, live audit scripts, and Lighthouse JSON in this workspace.
- `/work/.evidence/live-audit.json` and `/work/.evidence/live-paths.json` contain the independent live assertions.

Final counts: **2 findings; 0 untested claims; FAIL.**
