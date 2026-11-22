'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { uploadFile, deleteFile } from '@/lib/storage';
import { SECTION_PATH, type Section } from '@/lib/types';

/* Every action here starts with requireAdmin(), so a request that is not from a
   signed-in admin fails before it touches the database. */

export type Result = { ok: true; id?: string } | { ok: false; error: string };

function fail(error: unknown): Result {
  const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
  return { ok: false, error: message };
}

const SECTIONS = ['education', 'general', 'kids'] as const;

function refreshPublicPages(section?: Section) {
  revalidatePath('/');
  revalidatePath('/media');
  if (section) revalidatePath('/' + SECTION_PATH[section]);
  else for (const s of SECTIONS) revalidatePath('/' + SECTION_PATH[s]);
  revalidatePath('/admin');
}

/* ---------- Articles ---------- */

const ArticleInput = z.object({
  id: z.string().uuid().optional(),
  section: z.enum(SECTIONS),
  title_en: z.string().trim().min(1, 'Please enter an English title.').max(160),
  desc_en: z.string().trim().max(500).default(''),
  title_si: z.string().trim().max(160).default(''),
  desc_si: z.string().trim().max(500).default(''),
  doc_link: z.string().trim().default(''),
  published: z.boolean().default(true),
});

/** https links only: a document link is opened in a new tab, so anything else
 *  (javascript:, data:) must never get through. */
function safeLink(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    throw new Error('The document link must start with https://');
  }
  return trimmed;
}

async function nextOrder(table: 'articles' | 'albums', section?: Section): Promise<number> {
  const rows =
    table === 'articles'
      ? ((await sql`select coalesce(max(sort_order), 0) + 1 as n from articles where section = ${section!}`) as { n: number }[])
      : ((await sql`select coalesce(max(sort_order), 0) + 1 as n from albums`) as { n: number }[]);
  return rows[0]?.n ?? 1;
}

export async function saveArticle(form: FormData): Promise<Result> {
  try {
    await requireAdmin();
    const parsed = ArticleInput.parse({
      id: (form.get('id') as string) || undefined,
      section: form.get('section'),
      title_en: form.get('title_en') ?? '',
      desc_en: form.get('desc_en') ?? '',
      title_si: form.get('title_si') ?? '',
      desc_si: form.get('desc_si') ?? '',
      doc_link: form.get('doc_link') ?? '',
      published: form.get('published') === 'on',
    });

    const image = form.get('image');
    const docFile = form.get('docfile');
    const clearImage = form.get('clear_image') === '1';
    const clearDoc = form.get('clear_doc') === '1';

    let imageUrl: string | null = null;
    if (image instanceof File && image.size > 0) {
      imageUrl = await uploadFile(image, 'articles');
    }

    let docUrl: string | null = null;
    if (docFile instanceof File && docFile.size > 0) {
      if (docFile.type !== 'application/pdf') {
        throw new Error('Please choose a PDF file for the document.');
      }
      docUrl = await uploadFile(docFile, 'documents');
    } else if (parsed.doc_link) {
      docUrl = safeLink(parsed.doc_link);
    }

    if (parsed.id) {
      const existing = (await sql`
        select image_url, doc_url, section from articles where id = ${parsed.id}
      `) as { image_url: string; doc_url: string; section: Section }[];
      const before = existing[0];
      if (!before) throw new Error('That article no longer exists.');

      const finalImage = clearImage ? '' : (imageUrl ?? before.image_url);
      const finalDoc = clearDoc ? '' : (docUrl ?? before.doc_url);

      // Moving an article to another section puts it at the end of that list
      const order =
        before.section === parsed.section
          ? null
          : await nextOrder('articles', parsed.section);

      await sql`
        update articles set
          section = ${parsed.section},
          title_en = ${parsed.title_en}, desc_en = ${parsed.desc_en},
          title_si = ${parsed.title_si}, desc_si = ${parsed.desc_si},
          image_url = ${finalImage}, doc_url = ${finalDoc},
          published = ${parsed.published},
          sort_order = coalesce(${order}, sort_order)
        where id = ${parsed.id}
      `;

      // Only remove the old file once the row no longer points at it
      if (before.image_url && before.image_url !== finalImage) await deleteFile(before.image_url);
      if (before.doc_url && before.doc_url !== finalDoc) await deleteFile(before.doc_url);
      refreshPublicPages(before.section);
      if (before.section !== parsed.section) refreshPublicPages(parsed.section);
    } else {
      const order = await nextOrder('articles', parsed.section);
      await sql`
        insert into articles
          (section, title_en, desc_en, title_si, desc_si, image_url, doc_url, published, sort_order)
        values
          (${parsed.section}, ${parsed.title_en}, ${parsed.desc_en}, ${parsed.title_si},
           ${parsed.desc_si}, ${imageUrl ?? ''}, ${docUrl ?? ''}, ${parsed.published}, ${order})
      `;
      refreshPublicPages(parsed.section);
    }
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteArticle(id: string): Promise<Result> {
  try {
    await requireAdmin();
    const rows = (await sql`
      delete from articles where id = ${id}
      returning image_url, doc_url, section
    `) as { image_url: string; doc_url: string; section: Section }[];
    const gone = rows[0];
    if (gone) {
      await deleteFile(gone.image_url);
      await deleteFile(gone.doc_url);
      refreshPublicPages(gone.section);
    }
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

/* ---------- Albums ---------- */

const AlbumInput = z.object({
  id: z.string().trim().max(60).optional(),
  title_en: z.string().trim().min(1, 'Please enter an English album name.').max(160),
  desc_en: z.string().trim().max(500).default(''),
  title_si: z.string().trim().max(160).default(''),
  desc_si: z.string().trim().max(500).default(''),
});

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export async function saveAlbum(form: FormData): Promise<Result> {
  try {
    await requireAdmin();
    const parsed = AlbumInput.parse({
      id: (form.get('id') as string) || undefined,
      title_en: form.get('title_en') ?? '',
      desc_en: form.get('desc_en') ?? '',
      title_si: form.get('title_si') ?? '',
      desc_si: form.get('desc_si') ?? '',
    });

    if (parsed.id) {
      await sql`
        update albums set
          title_en = ${parsed.title_en}, desc_en = ${parsed.desc_en},
          title_si = ${parsed.title_si}, desc_si = ${parsed.desc_si}
        where id = ${parsed.id}
      `;
    } else {
      let id = slug(parsed.title_en) || 'album';
      const clash = (await sql`select 1 from albums where id = ${id}`) as unknown[];
      if (clash.length) id = `${id}-${Date.now().toString(36)}`;
      const order = await nextOrder('albums');
      await sql`
        insert into albums (id, title_en, desc_en, title_si, desc_si, sort_order)
        values (${id}, ${parsed.title_en}, ${parsed.desc_en}, ${parsed.title_si},
                ${parsed.desc_si}, ${order})
      `;
      refreshPublicPages();
      // The id is returned so the admin can open the new album and add photos.
      return { ok: true, id };
    }
    refreshPublicPages();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteAlbum(id: string): Promise<Result> {
  try {
    await requireAdmin();
    // Photos go with the album; collect their files before the cascade removes the rows.
    const photos = (await sql`select image_url from photos where album_id = ${id}`) as {
      image_url: string;
    }[];
    await sql`delete from albums where id = ${id}`;
    for (const photo of photos) await deleteFile(photo.image_url);
    revalidatePath(`/media/${id}`);
    refreshPublicPages();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

/* ---------- Photos ---------- */

export async function addPhotos(form: FormData): Promise<Result> {
  try {
    await requireAdmin();
    const albumId = String(form.get('album_id') ?? '');
    if (!albumId) throw new Error('No album was chosen.');

    const files = form.getAll('photos').filter((f): f is File => f instanceof File && f.size > 0);
    if (!files.length) throw new Error('Please choose at least one image.');

    const ratios = form.getAll('ratios').map((r) => Number(r));
    const rows = (await sql`
      select coalesce(max(sort_order), 0) as n from photos where album_id = ${albumId}
    `) as { n: number }[];
    let order = (rows[0]?.n ?? 0) + 1;

    for (const [i, file] of files.entries()) {
      const url = await uploadFile(file, `photos/${albumId}`);
      const ratio = Number.isFinite(ratios[i]) && ratios[i] > 0 ? ratios[i] : 4 / 3;
      await sql`
        insert into photos (album_id, image_url, ratio, sort_order)
        values (${albumId}, ${url}, ${ratio}, ${order++})
      `;
    }
    revalidatePath(`/media/${albumId}`);
    refreshPublicPages();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function savePhotoCaption(form: FormData): Promise<Result> {
  try {
    await requireAdmin();
    const id = String(form.get('id') ?? '');
    const captionEn = String(form.get('caption_en') ?? '').trim().slice(0, 200);
    const captionSi = String(form.get('caption_si') ?? '').trim().slice(0, 200);
    const rows = (await sql`
      update photos set caption_en = ${captionEn}, caption_si = ${captionSi}
      where id = ${id} returning album_id
    `) as { album_id: string }[];
    if (rows[0]) revalidatePath(`/media/${rows[0].album_id}`);
    revalidatePath('/admin');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deletePhoto(id: string): Promise<Result> {
  try {
    await requireAdmin();
    const rows = (await sql`
      delete from photos where id = ${id} returning image_url, album_id
    `) as { image_url: string; album_id: string }[];
    if (rows[0]) {
      await deleteFile(rows[0].image_url);
      revalidatePath(`/media/${rows[0].album_id}`);
    }
    refreshPublicPages();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

/* ---------- Ordering ---------- */

type Reorderable = 'articles' | 'albums' | 'photos';

/** Swaps one row with its neighbour, the way the up and down arrows did in the
 *  prototype. Ties on sort_order are broken by created_at, so the swap uses the
 *  list as it is actually displayed. */
export async function reorder(
  table: Reorderable,
  id: string,
  direction: -1 | 1,
): Promise<Result> {
  try {
    await requireAdmin();

    let siblings: { id: string; sort_order: number }[];
    if (table === 'articles') {
      const owner = (await sql`select section from articles where id = ${id}`) as {
        section: string;
      }[];
      if (!owner[0]) throw new Error('That article no longer exists.');
      siblings = (await sql`
        select id, sort_order from articles where section = ${owner[0].section}
        order by sort_order, created_at
      `) as { id: string; sort_order: number }[];
    } else if (table === 'albums') {
      siblings = (await sql`
        select id, sort_order from albums order by sort_order, created_at
      `) as { id: string; sort_order: number }[];
    } else {
      const owner = (await sql`select album_id from photos where id = ${id}`) as {
        album_id: string;
      }[];
      if (!owner[0]) throw new Error('That photo no longer exists.');
      siblings = (await sql`
        select id, sort_order from photos where album_id = ${owner[0].album_id}
        order by sort_order, created_at
      `) as { id: string; sort_order: number }[];
    }

    const at = siblings.findIndex((row) => String(row.id) === String(id));
    const to = at + direction;
    if (at < 0 || to < 0 || to >= siblings.length) return { ok: true };

    const a = siblings[at];
    const b = siblings[to];
    // Equal sort_order values would leave the list unchanged, so nudge one.
    const orderA = a.sort_order === b.sort_order ? b.sort_order + direction : b.sort_order;

    if (table === 'articles') {
      await sql`update articles set sort_order = ${orderA} where id = ${a.id}`;
      await sql`update articles set sort_order = ${a.sort_order} where id = ${b.id}`;
    } else if (table === 'albums') {
      await sql`update albums set sort_order = ${orderA} where id = ${a.id}`;
      await sql`update albums set sort_order = ${a.sort_order} where id = ${b.id}`;
    } else {
      await sql`update photos set sort_order = ${orderA} where id = ${a.id}`;
      await sql`update photos set sort_order = ${a.sort_order} where id = ${b.id}`;
    }

    refreshPublicPages();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

/* ---------- Questions ---------- */

export async function setQuestionAnswered(id: string, answered: boolean): Promise<Result> {
  try {
    await requireAdmin();
    await sql`update questions set answered = ${answered} where id = ${id}`;
    revalidatePath('/admin');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteQuestion(id: string): Promise<Result> {
  try {
    await requireAdmin();
    await sql`delete from questions where id = ${id}`;
    revalidatePath('/admin');
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}
