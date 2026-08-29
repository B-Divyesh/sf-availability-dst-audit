# Adversarial first-read review 4 — Availability DST Audit

Reviewed: 29 August 2026  
URL: <https://availability-dst-audit.sociobot.in/>  
Revision: `c5f518b66f95f697c80dc65e8160b0eccef02fbd`

## Verdict: **FAIL**

There is one minor finding. The product is otherwise clear, tryable, locally private, and verified. Per the review contract, a PASS requires zero findings.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 opened the live root without stored data. Before scrolling, I could answer all three required questions:

- **What it does:** “Check booking hours across clock changes.”
- **For whom:** “For people who publish availability, find hours that shift when daylight saving starts or ends.”
- **What to click first:** “Try it with sample data,” which says “See a completed London–New York audit.”

The action begins at 468 px on the phone. The facts “Runs in your browser,” “No account,” and “Export spreadsheet or calendar files” are also visible without scrolling. The phone page had no horizontal overflow; the desktop layout had the same clear first action.

## Findings

### F-4-1 — MINOR — Decorative figure label carries no information

**Location / exact copy:** landing-page hero illustration caption: **“FIG 01”**.

**Why this fails:** this is a decorative label rather than a section name or reader-useful statement. The attached plain-words standard explicitly says to delete decorative labels. It does not help a first-time visitor understand the audit, the illustration, or the next action.

**Concrete fix:** remove “FIG 01”. Keep the useful caption: “Clock changes can shift booking hours. Check the dates that change.”

## Copy audit

Word counts use whitespace-delimited words. All counts are 22 or fewer. A slash separates independent copy units in the same location. The only flag is F-4-1; no jargon, banned marketing adjective, inconsistent term, mood heading, or non-result-naming button was found in the remaining copy.

### Landing page

| Location | Words | Copy |
| --- | ---: | --- |
| H1 | 6 | Check booking hours across clock changes |
| Hero sentence | 15 | For people who publish availability, find hours that shift when daylight saving starts or ends. |
| Primary action / outcome | 5 / 6 | Try it with sample data / See a completed London–New York audit. |
| Facts | 4 / 2 / 5 | Runs in your browser / No account / Export spreadsheet or calendar files |
| Figure label / caption | 2 / 6 / 5 | FIG 01 / Clock changes can shift booking hours. / Check the dates that change. |
| Setup heading / sentences | 6 / 5 / 9 | Set working hours and test dates / Enter the organizer’s local hours. / Pick a second timezone to compare the booking time. |
| Hours help | 9 / 7 | Only enabled days appear in the expected availability file. / Add separate windows for split working days. |
| Zone help | 7 / 7 | Use names such as Europe/London or America/New_York. / Do not use abbreviations such as EST. |
| Audit-check heading / sentence | 4 / 18 | What the audit checks / It marks the first enabled working window after each clock change, plus missing, repeated, duration-changed, or date-shifted times. |
| Storage notice | 10 | Run an audit to save this form in this browser. |
| Empty result | 4 / 10 | No audit results yet / Set the working hours and dates, then run an audit. |
| Method: timezone rule | 13 | The browser checks each local time using timezone rules built into your browser. |
| Method: boundary rule | 11 / 10 | The report marks the first enabled working window after each clock change. / It also marks times that repeat or do not occur. |
| Method: import | 16 / 9 | Import a CSV spreadsheet or calendar (.ics) file whose start and end times are in UTC. / The report finds missing, extra, shifted, and duration-changed slots. |
| Local-time help | 6 / 7 / 10 | Repeated local times are marked Review. / The calendar file uses the earlier occurrence. / Missing local times are marked Invalid and omitted from it. |
| Footer | 6 | Check booking hours around daylight-saving changes. |

The state-specific landing copy was also checked: stale result heading (6), stale explanation (21), result heading (5), baseline explanation (16), demo banner (7), demo detail (13), reset message (7), storage explanation (14), timezone error (9), and calendar error (19). Each is useful, under the cap, and uses the same terms as the normal path. The maintained exhaustive ledger is `.factory/copy-audit.md`.

### README

| Location | Words | Copy |
| --- | ---: | --- |
| Opening | 10 | Check booking hours across daylight-saving changes before you publish availability. |
| Audience | 13 | For consultants, recruiters, and coordinators who publish booking hours in more than one timezone. |
| Demo link | 4 | Try the completed sample. |
| Capability bullets | 8 / 7 / 10 / 6 / 12 / 9 | Creates dated expected booking times from weekly hours. / Supports multiple working windows on each weekday. / Marks the first enabled working window after a clock change. / Marks missing or repeated local times. / Exports the same results as a CSV spreadsheet or calendar (.ics) file. / Compares imported UTC spreadsheet or calendar slots with expected availability. |
| Timezone scope | 9 / 11 / 13 | The browser uses timezone rules built into your browser. / IANA is the public timezone-name standard behind names such as Europe/London. / The tool does not model scheduler buffers, holidays, overrides, or account settings. |
| Import scope | 13 / 7 | Imported start and end times must use UTC, which means Coordinated Universal Time. / The tool rejects timezone-qualified or floating calendar times. |
| Verification | 6 / 10 / 9 | Use Node.js 20 or later. / Run every published claim check from the sample sandbox. / `npm run build` writes the deployable static site to `dist/`. |
| Privacy/demo | 10 / 14 / 13 / 8 | The audit, exports, and file comparison run in the browser. / The sample demo uses separate local storage and is discarded when you start for real. / See the demo notes, Privacy, and Terms. / After one connected visit, the sample audit reloads offline. |
| Deploy | 13 / 8 | This is a Vite and TypeScript static site for Azure Static Web Apps. / Deploy `dist/`; the factory manages infrastructure and DNS. |

“IANA” and “UTC” are defined at their first README use. Buttons use result-naming verbs: “Try it with sample data,” “Run audit,” “Export CSV spreadsheet,” “Export calendar (.ics),” and “Compare published file.”

## Demo, sandbox, and privacy

The root CTA made one navigation to `/demo/`. Its first phone screen already showed the persistent **“Demo — sample data, nothing is saved.”** banner, the completed sample heading, the verdict **“No missing or repeated times found,”** and 12 realistic audit rows (including a split Wednesday and the March 2026 London/New York boundary).

In a fresh live context, I seeded real storage with `availability-dst-audit:config:v1 = { organizerZone: Pacific/Auckland }`. Entering the demo created only `demo:availability-dst-audit:config:v1`, Reset restored `Europe/London`, and Start for real removed the demo key while preserving the seeded real value. The complete click, export, reset, and exit request log had one origin only: `https://availability-dst-audit.sociobot.in`. There were no live page errors.

The direct `/demo/` and `/?demo=1` paths both enter the sample. The registered offline test additionally passed after a fresh first visit and service-worker control. No AI feature is missing: civil-time arithmetic and exact file comparison are deterministic, while CSV/calendar import and export already cover the useful leverage implied by the brief.

## Claims verification

I created a separate clean clone, ran `npm ci`, `npm test` (10 passed), and `npm run build` (created `dist/`), then ran every exact command listed in `.factory/claims.json` independently. Every command passed in both desktop and 390 px projects.

| Claim id | Result |
| --- | --- |
| `sample-audit` | PASS (2/2) |
| `browser-timezone-rules` | PASS (2/2) |
| `first-boundary-window` | PASS (2/2) |
| `exports` | PASS (2/2) |
| `time-edge-cases` | PASS (2/2) |
| `comparison-date-change` | PASS (2/2) |
| `published-comparison` | PASS (2/2) |
| `multiple-daily-windows` | PASS (2/2) |
| `demo-isolation` | PASS (2/2) |
| `real-storage` | PASS (2/2) |
| `privacy-local` | PASS (2/2) |
| `offline-reload` | PASS (2/2) |

`npm run test:e2e` also passed all 42 browser tests. Landing and README claim-like sentences map to the registered timezone-rule, boundary, export, time-edge, comparison, storage, privacy, multiple-window, and offline claims. No unlisted product claim was found. Technical setup statements were confirmed by the successful clean build and test run.

## Structure, accessibility, and links

- Root, Demo, Privacy, Terms, Offline, and the designed missing-route page had route-specific titles, descriptions, canonicals, OG/Twitter images, favicon, `lang="en"`, one `h1`, and one `main`.
- `/not-a-real-review-4` returned HTTP 404 with the product-owned page and an “Open the sample audit” route back.
- Live Axe scans at 390 px found no serious or critical violations on all six routes. The phone width remained 390 px with no horizontal overflow.
- Link crawl found 200 responses for every internal destination and asset; the external GitHub source link returned 200. `robots.txt`, `sitemap.xml`, CSP, `nosniff`, and referrer-policy headers are present. The sitemap lists every public route.
- Header/footer structure is consistent. Privacy navigation and browser Back moved focus to the destination `h1` and updated the polite route announcement.
- The dark pixel-console, stepped borders, tabular time treatment, and original timezone-observatory art match `.factory/design.md` and are distinct from a generic SaaS template.

## History audit

Every earlier review, polish record, and the previous handoff was read. The live deployment and source were checked rather than accepting a prior “fixed” label.

| Earlier findings | Current confirmation |
| --- | --- |
| F-1-1 through F-1-8 | Fixed: first-screen clarity, one-click isolated demo, complete claims registry, claim-backed landing/README copy, plain terminology, product 404, and complete route metadata/navigation all work live. |
| F-2-1 through F-2-7 | Fixed: completed sample is in the first phone screen; one exact first-enabled boundary row is reported; README matches it; vocabulary is consistent; `/demo/` is complete; focus/announcement works; imported published-slot comparison works. |
| F-3-1 through F-3-7 | Fixed: only UTC calendar timestamps are accepted; 44 px mobile controls pass; Offline has the shared skeleton; boundary/table/import words are precise; and multiple daily windows work in audit and export. |

No prior finding is reopened. F-4-1 is new and independent of those repairs.

## What would make this perfect

Remove the non-informative “FIG 01” label, rerun the existing copy audit, and the product will satisfy the zero-finding PASS standard.
