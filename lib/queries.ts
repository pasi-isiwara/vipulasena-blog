import { sql } from './db';
import type { Album, Article, Photo, Question, Section, VisitTotals } from './types';

/* ---------- Public reads: published articles only ---------- */

export async function listArticles(section: Section): Promise<Article[]> {
  return (await sql`
    select id, section, title_en, desc_en, title_si, desc_si,
           image_url, doc_url, published, sort_order
    from articles
    where section = ${section} and published = true
    order by sort_order, created_at
  `) as Article[];
}

export async function listAlbums(): Promise<Album[]> {
  return (await sql`
    select a.id, a.title_en, a.desc_en, a.title_si, a.desc_si, a.sort_order,
           coalesce(p.photo_count, 0)::int as photo_count,
           p.cover_url
    from albums a
    left join lateral (
      select count(*)::int as photo_count,
             (select image_url from photos
               where album_id = a.id order by sort_order, created_at limit 1) as cover_url
      from photos where album_id = a.id
    ) p on true
    order by a.sort_order, a.created_at
  `) as Album[];
}

export async function getAlbum(id: string): Promise<Album | null> {
  const rows = (await sql`
    select a.id, a.title_en, a.desc_en, a.title_si, a.desc_si, a.sort_order,
           (select count(*)::int from photos where album_id = a.id) as photo_count,
           (select image_url from photos where album_id = a.id
             order by sort_order, created_at limit 1) as cover_url
    from albums a
    where a.id = ${id}
  `) as Album[];
  return rows[0] ?? null;
}

export async function listPhotos(albumId: string): Promise<Photo[]> {
  return (await sql`
    select id, album_id, image_url, caption_en, caption_si, ratio, sort_order
    from photos
    where album_id = ${albumId}
    order by sort_order, created_at
  `) as Photo[];
}

export async function getVisitTotals(): Promise<VisitTotals> {
  const rows = (await sql`select visitors::int, page_visits::int from visit_totals`) as VisitTotals[];
  return rows[0] ?? { visitors: 0, page_visits: 0 };
}

export async function recordVisit(visitorId: string, page: string): Promise<void> {
  await sql`insert into visits (visitor_id, page) values (${visitorId}, ${page.slice(0, 120)})`;
}


/* ---------- Admin reads: everything, published or not ---------- */

export async function adminListArticles(): Promise<Article[]> {
  return (await sql`
    select id, section, title_en, desc_en, title_si, desc_si,
           image_url, doc_url, published, sort_order
    from articles
    order by section, sort_order, created_at
  `) as Article[];
}

export async function adminListPhotos(): Promise<Photo[]> {
  return (await sql`
    select id, album_id, image_url, caption_en, caption_si, ratio, sort_order
    from photos
    order by album_id, sort_order, created_at
  `) as Photo[];
}

export async function listQuestions(): Promise<Question[]> {
  return (await sql`
    select id, name, contact, question, language, answered, created_at
    from questions
    order by answered, created_at desc
  `) as Question[];
}

