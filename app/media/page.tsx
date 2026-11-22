import type { Metadata } from 'next';
import { MediaPage } from '@/components/MediaPage';
import { listAlbums } from '@/lib/queries';
import { readPrefs } from '@/lib/server-prefs';
import { t } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const { lang } = await readPrefs();
  return { title: `${t(lang, 'mediaTitle')} | ${t(lang, 'site')}` };
}

export default async function Page() {
  const albums = await listAlbums();
  return <MediaPage albums={albums} />;
}
