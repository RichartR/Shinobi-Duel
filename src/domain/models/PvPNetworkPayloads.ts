/**
 * Lightweight network contracts for Supabase Realtime broadcast channels (< 300 bytes).
 * Ensures zero-cost, low-latency communication on Supabase and Vercel free tiers.
 */

export interface PvPRosterFigureItem {
  figureId: string;    // e.g. 'naruto_genin'
  level: number;       // 1 - 5
  clv: number;         // 0 - 10
  lvTargetIndex?: number;
  clvTargetIndex?: number;
}

export interface PvPPlayerRosterPayload {
  playerId: string;
  username: string;
  ninjaRank: string;
  eloRating: number;
  selectedArenaKey: string;
  figures: PvPRosterFigureItem[];
  plateKeys: string[];
}

export interface PvPMovePayload {
  figureId: string;
  targetNodeId: number;
  path: number[];
  remainingMp: number;
}

export interface PvPCombatPayload {
  attackerId: string;
  defenderId: string;
  deterministicSeed: number;
}

export interface PvPPlateActivationPayload {
  plateId: string;
  targetFigureId?: string;
  targetNodeId?: number;
}

export interface PvPEndTurnPayload {
  completedPlayer: 1 | 2;
  nextPlayer: 1 | 2;
  turnNumber: number;
}

export interface PvPMatchFinishedPayload {
  winnerPlayerNumber: 1 | 2;
  reason: 'GOAL_REACHED' | 'SURRENDER' | 'TIMEOUT' | 'DISCONNECTION';
}

export type PvPBroadcastEvent =
  | { type: 'PLAYER_READY'; payload: { playerNumber: 1 | 2; roster: PvPPlayerRosterPayload } }
  | { type: 'GAME_START'; payload: { initialTurnPlayer: 1; timestamp: number } }
  | { type: 'MOVE'; payload: PvPMovePayload }
  | { type: 'COMBAT_START'; payload: PvPCombatPayload }
  | { type: 'PLATE_ACTIVATE'; payload: PvPPlateActivationPayload }
  | { type: 'END_TURN'; payload: PvPEndTurnPayload }
  | { type: 'SURRENDER'; payload: { surrenderingPlayer: 1 | 2 } }
  | { type: 'MATCH_FINISHED'; payload: PvPMatchFinishedPayload };

export interface PvPRoomSession {
  roomId: string;
  roomCode: string;
  isHost: boolean;
  localPlayerNumber: 1 | 2;
  opponentUsername: string;
  opponentRank: string;
  opponentElo: number;
  selectedArenaKey: string;
}
