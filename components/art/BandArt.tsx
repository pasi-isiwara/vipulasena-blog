/* The quarter-circle branch at the top of the collections band. */
export function BandArt() {
  return (
       <div className="band-art art" aria-hidden="true">
         <svg viewBox="0 0 320 320" fill="none" strokeLinecap="round" strokeLinejoin="round">
           <circle className="ring r2" cx="320" cy="0" r="150" />
           <circle className="ring r3" cx="320" cy="0" r="215" />
           <circle className="dot-gold" cx="214" cy="106" r="3" />
           <g className="branch">
             <path d="M318 6C262 40 226 82 206 130S174 214 140 252" />
             <g transform="translate(282 27) rotate(178)"><path d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path d="M4 0H38" /></g>
             <g transform="translate(252 52) rotate(88)"><path d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path d="M4 0H38" /></g>
             <g transform="translate(228 86) rotate(170) scale(.9)"><path d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path d="M4 0H38" /></g>
             <g transform="translate(212 118) rotate(80) scale(.85)"><path d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path d="M4 0H38" /></g>
             <g transform="translate(198 156) rotate(160) scale(.75)"><path d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path d="M4 0H38" /></g>
             <g transform="translate(182 196) rotate(75) scale(.65)"><path d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path d="M4 0H38" /></g>
             <g transform="translate(140 252) rotate(125) scale(.55)"><path d="M0 0C12-13 32-13 44 0C32 13 12 13 0 0Z" /><path d="M4 0H38" /></g>
           </g>
         </svg>
       </div>
  );
}
