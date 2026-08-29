# Adversarial first-read review 3 — Availability DST Audit

Reviewed: 29 August 2026

Live URL: <https://availability-dst-audit.sociobot.in/>

Source revision: `596393ae61ad99b472c61f2aece8fa648224407c`

Verdict: **FAIL**

The landing page now passes the cold first-read and the demo is immediate, realistic, isolated, resettable, and usable offline. The review still fails because the published-file comparison can falsely approve timezone-qualified ICS data, the corresponding ICS import branch is not exercised by its registered claim test, phone targets miss the 44 px accessibility baseline, and the offline fallback does not follow the required page skeleton. Three smaller copy and scope findings also remain.

## Cold first read

I opened the deployed root in fresh Chromium contexts at 390 × 844 and 1440 × 900 and did not scroll.

- **What it does:** checks booking hours across daylight-saving clock changes and can export the expected times.
- **For whom:** people who publish availability.
- **What to click first:** **“Try it with sample data.”** The adjacent copy promises a completed London–New York audit.

All three answers are available in the first screen at both sizes. On mobile the primary action starts at 424 px; on desktop it starts at 772 px. The exact supporting copy is **“For people who publish availability, find hours that shift when daylight saving starts or ends.”** This gate passes.

## Findings

### F-3-1 — BLOCKING — Timezone-qualified ICS data can be falsely reported as an exact match, and the ICS import claim is untested

**Location / exact copy:** demo comparison control **“Choose CSV or ICS”**; landing explanation **“Import a UTC CSV or ICS file. The report finds missing, extra, shifted, and duration-changed slots.”** The resulting live verdict was **“Published slots match expected times”**, **“10 matched”**, and **“No missing, extra, shifted, or duration-changed slots were found.”**

**Evidence:** I uploaded ten valid-looking events whose fields used `DTSTART;TZID=America/New_York:...` and `DTEND;TZID=America/New_York:...`. Their wall-clock digits matched the sample's UTC digits, but their actual instants were four hours later. The live product nevertheless reported all ten as exact matches. In `src/comparison.ts`, `parseIcsDate` accepts an optional `Z`, while `parsePublishedSlots` ignores the `TZID` parameter and always calls `Date.UTC`. The registered `published-comparison` claim promises **“Import UTC CSV or ICS slots...”**, but `@claim:published-comparison` uploads only CSV and never exercises ICS parsing.

**Why this fails:** the comparison is the proof step added for the product's core job. Silently treating local zoned time as UTC can tell a user that published availability is correct when every slot is shifted. A passing CSV-only test does not test the listed ICS claim.

**Concrete fix:** either parse `TZID` correctly, including daylight-saving offsets, or reject every ICS `DTSTART`/`DTEND` that is not explicitly UTC (`...Z`) with an error that says how to export UTC data. Extend the single `@claim:published-comparison` test to upload both a valid UTC ICS and a `TZID`/floating-time ICS; assert correct matching for the first and correct conversion or rejection for the second.

### F-3-2 — MAJOR — Phone navigation and several controls have targets smaller than 44 px

**Location / measurements at 390 px:** header links **Home**, **Demo**, and **Privacy** measured about 26 × 13, 26 × 13, and 46 × 13 CSS px. **Reset demo** and **Start for real** were 94 × 36 and 123 × 36. **Download sample published slots** was 321 × 14; footer links were 21 px tall; the offline **Retry the audit** link was 145 × 19. The visible checkboxes are 22 × 22, although their larger day labels mitigate that case.

**Why this fails:** the attached accessibility baseline requires 44 px touch targets. These controls are easy to miss or activate incorrectly on the exact phone viewport required by this review. Reset and exit are especially important safety controls in demo mode.

**Concrete fix:** give header, footer, demo, file, and offline links/buttons a minimum 44 × 44 clickable box through padding or `min-height`/`min-width`. Keep adjacent targets separated. Add a 390 px Playwright assertion over every visible interactive element's effective clickable rectangle, accounting for associated labels.

### F-3-3 — MAJOR — The offline fallback breaks the standard route skeleton and uses a metaphor heading

**Location / exact copy:** <https://availability-dst-audit.sociobot.in/offline.html>, h1 **“Offline, but not out of time.”**

**Evidence:** the route returns 200 and has `lang`, a title, one h1, and one main. It has no meta description, canonical, Open Graph metadata, favicon, shared header, shared footer, Privacy link, Terms link, build id, or route-focus script. It uses a standalone inline-style document rather than the product's complete page shell.

**Why this fails:** this is a real fallback page cached and selected by the service worker, not an internal build artifact. A user who reaches it loses navigation, legal links, product identity, and the plain statement of what happened. The metaphor heading also violates the plain-words rule for headings.

**Concrete fix:** render the normal product header and footer, required metadata, icons, focus handling, and security-compatible stylesheet on this page. Replace the h1 with **“The audit is offline”** and use **“Reconnect, then reload the audit”** for the action. Add `/offline.html` to the route-structure and dead-link tests.

### F-3-4 — MINOR — “First post-change window” is less precise than the tested rule

**Location / exact copy:** **“It marks the first post-change window, missing or repeated times, duration changes, and comparison dates.”**

**Why this fails:** “post-change” does not name the clock change, and “window” does not say that disabled days are skipped. Elsewhere the product uses the precise rule **“the first enabled working window after each clock change.”** Two phrasings for the same rule make the summary harder to verify.

**Concrete fix / rewrite:** **“It marks the first enabled working window after each clock change, plus missing, repeated, duration-changed, or date-shifted times.”**

### F-3-5 — MINOR — The result heading says projected times are “declared”

**Location / exact copy:** demo/result heading **“Declared hours in each timezone.”**

**Why this fails:** only the organizer's hours are declared. UTC and the comparison-zone times are calculated. The heading misnames the evidence shown in the table.

**Concrete fix / rewrite:** **“Expected times in each timezone.”**

### F-3-6 — MINOR — The import instruction relies on unexplained abbreviations

**Location / exact copy:** **“Import a UTC CSV or ICS file.”** The README also uses **“UTC CSV or ICS”** without defining UTC or ICS.

**Why this fails:** a consultant or recruiter can understand the audit without knowing file-format initials. The file picker only says **“Choose CSV or ICS”**, so it also fails to surface the UTC-only constraint at the decision point. This wording contributes directly to the unsafe path in F-3-1.

**Concrete fix / rewrite:** **“Import a CSV spreadsheet or calendar (.ics) file whose start and end times are in UTC.”** Put the same requirement beside the file picker and explain that UTC means Coordinated Universal Time in the README.

### F-3-7 — MINOR — The tool cannot represent split working hours

**Location / exact copy:** setup help **“Use one continuous window per day.”**

**Why this fails:** weekly booking availability commonly has two windows on one weekday, such as 09:00–12:00 and 13:00–17:00. A normal user cannot audit or compare that published schedule without changing the source data or running separate audits. The brief asks for weekly hours and does not limit them to one interval.

**Concrete fix:** allow visitors to add and remove multiple windows for each weekday, include every interval in audit rows and exports, and compare imported slots against them. Seed at least one split day in the demo and add a claim fixture. No AI feature is warranted; the work is deterministic.

## Landing-page copy audit

Counts use whitespace-delimited words. This table covers every static copy unit on the normal landing page plus its initial empty state; navigation, headings, actions, facts, and labels are included even when they are not grammatical sentences. No unit exceeds 22 words and no banned marketing adjective appears.

| Location | Words | Copy | Flag |
| --- | ---: | --- | --- |
| Title | 7 | Availability DST Audit — check booking hours | — |
| Skip link | 4 | Skip to audit setup | — |
| Offline status | 11 | Offline: use the sample audit or run a saved page locally. | — |
| Brand | 2 | Availability/DST Audit | — |
| Navigation | 1 | Home | — |
| Navigation | 1 | Demo | — |
| Navigation | 3 | How it works | — |
| Navigation | 1 | Privacy | — |
| Kicker | 3 | Daylight-saving availability check | — |
| H1 | 6 | Check booking hours across clock changes | — |
| Hero sentence | 15 | For people who publish availability, find hours that shift when daylight saving starts or ends. | — |
| Primary action | 5 | Try it with sample data | — |
| Action outcome | 6 | See a completed London–New York audit. | — |
| Fact | 4 | Runs in your browser | — |
| Fact | 2 | No account | — |
| Fact | 4 | Export CSV or ICS | F-3-6 |
| Figure label | 2 | FIG 01 | — |
| Figure caption | 6 | Clock changes can shift booking hours. | — |
| Figure caption | 5 | Check the dates that change. | — |
| Eyebrow | 2 | Audit setup | — |
| H2 | 6 | Set working hours and test dates | — |
| Setup sentence | 5 | Enter the organizer’s local hours. | — |
| Setup sentence | 9 | Pick a second timezone to compare the booking time. | — |
| Legend | 4 | Set weekly working hours | — |
| Schedule sentence | 9 | Only enabled days appear in the expected availability file. | —; covered by the ten-weekday sample claim |
| Schedule sentence | 6 | Use one continuous window per day. | F-3-7 |
| State labels | 3 | Open / Closed | — |
| Legend | 4 | Choose timezones and dates | — |
| Label | 2 | Organizer timezone | — |
| Label | 2 | Comparison timezone | — |
| Help sentence | 7 | Use names such as Europe/London or America/New_York. | — |
| Help sentence | 7 | Do not use abbreviations such as EST. | — |
| Label | 2 | Start date | — |
| Label | 2 | End date | — |
| H3 | 4 | What the audit checks | — |
| Audit sentence | 15 | It marks the first post-change window, missing or repeated times, duration changes, and comparison dates. | F-3-4 |
| Saved-state sentence | 10 | Run an audit to save this form in this browser. | — |
| Button | 2 | Run audit | —; result-naming verb |
| Eyebrow | 3 | Expected availability file | — |
| H2 | 2 | Audit results | — |
| Button | 2 | Export CSV | —; result-naming verb |
| Button | 2 | Export ICS | F-3-6; verb is otherwise result-naming |
| Empty-state H2 | 4 | No audit results yet | — |
| Empty-state sentence | 10 | Set the working hours and dates, then run an audit. | — |
| Empty-state link | 2 | Review configuration | —; result-naming verb |
| Eyebrow | 3 | How it works | — |
| H2 | 4 | How the audit works | — |
| H3 | 4 | Use your working hours | — |
| Method sentence | 13 | The browser checks each local time using timezone rules built into your browser. | — |
| H3 | 3 | Find clock-change dates | — |
| Method sentence | 12 | The report marks the first enabled working window after each clock change. | — |
| Method sentence | 10 | It also marks times that repeat or do not occur. | — |
| H3 | 3 | Compare published times | — |
| Method sentence | 7 | Import a UTC CSV or ICS file. | F-3-6 |
| Method sentence | 9 | The report finds missing, extra, shifted, and duration-changed slots. | — |
| Details heading | 7 | How repeated and missing local times work | — |
| Details sentence | 6 | Repeated local times are marked Review. | — |
| Details sentence | 7 | The ICS file uses the earlier occurrence. | F-3-6 |
| Details sentence | 10 | Missing local times are marked Invalid and omitted from ICS. | F-3-6 |
| Footer sentence | 6 | Check booking hours around daylight-saving changes. | — |
| Footer links | 5 | Privacy / Terms / Source | — |
| Footer sentence | 7 | Built by Param Factory · build 56c8d3c+polish-2. | — |
| Footer sentence | 12 | Hero artwork was generated for this project with the Factory image model. | — |

The result state adds these distinct visitor-facing units relevant to this review:

| Location | Words | Copy | Flag |
| --- | ---: | --- | --- |
| Verdict | 6 | No missing or repeated times found | — |
| Rule sentence | 13 | A clock-change row is the first enabled working window after an offset change. | — |
| Result H3 | 5 | Declared hours in each timezone | F-3-5 |
| Comparison instruction | 14 | Import UTC CSV or ICS slots to find missing, extra, shifted, or duration-changed times. | F-3-6 |
| Privacy sentence | 5 | Files stay in this browser. | — |
| Comparison heading | 4 | Published slots need review | — |
| Comparison heading | 5 | Published slots match expected times | F-3-1 when produced for zoned ICS |
| Comparison sentence | 9 | No missing, extra, shifted, or duration-changed slots were found. | F-3-1 when produced for zoned ICS |
| Stale-state sentence | 8 | Configuration changed. Run the audit again before exporting. | — |
| Stale-state H2 | 6 | Audit results need a fresh run | — |
| Stale-state sentence | 21 | The previous audit results are hidden because they no longer match the declared hours, zones, or dates. Run the audit again. | — |

## README copy audit

| Location | Words | Copy | Flag |
| --- | ---: | --- | --- |
| H1 | 3 | Availability DST Audit | — |
| Intro | 10 | Check booking hours across daylight-saving changes before you publish availability. | — |
| Audience | 14 | For consultants, recruiters, and coordinators who publish booking hours in more than one timezone. | — |
| Demo link | 4 | Try the completed sample | —; result-naming verb |
| H2 | 3 | What it does | — |
| List sentence | 8 | Creates dated expected booking times from weekly hours. | — |
| List sentence | 10 | Marks the first enabled working window after a clock change. | — |
| List sentence | 6 | Marks missing or repeated local times. | — |
| List sentence | 9 | Exports the same results as CSV or UTC ICS. | F-3-6 |
| List sentence | 10 | Compares imported UTC CSV or ICS slots with expected availability. | F-3-6 |
| Scope sentence | 9 | The browser uses timezone rules built into your browser. | — |
| Definition sentence | 11 | IANA is the public timezone-name standard behind names such as Europe/London. | —; term is defined in place |
| Limitation sentence | 12 | The tool does not model scheduler buffers, holidays, overrides, or account settings. | — |
| H2 | 3 | Run and verify | — |
| Requirement sentence | 5 | Use Node.js 20 or later. | —; appropriate developer documentation |
| Instruction sentence | 9 | Run every published claim check from the sample sandbox. | — |
| Code comment | 4 | Run each printed command. | — |
| Build sentence | 10 | npm run build writes the deployable static site to dist. | — |
| H2 | 3 | Privacy and demo | — |
| Privacy sentence | 10 | The audit, exports, and file comparison run in the browser. | — |
| Demo sentence | 15 | The sample demo uses separate local storage and is discarded when you start for real. | — |
| Reference sentence | 7 | See the demo notes, Privacy, and Terms. | — |
| H2 | 1 | Deploy | — |
| Deployment sentence | 13 | This is a Vite and TypeScript static site for Azure Static Web Apps. | —; appropriate developer documentation |
| Deployment instruction | 8 | Deploy dist; the factory manages infrastructure and DNS. | — |
| H2 | 2 | Project records | — |
| Link | 5 | Visual system and asset provenance | — |
| Link | 2 | Claim registry | — |
| Link | 1 | Handoff | — |
| Link | 2 | MIT License | — |

All actions use verbs that name their result or destination. The only copy flags are filed above; there are no over-22-word units or banned marketing adjectives.

## Demo, storage, privacy, and offline checks

- The root CTA reached `/demo/` in one click.
- At 390 × 844, the first demo screen showed the persistent banner, Reset demo, Start for real, both export actions, the completed verdict, the one detected boundary, and the first sample rows. The report had ten realistic weekday rows for London 09:00–17:00 against New York from 23 March–3 April 2026.
- A seeded real key containing `Pacific/Auckland` remained byte-for-byte unchanged while the demo wrote and changed only `demo:availability-dst-audit:config:v1`.
- Reset demo restored the London sample. The registered isolation test also confirmed Start for real removes only the demo key.
- A complete live demo request log contained only `https://availability-dst-audit.sociobot.in`; no third-party request or console error occurred.
- After a clean service-worker registration and online reload, the live `/demo/` route reloaded offline with its banner and completed verdict. Every recorded request origin remained same-origin.

## Claims verification

From the clean worktree at the source revision, I ran `npm ci`, `npm test`, and `npm run build`, then ran every exact command from `.factory/claims.json` independently.

| Claim id | Result | Evidence |
| --- | --- | --- |
| `sample-audit` | PASS | 2/2 desktop/mobile |
| `browser-timezone-rules` | PASS | 2/2 desktop/mobile |
| `first-boundary-window` | PASS | 2/2 desktop/mobile, including later-row negatives |
| `exports` | PASS | 2/2; CSV and ICS downloads inspected |
| `time-edge-cases` | PASS | 2/2; missing and repeated times plus ICS output |
| `comparison-date-change` | PASS | 2/2 |
| `published-comparison` | **INCOMPLETE** | The command passes 2/2 for CSV only; the listed ICS branch is untested and fails the adversarial live case in F-3-1. |
| `demo-isolation` | PASS | 2/2 |
| `real-storage` | PASS | 2/2 |
| `privacy-local` | PASS | 2/2; independently confirmed on live request log |
| `offline-reload` | PASS | 2/2; independently confirmed live |

Because one listed claim is only partially tested, the product has an untested claim and cannot pass. I found no additional unlisted product claim in the live landing copy or README after mapping the sentences to these eleven entries. Technical setup statements in README were separately verified by the successful build.

## Structure, links, accessibility, and visual identity

- Root, Demo, Privacy, Terms, and the designed 404 use route-specific titles, `lang="en"`, one h1, one main, descriptions, canonicals, OG/Twitter metadata, favicon, and Apple touch icon. The offline exception is F-3-3.
- `/not-a-real-review-3` returned the product-owned 404 with HTTP 404, the h1 **“That page was not found”**, and a sample-audit link.
- Direct `/#how-it-works`, click navigation, Privacy navigation, and Back worked. Focus moved to the route or target heading and the polite route announcement was populated; Back restored the prior root scroll position.
- Every discovered internal destination and asset returned 200. The GitHub Source link returned 200. Hash targets existed.
- Headers and footers are consistent on Root, Demo, Privacy, Terms, and 404. The offline exception is F-3-3.
- Live Axe scans at 390 × 844 and 1440 × 900 found zero serious or critical issues on Root, Demo, Privacy, Terms, and Offline. Axe does not invalidate the manual target-size failure in F-3-2.
- The visual identity is distinct and matches `.factory/design.md`: dark pixel-console surfaces, stepped outlines, amber boundary signals, green expected states, tabular data, and original observatory art. It is not a generic SaaS template.
- `npm test` passed 8/8, `npm run build` passed and produced `dist/`, and `npm run test:e2e` passed 34/34. Built JS is 23.46 KB raw / 8.29 KB gzip.

## History audit

Every earlier finding was checked again in the deployed site and current code, not accepted from the polish notes alone.

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 first-screen clarity | Fixed: job, audience, sample action, outcome, and three facts are above the fold at both sizes. |
| F-1-2 one-click isolated demo | Fixed: canonical `/demo/`, completed first screen, persistent controls, separate key, reset, and exit behavior all work. |
| F-1-3 claims registry/tests | Fixed as a registry and runnable suite after the documented build; F-3-1 records one incomplete branch within a later expanded claim. |
| F-1-4 landing claims | Fixed for the original claims: registered tests cover sample rows, timezone changes, first boundary, exports, edge cases, comparison dates, storage, privacy, and offline use. |
| F-1-5 README claims | Fixed for the original claims; wording matches the current registry. |
| F-1-6 plain language | Fixed for the earlier metaphor/fixture/matrix/IANA failures; F-3-4 through F-3-6 are narrower remaining copy defects. |
| F-1-7 product-owned 404 | Fixed live and in `staticwebapp.config.json`. |
| F-1-8 route metadata/navigation | Fixed on the listed public routes; F-3-3 newly covers the previously omitted offline fallback. |
| Verification P1 stale-result contrast | Fixed: stale results are replaced, exports disable, and live/local Axe scans have no serious/critical issue. |
| F-2-1 demo result below the fold | Fixed: completed verdict starts around 275 px on the phone. |
| F-2-2 false five-row boundary | Fixed: only 30 March is marked; 31 March–3 April are not. |
| F-2-3 false README boundary rule | Fixed: README states the tested first-enabled-window rule. |
| F-2-4 inconsistent result terms | Fixed for fixture/matrix wording; F-3-4 and F-3-5 identify different residual precision issues. |
| F-2-5 incomplete `/demo/` route | Fixed: the route is a complete built document with demo metadata and skeleton. |
| F-2-6 route focus/announcement | Fixed live and covered by the current route-focus test. |
| F-2-7 no published-file comparison | Fixed in the common CSV path; F-3-1 blocks acceptance of the claimed ICS path. |

No earlier finding is reopened under its old id; the failures above are new or narrower than the repaired defects.

## Missed leverage

F-3-7 is the remaining obvious capability implied by weekly booking availability: multiple intervals on one weekday. CSV/ICS import and export already exist. Sync would add account and vendor complexity beyond the local-first brief. AI would not improve deterministic timezone conversion or exact slot comparison, so no AI feature is recommended.

## What would make this perfect

Correct or reject timezone-qualified ICS imports and test both CSV and ICS claim branches. Enlarge every phone target to 44 px, bring the offline fallback into the shared route skeleton, apply the three copy rewrites, and support split-day hours. Then rerun the entire live and clean-build review. A pass requires zero remaining findings and no partially tested claim.
