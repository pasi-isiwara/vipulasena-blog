/** Shrinks a picture in the browser before it is uploaded, so a photo straight
 *  off a phone does not travel at full size. Same limits as the prototype:
 *  photos 2000px, article images 1400px, JPEG quality 0.86. */

export type Prepared = { file: File; ratio: number };

export const PHOTO_MAX = 2000;
export const ARTICLE_IMAGE_MAX = 1400;

export async function prepareImage(file: File, max: number): Promise<Prepared> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  // SVG has no pixel size to shrink, and some browsers cannot decode it here.
  if (file.type === 'image/svg+xml' || typeof createImageBitmap !== 'function') {
    return { file, ratio: 4 / 3 };
  }

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const ratio = width / height;

    if (Math.max(width, height) <= max && file.size < 1_500_000) {
      bitmap.close?.();
      return { file, ratio };
    }

    const scale = Math.min(1, max / Math.max(width, height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.86),
    );
    if (!blob) return { file, ratio };

    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return { file: new File([blob], name, { type: 'image/jpeg' }), ratio };
  } catch {
    // If anything about the decode fails, send the original rather than nothing.
    return { file, ratio: 4 / 3 };
  }
}
