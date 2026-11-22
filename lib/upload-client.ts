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
    // The message from Blob is often a bare "Failed to fetch"; say something useful.
    const detail = error instanceof Error ? error.message : '';
    if (/token|unauthor|signed in/i.test(detail)) {
      throw new Error('Your session has expired. Please sign in again.');
    }
    if (/exceed|size|large/i.test(detail)) {
      throw new Error(
        folder === 'documents'
          ? 'That document is too large. Documents can be up to 100 MB.'
          : 'That image is too large. Images can be up to 20 MB.',
      );
    }
    if (/content.?type|not allowed/i.test(detail)) {
      throw new Error('That type of file can’t be uploaded.');
    }
    throw new Error(
      detail
        ? `The file could not be uploaded: ${detail}`
        : 'The file could not be uploaded. Please check your connection and try again.',
    );
  }
}
