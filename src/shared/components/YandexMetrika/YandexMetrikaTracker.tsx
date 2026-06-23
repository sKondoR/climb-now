'use client';

declare global {
  interface Window {
    ym?: (...args: any[]) => void;
  }
}


import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function YandexMetrikaTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ym) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
      window.ym('hit', url);
    }
  }, [pathname, searchParams]);

  return null;
}