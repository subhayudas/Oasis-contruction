'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Reads a value that only exists in the browser — localStorage, in practice —
 * without an effect that immediately calls setState.
 *
 * The obvious shape for this is `useState(null)` plus `useEffect(() => set(read()))`,
 * but that is a cascading render on every mount and React's lint rules reject
 * it. `useSyncExternalStore` is the API built for exactly this: it returns the
 * server snapshot during SSR and the real one on the client, in a single pass.
 *
 * Nothing outside this tab writes these keys, so `subscribe` only has to
 * listen for our own `write()` and for another tab of the same site.
 */
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

/**
 * @param key      localStorage key
 * @param onServer what to report before the browser value is known
 */
export function useBrowserValue(
  key: string,
  onServer: string | null = null,
): [string | null, (value: string) => void] {
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      // Private mode, or site data blocked. Behave as if nothing was stored.
      return null;
    }
  }, [key]);

  const getServerSnapshot = useCallback(() => onServer, [onServer]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const write = useCallback(
    (next: string) => {
      try {
        window.localStorage.setItem(key, next);
      } catch {
        /* nothing to write to; the notify below still updates this tab */
      }
      notify();
    },
    [key],
  );

  return [value, write];
}
