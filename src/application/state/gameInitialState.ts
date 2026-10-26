import {
  ShinobiFigureState,
  FigureCustomization,
  getComputedFigureSegments,
  DEFAULT_STARTER_FIGURE_KEYS,
} from '../../domain/models/ShinobiFigure';
import { TacticalScroll, TACTICAL_SCROLLS_CATALOG } from '../../domain/models/TacticalScroll';
import { SHINOBI_FIGURES_CATALOG } from '../../domain/catalogs/ShinobiCatalog';
import { ActiveBattleState } from '../../domain/models/BattleResult';
import { shinobiDbRepository } from '../../infrastructure/repositories/SupabaseShinobiRepository';

export type GamePhase =
  | 'SELECT'
  | 'SWAP_SELECT_1'
  | 'SWAP_SELECT_2'
  | 'GOAL_BLOCK_SELECT'
  | 'HEAL_SELECT'
  | 'REVIVE_SELECT'
  | 'POST_MOVE'
  | 'BATTLE'
  | 'GAMEOVER';

export interface EquippedScroll extends TacticalScroll {
  slotId: string;
  used: boolean;
}

export interface PlayerBuffs {
  powerBonus: number;
  mpBonus: number;
  doubleChance: boolean;
  desperateBoost: boolean;
  scrollUsedThisTurn: boolean;
}

export interface GameLogEntry {
  id: string;
  turn: number;
  text: string;
  tone?: 'normal' | 'highlight' | 'ko' | 'info' | 'p1' | 'p2';
}

export interface GameState {
  mode: 'ai' | 'local';
  turnPlayer: 1 | 2;
  turnCount: number;
  phase: GamePhase;
  selectedFigureId: string | null;
  inspectedFigureId: string;
  swapCandidateId: string | null;
  validMoveNodes: Record<number, number[]>;
  validAttackFigureIds: string[];
  selectedTeamKeys: string[];
  selectedPlateIds: string[];
  customizations: Record<string, FigureCustomization>;
  activeBuffs: Record<1 | 2, PlayerBuffs>;
  figures: ShinobiFigureState[];
  koQueue: { 1: string[]; 2: string[] };
  scrolls: { 1: EquippedScroll[]; 2: EquippedScroll[] };
  currentBattle: (ActiveBattleState & {
    atkRotations: number;
    defRotations: number;
    revealed: boolean;
    attacker: ShinobiFigureState;
    defender: ShinobiFigureState;
  }) | null;
  winner: 1 | 2 | null;
  victoryReason: string;
  logs: GameLogEntry[];
}

export const DEFAULT_TEAM_KEYS = DEFAULT_STARTER_FIGURE_KEYS;
export const DEFAULT_PLATE_DECK = ['goal_block', 'max_revive', 'double_chance', 'x_attack'];

export function createDefaultCustomizations(): Record<string, FigureCustomization> {
  const saved = shinobiDbRepository.getCustomizations();
  const map: Record<string, FigureCustomization> = {};
  SHINOBI_FIGURES_CATALOG.forEach(tpl => {
    map[tpl.key] = saved[tpl.key] || {
      level: 1,
      clv: 0,
      lvTargetIndex: 0,
      clvTargetIndex: 0,
    };
  });
  return map;
}

export function instantiateTeamRoster(
  playerNumber: 1 | 2,
  teamKeys: string[] = DEFAULT_TEAM_KEYS,
  customizations: Record<string, FigureCustomization> = {}
): ShinobiFigureState[] {
  const chosenTemplates = teamKeys
    .map(k => SHINOBI_FIGURES_CATALOG.find(t => t.key === k))
    .filter((t): t is typeof SHINOBI_FIGURES_CATALOG[0] => Boolean(t));

  return chosenTemplates.map((tpl, idx) => {
    const custom = customizations[tpl.key] || {
      level: 1,
      clv: 0,
      lvTargetIndex: 0,
      clvTargetIndex: 0,
    };

    const figObj: ShinobiFigureState = {
      id: `p${playerNumber}_${tpl.key}_${idx}`,
      owner: playerNumber,
      characterId: tpl.characterId,
      key: tpl.key,
      rarity: tpl.rarity,
      archetype: tpl.archetype,
      name: tpl.name,
      shortName: tpl.shortName,
      mp: tpl.mp,
      baseMp: tpl.mp,
      portraitUrl: tpl.portraitUrl,
      ability: tpl.ability,
      evolved: false,
      level: custom.level ?? 1,
      clv: custom.clv ?? 0,
      lvTargetIndex: custom.lvTargetIndex ?? 0,
      clvTargetIndex: custom.clvTargetIndex ?? 0,
      canPassThrough: Boolean(tpl.canPassThrough),
      blocksPassThrough: Boolean(tpl.blocksPassThrough),
      immuneToSurround: Boolean(tpl.immuneToSurround),
      baseSegments: tpl.segments.map(s => ({ ...s })),
      segments: [],
      location: 'bench',
      nodeId: null,
      wait: 0,
      status: null,
    };

    figObj.segments = getComputedFigureSegments(figObj);
    return figObj;
  });
}

export function createInitialGameState(
  mode: 'ai' | 'local' = 'ai',
  selectedTeamKeys?: string[],
  selectedPlateIds: string[] = DEFAULT_PLATE_DECK,
  customizations: Record<string, FigureCustomization> = createDefaultCustomizations()
): GameState {
  const profile = shinobiDbRepository.getProfile();
  const effectiveTeamKeys = selectedTeamKeys || profile.selectedTeamKeys || DEFAULT_TEAM_KEYS;
  const figures = [
    ...instantiateTeamRoster(1, effectiveTeamKeys, customizations),
    ...instantiateTeamRoster(2, ['kiba', 'shino', 'hinata', 'ino', 'sasuke', 'naruto'], customizations),
  ];

  const buildPlayerScrolls = (plateIds: string[]): EquippedScroll[] =>
    plateIds.map((pid, idx) => {
      const tpl = TACTICAL_SCROLLS_CATALOG.find(s => s.id === pid) || TACTICAL_SCROLLS_CATALOG[0];
      return { ...tpl, slotId: `${pid}_${idx}`, used: false };
    });

  return {
    mode,
    turnPlayer: 1,
    turnCount: 1,
    phase: 'SELECT',
    selectedFigureId: null,
    inspectedFigureId: figures[0].id,
    swapCandidateId: null,
    validMoveNodes: {},
    validAttackFigureIds: [],
    selectedTeamKeys: effectiveTeamKeys,
    selectedPlateIds,
    customizations,
    activeBuffs: {
      1: { powerBonus: 0, mpBonus: 0, doubleChance: false, desperateBoost: false, scrollUsedThisTurn: false },
      2: { powerBonus: 0, mpBonus: 0, doubleChance: false, desperateBoost: false, scrollUsedThisTurn: false },
    },
    figures,
    koQueue: { 1: [], 2: [] },
    scrolls: {
      1: buildPlayerScrolls(selectedPlateIds),
      2: buildPlayerScrolls(DEFAULT_PLATE_DECK),
    },
    currentBattle: null,
    winner: null,
    victoryReason: '',
    logs: [
      {
        id: 'init-1',
        turn: 1,
        text: '忍 ¡Comienza el Duelo Táctico en la Arena Chunin! Regla Turno 1: el jugador inicial tiene -1 MP.',
        tone: 'highlight',
      },
    ],
  };
}
