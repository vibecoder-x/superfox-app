'use client';

import { useEffect, useState } from 'react';
import { emptyMathProgress, MATH_PROGRESS_EVENT, MATH_PROGRESS_KEY, readMathProgress } from '@/lib/math-progress';

export function useMathProgress() {
  const [progress, setProgress] = useState(emptyMathProgress);
  useEffect(() => {
    const refresh = () => setProgress(readMathProgress());
    const onStorage = (event: StorageEvent) => {
      if (event.key === MATH_PROGRESS_KEY || event.key === null) refresh();
    };
    refresh();
    window.addEventListener(MATH_PROGRESS_EVENT, refresh);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(MATH_PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  return progress;
}
