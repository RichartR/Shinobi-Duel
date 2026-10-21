import { ShinobiFigureState } from '../models/ShinobiFigure';
import { BOARD_NODES, ADJACENCY_LIST } from '../models/BoardGraph';

export function getFigureAtNode(figures: ShinobiFigureState[], nodeId: number): ShinobiFigureState | null {
  return figures.find(f => f.location === 'board' && f.nodeId === nodeId) || null;
}

export function calculateEffectiveMp(
  figure: ShinobiFigureState,
  turnCount: number,
  playerBuffs?: { mpBonus?: number }
): number {
  let mp = figure.baseMp;
  // First turn handicap: player 1 on turn 1 has -1 MP
  if (turnCount === 1) {
    mp = Math.max(1, mp - 1);
  }
  if (playerBuffs?.mpBonus && figure.baseMp <= 2) {
    mp += playerBuffs.mpBonus;
  }
  return mp;
}

export function getReachableNodes(
  figure: ShinobiFigureState,
  figures: ShinobiFigureState[],
  turnCount: number,
  playerBuffs?: { mpBonus?: number }
): Record<number, number[]> {
  if (!figure || figure.wait > 0 || figure.location === 'ko') return {};
  const mp = calculateEffectiveMp(figure, turnCount, playerBuffs);
  if (mp <= 0) return {};

  const reachable: Record<number, number[]> = {};

  const bfsExplore = (startNodeId: number, maxSteps: number, initialPath: number[]) => {
    if (maxSteps <= 0) return;
    const queue: Array<{ nodeId: number; stepsLeft: number; path: number[] }> = [
      { nodeId: startNodeId, stepsLeft: maxSteps, path: initialPath },
    ];
    const visitedBest: Record<number, number> = { [startNodeId]: maxSteps };

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current.stepsLeft <= 0) continue;

      const neighbors = ADJACENCY_LIST[current.nodeId] || [];
      for (const nextId of neighbors) {
        const occupant = getFigureAtNode(figures, nextId);
        if (occupant) {
          if (!figure.canPassThrough || occupant.blocksPassThrough) continue;
        }
        const rem = current.stepsLeft - 1;
        if (visitedBest[nextId] !== undefined && visitedBest[nextId] >= rem) continue;
        visitedBest[nextId] = rem;

        const nextPath = [...current.path, nextId];
        if (!occupant) {
          reachable[nextId] = nextPath;
        }
        if (rem > 0) {
          queue.push({ nodeId: nextId, stepsLeft: rem, path: nextPath });
        }
      }
    }
  };

  if (figure.location === 'bench') {
    const entryType = figure.owner === 1 ? 'entry_p1' : 'entry_p2';
    BOARD_NODES.filter(n => n.type === entryType).forEach(entry => {
      if (!getFigureAtNode(figures, entry.id)) {
        reachable[entry.id] = [entry.id];
        bfsExplore(entry.id, mp - 1, [entry.id]);
      }
    });
  } else if (figure.location === 'board' && figure.nodeId !== null) {
    bfsExplore(figure.nodeId, mp, [figure.nodeId]);
  }

  return reachable;
}

export function getAdjacentEnemyIds(figure: ShinobiFigureState, figures: ShinobiFigureState[]): string[] {
  if (!figure || figure.location !== 'board' || figure.nodeId === null || figure.wait > 0) return [];
  const neighbors = ADJACENCY_LIST[figure.nodeId] || [];
  const enemyIds: string[] = [];
  neighbors.forEach(nId => {
    const occ = getFigureAtNode(figures, nId);
    if (occ && occ.owner !== figure.owner) {
      enemyIds.push(occ.id);
    }
  });
  return enemyIds;
}

export function bfsShortestDistance(startNode: number, targetNode: number): number {
  if (startNode === targetNode) return 0;
  const visited = new Set<number>([startNode]);
  const queue = [{ node: startNode, dist: 0 }];
  while (queue.length > 0) {
    const { node, dist } = queue.shift()!;
    for (const next of (ADJACENCY_LIST[node] || [])) {
      if (next === targetNode) return dist + 1;
      if (!visited.has(next)) {
        visited.add(next);
        queue.push({ node: next, dist: dist + 1 });
      }
    }
  }
  return 99;
}
