import { describe, expect, it } from 'vitest';
import {
  addDays,
  getLocalDateTime,
  getOpenStatus,
  getUpcomingExceptions,
  minutesToTime,
  weekdayOf,
} from '@/features/hours/lib/open-status';
import { describeOpenStatus, formatIntervals } from '@/features/hours/lib/format';
import { openingHoursSchema, type OpeningHours } from '@/schemas/hours';

const closedAllDay = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

function makeHours(overrides: Partial<OpeningHours['weekly']>, extra: Partial<OpeningHours> = {}) {
  return openingHoursSchema.parse({
    timezone: 'America/New_York',
    weekly: { ...closedAllDay, ...overrides },
    exceptions: [],
    ...extra,
  });
}

// 2026-03-02 is a Monday. 14:00Z = 09:00 in New York (EST, UTC-5, before DST on 8 March).
const at = (iso: string) => new Date(iso);

describe('calendar helpers', () => {
  it('computes weekdays and day arithmetic', () => {
    expect(weekdayOf('2026-03-02')).toBe('monday');
    expect(weekdayOf('2026-03-08')).toBe('sunday');
    expect(addDays('2026-02-28', 2)).toBe('2026-03-02');
    expect(minutesToTime(75)).toBe('01:15');
  });

  it('reads local time in the cafe timezone, not the viewer timezone', () => {
    const local = getLocalDateTime(at('2026-03-02T03:30:00Z'), 'America/New_York');
    expect(local).toEqual({ dateKey: '2026-03-01', weekday: 'sunday', minutes: 22 * 60 + 30 });
  });
});

describe('getOpenStatus', () => {
  const hours = makeHours({ monday: [{ open: '08:00', close: '17:00' }] });

  it('is open inside an interval and reports the closing time', () => {
    const status = getOpenStatus(hours, at('2026-03-02T14:00:00Z')); // Mon 09:00 local
    expect(status.isOpen).toBe(true);
    expect(status.change).toMatchObject({ dayOffset: 0, time: '17:00' });
  });

  it("is closed before opening and reports today's opening time", () => {
    const status = getOpenStatus(hours, at('2026-03-02T11:00:00Z')); // Mon 06:00 local
    expect(status.isOpen).toBe(false);
    expect(status.change).toMatchObject({ dayOffset: 0, weekday: 'monday', time: '08:00' });
  });

  it('treats the closing minute as closed', () => {
    expect(getOpenStatus(hours, at('2026-03-02T21:59:00Z')).isOpen).toBe(true); // 16:59
    expect(getOpenStatus(hours, at('2026-03-02T22:00:00Z')).isOpen).toBe(false); // 17:00
  });

  it('finds the next opening on a later day', () => {
    const status = getOpenStatus(hours, at('2026-03-02T23:00:00Z')); // Mon 18:00 local
    expect(status.isOpen).toBe(false);
    expect(status.change).toMatchObject({ dayOffset: 7, weekday: 'monday', time: '08:00' });
  });

  it('returns no next change when there are no opening hours at all', () => {
    expect(getOpenStatus(makeHours({}), at('2026-03-02T14:00:00Z'))).toEqual({
      isOpen: false,
      change: null,
    });
  });

  it('supports split shifts', () => {
    const split = makeHours({
      monday: [
        { open: '08:00', close: '12:00' },
        { open: '14:00', close: '18:00' },
      ],
    });
    const lunchBreak = getOpenStatus(split, at('2026-03-02T18:00:00Z')); // 13:00 local
    expect(lunchBreak.isOpen).toBe(false);
    expect(lunchBreak.change).toMatchObject({ dayOffset: 0, time: '14:00' });
  });

  it('merges back-to-back intervals into one continuous opening', () => {
    const merged = makeHours({
      monday: [
        { open: '08:00', close: '12:00' },
        { open: '12:00', close: '18:00' },
      ],
    });
    expect(getOpenStatus(merged, at('2026-03-02T15:00:00Z')).change).toMatchObject({
      time: '18:00',
    });
  });

  it('handles intervals that run past midnight', () => {
    const late = makeHours({ friday: [{ open: '18:00', close: '01:00' }] });
    // Sat 2026-03-07 00:30 local = 05:30Z → still Friday night's session
    const status = getOpenStatus(late, at('2026-03-07T05:30:00Z'));
    expect(status.isOpen).toBe(true);
    expect(status.change).toMatchObject({ dayOffset: 0, time: '01:00' });
    // Sat 01:00 local → closed
    expect(getOpenStatus(late, at('2026-03-07T06:00:00Z')).isOpen).toBe(false);
  });

  it('lets a dated exception override the weekly schedule', () => {
    const holiday = makeHours(
      { monday: [{ open: '08:00', close: '17:00' }] },
      { exceptions: [{ date: '2026-03-02', label: 'Staff day', intervals: [] }] },
    );
    expect(getOpenStatus(holiday, at('2026-03-02T14:00:00Z')).isOpen).toBe(false);
    // The following Monday is a normal day again.
    expect(getOpenStatus(holiday, at('2026-03-09T13:00:00Z')).isOpen).toBe(true); // DST: 09:00 EDT
  });

  it('lists only upcoming exceptions inside the window', () => {
    const hoursWithExceptions = makeHours(
      {},
      {
        exceptions: [
          { date: '2026-03-01', intervals: [] }, // past
          { date: '2026-03-10', intervals: [] },
          { date: '2026-06-01', intervals: [] }, // too far away
        ],
      },
    );
    const upcoming = getUpcomingExceptions(hoursWithExceptions, at('2026-03-02T14:00:00Z'), 30);
    expect(upcoming.map((item) => item.date)).toEqual(['2026-03-10']);
  });
});

describe('formatting', () => {
  it('formats intervals and the closed state', () => {
    const text = formatIntervals([{ open: '07:30', close: '17:00' }], 'en-US').replace(/\s/g, ' ');
    expect(text).toBe('7:30 AM – 5:00 PM');
    expect(formatIntervals([], 'en-US')).toBe('Closed');
  });

  it('describes open and closed states', () => {
    const open = describeOpenStatus(
      { isOpen: true, change: { dayOffset: 0, weekday: 'monday', time: '17:00' } },
      'en-US',
    );
    expect(open.headline).toBe('Open now');
    expect(open.detail.replace(/\s/g, ' ')).toBe('Closes at 5:00 PM');

    const closed = describeOpenStatus(
      { isOpen: false, change: { dayOffset: 1, weekday: 'tuesday', time: '08:00' } },
      'en-US',
    );
    expect(closed.detail.replace(/\s/g, ' ')).toBe('Opens tomorrow at 8:00 AM');
  });
});

describe('openingHoursSchema', () => {
  it('rejects malformed times, unknown time zones and zero-length intervals', () => {
    const base = { timezone: 'America/New_York', weekly: closedAllDay };
    expect(openingHoursSchema.safeParse({ ...base, timezone: 'Mars/Olympus' }).success).toBe(false);
    expect(
      openingHoursSchema.safeParse({
        ...base,
        weekly: { ...closedAllDay, monday: [{ open: '8am', close: '17:00' }] },
      }).success,
    ).toBe(false);
    expect(
      openingHoursSchema.safeParse({
        ...base,
        weekly: { ...closedAllDay, monday: [{ open: '08:00', close: '08:00' }] },
      }).success,
    ).toBe(false);
  });

  it('requires every weekday to be present', () => {
    const incomplete: Record<string, unknown[]> = { ...closedAllDay };
    delete incomplete.sunday;
    expect(openingHoursSchema.safeParse({ timezone: 'UTC', weekly: incomplete }).success).toBe(
      false,
    );
  });
});
