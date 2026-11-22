'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePrefs, pick } from '@/lib/prefs';
import type { Album, Photo } from '@/lib/types';
import { MediaArt } from './art/MediaArt';

const BACK = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
);
const CLOSE = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
);
const PREV = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
);
const NEXT = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
);

export function AlbumPage({ album, photos }: { album: Album; photos: Photo[] }) {
  const { t, lang, countLabel } = usePrefs();
  const [open, setOpen] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const caption = useCallback(
    (photo: Photo, index: number) => {
      const text = pick(lang, photo.caption_en, photo.caption_si);
      return text || `${t('photo')} ${index + 1}`;
    },
    [lang, t],
  );

  const title = pick(lang, album.title_en, album.title_si);

  return (
    <div className="topic-view topic--media">
      <section className="topic-hero">
        <MediaArt />
        <div className="wrap topic-hero-inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">{t('navHome')}</Link>
            <span aria-hidden="true">/</span>
            <Link href="/media">{t('navMedia')}</Link>
            <span aria-hidden="true">/</span>
            <span>{title}</span>
          </nav>
          <h1 className="media-title">{title}</h1>
          <p className="topic-lead media-lead">{pick(lang, album.desc_en, album.desc_si)}</p>
          <p className="topic-count media-count">
            {countLabel(photos.length, 'photosLabel', 'photosLabelPlural')}
          </p>
        </div>
      </section>

      <section className="wrap topic-body">
        <div className="album-panel">
          <ol className="photo-grid">
            {photos.map((photo, i) => (
              <li key={photo.id}>
                <button
                  type="button"
                  className="photo"
                  aria-label={caption(photo, i)}
                  onClick={(e) => {
                    openerRef.current = e.currentTarget;
                    setOpen(i);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.image_url}
                    alt={caption(photo, i)}
                    loading="lazy"
                    style={{ aspectRatio: String(photo.ratio) }}
                  />
                  <span className="photo-cap" aria-hidden="true">
                    {caption(photo, i)}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          {photos.length === 0 && <p className="album-empty">{t('albumEmpty')}</p>}

          <Link className="back-home" href="/media">
            {BACK}
            <span>{t('allAlbums')}</span>
          </Link>
        </div>

        <Link className="back-home" href="/">
          {BACK}
          <span>{t('backHome')}</span>
        </Link>
      </section>

      {open !== null && (
        <Lightbox
          photos={photos}
          index={open}
          caption={caption}
          onClose={() => {
            setOpen(null);
            openerRef.current?.focus();
          }}
          onIndex={setOpen}
        />
      )}
    </div>
  );
}

function Lightbox({
  photos,
  index,
  caption,
  onClose,
  onIndex,
}: {
  photos: Photo[];
  index: number;
  caption: (photo: Photo, index: number) => string;
  onClose: () => void;
  onIndex: (next: number) => void;
}) {
  const { t } = usePrefs();
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const many = photos.length > 1;

  const step = useCallback(
    (delta: number) => onIndex((index + delta + photos.length) % photos.length),
    [index, photos.length, onIndex],
  );

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    // The viewer is modal: the page behind it must not scroll.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        step(-1);
      } else if (e.key === 'ArrowRight') {
        step(1);
      } else if (e.key === 'Tab') {
        // Keep focus inside the viewer
        const buttons = [closeRef.current, prevRef.current, nextRef.current].filter(
          (b): b is HTMLButtonElement => !!b,
        );
        if (!buttons.length) return;
        e.preventDefault();
        const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const next = (at + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length;
        buttons[next].focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [step, onClose]);

  const photo = photos[index];

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={t('viewer')}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button ref={closeRef} type="button" className="lb-btn lb-close" aria-label={t('close')} onClick={onClose}>
        {CLOSE}
      </button>
      <button ref={prevRef} type="button" className="lb-btn lb-prev" aria-label={t('prev')} hidden={!many} onClick={() => step(-1)}>
        {PREV}
      </button>
      <figure className="lb-figure">
        <div className="lb-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.image_url} alt={caption(photo, index)} />
        </div>
        <figcaption className="lb-cap">
          <span className="lb-text">{caption(photo, index)}</span>
          <span className="lb-count">{`${index + 1} ${t('of')} ${photos.length}`}</span>
        </figcaption>
      </figure>
      <button ref={nextRef} type="button" className="lb-btn lb-next" aria-label={t('next')} hidden={!many} onClick={() => step(1)}>
        {NEXT}
      </button>
    </div>
  );
}
