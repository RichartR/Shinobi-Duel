import React, { useMemo } from 'react';
import { GameState } from '../../../application/state/gameInitialState';
import { BOARD_NODES, BOARD_EDGES } from '../../../domain/models/BoardGraph';
import { calculateEffectiveMp } from '../../../domain/services/BoardMovementService';
import { CHAR_SVG_FALLBACKS } from '../../../infrastructure/assets/animeAssets';
import { FigureStatus } from '../../../domain/models/ShinobiFigure';

interface ChuninArenaSVGProps {
  state: GameState;
  onSelectUnit: (figureId: string) => void;
  onSelectNode: (nodeId: number) => void;
  onEndPostMove: () => void;
}

const STATUS_ICONS: Record<NonNullable<FigureStatus>, { kanji: string; color: string }> = {
  burned: { kanji: '炎', color: '#f97316' },
  paralyzed: { kanji: '痺', color: '#facc15' },
  confused: { kanji: '幻', color: '#c084fc' },
  frozen: { kanji: '砂', color: '#38bdf8' },
};

export const ChuninArenaSVG: React.FC<ChuninArenaSVGProps> = ({
  state,
  onSelectUnit,
  onSelectNode,
  onEndPostMove,
}) => {
  const onBoardFigures = useMemo(
    () => state.figures.filter(f => f.location === 'board' && f.nodeId !== null),
    [state.figures]
  );

  return (
    <div className="relative rounded-xl p-2 md:p-3 border-4 border-[#57412d] bg-gradient-to-b from-[#261911] to-[#140d08] shadow-2xl flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 680 550" className="w-full h-auto max-h-[560px] select-none" role="img" aria-label="Tablero táctico de la Arena Chunin con 28 nodos">
        <defs>
          <radialGradient id="stoneArenaGrad" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#363932" />
            <stop offset="65%" stopColor="#252722" />
            <stop offset="100%" stopColor="#171815" />
          </radialGradient>
          <linearGradient id="innerSanctuaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2d261e" />
            <stop offset="100%" stopColor="#1f1a14" />
          </linearGradient>
          <linearGradient id="pedestalGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="pedestalCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#fecaca" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <filter id="tokenDropShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <clipPath id="tokenPortraitClip">
            <circle cx="0" cy="0" r="20" />
          </clipPath>
        </defs>

        {/* Stone Arena Base */}
        <rect x="8" y="8" width="664" height="534" rx="12" fill="url(#stoneArenaGrad)" stroke="#57412d" strokeWidth="5" />
        <rect x="18" y="18" width="644" height="514" rx="8" fill="none" stroke="#856548" strokeWidth="1" strokeDasharray="12 6" opacity="0.4" />
        <path d="M 35 120 L 75 135 L 95 125 M 640 410 L 600 395 L 580 415 M 310 20 L 320 45" stroke="#141612" strokeWidth="2" fill="none" opacity="0.6" />
        <circle cx="55" cy="275" r="28" fill="#2d4028" opacity="0.18" />
        <circle cx="625" cy="220" r="35" fill="#2d4028" opacity="0.16" />

        {/* Inner Tactical Courtyard */}
        <rect x="175" y="140" width="330" height="270" rx="6" fill="url(#innerSanctuaryGrad)" stroke="#5c4734" strokeWidth="2.5" />

        {/* Central Seal Crest */}
        <g transform="translate(340, 275)" opacity="0.22">
          <circle r="76" fill="none" stroke="#d97706" strokeWidth="2.5" />
          <circle r="68" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="10 5" />
          <text x="0" y="-52" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="900">封 • 陣 • 忍 • 闘</text>
          <text x="0" y="60" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="900">火 • 影 • 暁 • 魂</text>
          <text x="0" y="14" textAnchor="middle" fill="#e7d8c1" fontSize="42" fontWeight="900">忍</text>
        </g>

        {/* Layer 1: Edges */}
        <g>
          {BOARD_EDGES.map(([aId, bId], idx) => {
            const nA = BOARD_NODES[aId];
            const nB = BOARD_NODES[bId];
            const isInner = nA.type === 'inner' && nB.type === 'inner';
            return (
              <g key={`edge_${idx}`}>
                <line x1={nA.x} y1={nA.y} x2={nB.x} y2={nB.y} stroke="#14110e" strokeWidth="7" strokeLinecap="round" />
                <line
                  x1={nA.x}
                  y1={nA.y}
                  x2={nB.x}
                  y2={nB.y}
                  stroke={isInner ? '#b45309' : '#78624c'}
                  strokeWidth="3"
                  strokeDasharray={isInner ? 'none' : '8 4'}
                />
              </g>
            );
          })}
        </g>

        {/* Layer 2: 28 Tactical Nodes */}
        <g>
          {BOARD_NODES.map(node => {
            if (node.type === 'goal_p1' || node.type === 'goal_p2') {
              const isP1 = node.type === 'goal_p1';
              const mainCol = isP1 ? '#ea580c' : '#dc2626';
              const kanji = isP1 ? '火' : '暁';
              const labelY = isP1 ? node.y + 38 : node.y - 33;
              return (
                <g key={`node_${node.id}`}>
                  <polygon
                    points={`${node.x},${node.y - 28} ${node.x + 26},${node.y - 8} ${node.x + 17},${node.y + 23} ${node.x - 17},${node.y + 23} ${node.x - 26},${node.y - 8}`}
                    fill="#1c120c"
                    stroke={mainCol}
                    strokeWidth="3"
                  />
                  <circle cx={node.x} cy={node.y} r="15" fill={mainCol} opacity="0.25" />
                  <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="central" fill="#fde68a" fontSize="16" fontWeight="900">
                    {kanji}
                  </text>
                  <text x={node.x} y={labelY} textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="900">
                    {node.label}
                  </text>
                </g>
              );
            }
            if (node.type === 'entry_p1' || node.type === 'entry_p2') {
              const isP1 = node.type === 'entry_p1';
              const strokeCol = isP1 ? '#f59e0b' : '#ef4444';
              const labelY = isP1 ? node.y + 33 : node.y - 26;
              return (
                <g key={`node_${node.id}`}>
                  <circle cx={node.x} cy={node.y} r="20" fill="#1c140d" stroke={strokeCol} strokeWidth="2.5" strokeDasharray="5 3" />
                  <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="central" fill={strokeCol} fontSize="12" fontWeight="900">
                    陣
                  </text>
                  <text x={node.x} y={labelY} textAnchor="middle" fill="#d6c7b2" fontSize="8" fontWeight="800">
                    {node.label}
                  </text>
                </g>
              );
            }
            const isInner = node.type === 'inner';
            return (
              <g key={`node_${node.id}`}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="13.5"
                  fill={isInner ? '#261c14' : '#2b2d27'}
                  stroke={isInner ? '#92400e' : '#57534e'}
                  strokeWidth="2.5"
                />
                <circle cx={node.x} cy={node.y} r="4" fill={isInner ? '#d97706' : '#78716c'} opacity="0.7" />
              </g>
            );
          })}
        </g>

        {/* Layer 3: Reachable Nodes Highlights */}
        <g>
          {Object.keys(state.validMoveNodes).map(nIdStr => {
            const nId = parseInt(nIdStr, 10);
            const node = BOARD_NODES[nId];
            return (
              <g
                key={`valid_${nId}`}
                className="cursor-pointer"
                onClick={() => onSelectNode(nId)}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="23"
                  fill="rgba(245, 158, 11, 0.28)"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeDasharray="6 3"
                />
                <circle cx={node.x} cy={node.y} r="8" fill="#fbbf24" />
              </g>
            );
          })}
        </g>

        {/* Layer 4: Sculpted Figure Tokens */}
        <g>
          {onBoardFigures.map(fig => {
            const node = BOARD_NODES[fig.nodeId!];
            const isSelected = state.selectedFigureId === fig.id || state.swapCandidateId === fig.id;
            const isAttackTarget = state.validAttackFigureIds.includes(fig.id);
            const isP1 = fig.owner === 1;
            const pedestalFill = isP1 ? 'url(#pedestalGold)' : 'url(#pedestalCrimson)';
            const effMp = calculateEffectiveMp(fig, state.turnCount, state.activeBuffs[fig.owner]);
            const fallbackUri = CHAR_SVG_FALLBACKS[fig.key];

            return (
              <g
                key={fig.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onClick={() => onSelectUnit(fig.id)}
              >
                {isSelected && (
                  <circle r="32" fill="none" stroke="#fde047" strokeWidth="3.5" strokeDasharray="7 3" />
                )}
                {isAttackTarget && (
                  <g>
                    <circle r="33" fill="rgba(220, 38, 38, 0.35)" stroke="#ef4444" strokeWidth="3" />
                    <rect x="-28" y="-42" width="56" height="14" rx="3" fill="#991b1b" stroke="#fde047" strokeWidth="1" />
                    <text x="0" y="-34" textAnchor="middle" dominantBaseline="central" fill="#fef3c7" fontSize="8.5" fontWeight="900">
                      ⚔️ DUELO
                    </text>
                  </g>
                )}

                <circle r="25" fill={pedestalFill} stroke="#140d08" strokeWidth="2.5" filter="url(#tokenDropShadow)" />
                <circle r="20.5" fill="#1c1917" stroke="#292524" strokeWidth="1.5" />

                {/* Deterministic SVG Fallback + Anime Portrait */}
                <image href={fallbackUri} x="-20" y="-20" width="40" height="40" clipPath="url(#tokenPortraitClip)" preserveAspectRatio="xMidYMin slice" />
                <image href={fig.portraitUrl} x="-20" y="-20" width="40" height="40" clipPath="url(#tokenPortraitClip)" preserveAspectRatio="xMidYMin slice" />

                {/* Nameplate */}
                <rect x="-24" y="13" width="48" height="12" rx="2" fill={isP1 ? '#9a3412' : '#7f1d1d'} stroke="#fde68a" strokeWidth="1" />
                <text x="0" y="19.5" textAnchor="middle" dominantBaseline="central" fill="#fffbeb" fontSize="8" fontWeight="900">
                  {fig.shortName}
                </text>

                {/* MP Badge */}
                <g transform="translate(19, -19)">
                  <polygon points="0,-11 4,-4 11,0 4,4 0,11 -4,4 -11,0 -4,-4" fill="#1c1917" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="0" y="0.5" textAnchor="middle" dominantBaseline="central" fill="#fde047" fontSize="9" fontWeight="900">
                    {effMp}
                  </text>
                </g>

                {/* Fuinjutsu Wait Seal */}
                {fig.wait > 0 && (
                  <g transform="translate(-19, -19)">
                    <rect x="-9" y="-9" width="18" height="18" rx="2" fill="#991b1b" stroke="#fde047" strokeWidth="1.5" />
                    <text x="0" y="1" textAnchor="middle" dominantBaseline="central" fill="#fef08a" fontSize="9" fontWeight="900">
                      封{fig.wait}
                    </text>
                  </g>
                )}

                {/* Status Badge */}
                {fig.status && STATUS_ICONS[fig.status] && (
                  <g transform="translate(-20, 18)">
                    <circle r="10" fill="#09090b" stroke={STATUS_ICONS[fig.status].color} strokeWidth="2" />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={STATUS_ICONS[fig.status].color}
                      fontSize="10"
                      fontWeight="900"
                    >
                      {STATUS_ICONS[fig.status].kanji}
                    </text>
                  </g>
                )}

                {/* Level / Evolution Badge */}
                {(fig.evolved || fig.clv > 0) && (
                  <g transform="translate(20, 18)">
                    <rect x="-11" y="-8" width="22" height="14" rx="3" fill={fig.evolved ? '#7e22ce' : '#0f172a'} stroke="#fde047" strokeWidth="1.2" />
                    <text x="0" y="-0.5" textAnchor="middle" dominantBaseline="central" fill="#fde047" fontSize="7.5" fontWeight="900">
                      {fig.evolved ? 'UX★' : `C+${fig.clv}`}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Special Targeting Banner */}
      {['GOAL_BLOCK_SELECT', 'HEAL_SELECT', 'REVIVE_SELECT', 'SWAP_SELECT_1', 'SWAP_SELECT_2'].includes(state.phase) && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-amber-950/95 text-amber-100 px-4 py-2 rounded border-2 border-amber-400 shadow-2xl flex items-center gap-3 z-20">
          <span className="px-1.5 py-0.5 text-xs font-black bg-amber-500 text-stone-950 rounded-sm">巻物</span>
          <span className="text-xs font-bold">
            {state.phase === 'GOAL_BLOCK_SELECT' && 'Selecciona un aliado para teletransportarlo a tu Base.'}
            {state.phase === 'HEAL_SELECT' && 'Selecciona un aliado para curar sus estados alterados.'}
            {state.phase === 'REVIVE_SELECT' && 'Selecciona un aliado en tu Prisión Fuinjutsu para revivirlo.'}
            {state.phase === 'SWAP_SELECT_1' && 'Selecciona el primer aliado para permutar.'}
            {state.phase === 'SWAP_SELECT_2' && 'Selecciona el segundo aliado para completar Kawarimi.'}
          </span>
        </div>
      )}

      {/* Post-Move Combat Prompt */}
      {state.phase === 'POST_MOVE' && !(state.mode === 'ai' && state.turnPlayer === 2) && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#f4ebd9] text-stone-900 px-4 py-2 rounded border-2 border-red-800 shadow-2xl flex items-center gap-3 z-20">
          <span className="px-1.5 py-0.5 text-xs font-black border-2 border-red-700 text-red-700 bg-red-100">
            戦
          </span>
          <span className="text-xs font-extrabold">
            ¡Enemigo adyacente! Pulsa sobre el rival con ⚔️ DUELO o:
          </span>
          <button
            onClick={onEndPostMove}
            className="px-3 py-1.5 rounded bg-red-800 hover:bg-red-700 text-amber-100 text-xs font-bold shadow transition"
          >
            Terminar Turno
          </button>
        </div>
      )}
    </div>
  );
};
