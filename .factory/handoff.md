# Availability DST Audit — repair 2 handoff

- Work order: `availability-dst-audit-repair-2`
- Status: **complete**
- Live URL: <https://availability-dst-audit.sociobot.in/>
- Implementation revision: `7d2b2717e0c9225e74104abe1e88ee23305820b4`
- Documentation revision: final repository `HEAD` containing this handoff; documentation-only and not redeployed

## Delivered

- Closed F-6-1 by removing five legal and privacy statements that a browser sandbox could not prove. The remaining copy is scoped to observable behavior.
- Closed F-6-2 by extending the four exact claim tests:
  - `sample-audit` checks both Wednesday windows.
  - `browser-timezone-rules` checks UTC before and after the London clock change while local hours stay fixed.
  - `multiple-daily-windows` checks all three windows in both spreadsheet and calendar exports.
  - `privacy-local` uploads and compares a user file while recording the full request log.
- Closed F-6-3 by preserving each window's displayed index during validation. A blank third Wednesday window now reports `Wednesday window 3 must end after it starts.`
- Added unit and browser recovery coverage for the invalid added window.
- Updated the copy ledger and every route's visible build id to `repair-2`.
- Kept the free, static, browser-only product scope. No billing registration or backend applies.

## Clean-checkout verification

A fresh local clone of `origin/main` at the implementation revision was used.

```sh
npm ci
npm test
npm run build
node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
# Every printed command was run independently.
npm run test:e2e
```

Results:

- `npm ci`: 61 packages, zero audit vulnerabilities.
- `npm test`: 11/11 passed.
- `npm run build`: passed and produced `dist/`.
- All 12 exact claim commands passed on desktop and 390 px phone: 24/24 executions.
- Full browser suite: 47 passed and one intentional desktop skip for the phone-only target audit.
- Each of the 12 claim ids occurs in exactly one tagged browser test.
- Factory URL verification passed locally for Root, Demo, Privacy, Terms, Offline, and the designed 404 document. Every page had a title, `lang="en"`, one h1, one main landmark, complete image alternatives, and no console error.
- Playwright axe checks found zero serious or critical issues in the sample, stale state, legal pages, Offline, and 404 routes.

Build sizes:

- JavaScript: 28.82 KB raw total (`27.22 KB` app plus `1.59 KB` route focus).
- CSS: 18.07 KB raw.
- Loaded hero WebP: 139.03 KB.

## Production deployment and identity

The interrupted repair attempt successfully uploaded the production build to the existing `sf-availability-dst-audit` Static Web App. This continuation did not repeat the same upload. The custom HTTPS site returned 200 and the deployed files match the clean build byte for byte:

- Root HTML SHA-256: `cc8823ab8c4b137f45d7b5d6d43d61c647e3a255fc66683f20217c0da8170e64`.
- Demo, Privacy, Terms, Offline, service worker, JavaScript, CSS, PNG, and WebP hashes also matched.
- Security headers include the same-origin CSP, HSTS, `nosniff`, referrer policy, and denied camera, microphone, and geolocation.

## Cold live checks

Fresh Chromium contexts opened the live root at 1440 × 900 and 390 × 844 without scrolling.

- Job: **“Check booking hours across clock changes.”**
- Audience: **“For people who publish availability, find hours that shift when daylight saving starts or ends.”**
- First action: **“Try it with sample data.”** The adjacent outcome is **“See a completed London–New York audit.”**
- The action ended at 815 px on desktop and 516 px on phone. All three facts ended at 887 px and 649 px respectively. Neither view overflowed horizontally.

The one-click sample then proved:

- Persistent **“Demo — sample data, nothing is saved.”** label.
- 12 expected windows, including Wednesday `09:00–12:00` and `13:00–17:00`.
- One boundary row on 30 March 2026.
- Published comparison totals of 9 matched, 1 missing, 1 extra, 1 shifted, and 1 duration change.
- Spreadsheet output with 12 rows and both split windows; calendar output with 12 events and both split starts.
- Uploaded-file comparison completed in the browser.
- A blank third Wednesday window focused the alert and named window 3. Reset restored the two-window sample and completed output.
- A seeded real key stayed byte-for-byte unchanged throughout demo edits and reset. Starting for real removed the demo key and preserved the real key.
- The complete live sample, both exports, uploaded-file comparison, reset, and exit used only the product origin.

Live route checks found zero serious or critical axe issues and no unexpected console errors on Root, Demo, Privacy, Terms, Offline, and the designed missing-route page. The missing URL correctly returned HTTP 404 with **“That page was not found”** and a route back; its browser 404 resource message is expected, not a defect. Every linked page, asset, hash target, sample download, and public source link returned successfully.

Keyboard focus uses a 2 px signal-green outline. Route entry focuses and announces the h1; the skip link is keyboard-operable and focuses the page heading. Reduced motion changes transitions to `0.00001s` and scrolling to `auto`. At 200% text size, the h1 and first action remain available without document overflow.

The service worker update completed, cache `availability-dst-audit-v9` was active, and a network-disabled reload restored the banner, verdict, and all 12 sample rows.

Fresh mobile Lighthouse results:

- Performance 100
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 1.1 s, LCP 1.6 s, TBT 30 ms, CLS 0

INP is not produced by this single-navigation lab run. Browser tests exercised the interactive paths without errors.

## Earlier finding disposition

- Verification P1 remains fixed: stale rows are removed, exports disable, and axe reports no serious or critical issue.
- F-1-1 through F-1-8 remain fixed: the first screen, isolated demo, claims, plain copy, 404, metadata, and shared navigation all passed live.
- F-2-1 through F-2-7 remain fixed: the completed phone demo, exact boundary rule, terminology, complete Demo route, route focus, and published-file comparison all passed.
- F-3-1 through F-3-7 remain fixed: strict UTC calendar import, 44 px targets, Offline route, precise copy, and split working windows all passed.
- F-4-1 remains fixed: the decorative figure label is absent.
- F-6-1 through F-6-3 are closed by the changes and evidence above.

## Known limits

- Timezone results use the IANA rules shipped with the visitor's browser.
- Imported calendar events must use explicit UTC timestamps ending in `Z`.
- The audit does not model vendor-specific buffers, holidays, overrides, notice periods, or account settings.
- This is a static browser product. Backend tenant, SQLite persistence, health, restart, and 429 checks do not apply. CLI, library, and desktop consumer checks do not apply.

No product defect or untested registered claim remains.
