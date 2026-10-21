import { ShinobiFigureState } from '../models/ShinobiFigure';
import { ADJACENCY_LIST } from '../models/BoardGraph';

export type LogTone = 'normal' | 'highlight' | 'ko' | 'info' | 'p1' | 'p2';

export interface SurroundEvaluationResult {
  figures: ShinobiFigureState[];
  koQueue: { 1: string[]; 2: string[] };
  logs: Array<{ text: string; tone?: LogTone }>;
  hadSurround: boolean;
}

export function evaluateSurroundAndInfirmary(
  figures: ShinobiFigureState[],
  koQueue: { 1: string[]; 2: string[] }
): SurroundEvaluationResult {
  const nextFigures = figures.map(f => ({ ...f }));
  const nextKoQueue = { 1: [...koQueue[1]], 2: [...koQueue[2]] };
  const logs: Array<{ text: string; tone?: LogTone }> = [];

  const onBoard = nextFigures.filter(f => f.location === 'board');
  const surroundedIds: string[] = [];

  onBoard.forEach(fig => {
    if (fig.immuneToSurround || fig.nodeId === null) return;
    const neighbors = ADJACENCY_LIST[fig.nodeId] || [];
    if (neighbors.length === 0) return;

    const allEnemyOccupied = neighbors.every(nId => {
      const occ = nextFigures.find(o => o.location === 'board' && o.nodeId === nId);
      return occ && occ.owner !== fig.owner;
    });

    if (allEnemyOccupied) {
      surroundedIds.push(fig.id);
    }
  });

  surroundedIds.forEach(id => {
    const target = nextFigures.find(f => f.id === id);
    if (target) {
      logs.push({
        text: `封 ¡RODEO FUINJUTSU! ${target.name} fue rodeado y sellado automáticamente.`,
        tone: 'ko',
      });
      sendUnitToInfirmaryPure(target, nextFigures, nextKoQueue, logs);
    }
  });

  return {
    figures: nextFigures,
    koQueue: nextKoQueue,
    logs,
    hadSurround: surroundedIds.length > 0,
  };
}

export function sendUnitToInfirmaryPure(
  targetFig: ShinobiFigureState,
  figuresList: ShinobiFigureState[],
  koQueueMap: { 1: string[]; 2: string[] },
  logsList: Array<{ text: string; tone?: LogTone }>
): void {
  targetFig.location = 'ko';
  targetFig.nodeId = null;
  targetFig.wait = 0;

  const ownerQueue = koQueueMap[targetFig.owner];
  ownerQueue.push(targetFig.id);

  // FIFO Buffer: max capacity 2. If a 3rd figure is sent, oldest is released to bench with Wait 2
  if (ownerQueue.length > 2) {
    const releasedId = ownerQueue.shift();
    const releasedFig = figuresList.find(f => f.id === releasedId);
    if (releasedFig) {
      releasedFig.location = 'bench';
      releasedFig.nodeId = null;
      releasedFig.wait = 2;
      logsList.push({
        text: `解 ${releasedFig.name} sale de la Prisión Fuinjutsu al banquillo con Espera 2.`,
        tone: 'info',
      });
    }
  }
}
