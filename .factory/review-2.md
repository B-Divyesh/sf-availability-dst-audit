# Adversarial first-read review 2 — Availability DST Audit

Reviewed: 29 August 2026

Live URL: <https://availability-dst-audit.sociobot.in/>

Source revision: `47144ec7feaa956cf8e48e888d7408abb6050b4e`

Verdict: **FAIL**

The cold landing page is clear, the demo is real, storage isolation works, and the automated suites pass after a clean build. The review still fails because the demo does not put its completed sample in the first screen, the audit labels five rows as the “first” post-change window, several live claims are not represented by `claims.json`, and the demo route is not a complete route for crawlers or non-scripted clients.

## Cold first read

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900 before scrolling.

- **What it does:** checks recurring booking hours around daylight-saving clock changes and exports expected availability.
- **For whom:** people who publish availability; the README narrows this to consultants, recruiters, and coordinators.
- **What to click first:** **“Try it with sample data.”** The adjacent text says it will show a completed London–New York audit.

All three answers are available on the first screen. On mobile the action begins at about 425 px; on desktop it begins at about 772 px. The cold first-read gate passes.

## Findings

### F-2-1 — BLOCKING — The one-click demo still does not show the working product in its first screen

**Historical finding:** reopens **F-1-2** because the repair is only partial.

**Location / exact copy:** after selecting **“Try it with sample data”**, the browser opens `/?demo=1` at the top of the page. The first 390 × 844 screen shows **“Demo — sample data, nothing is saved.”**, the same hero, and the same **“Try it with sample data”** action. The completed **“Expected availability is internally consistent”** report remains several screens below the hero and setup form. The 1440 × 900 first screen also ends before any sample result.

**Why this fails:** the required first screen after the click must already look like the product being used with realistic data. The current click changes the mode but leaves the visitor looking at marketing copy and a redundant sample-data action. A 30-second phone visitor may never discover that the audit has already run.

**Concrete fix:** make demo mode open with the completed verdict, boundary summary, and first sample rows above the fold. Hide the repeated sample CTA in demo mode, or place a compact result preview before the setup form. Keep the banner, Reset demo, and Start for real controls visible.

### F-2-2 — BLOCKING — The report falsely calls five rows the first working window, and the landing claims are not fully registered

**Historical finding:** reopens **F-1-4**.

**Location / exact copy:** landing copy says **“The results show the first working window after an offset change.”** Demo result copy says **“Boundary rows are the first working windows after a clock change.”** The live London/New York sample reports **“5 boundary cases”** and labels 30 March, 31 March, 1 April, 2 April, and 3 April as **“◆ Boundary”**, each with **“DST boundary UTC+00:00 → UTC+01:00.”** Only 30 March is the first enabled window after the 29 March transition.

The broader landing sentence **“It marks offset changes, missing times, repeated times, duration changes, and date changes in the comparison timezone.”** is also not fully represented in `.factory/claims.json`: no listed claim names or test asserts comparison-date changes, and no test asserts that later rows are not boundary rows. **“Run an audit to save this form in this browser.”** is not a listed real-mode persistence claim. **“The ICS file uses the earlier occurrence.”** is also unlisted, and the edge-case test never downloads or inspects an ICS file for the repeated-time case.

**Why this fails:** the core output overstates the number of boundary cases and contradicts the explanation beside it. A user could spend time investigating four ordinary post-transition rows. Passing tests do not protect the promise because `@claim:sample-audit` asserts that 30 March is marked, but never asserts that 31 March–3 April are not marked.

**Concrete fix:** mark only the earliest enabled window after each transition, or rewrite the product everywhere to define and justify a six-day boundary window. Add a negative assertion for later rows. Add claim entries and observable tests for every retained claim about comparison-date changes and real-mode storage, or remove those sentences.

### F-2-3 — BLOCKING — The README repeats the false, unlisted first-window claim

**Historical finding:** reopens **F-1-5**.

**Location / exact copy:** README, **“Shows the first working window after a clock change.”** No `claims.json` entry contains this promise, and the live sample marks five working windows after one change.

**Why this fails:** a visitor or integrator relying on the README receives a specific behavior promise that neither the implementation nor a tagged claim test satisfies.

**Concrete fix:** use the same corrected boundary rule as F-2-2, list the exact promise in `claims.json`, and test both the one expected boundary row and the ordinary rows that follow it.

### F-2-4 — BLOCKING — The earlier plain-language and terminology repair is incomplete

**Historical finding:** reopens **F-1-6** under the required history rule.

**Location / exact copy:** the landing page says **“The browser checks each local time using the selected timezone’s IANA rules.”** README says **“The browser uses its IANA timezone rules.”** Neither defines IANA. Demo output reintroduces **“UTC FIXTURE”**, **“boundary cases”**, and **“Expected availability is internally consistent”** after the static page standardized on **“expected availability file.”** The stale-result state in `src/app.ts` also says **“Fixture needs a fresh run”** and **“The previous matrix is hidden…”** `.factory/copy-audit.md` incorrectly records one result term only.

**Why this fails:** unexplained initials and three names for the same output make the repaired copy less consistent once the visitor actually uses it. “Internally consistent” does not state what the audit found.

**Concrete fix:** use **“the timezone rules built into your browser”** on the landing page and README, with an optional parenthetical definition of IANA in technical documentation. Replace “fixture” and “matrix” with “expected availability file” or “audit results.” Replace the verdict with a concrete result such as **“No missing or repeated times found.”** Regenerate the copy audit from normal, demo, error, and stale states.

### F-2-5 — BLOCKING — The demo route still lacks its own complete metadata and page skeleton

**Historical finding:** reopens **F-1-8**.

**Location / evidence:** `GET /demo/` returns a 423-byte meta-refresh document. It has `Demo — Availability DST Audit` and a canonical link, but no meta description, Open Graph or Twitter metadata, favicon, `<main>`, or `<h1>`. After refresh, `/?demo=1` sets the title with JavaScript but retains the homepage canonical URL, homepage `og:title`, and homepage `og:url`.

**Why this fails:** `/demo/` is listed in the sitemap and documented as the demo URL, but it is not a complete route for crawlers, previews, disabled JavaScript, or assistive inspection before refresh. Sharing the demo produces homepage metadata rather than demo metadata.

**Concrete fix:** build `/demo/index.html` as a complete app entry with demo-specific title, description, canonical, OG/Twitter values, favicon, one h1, and main landmark. Prefer `/demo/` as the single canonical demo URL; redirect `?demo=1` to it rather than maintaining two sitemap entries.

### F-2-6 — MAJOR — Route changes do not move focus or announce the new page

**Location / evidence:** navigating from `/` to `/privacy/` leaves `document.activeElement` on `<body>`, not the new h1. Returning with Back restores the tested scroll position (2000 px) but also leaves focus on `<body>`. Navigating from Privacy to `/#how-it-works` likewise leaves focus on `<body>`. No route-change live region or focus handler exists on the legal pages.

**Why this fails:** keyboard and screen-reader users do not receive the required route-change focus and announcement, even though deep links and browser history otherwise work.

**Concrete fix:** on document/route navigation, focus a `tabindex="-1"` h1 (or the targeted section heading) and announce its text in a polite live region. Add a Playwright test covering forward navigation and Back focus restoration.

### F-2-7 — MAJOR — The audit cannot compare the expected file with actual published availability

**Location / exact copy:** **“Export an expected availability file. Compare it with your booking page before you publish hours.”** The product offers CSV/ICS export but no import or pasted-slot comparison.

**Why this fails:** the brief’s job is to obtain proof that published availability respects intended hours. The current tool produces the expected side and leaves the decisive comparison manual. A normal user would expect an audit to identify missing, extra, or shifted published slots.

**Concrete fix:** add local-only CSV/ICS import for actual scheduler availability. Match imported slots against the generated expected rows and report missing, extra, shifted, and duration-mismatched slots. Keep parsing in-browser, provide a sample actual file in demo mode, and add claims/tests for the comparison. AI is not needed for this deterministic task.

## Copy audit

Word counts use whitespace-delimited words. Navigation, headings, actions, status labels, and demo-only result copy are included because the plain-words contract applies to them. Repeated weekday names and generated data rows are data labels, not sentences. No unit exceeds 22 words, and no banned marketing adjective appears.

### Landing page and demo copy

| Location | Words | Copy |
| --- | ---: | --- |
| Title | 7 | Availability DST Audit — check booking hours |
| Skip link | 4 | Skip to audit setup |
| Brand | 2 | Availability/DST Audit |
| Nav | 1 | Home |
| Nav | 1 | Demo |
| Nav | 3 | How it works |
| Nav | 1 | Privacy |
| Kicker | 3 | Daylight-saving availability check |
| H1 | 6 | Check booking hours across clock changes |
| Hero | 15 | For people who publish availability, find hours that shift when daylight saving starts or ends. |
| Primary action | 5 | Try it with sample data |
| Outcome | 6 | See a completed London–New York audit. |
| Fact | 4 | Runs in your browser |
| Fact | 2 | No account |
| Fact | 4 | Export CSV or ICS |
| Figure label | 2 | FIG 01 |
| Caption | 6 | Clock changes can shift booking hours. |
| Caption | 5 | Check the dates that change. |
| Eyebrow | 2 | Audit setup |
| H2 | 6 | Set working hours and test dates |
| Instruction | 5 | Enter the organizer’s local hours. |
| Instruction | 9 | Pick a second timezone to compare the booking time. |
| Legend | 4 | Set weekly working hours |
| Help | 9 | Only enabled days appear in the expected availability file. |
| Help | 6 | Use one continuous window per day. |
| State | 3 | Open / Closed |
| Legend | 4 | Choose timezones and dates |
| Label | 2 | Organizer timezone |
| Label | 2 | Comparison timezone |
| Help | 7 | Use names such as Europe/London or America/New_York. |
| Help | 7 | Do not use abbreviations such as EST. |
| Label | 2 | Start date |
| Label | 2 | End date |
| H3 | 4 | What the audit checks |
| Body | 17 | It marks offset changes, missing times, repeated times, duration changes, and date changes in the comparison timezone. |
| Saved state | 10 | Run an audit to save this form in this browser. |
| Button | 2 | Run audit |
| Eyebrow | 3 | Expected availability file |
| H2 | 2 | Audit results |
| Button | 2 | Export CSV |
| Button | 2 | Export ICS |
| Empty-state H2 | 4 | No audit results yet |
| Empty state | 10 | Set the working hours and dates, then run an audit. |
| Link | 2 | Review configuration |
| Eyebrow | 3 | How it works |
| H2 | 4 | How the audit works |
| H3 | 4 | Use your working hours |
| Body — jargon | 12 | The browser checks each local time using the selected timezone’s IANA rules. |
| H3 | 3 | Find clock-change dates |
| Body — false/unlisted claim | 11 | The results show the first working window after an offset change. |
| Body | 10 | They also mark times that repeat or do not occur. |
| H3 | 3 | Compare booking times |
| Body | 5 | Export an expected availability file. |
| Body | 10 | Compare it with your booking page before you publish hours. |
| Summary | 7 | How repeated and missing local times work |
| Body | 6 | Repeated local times are marked Review. |
| Body — unlisted claim | 7 | The ICS file uses the earlier occurrence. |
| Body | 10 | Missing local times are marked Invalid and omitted from ICS. |
| Footer | 6 | Check booking hours around daylight-saving changes. |
| Footer link | 1 | Privacy |
| Footer link | 1 | Terms |
| Footer link | 3 | Source (opens GitHub) |
| Footer | 7 | Built by Param Factory · build 1e8d147+polish. |
| Footer | 12 | Hero artwork was generated for this project with the Factory image model. |
| Demo banner | 7 | Demo — sample data, nothing is saved. |
| Demo banner | 13 | London hours are checked against New York across the March 2026 clock change. |
| Demo button | 2 | Reset demo |
| Demo link | 3 | Start for real |
| Demo H2 — vague | 5 | Expected availability is internally consistent |
| Demo summary — jargon/miscount | 10 | 10 expected windows · 5 boundary cases · 80 hours |
| Demo H3 | 3 | 1 offset change |
| Demo H3 | 5 | Declared hours in each timezone |
| Demo body — false claim | 11 | Boundary rows are the first working windows after a clock change. |
| Demo caption | 7 | Expected availability slots from 2026-03-23 through 2026-04-03 |
| Demo table heading — inconsistent term | 2 | UTC fixture |

The action labels **Try it with sample data**, **Run audit**, **Export CSV**, **Export ICS**, **Reset demo**, **Start for real**, and **Review configuration** name an action or result and pass the button/link wording check.

### README copy

| Location | Words | Copy |
| --- | ---: | --- |
| H1 | 3 | Availability DST Audit |
| Intro | 10 | Check booking hours across daylight-saving changes before you publish availability. |
| Audience | 14 | For consultants, recruiters, and coordinators who publish booking hours in more than one timezone. |
| Demo link | 4 | Try the completed sample |
| H2 | 3 | What it does |
| List | 8 | Creates dated expected booking times from weekly hours. |
| List — false/unlisted claim | 9 | Shows the first working window after a clock change. |
| List | 6 | Marks missing or repeated local times. |
| List | 9 | Exports the same results as CSV or UTC ICS. |
| Body — jargon | 7 | The browser uses its IANA timezone rules. |
| Body | 12 | The tool does not model scheduler buffers, holidays, overrides, or account settings. |
| H2 | 3 | Run and verify |
| Body | 5 | Use Node.js 20 or later. |
| Body | 9 | Run every published claim check from the sample sandbox. |
| Code comment | 4 | Run each printed command. |
| Body | 10 | npm run build writes the deployable static site to dist. |
| H2 | 3 | Privacy and demo |
| Body | 8 | The audit and exports run in the browser. |
| Body | 15 | The sample demo uses separate local storage and is discarded when you start for real. |
| Body | 7 | See the demo notes, Privacy, and Terms. |
| H2 | 1 | Deploy |
| Body | 13 | This is a Vite and TypeScript static site for Azure Static Web Apps. |
| Body | 8 | Deploy dist; the factory manages infrastructure and DNS. |
| H2 | 2 | Project records |
| Link | 5 | Visual system and asset provenance |
| Link | 2 | Claim registry |
| Link | 1 | Handoff |
| Link | 2 | MIT License |

### Required copy rewrites

| Flag | Proposed rewrite |
| --- | --- |
| Unexplained “IANA” | “The browser checks each local time using its built-in timezone rules.” |
| False first-window sentence | “The report marks the first enabled working window after each clock change.” Implement and test that exact rule. |
| “Expected availability is internally consistent” | “No missing or repeated times found.” |
| “boundary cases” | Use “clock-change rows” and count only the rows the documented rule defines. |
| “UTC fixture” / “fixture” / “matrix” | Use “UTC time,” “audit results,” and “expected availability file” consistently. |

## Claims verification

A fresh clone was created at commit `47144ec`. After `npm ci` and `npm run build`, every exact command in `.factory/claims.json` was run independently:

| Claim | Result | Evidence |
| --- | --- | --- |
| `sample-audit` | PASS | 2/2 desktop/mobile tests |
| `browser-iana` | PASS | 2/2 desktop/mobile tests |
| `exports` | PASS | 2/2 desktop/mobile tests; CSV and ICS bodies inspected |
| `time-edge-cases` | PASS | 2/2 desktop/mobile tests |
| `demo-isolation` | PASS | 2/2 desktop/mobile tests |
| `privacy-local` | PASS | 2/2 desktop/mobile tests |
| `offline-reload` | PASS | 2/2 desktop/mobile tests |

The combined claim suite passed 16/16. These passes do not cover the unlisted claims in F-2-2 and F-2-3. In particular, the test named `sample-audit` checks that 30 March is a boundary row but does not reject the four later false boundary labels. The `time-edge-cases` test does not inspect an ambiguous-time ICS download even though the landing page says the file uses the earlier occurrence.

## Demo, privacy, and offline evidence

- The landing CTA reaches `/?demo=1` in one click.
- The live demo immediately computes 10 London 09:00–17:00 weekday rows for 23 March–3 April 2026 and shows the 29 March offset change, but the results are below the first screen (F-2-1).
- With a seeded real key, demo mode wrote only `demo:availability-dst-audit:config:v1`; the real key remained byte-for-byte unchanged.
- Reset demo restored Europe/London after editing the organizer zone to Europe/Paris.
- Start for real removed the demo key and retained the seeded real key.
- CSV downloaded with one header and ten data rows.
- The complete live demo/reset/export flow made only requests to `availability-dst-audit.sociobot.in`; no third-party request or console error occurred.
- After one online visit and service-worker control, the live demo reloaded offline with its banner and completed verdict.

## Structure, links, accessibility, and quality gates

- Root, demo after redirect, Privacy, Terms, and the designed 404 have `lang="en"`, one h1, and one main landmark in a scripted browser.
- Titles follow the required pattern: root **“Availability DST Audit — check booking hours”**, Demo **“Demo — Availability DST Audit”**, Privacy, Terms, and Page not found.
- Root and legal pages have descriptions, canonical links, OG/Twitter metadata, favicon, and apple-touch icon. The demo route exception is F-2-5.
- `/not-a-real-page` returns the product-designed 404 with HTTP 404 and a sample-audit link.
- Every discovered internal link returned 200 except the intentional missing route, which returned 404; every hash target existed. The GitHub source link returned 200.
- Header and footer links are consistent on root, legal pages, and 404. Deep links and Back restore the URL and tested scroll position. Focus failure is recorded in F-2-6.
- Live Playwright Axe scans found zero serious or critical violations on root, demo, Privacy, Terms, and 404 at 390 px and 1440 px. Neither viewport had document overflow. Reduced-motion mode reduced the button transition to `0.00001s`.
- The visual identity is distinct: the pixel observatory, stepped borders, dark console palette, and tabular treatment match `.factory/design.md` rather than a generic SaaS template.
- Clean-clone `npm test`: 7/7 passed.
- Clean-clone `npm run build`: passed and produced `dist/`; initial JS is 17.45 KB raw / 6.60 KB gzip.
- Clean-clone `npm run test:e2e`: 24/24 passed across desktop and 390 px projects.

## History audit

| Earlier item | Live and code result |
| --- | --- |
| F-1-1 first-screen clarity | Confirmed fixed on both viewports. |
| F-1-2 one-click demo | Reopened by F-2-1: mode works, but the first demo screen does not show the sample result. |
| F-1-3 claims registry/tests | Confirmed fixed after a clean build; all seven exact commands pass. |
| F-1-4 landing claims | Reopened by F-2-2: retained claims exceed registry/test coverage and one is false. |
| F-1-5 README claims | Reopened by F-2-3: the first-window promise remains unlisted and false. |
| F-1-6 plain copy | Reopened by F-2-4: IANA remains unexplained and demo/stale states reintroduce fixture/matrix terminology. |
| F-1-7 product-owned 404 | Confirmed fixed live and in `staticwebapp.config.json`. |
| F-1-8 route metadata/navigation | Reopened by F-2-5: root/legal/404 are fixed, but `/demo/` is only an incomplete refresh shell. |
| Earlier verification P1 stale-result contrast | Confirmed fixed: stale results are replaced, exports disable, the regression test passes, and Axe reports no serious/critical issue. |

## Missed leverage

F-2-7 records the obvious next capability: import actual published CSV/ICS availability and compare it locally with the expected rows. No AI feature is warranted. The job is deterministic, and an AI gateway would add cost and uncertainty without improving timezone arithmetic.

## What would make this perfect

Put the completed sample result in the first demo viewport; correct and test the one-boundary-row rule; register every retained claim; use one plain term for the output; make `/demo/` a complete canonical route; focus and announce route headings; and add local actual-versus-expected import comparison. Re-run this entire review against the deployed artifact. A pass requires zero remaining findings.
