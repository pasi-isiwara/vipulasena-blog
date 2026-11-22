import type { Metadata } from 'next';
import { TopicPage } from '@/components/TopicPage';
import { listArticles, listFolders } from '@/lib/queries';
import { readPrefs } from '@/lib/server-prefs';
import { t } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await readPrefs();
  return { title: `${t(lang, 'navEdu')} | ${t(lang, 'site')}` };
}

export default async function Page() {
  const [articles, folders] = await Promise.all([
    listArticles('education'),
    listFolders('education'),
  ]);
  return <TopicPage section="education" articles={articles} folders={folders} />;
}
