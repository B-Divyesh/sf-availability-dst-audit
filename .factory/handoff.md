# Availability DST Audit — review 6 handoff

Work order: `availability-dst-audit-review-6`
Verdict: **FAIL**
Live URL: <https://availability-dst-audit.sociobot.in/>
Implementation candidate: `2b0b933201a0bc77f06a3a4b7dd79407c4e42272`
Documentation revision reviewed: `790425a4e8cb32bb4a637024df59c6f1f943945f`

## Delivered

- Added `.factory/review-6.md` with the independent seven-day review.
- Changed no product code and performed no deployment.
- Recorded 3 findings: 2 blocking claim-contract gaps and 1 minor invalid-window error.
- Recorded 9 untested or incompletely tested public claims.

## Verification

From a separate clean clone:

    npm ci
    npm test
    npm run build
    node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
    # Each printed command was run independently.
    npm run test:e2e

Results:

- `npm test`: 10/10 passed.
- Build: passed and produced `dist/`.
- Exact claim commands: all 12 exited successfully in desktop and phone projects, 24/24 executions.
- Claim review: 4 commands are materially incomplete, and 5 public legal/privacy claims have no command.
- Full browser suite: 43 passed and 1 intentional desktop skip.
- Live factory verifier: Root, Demo, Privacy, Terms, and Offline passed after using its documented global Playwright dependency.
- Live axe: zero serious/critical issues on all public routes, the designed 404, and stale results at 390 px.
- Live sample: 12 rows, split Wednesday, one boundary, four comparison difference kinds, working CSV/calendar downloads, safe reset and exit.
- Live privacy/offline: only the product origin was requested; the completed demo reloaded offline; service-worker update completed.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.484 s, TBT 49 ms, CLS 0.
- Live files match the clean build byte for byte. Later commits after `2b0b933` are documentation only.

## Findings to resolve

1. Add tests or remove five unregistered public claims on Privacy and Terms.
2. Complete the `sample-audit`, `browser-timezone-rules`, `multiple-daily-windows`, and `privacy-local` tagged tests.
3. Report the displayed third window, not window 1, when a newly added third window is empty.

See `.factory/review-6.md` for exact copy, reproduction, evidence, and every historical disposition.
