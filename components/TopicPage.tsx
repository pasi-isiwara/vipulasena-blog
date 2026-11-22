'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePrefs, pick } from '@/lib/prefs';
import type { Key } from '@/lib/i18n';
import type { Article, Section } from '@/lib/types';
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
}: {
  section: Section;
  articles: Article[];
}) {
  const { t, lang, countLabel } = usePrefs();
  const [query, setQuery] = useState('');
  const toast = useToast();
  const copy = COPY[section];

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
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
  }, [articles, query, lang]);

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

        <ol className="article-list">
          {shown.map((article) => (
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

        {shown.length === 0 && (
          <p className="list-empty">{t(articles.length === 0 ? 'none' : 'noMatch')}</p>
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

function ArticleLink({
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
