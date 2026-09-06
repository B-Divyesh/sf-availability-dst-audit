# Check booking hours across clock changes — review 6

Reviewed: 6 September 2026
Live URL: <https://availability-dst-audit.sociobot.in/>
Implementation candidate: `2b0b933201a0bc77f06a3a4b7dd79407c4e42272`
Documentation revision: `790425a4e8cb32bb4a637024df59c6f1f943945f`

## Verdict: **FAIL**

There are **3 findings**: 2 blocking and 1 minor. There are **9 untested or incompletely tested public claims**. Passing claim commands do not make an incomplete claim test complete.

The live files match the clean build byte for byte. The core audit, sample, exports, comparison, privacy behavior, offline reload, routes, accessibility checks, and performance checks passed. The findings are limited to claim coverage and one inaccurate invalid-window error.

## First screen before scrolling

Fresh Chromium contexts at 1440 × 900 and 390 × 844 opened the live root with empty site data.

- **Job:** “Check booking hours across clock changes.”
- **Audience:** “For people who publish availability, find hours that shift when daylight saving starts or ends.”
- **First action:** “Try it with sample data.” The next sentence says it opens a completed London–New York audit.

The action ended at 773 px on desktop and 516 px on phone. All three facts ended at 887 px on desktop and 649 px on phone. Both views had zero document overflow. The first screen uses plain job words and contains no metaphor heading.

## Findings

### F-6-1 — BLOCKING — Five public legal and privacy claims have no claim entry or tagged test

The live public pages make these visitor-reliant statements, but `.factory/claims.json` does not list them and no `@claim:` test proves them:

1. Privacy: **“Those logs are not used for profiling.”**
2. Privacy: **“Material updates appear on this page.”**
3. Privacy: clearing site data **“removes saved form settings and demo data.”**
4. Terms: **“The tool is free.”**
5. Terms: **“The source code is available under the MIT License.”**

The clean checkout does contain an MIT `LICENSE`, and the live interface showed no paid tier. Those manual observations do not satisfy the required one-claim/one-tagged-test contract. The profiling and future-update statements cannot be proved in the product sandbox and should be removed or narrowed to testable facts. Add exact claim entries and observable tests for the other statements, or remove them from public copy.

### F-6-2 — BLOCKING — Four claim commands do not prove their full registered claims

All twelve commands exit successfully, but four can pass while a promised part is broken:

| Claim | Missing assertion |
| --- | --- |
| `sample-audit` | The claim names a split Wednesday. Its tagged test checks 12 rows, the boundary, and Monday, but never checks either Wednesday window. |
| `browser-timezone-rules` | The claim says UTC changes while local hours stay fixed. Its test checks both local windows and only the post-change UTC window, so it never proves the UTC value changed. |
| `multiple-daily-windows` | The claim says every window appears in “exports.” Its test checks the audit and CSV only. No tagged test proves split windows appear in the calendar export. |
| `privacy-local` | The sandbox promises request capture through file comparison. Its test opens the in-memory demo comparison, exports CSV, and resets, but never selects a user file and runs **Compare published file** while recording requests. |

Independent live checks showed both Wednesday windows in CSV and in all 12 calendar events, and the present implementation kept requests on the product origin. This confirms current behavior, not the missing regression coverage. Extend the four exact tagged tests so each command proves its complete claim.

### F-6-3 — MINOR — An empty added window reports the wrong window number

On the live demo, keyboard activation of **Add working window** adds Wednesday window 3. Leaving it empty and running the audit announces:

> Wednesday window 1 must end after it starts.

Wednesday window 1 is valid (`09:00–12:00`); the new third window is invalid. Validation sorts windows before numbering errors, so an empty value moves to the first sorted position. The alert is announced and the audit is safely stopped, but the recovery message points to the wrong row. Keep the original displayed index when reporting validation errors and add an invalid-added-window test.

## One-click sample, storage, and real data

- The root action reached `/demo/` in one keyboard or pointer action.
- The persistent page label says **“Demo — sample data, nothing is saved.”** It remained present after a sample edit and after reset.
- The completed sample had 12 rows, two `2026-03-25` Wednesday windows, one `2026-03-30` boundary row, and the London change `UTC+00:00 → UTC+01:00`.
- The populated comparison reported 9 matched, 1 missing, 1 extra, 1 shifted, and 1 duration change.
- CSV contained 12 data rows and both split Wednesday windows. Calendar export contained 12 events and both split Wednesday starts.
- A seeded real value under `availability-dst-audit:config:v1` remained byte-for-byte unchanged during the demo. Demo entry wrote only `demo:availability-dst-audit:config:v1`.
- **Reset demo** restored Europe/London and the original sample. **Start for real** removed the demo key and preserved the seeded real key.

No real user data was changed.

## Normal, invalid, boundary, and recovery paths

- A real London/New York audit for 23 March–3 April 2026 produced 10 weekday rows and one boundary row.
- `EST` was rejected with a focused `role="alert"`: “Enter a valid organizer timezone name, such as Europe/London.” Replacing it with `Europe/London` recovered successfully.
- An end date before the start date was rejected with the correct recovery sentence.
- A 371-day inclusive window completed with 265 weekday rows. Adding one more day was rejected with the documented limit.
- Changing a populated comparison zone replaced old results with the fresh-run state, removed the table, disabled both exports, and produced no serious or critical axe issue.
- The registered edge-case command passed missing spring time, repeated fall time, earlier repeated occurrence, and calendar omission checks.
- Zoned and floating calendar inputs were rejected by the published-comparison claim command; valid UTC calendar input matched.

## Claims and clean-checkout commands

A new clone of `origin/main` resolved to documentation revision `790425a`. `npm ci` installed 61 packages with zero audit vulnerabilities.

| Command | Result |
| --- | --- |
| `npm test` | PASS — 10/10 |
| `npm run build` | PASS — `dist/` produced |
| Every exact command printed from `.factory/claims.json` | PASS — 12 commands, 24/24 desktop and phone executions |
| `npm run test:e2e` | PASS — 43 passed, 1 intentional desktop skip for the phone-only target audit |

Exact claim-command results:

| Claim id | Command result | Contract coverage |
| --- | --- | --- |
| `sample-audit` | PASS 2/2 | Incomplete; see F-6-2 |
| `browser-timezone-rules` | PASS 2/2 | Incomplete; see F-6-2 |
| `first-boundary-window` | PASS 2/2 | Complete |
| `exports` | PASS 2/2 | Complete |
| `time-edge-cases` | PASS 2/2 | Complete |
| `comparison-date-change` | PASS 2/2 | Complete |
| `published-comparison` | PASS 2/2 | Complete |
| `multiple-daily-windows` | PASS 2/2 | Incomplete; see F-6-2 |
| `demo-isolation` | PASS 2/2 | Complete |
| `real-storage` | PASS 2/2 | Complete |
| `privacy-local` | PASS 2/2 | Incomplete; see F-6-2 |
| `offline-reload` | PASS 2/2 | Complete |

Each id occurs exactly once in `tests/claims.spec.ts`. Five additional public claims are missing from the registry; see F-6-1.

## Accessibility, keyboard, phone, and motion

- The factory URL verifier passed Root, Demo, Privacy, Terms, and Offline after the documented global Playwright dependency was used. The initial attempt pointed it at an uninstalled local dependency and failed before opening the product; it was rerun correctly.
- Live Playwright axe scans found zero serious or critical issues on Root, Demo, Privacy, Terms, Offline, the designed 404, and the stale-result state at 390 px.
- Every visible enabled demo control passed the 44 × 44 px effective target audit. Root and Demo had no 390 px document overflow.
- The skip link, sample link, add-window button, and run button were operated from the keyboard. The skip link moved focus to the page heading. Route entry focused and announced its h1.
- Focus outlines computed to a 2 px signal-green solid outline. Errors use a focused alert.
- Reduced motion changed button duration to `0.00001s` and scrolling to `auto`.
- A 200% text-size stress retained the heading, main content, and sample action. Enlarged content remained reachable by scrolling.
- Phone screenshots and full-page desktop screenshots were inspected for Root and Demo. The intended stacked phone layout and horizontally scrollable result table remained usable.

## Privacy, offline, links, and routes

- The live demo/edit/export/reset/exit request log used only `https://availability-dst-audit.sociobot.in`. No third-party request, console error, or page error occurred.
- The service worker controlled `/demo/`, `registration.update()` completed, cache `availability-dst-audit-v9` existed, and a network-disabled reload restored the banner, verdict, and all 12 rows.
- Root, Demo, Privacy, Terms, and Offline returned 200. Titles follow the required route pattern, with `lang="en"`, one h1, one main, metadata, and shared navigation/footer.
- `/review-6-missing` deliberately returned HTTP 404 and the product page **“That page was not found”** with a route back. This expected 404 is not a defect.
- All root links, favicon, Apple icon, Demo, Privacy, Terms, and the external source link returned 200. `robots.txt`, `sitemap.xml`, and the sample CSV returned 200.
- The live CSP is a response header and allows only the origins the page uses. Security, referrer, permissions, and content-type headers were present.

This is a static browser product. Backend tenant, restart-persistence, health, and 429 checks do not apply. CLI, library, and desktop consumer-install checks do not apply.

## Performance and live identity

Fresh mobile Lighthouse, after using the container-safe full-page screenshot flag, scored:

- Performance 100
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 1.484 s, LCP 1.484 s, TBT 49 ms, CLS 0

The first Lighthouse call lacked the required `CHROME_PATH`; the second browser tab crashed; neither produced a product score. The successful third run used the same installed Playwright Chromium and completed without a runtime error.

Build sizes were 28.75 KB raw JavaScript total, 18.07 KB raw CSS, and 139.03 KB for the loaded WebP hero. They are below the static budgets.

Live and clean-build SHA-256 values matched for root HTML (`525839e9…`), Demo HTML (`398813cb…`), app JavaScript, route JavaScript, CSS, WebP, PNG, and `sw.js`. The last implementation change is therefore `2b0b933`; `2d926e1` and `790425a` are documentation-only revisions.

## Earlier finding disposition

Every earlier review, polish record, handoff, and both independent verification reports was read. Each earlier finding was checked against the current live files and clean checkout.

| Earlier finding | Current disposition and evidence |
| --- | --- |
| Verification P1 — stale result contrast | Fixed. Old rows are removed; exports are disabled; live stale axe has zero serious/critical issues. |
| F-1-1 — unclear first screen | Fixed. Job, audience, sample action, outcome, and three facts fit both first viewports. |
| F-1-2 — no isolated demo | Fixed. `/demo/`, label, completed output, reset, separate key, and safe exit all passed live. |
| F-1-3 — no claims registry/tests | The registry and 12 commands exist and run. New completeness defects are separately recorded in F-6-1 and F-6-2. |
| F-1-4 — unlisted landing claims | Fixed for the landing claims named in review 1. New legal/privacy omissions are F-6-1. |
| F-1-5 — unlisted README claims | Fixed for the README claims named in review 1. All documented setup commands ran. |
| F-1-6 — jargon and metaphor copy | Fixed. Current job, state, error, and method copy uses the recorded plain terminology. |
| F-1-7 — Azure 404 | Fixed. A real missing URL returns the designed product page with HTTP 404. |
| F-1-8 — route metadata/navigation | Fixed. All required public documents have route metadata and the shared skeleton. |
| F-2-1 — demo result below the phone screen | Fixed. Verdict begins at 372 px and the first row at 680 px. |
| F-2-2 — five false boundary rows | Fixed. The demo has one boundary row; later rows are ordinary expected rows. |
| F-2-3 — false README boundary rule | Fixed. README uses the first-enabled-window rule. |
| F-2-4 — inconsistent terminology | Fixed. Audit results, expected availability file, working windows, and published slots remain consistent. |
| F-2-5 — incomplete Demo route | Fixed. `/demo/` is a complete document with title, metadata, h1, and main. |
| F-2-6 — missing route focus | Fixed. Privacy and hash navigation focused and announced their headings; Back focused the root h1. |
| F-2-7 — no published-file comparison | Fixed. The sample and claim command cover missing, extra, shifted, and duration changes. |
| F-3-1 — unsafe timezone-qualified calendar import | Fixed. Zoned and floating values fail; UTC values match. |
| F-3-2 — undersized phone targets | Fixed. The current live target scan found none below 44 × 44 px. |
| F-3-3 — inconsistent Offline route | Fixed. Offline uses the shared title, metadata, navigation, footer, and recovery words. |
| F-3-4 — imprecise boundary wording | Fixed. Copy says “first enabled working window after each clock change.” |
| F-3-5 — inaccurate results heading | Fixed. The heading is “Expected times in each timezone.” |
| F-3-6 — unexplained import abbreviations | Fixed. The UI names spreadsheet/calendar files and README defines UTC. |
| F-3-7 — no split working hours | Fixed in behavior. Two sample windows, add/remove, audit, CSV, and live calendar output passed. F-6-2 records the missing calendar assertion. |
| F-4-1 — decorative figure label | Fixed. No `FIG 01` label exists; the useful caption remains. |

No earlier product defect regressed. This review’s three findings are newly identified contract gaps.

## Missed leverage

No additional feature finding. The brief’s useful extension is already present: expected CSV/calendar export and imported published-slot comparison. Account sync would conflict with the local, vendor-neutral scope. A model would not improve deterministic timezone conversion or exact slot matching.

## Required next work

1. Remove or register and test the five public statements in F-6-1.
2. Complete the four tagged claim tests in F-6-2.
3. Preserve displayed window numbering in validation and test the blank added-window path.
4. Run every claim command again from a clean checkout, then repeat the live privacy and sample checks after deployment.
