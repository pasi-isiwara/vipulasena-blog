'use client';

import { useState } from 'react';
import { usePrefs } from '@/lib/prefs';
import type { Key } from '@/lib/i18n';

type Status = { key: Key | null; tone: '' | 'ok' | 'err' };

/** The "Ask a question" form. Questions go straight to the author and are
 *  never shown to other visitors - the owner reads them in the admin area. */
export function AskForm() {
  const { t, lang } = usePrefs();
  const [status, setStatus] = useState<Status>({ key: null, tone: '' });
  const [sending, setSending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const question = String(data.get('qtext') ?? '').trim();

    if (question.length < 2) {
      setStatus({ key: 'emptyQ', tone: 'err' });
      form.querySelector<HTMLTextAreaElement>('[name="qtext"]')?.focus();
      return;
    }

    setSending(true);
    setStatus({ key: 'sending', tone: '' });
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('qname') ?? '').trim().slice(0, 80),
          contact: String(data.get('qcontact') ?? '').trim().slice(0, 120),
          question: question.slice(0, 3000),
          language: lang,
        }),
      });
      if (res.status === 429) {
        setStatus({ key: 'tooMany', tone: 'err' });
      } else if (!res.ok) {
        setStatus({ key: 'failed', tone: 'err' });
      } else {
        form.reset();
        setStatus({ key: 'sent', tone: 'ok' });
      }
    } catch {
      setStatus({ key: 'failed', tone: 'err' });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="question-form ideas-form" noValidate onSubmit={onSubmit}>
      <div className="field-row">
        <label className="field">
          <span>{t('fName')}</span>
          <input name="qname" type="text" autoComplete="name" maxLength={80} />
        </label>
        <label className="field">
          <span>{t('fContact')}</span>
          <input name="qcontact" type="text" autoComplete="email" maxLength={120} />
        </label>
      </div>
      <label className="field">
        <span>{t('fQuestion')}</span>
        <textarea name="qtext" rows={6} maxLength={3000} required />
      </label>
      <div className="form-foot">
        <button type="submit" className="btn" disabled={sending}>
          {t('fAsk')}
        </button>
        <p className={`form-status${status.tone ? ' ' + status.tone : ''}`} role="status" aria-live="polite">
          {status.key ? t(status.key) : ''}
        </p>
      </div>
    </form>
  );
}
