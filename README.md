# Availability DST Audit

Check booking hours across daylight-saving changes before you publish availability.

For consultants, recruiters, and coordinators who publish booking hours in more than one timezone.

[Try the completed sample](https://availability-dst-audit.sociobot.in/demo/).

## What it does

- Creates dated expected booking times from weekly hours.
- Supports multiple working windows on each weekday.
- Marks the first enabled working window after a clock change.
- Marks missing or repeated local times.
- Exports the same results as a CSV spreadsheet or calendar (`.ics`) file.
- Compares imported UTC spreadsheet or calendar slots with expected availability.

The browser uses timezone rules built into your browser. IANA is the public timezone-name standard behind names such as Europe/London. The tool does not model scheduler buffers, holidays, overrides, or account settings.

Imported start and end times must use UTC, which means Coordinated Universal Time. The tool rejects timezone-qualified or floating calendar times.

## Run and verify

Use Node.js 20 or later.

```sh
npm ci
npm run dev
npm test
npm run build
npm run test:e2e
```

Run every published claim check from the sample sandbox:

```sh
node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
# Run each printed command.
```

`npm run build` writes the deployable static site to `dist/`.

## Privacy and demo

The audit, exports, and file comparison run in the browser. The sample demo uses separate local storage and is discarded when you start for real. See [the demo notes](.factory/demo.md), [Privacy](https://availability-dst-audit.sociobot.in/privacy/), and [Terms](https://availability-dst-audit.sociobot.in/terms/).

After one connected visit, the sample audit reloads offline.

## Deploy

This is a Vite and TypeScript static site for Azure Static Web Apps. Deploy `dist/`; the factory manages infrastructure and DNS.

## Project records

- [Visual system and asset provenance](.factory/design.md)
- [Claim registry](.factory/claims.json)
- [Handoff](.factory/handoff.md)
- [MIT License](LICENSE)
