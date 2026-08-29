# Demo sandbox

Open <https://availability-dst-audit.sociobot.in/demo/> to load a completed London/New York audit for 23 March–3 April 2026. `?demo=1` is a supported direct demo entry. Monday, Tuesday, Thursday, and Friday use 09:00–17:00. Wednesday uses 09:00–12:00 and 13:00–17:00, proving split-day support. The 12-row report, one 29 March clock-change row, first table rows, and local published-slot comparison appear before setup. Spreadsheet and calendar downloads work in the sandbox.

The demo seeds a realistic published-slot spreadsheet with one missing, one extra, one shifted, and one duration-changed slot. It is available at `/sample-published-availability.csv`; importing spreadsheet or calendar files always happens in-browser. Calendar events must use UTC timestamps ending in `Z`.

Demo mode writes only `demo:availability-dst-audit:config:v1` in local storage. It never reads the real `availability-dst-audit:config:v1` key. **Reset demo** removes and recreates the demo key. **Start for real** removes the demo key before returning to the normal audit.

Every claim test starts from `/demo/` or the direct `/?demo=1` entry in a fresh browser context. The offline claim first visits the demo while online so the service worker can cache the shell.
