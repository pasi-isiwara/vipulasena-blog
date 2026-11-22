'use client';

import { usePrefs } from '@/lib/prefs';

export function SkipLink() {
  const { t } = usePrefs();
  return (
    <a className="skip" href="#main">
      {t('skip')}
    </a>
  );
}
