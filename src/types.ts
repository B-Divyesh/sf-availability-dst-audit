export type DaySchedule = {
  weekday: number;
  enabled: boolean;
  windows: TimeWindow[];
};

export type TimeWindow = {
  start: string;
  end: string;
};

export type AuditConfig = {
  organizerZone: string;
  comparisonZone: string;
  startDate: string;
  endDate: string;
  schedule: DaySchedule[];
};

export type LocalDateTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export type Transition = {
  date: string;
  before: number;
  after: number;
  /** UTC instant at which the organizer offset changes. */
  instant: number;
};

export type AuditRow = {
  id: string;
  date: string;
  weekday: string;
  localWindow: string;
  utcWindow: string;
  comparisonWindow: string;
  comparisonDate: string;
  durationMinutes: number | null;
  startUtc: number | null;
  endUtc: number | null;
  organizerOffset: number | null;
  comparisonOffset: number | null;
  status: 'expected' | 'boundary' | 'warning' | 'invalid';
  flags: string[];
  detail: string;
};

export type AuditResult = {
  rows: AuditRow[];
  transitions: Transition[];
  warningCount: number;
  invalidCount: number;
  boundaryCount: number;
  totalMinutes: number;
};
