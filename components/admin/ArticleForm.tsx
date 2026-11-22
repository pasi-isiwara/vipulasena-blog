'use client';

import { useState } from 'react';
import type { Article, Folder, Section } from '@/lib/types';
import { SECTIONS_WITH_FOLDERS } from '@/lib/types';
import { saveArticle } from '@/app/admin/actions';
import { prepareImage, ARTICLE_IMAGE_MAX } from '@/lib/resize';
import { Drawer } from './Drawer';

const SECTION_NAMES: Record<Section, string> = {
  education: 'Education',
  general: 'General thoughts',
  kids: 'Children’s books',
};

export function ArticleForm({
  article,
  section,
  folders,
  onClose,
  onSaved,
}: {
  article: Article | null;
  section: Section;
  folders: Folder[];
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const [status, setStatus] = useState<{ text: string; tone: '' | 'err' }>({ text: '', tone: '' });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string>(article?.image_url ?? '');
  const [clearedImage, setClearedImage] = useState(false);
  const [clearedDoc, setClearedDoc] = useState(false);

  // The folder list follows the section chosen in this form, not the tab
  // the article was opened from.
  const [chosenSection, setChosenSection] = useState<Section>(article?.section ?? section);
  const foldersHere = SECTIONS_WITH_FOLDERS.includes(chosenSection)
    ? folders.filter((f) => f.section === chosenSection)
    : [];

  const existingDoc = !clearedDoc ? (article?.doc_url ?? '') : '';
  const existingDocIsLink = existingDoc && !existingDoc.includes('.blob.vercel-storage.com');

  async function onSubmit(form: HTMLFormElement) {
    setSaving(true);
    setStatus({ text: 'Saving…', tone: '' });
    try {
      const data = new FormData(form);

      // Shrink the preview image here rather than sending the original
      const image = data.get('image');
      if (image instanceof File && image.size > 0) {
        setStatus({ text: 'Preparing the image…', tone: '' });
        const prepared = await prepareImage(image, ARTICLE_IMAGE_MAX);
        data.set('image', prepared.file);
      } else {
        data.delete('image');
      }

      if (article) data.set('id', article.id);
      if (clearedImage) data.set('clear_image', '1');
      if (clearedDoc) data.set('clear_doc', '1');

      const result = await saveArticle(data);
      if (result.ok) onSaved(article ? 'Article saved.' : 'Article added.');
      else setStatus({ text: result.error, tone: 'err' });
    } catch (error) {
      setStatus({
        text: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        tone: 'err',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Drawer
      title={article ? 'Edit article' : 'Add article'}
      status={status}
      saving={saving}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <label className="field">
        <span>Section</span>
        <select
          name="section"
          value={chosenSection}
          onChange={(e) => setChosenSection(e.target.value as Section)}
        >
          {(Object.keys(SECTION_NAMES) as Section[]).map((key) => (
            <option key={key} value={key}>
              {SECTION_NAMES[key]}
            </option>
          ))}
        </select>
      </label>

      {foldersHere.length > 0 && (
        <label className="field">
          <span>Folder</span>
          <select
            name="folder_id"
            defaultValue={article?.folder_id ?? ''}
            key={chosenSection}
          >
            <option value="">No folder, show it in the section itself</option>
            {foldersHere.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.title_en}
              </option>
            ))}
          </select>
        </label>
      )}

      <fieldset className="adm-lang">
        <legend>English</legend>
        <label className="field">
          <span>Title</span>
          <input name="title_en" maxLength={160} required defaultValue={article?.title_en ?? ''} />
        </label>
        <label className="field">
          <span>Short description</span>
          <textarea name="desc_en" rows={3} maxLength={500} defaultValue={article?.desc_en ?? ''} />
        </label>
      </fieldset>

      <fieldset className="adm-lang">
        <legend>Sinhala</legend>
        <label className="field">
          <span>Title</span>
          <input name="title_si" maxLength={160} lang="si" defaultValue={article?.title_si ?? ''} />
        </label>
        <label className="field">
          <span>Short description</span>
          <textarea name="desc_si" rows={3} maxLength={500} lang="si" defaultValue={article?.desc_si ?? ''} />
        </label>
        <span className="adm-hint">
          If you leave these empty, the English text is shown in Sinhala mode.
        </span>
      </fieldset>

      <div className="field">
        <span>Preview image</span>
        <div className="adm-file">
          <span className="adm-file-preview">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" />
            ) : (
              'No image'
            )}
          </span>
          <span className="adm-file-ctrl">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  setClearedImage(false);
                }
              }}
            />
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setPreview('');
                setClearedImage(true);
                const input = document.querySelector<HTMLInputElement>('input[name="image"]');
                if (input) input.value = '';
              }}
            >
              Remove image
            </button>
            <span className="adm-hint">Without an image, a small drawing is shown instead.</span>
          </span>
        </div>
      </div>

      <div className="field">
        <span>Document</span>
        {existingDoc && !existingDocIsLink && (
          <span className="adm-doc-current">
            Uploaded PDF:{' '}
            <a href={existingDoc} target="_blank" rel="noopener">
              Open
            </a>
            <button type="button" className="btn-ghost" onClick={() => setClearedDoc(true)}>
              Remove
            </button>
          </span>
        )}
        <input type="file" name="docfile" accept="application/pdf" />
        <span className="adm-hint">Upload a PDF, or paste a link to the document below.</span>
        <input
          type="url"
          name="doc_link"
          placeholder="https://"
          defaultValue={existingDocIsLink ? existingDoc : ''}
        />
      </div>

      <label className="adm-check">
        <input type="checkbox" name="published" defaultChecked={article ? article.published : true} />
        Show this article on the website
      </label>
    </Drawer>
  );
}
