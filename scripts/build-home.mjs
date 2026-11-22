/* Generates app/home-content.tsx from the prototype's home markup.
   Elements carrying data-i18n get their text from the dictionary instead;
   everything else - the hand-drawn SVG especially - comes across unchanged.

   This ran once, to carry the prototype across without retyping its artwork.
   app/home-content.tsx is now an ordinary source file that has been edited
   since, so running this again would throw that work away: it refuses unless
   you pass --force, and the point of keeping it is to diff against the
   prototype, not to regenerate the page. */
import { writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const OUT = 'app/home-content.tsx';

if (existsSync(OUT) && !process.argv.includes('--force')) {
  console.error(
    `${OUT} already exists and has been edited by hand since it was generated.\n` +
      'Edit it directly. To regenerate from the prototype anyway, pass --force.',
  );
  process.exit(1);
}

const FROM = 81;
const TO = 352;

let jsx = execFileSync(
  process.execPath,
  ['scripts/html-to-jsx.mjs', 'reference/parts/body.html', String(FROM), String(TO)],
  { encoding: 'utf8' },
);

// Keys whose text contains markup and so has to be set as HTML
const HTML_KEYS = new Set(['role', 'citeText']);

// <tag ... data-i18n="key" ...>text</tag>  ->  <tag ...>{t('key')}</tag>
jsx = jsx.replace(
  /<(\w+)([^>]*?)\sdata-i18n="([\w]+)"([^>]*)>([\s\S]*?)<\/\1>/g,
  (_full, tag, before, key, after) => {
    const attrs = `${before}${after}`.replace(/\s+/g, ' ').trimEnd();
    if (HTML_KEYS.has(key)) {
      return `<${tag}${attrs ? ' ' + attrs.trim() : ''} dangerouslySetInnerHTML={{ __html: t('${key}') }} />`;
    }
    return `<${tag}${attrs ? ' ' + attrs.trim() : ''}>{t('${key}')}</${tag}>`;
  },
);

// aria-label and alt from the dictionary
jsx = jsx.replace(/aria-label="[^"]*"\s+data-i18n-aria="(\w+)"/g, (_m, k) => `aria-label={t('aria${k[0].toUpperCase()}${k.slice(1)}')}`);
jsx = jsx.replace(/data-i18n-aria="(\w+)"/g, (_m, k) => `aria-label={t('aria${k[0].toUpperCase()}${k.slice(1)}')}`);
jsx = jsx.replace(/alt="[^"]*"\s+data-i18n-alt="(\w+)"/g, (_m, k) => `alt={t('alt${k[0].toUpperCase()}${k.slice(1)}')}`);

// Hash links become real routes
const ROUTES = {
  '#top': '/',
  '#education': '/education',
  '#academic-posts': '/general-thoughts',
  '#childrens-books': '/childrens-books',
  '#media': '/media',
};
jsx = jsx.replace(/href="(#[\w-]+)"/g, (full, hash) => (ROUTES[hash] ? `href="${ROUTES[hash]}"` : full));

// Links to another page on the site become <Link>, so navigation stays instant
// the way the prototype's view switching was. Same-page anchors stay <a>.
jsx = linksToNextLink(jsx);

function linksToNextLink(text) {
  let out = '';
  let rest = text;
  for (;;) {
    const open = rest.match(/<a\s[^>]*href="\/[^"]*"[^>]*>/);
    if (!open) return out + rest;
    const start = open.index;
    const after = start + open[0].length;

    // Find this anchor's own closing tag (anchors never nest)
    const close = rest.indexOf('</a>', after);
    if (close < 0) return out + rest;

    out +=
      rest.slice(0, start) +
      '<Link' +
      open[0].slice(2, -1) +
      '>' +
      rest.slice(after, close) +
      '</Link>';
    rest = rest.slice(close + 4);
  }
}

// The portrait is the largest thing on the page, so it goes through next/image
// and is marked priority: it is what the visitor is waiting for.
jsx = jsx.replace(
  /<img src="\/portrait\.jpg"([^>]*?)\/>/,
  (_m, rest) => `<Image src="/portrait.jpg"${rest}priority />`,
);

// The big background drawings already live in their own components
jsx = jsx.replace(
  /<div className="hero-art art" aria-hidden="true">[\s\S]*?<\/svg>\s*<\/div>/,
  '<HeroArt />',
);
jsx = jsx.replace(
  /<div className="band-art art" aria-hidden="true">[\s\S]*?<\/svg>\s*<\/div>/,
  '<BandArt />',
);

// The question form and its owner-only inbox are interactive
jsx = jsx.replace(
  /<form className="question-form ideas-form"[\s\S]*?<\/form>\s*<div className="comments-area" hidden>[\s\S]*?<\/div>/,
  '<AskForm />',
);

// Apostrophes and quotes inside JSX text are fine, but a stray brace is not
let stripped = jsx;
for (let pass = 0; pass < 10; pass++) {
  const next = stripped.replace(/\{[^{}]*\}/g, '');
  if (next === stripped) break;
  stripped = next;
}
if (/[{}]/.test(stripped)) console.warn('warning: unbalanced brace in generated JSX, check by hand');

const body = jsx
  .split('\n')
  .map((line) => (line.trim() ? '      ' + line : line))
  .join('\n');

const file = `'use client';

/* The home page: introduction, the four collection cards, the citation notice
   and the question form. First generated from the prototype by
   scripts/build-home.mjs so the markup and artwork came across unchanged;
   an ordinary source file from then on. */

import Link from 'next/link';
import Image from 'next/image';
import { usePrefs } from '@/lib/prefs';
import { HeroArt } from '@/components/art/HeroArt';
import { BandArt } from '@/components/art/BandArt';
import { AskForm } from '@/components/AskForm';

export function HomeContent() {
  const { t } = usePrefs();

  return (
    <div id="home-view">
${body}
    </div>
  );
}
`;

writeFileSync(OUT, file);
console.log(`${OUT} written,`, file.split('\n').length, 'lines');
