const svgToDataUri = (svgString: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;

export const JUTSU_ANIME_CUTINS: Record<string, string> = {
  rasengan: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220">
      <defs>
        <radialGradient id="rasCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="35%" stop-color="#bae6fd"/>
          <stop offset="70%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#082f49" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="420" height="220" fill="#071120"/>
      <g stroke="#38bdf8" stroke-width="1.5" opacity="0.35">
        <line x1="0" y1="15" x2="210" y2="110"/><line x1="0" y1="205" x2="210" y2="110"/>
        <line x1="420" y1="25" x2="210" y2="110"/><line x1="420" y1="195" x2="210" y2="110"/>
        <line x1="90" y1="0" x2="210" y2="110"/><line x1="330" y1="220" x2="210" y2="110"/>
      </g>
      <circle cx="210" cy="110" r="92" fill="url(#rasCore)"/>
      <g fill="none" stroke="#e0f2fe" stroke-width="3" opacity="0.92">
        <ellipse cx="210" cy="110" rx="70" ry="26" transform="rotate(25 210 110)"/>
        <ellipse cx="210" cy="110" rx="70" ry="26" transform="rotate(-35 210 110)"/>
        <ellipse cx="210" cy="110" rx="54" ry="50" transform="rotate(75 210 110)"/>
        <circle cx="210" cy="110" r="34" fill="#ffffff"/>
      </g>
      <text x="395" y="198" text-anchor="end" fill="#e0f2fe" font-family="serif" font-weight="900" font-size="38">螺旋丸</text>
    </svg>
  `),
  kagebunshin: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220">
      <rect width="420" height="220" fill="#1c120c"/>
      <g fill="#e2e8f0" opacity="0.22">
        <circle cx="95" cy="120" r="46"/><circle cx="325" cy="120" r="46"/>
        <circle cx="150" cy="95" r="56"/><circle cx="270" cy="95" r="56"/>
      </g>
      <g transform="translate(210,110)">
        <rect x="-14" y="-65" width="28" height="130" rx="6" fill="#f59e0b" stroke="#fff" stroke-width="2"/>
        <rect x="-65" y="-14" width="130" height="28" rx="6" fill="#ea580c" stroke="#fff" stroke-width="2"/>
      </g>
      <text x="395" y="198" text-anchor="end" fill="#fb923c" font-family="serif" font-weight="900" font-size="34">多重影分身</text>
    </svg>
  `),
  chidori: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220">
      <rect width="420" height="220" fill="#090d1c"/>
      <circle cx="210" cy="110" r="78" fill="#1d4ed8" opacity="0.42"/>
      <g fill="none" stroke="#93c5fd" stroke-width="4" stroke-linejoin="round">
        <polyline points="20,40 115,95 95,120 210,110 290,60 275,95 395,45"/>
        <polyline points="35,185 135,130 210,110 260,165 320,135 390,180"/>
        <polyline points="165,15 195,80 210,110 225,155 205,205" stroke="#ffffff" stroke-width="5"/>
      </g>
      <circle cx="210" cy="110" r="28" fill="#ffffff"/>
      <text x="395" y="198" text-anchor="end" fill="#bfdbfe" font-family="serif" font-weight="900" font-size="38">千鳥</text>
    </svg>
  `),
  amaterasu: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220">
      <rect width="420" height="220" fill="#180409"/>
      <circle cx="210" cy="110" r="70" fill="#dc2626" stroke="#000" stroke-width="6"/>
      <path d="M210,40 C235,85 278,110 210,180 C142,110 185,85 210,40 Z" fill="#09090b"/>
      <path d="M140,110 C185,85 210,40 280,110 C210,180 185,135 140,110 Z" fill="#09090b"/>
      <circle cx="210" cy="110" r="14" fill="#dc2626"/>
      <path d="M10,220 Q60,115 100,190 Q150,75 195,185 Q245,60 295,190 Q350,95 410,220 Z" fill="#09090b" stroke="#991b1b" stroke-width="2.5"/>
      <text x="395" y="198" text-anchor="end" fill="#ef4444" font-family="serif" font-weight="900" font-size="38">天照</text>
    </svg>
  `),
  hiraishin: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220">
      <rect width="420" height="220" fill="#1c1605"/>
      <g stroke="#facc15" stroke-width="3" opacity="0.7">
        <line x1="10" y1="45" x2="410" y2="45"/><line x1="40" y1="110" x2="380" y2="110"/><line x1="15" y1="175" x2="405" y2="175"/>
      </g>
      <g transform="translate(210,110) rotate(-18)">
        <polygon points="-95,0 35,-18 25,0 35,18" fill="#e2e8f0" stroke="#0f172a" stroke-width="2"/>
        <polygon points="-45,-28 20,-12 5,-35" fill="#cbd5e1"/>
        <polygon points="-45,28 20,12 5,35" fill="#cbd5e1"/>
        <rect x="35" y="-7" width="48" height="14" fill="#991b1b"/>
        <circle cx="92" cy="0" r="12" fill="none" stroke="#facc15" stroke-width="4"/>
      </g>
      <text x="395" y="198" text-anchor="end" fill="#fde047" font-family="serif" font-weight="900" font-size="34">飛雷神の術</text>
    </svg>
  `),
  sabaku: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220">
      <rect width="420" height="220" fill="#291d12"/>
      <path d="M0,160 Q105,40 215,120 T420,80 L420,220 L0,220 Z" fill="#b48a5a"/>
      <path d="M0,190 Q145,70 265,150 T420,120 L420,220 L0,220 Z" fill="#8c6438"/>
      <circle cx="210" cy="95" r="46" fill="#d6b485" stroke="#78350f" stroke-width="3"/>
      <text x="210" y="112" text-anchor="middle" fill="#991b1b" font-family="serif" font-weight="900" font-size="48">愛</text>
      <text x="395" y="198" text-anchor="end" fill="#fef3c7" font-family="serif" font-weight="900" font-size="34">砂瀑送葬</text>
    </svg>
  `),
  tsukuyomi: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220">
      <rect width="420" height="220" fill="#450a0a"/>
      <circle cx="210" cy="110" r="78" fill="#dc2626" stroke="#000" stroke-width="5"/>
      <g fill="#09090b">
        <path d="M210,110 C210,55 265,55 278,95 C245,85 225,95 210,110 Z"/>
        <path d="M210,110 C258,138 230,185 188,176 C215,152 215,130 210,110 Z"/>
        <path d="M210,110 C162,138 135,90 164,54 C172,88 192,102 210,110 Z"/>
      </g>
      <circle cx="210" cy="110" r="13" fill="#dc2626"/>
      <text x="395" y="198" text-anchor="end" fill="#fca5a5" font-family="serif" font-weight="900" font-size="38">月読</text>
    </svg>
  `),
  lotus: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220">
      <rect width="420" height="220" fill="#062415"/>
      <circle cx="210" cy="110" r="76" fill="#16a34a" opacity="0.35"/>
      <g stroke="#fef3c7" stroke-width="8" fill="none">
        <path d="M45,170 Q210,20 375,170"/>
        <path d="M65,50 Q210,190 355,50"/>
      </g>
      <circle cx="210" cy="110" r="38" fill="#ea580c"/>
      <text x="395" y="198" text-anchor="end" fill="#86efac" font-family="serif" font-weight="900" font-size="36">表蓮華</text>
    </svg>
  `)
};

export const CHAR_REAL_ARTWORK: Record<string, string> = {
  naruto: '/assets/naruto_hero.jpg',
  sasuke: '/assets/sasuke_hero.jpg',
  kakashi: '/assets/kakashi_hero.jpg',
  gaara: '/assets/gaara_hero.jpg',
  itachi: '/assets/itachi_hero.jpg',
  minato: '/assets/minato_hero.jpg',
};

export const CHAR_SVG_FALLBACKS: Record<string, string> = {
  naruto: '/assets/naruto_hero.jpg',
  sasuke: '/assets/sasuke_hero.jpg',
  kakashi: '/assets/kakashi_hero.jpg',
  gaara: '/assets/gaara_hero.jpg',
  itachi: '/assets/itachi_hero.jpg',
  minato: '/assets/minato_hero.jpg',
  lee: '/assets/naruto_hero.jpg',
  pain: '/assets/itachi_hero.jpg',
};


