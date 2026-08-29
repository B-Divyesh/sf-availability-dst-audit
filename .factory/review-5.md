# Adversarial first-read review 5 — Availability DST Audit

Reviewed: 29 August 2026

Live URL: <https://availability-dst-audit.sociobot.in/>

Source revision: `2d926e1ff17d1adba499274b4e4bce5e0bd1922a`

## Verdict: **PASS**

Zero findings remain. The live product is clear on first read, opens a completed isolated sample in one click, passes every registered claim test, and meets the route, copy, privacy, accessibility, and history checks below.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 opened the production root with empty browser storage. Before scrolling, I could answer all three required questions:

- **What it does:** checks booking hours across clock changes.
- **For whom:** people who publish availability and need to find hours that shift when daylight saving starts or ends.
- **What to click first:** **“Try it with sample data.”** The adjacent text says **“See a completed London–New York audit.”**

The action starts at 468 px on the phone and 763 px on desktop, so it is visible in both first screens. The phone first screen also shows all three facts: **“Runs in your browser,” “No account,”** and **“Export spreadsheet or calendar files.”** Neither viewport has horizontal overflow. The exact first-screen copy answers the job, audience, and first-action questions without relying on the illustration.

## Findings

None.

## Copy audit

Counts use whitespace-delimited words. Slash-separated entries are separate copy units with separate counts. The landing audit includes headings, controls, labels, the initial empty state, disclosure text, and state-specific sentences. Repeated weekday controls are grouped only where their wording is identical. No unit exceeds 22 words. No jargon, banned marketing adjective, inconsistent product term, metaphor or mood heading, empty slogan, or non-result-naming action was found.

### Landing page

| Location | Words | Exact copy |
| --- | ---: | --- |
| Document title | 7 | Availability DST Audit — check booking hours |
| Skip link | 4 | Skip to audit setup |
| Wordmark | 2 | Availability/DST Audit |
| Navigation | 1 / 1 / 3 / 1 | Home / Demo / How it works / Privacy |
| Kicker | 3 | Daylight-saving availability check |
| H1 | 6 | Check booking hours across clock changes |
| Hero sentence | 15 | For people who publish availability, find hours that shift when daylight saving starts or ends. |
| Primary action | 5 | Try it with sample data |
| Action outcome | 6 | See a completed London–New York audit. |
| Facts | 4 / 2 / 5 | Runs in your browser / No account / Export spreadsheet or calendar files |
| Illustration caption | 6 / 5 | Clock changes can shift booking hours. / Check the dates that change. |
| Setup label / heading | 2 / 6 | Audit setup / Set working hours and test dates |
| Setup sentences | 5 / 9 | Enter the organizer’s local hours. / Pick a second timezone to compare the booking time. |
| Hours legend | 4 | Set weekly working hours |
| Hours help | 9 / 7 | Only enabled days appear in the expected availability file. / Add separate windows for split working days. |
| Repeated schedule labels | 1 each / 3 / 1 each | Sunday / Monday / Tuesday / Wednesday / Thursday / Friday / Saturday; Add working window; Open / Closed |
| Date and zone legend | 4 | Choose timezones and dates |
| Form labels | 2 / 2 / 2 / 2 | Organizer timezone / Comparison timezone / Start date / End date |
| Zone help | 7 / 7 | Use names such as Europe/London or America/New_York. / Do not use abbreviations such as EST. |
| Audit-check heading | 4 | What the audit checks |
| Audit-check sentence | 18 | It marks the first enabled working window after each clock change, plus missing, repeated, duration-changed, or date-shifted times. |
| Storage notice | 10 | Run an audit to save this form in this browser. |
| Run action | 2 | Run audit |
| Results label / heading | 3 / 2 | Expected availability file / Audit results |
| Export actions | 3 / 3 | Export CSV spreadsheet / Export calendar (.ics) |
| Empty state | 4 / 10 / 2 | No audit results yet / Set the working hours and dates, then run an audit. / Review configuration |
| Method label / heading | 3 / 4 | How it works / How the audit works |
| Method 1 | 4 / 13 | Use your working hours / The browser checks each local time using timezone rules built into your browser. |
| Method 2 | 3 / 11 / 10 | Find clock-change dates / The report marks the first enabled working window after each clock change. / It also marks times that repeat or do not occur. |
| Method 3 | 3 / 16 / 9 | Compare published times / Import a CSV spreadsheet or calendar (.ics) file whose start and end times are in UTC. / The report finds missing, extra, shifted, and duration-changed slots. |
| Disclosure summary | 7 | How repeated and missing local times work |
| Disclosure sentences | 6 / 7 / 10 | Repeated local times are marked Review. / The calendar file uses the earlier occurrence. / Missing local times are marked Invalid and omitted from it. |
| Footer sentence | 6 | Check booking hours around daylight-saving changes. |
| Footer links | 1 / 1 / 3 | Privacy / Terms / Source (opens GitHub) |
| Build and provenance | 7 / 12 | Built by Param Factory · build polish-4. / Hero artwork was generated for this project with the Factory image model. |

### Landing state-specific copy

| State | Words | Exact copy |
| --- | ---: | --- |
| Stale notice | 2 / 6 | Configuration changed. / Run the audit again before exporting. |
| Stale heading | 6 | Audit results need a fresh run |
| Stale explanation | 17 / 4 | The previous audit results are hidden because they no longer match the declared hours, zones, or dates. / Run the audit again. |
| Clear verdict | 7 | No missing or repeated times found |
| Result labels | 2 / 3 / 3 | Audit verdict / Detected organizer boundaries / Expected availability times |
| Boundary explanation | 13 | A clock-change row is the first enabled working window after an offset change. |
| Results table heading | 5 | Expected times in each timezone |
| No-transition state | 8 / 8 | No organizer offset change occurs in this window. / These audit results remain useful as a baseline. |
| No-row state | 8 / 7 | No enabled availability falls within this date range. / Extend the range or enable another weekday. |
| Comparison instruction | 16 / 5 | Import a CSV spreadsheet or calendar (.ics) file whose start and end times are in UTC. / Files stay in this browser. |
| Comparison headings | 3 / 4 / 4 / 5 | Published availability check / Compare a published file / Published slots need review / Published slots match expected times |
| Comparison controls | 7 / 3 / 4 / 4 | Choose a UTC spreadsheet or calendar file / Compare published file / Download sample published slots / Choose another UTC file |
| Comparison result | 9 | No missing, extra, shifted, or duration-changed slots were found. |
| Comparison empty-file error | 12 | Choose a UTC spreadsheet or calendar file after running a current audit. |
| Demo banner | 7 / 13 | Demo — sample data, nothing is saved. / London hours are checked against New York across the March 2026 clock change. |
| Demo reset | 7 | Demo reset to the original London–New York sample. |
| Demo storage | 14 | Sample changes stay in demo storage and are discarded when you start for real. |
| Storage states | 7 / 6 / 3 / 7 / 2 / 6 | Local preferences are unavailable in this browser. / Configuration saved only in this browser. / Sample audit complete. / Demo storage is unavailable in this browser. / Audit complete. / Local preferences could not be saved. |
| Audit progress and fallback | 3 / 2 / 6 / 6 / 6 | Audit not run. / Running audit… / Audit complete: 12 expected windows computed. / The audit could not be computed. / Check the inputs and try again. |
| Timezone errors | 9 / 9 | Enter a valid organizer timezone name, such as Europe/London. / Enter a valid comparison timezone name, such as America/New_York. |
| Date errors | 7 / 11 / 9 | Choose a valid start and end date. / The end date must be on or after the start date. / Keep the audit window to 371 days or fewer. |
| Schedule errors | 8 / 8 / 8 / 6 | Enable at least one day of weekly availability. / Add at least one working window for Monday. / Monday window 1 must end after it starts. / Monday working windows must not overlap. |
| Calendar errors | 7 / 12 / 10 / 12 / 12 | This calendar uses local or timezone-qualified times. / Export it again with UTC start and end times ending in Z. / A calendar event has invalid UTC start or end times. / Export it again with complete UTC times ending in Z. / No UTC start and end times were found in this calendar file. |
| CSV errors | 10 / 8 / 13 / 13 | Add a CSV header and at least one published slot. / CSV needs UTC columns named start_utc and end_utc. / CSV start and end times must be valid UTC timestamps ending in Z. / No valid UTC start and end times were found in this CSV file. |
| File states | 5 plus filename / 7 / 7 | filename is ready to compare. / Compared 12 published slots in this browser. / The published file could not be read. |
| Demo loading states | 6 / 7 | Demo mode uses separate sample storage. / Loading the completed London–New York sample audit. |
| Demo page headings | 4 / 3 / 6 / 10 | Completed sample booking-hours audit / Completed sample audit / Edit the sample hours and dates / Changes stay in demo storage until you start for real. |
| Offline heading / state | 4 / 9 | The audit is offline / This page was not saved during an earlier visit. |
| Offline recovery / action | 4 / 13 / 5 | Reconnect to load it. / A sample audit works offline after you open the demo once while connected. / Reconnect, then reload the audit |

The action labels name their result or destination: **Try it with sample data, Run audit, Export CSV spreadsheet, Export calendar (.ics), Add working window, Compare published file, Download sample published slots, Reset demo, Start for real,** and **Review configuration**.

### README

Shell commands are executable syntax rather than sentences; all prose, headings, and link labels are listed below.

| Location | Words | Exact copy |
| --- | ---: | --- |
| H1 | 3 | Availability DST Audit |
| Opening | 10 | Check booking hours across daylight-saving changes before you publish availability. |
| Audience | 14 | For consultants, recruiters, and coordinators who publish booking hours in more than one timezone. |
| Demo link | 4 | Try the completed sample |
| H2 | 3 | What it does |
| Capability | 8 | Creates dated expected booking times from weekly hours. |
| Capability | 7 | Supports multiple working windows on each weekday. |
| Capability | 10 | Marks the first enabled working window after a clock change. |
| Capability | 6 | Marks missing or repeated local times. |
| Capability | 12 | Exports the same results as a CSV spreadsheet or calendar (.ics) file. |
| Capability | 10 | Compares imported UTC spreadsheet or calendar slots with expected availability. |
| Timezone scope | 9 | The browser uses timezone rules built into your browser. |
| Definition | 11 | IANA is the public timezone-name standard behind names such as Europe/London. |
| Limitation | 12 | The tool does not model scheduler buffers, holidays, overrides, or account settings. |
| Import requirement | 13 | Imported start and end times must use UTC, which means Coordinated Universal Time. |
| Import limitation | 8 | The tool rejects timezone-qualified or floating calendar times. |
| H2 | 3 | Run and verify |
| Requirement | 5 | Use Node.js 20 or later. |
| Verification instruction | 9 | Run every published claim check from the sample sandbox. |
| Code comment | 4 | Run each printed command. |
| Build sentence | 10 | npm run build writes the deployable static site to dist. |
| H2 | 3 | Privacy and demo |
| Privacy sentence | 10 | The audit, exports, and file comparison run in the browser. |
| Demo sentence | 15 | The sample demo uses separate local storage and is discarded when you start for real. |
| Reference sentence | 7 | See the demo notes, Privacy, and Terms. |
| Offline sentence | 9 | After one connected visit, the sample audit reloads offline. |
| H2 | 1 | Deploy |
| Deployment sentence | 13 | This is a Vite and TypeScript static site for Azure Static Web Apps. |
| Deployment instruction | 8 | Deploy dist; the factory manages infrastructure and DNS. |
| H2 | 2 | Project records |
| Record links | 5 / 2 / 1 / 2 | Visual system and asset provenance / Claim registry / Handoff / MIT License |

README defines IANA and UTC at first use. The product consistently uses **expected availability file**, **audit results**, **clock-change row**, **published slots**, **working windows**, **CSV spreadsheet**, **calendar (.ics) file**, and **timezone rules built into your browser**.

## Demo, sandbox, privacy, and offline checks

- The root action reaches `/demo/` in one click.
- At 390 × 844, the persistent demo banner, Reset demo, Start for real, both export actions, completed verdict, boundary summary, and first rows are visible in the first screen. The verdict starts at 372 px.
- The sample contains 12 rows, two Wednesday windows, the 29 March London change, and a published-slot comparison with one missing, one extra, one shifted, and one duration-changed slot.
- With `availability-dst-audit:config:v1` seeded to Pacific/Auckland, demo entry wrote only `demo:availability-dst-audit:config:v1`. Reset restored Europe/London. Start for real removed the demo key and preserved the seeded real value byte-for-byte.
- The live demo/export/reset/exit request log used only `https://availability-dst-audit.sociobot.in`; no third-party request occurred.
- After a fresh connected demo visit and service-worker control, the production demo reloaded offline with its banner, verdict, and all 12 rows.

## Claims verification

A separate clean clone at the reviewed revision received `npm ci`, `npm test`, and `npm run build`. Every exact command in `.factory/claims.json` was then run independently. Each claim passed in the desktop and 390 px projects.

| Claim id | Result | Observed evidence |
| --- | --- | --- |
| `sample-audit` | PASS (2/2) | 12 rows, London/New York hours, and the March 2026 boundary |
| `browser-timezone-rules` | PASS (2/2) | London local hours stay fixed while UTC changes |
| `first-boundary-window` | PASS (2/2) | 30 March alone is boundary-marked; later rows are not |
| `exports` | PASS (2/2) | CSV rows and UTC calendar event inspected |
| `time-edge-cases` | PASS (2/2) | Missing/repeated times and calendar omission/earlier occurrence inspected |
| `comparison-date-change` | PASS (2/2) | Prior comparison date and flag observed |
| `published-comparison` | PASS (2/2) | Four finding types, UTC CSV/calendar, and invalid calendar rejection exercised |
| `multiple-daily-windows` | PASS (2/2) | Split Wednesday plus add/remove/export exercised |
| `demo-isolation` | PASS (2/2) | Separate key, reset, discard, and preserved real key verified |
| `real-storage` | PASS (2/2) | One real configuration key after a completed audit |
| `privacy-local` | PASS (2/2) | Complete demo flow request log remains product-origin only |
| `offline-reload` | PASS (2/2) | Completed sample reloads after network is disabled |

The full browser suite completed with 43 passes and one intentional desktop skip for the mobile-only target-size branch. Landing and README claims map to the registry entries above; technical setup statements were confirmed by the clean build. No unlisted or untested claim was found.

## Structure, links, accessibility, and visual identity

- Root, Demo, Privacy, Terms, Offline, and a real missing URL have route-specific titles, descriptions, canonicals, Open Graph/Twitter metadata, favicon and Apple touch icon, `lang="en"`, one h1, and one main.
- Titles follow the required pattern. The root is **“Availability DST Audit — check booking hours”**; subordinate routes put their route name first.
- `/review-5-missing` returns HTTP 404 with the designed heading **“That page was not found”** and an **“Open the sample audit”** route back.
- Every internal link and downloadable sample returned 200. The GitHub Source link returned 200. All tested hash targets exist.
- The header and footer are consistent across all six route documents. Privacy, Terms, the product one-line description, Param Factory credit, and build id are present.
- Privacy navigation focuses and announces its h1. Browser Back restores the root position and focuses the root h1; direct hash navigation focuses its target heading.
- The production CSP is delivered as a response header and matches the same-origin asset/request policy. `nosniff`, referrer policy, permissions policy, robots, and sitemap are present.
- The factory URL verifier reports zero console errors and correct title/lang/h1/main/alt basics on every 200 route. Live Playwright Axe scans at 390 px found zero serious or critical issues. The full suite confirms 44 px phone targets, no horizontal overflow, stale-result behavior, and route focus; the stylesheet supplies the reduced-motion override.
- The built app JavaScript is 27.15 KB raw / 9.30 KB gzip; CSS is 18.07 KB raw / 4.66 KB gzip.
- The dark pixel-console layout, stepped borders, tabular time treatment, amber boundary line, green expected state, and original timezone-observatory art match `.factory/design.md`. The result is recognizably product-specific rather than a generic SaaS template.

## History audit

Every earlier review, polish record, and handoff was read. Each finding was then checked in the current live deployment and current code rather than accepted from its repair note.

| Earlier finding | Current live and code confirmation |
| --- | --- |
| F-1-1 — unclear first screen | Fixed: the job, audience, sample action, adjacent outcome, and three facts are visible at both cold viewports. |
| F-1-2 — no isolated demo | Fixed: `/demo/` and `?demo=1` open the completed sample; the banner, separate key, Reset, and Start for real work. |
| F-1-3 — no claim registry/tests | Fixed: 12 registry entries each have a tagged browser test; all exact commands pass twice. |
| F-1-4 — unlisted landing claims | Fixed: landing behavior maps to the 12 tested claims; no unlisted landing claim remains. |
| F-1-5 — unlisted README claims | Fixed: README behavior maps to the same registry; technical setup statements were independently run. |
| F-1-6 — jargon and metaphor copy | Fixed: the complete copy audit above has no flagged term, metaphor heading, slogan, or overlong sentence. |
| F-1-7 — Azure 404 | Fixed: a live missing URL returns the product-designed 404 with HTTP 404 and a route back. |
| F-1-8 — metadata/navigation gaps | Fixed: every route has complete metadata and the same header/footer skeleton. |
| F-2-1 — demo results below first screen | Fixed: the completed verdict starts at 372 px on the phone and sample rows begin in the first screen. |
| F-2-2 — five false boundary rows | Fixed: only 30 March is marked; the four later rows are explicitly asserted not to be boundary rows. |
| F-2-3 — false README boundary rule | Fixed: README uses the tested first-enabled-window wording. |
| F-2-4 — inconsistent terminology | Fixed: landing, demo, stale, error, README, and export copy use the terminology table consistently. |
| F-2-5 — incomplete demo route | Fixed: `/demo/` is a complete canonical document with its own title, description, social metadata, h1, and main. |
| F-2-6 — missing route focus | Fixed: forward, Back, and hash navigation focus and announce the destination heading while preserving history position. |
| F-2-7 — no published-file comparison | Fixed: local CSV/calendar import reports missing, extra, shifted, and duration-changed slots. |
| F-3-1 — unsafe timezone-qualified calendar import | Fixed: UTC calendar data matches; timezone-qualified and floating data produce the corrective error in tests and code. |
| F-3-2 — undersized phone targets | Fixed: the current mobile target audit finds no enabled visible target below 44 × 44 px. |
| F-3-3 — inconsistent offline route | Fixed: Offline uses the shared route skeleton, metadata, focus behavior, and plain recovery action. |
| F-3-4 — imprecise boundary wording | Fixed: live copy says “first enabled working window after each clock change.” |
| F-3-5 — inaccurate result heading | Fixed: the live heading is “Expected times in each timezone.” |
| F-3-6 — unexplained import abbreviations | Fixed: landing names spreadsheet/calendar files and README defines UTC as Coordinated Universal Time. |
| F-3-7 — no split working hours | Fixed: multiple windows work in the demo, form, audit, CSV, and calendar output. |
| F-4-1 — decorative figure label | Fixed: no `FIG 01` text exists live or in the current landing source; the useful caption remains. |

No earlier finding is half-fixed, unfixed, or regressed.

## Missed leverage

No finding. The brief’s obvious import/export leverage is present: users can export expected CSV/calendar files and import published UTC slots for exact comparison. Account sync would conflict with the local-first, vendor-neutral scope. AI would not improve deterministic timezone conversion or exact slot matching, so a Sociobot gateway feature would be decorative rather than useful.

## What would make this perfect

Nothing remains to change based on this review. Preserve the current result by keeping live copy, `claims.json`, and the tagged demo tests in lockstep whenever behavior changes.
