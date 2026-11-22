'use client';

import Link from 'next/link';
import { usePrefs, pick } from '@/lib/prefs';
import type { Album } from '@/lib/types';
import { MediaArt } from './art/MediaArt';

const BACK = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
);

export function MediaPage({ albums }: { albums: Album[] }) {
  const { t, lang, countLabel } = usePrefs();

  return (
    <div className="topic-view topic--media">
      <section className="topic-hero">
        <MediaArt />
        <div className="wrap topic-hero-inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">{t('navHome')}</Link>
            <span aria-hidden="true">/</span>
            <span>{t('navMedia')}</span>
          </nav>
          <h1 className="media-title">{t('mediaTitle')}</h1>
          <p className="topic-lead media-lead">{t('mediaLead')}</p>
          <p className="topic-count media-count">
            {countLabel(albums.length, 'albumsLabel', 'albumsLabelPlural')}
          </p>
        </div>
      </section>

      <section className="wrap topic-body">
        <ol className="album-grid">
          {albums.map((album) => (
            <li key={album.id}>
              <Link className="album" href={`/media/${album.id}`}>
                <span className="album-stack">
                  <span className="album-cover">
                    {album.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={album.cover_url} alt="" loading="lazy" />
                    ) : (
                      <span className="ph" />
                    )}
                  </span>
                </span>
                <span className="album-info">
                  <span className="album-title">
                    {pick(lang, album.title_en, album.title_si)}
                  </span>
                  <span className="album-meta">
                    {countLabel(album.photo_count, 'photosLabel', 'photosLabelPlural')}
                  </span>
                  <span className="album-desc">
                    {pick(lang, album.desc_en, album.desc_si)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        {albums.length === 0 && <p className="list-empty">{t('noAlbums')}</p>}

        <Link className="back-home" href="/">
          {BACK}
          <span>{t('backHome')}</span>
        </Link>
      </section>
    </div>
  );
}
