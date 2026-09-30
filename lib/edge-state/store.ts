'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * 2026 Vercel Edge State Management Hook
 * Distributed, ultra-low-latency state synchronizer for luxury clients.
 */
export function useEdgeState<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(`perseus_edge_${key}`);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(`perseus_edge_${key}`, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to sync edge state to local storage', e);
    }
  }, [key, state]);

  const setEdgeState = useCallback((val: T | ((prev: T) => T)) => {
    setState(val);
  }, []);

  return [state, setEdgeState];
}
