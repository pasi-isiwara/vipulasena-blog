import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { currentAdmin } from '@/lib/auth';

/** Issues short-lived upload tokens so the browser can send a file straight to
 *  blob storage.
 *
 *  Files used to travel through a server action, but a server action's request
 *  body is capped at 1 MB by Next.js and at 4.5 MB by Vercel, which a scanned
 *  PDF passes easily. Going browser-to-storage has no such ceiling, and the
 *  bytes no longer make a detour through the server.
 *
 *  A token is only ever issued to a signed-in admin. Without that check this
 *  route would let anyone upload anything to the site's storage. */

/* Documents get a far larger allowance than pictures: a scanned article or
   book runs to tens of megabytes, while photos are resized in the browser to
   2000px before they are sent and rarely pass a megabyte. */
export const MAX_DOCUMENT_BYTES = 100 * 1024 * 1024; // 100 MB
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024; // 20 MB

const IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
];

/** The only folders an upload may be addressed to. */
const ALLOWED_FOLDER = /^(articles|documents|photos)\/[^/]/;

export async function POST(request: Request): Promise<NextResponse> {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: 'Malformed request.' }, { status: 400 });
  }

  /* Two different callers reach this route: an admin's browser asking for a
     token, and Vercel reporting an upload finished. Only the first is a person,
     and only it is checked for a session. */
  if (body?.type === 'blob.generate-client-token') {
    const admin = await currentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'You are not signed in as an admin.' },
        { status: 401 },
      );
    }

    const pathname = String(body.payload?.pathname ?? '');
    if (!ALLOWED_FOLDER.test(pathname) || pathname.includes('..')) {
      return NextResponse.json(
        { error: 'That upload location is not allowed.' },
        { status: 400 },
      );
    }
  }

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const isDocument = pathname.startsWith('documents/');
        return {
          allowedContentTypes: isDocument ? ['application/pdf'] : IMAGE_TYPES,
          maximumSizeInBytes: isDocument ? MAX_DOCUMENT_BYTES : MAX_IMAGE_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        /* Nothing to do. The admin screen writes the row itself once the
           upload resolves, so the site does not depend on this callback -
           which is just as well, since Vercel cannot reach localhost during
           development and it never fires there. */
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The upload could not be started.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
