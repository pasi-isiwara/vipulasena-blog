'use client';

import { useEffect, useRef } from 'react';

const CLOSE = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
);

/** The side panel the admin forms open in. Keyboard-operable: Escape closes it,
 *  focus starts on the first field and returns where it came from. */
export function Drawer({
  title,
  status,
  saving,
  onClose,
  onSubmit,
  children,
}: {
  title: string;
  status: { text: string; tone: '' | 'err' };
  saving: boolean;
  onClose: () => void;
  onSubmit: (form: HTMLFormElement) => void;
  children: React.ReactNode;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);

  useEffect(() => {
    openerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const first = bodyRef.current?.querySelector<HTMLElement>(
      'input:not([type="file"]):not([type="checkbox"]), select, textarea',
    );
    first?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      const opener = openerRef.current;
      if (opener instanceof HTMLElement && document.contains(opener)) opener.focus();
    };
  }, [onClose]);

  return (
    <div
      className="adm-drawer"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        className="adm-form"
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="adm-form-title"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e.currentTarget);
        }}
      >
        <div className="adm-form-head">
          <h2 id="adm-form-title">{title}</h2>
          <button type="button" className="adm-icon" aria-label="Close" onClick={onClose}>
            {CLOSE}
          </button>
        </div>
        <div className="adm-form-body" ref={bodyRef}>
          {children}
        </div>
        <div className="adm-form-foot">
          <p className={`adm-form-status${status.tone ? ' ' + status.tone : ''}`} role="status">
            {status.text}
          </p>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={saving}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
