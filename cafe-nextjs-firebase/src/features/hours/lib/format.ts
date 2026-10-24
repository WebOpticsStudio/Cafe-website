import { WEEKDAYS, type TimeInterval, type Weekday } from '@/schemas/hours';
import type { OpenStatus } from './open-status';

/** "14:30" → "2:30 PM" (locale aware). */
export function formatTimeOfDay(time: string, locale: string): string {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(2000, 0, 1, hours, minutes)));
}

export function formatWeekday(weekday: Weekday, locale: string, style: 'long' | 'short' = 'long') {
  // 1 Jan 2024 was a Monday.
  const index = WEEKDAYS.indexOf(weekday);
  return new Intl.DateTimeFormat(locale, { weekday: style, timeZone: 'UTC' }).format(
    new Date(Date.UTC(2024, 0, 1 + index)),
  );
}

/** "7:30 AM – 5:00 PM", "8:00 AM – 12:00 PM, 2:00 PM – 6:00 PM" or "Closed". */
export function formatIntervals(intervals: TimeInterval[], locale: string): string {
  if (intervals.length === 0) return 'Closed';
  return intervals
    .map(
      (interval) =>
        `${formatTimeOfDay(interval.open, locale)} – ${formatTimeOfDay(interval.close, locale)}`,
    )
    .join(', ');
}

export function formatIsoDate(dateKey: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${dateKey}T00:00:00Z`));
}

export interface StatusMessage {
  isOpen: boolean;
  headline: string;
  detail: string;
}

/** Human-readable status, e.g. { "Open now", "Closes at 5:00 PM" }. */
export function describeOpenStatus(status: OpenStatus, locale: string): StatusMessage {
  const { change } = status;
  if (status.isOpen) {
    return {
      isOpen: true,
      headline: 'Open now',
      detail: change ? `Closes at ${formatTimeOfDay(change.time, locale)}` : '',
    };
  }
  if (!change) return { isOpen: false, headline: 'Closed', detail: '' };

  const when =
    change.dayOffset === 0
      ? 'today'
      : change.dayOffset === 1
        ? 'tomorrow'
        : formatWeekday(change.weekday, locale);
  return {
    isOpen: false,
    headline: 'Closed',
    detail: `Opens ${when} at ${formatTimeOfDay(change.time, locale)}`,
  };
}
