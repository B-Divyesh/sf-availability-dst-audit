# Polish 2 — review finding closure

Base reviewed: 47144ec7feaa956cf8e48e888d7408abb6050b4e  
Repair commits: 5edeec3, de59043

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the plain first-screen headline, named people who publish availability, a sample action, outcome, and three facts. | Live root verification: <https://availability-dst-audit.sociobot.in/>; .factory/evidence/polish-2/live/root/screenshot-mobile.png. |
| F-1-2 | Kept the isolated direct ?demo=1 entry and added the complete canonical /demo/ route. Demo now opens on the completed report, banner, reset/start controls, boundary summary, and rows. | @claim:sample-audit, @claim:demo-isolation; .factory/evidence/polish-2/live/demo/screenshot-mobile.png; <https://availability-dst-audit.sociobot.in/demo/>. |
| F-1-3 | Expanded .factory/claims.json to eleven observable claims, each with one tagged browser test. | Every exact command in claims.json passed from a clean clone. |
| F-1-4 | Registered and tested expected rows, browser timezone behavior, one-boundary-row behavior, downloads, time edges, comparison dates, local comparison, storage, privacy, and offline reload. | tests/claims.spec.ts; clean-clone claim run. |
| F-1-5 | Rewrote README claims to match the registry and added local published-file comparison. | README; @claim:published-comparison, @claim:privacy-local, @claim:offline-reload. |
| F-1-6 | Replaced visitor-facing fixture/matrix/IANA jargon with audit results, expected availability file, and browser timezone rules; audited normal, demo, error, and stale strings. | .factory/copy-audit.md; live demo screenshot. |
| F-1-7 | Preserved the designed 404 and its Azure response override. | <https://availability-dst-audit.sociobot.in/not-a-real-page> returns HTTP 404 with product title, h1, main, and demo link. |
| F-1-8 | Kept shared metadata/navigation and added a true metadata-complete demo document. | demo/index.html; tests/smoke.spec.ts canonical-route check; live /demo/ verify JSON. |
| F-2-1 | Moved demo results ahead of setup, hid redundant marketing hero in demo mode, and compressed mobile demo chrome so three sample rows are visible at 390×844. | demo first-screen browser check; .factory/evidence/polish-2/live/demo/screenshot-mobile.png; live mobile verdict top 312px. |
| F-2-2 | Rebuilt transition detection to find each actual offset instant and flag only the first valid enabled window after it. Added negative assertions for later rows. | @claim:first-boundary-window; live ?demo=1 has Boundary on 30 March and Expected on 31 March. |
| F-2-3 | Corrected README to promise the same tested first-enabled-window rule. | @claim:first-boundary-window; README. |
| F-2-4 | Replaced stale/demo result vocabulary and rebuilt the terminology table. | .factory/copy-audit.md; tests/smoke.spec.ts stale-state check. |
| F-2-5 | Replaced the meta-refresh shell with Vite-built /demo/index.html containing its own title, description, canonical, OG/Twitter metadata, favicon, h1, and main. | tests/smoke.spec.ts canonical-route check; <https://availability-dst-audit.sociobot.in/demo/>. |
| F-2-6 | Added route focus and polite route announcements on initial navigation, hash navigation, back/forward, legal routes, and 404. | tests/smoke.spec.ts route-focus check; live Privacy h1 receives focus. |
| F-2-7 | Added browser-only UTC CSV/ICS import and deterministic comparison for missing, extra, shifted, and duration-changed published slots. Demo supplies a realistic comparison file. | @claim:published-comparison; live demo comparison panel; /sample-published-availability.csv. |

## Final local and live evidence

- Clean clone at de59043: npm ci, npm test (8/8), npm run build, every individual claims.json command (11 × desktop/mobile), and npm run test:e2e (34/34) passed.
- Local verify-url.sh passed for / and /demo/; both reported title, lang=en, one h1, main, image alt coverage, and no console errors.
- Playwright Axe scans in the browser suite reported no serious or critical violations. The standalone Axe CLI could not start Chromium under Selenium in this container; the installed Playwright Axe integration is the authoritative executed scan.
- Production deploy f4d8bb9f-408f-4587-9661-2daace520b8d completed successfully. Live root, demo, Privacy, and Terms all returned 200 and no console errors; the product 404 returned 404.
