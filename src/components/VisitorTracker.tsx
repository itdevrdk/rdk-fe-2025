'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import api from '@/lib/api';

export default function VisitorTracker() {
  const pathname = usePathname();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Prevent double tracking in strict mode or re-renders
    if (hasTracked.current) return;

    // Skip tracking for admin pages
    if (pathname?.startsWith('/admin')) return;

    const trackVisitor = async () => {
      try {
        await api.post('/visitors/track');
        hasTracked.current = true;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to track visitor', error);
      }
    };

    trackVisitor();
  }, [pathname]);

  return null;
}
