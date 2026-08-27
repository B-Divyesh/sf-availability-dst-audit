# Availability DST Audit

A free, local-first preflight for booking availability across daylight-saving changes. It turns declared weekly working hours into a dated expected-slot matrix, highlights civil-time boundary cases, and exports CSV/ICS fixtures for comparison with Calendly, Cal.com, Google Calendar, or another scheduler.

Live product: <https://availability-dst-audit.sociobot.in>

## Who it is for

Consultants, recruiters, and distributed-team coordinators who need evidence that published booking slots continue to respect an organizer’s local working hours when timezone offsets change.

## What it checks

- Organizer offset changes within the chosen date range
- The first scheduled window after each DST boundary
- Missing wall times during a spring-forward jump
- Ambiguous wall times during a fall-back repeat
- Elapsed-duration drift across an offset change
- Comparison-zone projections that land on a different date
- CSV and ICS expected-slot fixtures derived from the same matrix

The audit uses the IANA timezone data shipped by the browser and operating system. It does not reproduce vendor buffers, overrides, notice periods, holidays, or proprietary availability logic. A mismatch is evidence to investigate, not a guarantee of a vendor defect.

## Develop and verify

Requirements: Node.js 20 or newer and npm.

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm run build` is the deployment command. It creates the static site at `dist/`, with `dist/index.html` at the root. To inspect that exact output:

```sh
npm run preview
```

## Architecture and privacy

The app is Vite + vanilla TypeScript with no runtime dependencies. Civil-time resolution is implemented with `Intl.DateTimeFormat`; candidate instants are round-tripped through the chosen IANA zone to detect zero, one, or two mappings. All computation and export generation happen in-browser.

The last successful form configuration is stored in local storage. No schedule, export, analytics event, or tracking identifier is sent to a server. The service worker caches the application shell for repeat offline use.

## Product documentation

- [Visual system and asset provenance](.factory/design.md)
- [Build handoff](.factory/handoff.md)
- [MIT License](LICENSE)

## Deployment

This is a static Azure Static Web Apps artifact. Deploy the contents of `dist/`; infrastructure, DNS, and billing are managed outside this repository.
