# Demo sandbox

Open <https://availability-dst-audit.sociobot.in/?demo=1> (or `/demo/`) to load a completed London 09:00–17:00 / New York audit for 23 March–3 April 2026. It includes the 29 March London daylight-saving boundary and working CSV and ICS downloads.

Demo mode writes only `demo:availability-dst-audit:config:v1` in local storage. It never reads the real `availability-dst-audit:config:v1` key. **Reset demo** removes and recreates the demo key. **Start for real** removes the demo key before returning to the normal audit.

Every claim test starts from `/?demo=1` in a fresh browser context. The offline claim first visits the demo while online so the service worker can cache the shell.
