import { GameState, GameLogEntry, createInitialGameState } from './gameInitialState';
import { GameAction } from './gameActions';
import {
  ShinobiFigureState,
  WheelSegment,
  getComputedFigureSegments,
} from '../../domain/models/ShinobiFigure';
import { ADJACENCY_LIST } from '../../domain/models/BoardGraph';
import {
  getFigureAtNode,
  getReachableNodes,
  getAdjacentEnemyIds,
} from '../../domain/services/BoardMovementService';
import { evaluateSurroundAndInfirmary, sendUnitToInfirmaryPure } from '../../domain/services/SurroundService';
import { spinFigureChakraWheel, resolveChakraDuelOutcome } from '../../domain/services/CombatResolver';
import { shinobiDbRepository } from '../../infrastructure/repositories/SupabaseShinobiRepository';

function appendLogs(
  stateLogs: GameLogEntry[],
  turn: number,
  newItems: Array<{ text: string; tone?: GameLogEntry['tone'] }>
): GameLogEntry[] {
  const formatted: GameLogEntry[] = newItems.map((item, idx) => ({
    id: `t${turn}_${Date.now()}_${idx}_${Math.random()}`,
    turn,
    text: item.text,
    tone: item.tone || 'normal',
  }));
  return [...formatted, ...stateLogs].slice(0, 60);
}

function evolveFigurePure(unit: ShinobiFigureState, logsList: Array<{ text: string; tone?: GameLogEntry['tone'] }>) {
  if (!unit || unit.evolved) return;
  unit.evolved = true;
  unit.segments = getComputedFigureSegments(unit);
  logsList.push({
    text: `🔥 ¡DESPERTAR! ${unit.name} despierta su verdadero poder (+10 DMG y +1★ en su ruleta).`,
    tone: 'highlight',
  });
}

function advanceTurnPure(state: GameState, extraLogs: Array<{ text: string; tone?: GameLogEntry['tone'] }> = []): GameState {
  const nextFigures = state.figures.map(f => {
    if (f.owner === state.turnPlayer && f.wait > 0) {
      return { ...f, wait: Math.max(0, f.wait - 1) };
    }
    return f;
  });

  const nextTurnPlayer: 1 | 2 = state.turnPlayer === 1 ? 2 : 1;
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
        scrollUsedThisTurn: false,
      },
    },
    currentBattle: null,
    logs: appendLogs(state.logs, state.turnCount, extraLogs),
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'RESET_GAME': {
      return createInitialGameState(
        action.payload?.mode || state.mode,
        action.payload?.selectedTeamKeys || state.selectedTeamKeys,
        action.payload?.selectedPlateIds || state.selectedPlateIds,
        action.payload?.customizations || state.customizations,
        action.payload?.opponentTeamKeys,
        action.payload?.opponentCustomizations,
        action.payload?.opponentPlateIds
      );
    }

    case 'UPDATE_FIGURE_WORKSHOP': {
      const { figKey, level, clv, lvTargetIndex, clvTargetIndex } = action.payload;
      const nextCustomizations = {
        ...state.customizations,
        [figKey]: { level, clv, lvTargetIndex, clvTargetIndex },
      };
      shinobiDbRepository.saveCustomizations(nextCustomizations);
      const nextFigures = state.figures.map(f => {
        if (f.key !== figKey) return f;
        const updated = {
          ...f,
          level,
          clv,
          lvTargetIndex,
          clvTargetIndex,
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
            tone: 'highlight',
          },
        ]),
      };
    }

    case 'RESET_ALL_FIGURE_WORKSHOP': {
      const defaultCustoms = shinobiDbRepository.resetAllCustomizations();
      const nextFigures = state.figures.map(f => {
        const custom = defaultCustoms[f.key] || {
          level: 1,
          clv: 0,
          lvTargetIndex: 0,
          clvTargetIndex: 0,
        };
        const updated = {
          ...f,
          level: custom.level,
          clv: custom.clv,
          lvTargetIndex: custom.lvTargetIndex,
          clvTargetIndex: custom.clvTargetIndex,
        };
        updated.segments = getComputedFigureSegments(updated);
        return updated;
      });
      return {
        ...state,
        customizations: defaultCustoms,
        figures: nextFigures,
        logs: appendLogs(state.logs, state.turnCount, [
          {
            text: '⚒️ Forja Shinobi: Todas las figuras restablecidas a Nivel 1 y ChLv 0.',
            tone: 'highlight',
          },
        ]),
      };
    }

    case 'UPDATE_DECK_LOADOUT': {
      const { selectedTeamKeys, selectedPlateIds } = action.payload;
      const nextTeamKeys = selectedTeamKeys || state.selectedTeamKeys;
      const profile = shinobiDbRepository.getProfile();
      shinobiDbRepository.saveProfile({
        ...profile,
        selectedTeamKeys: nextTeamKeys,
      });
      return createInitialGameState(
        state.mode,
        nextTeamKeys,
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

      // 1. Goal Block Plate
      if (state.phase === 'GOAL_BLOCK_SELECT') {
        if (fig.owner === state.turnPlayer && fig.location === 'board') {
          const ownGoalNodeId = state.turnPlayer === 1 ? 15 : 2;
          const goalOccupant = getFigureAtNode(state.figures, ownGoalNodeId);
          if (goalOccupant) {
            return {
              ...baseState,
              phase: 'SELECT',
              logs: appendLogs(state.logs, state.turnCount, [
                { text: '⚠️ Tu Monumento Hokage ya está ocupado.', tone: 'normal' },
              ]),
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
                tone: 'highlight',
              },
              ...surroundRes.logs,
            ]
          );
        }
        return baseState;
      }

      // 2. Full Heal Plate
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
              { text: `癒 ¡Purificación Médica! ${fig.name} ha sido curado de sus estados alterados.`, tone: 'highlight' },
            ]),
          };
        }
        return baseState;
      }

      // 3. Max Revive Plate
      if (state.phase === 'REVIVE_SELECT') {
        if (fig.owner === state.turnPlayer && fig.location === 'ko') {
          const nextFigures = state.figures.map(f => {
            if (f.id !== fig.id) return f;
            const revived = { ...f, location: 'bench' as const, nodeId: null, wait: 0, status: null };
            revived.segments = getComputedFigureSegments(revived);
            return revived;
          });
          const nextKoQueue = {
            ...state.koQueue,
            [state.turnPlayer]: state.koQueue[state.turnPlayer].filter(id => id !== fig.id),
          };
          return {
            ...baseState,
            figures: nextFigures,
            koQueue: nextKoQueue,
            phase: 'SELECT',
            logs: appendLogs(state.logs, state.turnCount, [
              { text: `蘇 ¡Sello de Resurrección (Max Revive)! ${fig.name} regresa de la Prisión Fuinjutsu al Banquillo sin Espera.`, tone: 'highlight' },
            ]),
          };
        }
        return baseState;
      }

      // 4. Kawarimi Swap Phase
      if (state.phase === 'SWAP_SELECT_1') {
        if (fig.owner === state.turnPlayer && fig.location === 'board') {
          return {
            ...baseState,
            swapCandidateId: fig.id,
            phase: 'SWAP_SELECT_2',
            logs: appendLogs(state.logs, state.turnCount, [
              { text: `替 Selecciona el segundo aliado en el campo para permutar con ${fig.shortName}.`, tone: 'highlight' },
            ]),
          };
        }
        return baseState;
      }

      if (state.phase === 'SWAP_SELECT_2') {
        if (fig.owner === state.turnPlayer && fig.location === 'board' && fig.id !== state.swapCandidateId) {
          const figA = state.figures.find(f => f.id === state.swapCandidateId);
          if (!figA) return baseState;
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
              ...surroundEval.logs,
            ]),
          };
        }
        return baseState;
      }

      // 5. Clicking a valid adjacent enemy target to initiate Chakra Duel
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
            attackerId: attacker.id,
            defenderId: fig.id,
            attacker,
            defender: fig,
            spinAttacker: atkSpin,
            spinDefender: defSpin,
            atkRotations: 360 * 5 + atkSpin.targetDeg,
            defRotations: 360 * 5 + defSpin.targetDeg,
            canRespinAttacker: state.activeBuffs[attacker.owner].doubleChance,
            canRespinDefender: false,
            usedRespin: false,
            outcome,
            revealed: false,
          },
        };
      }

      if (state.phase !== 'SELECT') return baseState;

      // 6. Selecting friendly figure
      if (fig.owner === state.turnPlayer && fig.location !== 'ko') {
        if (fig.status === 'frozen') {
          return {
            ...baseState,
            logs: appendLogs(state.logs, state.turnCount, [
              { text: `砂 ${fig.name} está bajo Sellado de Arena (Congelado). Mueve un aliado adyacente a él para liberarlo.`, tone: 'normal' },
            ]),
          };
        }
        if (fig.wait > 0) {
          return {
            ...baseState,
            logs: appendLogs(state.logs, state.turnCount, [
              { text: `⏳ ${fig.name} tiene sello Fuinjutsu de Espera (${fig.wait}) y no puede actuar.`, tone: 'normal' },
            ]),
          };
        }
        const validMoveNodes = getReachableNodes(fig, state.figures, state.turnCount, state.activeBuffs[state.turnPlayer]);
        const validAttackFigureIds = getAdjacentEnemyIds(fig, state.figures);
        return {
          ...baseState,
          selectedFigureId: fig.id,
          validMoveNodes,
          validAttackFigureIds,
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

      // Unfreeze frozen allies when landing adjacent
      const unfreezeLogs: Array<{ text: string; tone?: GameLogEntry['tone'] }> = [];
      const movedFigures = state.figures.map(f => {
        if (f.id === movingFig.id) {
          return { ...f, location: 'board' as const, nodeId: targetNodeId };
        }
        if (f.owner === movingFig.owner && f.location === 'board' && f.status === 'frozen' && f.nodeId !== null && adjAtDest.includes(f.nodeId)) {
          const unfrozen = { ...f, status: null };
          unfrozen.segments = getComputedFigureSegments(unfrozen);
          unfreezeLogs.push({
            text: `解 ¡Toque de Asistencia! ${movingFig.shortName} rompe el Sellado de Arena de ${f.shortName}.`,
            tone: 'highlight',
          });
          return unfrozen;
        }
        return f;
      });

      const moveLogs: Array<{ text: string; tone?: GameLogEntry['tone'] }> = [
        {
          text: `歩 ${movingFig.name} avanza desde ${originLabel} hasta el nodo #${targetNodeId}.`,
          tone: movingFig.owner === 1 ? 'p1' : 'p2',
        },
        ...unfreezeLogs,
      ];

      // Surround Evaluation
      const surroundResult = evaluateSurroundAndInfirmary(movedFigures, state.koQueue);
      const updatedFigures = surroundResult.figures;
      const updatedKoQueue = surroundResult.koQueue;
      moveLogs.push(...surroundResult.logs);

      // Check Hokage Goal Captures
      const onP2Goal = getFigureAtNode(updatedFigures, 2);
      if (onP2Goal && onP2Goal.owner === 1) {
        return {
          ...state,
          figures: updatedFigures,
          koQueue: updatedKoQueue,
          phase: 'GAMEOVER',
          winner: 1,
          victoryReason: `¡${onP2Goal.name} ha conquistado la Base de Akatsuki (#2)!`,
          logs: appendLogs(state.logs, state.turnCount, moveLogs),
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
          victoryReason: `¡${onP1Goal.name} ha tomado el Monumento Hokage de Konoha (#15)!`,
          logs: appendLogs(state.logs, state.turnCount, moveLogs),
        };
      }

      // Check adjacent enemies for optional attack
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
            logs: appendLogs(state.logs, state.turnCount, moveLogs),
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
        [player]: state.scrolls[player].map(s => (s.slotId === scrollObj.slotId ? { ...s, used: true } : s)),
      });

      if (scrollId === 'goal_block') {
        const ownGoalNodeId = player === 1 ? 15 : 2;
        const alliesOnBoard = state.figures.filter(f => f.owner === player && f.location === 'board' && f.nodeId !== ownGoalNodeId);
        if (alliesOnBoard.length === 0 || getFigureAtNode(state.figures, ownGoalNodeId)) {
          return {
            ...state,
            logs: appendLogs(state.logs, state.turnCount, [
              { text: '⚠️ Necesitas al menos 1 aliado en el campo y tu Base libre para usar Goal Block.', tone: 'normal' },
            ]),
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
            { text: '陣 Goal Block activado: haz clic en cualquier aliado del campo para teletransportarlo a tu Base.', tone: 'highlight' },
          ]),
        };
      }

      if (scrollId === 'max_revive') {
        if (state.koQueue[player].length === 0) {
          return {
            ...state,
            logs: appendLogs(state.logs, state.turnCount, [
              { text: '⚠️ No hay ninjas en la Prisión Fuinjutsu para revivir.', tone: 'normal' },
            ]),
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
            { text: '蘇 Max Revive activado: haz clic en un aliado de tu Prisión Fuinjutsu para devolverlo al Banquillo.', tone: 'highlight' },
          ]),
        };
      }

      const nextPlayerBuffs = { ...pBuffs, scrollUsedThisTurn: true };
      let logMsg = '';
      if (scrollId === 'x_attack') {
        nextPlayerBuffs.powerBonus = 30;
        logMsg = `薬 ¡Píldora de Chakra (+30 DMG) activada para el Jugador ${player}!`;
      } else if (scrollId === 'double_chance') {
        nextPlayerBuffs.doubleChance = true;
        logMsg = `眼 ¡Ojo de la Presciencia (Doble Giro) activado para el Jugador ${player}!`;
      }

      const nextActiveBuffs = { ...state.activeBuffs, [player]: nextPlayerBuffs };
      return {
        ...state,
        activeBuffs: nextActiveBuffs,
        scrolls: markScrollUsed(),
        logs: appendLogs(state.logs, state.turnCount, [{ text: logMsg, tone: 'highlight' }]),
      };
    }

    case 'REVEAL_BATTLE_SPIN': {
      if (!state.currentBattle) return state;
      return {
        ...state,
        currentBattle: { ...state.currentBattle, revealed: true },
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
        b.spinDefender!.segment,
        state.activeBuffs
      );

      return {
        ...state,
        activeBuffs: {
          ...state.activeBuffs,
          [b.attacker.owner]: { ...state.activeBuffs[b.attacker.owner], doubleChance: false },
        },
        currentBattle: {
          ...b,
          spinAttacker: newAtkSpin,
          atkRotations: b.atkRotations + extraRotation,
          outcome: newOutcome,
          revealed: false,
          usedRespin: true,
          canRespinAttacker: false,
        },
        logs: appendLogs(state.logs, state.turnCount, [
          { text: `写輪眼 ¡${b.attacker.shortName} activa su Doble Oportunidad y re-gira el disco de chakra!`, tone: 'highlight' },
        ]),
      };
    }

    case 'RESOLVE_DUEL': {
      if (!state.currentBattle || !state.currentBattle.outcome) return state;
      const { attacker, defender, spinAttacker, spinDefender, outcome } = state.currentBattle;
      const nextFigures = state.figures.map(f => ({ ...f }));
      const nextKoQueue = { 1: [...state.koQueue[1]], 2: [...state.koQueue[2]] };
      const duelLogs: Array<{ text: string; tone?: GameLogEntry['tone'] }> = [];

      const atkRef = nextFigures.find(f => f.id === attacker.id);
      const defRef = nextFigures.find(f => f.id === defender.id);

      const applyPurpleStatus = (winnerUnit: ShinobiFigureState, loserUnit: ShinobiFigureState, purpleSeg: WheelSegment) => {
        if (purpleSeg.effect === 'instant_ko') {
          duelLogs.push({
            text: `封 ¡${purpleSeg.name} (${'★'.repeat(purpleSeg.stars)})! ${loserUnit.name} es sellado en la Prisión Fuinjutsu.`,
            tone: 'ko',
          });
          sendUnitToInfirmaryPure(loserUnit, nextFigures, nextKoQueue, duelLogs);
          evolveFigurePure(winnerUnit, duelLogs);
        } else if (purpleSeg.effect === 'push_wait') {
          const adj = (loserUnit.nodeId !== null ? ADJACENCY_LIST[loserUnit.nodeId] : []) || [];
          const emptyNode = adj.find(nId => !getFigureAtNode(nextFigures, nId));
          if (emptyNode !== undefined) {
            loserUnit.nodeId = emptyNode;
            loserUnit.wait = 2;
            duelLogs.push({
              text: `💨 ¡${purpleSeg.name} (${'★'.repeat(purpleSeg.stars)})! ${loserUnit.name} es repelido al nodo #${emptyNode} con Espera 2.`,
              tone: 'highlight',
            });
          } else {
            loserUnit.wait = 2;
            duelLogs.push({
              text: `⏳ ¡${purpleSeg.name}! ${loserUnit.name} queda inmovilizado con Espera 2.`,
              tone: 'highlight',
            });
          }
          evolveFigurePure(winnerUnit, duelLogs);
        } else if (purpleSeg.effect === 'burn_knockback') {
          loserUnit.wait = 2;
          loserUnit.status = 'burned';
          loserUnit.segments = getComputedFigureSegments(loserUnit);
          duelLogs.push({
            text: `炎 ¡Amaterasu! ${loserUnit.name} sufre Quemadura (-10 DMG y sector menor pasa a Rojo) + Espera 2.`,
            tone: 'ko',
          });
          evolveFigurePure(winnerUnit, duelLogs);
        } else if (purpleSeg.effect === 'confuse_wait') {
          loserUnit.wait = 2;
          loserUnit.status = 'confused';
          loserUnit.segments = getComputedFigureSegments(loserUnit);
          duelLogs.push({
            text: `幻 ¡Genjutsu! ${loserUnit.name} sufre Confusión (+1 sector horario) y Espera 2.`,
            tone: 'highlight',
          });
          evolveFigurePure(winnerUnit, duelLogs);
        } else if (purpleSeg.effect === 'freeze_seal') {
          loserUnit.status = 'frozen';
          loserUnit.wait = 2;
          loserUnit.segments = getComputedFigureSegments(loserUnit);
          duelLogs.push({
            text: `砂 ¡Sellado de Arena! ${loserUnit.name} queda Congelado en Arena (100% Fallo Rojo hasta toque de asistencia aliado).`,
            tone: 'ko',
          });
        }
      };

      if (outcome.winner === 'atk_ko' && defRef && atkRef) {
        duelLogs.push({
          text: `⚔️ ${attacker.name} derrota a ${defender.name} con ${spinAttacker!.segment.name}.`,
          tone: 'p1',
        });
        sendUnitToInfirmaryPure(defRef, nextFigures, nextKoQueue, duelLogs);
        evolveFigurePure(atkRef, duelLogs);
        if (spinAttacker!.segment.effect === 'self_wait_2') {
          atkRef.wait = 2;
          duelLogs.push({
            text: `⚠️ Desgaste de las 8 Puertas: ${atkRef.shortName} recibe Espera 2 tras Ura Renge.`,
            tone: 'normal',
          });
        }
      } else if (outcome.winner === 'def_ko' && atkRef && defRef) {
        duelLogs.push({
          text: `🛡️ ¡Contraataque! ${defender.name} derrota a ${attacker.name} con ${spinDefender!.segment.name}.`,
          tone: 'p2',
        });
        sendUnitToInfirmaryPure(atkRef, nextFigures, nextKoQueue, duelLogs);
        evolveFigurePure(defRef, duelLogs);
        if (spinDefender!.segment.effect === 'self_wait_2') {
          defRef.wait = 2;
          duelLogs.push({
            text: `⚠️ Desgaste de las 8 Puertas: ${defRef.shortName} recibe Espera 2 tras Ura Renge.`,
            tone: 'normal',
          });
        }
      } else if (outcome.winner === 'atk_purple' && atkRef && defRef) {
        applyPurpleStatus(atkRef, defRef, spinAttacker!.segment);
      } else if (outcome.winner === 'def_purple' && defRef && atkRef) {
        applyPurpleStatus(defRef, atkRef, spinDefender!.segment);
      } else {
        // Non-KO secondary effects
        if (spinAttacker!.segment.effect === 'paralyze_enemy' && defRef && defRef.location === 'board') {
          defRef.status = 'paralyzed';
          defRef.segments = getComputedFigureSegments(defRef);
          duelLogs.push({
            text: `痺 ¡Chidori Nagashi! ${defRef.shortName} queda Paralizado.`,
            tone: 'highlight',
          });
        }
        if (spinDefender!.segment.effect === 'paralyze_enemy' && atkRef && atkRef.location === 'board') {
          atkRef.status = 'paralyzed';
          atkRef.segments = getComputedFigureSegments(atkRef);
          duelLogs.push({
            text: `痺 ¡Onda Raiton! ${atkRef.shortName} queda Paralizado.`,
            tone: 'highlight',
          });
        }
        duelLogs.push({ text: `⚡ ${outcome.reason}`, tone: 'normal' });
      }

      const surroundCheck = evaluateSurroundAndInfirmary(nextFigures, nextKoQueue);
      duelLogs.push(...surroundCheck.logs);

      // Check Hokage Goal Captures
      const onP2Goal = getFigureAtNode(surroundCheck.figures, 2);
      if (onP2Goal && onP2Goal.owner === 1) {
        return {
          ...state,
          figures: surroundCheck.figures,
          koQueue: surroundCheck.koQueue,
          currentBattle: null,
          phase: 'GAMEOVER',
          winner: 1,
          victoryReason: `¡${onP2Goal.name} ha tomado la Base de Akatsuki (#2) tras el combate!`,
          logs: appendLogs(state.logs, state.turnCount, duelLogs),
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
          victoryReason: `¡${onP1Goal.name} ha tomado el Monumento Hokage (#15) tras el combate!`,
          logs: appendLogs(state.logs, state.turnCount, duelLogs),
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
        { text: `⏭️ Jugador ${state.turnPlayer} finaliza su turno.`, tone: 'normal' },
      ]);
    }

    default:
      return state;
  }
}
