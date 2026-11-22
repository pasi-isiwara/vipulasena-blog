'use client';

import Link from 'next/link';
import { usePrefs } from '@/lib/prefs';
import type { VisitTotals } from '@/lib/types';
import { CountUp } from './CountUp';

const NAV = [
  { href: '/education', key: 'navEdu' },
  { href: '/academic-posts', key: 'navAcad' },
  { href: '/childrens-books', key: 'navKids' },
  { href: '/media', key: 'navMedia' },
  { href: '/#ask', key: 'navAsk' },
] as const;

export function SiteFooter({
  isAdmin,
  totals,
}: {
  isAdmin: boolean;
  totals: VisitTotals | null;
}) {
  const { t } = usePrefs();

  return (
    <footer className="site-footer">
      <div className="wrap footer-main">
        <div className="footer-id">
          <span className="footer-name">{t('name')}</span>
          <span className="footer-sub">{t('footerSub')}</span>
        </div>
        <nav className="nav footer-nav" aria-label={t('ariaNavFooter')}>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </div>
      <div className="wrap footer-legal">
        <span>
          <span>{t('legal')}</span>{' '}
          {isAdmin && (
            <Link className="admin-link" href="/admin">
              {t('admin')}
            </Link>
          )}
        </span>
        {totals && (
          <p className="visits">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
            <span>
              <strong className="visits-people">
                <CountUp to={totals.visitors} />
              </strong>{' '}
              <span className="visits-people-label">
                {t(totals.visitors === 1 ? 'visitor' : 'visitors')}
              </span>
            </span>
            <span className="visits-sep" aria-hidden="true" />
            <span>
              <strong className="visits-total">
                <CountUp to={totals.page_visits} />
              </strong>{' '}
              <span className="visits-total-label">
                {t(totals.page_visits === 1 ? 'pageVisit' : 'pageVisits')}
              </span>
            </span>
          </p>
        )}
      </div>
    </footer>
  );
}
