'use client';

import { useEffect, useRef } from 'react';

/** Counts up from zero to the number over about a second, the way the
 *  prototype's visitor pill did on first load.
 *
 *  The final number is what is rendered, so the markup the server sends is
 *  already correct and search engines and screen readers see the real figure;
 *  the animation only runs afterwards, in the browser, and not at all for
 *  anyone who has asked for less motion. */
export function CountUp({ to }: { to: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (to === 0) return;

    let frame = 0;
    let began: number | null = null;
    const step = (now: number) => {
      if (began === null) began = now;
      const k = Math.min(1, (now - began) / 900);
      const eased = 1 - Math.pow(1 - k, 3);
      // Written straight to the DOM: this runs every frame, and re-rendering
      // the footer sixty times a second to change one number is waste.
      node.textContent = Math.round(to * eased).toLocaleString('en-US');
      if (k < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      node.textContent = to.toLocaleString('en-US');
    };
  }, [to]);

  return <span ref={nodeRef}>{to.toLocaleString('en-US')}</span>;
}
