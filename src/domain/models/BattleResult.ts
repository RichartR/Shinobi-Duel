import { ShinobiFigureState, WheelSegment } from './ShinobiFigure';

export type DuelWinner = 'none' | 'atk_ko' | 'def_ko' | 'atk_purple' | 'def_purple';

export interface DuelOutcome {
  winner: DuelWinner;
  hero: ShinobiFigureState;
  seg: WheelSegment;
  powA: number;
  powD: number;
  reason: string;
}

export interface BattleSpinResult {
  segment: WheelSegment;
  index: number;
  targetDeg: number;
}

export interface ActiveBattleState {
  attackerId: string;
  defenderId: string;
  spinAttacker: BattleSpinResult | null;
  spinDefender: BattleSpinResult | null;
  canRespinAttacker: boolean;
  canRespinDefender: boolean;
  usedRespin: boolean;
  outcome: DuelOutcome | null;
}
