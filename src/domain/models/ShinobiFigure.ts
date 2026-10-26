export type WheelColor = 'white' | 'gold' | 'purple' | 'blue' | 'red';

export type FigureStatus = 'burned' | 'paralyzed' | 'confused' | 'frozen' | null;

export interface WheelSegment {
  name: string;
  color: WheelColor;
  power: number;
  stars: number;
  size: number;
  effect?: string | null;
}

export interface FigureCustomization {
  level: number;
  clv: number;
  lvTargetIndex: number;
  clvTargetIndex: number;
}

export interface ShinobiFigureCatalogItem {
  id: string;
  characterId: string;
  key: string;
  name: string;
  shortName: string;
  rarity: 'UX' | 'EX' | 'R' | 'UC' | 'C';
  mp: number;
  archetype: string;
  ability: string;
  canPassThrough?: boolean;
  immuneToSurround?: boolean;
  blocksPassThrough?: boolean;
  portraitUrl: string;
  segments: WheelSegment[];
  isStarter?: boolean;
}

export const DEFAULT_STARTER_FIGURE_KEYS: string[] = ['naruto_genin', 'sasuke_genin', 'sakura_genin'];

export interface ShinobiFigureState extends ShinobiFigureCatalogItem {
  id: string;
  owner: 1 | 2;
  location: 'bench' | 'board' | 'ko';
  nodeId: number | null;
  baseMp: number;
  level: number;
  clv: number;
  lvTargetIndex: number;
  clvTargetIndex: number;
  evolved: boolean;
  status: FigureStatus;
  wait: number;
  baseSegments: WheelSegment[];
}

export const WHEEL_TOTAL_SEGMENTS = 96;

export const WHEEL_COLORS: Record<WheelColor, { fill: string; stroke: string; label: string; textClass: string }> = {
  white: { fill: '#ffffff', stroke: '#1e293b', label: 'Blanco (Físico)', textClass: 'text-stone-900' },
  gold: { fill: '#f59e0b', stroke: '#78350f', label: 'Dorado (Veloz)', textClass: 'text-amber-900' },
  purple: { fill: '#7e22ce', stroke: '#3b0764', label: 'Morado (Jutsu ★)', textClass: 'text-purple-100' },
  blue: { fill: '#0284c7', stroke: '#082f49', label: 'Azul (Kawarimi)', textClass: 'text-sky-100' },
  red: { fill: '#dc2626', stroke: '#450a0a', label: 'Rojo (Fallo)', textClass: 'text-red-100' },
};

/**
 * Computes wheel segments taking into account Level (Lv 1-5), Chain Level (CLv 0-10),
 * Evolution bonuses, and status condition mutations according to canonical rules.
 */
export function getComputedFigureSegments(figure: {
  baseSegments: WheelSegment[];
  level?: number;
  clv?: number;
  lvTargetIndex?: number;
  clvTargetIndex?: number;
  evolved?: boolean;
  status?: FigureStatus;
}): WheelSegment[] {
  const {
    baseSegments,
    level = 1,
    clv = 0,
    lvTargetIndex = 0,
    clvTargetIndex = 0,
    evolved = false,
    status = null,
  } = figure;

  // Level transfer: up to (level - 1) segments moved from red miss to target segment.
  // The red segment cannot fall below 4 segments.
  const targetIndex = lvTargetIndex;
  const redIndex = baseSegments.findIndex(s => s.color === 'red');
  const deltaLv = Math.max(0, level - 1);

  let segments = baseSegments.map((s, idx) => {
    let size = s.size;
    let power = s.power;
    let stars = s.stars;

    if (idx === targetIndex && s.color !== 'red' && redIndex !== -1) {
      const redOriginal = baseSegments[redIndex].size;
      const actualTransfer = Math.min(deltaLv, Math.max(0, redOriginal - 4));
      size += actualTransfer;
    } else if (idx === redIndex && redIndex !== -1) {
      size = Math.max(4, s.size - deltaLv);
    }

    if (idx === clvTargetIndex && (s.color === 'white' || s.color === 'gold')) {
      power += clv;
    }

    if (evolved) {
      if (s.color === 'white' || s.color === 'gold') power += 10;
      if (s.color === 'purple') stars += 1;
    }

    return { ...s, size, power, stars };
  });

  // Sand coffin / frozen: entire wheel turns into a 96-segment absolute miss
  if (status === 'frozen') {
    return [
      {
        name: 'Sellado en Arena',
        color: 'red',
        power: 0,
        stars: 0,
        size: WHEEL_TOTAL_SEGMENTS,
        effect: 'frozen_tag_required',
      },
    ];
  }

  // Burn: -10 DMG on physical/gold and the smallest non-red segment mutates to red
  if (status === 'burned') {
    let smallestIdx = -1;
    let smallestSize = 999;
    segments.forEach((s, idx) => {
      if (s.color !== 'red' && s.size < smallestSize) {
        smallestSize = s.size;
        smallestIdx = idx;
      }
    });

    segments = segments.map((s, idx) => {
      const mutated = { ...s };
      if (mutated.color === 'white' || mutated.color === 'gold') {
        mutated.power = Math.max(0, mutated.power - 10);
      }
      if (idx === smallestIdx) {
        mutated.color = 'red';
        mutated.power = 0;
        mutated.stars = 0;
        mutated.name = `${mutated.name} (Quemado)`;
      }
      return mutated;
    });
  }

  // Paralysis: smallest non-red segment mutates to red (damage untouched)
  if (status === 'paralyzed') {
    let smallestIdx = -1;
    let smallestSize = 999;
    segments.forEach((s, idx) => {
      if (s.color !== 'red' && s.size < smallestSize) {
        smallestSize = s.size;
        smallestIdx = idx;
      }
    });

    if (smallestIdx !== -1) {
      segments = segments.map((s, idx) => {
        if (idx === smallestIdx) {
          return {
            ...s,
            color: 'red',
            power: 0,
            stars: 0,
            name: `${s.name} (Paralizado)`,
          };
        }
        return s;
      });
    }
  }

  return segments;
}

export function getFigureColorBreakdown(segments: WheelSegment[]): Record<WheelColor, number> {
  const totals: Record<WheelColor, number> = {
    white: 0,
    gold: 0,
    purple: 0,
    blue: 0,
    red: 0,
  };
  for (const s of segments) {
    if (totals[s.color] !== undefined) {
      totals[s.color] += s.size;
    }
  }
  return totals;
}
