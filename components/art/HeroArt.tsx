/* Orbits, a molecule and a leafy branch behind the introduction. */
export function HeroArt() {
  return (
            <div className="hero-art art" aria-hidden="true">
              <svg viewBox="0 0 600 600" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <g className="rings">
                  <circle className="ring r1" cx="300" cy="300" r="120" />
                  <circle className="ring r2" cx="300" cy="300" r="180" />
                  <circle className="ring r3" cx="300" cy="300" r="240" />
                  <circle className="ring r4" cx="300" cy="300" r="292" />
                </g>
                <g className="molecule">
                  <path d="M300 262L333 281V319L300 338L267 319V281Z" />
                  <circle cx="300" cy="300" r="20" />
                  <path d="M333 281L362 264M267 319L238 336M300 262V230" />
                  <circle className="atom" cx="366" cy="262" r="4" />
                  <circle className="atom" cx="234" cy="338" r="4" />
                  <circle className="atom" cx="300" cy="226" r="4" />
                </g>
                <g className="spin spin-a"><circle className="dot-gold" cx="300" cy="180" r="5" /></g>
                <g className="spin spin-b"><circle className="dot-green" cx="300" cy="480" r="4" /></g>
                <g className="spin spin-c"><circle className="dot-gold" cx="540" cy="300" r="3.5" /><circle className="dot-green" cx="60" cy="300" r="3" /></g>
                <g className="spark">
                  <path d="M96 128v12M90 134h12" />
                  <path d="M492 84v10M487 89h10" />
                  <path d="M120 470v10M115 475h10" />
                </g>
                <g className="branch" transform="translate(600 0) scale(-1 1)">
                  <path className="draw" pathLength="1" style={{ animationDelay: '.5s' }} d="M30 595C95 548 135 505 160 460S195 400 222 372" />
                  <g transform="translate(72 565) rotate(-110) scale(1.1)"><path className="draw" pathLength="1" style={{ animationDelay: '.9s' }} d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path className="draw" pathLength="1" style={{ animationDelay: '1.15s' }} d="M4 0H38" /></g>
                  <g transform="translate(108 533) rotate(-10) scale(1.05)"><path className="draw" pathLength="1" style={{ animationDelay: '1.05s' }} d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path className="draw" pathLength="1" style={{ animationDelay: '1.3s' }} d="M4 0H38" /></g>
                  <g transform="translate(138 498) rotate(-118) scale(.95)"><path className="draw" pathLength="1" style={{ animationDelay: '1.2s' }} d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path className="draw" pathLength="1" style={{ animationDelay: '1.45s' }} d="M4 0H38" /></g>
                  <g transform="translate(160 462) rotate(-20) scale(.9)"><path className="draw" pathLength="1" style={{ animationDelay: '1.35s' }} d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path className="draw" pathLength="1" style={{ animationDelay: '1.6s' }} d="M4 0H38" /></g>
                  <g transform="translate(176 430) rotate(-125) scale(.8)"><path className="draw" pathLength="1" style={{ animationDelay: '1.5s' }} d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path className="draw" pathLength="1" style={{ animationDelay: '1.75s' }} d="M4 0H38" /></g>
                  <g transform="translate(196 400) rotate(-30) scale(.7)"><path className="draw" pathLength="1" style={{ animationDelay: '1.65s' }} d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path className="draw" pathLength="1" style={{ animationDelay: '1.9s' }} d="M4 0H38" /></g>
                  <g transform="translate(222 372) rotate(-45) scale(.6)"><path className="draw" pathLength="1" style={{ animationDelay: '1.8s' }} d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path className="draw" pathLength="1" style={{ animationDelay: '2.05s' }} d="M4 0H38" /></g>
                </g>
              </svg>
            </div>
  );
}
