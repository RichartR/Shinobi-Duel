export interface TacticalScroll {
  id: string;
  name: string;
  kanji: string;
  cost: number;
  description: string;
  targetType: 'figure_on_bench' | 'figure_on_board' | 'figure_in_ko' | 'global';
  actionType: 'GOAL_BLOCK' | 'MAX_REVIVE' | 'DOUBLE_CHANCE' | 'X_ATTACK' | 'HURDLE_JUMP';
}

export const MAX_PLATE_CAPACITY = 6;

export const TACTICAL_SCROLLS_CATALOG: TacticalScroll[] = [
  {
    id: 'goal_block',
    name: 'Pergamino de Protección (Goal Block)',
    kanji: '守',
    cost: 2,
    description: 'Teletransporta a un aliado desde el banquillo o campo directamente a la Base propia.',
    targetType: 'figure_on_bench',
    actionType: 'GOAL_BLOCK',
  },
  {
    id: 'max_revive',
    name: 'Sello de Resurrección (Max Revive)',
    kanji: '蘇',
    cost: 2,
    description: 'Libera de inmediato a una figura aliada de la Prisión Fuinjutsu a la banca sin condición de espera.',
    targetType: 'figure_in_ko',
    actionType: 'MAX_REVIVE',
  },
  {
    id: 'double_chance',
    name: 'Ojo de la Presciencia (Double Chance)',
    kanji: '瞳',
    cost: 1,
    description: 'Permite re-girar la ruleta de chakra en el siguiente combate si el resultado no es favorable.',
    targetType: 'global',
    actionType: 'DOUBLE_CHANCE',
  },
  {
    id: 'x_attack',
    name: 'Píldora Militar de Chakra (X Attack)',
    kanji: '力',
    cost: 1,
    description: 'Aumenta en +30 DMG todos los ataques blancos y dorados del ninja durante este turno.',
    targetType: 'figure_on_board',
    actionType: 'X_ATTACK',
  },
  {
    id: 'hurdle_jump',
    name: 'Salto de Teletransporte (Hurdle Jump)',
    kanji: '躍',
    cost: 2,
    description: 'Permite saltar sobre una figura adyacente (aliada o enemiga) hacia un nodo libre continuo.',
    targetType: 'figure_on_board',
    actionType: 'HURDLE_JUMP',
  },
];
