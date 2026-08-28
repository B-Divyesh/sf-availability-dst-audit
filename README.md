# Availability DST Audit

Check booking hours across daylight-saving changes before you publish availability.

For consultants, recruiters, and coordinators who publish booking hours in more than one timezone.

Try the completed sample: <https://availability-dst-audit.sociobot.in/?demo=1>

## What it does

- Creates dated expected booking times from weekly hours.
- Shows the first working window after a clock change.
- Marks missing or repeated local times.
- Exports the same results as CSV or UTC ICS.

The browser uses its IANA timezone rules. The tool does not model scheduler buffers, holidays, overrides, or account settings.

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

The audit and exports run in the browser. The sample demo uses separate local storage and is discarded when you start for real. See [the demo notes](.factory/demo.md), [Privacy](https://availability-dst-audit.sociobot.in/privacy/), and [Terms](https://availability-dst-audit.sociobot.in/terms/).

## Deploy

This is a Vite and TypeScript static site for Azure Static Web Apps. Deploy `dist/`; the factory manages infrastructure and DNS.

## Project records

- [Visual system and asset provenance](.factory/design.md)
- [Claim registry](.factory/claims.json)
- [Handoff](.factory/handoff.md)
- [MIT License](LICENSE)
