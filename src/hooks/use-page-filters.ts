'use client';

import { useCallback, useMemo, useState } from 'react';
import { useDebouncedSearch } from './use-debounced-search';

export interface PageFilterState<TStatus extends string, TPriority extends string> {
  search: string;
  debouncedSearch: string;
  status: TStatus | '';
  priority: TPriority | '';
  setStatus: (value: TStatus | '') => void;
  setPriority: (value: TPriority | '') => void;
  onSearchChange: (value: string) => void;
  clear: () => void;
  hasFilters: boolean;
}

interface UsePageFiltersOptions {
  /** Extra query params merged into the memoized object. */
  extraParams?: Record<string, unknown>;
  /** Extra keys to check when determining `hasFilters`. */
  extraFilterKeys?: string[];
  /** Default limit applied to the query params. */
  limit?: number;
}

interface UsePageFiltersResult<
  TStatus extends string,
  TPriority extends string,
> extends PageFilterState<TStatus, TPriority> {
  queryParams: Record<string, unknown>;
}

/**
 * Shared filter state for list pages: search (debounced) + status + priority.
 * Also exposes a memoized `queryParams` object ready to pass to a query hook.
 */
export function usePageFilters<TStatus extends string, TPriority extends string>(
  options: UsePageFiltersOptions = {},
): UsePageFiltersResult<TStatus, TPriority> {
  const { extraParams = {}, extraFilterKeys = [], limit } = options;
  const { search, debouncedSearch, setSearch, clear: clearSearch } = useDebouncedSearch();
  const [status, setStatus] = useState<TStatus | ''>('');
  const [priority, setPriority] = useState<TPriority | ''>('');

  const clear = useCallback(() => {
    clearSearch();
    setStatus('');
    setPriority('');
  }, [clearSearch]);

  const hasFilters =
    !!search || !!status || !!priority || extraFilterKeys.some((k) => !!extraParams[k]);

  // Stringify extra params so the memo can depend on a primitive.
  const extraParamsKey = JSON.stringify(extraParams);

  const queryParams = useMemo(() => {
    return {
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(limit !== undefined && { limit }),
      ...JSON.parse(extraParamsKey),
    };
  }, [debouncedSearch, status, priority, limit, extraParamsKey]);

  return {
    search,
    debouncedSearch,
    status,
    priority,
    setStatus,
    setPriority,
    onSearchChange: setSearch,
    clear,
    hasFilters,
    queryParams,
  };
}
