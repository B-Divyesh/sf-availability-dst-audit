import { describe, expect, it } from 'vitest';
import { offsetMinutesAt, resolveLocal, runAudit, validateConfig } from './audit';
import { resultToCsv, resultToIcs } from './export';
import type { AuditConfig } from './types';

function config(overrides: Partial<AuditConfig> = {}): AuditConfig {
  return {
    organizerZone: 'Europe/London',
    comparisonZone: 'America/New_York',
    startDate: '2026-03-23',
    endDate: '2026-04-03',
    schedule: Array.from({ length: 7 }, (_, weekday) => ({
      weekday,
      enabled: weekday > 0 && weekday < 6,
      start: '09:00',
      end: '17:00',
    })),
    ...overrides,
  };
}

describe('IANA civil-time resolution', () => {
  it('uses the correct London offsets around spring DST', () => {
    expect(offsetMinutesAt(Date.parse('2026-03-28T12:00:00Z'), 'Europe/London')).toBe(0);
    expect(offsetMinutesAt(Date.parse('2026-03-29T12:00:00Z'), 'Europe/London')).toBe(60);
  });

  it('detects a missing spring-forward wall time', () => {
    expect(resolveLocal({ year: 2026, month: 3, day: 29, hour: 1, minute: 30 }, 'Europe/London')).toEqual([]);
  });

  it('detects both occurrences of a repeated fall-back wall time', () => {
    const matches = resolveLocal({ year: 2026, month: 10, day: 25, hour: 1, minute: 30 }, 'Europe/London');
    expect(matches).toHaveLength(2);
    expect(matches[1]! - matches[0]!).toBe(3_600_000);
  });
});

describe('audit matrix', () => {
  it('marks the first working window after a DST boundary and shifts UTC, not local time', () => {
    const result = runAudit(config());
    const before = result.rows.find((row) => row.date === '2026-03-27');
    const after = result.rows.find((row) => row.date === '2026-03-30');
    expect(before?.localWindow).toBe('09:00–17:00');
    expect(after?.localWindow).toBe('09:00–17:00');
    expect(before?.utcWindow).toBe('09:00–17:00');
    expect(after?.utcWindow).toBe('08:00–16:00');
    expect(after?.status).toBe('boundary');
    expect(after?.flags.join(' ')).toContain('DST boundary');
    expect(result.transitions).toEqual([{ date: '2026-03-29', before: 0, after: 60 }]);
  });

  it('flags elapsed duration drift when a window crosses the spring change', () => {
    const sunday = config({
      startDate: '2026-03-29',
      endDate: '2026-03-29',
      schedule: Array.from({ length: 7 }, (_, weekday) => ({ weekday, enabled: weekday === 0, start: '00:30', end: '02:30' })),
    });
    const row = runAudit(sunday).rows[0]!;
    expect(row.durationMinutes).toBe(60);
    expect(row.status).toBe('warning');
    expect(row.flags).toContain('Duration drift -60m');
  });

  it('validates zones, date order, range size, and enabled hours', () => {
    const errors = validateConfig(config({
      organizerZone: 'EST',
      startDate: '2026-06-30',
      endDate: '2025-01-01',
      schedule: Array.from({ length: 7 }, (_, weekday) => ({ weekday, enabled: false, start: '09:00', end: '17:00' })),
    }));
    expect(errors.join(' ')).toMatch(/IANA organizer timezone/);
    expect(errors.join(' ')).toMatch(/end date/);
    expect(errors.join(' ')).toMatch(/Enable at least one/);
  });

  it('produces reviewable CSV and UTC ICS fixtures', () => {
    const input = config({ startDate: '2026-03-30', endDate: '2026-03-30' });
    const result = runAudit(input);
    const csv = resultToCsv(input, result);
    const ics = resultToIcs(input, result);
    expect(csv).toContain('organizer_timezone');
    expect(csv).toContain('Europe/London');
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('DTSTART:20260330T080000Z');
    expect(ics).toContain('TRANSP:TRANSPARENT');
  });
});
