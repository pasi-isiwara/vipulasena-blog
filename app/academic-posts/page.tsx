import type { Metadata } from 'next';
import { TopicPage } from '@/components/TopicPage';
import { listArticles } from '@/lib/queries';
import { readPrefs } from '@/lib/server-prefs';
import { t } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await readPrefs();
  return { title: `${t(lang, 'navAcad')} | ${t(lang, 'site')}` };
}

export default async function Page() {
  const articles = await listArticles('academic');
  return <TopicPage section="academic" articles={articles} />;
}
