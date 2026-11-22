'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePrefs, pick } from '@/lib/prefs';
import type { Key } from '@/lib/i18n';
import type { Article, Folder, Section } from '@/lib/types';
import { FolderCard } from './FolderCard';
import { ArticleThumb } from './ArticleThumb';
import { useToast } from './Toast';
import { EducationArt } from './art/EducationArt';
import { GeneralArt } from './art/GeneralArt';
import { KidsArt } from './art/KidsArt';

const ARROW = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const BACK = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
);

const SEARCH = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>
);

type Copy = {
  className: string;
  art: React.ReactNode;
  title: Key;
  lead: Key;
  search: Key;
  type: Key;
  noun: Key;
  nounPlural: Key;
};

const COPY: Record<Section, Copy> = {
  education: {
    className: 'topic--edu',
    art: <EducationArt />,
    title: 'navEdu',
    lead: 'eduDesc',
    search: 'searchEdu',
    type: 'typeEdu',
    noun: 'nounEdu',
    nounPlural: 'nounEduPlural',
  },
  general: {
    className: 'topic--acad',
    art: <GeneralArt />,
    title: 'navGeneral',
    lead: 'generalDesc',
    search: 'searchGeneral',
    type: 'typeGeneral',
    noun: 'nounGeneral',
    nounPlural: 'nounGeneralPlural',
  },
  kids: {
    className: 'topic--kids',
    art: <KidsArt />,
    title: 'navKids',
    lead: 'kidsDesc',
    search: 'searchKids',
    type: 'typeKids',
    noun: 'nounKids',
    nounPlural: 'nounKidsPlural',
  },
};

export function TopicPage({
  section,
  articles,
  folders = [],
}: {
  section: Section;
  /** Every published article in the section, those inside folders included,
   *  so the search can reach them. */
  articles: Article[];
  folders?: Folder[];
}) {
  const { t, lang, countLabel } = usePrefs();
  const [query, setQuery] = useState('');
  const toast = useToast();
  const copy = COPY[section];
  const needle = query.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!needle) return articles;
    return articles.filter((a) => {
      const haystack = [
        pick(lang, a.title_en, a.title_si),
        pick(lang, a.desc_en, a.desc_si),
        a.title_en,
        a.desc_en,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [articles, needle, lang]);

  /* Folders are a way of browsing, not of filtering. While something is typed
     in the search box they get out of the way and every match is listed flat,
     wherever it happens to be filed. */
  const searching = needle.length > 0;
  const showFolders = folders.length > 0 && !searching;
  const listed = searching ? matches : articles.filter((a) => !a.folder_id);

  const searchLabel = t(copy.search);

  return (
    <div className={`topic-view ${copy.className}`}>
      <section className="topic-hero">
        {copy.art}
        <div className="wrap topic-hero-inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">{t('navHome')}</Link>
            <span aria-hidden="true">/</span>
            <span>{t(copy.title)}</span>
          </nav>
          <h1>{t(copy.title)}</h1>
          <p className="topic-lead">{t(copy.lead)}</p>
          <p className="topic-count">
            {countLabel(articles.length, copy.noun, copy.nounPlural)}
            {folders.length > 0 && (
              <>
                {' · '}
                {countLabel(folders.length, 'folderNoun', 'folderNounPlural')}
              </>
            )}
          </p>
        </div>
      </section>

      <section className="wrap topic-body">
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

        {showFolders && (
          <>
            <h2 className="group-head">{t('inFolders')}</h2>
            <ol className="folder-grid">
              {folders.map((folder, i) => (
                <li key={folder.id}>
                  <FolderCard folder={folder} index={i} />
                </li>
              ))}
            </ol>
          </>
        )}

        {showFolders && listed.length > 0 && (
          <h2 className="group-head">{t('looseArticles')}</h2>
        )}

        <ol className="article-list">
          {listed.map((article) => (
            <li key={article.id}>
              <ArticleLink
                article={article}
                section={section}
                index={articles.indexOf(article)}
                typeLabel={t(copy.type)}
                onNoDocument={() => toast.show(t('soon'))}
              />
            </li>
          ))}
        </ol>

        {listed.length === 0 && !showFolders && (
          <p className="list-empty">{t(articles.length === 0 ? 'none' : 'noMatch')}</p>
        )}
        {listed.length === 0 && showFolders && searching && (
          <p className="list-empty">{t('noMatch')}</p>
        )}

        <Link className="back-home" href="/">
          {BACK}
          <span>{t('backHome')}</span>
        </Link>
      </section>

      {toast.node}
    </div>
  );
}

export function ArticleLink({
  article,
  section,
  index,
  typeLabel,
  onNoDocument,
}: {
  article: Article;
  section: Section;
  index: number;
  typeLabel: string;
  onNoDocument: () => void;
}) {
  const { lang } = usePrefs();
  const title = pick(lang, article.title_en, article.title_si);
  const desc = pick(lang, article.desc_en, article.desc_si);
  const doc = article.doc_url;

  const inner = (
    <>
      <span className="article-thumb">
        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.image_url} alt="" loading="lazy" />
        ) : (
          <ArticleThumb section={section} index={index} />
        )}
      </span>
      <span className="article-body">
        <span className="article-type">{typeLabel}</span>
        <span className="article-title">{title}</span>
        <span className="article-desc">{desc}</span>
      </span>
      <span className="go" aria-hidden="true">
        {ARROW}
      </span>
    </>
  );

  if (doc) {
    return (
      <a className="article" href={doc} target="_blank" rel="noopener">
        {inner}
      </a>
    );
  }
  return (
    <a
      className="article"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onNoDocument();
      }}
    >
      {inner}
    </a>
  );
}
