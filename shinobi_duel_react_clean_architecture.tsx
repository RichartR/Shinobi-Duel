import React, { useReducer, useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Sword, Shield, Scroll, Sparkles, Volume2, VolumeX, 
  RotateCcw, BookOpen, Layers, Cpu, Users, ChevronRight, 
  Copy, Check, Terminal, Eye, Flame, Zap, Compass, Award
} from 'lucide-react';

/* ============================================================================
 * 🏛️ CAPA 1: INFRASTRUCTURE LAYER (infrastructure/)
 * Adaptadores externos: Assets verificados de Anime + Fallbacks SVG deterministas
 * y Motor de Síntesis de Audio (Web Audio API) sin dependencias externas.
 * ============================================================================ */

// --- FILE: src/infrastructure/assets/animeAssets.js ---
const svgToDataUri = (svgString) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;

export const JUTSU_ANIME_CUTINS = {
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

export const CHAR_SVG_FALLBACKS = {
  naruto: svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#ea580c"/><polygon points="10,45 25,10 45,32 60,5 75,32 95,10 110,45" fill="#facc15"/><circle cx="60" cy="68" r="34" fill="#fed7aa"/><rect x="24" y="34" width="72" height="16" rx="3" fill="#1e293b"/><rect x="38" y="37" width="44" height="10" rx="2" fill="#cbd5e1"/><circle cx="48" cy="64" r="4.5" fill="#0284c7"/><circle cx="72" cy="64" r="4.5" fill="#0284c7"/><path d="M32,74 L42,72 M32,80 L42,78 M88,74 L78,72 M88,80 L78,78" stroke="#7c2d12" stroke-width="2"/></svg>`),
  sasuke: svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#1e1b4b"/><polygon points="10,20 35,55 15,85 50,30 70,30 105,85 85,55 110,20 60,10" fill="#09090b"/><circle cx="60" cy="68" r="32" fill="#ffedd5"/><circle cx="48" cy="64" r="5" fill="#dc2626"/><circle cx="72" cy="64" r="5" fill="#dc2626"/></svg>`),
  minato: svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#0284c7"/><polygon points="15,85 25,25 45,15 60,5 75,15 95,25 105,85 85,45 35,45" fill="#fde047"/><circle cx="60" cy="68" r="31" fill="#ffedd5"/><circle cx="48" cy="64" r="4.5" fill="#0284c7"/><circle cx="72" cy="64" r="4.5" fill="#0284c7"/></svg>`),
  gaara:  svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#78350f"/><polygon points="20,45 35,15 60,22 85,15 100,45" fill="#991b1b"/><circle cx="60" cy="68" r="32" fill="#fde68a"/><circle cx="48" cy="65" r="6" fill="#000"/><circle cx="72" cy="65" r="6" fill="#000"/><circle cx="48" cy="65" r="3.5" fill="#2dd4bf"/><circle cx="72" cy="65" r="3.5" fill="#2dd4bf"/><text x="74" y="54" fill="#dc2626" font-size="12" font-weight="900">愛</text></svg>`),
  itachi: svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#450a0a"/><circle cx="60" cy="68" r="32" fill="#fed7aa"/><rect x="26" y="34" width="68" height="15" fill="#1e293b"/><line x1="42" y1="41" x2="78" y2="41" stroke="#dc2626" stroke-width="2.5"/><circle cx="48" cy="64" r="5" fill="#dc2626"/><circle cx="72" cy="64" r="5" fill="#dc2626"/><path d="M44,70 L40,84 M76,70 L80,84" stroke="#475569" stroke-width="1.5"/></svg>`),
  lee:    svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#15803d"/><circle cx="60" cy="68" r="33" fill="#fed7aa"/><path d="M25,58 C25,22 95,22 95,58 Z" fill="#09090b"/><rect x="38" y="54" width="16" height="5" fill="#09090b"/><rect x="66" y="54" width="16" height="5" fill="#09090b"/><circle cx="46" cy="66" r="6.5" fill="#09090b"/><circle cx="74" cy="66" r="6.5" fill="#09090b"/></svg>`),
  kakashi: svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#334155"/><polygon points="20,48 35,8 65,12 95,5 105,48" fill="#e2e8f0"/><circle cx="60" cy="68" r="32" fill="#fed7aa"/><rect x="28" y="64" width="64" height="32" rx="6" fill="#1e293b"/><rect x="24" y="36" width="72" height="15" fill="#0f172a"/><circle cx="48" cy="58" r="4.5" fill="#dc2626"/><circle cx="72" cy="58" r="4.5" fill="#0f172a"/></svg>`),
  pain:    svgToDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#3b0764"/><polygon points="15,48 30,12 60,6 90,12 105,48" fill="#f97316"/><circle cx="60" cy="68" r="32" fill="#fed7aa"/><circle cx="48" cy="64" r="6" fill="#a855f7" stroke="#1e1b4b" stroke-width="1.5"/><circle cx="72" cy="64" r="6" fill="#a855f7" stroke="#1e1b4b" stroke-width="1.5"/></svg>`)
};

// --- FILE: src/infrastructure/audio/ShinobiAudioEngine.js ---
class ShinobiAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  play(effect) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (effect === 'select') {
        // Metallic Kunai / Hand seal click
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(1240, now + 0.06);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (effect === 'move') {
        // Deep Taiko Drum Strike
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(135, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (effect === 'scroll') {
        // Hand Seal Chord
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.1, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + 0.36);
        });
      } else if (effect === 'spin') {
        // Rapid Chakra Wheel Ticks
        for (let i = 0; i < 10; i++) {
          const t = now + i * 0.14;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(320 + i * 35, t);
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.045);
        }
      } else if (effect === 'ko') {
        // Heavy Fuinjutsu Seal Impact
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(98, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.45);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.48);
      } else if (effect === 'win') {
        // Victory Shamisen / Fanfare Arpeggio
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
          const t = now + idx * 0.11;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.56);
        });
      }
    } catch {
      // Ignore audio policies on un-interacted frames
    }
  }
}

export const soundEngine = new ShinobiAudioEngine();


/* ============================================================================
 * 🧠 CAPA 2: DOMAIN LAYER (domain/) — CERO DEPENDENCIAS DE REACT
 * Entidades puras, Topología de Grafos (28 Nodos), Reglas de Ruleta Pokémon Duel,
 * Servicio de Rodeo (Surround) y Motor Heurístico IA Akatsuki.
 * ============================================================================ */

// --- FILE: src/domain/entities/ShinobiFigure.js ---
export const WHEEL_COLORS = {
  white:  { id: 'white',  fill: '#f8fafc', text: '#0f172a', label: 'Blanco (Físico)' },
  gold:   { id: 'gold',   fill: '#eab308', text: '#0f172a', label: 'Dorado (Veloz)' },
  purple: { id: 'purple', fill: '#7e22ce', text: '#ffffff', label: 'Morado (Jutsu ★)' },
  blue:   { id: 'blue',   fill: '#0284c7', text: '#ffffff', label: 'Azul (Kawarimi)' },
  red:    { id: 'red',    fill: '#b91c1c', text: '#ffffff', label: 'Rojo (Fallo)' }
};

export const WHEEL_TOTAL_SEGMENTS = 96;
export const MAX_PLATE_CAPACITY = 6;
export const DEFAULT_TEAM_KEYS = ['minato', 'lee', 'itachi', 'gaara', 'naruto', 'sasuke'];
export const DEFAULT_PLATE_DECK = ['double', 'power30', 'mpboost', 'swap', 'goalblock'];

export const STATUS_CONDITIONS = {
  burned: {
    id: 'burned',
    kanji: '炎',
    label: 'Quemadura (Amaterasu)',
    color: '#f97316',
    desc: '-20 DMG en ataques y su sector más pequeño se convierte en Fallo Rojo.'
  },
  paralyzed: {
    id: 'paralyzed',
    kanji: '痺',
    label: 'Parálisis (Raiton)',
    color: '#facc15',
    desc: 'El sector no-Rojo más pequeño pasa a ser Fallo Rojo.'
  },
  confused: {
    id: 'confused',
    kanji: '幻',
    label: 'Confusión (Genjutsu)',
    color: '#c084fc',
    desc: 'El resultado del giro se desplaza automáticamente +1 sector.'
  },
  frozen: {
    id: 'frozen',
    kanji: '砂',
    label: 'Sellado de Arena (Congelado)',
    color: '#38bdf8',
    desc: 'Inmovilizado y su ruleta pasa a ser 100% Fallo Rojo hasta que un aliado adyacente lo toque.'
  }
};

export const TACTICAL_SCROLLS_CATALOG = [
  { id: 'power30',   name: 'Píldora +30',    kanji: '薬', cost: 1, desc: '+30 Poder en ataques Blancos o Dorados este turno' },
  { id: 'double',    name: 'Sharingan',      kanji: '眼', cost: 1, desc: 'Doble Oportunidad: permite re-girar tu disco en duelo' },
  { id: 'mpboost',   name: '+1 Paso MP',     kanji: '瞬', cost: 1, desc: '+1 MP a cualquier ninja de 1 o 2 MP durante este turno' },
  { id: 'swap',      name: 'Kawarimi',       kanji: '替', cost: 1, desc: 'Intercambia la posición de 2 aliados en el campo' },
  { id: 'desperate', name: 'Sello +50',      kanji: '魂', cost: 1, desc: 'Ataques de 60 DMG o menos ganan +50 DMG este turno' },
  { id: 'fullheal',  name: 'Curación',       kanji: '癒', cost: 1, desc: 'Elimina cualquier estado alterado de un aliado' },
  { id: 'goalblock', name: 'Goal Block',     kanji: '陣', cost: 2, desc: 'Teletransporta un aliado del campo a tu Monumento Hokage y termina el turno' },
  { id: 'maxrevive', name: 'Edo Tensei',     kanji: '蘇', cost: 2, desc: 'Devuelve un ninja de la Prisión Fuinjutsu al Banquillo sin Espera' }
];

export const SHINOBI_FIGURES_CATALOG = [
  {
    key: 'minato',
    rarity: 'EX',
    archetype: 'Corredor Anti-Jutsu (Arquetipo Mew)',
    naturalCounter: 'Destruye a Itachi (Morado) con 50% Dorado; sufre contra Rock Lee (110 DMG).',
    name: 'Minato Namikaze',
    shortName: 'Minato',
    kanji: '閃',
    rank: 'EX • Yondaime Hokage',
    title: 'Destello Amarillo de Konoha',
    mp: 3,
    canPassThrough: true,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/14/128074.jpg',
    jutsuKey: 'hiraishin',
    signatureJp: '飛雷神の術',
    signatureName: 'Hiraishin — Dios del Trueno Volador',
    ability: 'Salto Espacio-Temporal (0% Morado): Con 48/96 Dorado destruye técnicas Moradas. Su Hiraishin (50 DMG) sobrevive e impide ser noqueado si el rival gira 100 DMG o más.',
    segments: [
      { name: 'Hiraishin no Jutsu', jp: '飛雷神の術', color: 'gold', power: 50, stars: 0, size: 48, effect: 'survive_100_plus', jutsuKey: 'hiraishin' },
      { name: 'Rasengan Relámpago', jp: '閃光螺旋丸', color: 'white', power: 70, stars: 0, size: 24, effect: null, jutsuKey: 'rasengan' },
      { name: 'Shunshin (Evasión)', jp: '瞬身の術', color: 'blue', power: 0, stars: 0, size: 20, effect: 'dodge', jutsuKey: 'hiraishin' },
      { name: 'Kunai Desviado (Fallo)', jp: '不発', color: 'red', power: 0, stars: 0, size: 4, effect: null, jutsuKey: 'hiraishin' }
    ]
  },
  {
    key: 'lee',
    rarity: 'R',
    archetype: 'Taijutsu Puro (Arquetipo Machamp / Hitmonlee)',
    naturalCounter: 'Aplasta a Minato con 110/140 Blanco; cae fácil ante el Genjutsu Morado de Itachi.',
    name: 'Rock Lee',
    shortName: 'Rock Lee',
    kanji: '蓮',
    rank: 'R • Maestro Taijutsu',
    title: 'Bestia Verde de Konoha',
    mp: 3,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/14/433353.jpg',
    jutsuKey: 'lotus',
    signatureJp: '表蓮華・裏蓮華',
    signatureName: 'Ura Renge — Loto Oculto (8 Puertas)',
    ability: 'Restricción de Taijutsu Puro (0% Morado, 0% Azul): Incapaz de usar Ninjutsu, Genjutsu ni esquivas Azules. Si gana con Ura Renge (140 DMG), sufre Espera 2 por desgaste muscular.',
    evolutionData: {
      rarity: 'EX',
      name: 'Rock Lee (6.ª Puerta)',
      shortName: 'Lee 6P',
      rank: 'EX • Puerta de la Visión',
      kanji: '門',
      bonusDmg: 10,
      bonusStars: 1,
      ability: 'Despertar de las Ocho Puertas: +10 DMG en todos sus ataques de Taijutsu.'
    },
    segments: [
      { name: 'Omote Renge (Loto Primario)', jp: '表蓮華', color: 'white', power: 110, stars: 0, size: 32, effect: null, jutsuKey: 'lotus' },
      { name: 'Konoha Senpū (Huracán)', jp: '木ノ葉旋風', color: 'gold', power: 60, stars: 0, size: 28, effect: null, jutsuKey: 'lotus' },
      { name: 'Ura Renge (8 Puertas)', jp: '裏蓮華', color: 'white', power: 140, stars: 0, size: 16, effect: 'self_wait_2', jutsuKey: 'lotus' },
      { name: 'Agotamiento Muscular (Fallo)', jp: '反動', color: 'red', power: 0, stars: 0, size: 20, effect: null, jutsuKey: 'lotus' }
    ]
  },
  {
    key: 'itachi',
    rarity: 'EX',
    archetype: 'Controlador Genjutsu (Arquetipo Lucario / Gengar)',
    naturalCounter: 'Domina a atacantes Blancos (Lee, Naruto, Gaara); es destruido por el Dorado de Minato.',
    name: 'Itachi Uchiha',
    shortName: 'Itachi',
    kanji: '朱',
    rank: 'EX • Rango S Akatsuki',
    title: 'Señor del Mangekyō Sharingan',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/9/284122.jpg',
    jutsuKey: 'tsukuyomi',
    signatureJp: '月読・天照',
    signatureName: 'Tsukuyomi — Reino de Pesadilla',
    ability: 'Maestro del Genjutsu (62.5% Morado, 0% Dorado): Sus ataques Morados no hacen daño numérico sino efectos de estado letales. Vulnerable a ataques Dorados veloces.',
    segments: [
      { name: 'Tsukuyomi (Sello Directo)', jp: '月読', color: 'purple', power: 0, stars: 3, size: 36, effect: 'instant_ko', jutsuKey: 'tsukuyomi' },
      { name: 'Amaterasu (Llama Negra)', jp: '天照', color: 'purple', power: 0, stars: 2, size: 24, effect: 'burn_knockback', jutsuKey: 'amaterasu' },
      { name: 'Katon: Gōkakyū no Jutsu', jp: '豪火球の術', color: 'white', power: 80, stars: 0, size: 16, effect: null, jutsuKey: 'amaterasu' },
      { name: 'Clon de Cuervos', jp: '烏分身', color: 'blue', power: 0, stars: 0, size: 12, effect: 'dodge_confuse', jutsuKey: 'tsukuyomi' },
      { name: 'Ceguera Mangekyō (Fallo)', jp: '失明', color: 'red', power: 0, stars: 0, size: 8, effect: null, jutsuKey: 'tsukuyomi' }
    ]
  },
  {
    key: 'gaara',
    rarity: 'EX',
    archetype: 'Bastión Defensivo (Arquetipo Blastoise / Aggron)',
    naturalCounter: 'Frena en seco a corredores y asesinos con 36/96 Azul e inmunidad a Rodeo.',
    name: 'Gaara del Desierto',
    shortName: 'Gaara',
    kanji: '愛',
    rank: 'EX • Kazekage de Suna',
    title: 'Defensa Absoluta de Arena',
    mp: 1,
    blocksPassThrough: true,
    immuneToSurround: true,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/10/293375.jpg',
    jutsuKey: 'sabaku',
    signatureJp: '砂瀑送葬',
    signatureName: 'Sabaku Sōsō — Funeral del Desierto',
    ability: 'Muro Inexpugnable (37.5% Azul, 0% Dorado): Inmune a Rodeo (Surround) y bloquea saltos espaciales. Prisión de Arena (★★) congela en arena al enemigo.',
    segments: [
      { name: 'Escudo de Shukaku', jp: '砂の盾', color: 'blue', power: 0, stars: 0, size: 36, effect: 'dodge', jutsuKey: 'sabaku' },
      { name: 'Ataúd de Arena', jp: '砂瀑送葬', color: 'white', power: 130, stars: 0, size: 32, effect: null, jutsuKey: 'sabaku' },
      { name: 'Prisión de Arena (Sello)', jp: '砂縛柩', color: 'purple', power: 0, stars: 2, size: 16, effect: 'freeze_seal', jutsuKey: 'sabaku' },
      { name: 'Grieta en la Armadura (Fallo)', jp: '崩壊', color: 'red', power: 0, stars: 0, size: 12, effect: null, jutsuKey: 'sabaku' }
    ]
  },
  {
    key: 'naruto',
    rarity: 'EX',
    archetype: 'Brawler Ofensivo (Arquetipo Charizard / Pikachu EX)',
    naturalCounter: 'Supera en poder bruto a la mayoría (130/90 Blanco + 50 Dorado), pero tiene 0% Azul y 0% Morado.',
    name: 'Naruto Uzumaki',
    shortName: 'Naruto',
    kanji: '渦',
    rank: 'EX • Jinchūriki Kyūbi',
    title: 'Héroe de la Hoja',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/2/284121.jpg',
    jutsuKey: 'rasengan',
    signatureJp: '風遁・螺旋手裏剣',
    signatureName: 'Fūton: Rasenshuriken',
    ability: 'Asalto Frontal Implacable (62.5% Blanco, 25% Dorado, 0% Azul, 0% Morado): Nunca esquiva; evoluciona a Modo Sabio Kurama [UX] al derrotar a un rival.',
    evolutionData: {
      rarity: 'UX',
      name: 'Naruto Modo Kurama',
      shortName: 'Naruto UX',
      rank: 'UX • Jinchūriki Perfecto',
      kanji: '九',
      bonusDmg: 10,
      bonusStars: 1,
      ability: 'Manto de Chakra de Kurama: +10 DMG en todos sus ataques Blancos y Dorados.'
    },
    segments: [
      { name: 'Fūton: Rasenshuriken', jp: '螺旋手裏剣', color: 'white', power: 130, stars: 0, size: 32, effect: null, jutsuKey: 'rasengan' },
      { name: 'Rasengan Clásico', jp: '螺旋丸', color: 'white', power: 90, stars: 0, size: 28, effect: null, jutsuKey: 'rasengan' },
      { name: 'Naruto Rendan (Clones)', jp: '影分身連弾', color: 'gold', power: 50, stars: 0, size: 24, effect: null, jutsuKey: 'kagebunshin' },
      { name: 'Choque de Chakra (Fallo)', jp: '暴走', color: 'red', power: 0, stars: 0, size: 12, effect: null, jutsuKey: 'rasengan' }
    ]
  },
  {
    key: 'sasuke',
    rarity: 'EX',
    archetype: 'Asesino Táctico Híbrido (Arquetipo Sceptile / Greninja)',
    naturalCounter: 'Versátil con Kirin (140 DMG) y Genjutsu (★★), pero carece por completo de defensa Azul (0% Azul).',
    name: 'Sasuke Uchiha',
    shortName: 'Sasuke',
    kanji: '雷',
    rank: 'EX • Clan Uchiha',
    title: 'Ejecutor del Sharingan',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/9/131317.jpg',
    jutsuKey: 'chidori',
    signatureJp: '麒麟・千鳥',
    signatureName: 'Kirin — Relámpago Celestial',
    ability: 'Filo Relámpago (0% Azul): Sacrifica toda defensa Azul a cambio de letalidad. Evoluciona a Susanoo [UX] tras ganar un duelo.',
    evolutionData: {
      rarity: 'UX',
      name: 'Sasuke Susanoo',
      shortName: 'Sasuke UX',
      rank: 'UX • Mangekyō Eterno',
      kanji: '須',
      bonusDmg: 10,
      bonusStars: 1,
      ability: 'Flecha de Indra Susanoo: +10 DMG y +1★ en toda su ruleta.'
    },
    segments: [
      { name: 'Chidori Nagashi', jp: '千鳥流し', color: 'white', power: 100, stars: 0, size: 32, effect: 'paralyze_enemy', jutsuKey: 'chidori' },
      { name: 'Kirin (Trueno Celestial)', jp: '麒麟', color: 'white', power: 140, stars: 0, size: 24, effect: null, jutsuKey: 'chidori' },
      { name: 'Genjutsu: Sharingan', jp: '写輪眼・幻術', color: 'purple', power: 0, stars: 2, size: 24, effect: 'confuse_wait', jutsuKey: 'amaterasu' },
      { name: 'Chidori Senbon', jp: '千鳥千本', color: 'gold', power: 40, stars: 0, size: 8, effect: null, jutsuKey: 'chidori' },
      { name: 'Sobrecarga de Marca (Fallo)', jp: '呪印反動', color: 'red', power: 0, stars: 0, size: 8, effect: null, jutsuKey: 'chidori' }
    ]
  },
  {
    key: 'kakashi',
    rarity: 'EX',
    archetype: 'Estratega Equilibrado (Arquetipo Zapdos / Virizion)',
    naturalCounter: 'Raikiri Dorado (80 DMG) corta Jutsus Morados y Kamui (★★) desplaza tanques.',
    name: 'Kakashi Hatake',
    shortName: 'Kakashi',
    kanji: '写',
    rank: 'EX • Sexto Hokage',
    title: 'El Ninja que Copia',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/7/284129.jpg',
    jutsuKey: 'chidori',
    signatureJp: '雷切・神威',
    signatureName: 'Raikiri & Kamui Mangekyō',
    ability: 'Versatilidad ANBU: Combina Raikiri Dorado (80 DMG), Kamui Morado (★★) y clon de rayo paralizante.',
    segments: [
      { name: 'Raikiri (Cortador Relámpago)', jp: '雷切', color: 'gold', power: 80, stars: 0, size: 32, effect: null, jutsuKey: 'chidori' },
      { name: 'Kamui (Distorsión)', jp: '神威', color: 'purple', power: 0, stars: 2, size: 24, effect: 'push_wait', jutsuKey: 'tsukuyomi' },
      { name: 'Clon de Rayo (Raiton)', jp: '雷遁影分身', color: 'white', power: 90, stars: 0, size: 20, effect: 'paralyze_enemy', jutsuKey: 'chidori' },
      { name: 'Doton: Muro de Tierra', jp: '土流壁', color: 'blue', power: 0, stars: 0, size: 12, effect: 'dodge', jutsuKey: 'sabaku' },
      { name: 'Agotamiento de Chakra', jp: '消耗', color: 'red', power: 0, stars: 0, size: 8, effect: null, jutsuKey: 'chidori' }
    ]
  },
  {
    key: 'pain',
    rarity: 'UX',
    archetype: 'Dominador Gravitacional (Arquetipo Deoxys / Lunala)',
    naturalCounter: 'Shinra Tensei (★★★) empuja rivales y Banshō Tenin (120 DMG) aplasta líneas frontales.',
    name: 'Pain (Camino Deva)',
    shortName: 'Pain',
    kanji: '神',
    rank: 'UX • Líder de Akatsuki',
    title: 'Portador del Rinnegan',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/8/73473.jpg',
    jutsuKey: 'tsukuyomi',
    signatureJp: '神羅天征',
    signatureName: 'Shinra Tensei — Juicio Divino',
    ability: 'Seis Caminos del Dolor: Shinra Tensei (★★★) desplaza al enemigo con Espera 2 y Chibaku Tensei (130 DMG) domina choques.',
    segments: [
      { name: 'Chibaku Tensei', jp: '地爆天星', color: 'white', power: 130, stars: 0, size: 32, effect: null, jutsuKey: 'sabaku' },
      { name: 'Shinra Tensei (Repulsión)', jp: '神羅天征', color: 'purple', power: 0, stars: 3, size: 28, effect: 'push_wait', jutsuKey: 'tsukuyomi' },
      { name: 'Banshō Tenin', jp: '万象天引', color: 'white', power: 90, stars: 0, size: 20, effect: null, jutsuKey: 'rasengan' },
      { name: 'intervalo de 5 Segundos (Fallo)', jp: '隙', color: 'red', power: 0, stars: 0, size: 16, effect: null, jutsuKey: 'tsukuyomi' }
    ]
  }
];

export function getComputedFigureSegments(figure) {
  const baseList = (figure.baseSegments || figure.segments || []).map(s => ({ ...s }));
  const levelBonus = Math.max(0, (figure.level || 1) - 1);
  const clvBonus = Math.max(0, figure.clv || 0);
  const lvIdx = figure.lvTargetIndex ?? 0;
  const clvIdx = figure.clvTargetIndex ?? 0;

  // 1. Apply Level (Lv.1-5): Reduces Red Miss and expands selected non-Red segment (preserving 96 total)
  const redIndex = baseList.findIndex(s => s.color === 'red');
  if (levelBonus > 0 && redIndex !== -1 && baseList[lvIdx] && baseList[lvIdx].color !== 'red') {
    const reducible = Math.min(levelBonus, Math.max(0, baseList[redIndex].size - 4));
    baseList[redIndex].size -= reducible;
    baseList[lvIdx].size += reducible;
  }

  // 2. Apply Chain Level (CLv +1 to +10 DMG) and Evolution bonuses (+10 DMG / +1 Star)
  const evoDmg = figure.evolved && figure.evolutionData ? figure.evolutionData.bonusDmg : 0;
  const evoStars = figure.evolved && figure.evolutionData ? figure.evolutionData.bonusStars : 0;

  baseList.forEach((seg, idx) => {
    if (seg.color === 'white' || seg.color === 'gold') {
      seg.power += evoDmg + (idx === clvIdx ? clvBonus : 0);
    } else if (seg.color === 'purple') {
      seg.stars += evoStars;
    }
  });

  // 3. Apply Status Conditions (Burned / Paralyzed turn smallest non-red segment into Red Miss; Frozen turns wheel 100% Red)
  if (figure.status === 'frozen') {
    return [
      {
        name: 'Sellado en Arena (Congelado)',
        jp: '砂縛凍結',
        color: 'red',
        power: 0,
        stars: 0,
        size: WHEEL_TOTAL_SEGMENTS,
        effect: null,
        jutsuKey: 'sabaku'
      }
    ];
  }

  if (figure.status === 'burned' || figure.status === 'paralyzed') {
    let minIdx = -1;
    let minSize = 999;
    baseList.forEach((seg, idx) => {
      if (seg.color !== 'red' && seg.size < minSize) {
        minSize = seg.size;
        minIdx = idx;
      }
    });
    if (minIdx !== -1) {
      baseList[minIdx] = {
        ...baseList[minIdx],
        name: `${baseList[minIdx].name} (${figure.status === 'burned' ? 'Quemado' : 'Paralizado'})`,
        color: 'red',
        power: 0,
        stars: 0,
        effect: null
      };
    }
  }

  return baseList;
}

export function getFigureColorBreakdown(segments) {
  const totals = { white: 0, gold: 0, purple: 0, blue: 0, red: 0 };
  segments.forEach(s => {
    totals[s.color] = (totals[s.color] || 0) + s.size;
  });
  return totals;
}

export function instantiateTeamRoster(playerNumber, teamKeys = DEFAULT_TEAM_KEYS, customizations = {}) {
  const chosenTemplates = teamKeys
    .map(k => SHINOBI_FIGURES_CATALOG.find(t => t.key === k))
    .filter(Boolean);

  return chosenTemplates.map((tpl, idx) => {
    const custom = customizations[tpl.key] || { level: 5, clv: 1, lvTargetIndex: 0, clvTargetIndex: 0 };
    const figObj = {
      id: `p${playerNumber}_${tpl.key}_${idx}`,
      owner: playerNumber,
      key: tpl.key,
      rarity: tpl.rarity,
      archetype: tpl.archetype,
      naturalCounter: tpl.naturalCounter,
      name: tpl.name,
      shortName: tpl.shortName,
      kanji: tpl.kanji,
      rank: tpl.rank,
      title: tpl.title,
      baseMp: tpl.mp,
      portraitUrl: tpl.portraitUrl,
      jutsuKey: tpl.jutsuKey,
      signatureJp: tpl.signatureJp,
      signatureName: tpl.signatureName,
      ability: tpl.ability,
      evolutionData: tpl.evolutionData ? { ...tpl.evolutionData } : null,
      evolved: false,
      level: custom.level ?? 5,
      clv: custom.clv ?? 1,
      lvTargetIndex: custom.lvTargetIndex ?? 0,
      clvTargetIndex: custom.clvTargetIndex ?? 0,
      canPassThrough: Boolean(tpl.canPassThrough),
      blocksPassThrough: Boolean(tpl.blocksPassThrough),
      immuneToSurround: Boolean(tpl.immuneToSurround),
      baseSegments: tpl.segments.map(s => ({ ...s })),
      segments: [],
      location: 'bench', // 'bench' | 'board' | 'ko'
      benchIndex: idx,
      nodeId: null,
      wait: 0,
      status: null
    };
    figObj.segments = getComputedFigureSegments(figObj);
    return figObj;
  });
}


// --- FILE: src/domain/entities/BoardGraph.js ---
export const BOARD_NODES = [
  // Top Outer Row (P2 Side - Akatsuki)
  { id: 0,  x: 80,  y: 58,  type: 'entry_p2', label: 'INFILTRACIÓN' },
  { id: 1,  x: 210, y: 58,  type: 'normal' },
  { id: 2,  x: 340, y: 52,  type: 'goal_p2',  label: 'BASE AKATSUKI' },
  { id: 3,  x: 470, y: 58,  type: 'normal' },
  { id: 4,  x: 600, y: 58,  type: 'entry_p2', label: 'INFILTRACIÓN' },

  // Left Outer Lane
  { id: 5,  x: 80,  y: 152, type: 'normal' },
  { id: 6,  x: 80,  y: 234, type: 'normal' },
  { id: 7,  x: 80,  y: 316, type: 'normal' },
  { id: 8,  x: 80,  y: 398, type: 'normal' },

  // Right Outer Lane
  { id: 9,  x: 600, y: 152, type: 'normal' },
  { id: 10, x: 600, y: 234, type: 'normal' },
  { id: 11, x: 600, y: 316, type: 'normal' },
  { id: 12, x: 600, y: 398, type: 'normal' },

  // Bottom Outer Row (P1 Side - Konoha)
  { id: 13, x: 80,  y: 492, type: 'entry_p1', label: 'INFILTRACIÓN' },
  { id: 14, x: 210, y: 492, type: 'normal' },
  { id: 15, x: 340, y: 498, type: 'goal_p1',  label: 'MONUMENTO HOKAGE' },
  { id: 16, x: 470, y: 492, type: 'normal' },
  { id: 17, x: 600, y: 492, type: 'entry_p1', label: 'INFILTRACIÓN' },

  // Inner Sanctuary Ring (10 Tactical Nodes)
  { id: 18, x: 210, y: 165, type: 'inner' },
  { id: 19, x: 340, y: 165, type: 'inner' },
  { id: 20, x: 470, y: 165, type: 'inner' },
  { id: 21, x: 210, y: 238, type: 'inner' },
  { id: 22, x: 210, y: 312, type: 'inner' },
  { id: 23, x: 470, y: 238, type: 'inner' },
  { id: 24, x: 470, y: 312, type: 'inner' },
  { id: 25, x: 210, y: 385, type: 'inner' },
  { id: 26, x: 340, y: 385, type: 'inner' },
  { id: 27, x: 470, y: 385, type: 'inner' }
];

export const BOARD_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [13, 14], [14, 15], [15, 16], [16, 17],
  [0, 5], [5, 6], [6, 7], [7, 8], [8, 13],
  [4, 9], [9, 10], [10, 11], [11, 12], [12, 17],
  [18, 19], [19, 20], [20, 23], [23, 24], [24, 27],
  [27, 26], [26, 25], [25, 22], [22, 21], [21, 18],
  [0, 18], [4, 20], [13, 25], [17, 27],
  [2, 19], [15, 26],
  [6, 21], [7, 22], [10, 23], [11, 24]
];

export const ADJACENCY_LIST = BOARD_NODES.reduce((acc, node) => {
  acc[node.id] = [];
  return acc;
}, {});

BOARD_EDGES.forEach(([a, b]) => {
  ADJACENCY_LIST[a].push(b);
  ADJACENCY_LIST[b].push(a);
});

export function getFigureAtNode(figures, nodeId) {
  return figures.find(f => f.location === 'board' && f.nodeId === nodeId) || null;
}

export function calculateEffectiveMp(figure, turnCount, playerBuffs) {
  let mp = figure.baseMp;
  if (turnCount === 1) {
    mp = Math.max(1, mp - 1);
  }
  if (playerBuffs?.mpBonus > 0 && figure.baseMp <= 2) {
    mp += playerBuffs.mpBonus;
  }
  return mp;
}

export function getReachableNodes(figure, figures, turnCount, playerBuffs) {
  if (!figure || figure.wait > 0 || figure.location === 'ko') return {};
  const mp = calculateEffectiveMp(figure, turnCount, playerBuffs);
  if (mp <= 0) return {};

  const reachable = {};

  const bfsExplore = (startNodeId, maxSteps, initialPath) => {
    if (maxSteps <= 0) return;
    const queue = [{ nodeId: startNodeId, stepsLeft: maxSteps, path: initialPath }];
    const visitedBest = { [startNodeId]: maxSteps };

    while (queue.length > 0) {
      const current = queue.shift();
      if (current.stepsLeft <= 0) continue;

      const neighbors = ADJACENCY_LIST[current.nodeId] || [];
      for (const nextId of neighbors) {
        const occupant = getFigureAtNode(figures, nextId);
        if (occupant) {
          if (!figure.canPassThrough || occupant.blocksPassThrough) continue;
        }
        const rem = current.stepsLeft - 1;
        if (visitedBest[nextId] !== undefined && visitedBest[nextId] >= rem) continue;
        visitedBest[nextId] = rem;

        const nextPath = [...current.path, nextId];
        if (!occupant) {
          reachable[nextId] = nextPath;
        }
        if (rem > 0) {
          queue.push({ nodeId: nextId, stepsLeft: rem, path: nextPath });
        }
      }
    }
  };

  if (figure.location === 'bench') {
    const entryType = figure.owner === 1 ? 'entry_p1' : 'entry_p2';
    BOARD_NODES.filter(n => n.type === entryType).forEach(entry => {
      if (!getFigureAtNode(figures, entry.id)) {
        reachable[entry.id] = [entry.id];
        bfsExplore(entry.id, mp - 1, [entry.id]);
      }
    });
  } else if (figure.location === 'board') {
    bfsExplore(figure.nodeId, mp, [figure.nodeId]);
  }

  return reachable;
}

export function getAdjacentEnemyIds(figure, figures) {
  if (!figure || figure.location !== 'board' || figure.wait > 0) return [];
  const neighbors = ADJACENCY_LIST[figure.nodeId] || [];
  const enemyIds = [];
  neighbors.forEach(nId => {
    const occ = getFigureAtNode(figures, nId);
    if (occ && occ.owner !== figure.owner) {
      enemyIds.push(occ.id);
    }
  });
  return enemyIds;
}

export function bfsShortestDistance(startNode, targetNode) {
  if (startNode === targetNode) return 0;
  const visited = new Set([startNode]);
  const queue = [{ node: startNode, dist: 0 }];
  while (queue.length > 0) {
    const { node, dist } = queue.shift();
    for (const next of (ADJACENCY_LIST[node] || [])) {
      if (next === targetNode) return dist + 1;
      if (!visited.has(next)) {
        visited.add(next);
        queue.push({ node: next, dist: dist + 1 });
      }
    }
  }
  return 99;
}


// --- FILE: src/domain/services/SurroundService.js ---
export function evaluateSurroundAndInfirmary(figures, koQueue) {
  const nextFigures = figures.map(f => ({ ...f }));
  const nextKoQueue = { 1: [...koQueue[1]], 2: [...koQueue[2]] };
  const logs = [];

  const onBoard = nextFigures.filter(f => f.location === 'board');
  const surroundedIds = [];

  onBoard.forEach(fig => {
    if (fig.immuneToSurround) return; // Gaara's Sand Shield immunity
    const neighbors = ADJACENCY_LIST[fig.nodeId] || [];
    if (neighbors.length === 0) return;

    const allEnemyOccupied = neighbors.every(nId => {
      const occ = nextFigures.find(o => o.location === 'board' && o.nodeId === nId);
      return occ && occ.owner !== fig.owner;
    });

    if (allEnemyOccupied) {
      surroundedIds.push(fig.id);
    }
  });

  surroundedIds.forEach(id => {
    const target = nextFigures.find(f => f.id === id);
    if (target) {
      logs.push({
        text: `封 ¡RODEO FUINJUTSU! ${target.name} fue rodeado y sellado automáticamente.`,
        tone: 'ko'
      });
      sendUnitToInfirmaryPure(target, nextFigures, nextKoQueue, logs);
    }
  });

  return { figures: nextFigures, koQueue: nextKoQueue, logs, hadSurround: surroundedIds.length > 0 };
}

export function sendUnitToInfirmaryPure(targetFig, figuresList, koQueueMap, logsList) {
  targetFig.location = 'ko';
  targetFig.nodeId = null;
  targetFig.wait = 0;

  const ownerQueue = koQueueMap[targetFig.owner];
  ownerQueue.push(targetFig.id);

  if (ownerQueue.length > 2) {
    const releasedId = ownerQueue.shift();
    const releasedFig = figuresList.find(f => f.id === releasedId);
    if (releasedFig) {
      releasedFig.location = 'bench';
      releasedFig.nodeId = null;
      releasedFig.wait = 2;
      logsList.push({
        text: `解 ${releasedFig.name} sale de la Prisión Fuinjutsu al banquillo con Espera 2.`,
        tone: 'info'
      });
    }
  }
}


// --- FILE: src/domain/services/CombatResolver.js ---
export function spinFigureChakraWheel(figure) {
  const total = figure.segments.reduce((acc, s) => acc + s.size, 0);
  const rand = Math.random() * total;
  let cumulative = 0;

  for (let i = 0; i < figure.segments.length; i++) {
    const seg = figure.segments[i];
    const startPct = cumulative / total;
    cumulative += seg.size;
    const endPct = cumulative / total;

    if (rand <= cumulative || i === figure.segments.length - 1) {
      const midPct = (startPct + endPct) / 2;
      const jitter = (Math.random() - 0.5) * ((endPct - startPct) * 0.5);
      const targetFraction = midPct + jitter;
      const targetDeg = 360 - targetFraction * 360;
      return { segment: seg, index: i, targetDeg };
    }
  }
}

export function resolveChakraDuelOutcome(attacker, defender, segA, segD, activeBuffs) {
  const atkBurnPenalty = attacker.status === 'burned' ? -20 : 0;
  const defBurnPenalty = defender.status === 'burned' ? -20 : 0;

  const atkBonus = (segA.color === 'white' || segA.color === 'gold')
    ? (activeBuffs[attacker.owner]?.powerBonus || 0) + atkBurnPenalty
    : 0;
  const defBonus = (segD.color === 'white' || segD.color === 'gold')
    ? (activeBuffs[defender.owner]?.powerBonus || 0) + defBurnPenalty
    : 0;

  const powA = Math.max(0, segA.power + atkBonus);
  const powD = Math.max(0, segD.power + defBonus);

  // 1. BLUE (Dodge / Kawarimi) beats everything
  if (segA.color === 'blue' || segD.color === 'blue') {
    const dodger = segA.color === 'blue' ? attacker : defender;
    const dSeg = segA.color === 'blue' ? segA : segD;
    return {
      winner: 'none',
      hero: dodger,
      seg: dSeg,
      powA,
      powD,
      reason: `¡Defensa Azul (${dSeg.name} • ${dSeg.size}/96)! ${dodger.shortName} esquiva e invalida cualquier técnica.`
    };
  }

  // 2. RED (Miss) vulnerabilities
  if (segA.color === 'red' && segD.color === 'red') {
    return {
      winner: 'none',
      hero: attacker,
      seg: segA,
      powA,
      powD,
      reason: '¡Doble Fallo Rojo! Ambos ninjas pierden el equilibrio sin hacerse daño.'
    };
  }
  if (segA.color === 'red') {
    return {
      winner: segD.color === 'purple' ? 'def_purple' : 'def_ko',
      hero: defender,
      seg: segD,
      powA,
      powD,
      reason: `¡${attacker.shortName} cayó en Fallo Rojo (${segA.size}/96) y recibió ${segD.name} de ${defender.shortName}!`
    };
  }
  if (segD.color === 'red') {
    return {
      winner: segA.color === 'purple' ? 'atk_purple' : 'atk_ko',
      hero: attacker,
      seg: segA,
      powA,
      powD,
      reason: `¡${defender.shortName} cayó en Fallo Rojo (${segD.size}/96) y fue impactado por ${segA.name}!`
    };
  }

  // 3. GOLD priority destroys PURPLE Jutsus (0 DMG, Star-based)
  if (segA.color === 'gold' && segD.color === 'purple') {
    return {
      winner: 'atk_ko',
      hero: attacker,
      seg: segA,
      powA,
      powD,
      reason: `¡Prioridad Dorada! ${segA.name} (${powA} DMG) corta y destruye el Jutsu Morado (${'★'.repeat(segD.stars)}) de ${defender.shortName}.`
    };
  }
  if (segD.color === 'gold' && segA.color === 'purple') {
    return {
      winner: 'def_ko',
      hero: defender,
      seg: segD,
      powA,
      powD,
      reason: `¡Prioridad Dorada! ${segD.name} (${powD} DMG) corta y destruye el Jutsu Morado (${'★'.repeat(segA.stars)}) de ${attacker.shortName}.`
    };
  }

  // 4. PURPLE (0 DMG, Star-based) beats WHITE regardless of numeric power
  if (segA.color === 'purple' && segD.color === 'white') {
    return {
      winner: 'atk_purple',
      hero: attacker,
      seg: segA,
      powA,
      powD,
      reason: `¡Jutsu Morado (${'★'.repeat(segA.stars)} • 0 DMG) vence automáticamente al ataque Blanco (${powD} DMG) de ${defender.shortName}!`
    };
  }
  if (segD.color === 'purple' && segA.color === 'white') {
    return {
      winner: 'def_purple',
      hero: defender,
      seg: segD,
      powA,
      powD,
      reason: `¡Jutsu Morado (${'★'.repeat(segD.stars)} • 0 DMG) vence automáticamente al ataque Blanco (${powA} DMG) de ${attacker.shortName}!`
    };
  }

  // 5. PURPLE vs PURPLE star comparison
  if (segA.color === 'purple' && segD.color === 'purple') {
    if (segA.stars > segD.stars) {
      return {
        winner: 'atk_purple',
        hero: attacker,
        seg: segA,
        powA,
        powD,
        reason: `¡${segA.name} (${'★'.repeat(segA.stars)}) supera en rango estelar al Jutsu (${'★'.repeat(segD.stars)}) de ${defender.shortName}!`
      };
    }
    if (segD.stars > segA.stars) {
      return {
        winner: 'def_purple',
        hero: defender,
        seg: segD,
        powA,
        powD,
        reason: `¡${segD.name} (${'★'.repeat(segD.stars)}) supera en rango estelar al Jutsu (${'★'.repeat(segA.stars)}) de ${attacker.shortName}!`
      };
    }
    return {
      winner: 'none',
      hero: attacker,
      seg: segA,
      powA,
      powD,
      reason: `¡Choque de Jutsus Morados de igual rango (${'★'.repeat(segA.stars)})! Ambos se neutralizan.`
    };
  }

  // 6. Numeric Power Clash (WHITE/GOLD vs WHITE/GOLD) + Minato's Mew-like Hiraishin protection against >=100 DMG
  if (powA > powD) {
    if (segD.effect === 'survive_100_plus' && powA >= 100) {
      return {
        winner: 'none',
        hero: defender,
        seg: segD,
        powA,
        powD,
        reason: `¡Reflejo Hiraishin (Estilo Mew)! ${defender.shortName} evita ser noqueado porque ${segA.name} (${powA} DMG) es de 100 DMG o más.`
      };
    }
    return {
      winner: 'atk_ko',
      hero: attacker,
      seg: segA,
      powA,
      powD,
      reason: `¡${segA.name} (${powA} DMG) rompe la guardia de ${segD.name} (${powD} DMG)!`
    };
  }

  if (powD > powA) {
    if (segA.effect === 'survive_100_plus' && powD >= 100) {
      return {
        winner: 'none',
        hero: attacker,
        seg: segA,
        powA,
        powD,
        reason: `¡Reflejo Hiraishin (Estilo Mew)! ${attacker.shortName} evita ser noqueado porque ${segD.name} (${powD} DMG) es de 100 DMG o más.`
      };
    }
    return {
      winner: 'def_ko',
      hero: defender,
      seg: segD,
      powA,
      powD,
      reason: `¡Contraataque letal! ${segD.name} (${powD} DMG) supera a ${segA.name} (${powA} DMG)!`
    };
  }

  return {
    winner: 'none',
    hero: attacker,
    seg: segA,
    powA,
    powD,
    reason: `¡Empate exacto de poder (${powA} vs ${powD})! Ambos ninjas mantienen su posición.`
  };
}


// --- FILE: src/domain/services/AiTacticalEngine.js ---
export function computeBestAkatsukiMove(state) {
  const aiFigures = state.figures.filter(f => f.owner === 2 && f.location !== 'ko' && f.wait === 0);
  if (aiFigures.length === 0) return null;

  let bestDecision = null;
  let bestScore = -99999;

  aiFigures.forEach(fig => {
    const validNodes = getReachableNodes(fig, state.figures, state.turnCount, state.activeBuffs[2]);
    Object.keys(validNodes).forEach(nodeIdStr => {
      const targetNode = parseInt(nodeIdStr, 10);
      let score = 0;

      // 1. Instant Victory on Konoha Goal (Node 15)
      if (targetNode === 15) score += 10000;

      // 2. Defend Akatsuki Goal (Node 2) if threatened
      const p1ThreateningGoal = state.figures.some(
        f => f.owner === 1 && f.location === 'board' && bfsShortestDistance(f.nodeId, 2) <= 2
      );
      if (p1ThreateningGoal && targetNode === 2) score += 720;
      if (p1ThreateningGoal && bfsShortestDistance(targetNode, 2) === 1) score += 280;

      // 3. Simulate Surround KOs
      const simulatedFigures = state.figures.map(f =>
        f.id === fig.id ? { ...f, location: 'board', nodeId: targetNode } : f
      );

      simulatedFigures.filter(f => f.owner === 1 && f.location === 'board' && !f.immuneToSurround).forEach(enemy => {
        const adj = ADJACENCY_LIST[enemy.nodeId] || [];
        const surrounded = adj.every(nId => {
          const occ = getFigureAtNode(simulatedFigures, nId);
          return occ && occ.owner === 2;
        });
        if (surrounded) score += 920;
      });

      // Avoid stepping into a self-surround trap
      if (!fig.immuneToSurround) {
        const myAdj = ADJACENCY_LIST[targetNode] || [];
        const selfSurrounded = myAdj.every(nId => {
          const occ = getFigureAtNode(simulatedFigures, nId);
          return occ && occ.owner === 1;
        });
        if (selfSurrounded) score -= 1050;
      }

      // 4. Seal Konoha Infiltration Corners (Nodes 13 & 17)
      if (targetNode === 13 || targetNode === 17) score += 210;

      // 5. Advance toward Konoha Hokage Monument (Node 15)
      const distToP1Goal = bfsShortestDistance(targetNode, 15);
      score += (12 - distToP1Goal) * 20;

      // 6. Deploy from bench if board presence is low
      const deployedCount = state.figures.filter(f => f.owner === 2 && f.location === 'board').length;
      if (fig.location === 'bench' && deployedCount < 4) score += 80;

      score += Math.random() * 10;

      if (score > bestScore) {
        bestScore = score;
        bestDecision = { figureId: fig.id, targetNode };
      }
    });
  });

  return bestDecision;
}


/* ============================================================================
 * ⚙️ CAPA 3: APPLICATION LAYER (application/)
 * Máquina de Estados Finita (Reducer Puro) + Custom Hook Orquestador.
 * ============================================================================ */

// --- FILE: src/application/useCases/gameReducer.js ---
export function createDefaultCustomizations() {
  const map = {};
  SHINOBI_FIGURES_CATALOG.forEach(tpl => {
    map[tpl.key] = {
      level: 5, // Lv.5 por defecto para mostrar la reducción de Fallo Rojo (-4 Rojo / +4 Sector elegido)
      clv: 1,   // CLv +1 por defecto para mostrar desempates tácticos
      lvTargetIndex: 0,
      clvTargetIndex: 0
    };
  });
  return map;
}

export function createInitialGameState(
  mode = 'ai',
  selectedTeamKeys = DEFAULT_TEAM_KEYS,
  selectedPlateIds = DEFAULT_PLATE_DECK,
  customizations = createDefaultCustomizations()
) {
  const figures = [
    ...instantiateTeamRoster(1, selectedTeamKeys, customizations),
    ...instantiateTeamRoster(2, ['pain', 'itachi', 'sasuke', 'gaara', 'kakashi', 'minato'], customizations)
  ];

  const buildPlayerScrolls = (plateIds) =>
    plateIds.map((pid, idx) => {
      const tpl = TACTICAL_SCROLLS_CATALOG.find(s => s.id === pid) || TACTICAL_SCROLLS_CATALOG[0];
      return { ...tpl, slotId: `${pid}_${idx}`, used: false };
    });

  return {
    mode, // 'ai' | 'local'
    turnPlayer: 1,
    turnCount: 1,
    phase: 'SELECT', // 'SELECT' | 'SWAP_SELECT_1' | 'SWAP_SELECT_2' | 'GOAL_BLOCK_SELECT' | 'HEAL_SELECT' | 'REVIVE_SELECT' | 'POST_MOVE' | 'BATTLE' | 'GAMEOVER'
    selectedFigureId: null,
    inspectedFigureId: figures[0].id,
    swapCandidateId: null,
    validMoveNodes: {},
    validAttackFigureIds: [],
    selectedTeamKeys,
    selectedPlateIds,
    customizations,
    activeBuffs: {
      1: { powerBonus: 0, mpBonus: 0, doubleChance: false, desperateBoost: false, scrollUsedThisTurn: false },
      2: { powerBonus: 0, mpBonus: 0, doubleChance: false, desperateBoost: false, scrollUsedThisTurn: false }
    },
    figures,
    koQueue: { 1: [], 2: [] },
    scrolls: {
      1: buildPlayerScrolls(selectedPlateIds),
      2: buildPlayerScrolls(DEFAULT_PLATE_DECK)
    },
    currentBattle: null,
    winner: null,
    victoryReason: '',
    logs: [
      {
        id: 'init-1',
        turn: 1,
        text: '忍 ¡Comienza el Duelo Táctico en la Arena Chunin! Regla Turno 1: el jugador inicial tiene -1 MP.',
        tone: 'highlight'
      }
    ]
  };
}

function appendLogs(stateLogs, turn, newItems) {
  const formatted = newItems.map((item, idx) => ({
    id: `t${turn}_${Date.now()}_${idx}_${Math.random()}`,
    turn,
    text: item.text,
    tone: item.tone || 'normal'
  }));
  return [...formatted, ...stateLogs].slice(0, 60);
}

function evolveFigurePure(unit, logsList) {
  if (!unit || unit.evolved || !unit.evolutionData) return;
  unit.evolved = true;
  unit.rarity = unit.evolutionData.rarity;
  unit.name = unit.evolutionData.name;
  unit.shortName = unit.evolutionData.shortName;
  unit.rank = unit.evolutionData.rank;
  unit.kanji = unit.evolutionData.kanji;
  unit.ability = unit.evolutionData.ability;
  unit.segments = getComputedFigureSegments(unit);
  logsList.push({
    text: `🔥 ¡DESPERTAR / EVOLUCIÓN! ${unit.name} ha evolucionado a [${unit.rarity}] (+${unit.evolutionData.bonusDmg} DMG y +${unit.evolutionData.bonusStars}★ en toda su ruleta).`,
    tone: 'highlight'
  });
}

function advanceTurnPure(state, extraLogs = []) {
  const nextFigures = state.figures.map(f => {
    if (f.owner === state.turnPlayer && f.wait > 0) {
      return { ...f, wait: Math.max(0, f.wait - 1) };
    }
    return f;
  });

  const nextTurnPlayer = state.turnPlayer === 1 ? 2 : 1;
  const nextTurnCount = state.turnCount + 1;

  return {
    ...state,
    figures: nextFigures,
    turnPlayer: nextTurnPlayer,
    turnCount: nextTurnCount,
    phase: 'SELECT',
    selectedFigureId: null,
    swapCandidateId: null,
    validMoveNodes: {},
    validAttackFigureIds: [],
    activeBuffs: {
      ...state.activeBuffs,
      [state.turnPlayer]: {
        powerBonus: 0,
        mpBonus: 0,
        doubleChance: false,
        desperateBoost: false,
        scrollUsedThisTurn: false
      }
    },
    currentBattle: null,
    logs: appendLogs(state.logs, state.turnCount, extraLogs)
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'RESET_GAME': {
      return createInitialGameState(
        action.payload?.mode || state.mode,
        action.payload?.selectedTeamKeys || state.selectedTeamKeys,
        action.payload?.selectedPlateIds || state.selectedPlateIds,
        action.payload?.customizations || state.customizations
      );
    }

    case 'UPDATE_FIGURE_WORKSHOP': {
      const { figKey, level, clv, lvTargetIndex, clvTargetIndex } = action.payload;
      const nextCustomizations = {
        ...state.customizations,
        [figKey]: { level, clv, lvTargetIndex, clvTargetIndex }
      };
      const nextFigures = state.figures.map(f => {
        if (f.key !== figKey) return f;
        const updated = {
          ...f,
          level,
          clv,
          lvTargetIndex,
          clvTargetIndex
        };
        updated.segments = getComputedFigureSegments(updated);
        return updated;
      });
      return {
        ...state,
        customizations: nextCustomizations,
        figures: nextFigures,
        logs: appendLogs(state.logs, state.turnCount, [
          {
            text: `⚒️ Forja Shinobi: ${figKey.toUpperCase()} actualizado a Nv.${level} y CLv +${clv}.`,
            tone: 'highlight'
          }
        ])
      };
    }

    case 'UPDATE_DECK_LOADOUT': {
      const { selectedTeamKeys, selectedPlateIds } = action.payload;
      return createInitialGameState(
        state.mode,
        selectedTeamKeys || state.selectedTeamKeys,
        selectedPlateIds || state.selectedPlateIds,
        state.customizations
      );
    }

    case 'TOGGLE_MODE': {
      const nextMode = state.mode === 'ai' ? 'local' : 'ai';
      return createInitialGameState(
        nextMode,
        state.selectedTeamKeys,
        state.selectedPlateIds,
        state.customizations
      );
    }

    case 'INSPECT_UNIT': {
      return { ...state, inspectedFigureId: action.payload.figureId };
    }

    case 'SELECT_UNIT': {
      const { figureId } = action.payload;
      const fig = state.figures.find(f => f.id === figureId);
      if (!fig) return state;

      const baseState = { ...state, inspectedFigureId: fig.id };
      if (state.phase === 'GAMEOVER' || state.phase === 'BATTLE') return baseState;

      // 1. Handle Goal Block Plate Selection (Moves any friendly figure on board directly to Own Goal & ends turn!)
      if (state.phase === 'GOAL_BLOCK_SELECT') {
        if (fig.owner === state.turnPlayer && fig.location === 'board') {
          const ownGoalNodeId = state.turnPlayer === 1 ? 15 : 2;
          const goalOccupant = getFigureAtNode(state.figures, ownGoalNodeId);
          if (goalOccupant) {
            return {
              ...baseState,
              phase: 'SELECT',
              logs: appendLogs(state.logs, state.turnCount, [
                { text: '⚠️ Tu Monumento Hokage ya está ocupado.', tone: 'normal' }
              ])
            };
          }
          const movedFigures = state.figures.map(f =>
            f.id === fig.id ? { ...f, nodeId: ownGoalNodeId } : f
          );
          const surroundRes = evaluateSurroundAndInfirmary(movedFigures, state.koQueue);
          return advanceTurnPure(
            { ...baseState, figures: surroundRes.figures, koQueue: surroundRes.koQueue },
            [
              {
                text: `陣 ¡Invocación Defensa de Base (Goal Block)! ${fig.name} se teletransporta al Monumento Hokage (#${ownGoalNodeId}) y finaliza el turno.`,
                tone: 'highlight'
              },
              ...surroundRes.logs
            ]
          );
        }
        return baseState;
      }

      // 2. Handle Full Heal Plate Selection
      if (state.phase === 'HEAL_SELECT') {
        if (fig.owner === state.turnPlayer && fig.status) {
          const nextFigures = state.figures.map(f => {
            if (f.id !== fig.id) return f;
            const healed = { ...f, status: null };
            healed.segments = getComputedFigureSegments(healed);
            return healed;
          });
          return {
            ...baseState,
            figures: nextFigures,
            phase: 'SELECT',
            logs: appendLogs(state.logs, state.turnCount, [
              { text: `癒 ¡Purificación Médica! ${fig.name} ha sido curado de sus estados alterados.`, tone: 'highlight' }
            ])
          };
        }
        return baseState;
      }

      // 3. Handle Max Revive (Edo Tensei) Plate Selection
      if (state.phase === 'REVIVE_SELECT') {
        if (fig.owner === state.turnPlayer && fig.location === 'ko') {
          const nextFigures = state.figures.map(f => {
            if (f.id !== fig.id) return f;
            const revived = { ...f, location: 'bench', nodeId: null, wait: 0, status: null };
            revived.segments = getComputedFigureSegments(revived);
            return revived;
          });
          const nextKoQueue = {
            ...state.koQueue,
            [state.turnPlayer]: state.koQueue[state.turnPlayer].filter(id => id !== fig.id)
          };
          return {
            ...baseState,
            figures: nextFigures,
            koQueue: nextKoQueue,
            phase: 'SELECT',
            logs: appendLogs(state.logs, state.turnCount, [
              { text: `蘇 ¡Barrera de Resurrección (Max Revive)! ${fig.name} regresa de la Prisión Fuinjutsu al Banquillo sin Espera.`, tone: 'highlight' }
            ])
          };
        }
        return baseState;
      }

      // 4. Handle Kawarimi Swap Scroll Phase 1 & 2
      if (state.phase === 'SWAP_SELECT_1') {
        if (fig.owner === state.turnPlayer && fig.location === 'board') {
          return {
            ...baseState,
            swapCandidateId: fig.id,
            phase: 'SWAP_SELECT_2',
            logs: appendLogs(state.logs, state.turnCount, [
              { text: `替 Selecciona el segundo aliado en el campo para permutar con ${fig.shortName}.`, tone: 'highlight' }
            ])
          };
        }
        return baseState;
      }

      if (state.phase === 'SWAP_SELECT_2') {
        if (fig.owner === state.turnPlayer && fig.location === 'board' && fig.id !== state.swapCandidateId) {
          const figA = state.figures.find(f => f.id === state.swapCandidateId);
          const nextFigures = state.figures.map(f => {
            if (f.id === figA.id) return { ...f, nodeId: fig.nodeId };
            if (f.id === fig.id) return { ...f, nodeId: figA.nodeId };
            return f;
          });

          const surroundEval = evaluateSurroundAndInfirmary(nextFigures, state.koQueue);
          return {
            ...baseState,
            figures: surroundEval.figures,
            koQueue: surroundEval.koQueue,
            swapCandidateId: null,
            phase: 'SELECT',
            logs: appendLogs(state.logs, state.turnCount, [
              { text: `替 ¡Kawarimi! ${figA.shortName} y ${fig.shortName} intercambiaron posiciones.`, tone: 'highlight' },
              ...surroundEval.logs
            ])
          };
        }
        return baseState;
      }

      // 5. Clicking a valid adjacent enemy target to initiate a Chakra Duel
      if (
        (state.phase === 'POST_MOVE' || (state.phase === 'SELECT' && state.selectedFigureId)) &&
        state.validAttackFigureIds.includes(fig.id)
      ) {
        const attacker = state.figures.find(f => f.id === state.selectedFigureId);
        if (!attacker) return baseState;
        const atkSpin = spinFigureChakraWheel(attacker);
        const defSpin = spinFigureChakraWheel(fig);
        const outcome = resolveChakraDuelOutcome(attacker, fig, atkSpin.segment, defSpin.segment, state.activeBuffs);

        return {
          ...baseState,
          phase: 'BATTLE',
          currentBattle: {
            attacker,
            defender: fig,
            atkSpin,
            defSpin,
            atkRotations: 360 * 5 + atkSpin.targetDeg,
            defRotations: 360 * 5 + defSpin.targetDeg,
            outcome,
            revealed: false
          }
        };
      }

      if (state.phase !== 'SELECT') return baseState;

      // 6. Selecting own available figure
      if (fig.owner === state.turnPlayer && fig.location !== 'ko') {
        if (fig.status === 'frozen') {
          return {
            ...baseState,
            logs: appendLogs(state.logs, state.turnCount, [
              { text: `砂 ${fig.name} está bajo Sellado de Arena (Congelado). Mueve un aliado adyacente a él para liberarlo.`, tone: 'normal' }
            ])
          };
        }
        if (fig.wait > 0) {
          return {
            ...baseState,
            logs: appendLogs(state.logs, state.turnCount, [
              { text: `⏳ ${fig.name} tiene sello Fuinjutsu de Espera (${fig.wait}) y no puede actuar.`, tone: 'normal' }
            ])
          };
        }
        const validMoveNodes = getReachableNodes(fig, state.figures, state.turnCount, state.activeBuffs[state.turnPlayer]);
        const validAttackFigureIds = getAdjacentEnemyIds(fig, state.figures);
        return {
          ...baseState,
          selectedFigureId: fig.id,
          validMoveNodes,
          validAttackFigureIds
        };
      }

      return baseState;
    }

    case 'MOVE_UNIT': {
      const { targetNodeId, figureId } = action.payload;
      const activeFigId = figureId || state.selectedFigureId;
      const movingFig = state.figures.find(f => f.id === activeFigId);
      if (!movingFig) return state;

      const originLabel = movingFig.location === 'bench' ? 'el Banquillo' : `nodo #${movingFig.nodeId}`;
      const adjAtDest = ADJACENCY_LIST[targetNodeId] || [];

      // Official Pokémon Duel Rule: Moving adjacent to a Frozen (Sellado de Arena) ally tags and unfreezes them!
      const unfreezeLogs = [];
      const movedFigures = state.figures.map(f => {
        if (f.id === movingFig.id) {
          return { ...f, location: 'board', nodeId: targetNodeId };
        }
        if (f.owner === movingFig.owner && f.location === 'board' && f.status === 'frozen' && adjAtDest.includes(f.nodeId)) {
          const unfrozen = { ...f, status: null };
          unfrozen.segments = getComputedFigureSegments(unfrozen);
          unfreezeLogs.push({
            text: `解 ¡Toque de Liberación! ${movingFig.shortName} rompe el Sellado de Arena de ${f.shortName}.`,
            tone: 'highlight'
          });
          return unfrozen;
        }
        return f;
      });

      const moveLogs = [
        {
          text: `歩 ${movingFig.name} avanza desde ${originLabel} hasta el nodo #${targetNodeId}.`,
          tone: movingFig.owner === 1 ? 'p1' : 'p2'
        },
        ...unfreezeLogs
      ];

      // 1. Evaluate Surround (Rodeo) KOs immediately upon landing
      const surroundResult = evaluateSurroundAndInfirmary(movedFigures, state.koQueue);
      const updatedFigures = surroundResult.figures;
      const updatedKoQueue = surroundResult.koQueue;
      moveLogs.push(...surroundResult.logs);

      // 2. Check Hokage Monument Goal Capture
      const onP2Goal = getFigureAtNode(updatedFigures, 2);
      if (onP2Goal && onP2Goal.owner === 1) {
        return {
          ...state,
          figures: updatedFigures,
          koQueue: updatedKoQueue,
          phase: 'GAMEOVER',
          winner: 1,
          victoryReason: `¡${onP2Goal.name} ha conquistado la Base de Akatsuki!`,
          logs: appendLogs(state.logs, state.turnCount, moveLogs)
        };
      }
      const onP1Goal = getFigureAtNode(updatedFigures, 15);
      if (onP1Goal && onP1Goal.owner === 2) {
        return {
          ...state,
          figures: updatedFigures,
          koQueue: updatedKoQueue,
          phase: 'GAMEOVER',
          winner: 2,
          victoryReason: `¡${onP1Goal.name} ha tomado el Monumento Hokage de Konoha!`,
          logs: appendLogs(state.logs, state.turnCount, moveLogs)
        };
      }

      // 3. Check if the moved figure survived and has adjacent enemies to optionally attack
      const postMoveFig = updatedFigures.find(f => f.id === movingFig.id);
      if (postMoveFig && postMoveFig.location === 'board') {
        const adjEnemyIds = getAdjacentEnemyIds(postMoveFig, updatedFigures);
        if (adjEnemyIds.length > 0) {
          return {
            ...state,
            figures: updatedFigures,
            koQueue: updatedKoQueue,
            selectedFigureId: postMoveFig.id,
            inspectedFigureId: postMoveFig.id,
            phase: 'POST_MOVE',
            validMoveNodes: {},
            validAttackFigureIds: adjEnemyIds,
            logs: appendLogs(state.logs, state.turnCount, moveLogs)
          };
        }
      }

      return advanceTurnPure(
        { ...state, figures: updatedFigures, koQueue: updatedKoQueue },
        moveLogs
      );
    }

    case 'ACTIVATE_SCROLL': {
      const { player, scrollSlotId } = action.payload;
      if (state.turnPlayer !== player || state.phase !== 'SELECT') return state;
      const pBuffs = state.activeBuffs[player];
      if (pBuffs.scrollUsedThisTurn) return state;

      const scrollObj = state.scrolls[player].find(s => (s.slotId === scrollSlotId || s.id === scrollSlotId) && !s.used);
      if (!scrollObj) return state;
      const scrollId = scrollObj.id;

      const markScrollUsed = () => ({
        ...state.scrolls,
        [player]: state.scrolls[player].map(s => (s.slotId === scrollObj.slotId ? { ...s, used: true } : s))
      });

      if (scrollId === 'swap') {
        const alliesOnBoard = state.figures.filter(f => f.owner === player && f.location === 'board');
        if (alliesOnBoard.length < 2) {
          return {
            ...state,
            logs: appendLogs(state.logs, state.turnCount, [
              { text: '⚠️ Necesitas al menos 2 aliados en el campo para usar Kawarimi.', tone: 'normal' }
            ])
          };
        }
        return {
          ...state,
          phase: 'SWAP_SELECT_1',
          selectedFigureId: null,
          validMoveNodes: {},
          activeBuffs: { ...state.activeBuffs, [player]: { ...pBuffs, scrollUsedThisTurn: true } },
          scrolls: markScrollUsed(),
          logs: appendLogs(state.logs, state.turnCount, [
            { text: '替 Pergamino Kawarimi activado: selecciona el primer aliado en el campo.', tone: 'highlight' }
          ])
        };
      }

      if (scrollId === 'goalblock') {
        const ownGoalNodeId = player === 1 ? 15 : 2;
        const alliesOnBoard = state.figures.filter(f => f.owner === player && f.location === 'board' && f.nodeId !== ownGoalNodeId);
        if (alliesOnBoard.length === 0 || getFigureAtNode(state.figures, ownGoalNodeId)) {
          return {
            ...state,
            logs: appendLogs(state.logs, state.turnCount, [
              { text: '⚠️ Necesitas al menos 1 aliado en el campo y tu Monumento Hokage libre para usar Defensa de Base (Goal Block).', tone: 'normal' }
            ])
          };
        }
        return {
          ...state,
          phase: 'GOAL_BLOCK_SELECT',
          selectedFigureId: null,
          validMoveNodes: {},
          activeBuffs: { ...state.activeBuffs, [player]: { ...pBuffs, scrollUsedThisTurn: true } },
          scrolls: markScrollUsed(),
          logs: appendLogs(state.logs, state.turnCount, [
            { text: '陣 Goal Block activado (Coste 2): haz clic en cualquier aliado del campo para teletransportarlo a tu Monumento Hokage.', tone: 'highlight' }
          ])
        };
      }

      if (scrollId === 'fullheal') {
        const afflictedAllies = state.figures.filter(f => f.owner === player && f.status !== null);
        if (afflictedAllies.length === 0) {
          return {
            ...state,
            logs: appendLogs(state.logs, state.turnCount, [
              { text: '⚠️ Ningún aliado sufre estados alterados actualmente.', tone: 'normal' }
            ])
          };
        }
        return {
          ...state,
          phase: 'HEAL_SELECT',
          selectedFigureId: null,
          validMoveNodes: {},
          activeBuffs: { ...state.activeBuffs, [player]: { ...pBuffs, scrollUsedThisTurn: true } },
          scrolls: markScrollUsed(),
          logs: appendLogs(state.logs, state.turnCount, [
            { text: '癒 Purificación Médica (Full Heal): selecciona el aliado con estado alterado para curarlo.', tone: 'highlight' }
          ])
        };
      }

      if (scrollId === 'maxrevive') {
        if (state.koQueue[player].length === 0) {
          return {
            ...state,
            logs: appendLogs(state.logs, state.turnCount, [
              { text: '⚠️ No hay ningún aliado en la Prisión Fuinjutsu para revivir.', tone: 'normal' }
            ])
          };
        }
        return {
          ...state,
          phase: 'REVIVE_SELECT',
          selectedFigureId: null,
          validMoveNodes: {},
          activeBuffs: { ...state.activeBuffs, [player]: { ...pBuffs, scrollUsedThisTurn: true } },
          scrolls: markScrollUsed(),
          logs: appendLogs(state.logs, state.turnCount, [
            { text: '蘇 Edo Tensei (Max Revive • Coste 2): haz clic en un ninja de tu Prisión Fuinjutsu para devolverlo al Banquillo.', tone: 'highlight' }
          ])
        };
      }

      const nextPlayerBuffs = { ...pBuffs, scrollUsedThisTurn: true };
      let logMsg = '';
      if (scrollId === 'power30') {
        nextPlayerBuffs.powerBonus = 30;
        logMsg = `薬 ¡Píldora del Soldado (J${player})! +30 DMG en ataques Blancos o Dorados este turno.`;
      } else if (scrollId === 'double') {
        nextPlayerBuffs.doubleChance = true;
        logMsg = `眼 ¡Sharingan Predictivo (J${player})! Podrás re-girar tu disco una vez en duelo.`;
      } else if (scrollId === 'desperate') {
        nextPlayerBuffs.desperateBoost = true;
        logMsg = `魂 ¡Sello Desesperado (J${player})! Ataques de 60 DMG o menos ganan +50 DMG este turno.`;
      } else if (scrollId === 'mpboost') {
        nextPlayerBuffs.mpBonus = 1;
        logMsg = `瞬 ¡Shunshin no Jutsu (J${player})! Ninjas de 1 o 2 MP ganan +1 paso este turno.`;
      }

      const nextActiveBuffs = { ...state.activeBuffs, [player]: nextPlayerBuffs };
      let updatedValidMoves = state.validMoveNodes;
      if (state.selectedFigureId) {
        const selFig = state.figures.find(f => f.id === state.selectedFigureId);
        if (selFig) {
          updatedValidMoves = getReachableNodes(selFig, state.figures, state.turnCount, nextPlayerBuffs);
        }
      }

      return {
        ...state,
        activeBuffs: nextActiveBuffs,
        validMoveNodes: updatedValidMoves,
        scrolls: markScrollUsed(),
        logs: appendLogs(state.logs, state.turnCount, [{ text: logMsg, tone: 'highlight' }])
      };
    }

    case 'REVEAL_BATTLE_SPIN': {
      if (!state.currentBattle) return state;
      return {
        ...state,
        currentBattle: { ...state.currentBattle, revealed: true }
      };
    }

    case 'RESPIN_BATTLE_WHEEL': {
      if (!state.currentBattle) return state;
      const b = state.currentBattle;
      const newAtkSpin = spinFigureChakraWheel(b.attacker);
      const extraRotation = 360 * 4 + ((newAtkSpin.targetDeg - (b.atkRotations % 360) + 360) % 360);
      const newOutcome = resolveChakraDuelOutcome(
        b.attacker,
        b.defender,
        newAtkSpin.segment,
        b.defSpin.segment,
        state.activeBuffs
      );

      return {
        ...state,
        activeBuffs: {
          ...state.activeBuffs,
          [b.attacker.owner]: { ...state.activeBuffs[b.attacker.owner], doubleChance: false }
        },
        currentBattle: {
          ...b,
          atkSpin: newAtkSpin,
          atkRotations: b.atkRotations + extraRotation,
          outcome: newOutcome,
          revealed: false
        },
        logs: appendLogs(state.logs, state.turnCount, [
          { text: `写輪眼 ¡${b.attacker.shortName} activa el Sharingan y vuelve a girar su disco!`, tone: 'highlight' }
        ])
      };
    }

    case 'RESOLVE_DUEL': {
      if (!state.currentBattle) return state;
      const { attacker, defender, atkSpin, defSpin, outcome } = state.currentBattle;
      const nextFigures = state.figures.map(f => ({ ...f }));
      const nextKoQueue = { 1: [...state.koQueue[1]], 2: [...state.koQueue[2]] };
      const duelLogs = [];

      const atkRef = nextFigures.find(f => f.id === attacker.id);
      const defRef = nextFigures.find(f => f.id === defender.id);

      const applyPurpleStatus = (winnerUnit, loserUnit, purpleSeg) => {
        if (purpleSeg.effect === 'instant_ko') {
          duelLogs.push({
            text: `封 ¡${purpleSeg.name} (${'★'.repeat(purpleSeg.stars)})! ${loserUnit.name} es sellado directamente en la Prisión Fuinjutsu.`,
            tone: 'ko'
          });
          sendUnitToInfirmaryPure(loserUnit, nextFigures, nextKoQueue, duelLogs);
          evolveFigurePure(winnerUnit, duelLogs);
        } else if (purpleSeg.effect === 'push_wait') {
          const adj = ADJACENCY_LIST[loserUnit.nodeId] || [];
          const emptyNode = adj.find(nId => !getFigureAtNode(nextFigures, nId));
          if (emptyNode !== undefined) {
            loserUnit.nodeId = emptyNode;
            loserUnit.wait = 2;
            duelLogs.push({
              text: `💨 ¡${purpleSeg.name} (${'★'.repeat(purpleSeg.stars)})! ${loserUnit.name} es desplazado al nodo #${emptyNode} con Espera 2.`,
              tone: 'highlight'
            });
          } else {
            loserUnit.wait = 2;
            duelLogs.push({
              text: `⏳ ¡${purpleSeg.name}! ${loserUnit.name} queda inmovilizado con Espera 2.`,
              tone: 'highlight'
            });
          }
          // Official Pokémon Duel Rule: Displacing an opponent with a Purple move triggers Evolution!
          evolveFigurePure(winnerUnit, duelLogs);
        } else if (purpleSeg.effect === 'burn_knockback') {
          const adj = ADJACENCY_LIST[loserUnit.nodeId] || [];
          const emptyNode = adj.find(nId => !getFigureAtNode(nextFigures, nId));
          if (emptyNode !== undefined) {
            loserUnit.nodeId = emptyNode;
          }
          loserUnit.wait = 2;
          loserUnit.status = 'burned';
          loserUnit.segments = getComputedFigureSegments(loserUnit);
          duelLogs.push({
            text: `炎 ¡Amaterasu! ${loserUnit.name} sufre Quemadura (-20 DMG y su sector más pequeño pasa a ser Rojo) + Espera 2.`,
            tone: 'ko'
          });
          evolveFigurePure(winnerUnit, duelLogs);
        } else if (purpleSeg.effect === 'confuse_wait') {
          loserUnit.wait = 2;
          loserUnit.status = 'confused';
          loserUnit.segments = getComputedFigureSegments(loserUnit);
          duelLogs.push({
            text: `幻 ¡Genjutsu: Sharingan! ${loserUnit.name} sufre Confusión (su ruleta se desvía 1 sector) y Espera 2.`,
            tone: 'highlight'
          });
          evolveFigurePure(winnerUnit, duelLogs);
        } else if (purpleSeg.effect === 'freeze_seal') {
          loserUnit.status = 'frozen';
          loserUnit.wait = 2;
          loserUnit.segments = getComputedFigureSegments(loserUnit);
          duelLogs.push({
            text: `砂 ¡Sabaku Kyū (Sellado de Arena)! ${loserUnit.name} queda Congelado en Arena (ruleta 100% Rojo en defensa hasta que un aliado lo toque).`,
            tone: 'ko'
          });
        }
      };

      if (outcome.winner === 'atk_ko') {
        duelLogs.push({
          text: `⚔️ ${attacker.name} derrota a ${defender.name} con ${atkSpin.segment.name}.`,
          tone: 'p1'
        });
        sendUnitToInfirmaryPure(defRef, nextFigures, nextKoQueue, duelLogs);
        evolveFigurePure(atkRef, duelLogs);
        if (atkSpin.segment.effect === 'self_wait_2' && atkRef) {
          atkRef.wait = 2;
          duelLogs.push({
            text: `⚠️ Desgaste de las 8 Puertas: ${atkRef.shortName} recibe Espera 2 tras Ura Renge.`,
            tone: 'normal'
          });
        }
      } else if (outcome.winner === 'def_ko') {
        duelLogs.push({
          text: `🛡️ ¡Contraataque! ${defender.name} derrota a ${attacker.name} con ${defSpin.segment.name}.`,
          tone: 'p2'
        });
        sendUnitToInfirmaryPure(atkRef, nextFigures, nextKoQueue, duelLogs);
        evolveFigurePure(defRef, duelLogs);
        if (defSpin.segment.effect === 'self_wait_2' && defRef) {
          defRef.wait = 2;
          duelLogs.push({
            text: `⚠️ Desgaste de las 8 Puertas: ${defRef.shortName} recibe Espera 2 tras Ura Renge.`,
            tone: 'normal'
          });
        }
      } else if (outcome.winner === 'atk_purple') {
        applyPurpleStatus(atkRef, defRef, atkSpin.segment);
      } else if (outcome.winner === 'def_purple') {
        applyPurpleStatus(defRef, atkRef, defSpin.segment);
      } else {
        // Handle non-KO secondary status triggers (Chidori Nagashi paralysis, Katon poison, Crow confusion, Minato Blue step)
        if (atkSpin.segment.effect === 'paralyze_enemy' && defRef.location === 'board') {
          defRef.status = 'paralyzed';
          defRef.segments = getComputedFigureSegments(defRef);
          duelLogs.push({
            text: `痺 ¡Chidori Nagashi! ${defRef.shortName} queda Paralizado (su sector menor pasa a ser Fallo Rojo).`,
            tone: 'highlight'
          });
        }
        if (defSpin.segment.effect === 'paralyze_enemy' && atkRef.location === 'board') {
          atkRef.status = 'paralyzed';
          atkRef.segments = getComputedFigureSegments(atkRef);
          duelLogs.push({
            text: `痺 ¡Onda Raiton! ${atkRef.shortName} queda Paralizado (su sector menor pasa a ser Fallo Rojo).`,
            tone: 'highlight'
          });
        }
        if (atkSpin.segment.effect === 'dodge_confuse' && defRef.location === 'board') {
          defRef.status = 'confused';
          duelLogs.push({
            text: `烏 ¡Clon de Cuervos! ${defRef.shortName} cae en Confusión tras el esquive de ${atkRef.shortName}.`,
            tone: 'highlight'
          });
        }
        if (defSpin.segment.effect === 'dodge_confuse' && atkRef.location === 'board') {
          atkRef.status = 'confused';
          duelLogs.push({
            text: `烏 ¡Clon de Cuervos! ${atkRef.shortName} cae en Confusión tras el esquive de ${defRef.shortName}.`,
            tone: 'highlight'
          });
        }
        duelLogs.push({ text: `⚡ ${outcome.reason}`, tone: 'normal' });
      }

      // Evaluate if a knockback caused a Surround or Goal win
      const surroundCheck = evaluateSurroundAndInfirmary(nextFigures, nextKoQueue);
      duelLogs.push(...surroundCheck.logs);

      const onP2Goal = getFigureAtNode(surroundCheck.figures, 2);
      if (onP2Goal && onP2Goal.owner === 1) {
        return {
          ...state,
          figures: surroundCheck.figures,
          koQueue: surroundCheck.koQueue,
          currentBattle: null,
          phase: 'GAMEOVER',
          winner: 1,
          victoryReason: `¡${onP2Goal.name} ha tomado la Base de Akatsuki tras el duelo!`,
          logs: appendLogs(state.logs, state.turnCount, duelLogs)
        };
      }
      const onP1Goal = getFigureAtNode(surroundCheck.figures, 15);
      if (onP1Goal && onP1Goal.owner === 2) {
        return {
          ...state,
          figures: surroundCheck.figures,
          koQueue: surroundCheck.koQueue,
          currentBattle: null,
          phase: 'GAMEOVER',
          winner: 2,
          victoryReason: `¡${onP1Goal.name} ha tomado el Monumento Hokage tras el duelo!`,
          logs: appendLogs(state.logs, state.turnCount, duelLogs)
        };
      }

      return advanceTurnPure(
        { ...state, figures: surroundCheck.figures, koQueue: surroundCheck.koQueue },
        duelLogs
      );
    }

    case 'END_TURN': {
      if (state.phase === 'BATTLE' || state.phase === 'GAMEOVER') return state;
      return advanceTurnPure(state, [
        { text: `⏭️ Jugador ${state.turnPlayer} finaliza su turno.`, tone: 'normal' }
      ]);
    }

    default:
      return state;
  }
}


// --- FILE: src/application/hooks/useShinobiDuel.js ---
export function useShinobiDuel() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialGameState('ai'));
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      soundEngine.muted = next;
      return next;
    });
  }, []);

  // Spin reveal timer when entering BATTLE phase
  useEffect(() => {
    if (state.phase === 'BATTLE' && state.currentBattle && !state.currentBattle.revealed) {
      soundEngine.play('spin');
      const timer = setTimeout(() => {
        dispatch({ type: 'REVEAL_BATTLE_SPIN' });
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.currentBattle]);

  // AI Turn Orchestration Effect
  useEffect(() => {
    if (state.mode !== 'ai' || state.turnPlayer !== 2 || state.phase === 'GAMEOVER') return;

    if (state.phase === 'SELECT') {
      const aiTimer = setTimeout(() => {
        const decision = computeBestAkatsukiMove(state);
        if (!decision) {
          dispatch({ type: 'END_TURN' });
          return;
        }
        // Check if AI should pop its +30 Power Scroll before engaging
        const powerScroll = state.scrolls[2].find(s => s.id === 'power30' && !s.used);
        const hasAdjacentEnemyAtDest = (ADJACENCY_LIST[decision.targetNode] || []).some(nId => {
          const occ = getFigureAtNode(state.figures, nId);
          return occ && occ.owner === 1;
        });
        if (powerScroll && hasAdjacentEnemyAtDest && !state.activeBuffs[2].scrollUsedThisTurn && Math.random() < 0.65) {
          soundEngine.play('scroll');
          dispatch({ type: 'ACTIVATE_SCROLL', payload: { player: 2, scrollId: 'power30' } });
        }
        soundEngine.play('move');
        dispatch({
          type: 'MOVE_UNIT',
          payload: { figureId: decision.figureId, targetNodeId: decision.targetNode }
        });
      }, 750);
      return () => clearTimeout(aiTimer);
    }

    if (state.phase === 'POST_MOVE') {
      const atkTimer = setTimeout(() => {
        if (state.validAttackFigureIds.length > 0) {
          dispatch({ type: 'SELECT_UNIT', payload: { figureId: state.validAttackFigureIds[0] } });
        } else {
          dispatch({ type: 'END_TURN' });
        }
      }, 650);
      return () => clearTimeout(atkTimer);
    }

    if (state.phase === 'BATTLE' && state.currentBattle?.revealed) {
      const resolveTimer = setTimeout(() => {
        soundEngine.play('ko');
        dispatch({ type: 'RESOLVE_DUEL' });
      }, 1700);
      return () => clearTimeout(resolveTimer);
    }
  }, [state]);

  return {
    state,
    dispatch,
    isMuted,
    toggleMute
  };
}


/* ============================================================================
 * 🎨 CAPA 4: PRESENTATION LAYER (presentation/)
 * Componentes React modulares con estética Makimono Washi, Madera Lacada,
 * Sellos Hanko, Tablero de Piedra Chunin y Modal de Arquitectura Clean.
 * ============================================================================ */

// --- FILE: src/presentation/components/wheel/ChakraDiskSVG.jsx ---
function polarToCartesian(cx, cy, r, angleInDegrees) {
  const rad = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeWedge(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return ['M', cx, cy, 'L', start.x, start.y, 'A', r, r, 0, largeArc, 0, end.x, end.y, 'Z'].join(' ');
}

export function ChakraDiskSVG({ figure, size = 160 }) {
  if (!figure) return null;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 5;
  const total = figure.segments.reduce((acc, s) => acc + s.size, 0);

  let currentAngle = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
      <circle cx={cx} cy={cy} r={r + 3} fill="#281b12" stroke="#b45309" strokeWidth="2.5" />
      {figure.segments.map((seg, idx) => {
        const sliceAngle = (seg.size / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        currentAngle = endAngle;

        const pathD = describeWedge(cx, cy, r, startAngle, endAngle);
        const col = WHEEL_COLORS[seg.color];
        const midAngle = startAngle + sliceAngle / 2;
        const labelPos = polarToCartesian(cx, cy, r * 0.65, midAngle);

        let labelText = '';
        if (seg.color === 'white' || seg.color === 'gold') labelText = seg.power;
        else if (seg.color === 'purple') labelText = '★'.repeat(seg.stars);
        else if (seg.color === 'blue') labelText = '避';
        else labelText = '失';

        return (
          <g key={`${figure.id}_seg_${idx}`}>
            <path d={pathD} fill={col.fill} stroke="#1c120c" strokeWidth="2" />
            {sliceAngle >= 20 && (
              <text
                x={labelPos.x}
                y={labelPos.y}
                fill={col.text}
                fontSize="11"
                fontWeight="900"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {labelText}
              </text>
            )}
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.23} fill="#1c120c" stroke="#d97706" strokeWidth="2" />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#f59e0b"
        fontSize="14"
        fontWeight="900"
        style={{ fontFamily: "'Noto Serif JP', serif" }}
      >
        {figure.kanji}
      </text>
    </svg>
  );
}


// --- FILE: src/presentation/components/board/ChuninArenaSVG.jsx ---
export function ChuninArenaSVG({ state, onSelectUnit, onSelectNode, onEndPostMove }) {
  const onBoardFigures = useMemo(
    () => state.figures.filter(f => f.location === 'board'),
    [state.figures]
  );

  return (
    <div className="relative rounded-xl p-2 border-4 border-[#57412d] bg-gradient-to-b from-[#261911] to-[#140d08] shadow-2xl flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 680 550" className="w-full h-auto max-h-[545px] select-none">
        <defs>
          <radialGradient id="stoneArenaGrad" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#363932" />
            <stop offset="65%" stopColor="#252722" />
            <stop offset="100%" stopColor="#171815" />
          </radialGradient>
          <linearGradient id="innerSanctuaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2d261e" />
            <stop offset="100%" stopColor="#1f1a14" />
          </linearGradient>
          <linearGradient id="pedestalGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="pedestalCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#fecaca" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <filter id="tokenDropShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <clipPath id="tokenPortraitClip">
            <circle cx="0" cy="0" r="20" />
          </clipPath>
        </defs>

        {/* Stone Arena Base & Weathered Moss Details */}
        <rect x="8" y="8" width="664" height="534" rx="12" fill="url(#stoneArenaGrad)" stroke="#57412d" strokeWidth="5" />
        <rect x="18" y="18" width="644" height="514" rx="8" fill="none" stroke="#856548" strokeWidth="1" strokeDasharray="12 6" opacity="0.5" />
        <path d="M 35 120 L 75 135 L 95 125 M 640 410 L 600 395 L 580 415 M 310 20 L 320 45" stroke="#141612" strokeWidth="2" fill="none" opacity="0.6" />
        <circle cx="55" cy="275" r="28" fill="#2d4028" opacity="0.18" />
        <circle cx="625" cy="220" r="35" fill="#2d4028" opacity="0.16" />

        {/* Inner Tactical Courtyard */}
        <rect x="175" y="140" width="330" height="270" rx="6" fill="url(#innerSanctuaryGrad)" stroke="#5c4734" strokeWidth="2.5" />

        {/* Central Uzumaki Sealing Formula Crest */}
        <g transform="translate(340, 275)" opacity="0.24">
          <circle r="76" fill="none" stroke="#d97706" strokeWidth="2.5" />
          <circle r="68" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="10 5" />
          <text x="0" y="-52" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="900">封 • 陣 • 忍 • 闘</text>
          <text x="0" y="60" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="900">火 • 影 • 暁 • 魂</text>
          <text x="0" y="14" textAnchor="middle" fill="#e7d8c1" fontSize="42" fontWeight="900">忍</text>
        </g>

        {/* Layer 1: Graph Edges */}
        <g>
          {BOARD_EDGES.map(([aId, bId], idx) => {
            const nA = BOARD_NODES[aId];
            const nB = BOARD_NODES[bId];
            const isInner = nA.type === 'inner' && nB.type === 'inner';
            return (
              <g key={`edge_${idx}`}>
                <line x1={nA.x} y1={nA.y} x2={nB.x} y2={nB.y} stroke="#14110e" strokeWidth="7" strokeLinecap="round" />
                <line
                  x1={nA.x}
                  y1={nA.y}
                  x2={nB.x}
                  y2={nB.y}
                  stroke={isInner ? '#b45309' : '#78624c'}
                  strokeWidth="3"
                  strokeDasharray={isInner ? 'none' : '8 4'}
                />
              </g>
            );
          })}
        </g>

        {/* Layer 2: 28 Tactical Nodes */}
        <g>
          {BOARD_NODES.map(node => {
            if (node.type === 'goal_p1' || node.type === 'goal_p2') {
              const isP1 = node.type === 'goal_p1';
              const mainCol = isP1 ? '#ea580c' : '#dc2626';
              const kanji = isP1 ? '火' : '暁';
              const labelY = isP1 ? node.y + 38 : node.y - 33;
              return (
                <g key={`node_${node.id}`}>
                  <polygon
                    points={`${node.x},${node.y - 28} ${node.x + 26},${node.y - 8} ${node.x + 17},${node.y + 23} ${node.x - 17},${node.y + 23} ${node.x - 26},${node.y - 8}`}
                    fill="#1c120c"
                    stroke={mainCol}
                    strokeWidth="3"
                  />
                  <circle cx={node.x} cy={node.y} r="15" fill={mainCol} opacity="0.25" />
                  <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="central" fill="#fde68a" fontSize="16" fontWeight="900">
                    {kanji}
                  </text>
                  <text x={node.x} y={labelY} textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="900">
                    {node.label}
                  </text>
                </g>
              );
            }
            if (node.type === 'entry_p1' || node.type === 'entry_p2') {
              const isP1 = node.type === 'entry_p1';
              const strokeCol = isP1 ? '#f59e0b' : '#ef4444';
              const labelY = isP1 ? node.y + 33 : node.y - 26;
              return (
                <g key={`node_${node.id}`}>
                  <circle cx={node.x} cy={node.y} r="20" fill="#1c140d" stroke={strokeCol} strokeWidth="2.5" strokeDasharray="5 3" />
                  <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="central" fill={strokeCol} fontSize="12" fontWeight="900">
                    陣
                  </text>
                  <text x={node.x} y={labelY} textAnchor="middle" fill="#d6c7b2" fontSize="8" fontWeight="800">
                    {node.label}
                  </text>
                </g>
              );
            }
            const isInner = node.type === 'inner';
            return (
              <g key={`node_${node.id}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="13.5"
                  fill={isInner ? '#261c14' : '#2b2d27'}
                  stroke={isInner ? '#92400e' : '#57534e'}
                  strokeWidth="2.5"
                />
                <circle cx={node.x} cy={node.y} r="4" fill={isInner ? '#d97706' : '#78716c'} opacity="0.7" />
              </g>
            );
          })}
        </g>

        {/* Layer 3: Reachable Nodes Highlights */}
        <g>
          {Object.keys(state.validMoveNodes).map(nIdStr => {
            const nId = parseInt(nIdStr, 10);
            const node = BOARD_NODES[nId];
            return (
              <g
                key={`valid_${nId}`}
                className="cursor-pointer"
                onClick={() => onSelectNode(nId)}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="23"
                  fill="rgba(245, 158, 11, 0.28)"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                />
                <circle cx={node.x} cy={node.y} r="8" fill="#fbbf24" />
              </g>
            );
          })}
        </g>

        {/* Layer 4: Sculpted Shinobi Figure Tokens */}
        <g>
          {onBoardFigures.map(fig => {
            const node = BOARD_NODES[fig.nodeId];
            const isSelected = state.selectedFigureId === fig.id || state.swapCandidateId === fig.id;
            const isAttackTarget = state.validAttackFigureIds.includes(fig.id);
            const isP1 = fig.owner === 1;
            const pedestalFill = isP1 ? 'url(#pedestalGold)' : 'url(#pedestalCrimson)';
            const effMp = calculateEffectiveMp(fig, state.turnCount, state.activeBuffs[fig.owner]);
            const fallbackUri = CHAR_SVG_FALLBACKS[fig.key];

            return (
              <g
                key={fig.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onClick={() => onSelectUnit(fig.id)}
              >
                {isSelected && (
                  <circle r="32" fill="none" stroke="#fde047" strokeWidth="3.5" strokeDasharray="7 3" />
                )}
                {isAttackTarget && (
                  <g>
                    <circle r="33" fill="rgba(220, 38, 38, 0.35)" stroke="#ef4444" strokeWidth="3" />
                    <rect x="-28" y="-42" width="56" height="14" rx="3" fill="#991b1b" stroke="#fde047" strokeWidth="1" />
                    <text x="0" y="-34" textAnchor="middle" dominantBaseline="central" fill="#fef3c7" fontSize="8.5" fontWeight="900">
                      ⚔️ DUELO
                    </text>
                  </g>
                )}

                <circle r="25" fill={pedestalFill} stroke="#140d08" strokeWidth="2.5" filter="url(#tokenDropShadow)" />
                <circle r="20.5" fill="#1c1917" stroke="#292524" strokeWidth="1.5" />

                {/* Deterministic SVG Fallback + Anime Portrait */}
                <image href={fallbackUri} x="-20" y="-20" width="40" height="40" clipPath="url(#tokenPortraitClip)" preserveAspectRatio="xMidYMin slice" />
                <image href={fig.portraitUrl} x="-20" y="-20" width="40" height="40" clipPath="url(#tokenPortraitClip)" preserveAspectRatio="xMidYMin slice" />

                {/* Figure Nameplate */}
                <rect x="-24" y="13" width="48" height="12" rx="2" fill={isP1 ? '#9a3412' : '#7f1d1d'} stroke="#fde68a" strokeWidth="1" />
                <text x="0" y="19.5" textAnchor="middle" dominantBaseline="central" fill="#fffbeb" fontSize="8" fontWeight="900">
                  {fig.shortName}
                </text>

                {/* Shuriken MP Badge */}
                <g transform="translate(19, -19)">
                  <polygon points="0,-11 4,-4 11,0 4,4 0,11 -4,4 -11,0 -4,-4" fill="#1c1917" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="0" y="0.5" textAnchor="middle" dominantBaseline="central" fill="#fde047" fontSize="9" fontWeight="900">
                    {effMp}
                  </text>
                </g>

                {/* Fuinjutsu Wait Seal */}
                {fig.wait > 0 && (
                  <g transform="translate(-19, -19)">
                    <rect x="-9" y="-9" width="18" height="18" rx="2" fill="#991b1b" stroke="#fde047" strokeWidth="1.5" />
                    <text x="0" y="1" textAnchor="middle" dominantBaseline="central" fill="#fef08a" fontSize="9" fontWeight="900">
                      封{fig.wait}
                    </text>
                  </g>
                )}

                {/* Status Condition Seal Badge (Bottom-Left) */}
                {fig.status && STATUS_CONDITIONS[fig.status] && (
                  <g transform="translate(-20, 18)">
                    <circle r="10" fill="#09090b" stroke={STATUS_CONDITIONS[fig.status].color} strokeWidth="2" />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={STATUS_CONDITIONS[fig.status].color}
                      fontSize="10"
                      fontWeight="900"
                    >
                      {STATUS_CONDITIONS[fig.status].kanji}
                    </text>
                  </g>
                )}

                {/* Level & Evolution Star Badge (Bottom-Right) */}
                {(fig.evolved || fig.clv > 0) && (
                  <g transform="translate(20, 18)">
                    <rect x="-11" y="-8" width="22" height="14" rx="3" fill={fig.evolved ? '#7e22ce' : '#0f172a'} stroke="#fde047" strokeWidth="1.2" />
                    <text x="0" y="-0.5" textAnchor="middle" dominantBaseline="central" fill="#fde047" fontSize="7.5" fontWeight="900">
                      {fig.evolved ? 'UX★' : `C+${fig.clv}`}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Special Plate Targeting Banner (Goal Block / Full Heal / Max Revive / Swap) */}
      {['GOAL_BLOCK_SELECT', 'HEAL_SELECT', 'REVIVE_SELECT', 'SWAP_SELECT_1', 'SWAP_SELECT_2'].includes(state.phase) && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-950/95 text-amber-100 px-4 py-2 rounded border-2 border-amber-400 shadow-2xl flex items-center gap-3 z-20">
          <span className="px-1.5 py-0.5 text-xs font-black bg-amber-500 text-stone-950 rounded-sm">巻物</span>
          <span className="text-xs font-bold">
            {state.phase === 'GOAL_BLOCK_SELECT' && 'Selecciona el aliado en el campo que deseas teletransportar a tu Monumento Hokage.'}
            {state.phase === 'HEAL_SELECT' && 'Selecciona el aliado con estado alterado para purificarlo.'}
            {state.phase === 'REVIVE_SELECT' && 'Selecciona el aliado en tu Prisión Fuinjutsu para revivirlo al Banquillo.'}
            {state.phase === 'SWAP_SELECT_1' && 'Selecciona el primer aliado en el campo para permutar.'}
            {state.phase === 'SWAP_SELECT_2' && 'Selecciona el segundo aliado en el campo para completar Kawarimi.'}
          </span>
        </div>
      )}

      {/* Floating Post-Move Combat Prompt */}
      {state.phase === 'POST_MOVE' && !(state.mode === 'ai' && state.turnPlayer === 2) && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#f4ebd9] text-stone-900 px-4 py-2 rounded border-2 border-red-800 shadow-2xl flex items-center gap-3 z-20">
          <span className="px-1.5 py-0.5 text-xs font-black border-2 border-red-700 text-red-700 bg-red-100">
            戦
          </span>
          <span className="text-xs font-extrabold">
            ¡Enemigo al alcance! Pulsa sobre el rival marcado con ⚔️ DUELO o:
          </span>
          <button
            onClick={onEndPostMove}
            className="px-3 py-1 rounded bg-red-800 hover:bg-red-700 text-amber-100 text-xs font-bold shadow transition"
          >
            Terminar Turno
          </button>
        </div>
      )}
    </div>
  );
}


// --- FILE: src/presentation/components/scrolls/PlayerCommandBar.jsx ---
export function PlayerCommandBar({ player, state, onSelectUnit, onActivateScroll }) {
  const isP1 = player === 1;
  const benchFigures = state.figures.filter(f => f.owner === player && f.location === 'bench');
  const koIds = state.koQueue[player];
  const playerScrolls = state.scrolls[player];
  const buffs = state.activeBuffs[player];

  const activeBuffBadges = [];
  if (buffs.powerBonus > 0) activeBuffBadges.push(`+${buffs.powerBonus} Poder`);
  if (buffs.mpBonus > 0) activeBuffBadges.push(`+1 MP`);
  if (buffs.doubleChance) activeBuffBadges.push(`Sharingan Activo`);
  if (buffs.desperateBoost) activeBuffBadges.push(`Sello +50 Activo`);

  return (
    <div
      className={`rounded-lg p-2.5 border-2 bg-gradient-to-b from-[#261911] to-[#170f0a] shadow-xl ${
        isP1 ? 'border-amber-700/80' : 'border-red-900/80'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 border-b border-stone-700/70 pb-1.5">
        <div className="flex items-center gap-2">
          <span
            className={`px-1.5 py-0.5 text-xs font-black border-2 ${
              isP1
                ? 'bg-orange-950 text-orange-400 border-orange-500'
                : 'bg-red-950 text-red-400 border-red-600'
            }`}
          >
            {isP1 ? '木' : '暁'}
          </span>
          <span className={`text-xs font-extrabold tracking-wider ${isP1 ? 'text-amber-300' : 'text-red-300'}`}>
            {isP1
              ? 'ESCUADRÓN KONOHA: VOLUNTAD DE FUEGO (J1)'
              : state.mode === 'ai'
              ? 'FACCIÓN RIVAL: AKATSUKI / IA ANBU (J2)'
              : 'FACCIÓN RIVAL: AKATSUKI (J2 LOCAL)'}
          </span>
          {activeBuffBadges.length > 0 && (
            <span className="text-[10px] font-extrabold text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-500/50">
              {activeBuffBadges.join(' • ')}
            </span>
          )}
        </div>

        {/* Tactical Scrolls (Plates with 6-Cost Capacity) */}
        <div className="flex items-center gap-1 flex-wrap">
          {playerScrolls.map(sc => {
            const canUse =
              state.turnPlayer === player &&
              state.phase === 'SELECT' &&
              !sc.used &&
              !buffs.scrollUsedThisTurn &&
              !(state.mode === 'ai' && player === 2);

            return (
              <button
                key={sc.slotId || sc.id}
                title={`${sc.desc} (Coste: ${sc.cost})`}
                disabled={!canUse}
                onClick={() => onActivateScroll(player, sc.slotId || sc.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition flex items-center gap-1 ${
                  sc.used
                    ? 'bg-stone-950 text-stone-600 border-stone-800 line-through cursor-not-allowed'
                    : canUse
                    ? 'bg-[#f4ebd9] hover:bg-amber-200 text-stone-900 border-amber-700 cursor-pointer shadow-sm'
                    : 'bg-stone-900 text-stone-400 border-stone-700 cursor-default'
                }`}
              >
                <span className="font-black text-red-800">{sc.kanji}</span>
                <span>{sc.name}</span>
                <span className="px-1 rounded-sm bg-stone-800 text-amber-300 text-[8px] font-mono">
                  C{sc.cost}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bench (6 slots) & Fuinjutsu Sealing Infirmary (2 slots) */}
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-8 bg-stone-950/90 border border-stone-700 rounded p-1.5">
          <div className="text-[9px] text-amber-200/70 uppercase font-bold mb-1 flex justify-between">
            <span>陣 Banquillo ({benchFigures.length}/6)</span>
            <span>{isP1 ? 'Selecciona para infiltrar por las esquinas' : 'Clic para inspeccionar'}</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5 min-h-[54px]">
            {Array.from({ length: 6 }).map((_, idx) => {
              const fig = benchFigures[idx];
              if (!fig) {
                return (
                  <div
                    key={`empty_bench_${idx}`}
                    className="rounded border border-dashed border-stone-800 bg-stone-950/40 min-h-[52px]"
                  />
                );
              }
              const isSelected = state.selectedFigureId === fig.id;
              const effMp = calculateEffectiveMp(fig, state.turnCount, buffs);
              return (
                <button
                  key={fig.id}
                  onClick={() => onSelectUnit(fig.id)}
                  className={`relative flex flex-col items-center p-1 rounded bg-stone-900 border-2 transition shadow ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400'
                      : isP1
                      ? 'border-amber-700/80 hover:border-amber-400'
                      : 'border-red-800/80 hover:border-red-400'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-amber-500/60 bg-stone-800">
                    <img
                      src={fig.portraitUrl}
                      alt={fig.shortName}
                      className="w-full h-full object-cover object-top"
                      onError={e => {
                        e.currentTarget.src = CHAR_SVG_FALLBACKS[fig.key];
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-extrabold text-amber-100 truncate max-w-full mt-0.5">
                    {fig.shortName}
                  </span>
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-sm bg-amber-500 text-stone-950 text-[9px] font-black flex items-center justify-center border border-amber-200">
                    {effMp}
                  </span>
                  {fig.wait > 0 && (
                    <span className="absolute -top-1.5 -left-1.5 px-1 rounded-sm bg-red-900 text-amber-200 text-[8px] font-bold border border-amber-400">
                      封{fig.wait}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-4 bg-red-950/35 border border-red-800/70 rounded p-1.5">
          <div className="text-[9px] text-red-300 uppercase font-bold mb-1 flex justify-between">
            <span>封 Prisión Fuinjutsu</span>
            <span>Máx 2 (FIFO)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 min-h-[54px]">
            {Array.from({ length: 2 }).map((_, idx) => {
              const koId = koIds[idx];
              const fig = koId ? state.figures.find(f => f.id === koId) : null;
              if (!fig) {
                return (
                  <div
                    key={`empty_ko_${idx}`}
                    className="rounded border border-dashed border-red-900/40 bg-stone-950/30 min-h-[52px]"
                  />
                );
              }
              return (
                <button
                  key={fig.id}
                  onClick={() => onSelectUnit(fig.id)}
                  className="relative flex flex-col items-center p-1 rounded bg-red-950/60 border border-red-800 opacity-85 hover:opacity-100 transition"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-red-500 grayscale">
                    <img
                      src={fig.portraitUrl}
                      alt={fig.shortName}
                      className="w-full h-full object-cover object-top"
                      onError={e => {
                        e.currentTarget.src = CHAR_SVG_FALLBACKS[fig.key];
                      }}
                    />
                  </div>
                  <span className="text-[8px] font-bold text-red-200 truncate max-w-full mt-0.5">
                    {fig.shortName}
                  </span>
                  <span className="absolute top-0 right-0 px-1 bg-red-800 text-amber-100 text-[8px] font-black">
                    封
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


// --- FILE: src/presentation/components/scrolls/BingoInspectorScroll.jsx ---
export function BingoInspectorScroll({ figure, state, onOpenWorkshop }) {
  if (!figure) return null;
  const effMp = calculateEffectiveMp(figure, state.turnCount, state.activeBuffs[figure.owner]);
  const colorTotals = getFigureColorBreakdown(figure.segments);
  const statusObj = figure.status ? STATUS_CONDITIONS[figure.status] : null;

  return (
    <div className="shadow-2xl">
      <div className="h-2.5 bg-gradient-to-r from-amber-700 via-[#281b12] to-amber-700 rounded-t border-b-2 border-stone-950" />
      <div className="bg-[#f4ebd9] text-stone-900 p-3.5 border-x-4 border-[#281b12] shadow-inner">
        <div className="flex items-start justify-between border-b-2 border-stone-800/30 pb-2.5 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="relative w-16 h-16 rounded border-2 border-stone-900 bg-stone-800 overflow-hidden shrink-0 shadow-md">
              <img
                src={figure.portraitUrl}
                alt={figure.name}
                className="w-full h-full object-cover object-top"
                onError={e => {
                  e.currentTarget.src = CHAR_SVG_FALLBACKS[figure.key];
                }}
              />
              <span className="absolute bottom-0 right-0 px-1 bg-red-800 text-amber-100 text-[9px] font-black">
                {figure.kanji}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1 flex-wrap">
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white rounded-sm ${
                    figure.owner === 1 ? 'bg-orange-700' : 'bg-red-800'
                  }`}
                >
                  {figure.owner === 1 ? 'KONOHA J1' : 'AKATSUKI J2'}
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-stone-900 text-amber-400 rounded-sm border border-amber-500">
                  Nv.{figure.level || 1} • CLv+{figure.clv || 0}
                </span>
                {figure.evolved && (
                  <span className="px-1.5 py-0.5 text-[9px] font-black bg-purple-800 text-amber-200 rounded-sm">
                    ★ DESPERTAR UX
                  </span>
                )}
              </div>
              <h2 className="text-base font-black text-stone-900 leading-tight mt-0.5">{figure.name}</h2>
              <p className="text-[10px] font-extrabold text-amber-900">{figure.archetype}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-stone-900 text-amber-400 border-2 border-amber-600 rounded px-2 py-1 shrink-0 shadow">
            <span className="text-[9px] font-bold uppercase tracking-tighter text-amber-200/80">PASOS MP</span>
            <span className="text-xl font-black leading-none">{effMp}</span>
          </div>
        </div>

        {/* Active Status Condition Alert Box */}
        {statusObj && (
          <div
            className="mb-2 p-2 rounded bg-stone-950 text-white border-l-4 flex items-center justify-between text-[10px]"
            style={{ borderColor: statusObj.color }}
          >
            <div>
              <div className="font-black uppercase" style={{ color: statusObj.color }}>
                {statusObj.kanji} ESTADO: {statusObj.label}
              </div>
              <div className="text-stone-300">{statusObj.desc}</div>
            </div>
          </div>
        )}

        {/* Asymmetric Color Specialization Bar (Base 96) + Workshop Button */}
        <div className="mb-2.5 bg-stone-900/95 p-2 rounded border border-stone-700 text-stone-100">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase text-amber-300 mb-1">
            <span>Disco Nv.{figure.level || 1} (Base 96)</span>
            {onOpenWorkshop && (
              <button
                onClick={onOpenWorkshop}
                className="px-1.5 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-[9px]"
              >
                ⚒️ Subir Nv / CLv
              </button>
            )}
          </div>
          <div className="w-full h-2.5 rounded-sm overflow-hidden flex border border-stone-600">
            {['white', 'gold', 'purple', 'blue', 'red'].map(cKey => {
              const val = colorTotals[cKey] || 0;
              if (val === 0) return null;
              return (
                <div
                  key={cKey}
                  style={{
                    width: `${(val / WHEEL_TOTAL_SEGMENTS) * 100}%`,
                    backgroundColor: WHEEL_COLORS[cKey].fill
                  }}
                  title={`${WHEEL_COLORS[cKey].label}: ${val}/96`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5 justify-between text-[9px] font-mono">
            <span className={colorTotals.white ? 'text-white font-bold' : 'text-stone-600'}>
              BLA:{colorTotals.white}/96
            </span>
            <span className={colorTotals.gold ? 'text-amber-400 font-bold' : 'text-stone-600'}>
              DOR:{colorTotals.gold}/96
            </span>
            <span className={colorTotals.purple ? 'text-purple-300 font-bold' : 'text-stone-600'}>
              MOR:{colorTotals.purple}/96
            </span>
            <span className={colorTotals.blue ? 'text-sky-300 font-bold' : 'text-stone-600'}>
              AZU:{colorTotals.blue}/96
            </span>
            <span className={colorTotals.red ? 'text-red-400 font-bold' : 'text-stone-600'}>
              ROJ:{colorTotals.red}/96
            </span>
          </div>
        </div>

        {/* Jutsu Anime Cut-In Preview */}
        <div className="mb-2 rounded border-2 border-stone-800 bg-stone-900 overflow-hidden shadow relative h-20">
          <img
            src={JUTSU_ANIME_CUTINS[figure.jutsuKey] || JUTSU_ANIME_CUTINS.rasengan}
            alt={figure.signatureName}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-300 font-bold">{figure.signatureJp}</span>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-red-800/90 text-white rounded-sm">
                Jutsu Insignia
              </span>
            </div>
            <div className="text-xs font-black text-white tracking-wide">{figure.signatureName}</div>
          </div>
        </div>

        {/* Proportional Chakra Disk */}
        <div className="flex items-center justify-center my-1.5 bg-stone-900/10 rounded-xl py-1.5 border border-stone-800/20">
          <ChakraDiskSVG figure={figure} size={148} />
        </div>

        {/* Shinobi Passive Doctrine & Natural Counter */}
        <div className="mt-2 p-2 rounded bg-amber-950/10 border-l-4 border-red-800 text-xs space-y-1">
          <div className="font-black text-red-900 text-[10px] flex items-center justify-between">
            <span>忍術特性 — ROL Y ASIMETRÍA DE COLOR</span>
            <span>{figure.status === 'burned' ? '🔥 QUEMADO (-20 DMG)' : '印'}</span>
          </div>
          <p className="text-[10px] text-stone-800 font-medium leading-snug">{figure.ability}</p>
          <p className="text-[10px] text-amber-950 font-bold leading-snug border-t border-stone-800/20 pt-1">
            ⚖️ Counter: {figure.naturalCounter}
          </p>
        </div>

        {/* Disk Segments Breakdown (Exact /96 segments) */}
        <div className="mt-2.5">
          <div className="text-[10px] font-extrabold text-stone-700 uppercase tracking-wider mb-1 flex justify-between">
            <span>Sectores del Disco (Lv.1)</span>
            <span>Poder / Tamaño (96)</span>
          </div>
          <div className="space-y-1 text-xs">
            {figure.segments.map((seg, idx) => {
              const col = WHEEL_COLORS[seg.color];
              const pct = Math.round((seg.size / WHEEL_TOTAL_SEGMENTS) * 100);
              let valLabel = '';
              if (seg.color === 'white' || seg.color === 'gold') valLabel = `${seg.power} DMG`;
              else if (seg.color === 'purple') valLabel = `${'★'.repeat(seg.stars)} (0 DMG)`;
              else if (seg.color === 'blue') valLabel = 'Esquiva';
              else valLabel = 'Fallo';

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-1.5 rounded bg-stone-900 text-stone-100 border border-stone-700"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-sm shrink-0 border border-white/40"
                      style={{ background: col.fill }}
                    />
                    <div className="truncate">
                      <div className="font-bold text-[11px] leading-tight truncate">{seg.name}</div>
                      <div className="text-[9px] text-amber-300/80">{seg.jp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-extrabold text-amber-400 text-[10px]">{valLabel}</span>
                    <span className="text-[10px] font-mono text-stone-300 bg-stone-950 px-1.5 py-0.5 rounded border border-stone-700">
                      {seg.size}/96 ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="h-2.5 bg-gradient-to-r from-amber-700 via-[#281b12] to-amber-700 rounded-b border-t-2 border-stone-950" />
    </div>
  );
}


// --- FILE: src/presentation/components/combat/ChakraDuelModal.jsx ---
export function ChakraDuelModal({ state, onRespin, onConfirmResolution }) {
  const b = state.currentBattle;
  if (!b) return null;

  const { attacker, defender, atkSpin, defSpin, outcome, revealed } = b;
  const hero = outcome.hero || attacker;
  const winningSeg = outcome.seg || atkSpin.segment;
  const cutinArt = JUTSU_ANIME_CUTINS[winningSeg.jutsuKey || hero.jutsuKey] || JUTSU_ANIME_CUTINS.rasengan;

  const canRespin =
    revealed &&
    state.activeBuffs[attacker.owner]?.doubleChance &&
    !(state.mode === 'ai' && attacker.owner === 2);

  const renderSpinBadge = (seg, unit) => {
    const col = WHEEL_COLORS[seg.color];
    const burnPenalty = unit.status === 'burned' ? -20 : 0;
    const bonus =
      seg.color === 'white' || seg.color === 'gold'
        ? (state.activeBuffs[unit.owner]?.powerBonus || 0) + burnPenalty
        : 0;
    const totalPower = Math.max(0, seg.power + bonus);

    let valStr = '';
    if (seg.color === 'white' || seg.color === 'gold') {
      valStr = `${totalPower} DMG${bonus !== 0 ? ` (${bonus > 0 ? `+${bonus}` : bonus})` : ''}`;
    } else if (seg.color === 'purple') {
      valStr = `${'★'.repeat(seg.stars)} (0 DMG)`;
    } else if (seg.color === 'blue') {
      valStr = 'ESQUIVA';
    } else {
      valStr = 'FALLO';
    }

    return (
      <div>
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span
            className="px-2 py-0.5 rounded-sm text-[10px] font-black uppercase"
            style={{ background: col.fill, color: col.text }}
          >
            {col.id.toUpperCase()} • {valStr}
          </span>
          <span className="text-[10px] font-mono text-amber-300 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-700">
            {seg.size}/96
          </span>
        </div>
        <div className="text-xs font-extrabold text-white mt-0.5">
          {seg.name} <span className="text-amber-300/80 font-normal">({seg.jp})</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="max-w-4xl w-full my-auto">
        <div className="h-3 bg-gradient-to-r from-amber-600 via-[#281b12] to-amber-600 rounded-t" />
        <div className="bg-[#f4ebd9] text-stone-900 p-4 md:p-6 border-4 border-stone-900">
          <div className="flex items-center justify-between border-b-2 border-stone-800/30 pb-2.5 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 flex items-center justify-center border-2 border-red-700 text-red-700 font-black text-base bg-red-100">
                闘
              </span>
              <div>
                <h2 className="text-lg md:text-2xl font-black text-stone-900 leading-none">
                  CHOQUE DE DISCOS DE CHAKRA
                </h2>
                <p className="text-xs text-red-900 font-bold">
                  忍術対決 — Resolución probabilística estilo Pokémon Duel
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-stone-900 text-amber-300 text-xs font-bold border border-amber-600">
              DUELO EN ARENA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Attacker Wheel Card */}
            <div className="bg-gradient-to-b from-[#261911] to-[#170f0a] rounded-lg p-3.5 border-2 border-amber-600 flex flex-col items-center">
              <div className="w-full flex items-center gap-3 border-b border-stone-700 pb-2 mb-2">
                <img
                  src={attacker.portraitUrl}
                  alt={attacker.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 bg-stone-800"
                  onError={e => {
                    e.currentTarget.src = CHAR_SVG_FALLBACKS[attacker.key];
                  }}
                />
                <div className="text-left">
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-orange-600 text-white rounded-sm">
                    ATACANTE (J{attacker.owner})
                  </span>
                  <h3 className="text-base font-black text-amber-100">{attacker.name}</h3>
                </div>
              </div>

              <div className="relative w-48 h-48 flex items-center justify-center my-1">
                <div className="absolute -top-3.5 z-20 drop-shadow">
                  <svg width="28" height="30" viewBox="0 0 24 28">
                    <circle cx="12" cy="4" r="3" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    <polygon points="12,27 5,9 12,12 19,9" fill="#dc2626" stroke="#fef3c7" strokeWidth="1.5" />
                  </svg>
                </div>
                <div
                  className="w-44 h-44 rounded-full transition-transform duration-[2700ms] ease-out"
                  style={{ transform: `rotate(${b.atkRotations}deg)` }}
                >
                  <ChakraDiskSVG figure={attacker} size={176} />
                </div>
              </div>

              <div className="w-full mt-2 p-2 rounded bg-stone-950 border border-stone-700 text-center min-h-[54px] flex flex-col justify-center">
                {revealed ? (
                  renderSpinBadge(atkSpin.segment, attacker)
                ) : (
                  <span className="text-xs text-amber-200/80 animate-pulse">Girando disco de 96 segmentos...</span>
                )}
              </div>
            </div>

            {/* Defender Wheel Card */}
            <div className="bg-gradient-to-b from-[#261911] to-[#170f0a] rounded-lg p-3.5 border-2 border-red-700 flex flex-col items-center">
              <div className="w-full flex items-center gap-3 border-b border-stone-700 pb-2 mb-2">
                <img
                  src={defender.portraitUrl}
                  alt={defender.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500 bg-stone-800"
                  onError={e => {
                    e.currentTarget.src = CHAR_SVG_FALLBACKS[defender.key];
                  }}
                />
                <div className="text-left">
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-red-700 text-white rounded-sm">
                    DEFENSOR (J{defender.owner})
                  </span>
                  <h3 className="text-base font-black text-red-100">{defender.name}</h3>
                </div>
              </div>

              <div className="relative w-48 h-48 flex items-center justify-center my-1">
                <div className="absolute -top-3.5 z-20 drop-shadow">
                  <svg width="28" height="30" viewBox="0 0 24 28">
                    <circle cx="12" cy="4" r="3" fill="none" stroke="#f87171" strokeWidth="2" />
                    <polygon points="12,27 5,9 12,12 19,9" fill="#991b1b" stroke="#fef3c7" strokeWidth="1.5" />
                  </svg>
                </div>
                <div
                  className="w-44 h-44 rounded-full transition-transform duration-[2700ms] ease-out"
                  style={{ transform: `rotate(${b.defRotations}deg)` }}
                >
                  <ChakraDiskSVG figure={defender} size={176} />
                </div>
              </div>

              <div className="w-full mt-2 p-2 rounded bg-stone-950 border border-stone-700 text-center min-h-[54px] flex flex-col justify-center">
                {revealed ? (
                  renderSpinBadge(defSpin.segment, defender)
                ) : (
                  <span className="text-xs text-red-200/80 animate-pulse">Girando disco de 96 segmentos...</span>
                )}
              </div>
            </div>
          </div>

          {/* Anime Jutsu Cut-In Banner */}
          {revealed && (
            <div className="mt-4 rounded-lg border-2 border-stone-900 bg-stone-950 overflow-hidden shadow-2xl">
              <div className="p-3 md:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-5 h-32 rounded border-2 border-amber-500 overflow-hidden relative bg-black">
                  <img src={cutinArt} alt="Jutsu Cut-in" className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-red-800/90 text-amber-100 text-[10px] font-black rounded-sm">
                    必殺技 — TÉCNICA DECISIVA
                  </div>
                </div>
                <div className="md:col-span-7 flex flex-col justify-center text-left">
                  <div className="flex items-center gap-2">
                    <img
                      src={hero.portraitUrl}
                      alt={hero.name}
                      className="w-10 h-10 rounded-full object-cover border border-amber-400"
                      onError={e => {
                        e.currentTarget.src = CHAR_SVG_FALLBACKS[hero.key];
                      }}
                    />
                    <span className="text-lg md:text-xl font-black text-amber-400 tracking-wide">
                      {winningSeg.jp || hero.signatureJp} — ¡{winningSeg.name.toUpperCase()}!
                    </span>
                  </div>
                  <p className="text-xs md:text-sm font-bold text-stone-100 mt-1.5 leading-snug">
                    {outcome.reason}
                  </p>
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    {canRespin && (
                      <button
                        onClick={onRespin}
                        className="px-4 py-1.5 rounded bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs border border-sky-400 shadow transition"
                      >
                        写輪眼 Activar Sharingan (Re-girar Disco)
                      </button>
                    )}
                    <button
                      onClick={onConfirmResolution}
                      className="px-5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider border border-amber-200 shadow transition"
                    >
                      Aplicar Resultado en Arena
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="h-3 bg-gradient-to-r from-amber-600 via-[#281b12] to-amber-600 rounded-b" />
      </div>
    </div>
  );
}


// --- FILE: src/presentation/components/architecture/CleanArchInspectorModal.jsx ---
const ARCHITECTURE_MODULES = [
  {
    layer: 'Domain Layer (Pure JS / Zero React Deps)',
    color: 'border-amber-500 text-amber-300',
    badge: 'domain/',
    files: [
      {
        path: 'src/domain/entities/ShinobiFigure.js',
        responsibility: 'Catálogo de Shinobis, sectores del Disco de Chakra (Blanco, Dorado, Morado ★, Azul, Rojo), MP y doctrinas pasivas (Hiraishin, Escudo de Arena).'
      },
      {
        path: 'src/domain/entities/BoardGraph.js',
        responsibility: 'Topología simétrica de 28 nodos de Pokémon Duel, listas de adyacencia y algoritmo BFS puro para caminos válidos y saltos espaciales.'
      },
      {
        path: 'src/domain/services/CombatResolver.js',
        responsibility: 'Motor determinista/probabilístico de combate que evalúa la prioridad exacta de colores: Azul > Todo, Dorado > Morado, Morado ★ > Blanco, Blanco por daño y Rojo fallo.'
      },
      {
        path: 'src/domain/services/SurroundService.js',
        responsibility: 'Detección pura en grafo de rodeos (Surround K.O.) e inmunidades, gestionando la cola FIFO de 2 plazas de la Prisión Fuinjutsu.'
      },
      {
        path: 'src/domain/services/AiTacticalEngine.js',
        responsibility: 'Evaluador heurístico para la IA Akatsuki: prioriza captura de Monumento Hokage, defensa de base, trampas de rodeo y bloqueo de esquinas.'
      }
    ]
  },
  {
    layer: 'Application Layer (Use Cases & State Machine)',
    color: 'border-sky-500 text-sky-300',
    badge: 'application/',
    files: [
      {
        path: 'src/application/useCases/gameReducer.js',
        responsibility: 'Máquina de estados finita e inmutable (SELECT_UNIT, MOVE_UNIT, ACTIVATE_SCROLL, REVEAL_BATTLE_SPIN, RESOLVE_DUEL, END_TURN).'
      },
      {
        path: 'src/application/hooks/useShinobiDuel.js',
        responsibility: 'Custom Hook de React que conecta el reducer puro con los efectos secundarios (ciclo de vida de la IA y disparadores de sonido).'
      }
    ]
  },
  {
    layer: 'Infrastructure Layer (External Adapters)',
    color: 'border-emerald-500 text-emerald-300',
    badge: 'infrastructure/',
    files: [
      {
        path: 'src/infrastructure/audio/ShinobiAudioEngine.js',
        responsibility: 'Sintetizador Web Audio API nativo para tambores Taiko, sellos de mano, giros de ruleta y sellados Fuinjutsu.'
      },
      {
        path: 'src/infrastructure/assets/animeAssets.js',
        responsibility: 'Retratos verificados de MyAnimeList CDN con fallbacks vectoriales deterministas en SVG para garantizar 0 imágenes rotas.'
      }
    ]
  },
  {
    layer: 'Presentation Layer (React UI & SVG Arena)',
    color: 'border-purple-500 text-purple-300',
    badge: 'presentation/',
    files: [
      {
        path: 'src/presentation/components/board/ChuninArenaSVG.jsx',
        responsibility: 'Lienzo interactivo SVG de 28 nodos con textura de piedra tallada, anillos de movimiento y miniaturas esculpidas.'
      },
      {
        path: 'src/presentation/components/scrolls/MakimonoSidebar.jsx',
        responsibility: 'Pergaminos Washi laterales con el Inspector del Libro Bingo, desglose de probabilidades del Disco de Chakra y Crónica del Combate.'
      },
      {
        path: 'src/presentation/components/combat/ChakraDuelModal.jsx',
        responsibility: 'Modal de duelo con doble ruleta giratoria, cinemática anime del Jutsu ganador y soporte para re-giro Sharingan.'
      }
    ]
  }
];

export function CleanArchInspectorModal({ isOpen, onClose, state }) {
  const [activeTab, setActiveTab] = useState('layers');
  const [copiedCLI, setCopiedCLI] = useState(false);

  if (!isOpen) return null;

  const cliScaffoldCommand = `mkdir -p src/{domain/{entities,services},application/{useCases,hooks},infrastructure/{audio,assets},presentation/{components/{board,scrolls,combat,architecture}}}`;

  const handleCopyCli = () => {
    navigator.clipboard?.writeText(cliScaffoldCommand);
    setCopiedCLI(true);
    setTimeout(() => setCopiedCLI(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-5xl w-full max-h-[90vh] flex flex-col rounded-xl border-2 border-amber-600 bg-[#18110c] text-stone-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#241911] border-b border-stone-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-base md:text-lg font-black text-amber-300 tracking-wide">
                ARQUITECTURA CLEAN & DDD — SHINOBI DUEL REACT
              </h2>
              <p className="text-xs text-stone-400">
                Separación estricta de responsabilidades: Domain → Application → Infrastructure → Presentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-red-900/80 hover:bg-red-800 text-amber-100 text-xs font-bold border border-red-600"
          >
            ✕ Cerrar Inspector
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-2.5 bg-[#1d140e] border-b border-stone-800 flex gap-2">
          <button
            onClick={() => setActiveTab('layers')}
            className={`px-3 py-1.5 rounded-t text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'layers'
                ? 'border-amber-400 text-amber-300 bg-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Capas y Módulos
          </button>
          <button
            onClick={() => setActiveTab('state')}
            className={`px-3 py-1.5 rounded-t text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'state'
                ? 'border-amber-400 text-amber-300 bg-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> Estado Inmutable en Vivo (Reducer)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'layers' ? (
            <>
              {/* Dependency Rule Diagram */}
              <div className="p-3.5 rounded-lg bg-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs space-y-1">
                  <div className="font-bold text-amber-400 uppercase tracking-wider">
                    Regla de Dependencia Concéntrica (Clean Architecture)
                  </div>
                  <p className="text-stone-300">
                    La capa <strong>Domain</strong> contiene las reglas matemáticas del grafo de 28 nodos y la ruleta de Pokémon Duel sin importar React. La capa <strong>Application</strong> orquesta casos de uso puros mediante <code className="text-amber-300">useReducer</code>.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono bg-stone-900 px-3 py-2 rounded border border-stone-700">
                  <span className="text-purple-400">Presentation</span>
                  <ChevronRight className="w-4 h-4 text-stone-500" />
                  <span className="text-sky-400">Application</span>
                  <ChevronRight className="w-4 h-4 text-stone-500" />
                  <span className="text-amber-400 font-bold">Domain (Core)</span>
                </div>
              </div>

              {/* CLI Scaffold Generator */}
              <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 overflow-x-auto">
                  <Terminal className="w-4 h-4 shrink-0" />
                  <code>{cliScaffoldCommand}</code>
                </div>
                <button
                  onClick={handleCopyCli}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  {copiedCLI ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCLI ? 'Copiado' : 'Copiar CLI'}</span>
                </button>
              </div>

              {/* Layer Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ARCHITECTURE_MODULES.map((mod, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg p-3.5 bg-stone-900/90 border-l-4 ${mod.color} border border-stone-800 space-y-2.5`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-sm">{mod.layer}</h3>
                      <span className="px-2 py-0.5 rounded bg-stone-950 text-[11px] font-mono border border-stone-700">
                        {mod.badge}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {mod.files.map(f => (
                        <div key={f.path} className="p-2 rounded bg-stone-950/90 border border-stone-800/80">
                          <div className="font-mono text-xs text-amber-300 font-bold">{f.path}</div>
                          <p className="text-[11px] text-stone-300 mt-0.5 leading-snug">{f.responsibility}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded bg-stone-900 border border-stone-700">
                  <span className="text-stone-400 block">Fase FSM Actual</span>
                  <span className="text-sm font-black text-amber-400">{state.phase}</span>
                </div>
                <div className="p-2.5 rounded bg-stone-900 border border-stone-700">
                  <span className="text-stone-400 block">Turno / Jugador Activo</span>
                  <span className="text-sm font-black text-emerald-400">
                    Turno {state.turnCount} (J{state.turnPlayer})
                  </span>
                </div>
                <div className="p-2.5 rounded bg-stone-900 border border-stone-700">
                  <span className="text-stone-400 block">Unidades en Tablero</span>
                  <span className="text-sm font-black text-sky-400">
                    {state.figures.filter(f => f.location === 'board').length} / 12
                  </span>
                </div>
                <div className="p-2.5 rounded bg-stone-900 border border-stone-700">
                  <span className="text-stone-400 block">Sellados en Fuinjutsu</span>
                  <span className="text-sm font-black text-red-400">
                    J1: {state.koQueue[1].length}/2 • J2: {state.koQueue[2].length}/2
                  </span>
                </div>
              </div>
              <pre className="p-3 rounded-lg bg-stone-950 border border-stone-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[380px]">
                {JSON.stringify(
                  {
                    mode: state.mode,
                    turnPlayer: state.turnPlayer,
                    turnCount: state.turnCount,
                    phase: state.phase,
                    selectedFigureId: state.selectedFigureId,
                    validMoveNodeIds: Object.keys(state.validMoveNodes),
                    validAttackFigureIds: state.validAttackFigureIds,
                    activeBuffs: state.activeBuffs,
                    koQueue: state.koQueue,
                    boardPositions: state.figures
                      .filter(f => f.location === 'board')
                      .map(f => ({ id: f.id, name: f.shortName, owner: f.owner, nodeId: f.nodeId, wait: f.wait }))
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ============================================================================
 * 🚀 COMPONENTE RAÍZ: App (Orquestador Principal de Capas)
 * ============================================================================ */
export default function App() {
  const { state, dispatch, isMuted, toggleMute } = useShinobiDuel();
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [isBingoModalOpen, setIsBingoModalOpen] = useState(false);

  const inspectedFigure = useMemo(
    () => state.figures.find(f => f.id === state.inspectedFigureId) || state.figures[0],
    [state.figures, state.inspectedFigureId]
  );

  const handleSelectUnit = useCallback(
    figureId => {
      if (state.mode === 'ai' && state.turnPlayer === 2 && state.phase !== 'GAMEOVER') {
        dispatch({ type: 'INSPECT_UNIT', payload: { figureId } });
        return;
      }
      soundEngine.play('select');
      dispatch({ type: 'SELECT_UNIT', payload: { figureId } });
    },
    [state.mode, state.turnPlayer, state.phase, dispatch]
  );

  const handleSelectNode = useCallback(
    nodeId => {
      if (state.mode === 'ai' && state.turnPlayer === 2) return;
      soundEngine.play('move');
      dispatch({ type: 'MOVE_UNIT', payload: { targetNodeId: nodeId } });
    },
    [state.mode, state.turnPlayer, dispatch]
  );

  const handleActivateScroll = useCallback(
    (player, scrollId) => {
      soundEngine.play('scroll');
      dispatch({ type: 'ACTIVATE_SCROLL', payload: { player, scrollId } });
    },
    [dispatch]
  );

  return (
    <div
      className="min-h-screen flex flex-col text-stone-900 select-none"
      style={{
        backgroundColor: '#140e0a',
        backgroundImage:
          'radial-gradient(circle at 50% 20%, rgba(185, 28, 28, 0.09), transparent 70%), repeating-linear-gradient(45deg, #18110c 0px, #18110c 12px, #140e0a 12px, #140e0a 24px)'
      }}
    >
      {/* TOP LACQUERED WOOD & KONOHA FOREHEAD PROTECTOR HEADER */}
      <header className="bg-gradient-to-b from-[#261911] to-[#170f0a] border-b-4 border-red-900 px-3 py-2 sticky top-0 z-30 shadow-xl">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Konoha Metal Plate & Brand */}
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1.5 rounded flex items-center gap-2 border-2 border-slate-800 bg-gradient-to-br from-slate-400 via-slate-200 to-slate-500 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              <svg className="w-6 h-6 text-slate-900" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M21 19c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5z" />
                <path d="M21 19c0 5-4 9-9 9s-9-4-9-9 4-9 9-9c3.8 0 7.2 1.8 11 1.5l8-4.5-3.5 9.5C26 22 21 26 15 27" />
                <path d="M4 28l6-4" strokeLinecap="round" />
              </svg>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black tracking-wider text-amber-400">
                  SHINOBI DUEL
                </h1>
                <span className="px-1.5 py-0.5 text-[10px] font-black bg-red-950 text-red-400 border border-red-600 rounded-sm">
                  CLEAN ARCH
                </span>
              </div>
              <p className="text-[11px] text-amber-200/75 -mt-0.5">
                中忍試験・盤上戦術 — Arquitectura React DDD & Tablero Táctico de 28 Nodos
              </p>
            </div>
          </div>

          {/* Active Turn Washi Banner */}
          <div className="bg-[#f4ebd9] px-3.5 py-1.5 rounded flex items-center gap-2.5 border-2 border-amber-950 shadow">
            <span className="w-6 h-6 flex items-center justify-center border-2 border-red-700 text-red-700 font-black text-xs bg-red-50">
              {state.turnPlayer === 1 ? '火' : '暁'}
            </span>
            <span className="text-xs md:text-sm font-black tracking-wide text-stone-900">
              {state.turnPlayer === 1
                ? `TURNO ${state.turnCount}: ALDEA DE LA HOJA (J1)`
                : state.mode === 'ai'
                ? `TURNO ${state.turnCount}: MOVIENDO IA AKATSUKI...`
                : `TURNO ${state.turnCount}: AKATSUKI (J2)`}
            </span>
            {state.turnCount === 1 && (
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-red-800 text-amber-100 rounded-sm">
                Turno 1: -1 MP
              </span>
            )}
          </div>

          {/* Action & Clean Architecture Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 border border-amber-300 text-xs font-black transition flex items-center gap-1.5 shadow"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Arquitectura Clean</span>
            </button>
            <button
              onClick={() => setIsBingoModalOpen(true)}
              className="px-2.5 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-600 text-xs font-bold transition flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Libro Bingo</span>
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_MODE' })}
              className="px-2.5 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-600 text-xs font-bold transition flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>{state.mode === 'ai' ? 'Vs IA Akatsuki' : '2J Local'}</span>
            </button>
            <button
              onClick={toggleMute}
              className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-600 transition"
              title="Alternar Sonido Taiko"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => dispatch({ type: 'RESET_GAME' })}
              className="px-2.5 py-1.5 rounded bg-red-900 hover:bg-red-800 text-red-100 border border-red-600 text-xs font-bold transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN 3-COLUMN TACTICAL LAYOUT */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-2.5 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: BINGO BOOK DOSSIER & CHAKRA DISK INSPECTOR (3 COLS) */}
        <section className="lg:col-span-3 flex flex-col gap-3 order-2 lg:order-1">
          <BingoInspectorScroll
            figure={inspectedFigure}
            state={state}
            onOpenWorkshop={() => setIsBingoModalOpen(true)}
          />
        </section>

        {/* CENTER COLUMN: CHUNIN ARENA SVG & COMMAND BARS (6 COLS) */}
        <section className="lg:col-span-6 flex flex-col gap-2.5 order-1 lg:order-2">
          <PlayerCommandBar
            player={2}
            state={state}
            onSelectUnit={handleSelectUnit}
            onActivateScroll={handleActivateScroll}
          />

          <ChuninArenaSVG
            state={state}
            onSelectUnit={handleSelectUnit}
            onSelectNode={handleSelectNode}
            onEndPostMove={() => dispatch({ type: 'END_TURN' })}
          />

          <PlayerCommandBar
            player={1}
            state={state}
            onSelectUnit={handleSelectUnit}
            onActivateScroll={handleActivateScroll}
          />
        </section>

        {/* RIGHT COLUMN: HIERARCHY LAWS & BATTLE CHRONICLE LOG (3 COLS) */}
        <section className="lg:col-span-3 flex flex-col gap-3 order-3">
          <div className="shadow-2xl">
            <div className="h-2.5 bg-gradient-to-r from-amber-700 via-[#281b12] to-amber-700 rounded-t border-b-2 border-stone-950" />
            <div className="bg-[#f4ebd9] text-stone-900 p-3.5 border-x-4 border-[#281b12]">
              <div className="flex items-center justify-between border-b-2 border-stone-800/30 pb-2 mb-2.5">
                <h3 className="font-black text-xs text-stone-900 uppercase flex items-center gap-1.5">
                  <span className="px-1 py-0.5 text-[10px] border-2 border-red-800 text-red-800 font-black">
                    法
                  </span>
                  Jerarquía y Estados Oficiales
                </h3>
                <button
                  onClick={() => dispatch({ type: 'END_TURN' })}
                  disabled={state.mode === 'ai' && state.turnPlayer === 2}
                  className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-amber-300 text-[11px] font-bold transition shadow"
                >
                  Pasar Turno
                </button>
              </div>

              <div className="space-y-1.5 text-[11px] font-medium text-stone-900">
                <div className="flex items-center gap-2 p-1.5 rounded bg-stone-900/10 border border-stone-800/20">
                  <span className="w-3.5 h-3.5 rounded-sm bg-sky-600 border border-stone-900 shrink-0" />
                  <span>
                    <strong className="text-sky-900">Azul (Kawarimi):</strong> Esquiva e invalida cualquier ataque.
                  </span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-stone-900/10 border border-stone-800/20">
                  <span className="w-3.5 h-3.5 rounded-sm bg-amber-400 border border-stone-900 shrink-0" />
                  <span>
                    <strong className="text-amber-900">Dorado (Veloz):</strong> Destruye Jutsus{' '}
                    <strong className="text-purple-800">Morados</strong> y vence a Blanco menor.
                  </span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-stone-900/10 border border-stone-800/20">
                  <span className="w-3.5 h-3.5 rounded-sm bg-purple-700 border border-stone-900 shrink-0" />
                  <span>
                    <strong className="text-purple-900">Morado (Jutsu ★):</strong> 0 DMG numérico; vence a{' '}
                    <strong>Blanco</strong> y aplica efectos.
                  </span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded bg-stone-900/10 border border-stone-800/20">
                  <span className="w-3.5 h-3.5 rounded-sm bg-white border border-stone-900 shrink-0" />
                  <span>
                    <strong className="text-stone-950">Blanco (Físico / 50x):</strong> Gana el daño mayor; los ataques <strong>x</strong> re-giran.
                  </span>
                </div>
              </div>

              {/* Status Effects Quick Reference */}
              <div className="mt-2.5 pt-2 border-t border-stone-800/30 grid grid-cols-2 gap-1 text-[10px]">
                <div className="p-1 rounded bg-stone-900 text-amber-100">
                  <strong className="text-orange-400">炎 Quemadura:</strong> -20 DMG + 1 sector a Rojo
                </div>
                <div className="p-1 rounded bg-stone-900 text-amber-100">
                  <strong className="text-yellow-400">痺 Parálisis:</strong> Sector menor pasa a Rojo
                </div>
                <div className="p-1 rounded bg-stone-900 text-amber-100">
                  <strong className="text-purple-300">幻 Confusión:</strong> Desvía giro +1 sector
                </div>
                <div className="p-1 rounded bg-stone-900 text-amber-100">
                  <strong className="text-sky-300">砂 Arena:</strong> 100% Rojo hasta toque aliado
                </div>
              </div>
            </div>
            <div className="h-2.5 bg-gradient-to-r from-amber-700 via-[#281b12] to-amber-700 rounded-b border-t-2 border-stone-950" />
          </div>

          {/* Battle Chronicle Log */}
          <div className="bg-gradient-to-b from-[#261911] to-[#170f0a] border-2 border-stone-700 rounded-lg p-3.5 flex-1 flex flex-col max-h-[340px] shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-700 pb-2 mb-2">
              <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span className="px-1 py-0.5 text-[10px] bg-red-950 text-red-400 border border-red-600 font-black">
                  録
                </span>
                CRÓNICA DE LA ARENA CHUNIN
              </h3>
              <span className="text-[10px] text-stone-400">{state.logs.length} eventos</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-[11px] font-medium">
              {state.logs.map(entry => {
                let textStyle = 'text-stone-200';
                if (entry.tone === 'highlight') textStyle = 'text-amber-300 font-bold';
                if (entry.tone === 'ko') textStyle = 'text-red-400 font-bold';
                if (entry.tone === 'p1') textStyle = 'text-orange-300';
                if (entry.tone === 'p2') textStyle = 'text-red-300';

                return (
                  <div
                    key={entry.id}
                    className={`p-1.5 rounded bg-stone-950/85 border border-stone-800 ${textStyle}`}
                  >
                    <span className="text-amber-600 font-bold mr-1">[T{entry.turn}]</span>
                    {entry.text}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* CHAKRA DUEL SPINNING MODAL */}
      {state.phase === 'BATTLE' && state.currentBattle && (
        <ChakraDuelModal
          state={state}
          onRespin={() => {
            soundEngine.play('spin');
            dispatch({ type: 'RESPIN_BATTLE_WHEEL' });
          }}
          onConfirmResolution={() => {
            soundEngine.play('ko');
            dispatch({ type: 'RESOLVE_DUEL' });
          }}
        />
      )}

      {/* VICTORY MODAL */}
      {state.phase === 'GAMEOVER' && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="h-3 bg-gradient-to-r from-amber-600 via-[#281b12] to-amber-600 rounded-t" />
            <div className="bg-[#f4ebd9] p-6 text-center border-4 border-amber-700 text-stone-900">
              <div className="w-16 h-16 border-4 border-red-800 text-red-800 font-black text-3xl flex items-center justify-center mx-auto mb-3 bg-red-50">
                勝
              </div>
              <h2 className="text-2xl font-black text-stone-900">
                {state.winner === 1 ? '¡VICTORIA DE LA HOJA (J1)!' : '¡VICTORIA DE AKATSUKI (J2)!'}
              </h2>
              <p className="text-sm font-bold text-red-900 mt-2 mb-6">{state.victoryReason}</p>
              <button
                onClick={() => dispatch({ type: 'RESET_GAME' })}
                className="w-full py-3 rounded bg-red-800 hover:bg-red-700 text-amber-100 font-black uppercase tracking-wider text-xs border-2 border-amber-500 shadow-lg transition"
              >
                Nuevo Duelo en la Arena
              </button>
            </div>
            <div className="h-3 bg-gradient-to-r from-amber-600 via-[#281b12] to-amber-600 rounded-b" />
          </div>
        </div>
      )}

      {/* BINGO BOOK CODEX, FORJA SHINOBI (LV 1-5 & CLV 0-10) & 6-COST PLATE DECK BUILDER MODAL */}
      {isBingoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-6xl w-full max-h-[92vh] flex flex-col">
            <div className="h-3 bg-gradient-to-r from-amber-600 via-[#281b12] to-amber-600 rounded-t" />
            <div className="bg-[#f4ebd9] p-5 overflow-y-auto flex-1 text-stone-900 border-x-4 border-[#281b12]">
              <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 flex items-center justify-center border-2 border-red-800 text-red-800 font-black text-lg bg-red-50">
                    書
                  </span>
                  <div>
                    <h2 className="text-xl font-black text-stone-900">
                      LIBRO BINGO & FORJA SHINOBI — NIVELES (Nv.1-5), FUSIÓN (CLv) Y MAZO DE 6 COSTES
                    </h2>
                    <p className="text-xs text-stone-700 font-bold">
                      Personaliza el Nivel (expande un sector reduciendo el Fallo Rojo en base 96), el CLv (+1 DMG) y tu Mazo de 6 Figuras.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBingoModalOpen(false)}
                  className="px-3 py-1 rounded bg-red-900 text-amber-100 font-bold text-xs hover:bg-red-800"
                >
                  ✕ Cerrar Libro
                </button>
              </div>

              {/* Deck Builder (Choose 6 of 8 Shinobi + 6-Cost Plates) */}
              <div className="mb-4 p-3.5 rounded-lg bg-stone-900 text-stone-100 border-2 border-amber-600 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-700 pb-2">
                  <div>
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                      1. Escuadrón Konoha (Elige 6 de las 8 Figuras Oficiales)
                    </span>
                    <p className="text-[11px] text-stone-300">
                      Activas ({state.selectedTeamKeys.length}/6): haz clic para incluir o retirar una figura y reiniciar el despliegue.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SHINOBI_FIGURES_CATALOG.map(fig => {
                      const inTeam = state.selectedTeamKeys.includes(fig.key);
                      return (
                        <button
                          key={fig.key}
                          onClick={() => {
                            let nextKeys = [...state.selectedTeamKeys];
                            if (inTeam) {
                              if (nextKeys.length <= 6) return;
                              nextKeys = nextKeys.filter(k => k !== fig.key);
                            } else {
                              if (nextKeys.length >= 6) nextKeys.shift();
                              nextKeys.push(fig.key);
                            }
                            dispatch({
                              type: 'UPDATE_DECK_LOADOUT',
                              payload: { selectedTeamKeys: nextKeys, selectedPlateIds: state.selectedPlateIds }
                            });
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-bold border transition ${
                            inTeam
                              ? 'bg-amber-500 text-stone-950 border-amber-200 shadow'
                              : 'bg-stone-950 text-stone-400 border-stone-700 hover:text-white'
                          }`}
                        >
                          [{fig.rarity}] {fig.shortName} ({fig.mp}MP)
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Plate Cost Builder (Max 6 Cost) */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                      2. Pergaminos Tácticos (Capacidad Oficial: {
                        state.selectedPlateIds.reduce((acc, pid) => {
                          const t = TACTICAL_SCROLLS_CATALOG.find(s => s.id === pid);
                          return acc + (t ? t.cost : 1);
                        }, 0)
                      } / {MAX_PLATE_CAPACITY} Costes)
                    </span>
                    <p className="text-[11px] text-stone-300">
                      Goal Block y Max Revive consumen 2 puntos de capacidad; las demás consumen 1 punto.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TACTICAL_SCROLLS_CATALOG.map(sc => {
                      const isEquipped = state.selectedPlateIds.includes(sc.id);
                      const currentCost = state.selectedPlateIds.reduce((acc, pid) => {
                        const t = TACTICAL_SCROLLS_CATALOG.find(s => s.id === pid);
                        return acc + (t ? t.cost : 1);
                      }, 0);
                      return (
                        <button
                          key={sc.id}
                          onClick={() => {
                            let nextPlates = [...state.selectedPlateIds];
                            if (isEquipped) {
                              nextPlates = nextPlates.filter(id => id !== sc.id);
                            } else if (currentCost + sc.cost <= MAX_PLATE_CAPACITY) {
                              nextPlates.push(sc.id);
                            }
                            dispatch({
                              type: 'UPDATE_DECK_LOADOUT',
                              payload: { selectedTeamKeys: state.selectedTeamKeys, selectedPlateIds: nextPlates }
                            });
                          }}
                          className={`px-2 py-1 rounded text-[11px] font-bold border transition ${
                            isEquipped
                              ? 'bg-emerald-600 text-white border-emerald-300'
                              : 'bg-stone-950 text-stone-400 border-stone-700 hover:text-white'
                          }`}
                        >
                          {sc.kanji} {sc.name} (Coste {sc.cost})
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {SHINOBI_FIGURES_CATALOG.map(c => {
                  const custom = state.customizations[c.key] || { level: 5, clv: 1, lvTargetIndex: 0, clvTargetIndex: 0 };
                  const previewFig = {
                    ...c,
                    baseSegments: c.segments,
                    level: custom.level,
                    clv: custom.clv,
                    lvTargetIndex: custom.lvTargetIndex,
                    clvTargetIndex: custom.clvTargetIndex,
                    evolved: false,
                    status: null
                  };
                  const computedSegs = getComputedFigureSegments(previewFig);
                  const totals = getFigureColorBreakdown(computedSegs);

                  return (
                    <div
                      key={c.key}
                      className="bg-gradient-to-b from-[#261911] to-[#170f0a] text-stone-100 rounded-lg p-3 border-2 border-stone-700 flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2.5 border-b border-stone-700 pb-2 mb-2">
                          <img
                            src={c.portraitUrl}
                            alt={c.name}
                            className="w-14 h-14 rounded border-2 border-amber-500 object-cover object-top bg-stone-800 shrink-0"
                            onError={e => {
                              e.currentTarget.src = CHAR_SVG_FALLBACKS[c.key];
                            }}
                          />
                          <div>
                            <span className="text-[10px] font-black text-amber-400">
                              [{c.rarity}] • {c.mp} MP
                            </span>
                            <h3 className="text-sm font-black text-white leading-tight">{c.name}</h3>
                            <p className="text-[10px] font-bold text-amber-200/90 mt-0.5">{c.archetype}</p>
                          </div>
                        </div>

                        {/* Interactive Level (1-5) & CLv (0-10) Controls */}
                        <div className="mb-2 p-2 rounded bg-stone-950 border border-stone-700 space-y-1.5 text-[10px]">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-300">Nivel (Nv.{custom.level}/5):</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(lv => (
                                <button
                                  key={lv}
                                  onClick={() =>
                                    dispatch({
                                      type: 'UPDATE_FIGURE_WORKSHOP',
                                      payload: { ...custom, figKey: c.key, level: lv }
                                    })
                                  }
                                  className={`w-5 h-5 rounded font-black ${
                                    custom.level === lv ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                                  }`}
                                >
                                  {lv}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-300">Fusión (CLv +{custom.clv}):</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  dispatch({
                                    type: 'UPDATE_FIGURE_WORKSHOP',
                                    payload: { ...custom, figKey: c.key, clv: Math.max(0, custom.clv - 1) }
                                  })
                                }
                                className="px-1.5 rounded bg-stone-800 hover:bg-stone-700 font-bold"
                              >
                                -
                              </button>
                              <span className="font-mono font-black px-1 text-white">+{custom.clv} DMG</span>
                              <button
                                onClick={() =>
                                  dispatch({
                                    type: 'UPDATE_FIGURE_WORKSHOP',
                                    payload: { ...custom, figKey: c.key, clv: Math.min(10, custom.clv + 1) }
                                  })
                                }
                                className="px-1.5 rounded bg-stone-800 hover:bg-stone-700 font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 96-Segment Proportional Bar */}
                        <div className="mb-2">
                          <div className="w-full h-2 rounded-sm overflow-hidden flex border border-stone-600">
                            {['white', 'gold', 'purple', 'blue', 'red'].map(colKey => {
                              const count = totals[colKey] || 0;
                              if (!count) return null;
                              return (
                                <div
                                  key={colKey}
                                  style={{
                                    width: `${(count / WHEEL_TOTAL_SEGMENTS) * 100}%`,
                                    backgroundColor: WHEEL_COLORS[colKey].fill
                                  }}
                                />
                              );
                            })}
                          </div>
                          <div className="flex justify-between text-[9px] font-mono mt-1 text-stone-300">
                            <span>BLA:{totals.white}</span>
                            <span className="text-amber-400">DOR:{totals.gold}</span>
                            <span className="text-purple-300">MOR:{totals.purple}</span>
                            <span className="text-sky-300">AZU:{totals.blue}</span>
                            <span className="text-red-400">ROJ:{totals.red}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-stone-300 leading-snug mb-2">{c.ability}</p>
                      </div>

                      <div className="space-y-1 text-[10px] border-t border-stone-800 pt-2">
                        <div className="text-[9px] text-amber-300/80 mb-1">
                          Clic en un sector para asignarle el bono de Nivel (+{custom.level - 1} seg.) y CLv (+{custom.clv} DMG):
                        </div>
                        {computedSegs.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (s.color === 'red') return;
                              dispatch({
                                type: 'UPDATE_FIGURE_WORKSHOP',
                                payload: {
                                  ...custom,
                                  figKey: c.key,
                                  lvTargetIndex: idx,
                                  clvTargetIndex: s.color === 'white' || s.color === 'gold' ? idx : custom.clvTargetIndex
                                }
                              });
                            }}
                            className={`w-full flex justify-between items-center p-1 rounded text-left border transition ${
                              custom.lvTargetIndex === idx
                                ? 'bg-amber-950/60 border-amber-500'
                                : 'bg-stone-950/60 border-stone-800 hover:border-stone-600'
                            }`}
                          >
                            <span className="text-amber-100 font-semibold truncate pr-1">
                              <span
                                className="inline-block w-2 h-2 rounded-full mr-1"
                                style={{ backgroundColor: WHEEL_COLORS[s.color].fill }}
                              />
                              {s.name}
                            </span>
                            <span className="text-amber-400 font-mono font-bold shrink-0 text-[9px]">
                              {s.color === 'white' || s.color === 'gold'
                                ? `${s.power} DMG`
                                : s.color === 'purple'
                                ? `${'★'.repeat(s.stars)}`
                                : s.color.toUpperCase()}{' '}
                              • {s.size}/96
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="h-3 bg-gradient-to-r from-amber-600 via-[#281b12] to-amber-600 rounded-b" />
          </div>
        </div>
      )}

      {/* CLEAN ARCHITECTURE & LIVE STATE INSPECTOR MODAL */}
      <CleanArchInspectorModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
        state={state}
      />
    </div>
  );
}