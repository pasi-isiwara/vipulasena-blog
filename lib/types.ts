export type Section = 'education' | 'general' | 'kids';

export const SECTIONS: Section[] = ['education', 'general', 'kids'];

/** The route segment each section lives at. */
export const SECTION_PATH: Record<Section, string> = {
  education: 'education',
  general: 'general-thoughts',
  kids: 'childrens-books',
};

export type Article = {
  id: string;
  section: Section;
  title_en: string;
  desc_en: string;
  title_si: string;
  desc_si: string;
  image_url: string;
  doc_url: string;
  published: boolean;
  sort_order: number;
};

export type Album = {
  id: string;
  title_en: string;
  desc_en: string;
  title_si: string;
  desc_si: string;
  sort_order: number;
  photo_count: number;
  cover_url: string | null;
};

export type Photo = {
  id: string;
  album_id: string;
  image_url: string;
  caption_en: string;
  caption_si: string;
  ratio: number;
  sort_order: number;
};

export type Question = {
  id: string;
  name: string;
  contact: string;
  question: string;
  language: 'en' | 'si';
  answered: boolean;
  created_at: string;
};

export type VisitTotals = { visitors: number; page_visits: number };
