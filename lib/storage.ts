import { del } from '@vercel/blob';

/* Files are uploaded by the browser straight to blob storage - see
   app/api/upload/route.ts, which issues the token, and lib/upload-client.ts,
   which does the sending. Nothing here uploads; this is only for recognising
   and removing what is already stored. */

/** True when a URL points at this site's own blob storage.
 *  Everything saved to the database is checked against this, so a stray or
 *  hostile URL cannot be stored as if it were an uploaded file. */
export function isOurBlobUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === 'https:' && hostname.endsWith('.public.blob.vercel-storage.com');
  } catch {
    return false;
  }
}

/** Removes a file we previously stored. Ignores URLs from anywhere else,
 *  and never fails the surrounding operation. */
export async function deleteFile(url: string): Promise<void> {
  if (!isOurBlobUrl(url)) return;
  try {
    await del(url);
  } catch {
    // The row is gone either way; a stray blob is not worth failing over.
  }
}
