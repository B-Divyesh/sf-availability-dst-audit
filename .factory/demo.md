# Demo sandbox

Open <https://availability-dst-audit.sociobot.in/demo/> to load a completed London 09:00–17:00 / New York audit for 23 March–3 April 2026. `?demo=1` is a supported direct demo entry. The completed report, its one 29 March clock-change row, first sample table rows, and a local published-slot comparison appear before the setup form. CSV and ICS downloads work in the sandbox.

The demo seeds a realistic published-slot CSV with one missing, one extra, one shifted, and one duration-changed slot. It is available for download at `/sample-published-availability.csv`; importing a CSV or ICS always happens in-browser.

Demo mode writes only `demo:availability-dst-audit:config:v1` in local storage. It never reads the real `availability-dst-audit:config:v1` key. **Reset demo** removes and recreates the demo key. **Start for real** removes the demo key before returning to the normal audit.

Every claim test starts from `/demo/` or the direct `/?demo=1` entry in a fresh browser context. The offline claim first visits the demo while online so the service worker can cache the shell.
