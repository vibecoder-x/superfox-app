'use client';

import { useCallback, useEffect, useRef } from 'react';

export function useActivityTimer(activity?: string | null) {
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const cancel = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);
  useEffect(() => cancel, [activity, cancel]);
  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, delay);
    timers.current.add(timer);
  }, []);
  return { schedule, cancel };
}
