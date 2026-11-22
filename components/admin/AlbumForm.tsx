'use client';

import { useState } from 'react';
import type { Album } from '@/lib/types';
import { saveAlbum } from '@/app/admin/actions';
import { Drawer } from './Drawer';

export function AlbumForm({
  album,
  onClose,
  onSaved,
}: {
  album: Album | null;
  onClose: () => void;
  /** newAlbumId is set only when an album has just been created, so the admin
   *  can open it straight away and upload its photos. */
  onSaved: (message: string, newAlbumId?: string) => void;
}) {
  const [status, setStatus] = useState<{ text: string; tone: '' | 'err' }>({ text: '', tone: '' });
  const [saving, setSaving] = useState(false);

  async function onSubmit(form: HTMLFormElement) {
    setSaving(true);
    setStatus({ text: 'Saving…', tone: '' });
    const data = new FormData(form);
    if (album) data.set('id', album.id);

    const result = await saveAlbum(data);
    setSaving(false);
    if (result.ok) {
      onSaved(
        album ? 'Album saved.' : 'Album added. Now upload its photos.',
        result.id,
      );
    } else {
      setStatus({ text: result.error, tone: 'err' });
    }
  }

  return (
    <Drawer
      title={album ? 'Edit album' : 'Add album'}
      status={status}
      saving={saving}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <fieldset className="adm-lang">
        <legend>English</legend>
        <label className="field">
          <span>Album name</span>
          <input name="title_en" maxLength={160} required defaultValue={album?.title_en ?? ''} />
        </label>
        <label className="field">
          <span>Short description</span>
          <textarea name="desc_en" rows={2} maxLength={500} defaultValue={album?.desc_en ?? ''} />
        </label>
      </fieldset>

      <fieldset className="adm-lang">
        <legend>Sinhala</legend>
        <label className="field">
          <span>Album name</span>
          <input name="title_si" maxLength={160} lang="si" defaultValue={album?.title_si ?? ''} />
        </label>
        <label className="field">
          <span>Short description</span>
          <textarea name="desc_si" rows={2} maxLength={500} lang="si" defaultValue={album?.desc_si ?? ''} />
        </label>
        <span className="adm-hint">
          If you leave these empty, the English text is shown in Sinhala mode.
        </span>
      </fieldset>
    </Drawer>
  );
}
