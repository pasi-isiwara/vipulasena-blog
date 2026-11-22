'use client';

import { useEffect, useRef } from 'react';
import { addPhotos } from '@/app/admin/actions';
import { prepareImage, PHOTO_MAX } from '@/lib/resize';

/** Opens the file picker as soon as it mounts, shrinks each picture in the
 *  browser and sends them in one batch. Several photos can be chosen at once. */
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

    try {
      const data = new FormData();
      data.set('album_id', albumId);
      for (const [i, file] of files.entries()) {
        onProgress(`Preparing photo ${i + 1} of ${files.length}…`);
        const prepared = await prepareImage(file, PHOTO_MAX);
        data.append('photos', prepared.file);
        data.append('ratios', String(Math.round(prepared.ratio * 1000) / 1000));
      }

      onProgress(files.length === 1 ? 'Uploading 1 photo…' : `Uploading ${files.length} photos…`);
      const result = await addPhotos(data);
      if (result.ok) {
        onDone(files.length === 1 ? '1 photo added.' : `${files.length} photos added.`);
      } else {
        onError(result.error);
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'The photos could not be uploaded.');
    }
  }

  return (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      multiple
      hidden
      onChange={onChange}
    />
  );
}
