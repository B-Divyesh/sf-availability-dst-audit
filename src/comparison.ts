import type { AuditResult } from './types';

export type PublishedSlot = {
  startUtc: number;
  endUtc: number;
};

export type ComparisonFinding = {
  kind: 'missing' | 'extra' | 'shifted' | 'duration';
  expected?: PublishedSlot;
  actual?: PublishedSlot;
};

export type ComparisonResult = {
  findings: ComparisonFinding[];
  matched: number;
};

function unquote(value: string) {
  const trimmed = value.trim();
  return trimmed.startsWith('"') && trimmed.endsWith('"')
    ? trimmed.slice(1, -1).replaceAll('""', '"')
    : trimmed;
}

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]!;
    if (char === '"') {
      if (quoted && line[index + 1] === '"') { cell += char; index += 1; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) { cells.push(unquote(cell)); cell = ''; }
    else cell += char;
  }
  cells.push(unquote(cell));
  return cells;
}

function parseDate(value: string) {
  const normalized = value.trim().replace(/^"|"$/g, '');
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?Z$/.test(normalized)) return null;
  const instant = Date.parse(normalized);
  return Number.isFinite(instant) ? instant : null;
}

function parseIcsDate(value: string) {
  const match = value.trim().match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (!match) return null;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]), Number(match[6]));
}

/** Parses UTC CSV (start_utc/end_utc or utc_start/utc_end) or UTC ICS slots. */
export function parsePublishedSlots(name: string, contents: string): PublishedSlot[] {
  if (name.toLowerCase().endsWith('.ics') || contents.includes('BEGIN:VCALENDAR')) {
    const slots: PublishedSlot[] = [];
    for (const event of contents.split('BEGIN:VEVENT').slice(1)) {
      const start = event.match(/^DTSTART([^:]*):(.+)$/m);
      const end = event.match(/^DTEND([^:]*):(.+)$/m);
      if (!start || !end || start[1] || end[1] || !start[2]!.trim().endsWith('Z') || !end[2]!.trim().endsWith('Z')) {
        throw new Error('This calendar uses local or timezone-qualified times. Export it again with UTC start and end times ending in Z.');
      }
      const startUtc = parseIcsDate(start[2]!);
      const endUtc = parseIcsDate(end[2]!);
      if (startUtc === null || endUtc === null || endUtc <= startUtc) {
        throw new Error('A calendar event has invalid UTC start or end times. Export it again with complete UTC times ending in Z.');
      }
      slots.push({ startUtc, endUtc });
    }
    if (!slots.length) throw new Error('No UTC start and end times were found in this calendar file.');
    return slots;
  }

  const lines = contents.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) throw new Error('Add a CSV header and at least one published slot.');
  const headers = parseCsvLine(lines[0]!).map((header) => header.trim().toLowerCase());
  const startIndex = headers.findIndex((header) => ['start_utc', 'utc_start', 'start'].includes(header));
  const endIndex = headers.findIndex((header) => ['end_utc', 'utc_end', 'end'].includes(header));
  if (startIndex < 0 || endIndex < 0) throw new Error('CSV needs UTC columns named start_utc and end_utc.');
  const slots = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const startUtc = parseDate(values[startIndex] ?? '');
    const endUtc = parseDate(values[endIndex] ?? '');
    if (startUtc === null || endUtc === null || endUtc <= startUtc) {
      throw new Error('CSV start and end times must be valid UTC timestamps ending in Z.');
    }
    return { startUtc, endUtc };
  });
  if (!slots.length) throw new Error('No valid UTC start and end times were found in this CSV file.');
  return slots;
}

function slotLabel(slot: PublishedSlot) {
  return `${new Date(slot.startUtc).toISOString().slice(0, 16).replace('T', ' ')} UTC`;
}

export function findingLabel(finding: ComparisonFinding) {
  if (finding.kind === 'missing') return `Missing published slot: ${slotLabel(finding.expected!)}`;
  if (finding.kind === 'extra') return `Extra published slot: ${slotLabel(finding.actual!)}`;
  if (finding.kind === 'shifted') return `Shifted published slot: expected ${slotLabel(finding.expected!)}, found ${slotLabel(finding.actual!)}`;
  return `Duration differs: expected ${slotLabel(finding.expected!)}, found ${slotLabel(finding.actual!)}`;
}

/** Compare expected UTC rows with published UTC slots without sending either file anywhere. */
export function comparePublishedSlots(result: AuditResult, actual: PublishedSlot[]): ComparisonResult {
  const expected = result.rows
    .filter((row) => row.startUtc !== null && row.endUtc !== null)
    .map((row) => ({ startUtc: row.startUtc!, endUtc: row.endUtc! }));
  const remaining = [...actual];
  const findings: ComparisonFinding[] = [];
  let matched = 0;

  for (const wanted of expected) {
    const exactIndex = remaining.findIndex((slot) => slot.startUtc === wanted.startUtc && slot.endUtc === wanted.endUtc);
    if (exactIndex >= 0) { remaining.splice(exactIndex, 1); matched += 1; continue; }
    const sameStart = remaining.findIndex((slot) => slot.startUtc === wanted.startUtc);
    if (sameStart >= 0) {
      findings.push({ kind: 'duration', expected: wanted, actual: remaining.splice(sameStart, 1)[0] });
      continue;
    }
    const wantedDuration = wanted.endUtc - wanted.startUtc;
    const shifted = remaining.findIndex((slot) => slot.endUtc - slot.startUtc === wantedDuration && Math.abs(slot.startUtc - wanted.startUtc) <= 12 * 60 * 60 * 1000);
    if (shifted >= 0) {
      findings.push({ kind: 'shifted', expected: wanted, actual: remaining.splice(shifted, 1)[0] });
      continue;
    }
    findings.push({ kind: 'missing', expected: wanted });
  }
  for (const extra of remaining) findings.push({ kind: 'extra', actual: extra });
  return { findings, matched };
}

export const DEMO_PUBLISHED_CSV = `start_utc,end_utc
2026-03-23T09:00:00Z,2026-03-23T17:00:00Z
2026-03-24T09:00:00Z,2026-03-24T17:00:00Z
2026-03-25T09:00:00Z,2026-03-25T12:00:00Z
2026-03-25T13:30:00Z,2026-03-25T17:30:00Z
2026-03-26T09:00:00Z,2026-03-26T16:00:00Z
2026-03-27T09:00:00Z,2026-03-27T17:00:00Z
2026-03-31T08:00:00Z,2026-03-31T16:00:00Z
2026-04-01T08:00:00Z,2026-04-01T11:00:00Z
2026-04-01T12:00:00Z,2026-04-01T16:00:00Z
2026-04-01T18:00:00Z,2026-04-01T19:00:00Z
2026-04-02T08:00:00Z,2026-04-02T16:00:00Z
2026-04-03T08:00:00Z,2026-04-03T16:00:00Z
`;
