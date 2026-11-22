/* Media header: a camera, a film strip and swaying instant photos. */
export function MediaArt() {
  return (
          <div className="topic-art" aria-hidden="true">
            <svg viewBox="0 0 520 360" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <g transform="rotate(-14 165 272)">
                <rect className="m-film" x="40" y="240" width="250" height="64" rx="4" />
                <path className="m-holes" d="M48 246h10v6H48zM70 246h10v6H70zM92 246h10v6H92zM114 246h10v6h-10zM136 246h10v6h-10zM158 246h10v6h-10zM180 246h10v6h-10zM202 246h10v6h-10zM224 246h10v6h-10zM246 246h10v6h-10zM268 246h10v6h-10zM48 292h10v6H48zM70 292h10v6H70zM92 292h10v6H92zM114 292h10v6h-10zM136 292h10v6h-10zM158 292h10v6h-10zM180 292h10v6h-10zM202 292h10v6h-10zM224 292h10v6h-10zM246 292h10v6h-10zM268 292h10v6h-10z" />
                <path className="m-frame" d="M54 258h54v32H54zM120 258h54v32h-54zM186 258h54v32h-54zM252 258h32v32h-32z" />
              </g>
              <rect className="m-cam" x="70" y="70" width="110" height="72" rx="12" />
              <path className="m-cam" d="M98 70l9-14h36l9 14" />
              <circle className="m-lens" cx="125" cy="106" r="22" />
              <circle className="m-cam" cx="125" cy="106" r="11" />
              <g className="m-flash k-twinkle"><path d="M200 50l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" /></g>
              <g className="m-sway">
                <g transform="rotate(-8 335 136)">
                  <rect className="m-paper" x="270" y="60" width="130" height="152" rx="4" />
                  <rect className="m-sky1" x="280" y="70" width="110" height="104" />
                  <circle className="m-sun" cx="360" cy="98" r="11" />
                  <path className="m-hill1" d="M280 152q30-26 58-6t52-8v36H280z" />
                </g>
              </g>
              <g className="m-sway m-s2">
                <g transform="rotate(9 433 189)">
                  <rect className="m-paper" x="372" y="118" width="122" height="142" rx="4" />
                  <rect className="m-sky2" x="381" y="127" width="104" height="96" />
                  <circle className="m-sun" cx="410" cy="152" r="9" />
                  <path className="m-hill2" d="M381 205q26-30 52-10t52-6v34H381z" />
                </g>
              </g>
            </svg>
          </div>
  );
}
