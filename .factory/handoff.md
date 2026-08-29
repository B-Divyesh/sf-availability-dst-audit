# Availability DST Audit — polish 2 handoff

Work order: availability-dst-audit-polish-2
Base: 56c8d3c8de8819e18ebd342b846b6c94013e9f50
Repair commits: 5edeec3 and de59043
Deployed revision: de59043

## Delivered

- Corrected DST transition detection so only the first enabled post-change window is boundary-marked.
- Made the sample demo a complete canonical /demo/ route and put the completed audit, boundary summary, sample rows, reset, and real-mode exit in its first screen.
- Added local UTC CSV/ICS published-availability import with missing, extra, shifted, and duration comparison.
- Added complete claim coverage, a real demo metadata document, route focus/announcement behavior, revised plain language, and updated demo, README, catalog, and copy records.
- Preserved the dark pixel-console visual system and original observatory artwork.

## Run and verify

Use Node.js 20 or later:

    npm ci
    npm test
    npm run build
    npm run test:e2e

Run each exact command in .factory/claims.json. The static deployment output is dist/.

## Evidence

- Final clean clone at de59043: npm test passed 8/8; npm run build passed; every one of 11 claim commands passed on desktop and 390px; npm run test:e2e passed 34/34.
- Local verify-url.sh passed for root and demo. Both had a title, lang=en, exactly one h1, main, alt-complete images, and no console errors.
- Browser Axe integration found zero serious/critical violations. The standalone Axe CLI could not launch Selenium Chrome in this container, so the executed Playwright Axe scan is the accessibility evidence.
- Deployment f4d8bb9f-408f-4587-9661-2daace520b8d succeeded through /opt/fleet/lib/deploy-static.sh.
- Cold live checks: root, demo, Privacy, and Terms returned 200. The live demo had title Demo — Availability DST Audit, banner, 10 rows, one boundary row on 30 March, no boundary on 31 March, and 1 missing/extra/shifted/duration comparison result. Privacy focused its h1 on route load. The designed missing route returned 404 with the product title, h1, main, and demo link.
- Screenshots and machine-readable checks: .factory/evidence/polish-2/live/.

## Known gaps

None. The standalone Axe CLI limitation is environmental only; equivalent Playwright Axe scans passed.
