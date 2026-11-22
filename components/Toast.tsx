'use client';

import { useEffect, useState, useCallback } from 'react';

/** The small message that slides up when an article has no document yet. */
export function useToast() {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);

  const show = useCallback((text: string) => {
    setMessage(text);
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(timer);
  }, [visible, message]);

  const node = (
    <div className={`toast${visible ? ' show' : ''}`} role="status" aria-live="polite">
      {message}
    </div>
  );

  return { show, node };
}
