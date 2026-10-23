export type FigureRarity = 'C' | 'UC' | 'R' | 'EX' | 'UX';

export interface ChakraDustInventory {
  c: number;
  uc: number;
  r: number;
  ex: number;
  ux: number;
}

export interface FigureUpgradeCost {
  dustRarity: FigureRarity;
  dustAmount: number;
  ryoAmount: number;
}

export const DISENCHANT_YIELD: Record<FigureRarity, { dustRarity: FigureRarity; amount: number; ryoBonus: number }> = {
  C: { dustRarity: 'C', amount: 20, ryoBonus: 50 },
  UC: { dustRarity: 'UC', amount: 15, ryoBonus: 100 },
  R: { dustRarity: 'R', amount: 10, ryoBonus: 250 },
  EX: { dustRarity: 'EX', amount: 5, ryoBonus: 600 },
  UX: { dustRarity: 'UX', amount: 2, ryoBonus: 1500 },
};

export const LEVEL_UP_COSTS: Record<number, { dustAmount: number; ryoAmount: number }> = {
  2: { dustAmount: 5, ryoAmount: 200 },
  3: { dustAmount: 10, ryoAmount: 500 },
  4: { dustAmount: 15, ryoAmount: 1000 },
  5: { dustAmount: 25, ryoAmount: 2000 },
};

export const CLV_UPGRADE_COST = {
  dustAmount: 8,
  ryoAmount: 500,
};

export interface ArenaThemeItem {
  key: string;
  name: string;
  jpName: string;
  description: string;
  backgroundUrl: string;
  particleType: 'none' | 'falling_leaves' | 'rain' | 'poison_mist' | 'sandstorm';
  gridGlowColor: string;
  unlockCostRyo: number;
  isUnlockedByDefault: boolean;
}

export const CANONICAL_ARENA_THEMES: ArenaThemeItem[] = [
  {
    key: 'konoha_chunin',
    name: 'Estadio del Examen Chūnin',
    jpName: '中忍選抜試験場',
    description: 'El tradicional estadio de Konoha donde los mejores genin se convierten en chūnin. Madera de cedro y hojas de la Voluntad de Fuego.',
    backgroundUrl: '/assets/bg_konoha_chunin.jpg',
    particleType: 'falling_leaves',
    gridGlowColor: '#FA9427',
    unlockCostRyo: 0,
    isUnlockedByDefault: true, // Única habilitada por defecto
  },
  {
    key: 'valley_of_the_end',
    name: 'Valle del Fin (Shūmatsu no Tani)',
    jpName: '終末の谷',
    description: 'El mítico campo de duelo donde chocan los ideales de Hashirama y Madara. Cascadas torrenciales y lluvia incesante.',
    backgroundUrl: '/assets/bg_valley_of_end.jpg',
    particleType: 'rain',
    gridGlowColor: '#0284C7',
    unlockCostRyo: 5000,
    isUnlockedByDefault: false, // Desbloqueable
  },
  {
    key: 'forest_of_death',
    name: 'Bosque de la Muerte (Shi no Mori)',
    jpName: '死の森',
    description: 'Área 44 de entrenamiento. Árboles gigantescos centenarios, fauna hostil y densa bruma venenosa.',
    backgroundUrl: '/assets/bg_forest_of_death.jpg',
    particleType: 'poison_mist',
    gridGlowColor: '#16A34A',
    unlockCostRyo: 4000,
    isUnlockedByDefault: false, // Desbloqueable
  },
  {
    key: 'suna_desert',
    name: 'Desierto de Sunagakure',
    jpName: '砂隠れの砂漠',
    description: 'Inmensas dunas doradas bajo el sol abrasador, con ráfagas continuas de tormentas de arena.',
    backgroundUrl: '/assets/bg_suna_desert.jpg',
    particleType: 'sandstorm',
    gridGlowColor: '#EAB308',
    unlockCostRyo: 3500,
    isUnlockedByDefault: false, // Desbloqueable
  },
  {
    key: 'rain_village',
    name: 'Amegakure (Aldea de la Lluvia)',
    jpName: '雨隠れの里',
    description: 'La fortaleza vertical de acero de Akatsuki. Torretas de metal, tuberías industriales y lluvia perpetua.',
    backgroundUrl: '/assets/bg_rain_village.jpg',
    particleType: 'rain',
    gridGlowColor: '#9333EA',
    unlockCostRyo: 6000,
    isUnlockedByDefault: false, // Desbloqueable
  },
];
