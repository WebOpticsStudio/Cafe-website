'use client';

import { useActionState } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ActionResult } from '@/types';
import { setItemAvailabilityAction } from '../actions';

const initialState: ActionResult = { ok: true };

/** Accessible switch that marks one menu item available / sold out via a Server Action. */
export function AvailabilityToggle({
  itemId,
  itemName,
  isAvailable,
  disabled = false,
}: {
  itemId: string;
  itemName: string;
  isAvailable: boolean;
  disabled?: boolean;
}) {
  const [state, formAction, pending] = useActionState(setItemAvailabilityAction, initialState);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="itemId" value={itemId} />
      <input type="hidden" name="isAvailable" value={String(!isAvailable)} />
      <button
        type="submit"
        role="switch"
        aria-checked={isAvailable}
        aria-label={`${itemName}: ${isAvailable ? 'available' : 'sold out'}`}
        disabled={disabled || pending}
        className={cn(
          'relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors disabled:opacity-50',
          isAvailable ? 'bg-forest-700' : 'bg-line',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'inline-block size-6 rounded-full bg-white shadow transition-transform motion-reduce:transition-none',
            isAvailable ? 'translate-x-7' : 'translate-x-1',
          )}
        />
      </button>
      {!state.ok ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
