import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

// Simple in-memory pub/sub for same-tab localStorage sync
const listeners = new Map<string, Set<() => void>>();

function subscribe(key: string, callback: () => void) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(callback);
  return () => { listeners.get(key)?.delete(callback); };
}

function notify(key: string) {
  listeners.get(key)?.forEach(cb => cb());
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const getSnapshot = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ?? null;
    } catch {
      return null;
    }
  }, [key]);

  const subscribeFn = useCallback((cb: () => void) => subscribe(key, cb), [key]);

  const raw = useSyncExternalStore(subscribeFn, getSnapshot);
  const value: T = raw !== null ? JSON.parse(raw) : initialValue;

  const setValue = useCallback((v: T | ((prev: T) => T)) => {
    try {
      const current = window.localStorage.getItem(key);
      const currentParsed: T = current !== null ? JSON.parse(current) : initialValue;
      const valueToStore = v instanceof Function ? v(currentParsed) : v;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      notify(key);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [value, setValue];
}
