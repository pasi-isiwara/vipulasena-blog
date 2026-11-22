'use client';

import { useCallback, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import type { Album, Article, Folder, Photo, Question, Section, VisitTotals } from '@/lib/types';
import { SECTIONS_WITH_FOLDERS } from '@/lib/types';
import {
  deleteArticle,
  deleteAlbum,
  deleteFolder,
  deletePhoto,
  deleteQuestion,
  reorder,
  setQuestionAnswered,
  type Result,
} from '@/app/admin/actions';
import { ConfirmButton } from './ConfirmButton';
import { ArticleForm } from './ArticleForm';
import { FolderForm } from './FolderForm';
import { AlbumForm } from './AlbumForm';
import { PhotoCaptionForm } from './PhotoCaptionForm';
import { PhotoUploader } from './PhotoUploader';
import { IconUp, IconDown, IconLeft, IconDoc, IconPhoto, IconFolder, NAV_ICONS } from './icons';

const SECTION_NAMES: Record<Section, string> = {
  education: 'Education',
  general: 'General thoughts',
  kids: 'Children’s books',
};
const SECTION_PAGES: Record<Section, string> = {
  education: '/education',
  general: '/general-thoughts',
  kids: '/childrens-books',
};

type Tab = 'overview' | Section | 'media' | 'questions';

type Status = { text: string; tone: '' | 'ok' | 'err' };

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '';
  }
}

export function AdminApp({
  admin,
  articles,
  folders,
  albums,
  photos,
  questions,
  totals,
}: {
  admin: string;
  articles: Article[];
  folders: Folder[];
  albums: Album[];
  photos: Photo[];
  questions: Question[];
  totals: VisitTotals;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [openAlbum, setOpenAlbum] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ text: '', tone: '' });
  const [, startTransition] = useTransition();
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Which form the side panel is showing, if any
  const [editing, setEditing] = useState<
    | { kind: 'article'; article: Article | null; section: Section }
    | { kind: 'folder'; folder: Folder | null; section: Section }
    | { kind: 'album'; album: Album | null }
    | { kind: 'caption'; photo: Photo }
    | null
  >(null);
  const [uploadTo, setUploadTo] = useState<string | null>(null);

  const say = useCallback((text: string, tone: Status['tone'] = '', stay = false) => {
    setStatus({ text, tone });
    if (statusTimer.current) clearTimeout(statusTimer.current);
    if (!stay) statusTimer.current = setTimeout(() => setStatus({ text: '', tone: '' }), 3200);
  }, []);

  /** Runs one server action, reports what happened and reloads the data. */
  const run = useCallback(
    async (action: () => Promise<Result>, done: string) => {
      say('Saving…', '', true);
      const result = await action();
      if (result.ok) {
        say(done, 'ok');
        startTransition(() => router.refresh());
      } else {
        say(result.error, 'err');
      }
      return result;
    },
    [router, say],
  );

  const articlesOf = (section: Section) => articles.filter((a) => a.section === section);
  const photosIn = (albumId: string) => photos.filter((p) => p.album_id === albumId);
  const openQuestions = questions.filter((q) => !q.answered).length;

  function go(next: Tab) {
    setTab(next);
    setOpenAlbum(null);
    window.scrollTo(0, 0);
  }

  const moveButtons = (
    table: 'articles' | 'albums' | 'photos' | 'folders',
    id: string,
    i: number,
    n: number,
  ) => (
    <>
      <button
        type="button"
        className="adm-icon"
        aria-label="Move up"
        disabled={i === 0}
        onClick={() => run(() => reorder(table, id, -1), 'Order updated.')}
      >
        {IconUp}
      </button>
      <button
        type="button"
        className="adm-icon"
        aria-label="Move down"
        disabled={i === n - 1}
        onClick={() => run(() => reorder(table, id, 1), 'Order updated.')}
      >
        {IconDown}
      </button>
    </>
  );

  const currentAlbum = openAlbum ? albums.find((a) => a.id === openAlbum) : null;
  const sectionArticles =
    tab === 'education' || tab === 'general' || tab === 'kids' ? articlesOf(tab) : [];
  const sectionFolders =
    tab === 'education' || tab === 'general' || tab === 'kids'
      ? folders.filter((f) => f.section === tab)
      : [];
  const sectionHasFolders =
    tab === 'education' || tab === 'general' || tab === 'kids'
      ? SECTIONS_WITH_FOLDERS.includes(tab)
      : false;
  const folderName = (id: string | null) =>
    id ? (folders.find((f) => f.id === id)?.title_en ?? null) : null;
  const albumPhotos = currentAlbum ? photosIn(currentAlbum.id) : [];

  return (
    <div className="topic-view admin-view">
      <div className="admin-body">
        <aside className="admin-side">
          <div className="admin-brand">
            <span className="monogram" aria-hidden="true">VP</span>
            <span>
              <strong>Site admin</strong>
              <small>Vipulasena Pathirajage</small>
            </span>
          </div>
          <nav className="admin-nav" aria-label="Admin sections">
            <NavButton tab="overview" current={tab} onClick={go} icon={NAV_ICONS.overview} label="Overview" />
            <NavButton tab="education" current={tab} onClick={go} icon={NAV_ICONS.education} label="Education" />
            <NavButton tab="general" current={tab} onClick={go} icon={NAV_ICONS.general} label="General thoughts" />
            <NavButton tab="kids" current={tab} onClick={go} icon={NAV_ICONS.kids} label="Children’s books" />
            <NavButton tab="media" current={tab} onClick={go} icon={NAV_ICONS.media} label="Media" />
            <NavButton
              tab="questions"
              current={tab}
              onClick={go}
              icon={NAV_ICONS.questions}
              label="Questions"
              badge={openQuestions ? String(openQuestions) : ''}
            />
          </nav>
          <Link className="admin-viewsite" href="/">
            {IconLeft}
            View the website
          </Link>
          <button type="button" className="admin-signout" onClick={() => signOut({ redirectTo: '/' })}>
            Sign out
            <span className="admin-who">{admin}</span>
          </button>
        </aside>

        <section className="admin-content">
          {tab === 'overview' && (
            <>
              <Head
                title="Overview"
                text="Everything you change here appears on the website straight away."
              />
              <div className="adm-stats">
                <Stat n={totals.visitors} label="Visitors" />
                <Stat n={totals.page_visits} label="Page visits" />
                <Stat n={articles.filter((a) => a.published).length} label="Articles on the website" />
                <Stat n={albums.length} label="Albums" />
                <Stat n={photos.length} label="Photos" />
                <Stat n={openQuestions} label="New questions" />
              </div>
              <h2 className="adm-h2">Manage the website</h2>
              <div className="adm-cards">
                {(Object.keys(SECTION_NAMES) as Section[]).map((section) => (
                  <div className="adm-card" key={section}>
                    <h3>{SECTION_NAMES[section]}</h3>
                    <p>{plural(articlesOf(section).length, 'article', 'articles')}</p>
                    <div className="adm-card-actions">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setEditing({ kind: 'article', article: null, section })}
                      >
                        Add article
                      </button>
                      <button type="button" className="btn-ghost" onClick={() => go(section)}>
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
                <div className="adm-card">
                  <h3>Media</h3>
                  <p>
                    {plural(albums.length, 'album', 'albums')},{' '}
                    {plural(photos.length, 'photo', 'photos')}
                  </p>
                  <div className="adm-card-actions">
                    <button type="button" className="btn" onClick={() => setEditing({ kind: 'album', album: null })}>
                      Add album
                    </button>
                    <button type="button" className="btn-ghost" onClick={() => go('media')}>
                      Manage
                    </button>
                  </div>
                </div>
                <div className="adm-card">
                  <h3>Questions</h3>
                  <p>{plural(openQuestions, 'new question', 'new questions')}</p>
                  <div className="adm-card-actions">
                    <button type="button" className="btn-ghost" onClick={() => go('questions')}>
                      Read questions
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {(tab === 'education' || tab === 'general' || tab === 'kids') && (
            <>
              <Head
                title={SECTION_NAMES[tab]}
                text={`${plural(sectionArticles.length, 'article', 'articles')}. Use the arrows to set the order on the website.`}
                    actions={
                      <>
                        <Link className="btn-ghost" href={SECTION_PAGES[tab]}>See this page</Link>
                        {sectionHasFolders && (
                          <button
                            type="button"
                            className="btn-ghost"
                            onClick={() => setEditing({ kind: 'folder', folder: null, section: tab })}
                          >
                            Add folder
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn"
                          onClick={() => setEditing({ kind: 'article', article: null, section: tab })}
                        >
                          Add article
                        </button>
                      </>
                    }
                  />
                  {sectionHasFolders && sectionFolders.length > 0 && (
                    <>
                      <h2 className="adm-h2">Folders</h2>
                      <ol className="adm-list">
                        {sectionFolders.map((folder, i) => (
                          <li className="adm-row" key={folder.id}>
                            <span className="adm-thumb">{IconFolder}</span>
                            <span className="adm-row-main">
                              <strong>{folder.title_en}</strong>
                              {folder.title_si && <small lang="si">{folder.title_si}</small>}
                              <span className="adm-tags">
                                <span className="adm-tag">
                                  {plural(folder.article_count, 'article', 'articles')}
                                </span>
                                <span className="adm-tag">/{SECTION_PAGES[tab].slice(1)}/{folder.id}</span>
                              </span>
                            </span>
                            <span className="adm-row-actions">
                              {moveButtons('folders', folder.id, i, sectionFolders.length)}
                              <button
                                type="button"
                                className="btn-ghost"
                                onClick={() => setEditing({ kind: 'folder', folder, section: tab })}
                              >
                                Edit
                              </button>
                              <ConfirmButton
                                label="Delete"
                                onConfirm={() =>
                                  run(() => deleteFolder(folder.id), 'Folder deleted. Its articles are still here.')
                                }
                              />
                            </span>
                          </li>
                        ))}
                      </ol>
                      <h2 className="adm-h2">Articles</h2>
                    </>
                  )}

                  {sectionArticles.length === 0 ? (
                    <p className="adm-empty">No articles yet. Use “Add article” to add the first one.</p>
                  ) : (
                    <ol className="adm-list">
                      {sectionArticles.map((article, i) => (
                        <li className="adm-row" key={article.id}>
                          <span className="adm-thumb">
                            {article.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={article.image_url} alt="" />
                            ) : (
                              IconDoc
                            )}
                          </span>
                          <span className="adm-row-main">
                            <strong>{article.title_en}</strong>
                            {article.title_si && <small lang="si">{article.title_si}</small>}
                            <span className="adm-tags">
                              {!article.published && (
                                <span className="adm-tag warn">Hidden from the website</span>
                              )}
                              <span className="adm-tag">
                                {article.doc_url ? 'Document attached' : 'No document yet'}
                              </span>
                              {!article.title_si && <span className="adm-tag">No Sinhala title</span>}
                              {sectionHasFolders && (
                                <span className="adm-tag">
                                  {folderName(article.folder_id) ?? 'Not in a folder'}
                                </span>
                              )}
                            </span>
                          </span>
                          <span className="adm-row-actions">
                            {moveButtons('articles', article.id, i, sectionArticles.length)}
                            <button
                              type="button"
                              className="btn-ghost"
                              onClick={() => setEditing({ kind: 'article', article, section: tab })}
                            >
                              Edit
                            </button>
                            <ConfirmButton
                              label="Delete"
                              onConfirm={() => run(() => deleteArticle(article.id), 'Article deleted.')}
                            />
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
            </>
          )}

          {tab === 'media' && !currentAlbum && (
            <>
              <Head
                title="Media"
                text={`${plural(albums.length, 'album', 'albums')}. Open an album to add or arrange its photos.`}
                actions={
                  <>
                    <Link className="btn-ghost" href="/media">See this page</Link>
                    <button type="button" className="btn" onClick={() => setEditing({ kind: 'album', album: null })}>
                      Add album
                    </button>
                  </>
                }
              />
              {albums.length === 0 ? (
                <p className="adm-empty">No albums yet. Use “Add album” to create the first one.</p>
              ) : (
                <div className="adm-albums">
                  {albums.map((album, i) => (
                    <article className="adm-album" key={album.id}>
                      <div className="adm-album-cover">
                        {album.cover_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={album.cover_url} alt="" />
                        ) : (
                          IconPhoto
                        )}
                      </div>
                      <div className="adm-album-body">
                        <strong>{album.title_en}</strong>
                        {album.title_si && <small lang="si">{album.title_si}</small>}
                        <small>
                          {album.photo_count
                            ? plural(album.photo_count, 'photo', 'photos')
                            : 'No photos yet'}
                        </small>
                      </div>
                      <div className="adm-album-actions">
                        <button type="button" className="btn" onClick={() => { setOpenAlbum(album.id); window.scrollTo(0, 0); }}>
                          Open
                        </button>
                        <button type="button" className="btn-ghost" onClick={() => setEditing({ kind: 'album', album })}>
                          Edit
                        </button>
                        {moveButtons('albums', album.id, i, albums.length)}
                        <ConfirmButton
                          label="Delete"
                          onConfirm={() => run(() => deleteAlbum(album.id), 'Album deleted.')}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'media' && currentAlbum && (
            <>
                <Head
                  back={
                    <button type="button" className="adm-back" onClick={() => setOpenAlbum(null)}>
                      {IconLeft}All albums
                    </button>
                  }
                  title={currentAlbum.title_en}
                  text={`${plural(albumPhotos.length, 'photo', 'photos')}. The first photo is the album cover.`}
                  actions={
                    <>
                      <Link className="btn-ghost" href={`/media/${currentAlbum.id}`}>See this album</Link>
                      <button type="button" className="btn-ghost" onClick={() => setEditing({ kind: 'album', album: currentAlbum })}>
                        Edit album
                      </button>
                      <button type="button" className="btn" onClick={() => setUploadTo(currentAlbum.id)}>
                        Upload photos
                      </button>
                    </>
                  }
                />
                {albumPhotos.length === 0 ? (
                  <p className="adm-empty">
                    No photos yet. Use “Upload photos” to add some. You can choose several at once.
                  </p>
                ) : (
                  <ol className="adm-photos">
                    {albumPhotos.map((photo, i) => (
                      <li className="adm-photo" key={photo.id}>
                        <div className="adm-photo-img">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photo.image_url} alt="" />
                        </div>
                        <div className="adm-photo-body">
                          {photo.caption_en || <span className="adm-muted">No caption</span>}
                        </div>
                        <div className="adm-photo-actions">
                          {moveButtons('photos', photo.id, i, albumPhotos.length)}
                          <button type="button" className="btn-ghost" onClick={() => setEditing({ kind: 'caption', photo })}>
                            Caption
                          </button>
                          <ConfirmButton
                            label="Delete"
                            onConfirm={() => run(() => deletePhoto(photo.id), 'Photo deleted.')}
                          />
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
            </>
          )}

          {tab === 'questions' && (
            <>
              <Head
                title="Questions"
                text={`${openQuestions} new, ${questions.length - openQuestions} answered. Only you can see these.`}
              />
              {questions.length === 0 ? (
                <p className="adm-empty">
                  No questions yet. Questions sent from the “Ask a question” section appear here.
                </p>
              ) : (
                <ol className="adm-list">
                  {questions.map((q) => (
                    <li className={`adm-q${q.answered ? ' is-answered' : ''}`} key={q.id}>
                      <div className="adm-q-head">
                        <strong>{q.name || 'A reader'}</strong>
                        <span className="adm-muted">{formatDate(q.created_at)}</span>
                        <span className={`adm-tag${q.answered ? '' : ' warn'}`}>
                          {q.answered ? 'Answered' : 'New'}
                        </span>
                      </div>
                      <p className="adm-q-contact">
                        <Contact value={q.contact} />
                      </p>
                      <p className="adm-q-text">{q.question}</p>
                      <div className="adm-row-actions">
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={() =>
                            run(() => setQuestionAnswered(q.id, !q.answered), 'Question updated.')
                          }
                        >
                          {q.answered ? 'Mark as new' : 'Mark as answered'}
                        </button>
                        <ConfirmButton
                          label="Delete"
                          onConfirm={() => run(() => deleteQuestion(q.id), 'Question deleted.')}
                        />
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}
        </section>
      </div>

      {editing?.kind === 'article' && (
        <ArticleForm
          article={editing.article}
          section={editing.section}
          folders={folders}
          onClose={() => setEditing(null)}
          onSaved={(message) => {
            setEditing(null);
            say(message, 'ok');
            startTransition(() => router.refresh());
          }}
        />
      )}

      {editing?.kind === 'folder' && (
        <FolderForm
          folder={editing.folder}
          section={editing.section}
          onClose={() => setEditing(null)}
          onSaved={(message) => {
            setEditing(null);
            say(message, 'ok');
            startTransition(() => router.refresh());
          }}
        />
      )}

      {editing?.kind === 'album' && (
        <AlbumForm
          album={editing.album}
          onClose={() => setEditing(null)}
          onSaved={(message, newAlbumId) => {
            setEditing(null);
            say(message, 'ok');
            if (newAlbumId) {
              setTab('media');
              setOpenAlbum(newAlbumId);
            }
            startTransition(() => router.refresh());
          }}
        />
      )}

      {editing?.kind === 'caption' && (
        <PhotoCaptionForm
          photo={editing.photo}
          onClose={() => setEditing(null)}
          onSaved={(message) => {
            setEditing(null);
            say(message, 'ok');
            startTransition(() => router.refresh());
          }}
        />
      )}

      {uploadTo && (
        <PhotoUploader
          albumId={uploadTo}
          onProgress={(text) => say(text, '', true)}
          onDone={(message) => {
            setUploadTo(null);
            say(message, 'ok');
            startTransition(() => router.refresh());
          }}
          onError={(message) => {
            setUploadTo(null);
            say(message, 'err');
          }}
          onCancelled={() => setUploadTo(null)}
        />
      )}

      <div
        className={`adm-status${status.text ? ' show' : ''}${status.tone ? ' ' + status.tone : ''}`}
        role="status"
        aria-live="polite"
      >
        {status.text}
      </div>
    </div>
  );
}

function NavButton({
  tab,
  current,
  onClick,
  icon,
  label,
  badge,
}: {
  tab: Tab;
  current: Tab;
  onClick: (tab: Tab) => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      aria-current={current === tab ? 'page' : undefined}
      onClick={() => onClick(tab)}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && <span className="adm-badge">{badge}</span>}
    </button>
  );
}

function Head({
  title,
  text,
  actions,
  back,
}: {
  title: string;
  text?: string;
  actions?: React.ReactNode;
  back?: React.ReactNode;
}) {
  return (
    <header className="adm-head">
      <div>
        {back}
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      {actions && <div className="adm-head-actions">{actions}</div>}
    </header>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="adm-stat">
      <b>{n}</b>
      <span>{label}</span>
    </div>
  );
}

/** Shows the contact details as something you can click, when they look like
 *  an email address or a phone number. */
function Contact({ value }: { value: string }) {
  const v = value.trim();
  if (!v) return <span className="adm-muted">No contact details given</span>;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return <a href={`mailto:${v}`}>{v}</a>;
  if (/^\+?[\d\s().-]{7,}$/.test(v)) return <a href={`tel:${v.replace(/[^\d+]/g, '')}`}>{v}</a>;
  return <>{v}</>;
}
