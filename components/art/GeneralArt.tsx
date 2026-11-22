/* General thoughts header: a journal, a quill that writes, a bar chart. */
export function GeneralArt() {
  return (
          <div className="topic-art" aria-hidden="true">
            <svg viewBox="0 0 520 360" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <text className="a-quote" x="250" y="214">“</text>
              <circle className="a-g" cx="92" cy="88" r="30" />
              <path className="a-g" d="M114 110l30 30" />
              <g transform="translate(150 70) scale(11)">
                <path className="a-a" d="M12 7C10.3 5.7 7.8 5 4 5v13c3.8 0 6.3.7 8 2 1.7-1.3 4.2-2 8-2V5c-3.8 0-6.3.7-8 2z" />
                <path className="a-a" d="M12 7v13" />
                <path className="a-g" d="M6 9h4M6 11.5h4M6 14h3M14 9h4M14 11.5h4" />
              </g>
              <path className="a-write" pathLength="1" d="M304 224c6-6 10 6 16 0s10 6 16 0 8 4 12 0" />
              <g className="a-quill">
                <path className="a-g" d="M352 220C372 160 404 92 452 40" />
                <path className="a-g" d="M452 40c-6 34-26 74-62 110M452 40c-30 14-56 46-74 92" />
              </g>
              <path className="a-g" d="M40 330h120M40 330v-92" />
              <path className="a-bar" d="M62 329v-28M86 329v-50M110 329v-38M134 329v-70" />
              <text className="a-mark" x="468" y="300">¶</text>
            </svg>
          </div>
  );
}
