import React, { useMemo } from 'react';
import { GameState } from '../../../application/state/gameInitialState';
import { BOARD_NODES, BOARD_EDGES } from '../../../domain/models/BoardGraph';
import { calculateEffectiveMp } from '../../../domain/services/BoardMovementService';
import { CHAR_SVG_FALLBACKS } from '../../../infrastructure/assets/animeAssets';
import { FigureStatus } from '../../../domain/models/ShinobiFigure';
import { useTranslation } from '../../context/I18nContext';
import { getLocalizedFigure } from '../../../infrastructure/i18n/locales/figureI18n';

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
  const { t, language } = useTranslation();
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
          <linearGradient id="pedestalP1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#075985" />
          </linearGradient>
          <linearGradient id="pedestalP2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="45%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <filter id="p1AuraFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0284c7" floodOpacity="0.85" />
          </filter>
          <filter id="p2AuraFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#dc2626" floodOpacity="0.85" />
          </filter>
          <filter id="tokenDropShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.85" />
          </filter>
          <clipPath id="tokenPortraitClip">
            <circle cx="0" cy="0" r="19" />
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
              const mainCol = isP1 ? '#0284c7' : '#dc2626';
              const strokeCol = isP1 ? '#38bdf8' : '#f87171';
              const kanji = isP1 ? '火' : '暁';
              const labelText = isP1 ? `🛡️ ${t('board.baseKonoha')}` : `🎯 ${t('board.baseAkatsuki')}`;
              const labelY = isP1 ? node.y + 38 : node.y - 33;
              return (
                <g key={`node_${node.id}`}>
                  <polygon
                    points={`${node.x},${node.y - 28} ${node.x + 26},${node.y - 8} ${node.x + 17},${node.y + 23} ${node.x - 17},${node.y + 23} ${node.x - 26},${node.y - 8}`}
                    fill="#15100c"
                    stroke={strokeCol}
                    strokeWidth="3.5"
                    filter={isP1 ? 'url(#p1AuraFilter)' : 'url(#p2AuraFilter)'}
                  />
                  <circle cx={node.x} cy={node.y} r="15" fill={mainCol} opacity="0.35" />
                  <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="central" fill={isP1 ? '#e0f2fe' : '#fee2e2'} fontSize="16" fontWeight="900">
                    {kanji}
                  </text>
                  <text x={node.x} y={labelY} textAnchor="middle" fill={isP1 ? '#7dd3fc' : '#fca5a5'} fontSize="9.5" fontWeight="900">
                    {labelText}
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
                    {isP1 ? t('board.entryP1') : t('board.entryP2')}
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
          {onBoardFigures.map(rawFig => {
            const fig = getLocalizedFigure(rawFig, language);
            const node = BOARD_NODES[fig.nodeId!];
            const isSelected = state.selectedFigureId === fig.id || state.swapCandidateId === fig.id;
            const isAttackTarget = state.validAttackFigureIds.includes(fig.id);
            const isP1 = fig.owner === 1;
            const effMp = calculateEffectiveMp(fig, state.turnCount, state.activeBuffs[fig.owner]);
            const fallbackUri = CHAR_SVG_FALLBACKS[fig.key];
            const ownerBadgeText = isP1 ? 'P1' : state.mode === 'ai' ? 'AI' : 'P2';

            return (
              <g
                key={fig.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onClick={() => onSelectUnit(fig.id)}
              >
                {/* Selection ring */}
                {isSelected && (
                  <circle r="35" fill="none" stroke="#fde047" strokeWidth="4" strokeDasharray="8 4" />
                )}

                {/* Attack target highlight */}
                {isAttackTarget && (
                  <g>
                    <circle r="35" fill="rgba(220, 38, 38, 0.4)" stroke="#ef4444" strokeWidth="3.5" />
                    <rect x="-28" y="-45" width="56" height="15" rx="3" fill="#991b1b" stroke="#fde047" strokeWidth="1.2" />
                    <text x="0" y="-37" textAnchor="middle" dominantBaseline="central" fill="#fef3c7" fontSize="8.5" fontWeight="900">
                      ⚔️ {t('board.duelAction')}
                    </text>
                  </g>
                )}

                {/* Directional Marching Pointer Arrow */}
                {isP1 ? (
                  // P1 marches UPWARD towards node 2 (top enemy base)
                  <g transform="translate(0, -29)">
                    <polygon points="0,-7 -6,1 6,1" fill="#38bdf8" stroke="#0369a1" strokeWidth="1" filter="url(#p1AuraFilter)" />
                  </g>
                ) : (
                  // P2 marches DOWNWARD towards node 15 (bottom Konoha base)
                  <g transform="translate(0, 29)">
                    <polygon points="0,7 -6,-1 6,-1" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" filter="url(#p2AuraFilter)" />
                  </g>
                )}

                {/* Outer Pedestal Ring with Team Colors & Aura */}
                <circle
                  r="26.5"
                  fill={isP1 ? 'url(#pedestalP1)' : 'url(#pedestalP2)'}
                  stroke={isP1 ? '#38bdf8' : '#ef4444'}
                  strokeWidth="3.2"
                  filter={isP1 ? 'url(#p1AuraFilter)' : 'url(#p2AuraFilter)'}
                />

                {/* Inner Dark Frame */}
                <circle r="20" fill="#140f0c" stroke={isP1 ? '#0c4a6e' : '#450a0a'} strokeWidth="1.5" />

                {/* Deterministic SVG Fallback + Anime Portrait */}
                <image href={fallbackUri} x="-19" y="-19" width="38" height="38" clipPath="url(#tokenPortraitClip)" preserveAspectRatio="xMidYMin slice" />
                <image href={fig.portraitUrl} x="-19" y="-19" width="38" height="38" clipPath="url(#tokenPortraitClip)" preserveAspectRatio="xMidYMin slice" />

                {/* Owner Faction Badge (Top-Left) */}
                <g transform="translate(-18, -18)">
                  <circle
                    r="8.5"
                    fill={isP1 ? '#0284c7' : '#b91c1c'}
                    stroke={isP1 ? '#e0f2fe' : '#fee2e2'}
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="0.5"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#ffffff"
                    fontSize="7.5"
                    fontWeight="900"
                  >
                    {ownerBadgeText}
                  </text>
                </g>

                {/* MP Diamond Badge (Top-Right) */}
                <g transform="translate(18, -18)">
                  <polygon
                    points="0,-9.5 3.5,-3.5 9.5,0 3.5,3.5 0,9.5 -3.5,3.5 -9.5,0 -3.5,-3.5"
                    fill={isP1 ? '#0c4a6e' : '#450a0a'}
                    stroke={isP1 ? '#38bdf8' : '#f87171'}
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="0.5"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isP1 ? '#e0f2fe' : '#fee2e2'}
                    fontSize="8.5"
                    fontWeight="900"
                  >
                    {effMp}
                  </text>
                </g>

                {/* High-Contrast Colored Nameplate (Bottom) */}
                <rect
                  x="-27"
                  y="13"
                  width="54"
                  height="13"
                  rx="3"
                  fill={isP1 ? '#0369a1' : '#7f1d1d'}
                  stroke={isP1 ? '#38bdf8' : '#f87171'}
                  strokeWidth="1.2"
                />
                <text
                  x="0"
                  y="19.5"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#ffffff"
                  fontSize="7.5"
                  fontWeight="900"
                >
                  {ownerBadgeText} • {fig.shortName}
                </text>

                {/* Fuinjutsu Wait Seal */}
                {fig.wait > 0 && (
                  <g transform="translate(0, 0)">
                    <circle r="12" fill="rgba(153, 27, 27, 0.9)" stroke="#fde047" strokeWidth="1.5" />
                    <text x="0" y="0.5" textAnchor="middle" dominantBaseline="central" fill="#fef08a" fontSize="9" fontWeight="900">
                      封{fig.wait}
                    </text>
                  </g>
                )}

                {/* Status Badge (Bottom-Left) */}
                {fig.status && STATUS_ICONS[fig.status] && (
                  <g transform="translate(-20, 18)">
                    <circle r="9" fill="#09090b" stroke={STATUS_ICONS[fig.status].color} strokeWidth="1.8" />
                    <text
                      x="0"
                      y="0.5"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={STATUS_ICONS[fig.status].color}
                      fontSize="9"
                      fontWeight="900"
                    >
                      {STATUS_ICONS[fig.status].kanji}
                    </text>
                  </g>
                )}

                {/* Level / Evolution Badge (Bottom-Right) */}
                {(fig.evolved || fig.clv > 0) && (
                  <g transform="translate(20, 18)">
                    <rect x="-10" y="-7" width="20" height="13" rx="2.5" fill={fig.evolved ? '#7e22ce' : '#0f172a'} stroke="#fde047" strokeWidth="1.2" />
                    <text x="0" y="-0.5" textAnchor="middle" dominantBaseline="central" fill="#fde047" fontSize="7" fontWeight="900">
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
            {state.phase === 'GOAL_BLOCK_SELECT' && t('scrolls.goalBlockPrompt')}
            {state.phase === 'HEAL_SELECT' && t('scrolls.healPrompt')}
            {state.phase === 'REVIVE_SELECT' && t('scrolls.revivePrompt')}
            {state.phase === 'SWAP_SELECT_1' && t('scrolls.swapPrompt1')}
            {state.phase === 'SWAP_SELECT_2' && t('scrolls.swapPrompt2')}
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
            {t('board.postMovePrompt')}
          </span>
          <button
            onClick={onEndPostMove}
            className="px-3 py-1.5 rounded bg-red-800 hover:bg-red-700 text-amber-100 text-xs font-bold shadow transition"
          >
            {t('board.endTurnPrompt')}
          </button>
        </div>
      )}
    </div>
  );
};
