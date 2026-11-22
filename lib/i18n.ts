/** Every user-facing string on the site.
 *
 *  English lives here. Sinhala lives in i18n-si.json, which is generated from
 *  the prototype by scripts/extract-i18n.mjs so the wording stays byte-identical
 *  to what has already been drafted. A key with no Sinhala entry falls back to
 *  English, which is what the prototype did too.
 *
 *  The Sinhala still needs a native-speaker review, especially the job titles. */

import siRaw from './i18n-si.json';

export type Lang = 'en' | 'si';

export const EN = {
  skip: 'Skip to content',
  name: 'Vipulasena Pathirajage',
  navHome: 'Home',
  navEdu: 'Education',
  navAcad: 'Academic posts',
  navKids: 'Children’s books',
  navMedia: 'Media',
  navAsk: 'Ask a question',
  role: 'Former Director of Science Education<br>Ministry of Education, Sri Lanka',
  bio1: 'I completed my first degree at the University of Kelaniya and soon afterwards joined the Sri Lanka Education Administrative Service. My first appointment was as Principal of a national school. I was then appointed Assistant Director of Science Education for the North Central Province, and in 1999 I became Zonal Director of Education, Kekirawa. I later served as Deputy Commissioner in the Department of Examinations, and in 2004 I was appointed Director of Education Quality Assurance. My final appointment was as Director of Science Education.',
  bio2: 'Having worked in so many parts of the education system, I was able to make a significant contribution to science education in Sri Lanka, including curricula, development programmes and textbooks. I also conducted many teacher education workshops across the country. Since retiring, I have felt it would be worthwhile to share these experiences with the public, and this blog is where I hope to do that.',
  explore: 'Explore the collections',
  howCite: 'How to cite this work',
  colIntro: 'Everything on this blog is gathered into four collections. Choose one to start reading.',
  eduDesc: 'Publications on science education: articles, teaching resources and writing for teachers, students and curriculum developers.',
  eduMore: 'Browse publications',
  acadDesc: 'Academic writing, research notes and commentary on teaching and learning.',
  acadMore: 'Read academic posts',
  kidsDesc: 'Books and stories written for young readers, to enjoy at home and in the classroom.',
  kidsMore: 'Browse the books',
  mediaDesc: 'Photos from my life today: new things I’m doing and the activities I enjoy in my free time.',
  mediaMore: 'View photos and media',
  freeTitle: 'Free to use, with credit',
  freeText: 'All content on this blog, including articles, publications, books and photographs, is free for you to use in teaching, study and research. When you use it, please cite this blog as the source.',
  citeLabel: 'Suggested citation',
  citeText: 'Pathirajage, V. (Year). <em>Title of the post or publication</em>. Vipulasena Pathirajage [Blog]. Link to the page.',
  citeHint: 'Replace the year, title and link with the details of the page you are using.',
  footerSub: 'BSc, PGDE, MA. Former Director of Science Education, Ministry of Education, Sri Lanka',
  legal: '© 2026 Vipulasena Pathirajage. Free to use with citation.',
  chipArticles: 'Articles',
  chipTeaching: 'Teaching resources',
  chipCurriculum: 'Curriculum',
  chipResearch: 'Research notes',
  chipCommentary: 'Commentary',
  chipStories: 'Stories',
  chipYoung: 'Young readers',
  chipRecent: 'Recent days',
  chipNew: 'New things',
  chipLeisure: 'Leisure',
  askTitle: 'Ask a question',
  askText: 'Have a doubt about something you read here, or need a clarification on a science education topic? Send me your question. It comes only to me, and I’ll reply to you directly.',
  askDirect: 'Or reach me directly:',
  fName: 'Your name',
  fContact: 'Email or phone (so I can reply)',
  fQuestion: 'Your question',
  fAsk: 'Send question',
  backHome: 'Back to home',

  // Topic pages
  none: 'No articles have been added here yet.',
  noMatch: 'No articles match your search.',
  soon: 'This document will be available soon.',
  searchEdu: 'Search in Education',
  searchAcad: 'Search in Academic posts',
  searchKids: 'Search in Children’s books',
  typeEdu: 'Article',
  typeAcad: 'Academic post',
  typeKids: 'Story book',
  nounEdu: 'article',
  nounEduPlural: 'articles',
  nounAcad: 'post',
  nounAcadPlural: 'posts',
  nounKids: 'book',
  nounKidsPlural: 'books',

  // Media
  mediaTitle: 'Media',
  mediaLead: 'Photos from my life today: new things I’m doing and the activities I enjoy in my free time.',
  albumsLabel: 'album',
  albumsLabelPlural: 'albums',
  photosLabel: 'photo',
  photosLabelPlural: 'photos',
  photo: 'Photo',
  allAlbums: 'All albums',
  close: 'Close',
  prev: 'Previous photo',
  next: 'Next photo',
  viewer: 'Photo viewer',
  of: 'of',
  albumEmpty: 'This album has no photos yet.',
  noAlbums: 'No albums have been added yet.',

  // Ask a question
  sending: 'Sending…',
  sent: 'Thank you. Your question has been sent, and I’ll reply as soon as I can.',
  emptyQ: 'Please write your question before sending.',
  failed: 'Your question couldn’t be sent. Please try again.',
  tooMany: 'Several questions have come from here already. Please wait a little before sending another.',

  // Visitor counter
  visitor: 'visitor',
  visitors: 'visitors',
  pageVisit: 'page visit',
  pageVisits: 'page visits',

  // Theme toggle
  toLight: 'Switch to light mode',
  toDark: 'Switch to dark mode',

  // Titles
  titleHome: 'Vipulasena Pathirajage | Science education, writing and resources',
  site: 'Vipulasena Pathirajage',

  // aria-label / alt text
  ariaNavMain: 'Main',
  ariaNavFooter: 'Footer',
  ariaQuals: 'Qualifications',
  ariaLang: 'Language',
  ariaScrollCue: 'Scroll to the collections',
  altPortrait: 'Portrait of Vipulasena Pathirajage in a garden',

  admin: 'Admin',
} as const;

export type Key = keyof typeof EN;

/** The generated Sinhala file, flattened onto the same key names as EN. */
const si = siRaw as Record<string, unknown>;
const siAria = (si.aria ?? {}) as Record<string, string>;
const siAlt = (si.alt ?? {}) as Record<string, string>;

const SI: Partial<Record<Key, string>> = {
  ...(si as Partial<Record<Key, string>>),
  // Sinhala has no separate plural form: the same noun serves both.
  nounEduPlural: si.nounEdu as string,
  nounAcadPlural: si.nounAcad as string,
  nounKidsPlural: si.nounKids as string,
  albumsLabelPlural: si.albumsLabel as string,
  photosLabelPlural: si.photosLabel as string,
  visitor: si.visitors as string,
  pageVisit: si.pageVisits as string,
  ariaNavMain: siAria.navMain,
  ariaNavFooter: siAria.navFooter,
  ariaQuals: siAria.quals,
  ariaLang: siAria.lang,
  ariaScrollCue: siAria.scrollCue,
  altPortrait: siAlt.portrait,
};

export function t(lang: Lang, key: Key): string {
  if (lang === 'si') {
    const v = SI[key];
    if (typeof v === 'string' && v) return v;
  }
  return EN[key];
}

/** Sinhala puts the noun before the number ("ලිපි 6"); English after ("6 articles"). */
export function countLabel(lang: Lang, n: number, one: Key, many: Key): string {
  const noun = t(lang, n === 1 ? one : many);
  return lang === 'si' ? `${noun} ${n}` : `${n} ${noun}`;
}
