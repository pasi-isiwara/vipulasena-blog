'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Records one visit per page view, tagged with a random id kept in this
 *  browser so repeat visits from the same person count as one visitor.
 *  The counter in the footer reads the totals on the next page load. */
export function VisitRecorder() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;

    let visitorId: string;
    try {
      visitorId = localStorage.getItem('vp-visitor') ?? '';
      if (!visitorId) {
        visitorId = crypto.randomUUID();
        localStorage.setItem('vp-visitor', visitorId);
      }
    } catch {
      return; // Storage blocked: skip counting rather than inflate the total.
    }

    const body = JSON.stringify({ visitorId, page: pathname });
    fetch('/api/visits', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
