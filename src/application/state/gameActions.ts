import { FigureCustomization } from '../../domain/models/ShinobiFigure';

export type GameAction =
  | {
      type: 'RESET_GAME';
      payload?: {
        mode?: 'ai' | 'local';
        selectedTeamKeys?: string[];
        selectedPlateIds?: string[];
        customizations?: Record<string, FigureCustomization>;
      };
    }
  | {
      type: 'UPDATE_FIGURE_WORKSHOP';
      payload: FigureCustomization & { figKey: string };
    }
  | { type: 'RESET_ALL_FIGURE_WORKSHOP' }
  | {
      type: 'UPDATE_DECK_LOADOUT';
      payload: {
        selectedTeamKeys?: string[];
        selectedPlateIds?: string[];
      };
    }
  | { type: 'TOGGLE_MODE' }
  | { type: 'INSPECT_UNIT'; payload: { figureId: string } }
  | { type: 'SELECT_UNIT'; payload: { figureId: string } }
  | { type: 'MOVE_UNIT'; payload: { targetNodeId: number; figureId?: string } }
  | { type: 'ACTIVATE_SCROLL'; payload: { player: 1 | 2; scrollSlotId: string } }
  | { type: 'REVEAL_BATTLE_SPIN' }
  | { type: 'RESPIN_BATTLE_WHEEL' }
  | { type: 'RESOLVE_DUEL' }
  | { type: 'END_TURN' };
