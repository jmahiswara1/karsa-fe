'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseDebouncedSearchOptions {
  delay?: number;
  initialDebounced?: string;
}

interface UseDebouncedSearchResult {
  search: string;
  debouncedSearch: string;
  setSearch: (value: string) => void;
  clear: () => void;
}

/**
 * Manages a search input with a debounced value.
 * The raw `search` updates immediately (for controlled input),
 * while `debouncedSearch` updates after `delay` ms of inactivity
 * (for triggering API queries).
 */
export function useDebouncedSearch({
  delay = 500,
  initialDebounced = '',
}: UseDebouncedSearchOptions = {}): UseDebouncedSearchResult {
  const [search, setSearchState] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(initialDebounced);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setSearch = useCallback(
    (value: string) => {
      setSearchState(value);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setDebouncedSearch(value), delay);
    },
    [delay],
  );

  const clear = useCallback(() => {
    setSearchState('');
    setDebouncedSearch('');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { search, debouncedSearch, setSearch, clear };
}
