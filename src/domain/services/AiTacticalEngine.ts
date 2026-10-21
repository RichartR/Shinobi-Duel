import { ShinobiFigureState } from '../models/ShinobiFigure';
import { ADJACENCY_LIST } from '../models/BoardGraph';
import {
  getReachableNodes,
  getFigureAtNode,
  bfsShortestDistance,
} from './BoardMovementService';

export interface AiDecision {
  figureId: string;
  targetNode: number;
}

export function computeBestAkatsukiMove(state: {
  figures: ShinobiFigureState[];
  turnCount: number;
  activeBuffs: Record<number, { mpBonus?: number }>;
}): AiDecision | null {
  const aiFigures = state.figures.filter(
    f => f.owner === 2 && f.location !== 'ko' && f.wait === 0
  );
  if (aiFigures.length === 0) return null;

  let bestDecision: AiDecision | null = null;
  let bestScore = -99999;

  aiFigures.forEach(fig => {
    const validNodes = getReachableNodes(
      fig,
      state.figures,
      state.turnCount,
      state.activeBuffs[2]
    );

    Object.keys(validNodes).forEach(nodeIdStr => {
      const targetNode = parseInt(nodeIdStr, 10);
      let score = 0;

      // 1. Instant Victory on Konoha Goal (Node 15)
      if (targetNode === 15) score += 10000;

      // 2. Defend Akatsuki Goal (Node 2) if threatened by P1
      const p1ThreateningGoal = state.figures.some(
        f =>
          f.owner === 1 &&
          f.location === 'board' &&
          f.nodeId !== null &&
          bfsShortestDistance(f.nodeId, 2) <= 2
      );
      if (p1ThreateningGoal && targetNode === 2) score += 720;
      if (p1ThreateningGoal && bfsShortestDistance(targetNode, 2) === 1) score += 280;

      // 3. Simulate Surround KOs
      const simulatedFigures = state.figures.map(f =>
        f.id === fig.id ? { ...f, location: 'board' as const, nodeId: targetNode } : f
      );

      simulatedFigures
        .filter(f => f.owner === 1 && f.location === 'board' && !f.immuneToSurround && f.nodeId !== null)
        .forEach(enemy => {
          const adj = ADJACENCY_LIST[enemy.nodeId!] || [];
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
      const deployedCount = state.figures.filter(
        f => f.owner === 2 && f.location === 'board'
      ).length;
      if (fig.location === 'bench' && deployedCount < 4) score += 80;

      // Stochastic factor to break evaluation ties
      score += Math.random() * 10;

      if (score > bestScore) {
        bestScore = score;
        bestDecision = { figureId: fig.id, targetNode };
      }
    });
  });

  return bestDecision;
}
