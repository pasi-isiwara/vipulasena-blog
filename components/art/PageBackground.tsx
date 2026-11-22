/* The drifting background ribbons, carried over from the prototype unchanged. */
export function PageBackground() {
  return (
    <div className="page-bg" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMinYMax slice">
        <defs>
          <linearGradient id="waveSoft" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" className="w-green" stopOpacity="0" />
            <stop offset=".55" className="w-green" stopOpacity=".09" />
            <stop offset="1" className="w-green" stopOpacity=".03" />
          </linearGradient>
          <linearGradient id="waveGreen" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" className="w-green" stopOpacity="0" />
            <stop offset=".5" className="w-green" stopOpacity=".18" />
            <stop offset="1" className="w-green" stopOpacity=".05" />
          </linearGradient>
          <linearGradient id="waveGold" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" className="w-gold" stopOpacity="0" />
            <stop offset=".5" className="w-gold" stopOpacity=".2" />
            <stop offset="1" className="w-gold" stopOpacity=".05" />
          </linearGradient>
        </defs>
        <g transform="translate(1440 0) scale(-1 1)">
        <g className="flow-a">
          <path className="band" d="M0 900C420 770 900 640 1440 290L1440 470C960 720 520 830 140 900Z" />
          <path className="ribbon" d="M240 900C640 730 1040 530 1440 150L1440 192C1050 562 660 758 292 900Z" />
          <path className="ribbon-gold" d="M430 900C780 770 1130 610 1440 430L1440 464C1140 638 800 794 482 900Z" />
          <path className="strand" d="M150 900C580 748 1000 566 1440 232" />
          <path className="strand-gold" d="M600 900C900 770 1200 590 1440 360" />
          <path className="strand" d="M330 900C720 760 1080 600 1440 300" />
        </g>
        <g className="flow-b">
          <path className="ribbon" d="M720 900C960 690 1170 420 1290 0L1340 0C1216 432 1012 710 778 900Z" />
          <path className="ribbon-gold" d="M960 900C1130 690 1290 390 1384 0L1404 0C1312 396 1154 700 992 900Z" />
          <path className="strand" d="M840 900C1060 700 1240 440 1340 0" />
          <path className="strand-gold" d="M1100 900C1250 680 1370 420 1440 160" />
        </g>
        <g className="flow-c faint">
          <path className="band" d="M0 210C300 110 620 50 980 0L760 0C500 40 240 100 0 150Z" />
          <path className="strand" d="M0 250C320 130 660 50 1020 0" />
          <path className="strand-gold" d="M0 190C260 100 540 40 840 0" />
        </g>
        </g>
      </svg>
    </div>
  );
}
