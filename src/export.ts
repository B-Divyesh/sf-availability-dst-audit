import type { AuditConfig, AuditResult } from './types';

function csvCell(value: string | number | null) {
  const text = value === null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function resultToCsv(config: AuditConfig, result: AuditResult) {
  const header = [
    'date', 'weekday', 'organizer_timezone', 'declared_local_window', 'utc_window',
    'comparison_timezone', 'comparison_date', 'comparison_window', 'duration_minutes', 'status', 'flags',
  ];
  const lines = result.rows.map((row) => [
    row.date,
    row.weekday,
    config.organizerZone,
    row.localWindow,
    row.utcWindow,
    config.comparisonZone,
    row.comparisonDate,
    row.comparisonWindow,
    row.durationMinutes,
    row.status,
    row.flags.join('; '),
  ].map(csvCell).join(','));
  return [header.join(','), ...lines].join('\r\n');
}

function icsDate(instant: number) {
  return new Date(instant).toISOString().replaceAll('-', '').replaceAll(':', '').replace('.000', '');
}

function icsEscape(value: string) {
  return value.replaceAll('\\', '\\\\').replaceAll(';', '\\;').replaceAll(',', '\\,').replaceAll('\n', '\\n');
}

export function resultToIcs(config: AuditConfig, result: AuditResult) {
  const events = result.rows
    .filter((row) => row.startUtc !== null && row.endUtc !== null)
    .map((row) => [
      'BEGIN:VEVENT',
      `UID:${row.id}@availability-dst-audit.sociobot.in`,
      `DTSTAMP:${icsDate(0)}`,
      `DTSTART:${icsDate(row.startUtc as number)}`,
      `DTEND:${icsDate(row.endUtc as number)}`,
      `SUMMARY:${icsEscape(`Expected availability — ${config.organizerZone}`)}`,
      `DESCRIPTION:${icsEscape(`Declared ${row.localWindow} in ${config.organizerZone}. Status: ${row.status}. ${row.flags.join('; ') || 'No boundary flag.'}`)}`,
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
    ].join('\r\n'));
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Param Factory//Availability DST Audit//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...events,
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export function downloadText(filename: string, type: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
