import type { Metadata } from 'next';
import './globals.css';
import { readPrefs } from '@/lib/server-prefs';
import { t } from '@/lib/i18n';
import { PrefsProvider } from '@/lib/prefs';
import { Chrome } from '@/components/Chrome';
import { VisitRecorder } from '@/components/VisitRecorder';
import { currentAdmin } from '@/lib/auth';
import { getVisitTotals } from '@/lib/queries';

/** The title follows the chosen language, as it did in the prototype. Each
 *  page below overrides it with its own; this is what the home page gets. */
export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await readPrefs();
  return {
    title: t(lang, 'titleHome'),
    description:
      'The blog of Vipulasena Pathirajage, former Director of Science Education, Ministry of Education, Sri Lanka. Publications, general thoughts, children’s books and media, free to use with citation.',
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
};

const FONTS =
  'https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Lora:ital,wght@0,500;0,600;1,500&family=Noto+Sans+Sinhala:wght@400;500;600&family=Noto+Serif+Sinhala:wght@500;600&display=swap';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, theme } = await readPrefs();

  // Neither of these is worth failing the whole page over: without a database
  // the site should still render, just without the counter or the admin link.
  const [admin, totals] = await Promise.all([
    currentAdmin().catch(() => null),
    getVisitTotals().catch(() => null),
  ]);

  return (
    <html lang={lang} data-theme={theme ?? undefined}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        <PrefsProvider initialLang={lang} initialTheme={theme}>
          <Chrome isAdmin={!!admin} totals={totals}>
            {children}
          </Chrome>
          <VisitRecorder />
        </PrefsProvider>
      </body>
    </html>
  );
}
