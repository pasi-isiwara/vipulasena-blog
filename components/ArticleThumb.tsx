/** The small line drawings shown in place of a preview image, carried over
 *  from the prototype. Each section has its own set of motifs and its own
 *  background decoration; which motif an article gets follows its position. */

import type { Section } from '@/lib/types';

const MOTIFS: Record<Section, string[]> = {
  education: [
    'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z',
    'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M7.5 15h9',
    'M3 20h18M3 20V4M5 15c2-6 4-6 6 0s4 6 6 0 2-4 3-4',
    '',
    'M5 19c0-9 6-14 15-14 0 9-5 15-14 15zM5 19l9-9',
    'M5 3h4v8a3 3 0 0 0 6 0V3h4v8a7 7 0 0 1-14 0zM5 7h4M15 7h4',
  ],
  academic: [
    'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4',
    'M4 20h16M7 20v-6M11 20V9M15 20v-9M19 20V5',
    '',
    'M20 3C12 4 7 9 5 20M20 3c-1 6-5 10-11 11M5 20l-1.5 1.5',
    'M12 7C10.3 5.7 7.8 5 4 5v13c3.8 0 6.3.7 8 2 1.7-1.3 4.2-2 8-2V5c-3.8 0-6.3.7-8 2zM12 7v13',
    'M5 7h4v4c0 3-1.5 5-4 6M14 7h4v4c0 3-1.5 5-4 6',
  ],
  kids: [
    'M12 21v-8M12 13c0-4-3-6-7-6 0 4 3 6 7 6zM12 11c0-4 3-6 7-6 0 4-3 6-7 6zM6 21h12',
    'M15 4a7 7 0 1 0 5 11 6 6 0 0 1-5-11zM6 4l.8 1.7 1.7.8-1.7.8L6 9l-.8-1.7-1.7-.8 1.7-.8z',
    'M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11zM9.5 14.5a2.5 2.5 0 0 0 2.5 2.5',
    '',
    'M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5zM18 14l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9zM6 15l.7 1.5 1.5.7-1.5.7L6 19.4l-.7-1.5-1.5-.7 1.5-.7z',
    'M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0',
  ],
};

/** Three motifs are drawn from several shapes rather than one path. */
function Motif({ section, index }: { section: Section; index: number }) {
  const i = index % MOTIFS[section].length;
  const d = MOTIFS[section][i];
  if (d) return <path d={d} />;

  if (section === 'education') {
    return (
      <>
        <circle cx="12" cy="12" r="1.6" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
      </>
    );
  }
  if (section === 'academic') {
    return (
      <>
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="M15 15l5 5" />
      </>
    );
  }
  return (
    <>
      <ellipse cx="12" cy="14" rx="6" ry="4.5" />
      <path d="M10 9.7v8.6M14 9.7v8.6M9.5 10C8 6 4.5 6.5 5 8.5s3.5 2.5 4.5 1.5M14.5 10C16 6 19.5 6.5 19 8.5s-3.5 2.5-4.5 1.5" />
    </>
  );
}

function Deco({ section }: { section: Section }) {
  if (section === 'education') {
    return (
      <>
        <path className="th-grid" d="M0 15h120M0 30h120M0 45h120M0 60h120M0 75h120M15 0v90M30 0v90M45 0v90M60 0v90M75 0v90M90 0v90M105 0v90" />
        <circle className="th-deco" cx="60" cy="45" r="34" />
      </>
    );
  }
  if (section === 'academic') {
    return (
      <>
        <path className="th-rule" d="M0 18h120M0 30h120M0 42h120M0 54h120M0 66h120M0 78h120" />
        <path className="th-margin" d="M16 0v90" />
      </>
    );
  }
  return (
    <>
      <circle className="th-dot" cx="18" cy="16" r="3" />
      <circle className="th-dot" cx="104" cy="74" r="4" />
      <circle className="th-dot" cx="100" cy="16" r="2" />
      <circle className="th-dot" cx="14" cy="72" r="2.5" />
    </>
  );
}

export function ArticleThumb({ section, index }: { section: Section; index: number }) {
  // Children's books cycle through four pastel backgrounds
  const bg = section === 'kids' ? `th-bg th-k${(index % 4) + 1}` : 'th-bg';
  return (
    <svg viewBox="0 0 120 90" aria-hidden="true" focusable="false">
      <rect className={bg} width="120" height="90" />
      <Deco section={section} />
      <g className="th-ln" transform="translate(36 21) scale(2)">
        <Motif section={section} index={index} />
      </g>
    </svg>
  );
}
