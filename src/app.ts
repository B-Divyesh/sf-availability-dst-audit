import './style.css';
import { runAudit, transitionLabel, validateConfig } from './audit';
import { downloadText, resultToCsv, resultToIcs } from './export';
import type { AuditConfig, AuditResult, DaySchedule } from './types';

const STORAGE_KEY = 'availability-dst-audit:config:v1';
const DEMO_STORAGE_KEY = 'demo:availability-dst-audit:config:v1';
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const demoMode = new URLSearchParams(location.search).get('demo') === '1' || location.pathname === '/demo/' || location.pathname === '/demo';

const form = document.querySelector<HTMLFormElement>('#audit-form')!;
const results = document.querySelector<HTMLElement>('#results')!;
const statusRegion = document.querySelector<HTMLElement>('#form-status')!;
const offlineBanner = document.querySelector<HTMLElement>('#offline-banner')!;
const zoneList = document.querySelector<HTMLDataListElement>('#timezone-options')!;
const exportCsv = document.querySelector<HTMLButtonElement>('#export-csv')!;
const exportIcs = document.querySelector<HTMLButtonElement>('#export-ics')!;
const configSaved = document.querySelector<HTMLElement>('#saved-state')!;
const demoBanner = document.querySelector<HTMLElement>('#demo-banner')!;
const resetDemo = document.querySelector<HTMLButtonElement>('#reset-demo')!;
const startReal = document.querySelector<HTMLAnchorElement>('#start-real')!;

let currentResult: AuditResult | null = null;
let currentConfig: AuditConfig | null = null;

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaults(): AuditConfig {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + 42 * 86_400_000);
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/London';
  return {
    organizerZone: detected,
    comparisonZone: detected === 'America/New_York' ? 'Europe/London' : 'America/New_York',
    startDate: isoDate(start),
    endDate: isoDate(end),
    schedule: dayNames.map((_, weekday) => ({
      weekday,
      enabled: weekday > 0 && weekday < 6,
      start: '09:00',
      end: '17:00',
    })),
  };
}

function demoConfig(): AuditConfig {
  return {
    organizerZone: 'Europe/London',
    comparisonZone: 'America/New_York',
    startDate: '2026-03-23',
    endDate: '2026-04-03',
    schedule: dayNames.map((_, weekday) => ({
      weekday,
      enabled: weekday > 0 && weekday < 6,
      start: '09:00',
      end: '17:00',
    })),
  };
}

function loadConfig(): AuditConfig {
  try {
    const saved = localStorage.getItem(demoMode ? DEMO_STORAGE_KEY : STORAGE_KEY);
    if (saved) return JSON.parse(saved) as AuditConfig;
  } catch {
    configSaved.textContent = 'Local preferences are unavailable in this browser.';
  }
  return defaults();
}

function populateZones() {
  const fallback = ['Africa/Johannesburg', 'America/Chicago', 'America/Los_Angeles', 'America/New_York', 'Asia/Kolkata', 'Asia/Singapore', 'Australia/Sydney', 'Europe/Berlin', 'Europe/London', 'Pacific/Auckland', 'UTC'];
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: 'timeZone') => string[] };
  const zones = intl.supportedValuesOf?.('timeZone') ?? fallback;
  zoneList.replaceChildren(...zones.map((zone) => {
    const option = document.createElement('option');
    option.value = zone;
    return option;
  }));
}

function renderSchedule(schedule: DaySchedule[]) {
  const container = document.querySelector<HTMLElement>('#weekly-hours')!;
  container.innerHTML = schedule.map((day) => `
    <div class="hours-row" data-weekday="${day.weekday}">
      <label class="day-toggle">
        <input type="checkbox" name="day-${day.weekday}" ${day.enabled ? 'checked' : ''}>
        <span>${dayNames[day.weekday]}</span>
      </label>
      <div class="time-pair">
        <label>
          <span class="sr-only">${dayNames[day.weekday]} start time</span>
          <input type="time" name="start-${day.weekday}" value="${day.start}" ${day.enabled ? '' : 'disabled'}>
        </label>
        <span aria-hidden="true">→</span>
        <label>
          <span class="sr-only">${dayNames[day.weekday]} end time</span>
          <input type="time" name="end-${day.weekday}" value="${day.end}" ${day.enabled ? '' : 'disabled'}>
        </label>
      </div>
      <span class="day-state">${day.enabled ? 'Open' : 'Closed'}</span>
    </div>
  `).join('');

  container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const row = checkbox.closest<HTMLElement>('.hours-row')!;
      row.querySelectorAll<HTMLInputElement>('input[type="time"]').forEach((input) => { input.disabled = !checkbox.checked; });
      row.querySelector<HTMLElement>('.day-state')!.textContent = checkbox.checked ? 'Open' : 'Closed';
      markStale();
    });
  });
}

function setForm(config: AuditConfig) {
  (form.elements.namedItem('organizer-zone') as HTMLInputElement).value = config.organizerZone;
  (form.elements.namedItem('comparison-zone') as HTMLInputElement).value = config.comparisonZone;
  (form.elements.namedItem('start-date') as HTMLInputElement).value = config.startDate;
  (form.elements.namedItem('end-date') as HTMLInputElement).value = config.endDate;
  renderSchedule(config.schedule);
}

function getConfig(): AuditConfig {
  return {
    organizerZone: (form.elements.namedItem('organizer-zone') as HTMLInputElement).value.trim(),
    comparisonZone: (form.elements.namedItem('comparison-zone') as HTMLInputElement).value.trim(),
    startDate: (form.elements.namedItem('start-date') as HTMLInputElement).value,
    endDate: (form.elements.namedItem('end-date') as HTMLInputElement).value,
    schedule: dayNames.map((_, weekday) => ({
      weekday,
      enabled: (form.elements.namedItem(`day-${weekday}`) as HTMLInputElement).checked,
      start: (form.elements.namedItem(`start-${weekday}`) as HTMLInputElement).value,
      end: (form.elements.namedItem(`end-${weekday}`) as HTMLInputElement).value,
    })),
  };
}

function markStale() {
  if (!currentResult) return;
  results.dataset.stale = 'true';
  results.innerHTML = `
    <section class="stale-state" aria-labelledby="stale-title">
      <span class="stale-glyph" aria-hidden="true">↻</span>
      <div>
        <p id="results-stale" class="stale-note" role="status">Configuration changed. Run the audit again before exporting.</p>
        <h2 id="stale-title">Fixture needs a fresh run</h2>
        <p>The previous matrix is hidden because it no longer matches the declared hours, zones, or dates. Run the audit to generate an updated fixture.</p>
      </div>
    </section>`;
  exportCsv.disabled = true;
  exportIcs.disabled = true;
}

function renderEmpty(message: string) {
  currentResult = null;
  results.innerHTML = `
    <div class="empty-state">
      <div class="empty-pixel" aria-hidden="true">⌁</div>
      <h2>No audit results yet</h2>
      <p>${message}</p>
      <a href="#setup" class="text-link">Review configuration ↑</a>
    </div>`;
  results.removeAttribute('data-stale');
  exportCsv.disabled = true;
  exportIcs.disabled = true;
}

function statusMarkup(status: string) {
  const labels: Record<string, string> = {
    expected: '✓ Expected',
    boundary: '◆ Boundary',
    warning: '! Review',
    invalid: '× Invalid',
  };
  return `<span class="status status--${status}">${labels[status] ?? status}</span>`;
}

function renderResults(config: AuditConfig, result: AuditResult) {
  if (!result.rows.length) {
    renderEmpty('No enabled availability falls within this date range. Extend the range or enable another weekday.');
    return;
  }
  const issues = result.warningCount + result.invalidCount;
  const verdictClass = issues ? 'review' : 'clear';
  const transitions = result.transitions.length
    ? `<ul>${result.transitions.map((item) => `<li><code>${transitionLabel(item)}</code></li>`).join('')}</ul>`
    : '<p>No organizer offset change occurs in this window. The fixture is still useful as a baseline.</p>';
  const rows = result.rows.map((row) => `
    <tr>
      <td><strong>${row.date}</strong><span class="cell-sub">${row.weekday}</span></td>
      <td><span class="time-value">${row.localWindow}</span><span class="cell-sub">${row.organizerOffset === null ? '' : `offset ${formatOffsetUi(row.organizerOffset)}`}</span></td>
      <td><span class="time-value">${row.utcWindow}</span><span class="cell-sub">${row.durationMinutes === null ? '—' : `${row.durationMinutes} minutes`}</span></td>
      <td><span class="time-value comparison">${row.comparisonWindow}</span><span class="cell-sub">${row.comparisonDate}</span></td>
      <td>${statusMarkup(row.status)}<span class="cell-sub flag-copy">${row.flags.join(' · ') || 'No boundary flags'}</span></td>
    </tr>`).join('');
  results.innerHTML = `
    <p id="results-stale" class="stale-note" role="status" hidden>Configuration changed. Run the audit again before exporting.</p>
    <div class="verdict verdict--${verdictClass}">
      <div>
        <span class="eyebrow">Audit verdict</span>
        <h2>${issues ? `${issues} window${issues === 1 ? '' : 's'} need review` : 'Expected availability is internally consistent'}</h2>
        <p>${result.rows.length} expected windows · ${result.boundaryCount} boundary cases · ${(result.totalMinutes / 60).toLocaleString()} hours</p>
      </div>
      <span class="verdict-mark" aria-hidden="true">${issues ? '!' : '✓'}</span>
    </div>
    <div class="boundary-summary">
      <div>
        <span class="eyebrow">Detected organizer boundaries</span>
        <h3>${result.transitions.length} offset change${result.transitions.length === 1 ? '' : 's'}</h3>
      </div>
      ${transitions}
    </div>
    <div class="table-heading">
      <div>
        <span class="eyebrow">Expected availability times</span>
        <h3>Declared hours in each timezone</h3>
      </div>
      <p>Boundary rows are the first working windows after a clock change.</p>
    </div>
    <div class="table-wrap" tabindex="0" aria-label="Scrollable expected-slot matrix">
      <table>
        <caption class="sr-only">Expected availability slots from ${config.startDate} through ${config.endDate}</caption>
        <thead><tr>
          <th scope="col">Organizer date</th>
          <th scope="col">Declared local</th>
          <th scope="col">UTC fixture</th>
          <th scope="col">${config.comparisonZone}</th>
          <th scope="col">Finding</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  exportCsv.disabled = false;
  exportIcs.disabled = false;
  results.removeAttribute('data-stale');
}

function saveConfig(config: AuditConfig) {
  try {
    localStorage.setItem(demoMode ? DEMO_STORAGE_KEY : STORAGE_KEY, JSON.stringify(config));
    configSaved.textContent = demoMode
      ? 'Sample changes stay in demo storage and are discarded when you start for real.'
      : 'Configuration saved only in this browser.';
  } catch {
    configSaved.textContent = demoMode
      ? 'Sample audit complete. Demo storage is unavailable in this browser.'
      : 'Audit complete. Local preferences could not be saved.';
  }
}

function runCurrentAudit({ scroll = true }: { scroll?: boolean } = {}) {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const config = getConfig();
  const errors = validateConfig(config);
  statusRegion.replaceChildren();
  if (errors.length) {
    statusRegion.innerHTML = `<strong>Audit not run.</strong><ul>${errors.map((error) => `<li>${error}</li>`).join('')}</ul>`;
    statusRegion.focus();
    return;
  }
  button.disabled = true;
  button.textContent = 'Running audit…';
  try {
    currentResult = runAudit(config);
    currentConfig = config;
    saveConfig(config);
    renderResults(config, currentResult);
    statusRegion.textContent = `Audit complete: ${currentResult.rows.length} expected windows computed.`;
    if (scroll) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      results.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  } catch (error) {
    statusRegion.textContent = error instanceof Error ? error.message : 'The audit could not be computed. Check the inputs and try again.';
  } finally {
    button.disabled = false;
    button.textContent = 'Run audit';
  }
}

function formatOffsetUi(minutes: number) {
  const sign = minutes >= 0 ? '+' : '−';
  const abs = Math.abs(minutes);
  return `${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
}

form.addEventListener('input', markStale);
form.addEventListener('submit', (event) => {
  event.preventDefault();
  requestAnimationFrame(() => runCurrentAudit());
});

exportCsv.addEventListener('click', () => {
  if (!currentResult || !currentConfig || results.dataset.stale) return;
  downloadText(`availability-fixture-${currentConfig.startDate}.csv`, 'text/csv;charset=utf-8', resultToCsv(currentConfig, currentResult));
});

exportIcs.addEventListener('click', () => {
  if (!currentResult || !currentConfig || results.dataset.stale) return;
  downloadText(`availability-fixture-${currentConfig.startDate}.ics`, 'text/calendar;charset=utf-8', resultToIcs(currentConfig, currentResult));
});

function updateNetworkState() {
  offlineBanner.hidden = navigator.onLine;
}

window.addEventListener('online', updateNetworkState);
window.addEventListener('offline', updateNetworkState);
updateNetworkState();
populateZones();
if (demoMode) {
  document.title = 'Demo — Availability DST Audit';
  demoBanner.hidden = false;
  setForm(demoConfig());
  configSaved.textContent = 'Demo mode uses separate sample storage.';
  renderEmpty('Loading the completed London–New York sample audit.');
  requestAnimationFrame(() => runCurrentAudit({ scroll: false }));
  resetDemo.addEventListener('click', () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setForm(demoConfig());
    currentResult = null;
    currentConfig = null;
    runCurrentAudit({ scroll: false });
    statusRegion.textContent = 'Demo reset to the original London–New York sample.';
  });
  startReal.addEventListener('click', () => localStorage.removeItem(DEMO_STORAGE_KEY));
} else {
  setForm(loadConfig());
  renderEmpty('Set the working hours and dates, then run an audit.');
}

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
