'use client';

import { useState } from 'react';

/** A delete button that asks once. The first click arms it, the second does it -
 *  the same two-step the prototype used, so nothing is lost by a stray click. */
export function ConfirmButton({
  label,
  confirmLabel = 'Confirm delete',
  onConfirm,
  className = 'btn-ghost danger',
}: {
  label: string;
  confirmLabel?: string;
  onConfirm: () => void;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (!armed) {
          setArmed(true);
          return;
        }
        setArmed(false);
        onConfirm();
      }}
      onBlur={() => setArmed(false)}
    >
      {armed ? confirmLabel : label}
    </button>
  );
}
