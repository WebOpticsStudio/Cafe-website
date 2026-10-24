'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Current time, refreshed on an interval, safe for SSR.
 *
 * Returns `null` on the server and during hydration, then the real time on the client.
 * This avoids hydration mismatches and keeps statically generated pages from baking in a
 * stale "open now" state.
 */
export function useNow(intervalMs = 60_000): Date | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const id = setInterval(onChange, intervalMs);
      return () => clearInterval(id);
    },
    [intervalMs],
  );

  // Snapshot is quantised to the interval so it is stable between ticks.
  const getSnapshot = () => Math.floor(Date.now() / intervalMs) * intervalMs;
  const timestamp = useSyncExternalStore(subscribe, getSnapshot, () => null);

  return timestamp === null ? null : new Date(timestamp);
}
