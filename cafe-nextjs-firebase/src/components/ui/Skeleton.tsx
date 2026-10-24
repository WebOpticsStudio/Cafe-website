import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

/** Placeholder block for loading states. Purely visual – hidden from screen readers. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-forest-100/70', className)}
      {...props}
    />
  );
}
