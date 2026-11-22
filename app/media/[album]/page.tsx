import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AlbumPage } from '@/components/AlbumPage';
import { getAlbum, listPhotos } from '@/lib/queries';
import { readPrefs } from '@/lib/server-prefs';
import { t } from '@/lib/i18n';

type Props = { params: Promise<{ album: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { album: id } = await params;
  const [{ lang }, album] = await Promise.all([readPrefs(), getAlbum(id)]);
  if (!album) return {};
  const title = lang === 'si' && album.title_si ? album.title_si : album.title_en;
  return { title: `${title} | ${t(lang, 'mediaTitle')} | ${t(lang, 'site')}` };
}

export default async function Page({ params }: Props) {
  const { album: id } = await params;
  const album = await getAlbum(id);
  if (!album) notFound();
  const photos = await listPhotos(id);
  return <AlbumPage album={album} photos={photos} />;
}
