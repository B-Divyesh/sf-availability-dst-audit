# Availability DST Audit — adversarial review 3 handoff

Work order: `availability-dst-audit-review-3`

Reviewed revision: `596393ae61ad99b472c61f2aece8fa648224407c`

Live URL: <https://availability-dst-audit.sociobot.in/>

Verdict: **FAIL**

## Done

- Performed cold first-read checks in fresh 390 × 844 and 1440 × 900 Chromium contexts.
- Audited every landing and README copy unit, the one-click demo, storage isolation/reset, live requests, offline reload, metadata, routes, Back/focus behavior, links, accessibility, and visual identity.
- Ran every earlier review/polish finding against the current live site and source.
- Ran every registered claim command after a clean dependency install and production build.
- Recorded the full evidence and seven findings in `.factory/review-3.md`. Product code was not changed.

## Verification run

    npm ci
    npm test
    npm run build
    # each exact command in .factory/claims.json
    npm run test:e2e

Results: unit tests 8/8 passed; build produced `dist/`; all eleven registered commands completed 2/2 in desktop/mobile; the combined Playwright suite passed 34/34. Live Axe scans found zero serious/critical issues on Root, Demo, Privacy, Terms, and Offline. Live demo/offline request logs were same-origin only.

## Known gaps and next steps

- Blocking: timezone-qualified ICS events are interpreted as UTC and can be falsely reported as exact matches; the registered comparison test covers CSV but not ICS.
- Major: many 390 px touch targets are shorter than 44 px.
- Major: `/offline.html` lacks the shared metadata, navigation, footer, and plain heading.
- Minor: three copy/terminology issues and lack of multiple daily windows remain.

See `.factory/review-3.md` for exact quotes, reproduction evidence, rewrites, and fixes.
