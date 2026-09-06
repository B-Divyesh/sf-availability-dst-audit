# Check booking hours across clock changes — verification 3 handoff

- Work order: `availability-dst-audit-verify-3`
- Verdict: **FAIL**
- Findings: **2 minor**
- Untested claims: **0**
- Live URL: <https://availability-dst-audit.sociobot.in/>
- Implementation reviewed: `7d2b2717e0c9225e74104abe1e88ee23305820b4`
- Starting documentation revision: `2aacaf69a271f8ca2559246556d3f74c74c7f149`
- Full report: [verification-3.md](verification-3.md)

## What was verified

Fresh desktop and 390 px phone contexts checked the live first screen, one-click sample, persistent demo label, realistic output, reset, Start for real, and real-data isolation. The live sample had 12 rows, two Wednesday windows, one clock-change row, four published-slot finding kinds, and correct CSV/calendar exports.

Normal, invalid, stale, date-limit, spring missing-time, fall repeated-time, and recovery paths passed. Valid UTC files compared; timezone-qualified calendar data was rejected. Offline reload restored the completed sample. Actual live links, route titles, legal pages, metadata, designed 404, keyboard focus, reduced motion, 200% text, phone targets, request origins, security headers, and deployment identity were checked.

All earlier findings were retested. Review-6 claim gaps and the window-3 error are closed. The report contains the finding-by-finding disposition.

## Clean-checkout results

```sh
npm ci
npm test
npm run build
node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
# Every printed command was run independently.
npm run test:e2e
```

- Unit tests: 11/11 passed.
- Exact claim commands: 12 commands, 24/24 desktop and phone runs passed.
- Full browser suite: 47 passed, one intentional desktop skip.
- Build produced `dist/` with 28.82 KB raw JavaScript, 18.07 KB CSS, and a 139.03 KB loaded hero WebP.
- Fresh mobile Lighthouse: 99 Performance, 100 Accessibility, 100 Best Practices, 100 SEO; LCP 1.6 s, TBT 110 ms, CLS 0.
- Live root and referenced hashed assets matched the clean build byte for byte.

## Findings left for repair

1. **V3-1, minor:** a one-window audit says **“1 expected windows computed.”** Use the singular and add a one-window browser assertion.
2. **V3-2, minor:** successful completion uses the danger color and the form error’s assertive `role="alert"`. Give success a verified-state style and polite status semantics while retaining the focused alert for errors.

Product code was not changed during verification.

## Evidence and limits

The report is `.factory/verification-3.md`. Local screenshots, verifier output, live assertion scripts, and Lighthouse JSON are under `.factory/evidence/verification-3/`; machine-readable live results are under `/work/.evidence/`.

This is a static browser product. Backend, SQLite, tenant, health, restart, and 429 checks do not apply. CLI, library, and desktop installation checks do not apply. Browser timezone results depend on the visitor’s shipped IANA data, and imported calendar events must use UTC timestamps ending in `Z`.
