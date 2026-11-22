'use client';

/** Language and theme, shared by every client component.
 *
 *  Both are stored in cookies so the server renders the page in the right
 *  language and theme on the first paint - no flash, and no innerHTML swapping
 *  the way the prototype did it. Switching still happens instantly in the
 *  browser, because every page is given both languages' text up front. */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Lang, Key } from './i18n';
import { t as translate, countLabel as count } from './i18n';

export type Theme = 'light' | 'dark';

type Prefs = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: Key) => string;
  countLabel: (n: number, one: Key, many: Key) => string;
  /** The visitor's explicit choice, or null when they are following the system. */
  theme: Theme | null;
  /** What is actually on screen, system preference included. */
  resolvedTheme: Theme;
  toggleTheme: () => void;
};

const PrefsContext = createContext<Prefs | null>(null);

const YEAR = 60 * 60 * 24 * 365;

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${YEAR}; samesite=lax`;
}

export function PrefsProvider({
  initialLang,
  initialTheme,
  children,
}: {
  initialLang: Lang;
  initialTheme: Theme | null;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [theme, setTheme] = useState<Theme | null>(initialTheme);
  // Only known in the browser, so it starts as light and corrects on mount.
  // Nothing visual depends on it except which icon the toggle shows.
  const [systemTheme, setSystemTheme] = useState<Theme>('light');

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setSystemTheme(query.matches ? 'dark' : 'light');
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    writeCookie('vp-lang', next);
    document.documentElement.lang = next;
  }, []);

  const resolvedTheme: Theme = theme ?? systemTheme;

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const now =
        current ??
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next: Theme = now === 'dark' ? 'light' : 'dark';
      writeCookie('vp-theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  // The document title is the one piece of <head> that has to follow the toggle.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value: Prefs = {
    lang,
    setLang,
    t: (key) => translate(lang, key),
    countLabel: (n, one, many) => count(lang, n, one, many),
    theme,
    resolvedTheme,
    toggleTheme,
  };

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): Prefs {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used inside <PrefsProvider>');
  return ctx;
}

/** Picks the English or Sinhala side of a database row, falling back to English. */
export function pick(lang: Lang, en: string, si: string): string {
  return lang === 'si' && si ? si : en;
}
