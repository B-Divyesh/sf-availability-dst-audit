# Copy audit — 6 September 2026, repair 2

Landing, demo, result, empty, stale, error, import, offline, privacy, and terms states were read from the production build. Counts use whitespace-delimited words. No sentence exceeds 22 words. No banned marketing term appears.

| Location | Words | Copy |
| --- | ---: | --- |
| H1 | 6 | Check booking hours across clock changes |
| Hero | 15 | For people who publish availability, find hours that shift when daylight saving starts or ends. |
| Primary action | 5 | Try it with sample data |
| Action outcome | 6 | See a completed London–New York audit. |
| Fact | 4 | Runs in your browser |
| Fact | 2 | No account |
| Fact | 5 | Export spreadsheet or calendar files |
| Illustration caption | 11 | Clock changes can shift booking hours. Check the dates that change. |
| Setup heading | 6 | Set working hours and test dates |
| Setup | 5 | Enter the organizer’s local hours. |
| Setup | 9 | Pick a second timezone to compare the booking time. |
| Schedule help | 9 | Only enabled days appear in the expected availability file. |
| Schedule help | 7 | Add separate windows for split working days. |
| Window action | 3 | Add working window |
| Zone help | 7 | Use names such as Europe/London or America/New_York. |
| Zone help | 7 | Do not use abbreviations such as EST. |
| Audit checks | 18 | It marks the first enabled working window after each clock change, plus missing, repeated, duration-changed, or date-shifted times. |
| Saved state | 10 | Run an audit to save this form in this browser. |
| Empty heading | 4 | No audit results yet |
| Empty state | 10 | Set the working hours and dates, then run an audit. |
| Stale heading | 6 | Audit results need a fresh run |
| Stale state | 21 | The previous audit results are hidden because they no longer match the declared hours, zones, or dates. Run the audit again. |
| Clear verdict | 7 | No missing or repeated times found |
| Boundary rule | 13 | A clock-change row is the first enabled working window after an offset change. |
| Result heading | 5 | Expected times in each timezone |
| No-transition state | 16 | No organizer offset change occurs in this window. These audit results remain useful as a baseline. |
| Timezone rules | 13 | The browser checks each local time using timezone rules built into your browser. |
| First-window rule | 11 | The report marks the first enabled working window after each clock change. |
| Repeated-time rule | 10 | It also marks times that repeat or do not occur. |
| Import | 16 | Import a CSV spreadsheet or calendar (.ics) file whose start and end times are in UTC. |
| Import result | 9 | The report finds missing, extra, shifted, and duration-changed slots. |
| Repeated-time help | 6 | Repeated local times are marked Review. |
| Calendar help | 7 | The calendar file uses the earlier occurrence. |
| Missing-time help | 10 | Missing local times are marked Invalid and omitted from it. |
| Comparison privacy | 5 | Files stay in this browser. |
| Demo banner | 7 | Demo — sample data, nothing is saved. |
| Demo detail | 13 | London hours are checked against New York across the March 2026 clock change. |
| Demo reset | 7 | Demo reset to the original London–New York sample. |
| Demo storage | 14 | Sample changes stay in demo storage and are discarded when you start for real. |
| Form error | 9 | Enter a valid organizer timezone name, such as Europe/London. |
| Added-window error | 9 | Wednesday window 3 must end after it starts. |
| Calendar error | 19 | This calendar uses local or timezone-qualified times. Export it again with UTC start and end times ending in Z. |
| File comparison | 7 | Compared 1 published slot in this browser. |
| Offline H1 | 4 | The audit is offline |
| Offline state | 9 | This page was not saved during an earlier visit. |
| Offline recovery | 17 | Reconnect to load it. A sample audit works offline after you open the demo once while connected. |
| Offline action | 5 | Reconnect, then reload the audit |

## Legal-page sentences changed in repair 2

| Location | Words | Copy |
| --- | ---: | --- |
| Privacy data removal | 5 | Use your browser’s site-data controls for availability-dst-audit.sociobot.in. |
| Privacy contact | 12 | Use the Source link below to raise a question in the public repository. |
| Terms warranty | 6 | The tool is provided as is. |
| Terms warranty | 11 | The maintainers do not promise uninterrupted availability or error-free timezone data. |
| Terms license | 7 | Review the source repository for license details. |
| Terms changes | 8 | Check this page for the current terms. |

The prior profiling, future-update, site-data outcome, free-price, and MIT-availability statements were removed because the browser sandbox cannot prove them.

## Terminology table

| Concept | Product term |
| --- | --- |
| Generated output | expected availability file |
| On-page output | audit results |
| First post-change row | clock-change row |
| Imported scheduler data | published slots |
| Multiple periods on a day | working windows |
| Spreadsheet export | CSV spreadsheet |
| Calendar export | calendar (.ics) file |
| Time standard | UTC, defined as Coordinated Universal Time in README |
| Timezone data | timezone rules built into your browser |

## Flags

None.
