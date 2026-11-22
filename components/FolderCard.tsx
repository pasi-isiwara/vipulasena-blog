'use client';

import Link from 'next/link';
import { usePrefs, pick } from '@/lib/prefs';
import type { Folder } from '@/lib/types';

const ARROW = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

/** The drawing on a folder card: an open folder over the Education page's
 *  graph paper, with the papers inside hinted at. */
function FolderArt({ index }: { index: number }) {
  return (
    <svg className="folder-art" viewBox="0 0 120 90" aria-hidden="true" focusable="false">
      <rect className="th-bg" width="120" height="90" />
      <path className="th-grid" d="M0 15h120M0 30h120M0 45h120M0 60h120M0 75h120M15 0v90M30 0v90M45 0v90M60 0v90M75 0v90M90 0v90M105 0v90" />
      {/* Sheets peeking out, one more for every other folder so the row varies */}
      <rect className="fo-sheet" x="40" y="26" width="42" height="34" rx="2" transform="rotate(-6 61 43)" />
      {index % 2 === 0 && (
        <rect className="fo-sheet" x="44" y="24" width="42" height="34" rx="2" transform="rotate(4 65 41)" />
      )}
      <path className="fo-back" d="M26 30h20l5 6h43a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H26a3 3 0 0 1-3-3V33a3 3 0 0 1 3-3z" />
      <path className="fo-front" d="M23 44h74l-7 22a3 3 0 0 1-3 2H26a3 3 0 0 1-3-3z" />
    </svg>
  );
}

export function FolderCard({ folder, index }: { folder: Folder; index: number }) {
  const { lang, countLabel } = usePrefs();
  const title = pick(lang, folder.title_en, folder.title_si);
  const desc = pick(lang, folder.desc_en, folder.desc_si);

  return (
    <Link className="folder" href={`/education/${folder.id}`}>
      <span className="folder-thumb">
        <FolderArt index={index} />
      </span>
      <span className="folder-body">
        <span className="folder-title">{title}</span>
        <span className="folder-meta">
          {countLabel(folder.article_count, 'nounEdu', 'nounEduPlural')}
        </span>
        {desc && <span className="folder-desc">{desc}</span>}
      </span>
      <span className="go" aria-hidden="true">
        {ARROW}
      </span>
    </Link>
  );
}
