'use client';

import { useEffect, useState } from 'react';

/**
 * Live clock that updates every second. Returns null until mounted to avoid
 * SSR hydration mismatches.
 */
export function useClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Client-only clock; seed immediately then tick every second.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!now) return { date: '', time: '' };

  const date = now.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return { date, time };
}
