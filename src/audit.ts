import type { AuditConfig, AuditResult, AuditRow, LocalDateTime, Transition } from './types';

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const weekdayLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function zoneFormatter(zone: string) {
  let formatter = formatterCache.get(zone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: zone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    formatterCache.set(zone, formatter);
  }
  return formatter;
}

export function isValidZone(zone: string): boolean {
  if (zone !== 'UTC' && !zone.includes('/')) return false;
  try {
    zoneFormatter(zone).format(0);
    return true;
  } catch {
    return false;
  }
}

function partsAt(instant: number, zone: string): LocalDateTime & { second: number } {
  const values: Record<string, number> = {};
  for (const part of zoneFormatter(zone).formatToParts(instant)) {
    if (part.type !== 'literal') values[part.type] = Number(part.value);
  }
  return {
    year: values.year ?? 0,
    month: values.month ?? 0,
    day: values.day ?? 0,
    hour: values.hour ?? 0,
    minute: values.minute ?? 0,
    second: values.second ?? 0,
  };
}

export function offsetMinutesAt(instant: number, zone: string): number {
  const p = partsAt(instant, zone);
  const instantToSecond = Math.floor(instant / 1000) * 1000;
  return Math.round((Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - instantToSecond) / 60_000);
}

function sameLocal(a: LocalDateTime & { second?: number }, b: LocalDateTime): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day && a.hour === b.hour && a.minute === b.minute;
}

/** Resolve a civil time to every matching instant. 0 means missing; 2 means ambiguous. */
export function resolveLocal(local: LocalDateTime, zone: string): number[] {
  const guess = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute);
  const offsets = new Set<number>();
  for (let hour = -36; hour <= 36; hour += 6) offsets.add(offsetMinutesAt(guess + hour * 3_600_000, zone));
  const matches = new Set<number>();
  for (const offset of offsets) {
    const candidate = guess - offset * 60_000;
    if (sameLocal(partsAt(candidate, zone), local)) matches.add(candidate);
  }
  return [...matches].sort((a, b) => a - b);
}

function parseDate(date: string) {
  const [year = 0, month = 0, day = 0] = date.split('-').map(Number);
  return { year, month, day };
}

function parseTime(time: string) {
  const [hour = 0, minute = 0] = time.split(':').map(Number);
  return { hour, minute };
}

function dateKey(instant: number) {
  return new Date(instant).toISOString().slice(0, 10);
}

function localFor(date: string, time: string): LocalDateTime {
  return { ...parseDate(date), ...parseTime(time) };
}

function formatOffset(minutes: number) {
  const sign = minutes >= 0 ? '+' : '−';
  const value = Math.abs(minutes);
  return `UTC${sign}${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
}

function formatInZone(instant: number, zone: string) {
  const p = partsAt(instant, zone);
  return {
    time: `${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`,
    date: `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`,
  };
}

function findTransitionInstant(start: number, end: number, zone: string, before: number): number {
  let low = start;
  let high = end;
  while (high - low > 60_000) {
    const middle = low + Math.floor((high - low) / 2);
    if (offsetMinutesAt(middle, zone) === before) low = middle;
    else high = middle;
  }
  return Math.floor(high / 60_000) * 60_000;
}

function findTransitions(config: AuditConfig): Transition[] {
  const start = Date.parse(`${config.startDate}T00:00:00Z`) - 2 * DAY_MS;
  const end = Date.parse(`${config.endDate}T23:59:59Z`) + 2 * DAY_MS;
  const transitions: Transition[] = [];
  let previous = offsetMinutesAt(start, config.organizerZone);
  for (let cursor = start + HOUR_MS; cursor <= end; cursor += HOUR_MS) {
    const current = offsetMinutesAt(cursor, config.organizerZone);
    if (current !== previous) {
      const instant = findTransitionInstant(cursor - HOUR_MS, cursor, config.organizerZone, previous);
      transitions.push({
        date: formatInZone(instant, config.organizerZone).date,
        before: previous,
        after: current,
        instant,
      });
    }
    previous = current;
  }
  return transitions.filter((transition) => transition.date >= config.startDate && transition.date <= config.endDate);
}

export function validateConfig(config: AuditConfig): string[] {
  const errors: string[] = [];
  if (!isValidZone(config.organizerZone)) errors.push('Enter a valid organizer timezone name, such as Europe/London.');
  if (!isValidZone(config.comparisonZone)) errors.push('Enter a valid comparison timezone name, such as America/New_York.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(config.startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(config.endDate)) errors.push('Choose a valid start and end date.');
  if (config.startDate > config.endDate) errors.push('The end date must be on or after the start date.');
  const days = Math.round((Date.parse(`${config.endDate}T00:00:00Z`) - Date.parse(`${config.startDate}T00:00:00Z`)) / DAY_MS);
  if (days > 370) errors.push('Keep the audit window to 371 days or fewer.');
  const enabled = config.schedule.filter((day) => day.enabled);
  if (!enabled.length) errors.push('Enable at least one day of weekly availability.');
  for (const day of enabled) {
    if (!day.windows.length) errors.push(`Add at least one working window for ${weekdayLong[day.weekday]}.`);
    const ordered = [...day.windows].sort((a, b) => a.start.localeCompare(b.start));
    ordered.forEach((window, index) => {
      if (!window.start || !window.end || window.start >= window.end) {
        errors.push(`${weekdayLong[day.weekday]} window ${index + 1} must end after it starts.`);
      }
      if (index > 0 && ordered[index - 1]!.end > window.start) {
        errors.push(`${weekdayLong[day.weekday]} working windows must not overlap.`);
      }
    });
  }
  return [...new Set(errors)];
}

export function runAudit(config: AuditConfig): AuditResult {
  const errors = validateConfig(config);
  if (errors.length) throw new Error(errors.join(' '));
  const transitions = findTransitions(config);
  const schedule = new Map(config.schedule.map((day) => [day.weekday, day]));
  const start = Date.parse(`${config.startDate}T00:00:00Z`);
  const end = Date.parse(`${config.endDate}T00:00:00Z`);
  const rows: AuditRow[] = [];

  for (let cursor = start; cursor <= end; cursor += DAY_MS) {
    const date = dateKey(cursor);
    const weekday = new Date(cursor).getUTCDay();
    const hours = schedule.get(weekday);
    if (!hours?.enabled) continue;
    const windows = [...hours.windows].sort((a, b) => a.start.localeCompare(b.start));
    windows.forEach((hoursWindow, windowIndex) => {
      const starts = resolveLocal(localFor(date, hoursWindow.start), config.organizerZone);
      const ends = resolveLocal(localFor(date, hoursWindow.end), config.organizerZone);
      const flags: string[] = [];
      let detail = 'Local working hours remain fixed.';
      let status: AuditRow['status'] = 'expected';
      if (!starts.length || !ends.length) {
        flags.push('Missing local time');
        detail = 'This local time does not exist because the clock jumps forward. Change the window or review the scheduler behavior.';
        status = 'invalid';
      } else if (starts.length > 1 || ends.length > 1) {
        flags.push('Ambiguous local time');
        detail = 'This local time occurs twice when the clock moves back. The export uses the earlier occurrence; verify the intended time.';
        status = 'warning';
      }

      const startUtc = starts[0] ?? null;
      const endUtc = ends[0] ?? null;
      const durationMinutes = startUtc !== null && endUtc !== null ? (endUtc - startUtc) / 60_000 : null;
      const nominalMinutes = (() => {
        const startTime = parseTime(hoursWindow.start);
        const endTime = parseTime(hoursWindow.end);
        return endTime.hour * 60 + endTime.minute - startTime.hour * 60 - startTime.minute;
      })();
      if (durationMinutes !== null && durationMinutes !== nominalMinutes) {
        flags.push(`Duration drift ${durationMinutes - nominalMinutes > 0 ? '+' : ''}${durationMinutes - nominalMinutes}m`);
        detail = 'Elapsed UTC duration differs from the declared wall-clock duration across a clock change.';
        status = 'warning';
      }

      let utcWindow = 'Unresolvable';
      let comparisonWindow = 'Unresolvable';
      let comparisonDate = '—';
      let organizerOffset: number | null = null;
      let comparisonOffset: number | null = null;
      if (startUtc !== null && endUtc !== null) {
        const utcStart = new Date(startUtc).toISOString().slice(11, 16);
        const utcEnd = new Date(endUtc).toISOString().slice(11, 16);
        utcWindow = `${utcStart}–${utcEnd}`;
        const compareStart = formatInZone(startUtc, config.comparisonZone);
        const compareEnd = formatInZone(endUtc, config.comparisonZone);
        comparisonWindow = `${compareStart.time}–${compareEnd.time}`;
        comparisonDate = compareStart.date === compareEnd.date ? compareStart.date : `${compareStart.date} → ${compareEnd.date}`;
        organizerOffset = offsetMinutesAt(startUtc, config.organizerZone);
        comparisonOffset = offsetMinutesAt(startUtc, config.comparisonZone);
        if (compareStart.date !== date) flags.push('Comparison date differs');
      }

      rows.push({
        id: `${date}-${weekday}-${windowIndex}`,
        date,
        weekday: weekdayLong[weekday] ?? '',
        localWindow: `${hoursWindow.start}–${hoursWindow.end}`,
        utcWindow,
        comparisonWindow,
        comparisonDate,
        durationMinutes,
        startUtc,
        endUtc,
        organizerOffset,
        comparisonOffset,
        status,
        flags,
        detail,
      });
    });
  }

  // A boundary is one concrete audit row: the first valid enabled window after
  // each organizer-zone offset transition. Do not turn the following week into
  // a vague "boundary period"—those rows are ordinary expected availability.
  for (const transition of transitions) {
    const row = rows.find((candidate) => candidate.startUtc !== null && candidate.startUtc >= transition.instant);
    if (!row) continue;
    row.flags.push(`DST boundary ${formatOffset(transition.before)} → ${formatOffset(transition.after)}`);
    if (row.status === 'expected') {
      row.status = 'boundary';
      row.detail = 'First enabled working window after an organizer offset change. Local hours stay fixed while the UTC time shifts.';
    }
  }

  return {
    rows,
    transitions,
    warningCount: rows.filter((row) => row.status === 'warning').length,
    invalidCount: rows.filter((row) => row.status === 'invalid').length,
    boundaryCount: rows.filter((row) => row.flags.some((flag) => flag.startsWith('DST boundary'))).length,
    totalMinutes: rows.reduce((sum, row) => sum + (row.durationMinutes ?? 0), 0),
  };
}

export function transitionLabel(transition: Transition) {
  return `${transition.date}: ${formatOffset(transition.before)} → ${formatOffset(transition.after)}`;
}
