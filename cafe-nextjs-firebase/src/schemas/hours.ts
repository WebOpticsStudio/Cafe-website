import { z } from 'zod';
import { timeZoneSchema } from './common';

export const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const weekdaySchema = z.enum(WEEKDAYS);
export type Weekday = z.infer<typeof weekdaySchema>;

/** 24-hour "HH:mm". */
export const timeOfDaySchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour HH:mm, e.g. "08:30".');

/**
 * One opening interval. If `close` is earlier than (or equal to) `open`, the interval
 * runs past midnight into the next day, e.g. 18:00 → 01:00. Use "00:00" to close at midnight.
 */
export const timeIntervalSchema = z
  .object({ open: timeOfDaySchema, close: timeOfDaySchema })
  .refine((interval) => interval.open !== interval.close, {
    message: '`open` and `close` must differ.',
  });

/** An empty array means "closed all day". */
export const dayScheduleSchema = z.array(timeIntervalSchema).max(4);

export const weeklyScheduleSchema = z.record(weekdaySchema, dayScheduleSchema);

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD.')
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), 'Not a real calendar date.');

/** Overrides the weekly schedule for one specific date (holidays, private events…). */
export const hoursExceptionSchema = z.object({
  date: isoDateSchema,
  label: z.string().trim().max(80).optional(),
  intervals: dayScheduleSchema,
});

/** Firestore: `settings/hours` */
export const openingHoursSchema = z.object({
  timezone: timeZoneSchema,
  weekly: weeklyScheduleSchema,
  exceptions: z.array(hoursExceptionSchema).max(100).default([]),
});

export type TimeInterval = z.infer<typeof timeIntervalSchema>;
export type HoursException = z.infer<typeof hoursExceptionSchema>;
export type OpeningHours = z.infer<typeof openingHoursSchema>;
