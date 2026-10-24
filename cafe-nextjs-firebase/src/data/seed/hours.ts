import { siteConfig } from '@/config/site';
import type { OpeningHours } from '@/schemas/hours';

const weekday = [{ open: '07:00', close: '22:00' }];

export const defaultOpeningHours: OpeningHours = {
  timezone: siteConfig.timezone,
  weekly: {
    monday: weekday,
    tuesday: weekday,
    wednesday: weekday,
    thursday: weekday,
    friday: weekday,
    saturday: [{ open: '08:00', close: '23:00' }],
    sunday: [{ open: '08:00', close: '21:00' }],
  },
  exceptions: [],
};
