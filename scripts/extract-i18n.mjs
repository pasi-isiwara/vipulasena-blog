/* Builds lib/i18n-si.json from the prototype so the Sinhala text is byte-identical
   to what the client already reviewed. Run again if the prototype's wording changes. */
import { readFileSync, writeFileSync } from 'node:fs';

const BACKSLASH = String.fromCharCode(92);

function objectAfter(marker, text) {
  const start = text.indexOf(marker);
  if (start < 0) throw new Error('not found: ' + marker);
  const i = text.indexOf('{', start);
  let depth = 0;
  let inStr = null;
  for (let j = i; j < text.length; j++) {
    const c = text[j];
    if (inStr) {
      if (c === BACKSLASH) j++;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === "'" || c === '"') { inStr = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return text.slice(i, j + 1); }
  }
  throw new Error('unbalanced: ' + marker);
}

const evalObj = (literal) => new Function('return (' + literal + ')')();

const lang = readFileSync('reference/parts/js-1-lang-theme.js', 'utf8');
const visitors = readFileSync('reference/parts/js-2-visitors.js', 'utf8');
const topics = readFileSync('reference/parts/js-4-topics.js', 'utf8');
const media = readFileSync('reference/parts/js-5-media.js', 'utf8');
const questions = readFileSync('reference/parts/js-3-questions.js', 'utf8');

/* "Academic posts" was renamed to "General thoughts" on 2026-11-22. Those keys
   are written by hand in lib/i18n-si.json now, so the prototype's academic
   wording is dropped here rather than reinstated on every run. */
const RENAMED_AWAY = ['navAcad', 'acadDesc', 'acadMore'];

const out = {
  ...evalObj(objectAfter('var SI=', lang)),
  aria: evalObj(objectAfter('var SI_ARIA=', lang)),
  alt: evalObj(objectAfter('var SI_ALT=', lang)),
};

const topicUI = evalObj(objectAfter('var UI=', topics)).si;
const topicDefs = evalObj(objectAfter('var TOPICS=', topics));
const mediaT = evalObj(objectAfter('var T=', media)).si;
const qT = evalObj(objectAfter('var T=', questions)).si;

Object.assign(out, {
  none: topicUI.none,
  noMatch: topicUI.empty,
  soon: topicUI.soon,
  sampleNote: topicUI.sample,
  site: topicUI.site,
  titleHome: topicUI.home,
  searchEdu: topicDefs.education.search.si,

  searchKids: topicDefs.kids.search.si,
  typeEdu: topicDefs.education.type.si,

  typeKids: topicDefs.kids.type.si,
  nounEdu: topicDefs.education.noun.si,

  nounKids: topicDefs.kids.noun.si,
  mediaTitle: mediaT.title,
  mediaLead: mediaT.lead,
  // 'ඇල්බම 0' / 'ඡායාරූප 0' -> the bare noun, which Sinhala puts before the number
  albumsLabel: mediaT.albums(0).replace(/0\s*$/, '').trim(),
  photosLabel: mediaT.photos(0).replace(/0\s*$/, '').trim(),
  photo: mediaT.photo,
  allAlbums: mediaT.all,
  close: mediaT.close,
  prev: mediaT.prev,
  next: mediaT.next,
  viewer: mediaT.viewer,
  of: mediaT.of,
  albumEmpty: mediaT.empty,
  sending: qT.sending,
  sent: qT.sent,
  emptyQ: qT.empty,
  failed: qT.failed,
});

// The visitor counter's two labels, written inline in that script
const visitorLabels = [...visitors.matchAll(/si\?'([^']*)'/g)].map((m) => m[1]);
if (visitorLabels.length !== 2) throw new Error('visitor labels not found');
out.visitors = visitorLabels[0];
out.pageVisits = visitorLabels[1];

for (const key of RENAMED_AWAY) delete out[key];

/* Anything written by hand since the port wins, so re-running this fills in
   what is missing rather than undoing later wording changes. */
let existing = {};
try {
  existing = JSON.parse(readFileSync('lib/i18n-si.json', 'utf8'));
} catch {
  // First run: there is nothing to keep.
}

const merged = { ...out, ...existing };
writeFileSync('lib/i18n-si.json', JSON.stringify(merged, null, 2) + '\n');
console.log('Sinhala keys written:', Object.keys(merged).length);
