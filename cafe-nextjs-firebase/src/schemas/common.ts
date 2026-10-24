import { z } from 'zod';

/** URL-safe identifier, e.g. "hot-drinks". */
export const slugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single hyphens.');

/** International phone number, digits only, no "+" (e.g. "15551234567"). */
export const phoneDigitsSchema = z
  .string()
  .regex(
    /^[1-9]\d{7,14}$/,
    'Use international format, digits only, without "+" (e.g. 15551234567).',
  );

/** Instagram handle without "@". */
export const instagramHandleSchema = z
  .string()
  .regex(/^[A-Za-z0-9._]{1,30}$/, 'Use the handle without "@" (letters, numbers, "." and "_").');

export function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

/** IANA time zone, e.g. "America/New_York". */
export const timeZoneSchema = z
  .string()
  .refine(isValidTimeZone, 'Must be a valid IANA time zone, e.g. "America/New_York".');
