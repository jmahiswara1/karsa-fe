'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { BoardColor } from '@/components/tasks/board-colors';

const STORAGE_KEY = 'karsa.boardColors';
export const INBOX_COLOR_KEY = 'INBOX';

function readStorage(): Record<string, BoardColor> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStorage(map: Record<string, BoardColor>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage full or unavailable
  }
}

// Simple external store for localStorage sync
let listeners: Array<() => void> = [];
let cachedColors: Record<string, BoardColor> | null = null;

function getSnapshot(): Record<string, BoardColor> {
  if (cachedColors === null) {
    cachedColors = readStorage();
  }
  return cachedColors;
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notify() {
  cachedColors = null; // invalidate cache
  listeners.forEach((l) => l());
}

// Cache server snapshot to avoid infinite loop
const EMPTY_COLORS: Record<string, BoardColor> = {};
function getServerSnapshot(): Record<string, BoardColor> {
  return EMPTY_COLORS;
}

export function useBoardColors() {
  const colors = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const getColor = useCallback(
    (id: string): BoardColor => {
      return colors[id] ?? 'neutral';
    },
    [colors],
  );

  const setColor = useCallback(
    (id: string, color: BoardColor) => {
      const next = { ...colors, [id]: color };
      writeStorage(next);
      notify();
    },
    [colors],
  );

  return { getColor, setColor };
}
