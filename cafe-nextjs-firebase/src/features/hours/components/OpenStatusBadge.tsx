'use client';

import { useNow } from '@/hooks/useNow';
import { cn } from '@/lib/utils/cn';
import type { OpeningHours } from '@/schemas/hours';
import { describeOpenStatus } from '../lib/format';
import { getOpenStatus } from '../lib/open-status';

interface OpenStatusBadgeProps {
  hours: OpeningHours;
  locale: string;
  /** `dark` for use on forest-coloured surfaces. */
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * Live "Open now / Closed" indicator. Computed in the browser so statically generated or
 * cached pages never show a stale state. Reserves its space until the time is known.
 */
export function OpenStatusBadge({
  hours,
  locale,
  tone = 'light',
  className,
}: OpenStatusBadgeProps) {
  const now = useNow();

  if (!now) {
    return <div aria-hidden="true" className={cn('h-6 w-48', className)} />;
  }

  const message = describeOpenStatus(getOpenStatus(hours, now), locale);
  const dark = tone === 'dark';

  return (
    <p className={cn('flex flex-wrap items-center gap-x-3 gap-y-1 text-base', className)}>
      <span className="inline-flex items-center gap-2 font-semibold">
        <span
          aria-hidden="true"
          className={cn(
            'size-2.5 rounded-full',
            message.isOpen
              ? dark
                ? 'bg-emerald-400'
                : 'bg-emerald-600'
              : dark
                ? 'bg-red-300'
                : 'bg-red-700',
          )}
        />
        {message.headline}
      </span>
      {message.detail ? (
        <span className={dark ? 'text-white/80' : 'text-muted'}>{message.detail}</span>
      ) : null}
    </p>
  );
}
