'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrefs } from '@/lib/prefs';

const NAV = [
  { href: '/', key: 'navHome' },
  { href: '/education', key: 'navEdu' },
  { href: '/general-thoughts', key: 'navGeneral' },
  { href: '/childrens-books', key: 'navKids' },
  { href: '/media', key: 'navMedia' },
  { href: '/#ask', key: 'navAsk' },
] as const;

export function SiteHeader() {
  const { t, lang, setLang, resolvedTheme, toggleTheme } = usePrefs();
  const pathname = usePathname();

  const isDark = resolvedTheme === 'dark';
  const themeLabel = t(isDark ? 'toLight' : 'toDark');

  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="brand" href="/">
          <span className="monogram" aria-hidden="true">VP</span>
          <span className="brand-name">{t('name')}</span>
        </Link>
        <div className="header-right">
          <nav className="nav" aria-label={t('ariaNavMain')}>
            {NAV.map((item) => {
              const current =
                item.href === '/'
                  ? pathname === '/'
                  : item.href.startsWith('/#')
                    ? false
                    : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? 'page' : undefined}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
          <div className="controls">
            <div className="lang" role="group" aria-label={t('ariaLang')}>
              <button
                type="button"
                aria-pressed={lang === 'en'}
                aria-label="English"
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                type="button"
                lang="si"
                aria-pressed={lang === 'si'}
                aria-label="සිංහල"
                onClick={() => setLang('si')}
              >
                සිං
              </button>
            </div>
            <button
              type="button"
              className={`theme-toggle${isDark ? ' is-dark' : ''}`}
              aria-label={themeLabel}
              title={themeLabel}
              onClick={toggleTheme}
            >
              <svg className="moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>
              <svg className="sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
