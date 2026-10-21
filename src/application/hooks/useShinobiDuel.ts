import { useReducer, useState, useCallback, useEffect } from 'react';
import { gameReducer } from '../state/gameReducer';
import { createInitialGameState } from '../state/gameInitialState';
import { soundEngine } from '../../infrastructure/audio/ShinobiAudioEngine';
import { computeBestAkatsukiMove } from '../../domain/services/AiTacticalEngine';
import { ADJACENCY_LIST } from '../../domain/models/BoardGraph';
import { getFigureAtNode } from '../../domain/services/BoardMovementService';

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
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [state.phase, state.currentBattle?.revealed, state.currentBattle?.atkRotations]);

  // AI Akatsuki bot orchestration
  useEffect(() => {
    if (state.mode !== 'ai' || state.turnPlayer !== 2 || state.phase === 'GAMEOVER') return;

    if (state.phase === 'SELECT') {
      const aiTimer = setTimeout(() => {
        const decision = computeBestAkatsukiMove(state);
        if (!decision) {
          dispatch({ type: 'END_TURN' });
          return;
        }

        const powerScroll = state.scrolls[2].find(s => s.id === 'x_attack' && !s.used);
        const hasAdjacentEnemyAtDest = (ADJACENCY_LIST[decision.targetNode] || []).some(nId => {
          const occ = getFigureAtNode(state.figures, nId);
          return occ && occ.owner === 1;
        });

        if (powerScroll && hasAdjacentEnemyAtDest && !state.activeBuffs[2].scrollUsedThisTurn && Math.random() < 0.6) {
          soundEngine.play('scroll');
          dispatch({ type: 'ACTIVATE_SCROLL', payload: { player: 2, scrollSlotId: powerScroll.slotId } });
        }

        soundEngine.play('move');
        dispatch({
          type: 'MOVE_UNIT',
          payload: { figureId: decision.figureId, targetNodeId: decision.targetNode },
        });
      }, 700);
      return () => clearTimeout(aiTimer);
    }

    if (state.phase === 'POST_MOVE') {
      const atkTimer = setTimeout(() => {
        if (state.validAttackFigureIds.length > 0) {
          dispatch({ type: 'SELECT_UNIT', payload: { figureId: state.validAttackFigureIds[0] } });
        } else {
          dispatch({ type: 'END_TURN' });
        }
      }, 600);
      return () => clearTimeout(atkTimer);
    }

    if (state.phase === 'BATTLE' && state.currentBattle?.revealed) {
      const resolveTimer = setTimeout(() => {
        soundEngine.play('ko');
        dispatch({ type: 'RESOLVE_DUEL' });
      }, 1600);
      return () => clearTimeout(resolveTimer);
    }
  }, [state]);

  return {
    state,
    dispatch,
    isMuted,
    toggleMute,
  };
}
