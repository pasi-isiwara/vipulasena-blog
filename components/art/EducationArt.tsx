/* Education header: a turning atom, a flask with rising bubbles, a molecule. */
export function EducationArt() {
  return (
          <div className="topic-art" aria-hidden="true">
            <svg viewBox="0 0 520 360" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <g className="e-atom">
                <ellipse className="e-g" cx="360" cy="150" rx="120" ry="40" />
                <ellipse className="e-g" cx="360" cy="150" rx="120" ry="40" transform="rotate(60 360 150)" />
                <ellipse className="e-g" cx="360" cy="150" rx="120" ry="40" transform="rotate(120 360 150)" />
                <circle className="e-dot" cx="480" cy="150" r="6" />
                <circle className="e-dot" cx="420" cy="253.9" r="5" />
                <circle className="e-dot" cx="420" cy="46.1" r="5" />
              </g>
              <circle className="e-g" cx="360" cy="150" r="24" strokeDasharray="2 5" />
              <circle className="e-nuc" cx="360" cy="150" r="12" />
              <g transform="translate(40 150) scale(7)">
                <path className="e-liquid" d="M7.6 15h8.8l2.6 4.6a1.3 1.3 0 0 1-1.1 1.9H6.1A1.3 1.3 0 0 1 5 19.6z" />
                <path className="e-a" d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3" />
              </g>
              <circle className="e-a e-bubble" cx="120" cy="262" r="4" />
              <circle className="e-a e-bubble b2" cx="130" cy="270" r="3" />
              <circle className="e-a e-bubble b3" cx="114" cy="276" r="2.5" />
              <path className="e-g" d="M150 40l22 12.7v25.4L150 90.8l-22-12.7V52.7z" />
              <path className="e-g" d="M172 52.7l26-15M128 78.1l-24 14" />
              <circle className="e-dot" cx="201" cy="36" r="5" />
              <circle className="e-dot" cx="101" cy="94" r="5" />
              <text className="e-text" x="216" y="30">H₂O</text>
              <path className="e-g" strokeDasharray="3 6" d="M200 330c20-22 40-22 60 0s40 22 60 0 40-22 60 0 40 22 60 0" />
            </svg>
          </div>
  );
}
