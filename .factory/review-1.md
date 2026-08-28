# Adversarial first-read review 1 — Availability DST Audit

Reviewed: 28 August 2026
URL: <https://availability-dst-audit.sociobot.in>
Verdict: **FAIL**

This review used fresh Chromium contexts at 390 x 844 and 1440 x 900, the deployed site, and the checked-out source. The core manually configured audit did run: a London/New York 23 March–3 April 2026 audit rendered 10 rows, flagged the 29 March offset change, enabled CSV/ICS downloads, and wrote only `availability-dst-audit:config:v1` to local storage. That does not resolve the blocking first-use, demo, claims, and delivery failures below.

## Cold first read

Before scrolling on phone, the page showed the heading **“Make the clock change prove itself.”**, the paragraph **“Turn declared local working hours into an inspectable DST test matrix. Catch missing, repeated, or shifted boundary cases before an invitee does.”**, and the primary control **“Build expected fixture.”** The same content appeared before scrolling on desktop.

I could infer that this is related to daylight-saving time only after interpreting the acronym and jargon in the paragraph. I could not tell who it is for: the first screen never names someone who publishes booking availability, coordinates meetings, or checks a scheduler. I also could not confidently choose a first action: “Build expected fixture” does not say that it opens a form, runs an audit, or uses safe sample data. This fails the five-second what / for whom / first click check.

## Findings

### F-1-1 — BLOCKING — The first screen does not state the job, audience, or safe first action

**Location / exact copy:** homepage `<h1>`: “Make the clock change prove itself.” Primary action: “Build expected fixture.”

**Why this fails:** The heading is a metaphor, not the job. “Fixture” and “DST test matrix” require prior technical context. Neither mobile nor desktop first screen identifies the intended visitor. The only visible primary action promises an unexplained artifact and does not provide a try-out.

**Concrete fix:** replace the first screen with, for example:

- Headline: **“Check booking hours across clock changes”**
- Supporting sentence: **“For people who publish availability, find hours that shift when daylight saving starts or ends.”**
- Primary action: **“Try it with sample data”**
- Adjacent outcome: **“See a completed London–New York audit.”**
- Facts: **“Runs in your browser” · “No account” · “Export CSV or ICS”**

### F-1-2 — BLOCKING — There is no one-click sandbox demo

**Location / evidence:** no homepage control says “Try it with sample data”; `GET https://availability-dst-audit.sociobot.in/demo` returned **404**; the repository has no `.factory/demo.md`; `rg -i 'demo|sample'` found no product demo implementation. The initial state is an empty form and **“No fixture yet”**, not a realistic completed audit.

**Why this fails:** A first-time visitor must configure zones and dates, understand the form, and run the audit before seeing the value. There is no persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, or **Start for real** control. Therefore sample-data isolation, reset behaviour, and the requirement that demo activity cannot touch real storage cannot be verified.

**Concrete fix:** add `/demo` (and `?demo=1`) backed by a `demo:` storage namespace. The first click must show a completed, realistic London 09:00–17:00 / New York audit spanning 23 March–3 April 2026, including the 29 March DST boundary and enabled export previews. Show the required banner with working Reset demo and Start for real controls. On leaving demo, discard only `demo:` keys and never read/write the real configuration key. Document the URL, data, reset, and storage namespace in `.factory/demo.md`, and add browser tests for isolation and reset.

### F-1-3 — BLOCKING — The required claims registry and claim tests are absent

**Location / evidence:** `.factory/claims.json` does not exist. `package.json` has only untagged `vitest run` and `playwright test`; neither test file contains `@claim:`. From a clean dependency install, `npm test` passed 7 unit tests, `npm run test:e2e` passed 6 smoke tests, and `npm run build` passed, but there were **zero listed claim commands to run**.

**Why this fails:** The product makes visitor-reliant functional, privacy, persistence, export, and offline claims without the required registry or an observable demo-based test for each. A passing general smoke suite is not evidence for each published claim.

**Concrete fix:** create `.factory/claims.json`. Give every listed claim exactly one `@claim:<id>` test that begins from `/demo` in a fresh context. Test exports by inspecting the downloaded content, persistence isolation by inspecting keys, and privacy with a request log that permits only the product origin. Remove any claim that cannot be tested.

### F-1-4 — BLOCKING — Landing functional claims are unlisted and untested

**Location / exact copy:** homepage. Each row is a distinct unlisted-claim finding covered by the missing registry in F-1-3.

| Unlisted claim | Required test / concrete fix |
| --- | --- |
| “Turn declared local working hours into an inspectable DST test matrix.” | Demo test supplies the declared hours and asserts dated expected rows. |
| “Catch missing, repeated, or shifted boundary cases before an invitee does.” | Three demo fixtures assert missing, ambiguous, and shifted/boundary outcomes. |
| “Local only” | Record the complete demo request log and assert no request beyond same-origin static assets. |
| “Browser IANA” | Test a documented IANA-zone DST fixture and name the browser `Intl` dependency precisely. |
| “CSV + ICS” / “Use the CSV or ICS fixture beside a booking page.” | Download each fixture in demo mode; assert CSV headers/rows and valid UTC ICS events. |
| “Hours are interpreted in the organizer zone exactly as written.” | Assert a specified local window and its expected UTC projection. |
| “Closed days produce no expected slots.” | Disable a known weekday in demo and assert no row for it. |
| “One continuous window per day is supported in v1.” | Either test the documented limitation or state it as a non-claim help label. |
| “Organizer offset changes, missing spring-forward times, repeated fall-back times, duration drift, and comparison-zone date changes.” | Add one observable fixture assertion for every listed flag. |
| “UTC is derived from the browser’s current IANA timezone rules.” | Test the known organizer-zone transition using the browser fixture; avoid the broad “current” promise if it is not controlled. |
| “The matrix labels the first scheduled window after an offset change…” | Test the expected flagged row and timing rule. |
| “Both are detected…” and “the ICS fixture chooses the earlier occurrence…” | Test an ambiguous-time fixture and inspect the ICS event instant. |
| “When clocks jump forward, a missing wall time is marked invalid and omitted from ICS.” | Test the invalid row and absence from the downloaded ICS. |
| “No user data leaves this page.” | Fresh `/demo` request-log test across run, exports, reset, and offline handling. |

### F-1-5 — BLOCKING — README functional, privacy, and offline claims are unlisted and untested

**Location / exact copy:** `README.md`. Each row is a distinct unlisted-claim finding.

| Unlisted claim | Required test / concrete fix |
| --- | --- |
| “A free, local-first preflight for booking availability across daylight-saving changes.” | Test the actual no-account local demo flow; otherwise remove “local-first.” |
| “It turns declared weekly working hours into a dated expected-slot matrix, highlights civil-time boundary cases, and exports CSV/ICS fixtures…” | Covered only after the separate matrix, boundary, CSV, and ICS claim tests in F-1-4 are registered. |
| “Organizer offset changes within the chosen date range.” | Assert a known transition in the sample audit. |
| “The first scheduled window after each DST boundary.” | Assert the stated first-window selection rule. |
| “Missing wall times during a spring-forward jump.” | Assert the missing-time demo case. |
| “Ambiguous wall times during a fall-back repeat.” | Assert the repeated-time demo case. |
| “Elapsed-duration drift across an offset change.” | Assert a cross-transition interval and its duration. |
| “Comparison-zone projections that land on a different date.” | Assert an overnight comparison-zone output. |
| “CSV and ICS expected-slot fixtures derived from the same matrix.” | Compare sample matrix rows to both downloads. |
| “The audit uses the IANA timezone data shipped by the browser and operating system.” | Test a known `Intl` result; retain the browser/OS limitation in the claim. |
| “It does not reproduce vendor buffers, overrides, notice periods, holidays, or proprietary availability logic.” | Add a documented scope test or keep this as clearly labelled product scope rather than a verified operational promise. |
| “All computation and export generation happen in-browser.” | Request-log test plus browser download assertions. |
| “The last successful form configuration is stored in local storage.” | Demo test must instead prove `demo:` isolation; real-mode test may assert the real key. |
| “No schedule, export, analytics event, or tracking identifier is sent to a server.” | Request-log test for the complete demo flow. |
| “The service worker caches the application shell for repeat offline use.” | From `/demo`, load online, wait for control, set offline, reload, and assert the usable sample audit. |

### F-1-6 — MAJOR — Landing and README copy fails the plain-language audit

**Location / exact copy:** see the complete sentence/count audit below.

**Why this fails:** The visitor gets metaphor headings (“Make the clock change prove itself.”, “Define the promise, then stress the boundary.”, “Anchor the promise”, “Expose the seam”), unexplained specialist terms (“fixture”, “matrix”, “civil time”, “vendor parity”, “IANA”), and multiple sentences above the 22-word cap. “Build expected fixture” is a result-naming verb syntactically, but still fails as the first action because its result is undefined and it is not a sample path.

**Concrete fix:** use the F-1-1 hero copy. Rename sections to **“Set working hours and dates”**, **“What the audit checks”**, **“How the audit works”**, and **“What the results mean.”** Replace “fixture” consistently with **“expected availability file”** (or define and retain one shorter term). Split and simplify the flagged sentences in the copy-audit flags table.

### F-1-7 — BLOCKING — The deployed 404 is a third-party Azure error page, not a product route

**Location / evidence:** `https://availability-dst-audit.sociobot.in/not-a-real-page` returns 404 with title **“Azure Static Web Apps - 404: Not found”**, no `<h1>`, no `<main>`, and Azure CDN Bootstrap/scripts. `public/staticwebapp.config.json` has no 404 response override and the repository has no `404.html`.

**Why this fails:** A mistyped or shared URL abandons the site’s identity, navigation, accessibility skeleton, and privacy posture. It also conflicts with the site-structure requirement for a designed 404 with a way back.

**Concrete fix:** add a product-styled `404.html` with one clear h1 and a Home/Run audit link. Configure `responseOverrides.404.rewrite` to `/404.html` without combining rewrite and status code. Add a deployed-route test for its title, h1, main, and back link.

### F-1-8 — MAJOR — Required route metadata and navigation consistency are missing

**Location / evidence:** `/`, `/privacy/`, and `/terms/` have titles, descriptions, one h1, and main landmarks, but none has a canonical link, Open Graph metadata/image, Twitter card, or Apple touch icon. The root header omits Privacy and Demo; the legal headers have different navigation. The Privacy footer omits Privacy and the Terms footer omits Terms. No footer includes the required “Built by Param Factory” wording plus a version/build id.

**Why this fails:** Shared previews have no product image or canonical URL; users cannot use a consistent header/footer to reach the demo or legal pages. The missing demo link reinforces the dead-end first experience.

**Concrete fix:** add canonical, OG title/description/image, Twitter card, and 180px Apple touch icon to every route. Make the header consistently contain Home, Demo, How it works, and Privacy (within four links). Put Privacy and Terms in every footer, plus “Built by Param Factory” and a build version. Ensure new `/demo` is in `sitemap.xml` and all links return 200.

## Checks that did not produce a separate finding

- The deployed root, Privacy, Terms, and Source links returned 200. The hash navigation targets existed.
- The production audit flow worked after manual form entry, exports enabled, and the live browser reported no console or page errors.
- A fresh-root request log contained only the same-origin document, JS, CSS, and hero image. This supports neither the untested privacy claims nor demo isolation because no demo exists.
- The existing visual system is distinct and product-specific: the supplied artwork and console/pixel treatment follow `.factory/design.md`; it is not a generic gradient SaaS template.
- AI is not an obvious missing feature here. The promised audit is deterministic, and neither the brief nor the task requires an AI-assisted inference step. Adding a provider-key feature would add risk without improving the stated job.

## History check

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files to re-open. I reviewed `.factory/verification.md`, `.factory/verification-2.md`, and the prior handoff. The earlier **P1 stale-result matrix contrast** finding is actually fixed in the deployed code: after a completed live audit, changing the comparison zone replaced the matrix with “Fixture needs a fresh run,” removed the table, and disabled both exports. The current `tests/smoke.spec.ts` covers that state on desktop and 390px and passed. It is not re-filed.

## Copy audit

Word counts treat headings, labels, buttons, and visible sentence units as copy units. The landing table covers all static visitor-facing units; dynamic form day names and dynamic result rows are generated data rather than landing sentences. README code commands are included only where they are prose/commands rather than shell-fence syntax.

### Landing page: every copy unit

| Location | Words | Copy |
| --- | ---: | --- |
| Title | 9 | Availability DST Audit — verify booking hours across clock changes |
| Skip link | 4 | Skip to audit setup |
| Kicker | 2 | Vendor-neutral preflight |
| H1 | 6 | Make the clock change prove itself. |
| Hero | 11 | Turn declared local working hours into an inspectable DST test matrix. |
| Hero | 11 | Catch missing, repeated, or shifted boundary cases before an invitee does. |
| Primary button | 3 | Build expected fixture |
| Link | 4 | How the audit works |
| Fact | 3 | Runtime: Local only |
| Fact | 3 | Rules: Browser IANA |
| Fact | 3 | Export: CSV + ICS |
| Figure caption | 6 | FIG 01 Civil time has seams. |
| Figure caption | 5 | Test where the rules split. |
| Section h2 | 7 | Define the promise, then stress the boundary. |
| Setup | 10 | Hours are interpreted in the organizer zone exactly as written. |
| Setup | 11 | Choose a comparison zone to see what an invitee should receive. |
| Legend | 5 | 01 Declare weekly local hours |
| Help | 6 | Closed days produce no expected slots. |
| Help | 9 | One continuous window per day is supported in v1. |
| Legend | 5 | 02 Choose zones and dates |
| Label | 2 | Organizer timezone |
| Label | 2 | Comparison timezone |
| Help | 13 | Use IANA names such as Europe/London or America/New_York, not abbreviations like EST. |
| Label | 2 | Start date |
| Label | 2 | End date |
| H3 | 3 | What gets flagged? |
| Flag list | 15 | Organizer offset changes, missing spring-forward times, repeated fall-back times, duration drift, and comparison-zone date changes. |
| Run button | 3 | Run DST audit |
| Results h2 | 2 | Boundary report |
| Button | 2 | Export CSV |
| Button | 2 | Export ICS |
| Section h2 | 5 | Expected slots, not vendor parity. |
| H3 | 3 | Anchor the promise |
| Method | 9 | Each date starts from the declared organizer wall time. |
| Method | 10 | UTC is derived from the browser’s current IANA timezone rules. |
| H3 | 3 | Expose the seam |
| Method | 19 | The matrix labels the first scheduled window after an offset change, plus local times that repeat or never occur. |
| H3 | 2 | Compare evidence |
| Method | 10 | Use the CSV or ICS fixture beside a booking page. |
| Method | 14 | A mismatch is evidence to investigate, not a claim about a vendor’s internal logic. |
| Disclosure summary | 8 | How does the audit handle ambiguous local time? |
| Disclosure | 13 | When clocks move back, one wall time can map to two real instants. |
| Disclosure | 22 | Both are detected and the row is marked “Review”; the ICS fixture chooses the earlier occurrence and says so in its description. |
| Disclosure | 15 | When clocks jump forward, a missing wall time is marked invalid and omitted from ICS. |
| Footer | 9 | A free, local-first test instrument from the Param Factory. |
| Footer links | 3 | Privacy; Terms; Source |
| Asset note | 12 | Hero artwork was generated for this project with the Factory image model. |
| Asset note | 6 | No user data leaves this page. |

### README: every prose sentence / copy unit

| Location | Words | Copy |
| --- | ---: | --- |
| H1 | 3 | Availability DST Audit |
| Intro | 10 | A free, local-first preflight for booking availability across daylight-saving changes. |
| Intro | 30 | It turns declared weekly working hours into a dated expected-slot matrix, highlights civil-time boundary cases, and exports CSV/ICS fixtures for comparison with Calendly, Cal.com, Google Calendar, or another scheduler. |
| H2 | 4 | Who it is for |
| Audience | 24 | Consultants, recruiters, and distributed-team coordinators who need evidence that published booking slots continue to respect an organizer’s local working hours when timezone offsets change. |
| H2 | 3 | What it checks |
| List | 8 | Organizer offset changes within the chosen date range |
| List | 8 | The first scheduled window after each DST boundary |
| List | 7 | Missing wall times during a spring-forward jump |
| List | 7 | Ambiguous wall times during a fall-back repeat |
| List | 6 | Elapsed-duration drift across an offset change |
| List | 8 | Comparison-zone projections that land on a different date |
| List | 10 | CSV and ICS expected-slot fixtures derived from the same matrix |
| Scope | 14 | The audit uses the IANA timezone data shipped by the browser and operating system. |
| Scope | 14 | It does not reproduce vendor buffers, overrides, notice periods, holidays, or proprietary availability logic. |
| Scope | 13 | A mismatch is evidence to investigate, not a guarantee of a vendor defect. |
| H2 | 3 | Develop and verify |
| Requirements | 8 | Requirements: Node.js 20 or newer and npm. |
| Command | 2 | npm ci |
| Command | 3 | npm run dev |
| Command | 2 | npm test |
| Command | 3 | npm run build |
| Build note | 7 | `npm run build` is the deployment command. |
| Build note | 13 | It creates the static site at `dist/`, with `dist/index.html` at the root. |
| Build note | 5 | To inspect that exact output: |
| Command | 3 | npm run preview |
| H2 | 3 | Architecture and privacy |
| Architecture | 10 | The app is Vite + vanilla TypeScript with no runtime dependencies. |
| Architecture | 23 | Civil-time resolution is implemented with `Intl.DateTimeFormat`; candidate instants are round-tripped through the chosen IANA zone to detect zero, one, or two mappings. |
| Architecture | 7 | All computation and export generation happen in-browser. |
| Privacy | 10 | The last successful form configuration is stored in local storage. |
| Privacy | 13 | No schedule, export, analytics event, or tracking identifier is sent to a server. |
| Privacy | 11 | The service worker caches the application shell for repeat offline use. |
| H2 | 2 | Product documentation |
| Link | 5 | Visual system and asset provenance |
| Link | 3 | Build handoff |
| Link | 2 | MIT License |
| H2 | 1 | Deployment |
| Deployment | 9 | This is a static Azure Static Web Apps artifact. |
| Deployment | 14 | Deploy the contents of `dist/`; infrastructure, DNS, and billing are managed outside this repository. |

### Copy-audit flags and proposed rewrites

| Location / flag | Proposed rewrite |
| --- | --- |
| H1 — metaphor / no job | “Check booking hours across clock changes” |
| Kicker — unexplained jargon | Delete it, or use “Check daylight-saving changes.” |
| Primary action — unexplained “fixture”; no sample result | “Try it with sample data” + “See a completed London–New York audit.” |
| Caption — metaphor: “Civil time has seams. Test where the rules split.” | “Clock changes can shift booking hours. Check the dates that change.” |
| Setup h2 — metaphor: “Define the promise, then stress the boundary.” | “Set working hours and test dates” |
| Method h2 — jargon: “Expected slots, not vendor parity.” | “What this audit checks” |
| Method h3s — metaphors: “Anchor the promise”; “Expose the seam”; “Compare evidence” | “Use your working hours”; “Find clock-change dates”; “Compare expected booking times” |
| “fixture” / “matrix” / “vendor parity” — inconsistent specialist vocabulary | Define one term once, e.g. “expected availability file,” then use it consistently. |
| README intro — 30 words, 3 ideas | “It creates dated expected booking times from weekly hours. It flags daylight-saving changes. Export CSV or ICS files to compare with a scheduler.” |
| README audience — 24 words | “For consultants, recruiters, and coordinators who need to check booking hours when daylight saving changes.” |
| README architecture — 23 words / implementation jargon | “The browser checks each local time in the selected timezone. It identifies times that occur zero, once, or twice.” |
| Ambiguous-time disclosure — 22 words / two ideas | “Repeated local times are marked Review. The ICS file uses the earlier occurrence and says so.” |

## What would make this perfect

Ship the clear first screen and true `/demo` sandbox first. Then add a complete claims registry with demo-based observable tests for every promise, simplify the audited copy, and deliver the product-owned 404 and complete metadata/navigation shell. Re-run this whole review against the deployed artifact; a PASS requires no findings and no untested claim.
