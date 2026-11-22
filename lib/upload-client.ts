'use client';

import { upload } from '@vercel/blob/client';

/** Files above this go up in parts rather than one request. */
const MULTIPART_FROM = 5 * 1024 * 1024; // 5 MB

/** Sends one file from the browser straight to blob storage and returns the
 *  URL it now lives at. The token comes from /api/upload, which only issues
 *  one to a signed-in admin. */
export async function uploadToBlob(
  file: File,
  folder: 'articles' | 'documents' | 'photos',
  albumId?: string,
): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]+/g, '-').slice(-60) || 'file';
  const pathname = albumId ? `${folder}/${albumId}/${safeName}` : `${folder}/${safeName}`;

  try {
    const result = await upload(pathname, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
      contentType: file.type,
      // Anything sizeable goes up in parts, so a dropped connection costs one
      // part rather than the whole file. Scanned PDFs are the usual case.
      multipart: file.size > MULTIPART_FROM,
    });
    return result.url;
  } catch (error) {
    const detail = error instanceof Error ? error.message : '';

    /* Only the messages this site writes itself are reworded. Anything from
       Blob is passed through as it came: guessing at what a message means
       turns a storage problem into "your session has expired", which sends
       whoever hit it to sign in over and over while the real cause sits
       untouched. */
    if (detail.includes('not signed in as an admin')) {
      throw new Error('Your session has expired. Please sign in again.');
    }
    if (detail.includes('upload location is not allowed')) {
      throw new Error('That file could not be uploaded to this part of the site.');
    }

    if (!detail) {
      throw new Error(
        'The file could not be uploaded. Please check your connection and try again.',
      );
    }
    throw new Error(`The file could not be uploaded. ${detail}`);
  }
}
