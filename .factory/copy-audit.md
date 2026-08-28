# Copy audit — 28 August 2026

## Landing page units

| Unit | Words | Result |
| --- | ---: | --- |
| Daylight-saving availability check | 3 | Plain label |
| Check booking hours across clock changes | 6 | Plain job headline |
| For people who publish availability, find hours that shift when daylight saving starts or ends. | 14 | Names audience and change |
| Try it with sample data | 5 | Clear first action |
| See a completed London–New York audit. | 6 | Explains outcome |
| Runs in your browser | 4 | Claim: `privacy-local` |
| No account | 2 | Demonstrated by sample flow |
| Export CSV or ICS | 4 | Claim: `exports` |
| Clock changes can shift booking hours. Check the dates that change. | 10 | Plain caption |
| Set working hours and test dates | 6 | Plain section heading |
| Enter the organizer’s local hours. Pick a second timezone to compare the booking time. | 14 | Plain instructions |
| Only enabled days appear in the expected availability file. Use one continuous window per day. | 16 | Scope and claim: `sample-audit` |
| Use names such as Europe/London or America/New_York. Do not use abbreviations such as EST. | 14 | Input help |
| It marks offset changes, missing times, repeated times, duration changes, and date changes in the comparison timezone. | 16 | Claim: `time-edge-cases` |
| How the audit works | 5 | Plain section heading |
| The browser checks each local time using the selected timezone’s IANA rules. | 13 | Claim: `browser-iana` |
| The results show the first working window after an offset change. They also mark times that repeat or do not occur. | 20 | Claim: `time-edge-cases` |
| Export an expected availability file. Compare it with your booking page before you publish hours. | 16 | Claim: `exports` |
| Repeated local times are marked Review. The ICS file uses the earlier occurrence. Missing local times are marked Invalid and omitted from ICS. | 21 | Claim: `time-edge-cases` |

Every landing sentence is 22 words or fewer. No banned marketing words appear.

## Terminology

| Concept | One term |
| --- | --- |
| Generated result | expected availability file |
| Weekly declaration | working hours |
| Daylight-saving change | clock change |
| Safe sample state | demo |
