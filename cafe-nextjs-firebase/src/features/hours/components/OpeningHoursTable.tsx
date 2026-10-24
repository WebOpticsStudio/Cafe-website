'use client';

import { useNow } from '@/hooks/useNow';
import { cn } from '@/lib/utils/cn';
import { WEEKDAYS, type OpeningHours } from '@/schemas/hours';
import { formatIntervals, formatIsoDate, formatWeekday } from '../lib/format';
import { getLocalDateTime, getUpcomingExceptions } from '../lib/open-status';

/** Weekly schedule. Highlights today (in the cafe's timezone) once mounted in the browser. */
export function OpeningHoursTable({ hours, locale }: { hours: OpeningHours; locale: string }) {
  const now = useNow();
  const today = now ? getLocalDateTime(now, hours.timezone).weekday : null;
  const upcoming = now ? getUpcomingExceptions(hours, now) : [];

  return (
    <div>
      <table className="w-full text-left">
        <caption className="sr-only">Opening hours</caption>
        <tbody>
          {WEEKDAYS.map((day) => (
            <tr
              key={day}
              aria-current={day === today ? 'date' : undefined}
              className={cn('border-b border-line', day === today && 'bg-forest-50 font-semibold')}
            >
              <th scope="row" className="px-3 py-3 font-medium">
                {formatWeekday(day, locale)}
              </th>
              <td className="px-3 py-3 text-right tabular-nums">
                {formatIntervals(hours.weekly[day] ?? [], locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {upcoming.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Special hours</h3>
          <ul className="mt-2 space-y-1">
            {upcoming.map((exception) => (
              <li key={exception.date} className="flex justify-between gap-4 px-3 py-1">
                <span>
                  {formatIsoDate(exception.date, locale)}
                  {exception.label ? ` – ${exception.label}` : ''}
                </span>
                <span className="tabular-nums">{formatIntervals(exception.intervals, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-4 px-3 text-sm text-muted">All times are local to the cafe.</p>
    </div>
  );
}
