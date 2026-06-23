'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'minichat-expanded';

/**
 * Persists the dashboard MiniChat expansion state to localStorage.
 */
export function useMiniChatExpansion(defaultExpanded = false) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === 'true') setIsExpanded(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, String(isExpanded));
  }, [isExpanded]);

  const toggle = useCallback(() => setIsExpanded((v) => !v), []);

  return { isExpanded, setIsExpanded, toggle };
}
