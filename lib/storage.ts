import { put, del } from '@vercel/blob';

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB, the same limit the prototype used

const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
  'application/pdf',
]);

/** Puts one uploaded file in blob storage and returns its public URL.
 *  Images are resized in the browser before they get here, so this only
 *  checks the type and size. */
export async function uploadFile(file: File, prefix: string): Promise<string> {
  if (!ALLOWED.has(file.type)) {
    throw new Error('That type of file can’t be uploaded.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('That file is too large. Files can be up to 20 MB.');
  }
  const safeName = file.name.replace(/[^\w.-]+/g, '-').slice(-60) || 'file';
  const { url } = await put(`${prefix}/${Date.now()}-${safeName}`, file, {
    access: 'public',
    addRandomSuffix: true,
    contentType: file.type,
  });
  return url;
}

/** Removes a file we previously stored. Ignores URLs from anywhere else,
 *  and never fails the surrounding operation. */
export async function deleteFile(url: string): Promise<void> {
  if (!url || !url.includes('.blob.vercel-storage.com')) return;
  try {
    await del(url);
  } catch {
    // The row is gone either way; a stray blob is not worth failing over.
  }
}
