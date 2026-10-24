import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface StateMessageProps {
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  /** `alert` announces immediately to assistive tech – use for errors. */
  role?: 'status' | 'alert';
  className?: string;
}

/** Shared empty / error / not-found presentation. */
export function StateMessage({ title, children, actions, role, className }: StateMessageProps) {
  return (
    <div role={role} className={cn('mx-auto max-w-xl py-20 text-center', className)}>
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      {children ? <div className="mt-4 text-lg text-muted">{children}</div> : null}
      {actions ? <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div> : null}
    </div>
  );
}
