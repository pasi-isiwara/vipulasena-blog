/* Children's books header: moon, twinkling stars, drifting clouds, a paper plane. */
export function KidsArt() {
  return (
          <div className="topic-art" aria-hidden="true">
            <svg viewBox="0 0 520 360" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path className="k-trail" d="M30 300c50-12 90-40 120-74" />
              <g className="k-bob">
                <path className="k-plane" d="M140 236l70-30-26 52-12-16z" />
                <path className="k-ink" d="M172 242l38-36" />
              </g>
              <g className="k-drift"><path className="k-cloud" d="M300 120a28 28 0 0 1 52-14 22 22 0 0 1 38 18 18 18 0 0 1-4 36H306a22 22 0 0 1-6-40z" /></g>
              <g className="k-drift k-slow"><path className="k-cloud" d="M110 80a20 20 0 0 1 37-10 16 16 0 0 1 27 13 13 13 0 0 1-3 26h-57a16 16 0 0 1-4-29z" /></g>
              <path className="k-moon" d="M452 34a36 36 0 1 0 28 58 30 30 0 0 1-28-58z" />
              <g className="k-star k-twinkle"><path d="M392 40l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" /></g>
              <g className="k-star k-twinkle t2"><path d="M250 48l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" /></g>
              <g className="k-star k-twinkle t3"><path d="M478 160l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" /></g>
              <g className="k-star k-twinkle t4"><path d="M214 140l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /></g>
              <rect className="k-b1" x="320" y="300" width="164" height="28" rx="6" />
              <rect className="k-b2" x="336" y="272" width="136" height="28" rx="6" />
              <rect className="k-b3" x="326" y="244" width="152" height="28" rx="6" />
              <path className="k-ink" d="M340 300v28M352 272v28M344 244v28" />
              <g className="k-bob">
                <path className="k-ink" d="M404 244v-30" />
                <path className="k-leaf" d="M404 226c-14 0-22-8-22-20 14 0 22 8 22 20z" />
                <path className="k-leaf" d="M404 218c0-12 8-20 22-20 0 12-8 20-22 20z" />
              </g>
            </svg>
          </div>
  );
}
