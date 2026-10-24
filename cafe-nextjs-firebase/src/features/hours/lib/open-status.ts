import { WEEKDAYS, type OpeningHours, type TimeInterval, type Weekday } from '@/schemas/hours';

/**
 * Pure, timezone-aware "is the cafe open?" logic. No React, no I/O – easy to test.
 *
 * All calculations are done in the CAFE's timezone (not the visitor's), using minutes
 * relative to local midnight "today". Intervals that run past midnight (close <= open)
 * are expanded into the next day.
 */

const MINUTES_PER_DAY = 1440;

export interface LocalDateTime {
  /** "YYYY-MM-DD" in the cafe's timezone. */
  dateKey: string;
  weekday: Weekday;
  /** Minutes since local midnight. */
  minutes: number;
}

export interface StatusChange {
  /** 0 = today, 1 = tomorrow, … (in the cafe's timezone). */
  dayOffset: number;
  weekday: Weekday;
  /** "HH:mm" (24-hour). */
  time: string;
}

export interface OpenStatus {
  isOpen: boolean;
  /** When the cafe next closes (if open) or opens (if closed). `null` if never within a week. */
  change: StatusChange | null;
}

interface Span {
  start: number;
  end: number;
}

const formatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
    formatters.set(timeZone, formatter);
  }
  return formatter;
}

export function getLocalDateTime(date: Date, timeZone: string): LocalDateTime {
  const parts = getFormatter(timeZone).formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return {
    dateKey: `${read('year')}-${read('month')}-${read('day')}`,
    weekday: read('weekday').toLowerCase() as Weekday,
    minutes: (Number(read('hour')) % 24) * 60 + Number(read('minute')),
  };
}

export function timeToMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const normalised = ((totalMinutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(normalised / 60);
  const minutes = normalised % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** Calendar arithmetic on "YYYY-MM-DD" keys (done in UTC so DST never interferes). */
export function addDays(dateKey: string, days: number): string {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function weekdayOf(dateKey: string): Weekday {
  const day = new Date(`${dateKey}T00:00:00Z`).getUTCDay(); // 0 = Sunday
  return WEEKDAYS[(day + 6) % 7] as Weekday;
}

/** Opening intervals that apply to one calendar date (exceptions win over the weekly plan). */
export function getIntervalsForDate(hours: OpeningHours, dateKey: string): TimeInterval[] {
  const exception = hours.exceptions.find((item) => item.date === dateKey);
  return exception ? exception.intervals : (hours.weekly[weekdayOf(dateKey)] ?? []);
}

function collectSpans(hours: OpeningHours, todayKey: string): Span[] {
  const spans: Span[] = [];
  // -1 catches an overnight interval that started yesterday and is still running.
  for (let offset = -1; offset <= 8; offset += 1) {
    for (const interval of getIntervalsForDate(hours, addDays(todayKey, offset))) {
      const open = timeToMinutes(interval.open);
      const close = timeToMinutes(interval.close);
      spans.push({
        start: offset * MINUTES_PER_DAY + open,
        end: offset * MINUTES_PER_DAY + (close > open ? close : close + MINUTES_PER_DAY),
      });
    }
  }
  spans.sort((a, b) => a.start - b.start);

  // Merge touching/overlapping spans so "08–12 + 12–18" reports a single closing time.
  const merged: Span[] = [];
  for (const span of spans) {
    const last = merged[merged.length - 1];
    if (last && span.start <= last.end) last.end = Math.max(last.end, span.end);
    else merged.push({ ...span });
  }
  return merged;
}

function toChange(absoluteMinutes: number, todayKey: string): StatusChange {
  const dayOffset = Math.floor(absoluteMinutes / MINUTES_PER_DAY);
  return {
    dayOffset,
    weekday: weekdayOf(addDays(todayKey, dayOffset)),
    time: minutesToTime(absoluteMinutes),
  };
}

export function getOpenStatus(hours: OpeningHours, now: Date = new Date()): OpenStatus {
  const local = getLocalDateTime(now, hours.timezone);
  const spans = collectSpans(hours, local.dateKey);

  const current = spans.find((span) => span.start <= local.minutes && local.minutes < span.end);
  if (current) return { isOpen: true, change: toChange(current.end, local.dateKey) };

  const next = spans.find((span) => span.start > local.minutes);
  return { isOpen: false, change: next ? toChange(next.start, local.dateKey) : null };
}

/** Exceptions (holidays etc.) dated between today and `withinDays` from now, soonest first. */
export function getUpcomingExceptions(hours: OpeningHours, now: Date, withinDays = 30) {
  const today = getLocalDateTime(now, hours.timezone).dateKey;
  const last = addDays(today, withinDays);
  return hours.exceptions
    .filter((exception) => exception.date >= today && exception.date <= last)
    .sort((a, b) => a.date.localeCompare(b.date));
}
