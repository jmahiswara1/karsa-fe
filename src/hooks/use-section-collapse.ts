'use client';

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_PREFIX = 'karsa.section.';

function readSectionState(key: string): boolean {
  if (typeof window === 'undefined') return false; // false = expanded by default
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw === null ? false : raw === 'true';
  } catch {
    return false;
  }
}

function writeSectionState(key: string, collapsed: boolean) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, String(collapsed));
  } catch {
    // localStorage full or unavailable
  }
}

// Module-level state untuk external store
const listeners = new Set<() => void>();
let cache: Record<string, boolean> = {};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  cache = {}; // invalidate
  listeners.forEach((l) => l());
}

function getSnapshot(key: string): boolean {
  if (!(key in cache)) {
    cache[key] = readSectionState(key);
  }
  return cache[key];
}

function getServerSnapshot(): boolean {
  return false; // default expanded
}

export function useSectionCollapse(key: string, defaultCollapsed = false) {
  const collapsed = useSyncExternalStore(
    subscribe,
    () => getSnapshot(key),
    getServerSnapshot,
  );

  const toggle = useCallback(() => {
    const current = getSnapshot(key);
    const next = !current;
    writeSectionState(key, next);
    notify();
  }, [key]);

  return { collapsed: collapsed ?? defaultCollapsed, toggle };
}
