import { useCallback, useSyncExternalStore } from 'react';

const listeners = new Map<string, Set<() => void>>();

function subscribe(key: string, callback: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(callback);
  return () => { listeners.get(key)?.delete(callback); };
}

function notify(key: string) {
  listeners.get(key)?.forEach(cb => cb());
}

function getStorageValue<T>(key: string, initialValue: T): T {
  try {
    const item = window.localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const subscribeFn = useCallback((cb: () => void) => subscribe(key, cb), [key]);
  const getSnapshot = useCallback(() => window.localStorage.getItem(key), [key]);

  const raw = useSyncExternalStore(subscribeFn, getSnapshot);
  const value: T = raw !== null ? JSON.parse(raw) : initialValue;

  const setValue = useCallback((v: T | ((prev: T) => T)) => {
    try {
      const current = getStorageValue(key, initialValue);
      const valueToStore = v instanceof Function ? v(current) : v;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      notify(key);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [value, setValue];
}
