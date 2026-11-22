'use client';

import { useState } from 'react';
import type { Photo } from '@/lib/types';
import { savePhotoCaption } from '@/app/admin/actions';
import { Drawer } from './Drawer';

export function PhotoCaptionForm({
  photo,
  onClose,
  onSaved,
}: {
  photo: Photo;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [status, setStatus] = useState<{ text: string; tone: '' | 'err' }>({ text: '', tone: '' });
  const [saving, setSaving] = useState(false);

  async function onSubmit(form: HTMLFormElement) {
    setSaving(true);
    setStatus({ text: 'Saving…', tone: '' });
    const data = new FormData(form);
    data.set('id', photo.id);
    const result = await savePhotoCaption(data);
    setSaving(false);
    if (result.ok) onSaved('Caption saved.');
    else setStatus({ text: result.error, tone: 'err' });
  }

  return (
    <Drawer
      title="Photo caption"
      status={status}
      saving={saving}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <div className="adm-thumb" style={{ maxWidth: '240px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.image_url} alt="" />
      </div>
      <label className="field">
        <span>Caption in English</span>
        <input name="caption_en" maxLength={200} defaultValue={photo.caption_en} />
      </label>
      <label className="field">
        <span>Caption in Sinhala</span>
        <input name="caption_si" maxLength={200} lang="si" defaultValue={photo.caption_si} />
      </label>
      <span className="adm-hint">
        Leave a caption empty to show “Photo 1”, “Photo 2” and so on.
      </span>
    </Drawer>
  );
}
