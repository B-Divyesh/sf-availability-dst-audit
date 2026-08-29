# Copy audit — 29 August 2026

Landing, demo, empty, stale, error, and comparison states were read from the rendered source. Counts use whitespace-delimited words. No sentence exceeds 22 words and no banned marketing term appears.

| Location | Words | Copy |
| --- | ---: | --- |
| H1 | 6 | Check booking hours across clock changes |
| Hero | 15 | For people who publish availability, find hours that shift when daylight saving starts or ends. |
| Action outcome | 6 | See a completed London–New York audit. |
| Fact | 4 | Runs in your browser |
| Fact | 2 | No account |
| Fact | 4 | Export CSV or ICS |
| Setup | 5 | Enter the organizer’s local hours. |
| Setup | 9 | Pick a second timezone to compare the booking time. |
| Schedule help | 15 | Only enabled days appear in the expected availability file. Use one continuous window per day. |
| Zone help | 16 | Use names such as Europe/London or America/New_York. Do not use abbreviations such as EST. |
| Audit checks | 17 | It marks the first post-change window, missing or repeated times, duration changes, and comparison dates. |
| Saved state | 10 | Run an audit to save this form in this browser. |
| Empty state | 10 | Set the working hours and dates, then run an audit. |
| Stale title | 6 | Audit results need a fresh run |
| Stale state | 19 | The previous audit results are hidden because they no longer match the declared hours, zones, or dates. Run the audit again. |
| Clear verdict | 7 | No missing or repeated times found |
| Boundary rule | 15 | A clock-change row is the first enabled working window after an offset change. |
| No-transition state | 16 | No organizer offset change occurs in this window. These audit results remain useful as a baseline. |
| Timezone rules | 12 | The browser checks each local time using timezone rules built into your browser. |
| First-window rule | 17 | The report marks the first enabled working window after each clock change. It also marks times that repeat or do not occur. |
| Import | 14 | Import a UTC CSV or ICS file. The report finds missing, extra, shifted, and duration-changed slots. |
| Repeated/missing help | 20 | Repeated local times are marked Review. The ICS file uses the earlier occurrence. Missing local times are marked Invalid and omitted from ICS. |
| Comparison empty | 19 | Import UTC CSV or ICS slots to find missing, extra, shifted, or duration-changed times. Files stay in this browser. |
| Comparison result | 4 | Published slots need review |
| Demo banner | 7 | Demo — sample data, nothing is saved. |
| Demo detail | 13 | London hours are checked against New York across the March 2026 clock change. |
| Demo reset | 9 | Demo reset to the original London–New York sample. |
| Form error | 14 | Enter a valid organizer timezone name, such as Europe/London. |

## Terminology table

| Concept | Product term |
| --- | --- |
| Generated output | expected availability file |
| On-page output | audit results |
| First post-DST row | clock-change row |
| Imported scheduler data | published slots |
| Timezone database behavior | timezone rules built into your browser |

## Flags

None. “IANA” remains only in README technical documentation, where it is defined immediately.
