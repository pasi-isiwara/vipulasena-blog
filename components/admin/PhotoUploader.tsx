'use client';

import { useEffect, useRef } from 'react';
import { addPhotos } from '@/app/admin/actions';
import { prepareImage, PHOTO_MAX } from '@/lib/resize';
import { uploadToBlob } from '@/lib/upload-client';

/** Opens the file picker as soon as it mounts, shrinks each picture in the
 *  browser, sends it straight to blob storage, and records the lot in one go.
 *
 *  The files never pass through a server action: that route caps the request
 *  body at 1 MB, which two photos would exceed. */
export function PhotoUploader({
  albumId,
  onProgress,
  onDone,
  onError,
  onCancelled,
}: {
  albumId: string;
  onProgress: (text: string) => void;
  onDone: (message: string) => void;
  onError: (message: string) => void;
  onCancelled: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);

  useEffect(() => {
    inputRef.current?.click();

    // Closing the file dialog without choosing anything fires no change event.
    // The window regaining focus is the only reliable signal, so use it to
    // clear this uploader and let the admin click "Upload photos" again.
    function onFocus() {
      setTimeout(() => {
        if (!started.current) onCancelled();
      }, 300);
    }
    window.addEventListener('focus', onFocus, { once: true });
    return () => window.removeEventListener('focus', onFocus);
  }, [onCancelled]);

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (started.current) return;
    started.current = true;

    const files = Array.from(event.target.files ?? []).filter((f) =>
      f.type.startsWith('image/'),
    );
    if (!files.length) {
      onError('No images were chosen.');
      return;
    }

    const uploaded: { url: string; ratio: number }[] = [];
    try {
      for (const [i, file] of files.entries()) {
        onProgress(`Uploading photo ${i + 1} of ${files.length}…`);
        const prepared = await prepareImage(file, PHOTO_MAX);
        const url = await uploadToBlob(prepared.file, 'photos', albumId);
        uploaded.push({ url, ratio: Math.round(prepared.ratio * 1000) / 1000 });
      }

      onProgress('Saving…');
      const result = await addPhotos({ album_id: albumId, photos: uploaded });
      if (result.ok) {
        onDone(files.length === 1 ? '1 photo added.' : `${files.length} photos added.`);
      } else {
        onError(result.error);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'The photos could not be uploaded.';
      // Some may already be up; say so rather than implying nothing happened.
      onError(
        uploaded.length
          ? `${message} ${uploaded.length} of ${files.length} had been uploaded and were not saved.`
          : message,
      );
    }
  }

  return (
    <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={onChange} />
  );
}
