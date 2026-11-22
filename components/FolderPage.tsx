'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePrefs, pick } from '@/lib/prefs';
import type { Article, Folder } from '@/lib/types';
import { ArticleLink } from './TopicPage';
import { useToast } from './Toast';
import { EducationArt } from './art/EducationArt';

const BACK = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
);

const SEARCH = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>
);

/** One folder inside Education: the same page furniture as the section itself,
 *  with the folder's name in place of the section's. */
export function FolderPage({ folder, articles }: { folder: Folder; articles: Article[] }) {
  const { t, lang, countLabel } = usePrefs();
  const [query, setQuery] = useState('');
  const toast = useToast();

  const title = pick(lang, folder.title_en, folder.title_si);
  const desc = pick(lang, folder.desc_en, folder.desc_si);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return articles;
    return articles.filter((a) =>
      [pick(lang, a.title_en, a.title_si), pick(lang, a.desc_en, a.desc_si), a.title_en, a.desc_en]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    );
  }, [articles, query, lang]);

  const searchLabel = `${t('searchEdu')}: ${title}`;

  return (
    <div className="topic-view topic--edu">
      <section className="topic-hero">
        <EducationArt />
        <div className="wrap topic-hero-inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">{t('navHome')}</Link>
            <span aria-hidden="true">/</span>
            <Link href="/education">{t('navEdu')}</Link>
            <span aria-hidden="true">/</span>
            <span>{title}</span>
          </nav>
          <h1>{title}</h1>
          {desc && <p className="topic-lead">{desc}</p>}
          <p className="topic-count">
            {countLabel(articles.length, 'nounEdu', 'nounEduPlural')}
          </p>
        </div>
      </section>

      <section className="wrap topic-body">
        {articles.length > 0 && (
          <div className="topic-tools">
            <label className="search">
              {SEARCH}
              <input
                type="search"
                value={query}
                placeholder={searchLabel}
                aria-label={searchLabel}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
        )}

        <ol className="article-list">
          {shown.map((article) => (
            <li key={article.id}>
              <ArticleLink
                article={article}
                section="education"
                index={articles.indexOf(article)}
                typeLabel={t('typeEdu')}
                onNoDocument={() => toast.show(t('soon'))}
              />
            </li>
          ))}
        </ol>

        {shown.length === 0 && (
          <p className="list-empty">
            {t(articles.length === 0 ? 'folderEmpty' : 'noMatch')}
          </p>
        )}

        <Link className="back-home" href="/education">
          {BACK}
          <span>{`${t('allOf')} ${t('navEdu')}`}</span>
        </Link>
      </section>

      {toast.node}
    </div>
  );
}
