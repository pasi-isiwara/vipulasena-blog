import { cookies } from 'next/headers';
import type { Lang } from './i18n';
import type { Theme } from './prefs';

/** Reads the visitor's saved language and theme so the server can render the
 *  page already in the right one. Both default to the prototype's defaults:
 *  English, and whatever the operating system prefers for light or dark. */
export async function readPrefs(): Promise<{ lang: Lang; theme: Theme | null }> {
  const jar = await cookies();
  const lang = jar.get('vp-lang')?.value === 'si' ? 'si' : 'en';
  const themeValue = jar.get('vp-theme')?.value;
  const theme: Theme | null =
    themeValue === 'dark' || themeValue === 'light' ? themeValue : null;
  return { lang, theme };
}
