'use client';

import { useState } from 'react';
import type { Folder, Section } from '@/lib/types';
import { saveFolder } from '@/app/admin/actions';
import { Drawer } from './Drawer';

export function FolderForm({
  folder,
  section,
  onClose,
  onSaved,
}: {
  folder: Folder | null;
  section: Section;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [status, setStatus] = useState<{ text: string; tone: '' | 'err' }>({ text: '', tone: '' });
  const [saving, setSaving] = useState(false);

  async function onSubmit(form: HTMLFormElement) {
    setSaving(true);
    setStatus({ text: 'Saving…', tone: '' });
    const data = new FormData(form);
    data.set('section', section);
    if (folder) data.set('id', folder.id);

    const result = await saveFolder(data);
    setSaving(false);
    if (result.ok) onSaved(folder ? 'Folder saved.' : 'Folder added.');
    else setStatus({ text: result.error, tone: 'err' });
  }

  return (
    <Drawer
      title={folder ? 'Edit folder' : 'Add folder'}
      status={status}
      saving={saving}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <fieldset className="adm-lang">
        <legend>English</legend>
        <label className="field">
          <span>Folder name</span>
          <input name="title_en" maxLength={160} required defaultValue={folder?.title_en ?? ''} />
        </label>
        <label className="field">
          <span>Short description</span>
          <textarea name="desc_en" rows={2} maxLength={500} defaultValue={folder?.desc_en ?? ''} />
        </label>
      </fieldset>

      <fieldset className="adm-lang">
        <legend>Sinhala</legend>
        <label className="field">
          <span>Folder name</span>
          <input name="title_si" maxLength={160} lang="si" defaultValue={folder?.title_si ?? ''} />
        </label>
        <label className="field">
          <span>Short description</span>
          <textarea name="desc_si" rows={2} maxLength={500} lang="si" defaultValue={folder?.desc_si ?? ''} />
        </label>
        <span className="adm-hint">
          If you leave these empty, the English text is shown in Sinhala mode.
        </span>
      </fieldset>

      {folder && (
        <span className="adm-hint">
          The folder&rsquo;s address stays <code>/education/{folder.id}</code> when you rename it,
          so links already shared keep working.
        </span>
      )}
    </Drawer>
  );
}
