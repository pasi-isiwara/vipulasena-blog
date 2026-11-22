import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FolderPage } from '@/components/FolderPage';
import { getFolder, listArticlesInFolder } from '@/lib/queries';
import { readPrefs } from '@/lib/server-prefs';
import { t } from '@/lib/i18n';

type Props = { params: Promise<{ folder: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { folder: id } = await params;
  const [{ lang }, folder] = await Promise.all([readPrefs(), getFolder(id)]);
  if (!folder) return {};
  const title = lang === 'si' && folder.title_si ? folder.title_si : folder.title_en;
  return { title: `${title} | ${t(lang, 'navEdu')} | ${t(lang, 'site')}` };
}

export default async function Page({ params }: Props) {
  const { folder: id } = await params;
  const folder = await getFolder(id);
  if (!folder || folder.section !== 'education') notFound();
  const articles = await listArticlesInFolder(id);
  return <FolderPage folder={folder} articles={articles} />;
}
