import React from 'react';
import { GameState } from '../../../application/state/gameInitialState';
import { calculateEffectiveMp } from '../../../domain/services/BoardMovementService';
import { CHAR_SVG_FALLBACKS } from '../../../infrastructure/assets/animeAssets';

interface PlayerCommandBarProps {
  player: 1 | 2;
  state: GameState;
  onSelectUnit: (figureId: string) => void;
  onActivateScroll: (player: 1 | 2, scrollSlotId: string) => void;
}

export const PlayerCommandBar: React.FC<PlayerCommandBarProps> = ({
  player,
  state,
  onSelectUnit,
  onActivateScroll,
}) => {
  const isP1 = player === 1;
  const benchFigures = state.figures.filter(f => f.owner === player && f.location === 'bench');
  const koIds = state.koQueue[player];
  const playerScrolls = state.scrolls[player];
  const buffs = state.activeBuffs[player];

  const activeBuffBadges: string[] = [];
  if (buffs.powerBonus > 0) activeBuffBadges.push(`+${buffs.powerBonus} Poder`);
  if (buffs.mpBonus > 0) activeBuffBadges.push(`+1 MP`);
  if (buffs.doubleChance) activeBuffBadges.push(`Sharingan Activo`);
  if (buffs.desperateBoost) activeBuffBadges.push(`Sello +50 Activo`);

  return (
    <div
      className={`rounded-lg p-2 md:p-2.5 border-2 shadow-2xl transition-colors ${
        isP1
          ? 'border-sky-500/90 bg-gradient-to-b from-[#0e2238] via-[#091624] to-[#040b12]'
          : 'border-red-600/90 bg-gradient-to-b from-[#2e0d0d] via-[#1a0707] to-[#0a0303]'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 border-b border-stone-700/70 pb-1.5">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 text-xs font-black border-2 rounded-sm shadow ${
              isP1
                ? 'bg-sky-600 text-white border-sky-300'
                : 'bg-red-700 text-white border-red-400'
            }`}
          >
            {isP1 ? 'J1 • 木' : state.mode === 'ai' ? 'IA • 暁' : 'J2 • 暁'}
          </span>
          <span className={`text-xs font-black tracking-wider ${isP1 ? 'text-sky-300' : 'text-red-300'}`}>
            {isP1
              ? '🔵 ESCUADRÓN KONOHA (TUS FICHAS — JUGADOR 1)'
              : state.mode === 'ai'
              ? '🔴 FACCIÓN OPONENTE: AKATSUKI (IA ANBU)'
              : '🔴 FACCIÓN OPONENTE: AKATSUKI (J2 LOCAL)'}
          </span>
          {activeBuffBadges.length > 0 && (
            <span className="text-[10px] font-extrabold text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-500/50">
              {activeBuffBadges.join(' • ')}
            </span>
          )}
        </div>

        {/* Tactical Scrolls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {playerScrolls.map(sc => {
            const canUse =
              state.turnPlayer === player &&
              state.phase === 'SELECT' &&
              !sc.used &&
              !buffs.scrollUsedThisTurn &&
              !(state.mode === 'ai' && player === 2);

            return (
              <button
                key={sc.slotId || sc.id}
                title={`${sc.description} (Coste: ${sc.cost})`}
                disabled={!canUse}
                onClick={() => onActivateScroll(player, sc.slotId || sc.id)}
                className={`px-2 py-1 rounded text-[10px] font-bold border transition flex items-center gap-1 min-h-[30px] ${
                  sc.used
                    ? 'bg-stone-950 text-stone-600 border-stone-800 line-through cursor-not-allowed opacity-60'
                    : canUse
                    ? 'bg-[#f4ebd9] hover:bg-amber-200 text-stone-900 border-amber-700 cursor-pointer shadow-sm active:scale-95'
                    : 'bg-stone-900 text-stone-400 border-stone-700 cursor-default opacity-80'
                }`}
              >
                <span className="font-black text-red-800">{sc.kanji}</span>
                <span className="truncate max-w-[110px]">{sc.name}</span>
                <span className="px-1 rounded-sm bg-stone-800 text-amber-300 text-[8px] font-mono">
                  C{sc.cost}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bench (6 slots) & Fuinjutsu Infirmary (2 slots) */}
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className={`col-span-8 border rounded p-1.5 ${isP1 ? 'bg-sky-950/40 border-sky-800/80' : 'bg-red-950/40 border-red-800/80'}`}>
          <div className="text-[9px] uppercase font-bold mb-1 flex justify-between">
            <span className={isP1 ? 'text-sky-300' : 'text-red-300'}>
              {isP1 ? '陣 Banquillo Aliado (J1)' : '陣 Banquillo Rival'} ({benchFigures.length}/6)
            </span>
            <span className="text-stone-400">{isP1 ? 'Desplegar por esquinas inferiores' : 'Refuerzos oponentes'}</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5 min-h-[54px]">
            {Array.from({ length: 6 }).map((_, idx) => {
              const fig = benchFigures[idx];
              if (!fig) {
                return (
                  <div
                    key={`empty_bench_${idx}`}
                    className="rounded border border-dashed border-stone-800 bg-stone-950/40 min-h-[52px]"
                  />
                );
              }
              const isSelected = state.selectedFigureId === fig.id;
              const effMp = calculateEffectiveMp(fig, state.turnCount, buffs);
              const ownerTag = isP1 ? 'J1' : state.mode === 'ai' ? 'IA' : 'J2';
              return (
                <button
                  key={fig.id}
                  onClick={() => onSelectUnit(fig.id)}
                  aria-label={`Seleccionar ${fig.name} del banquillo`}
                  className={`relative flex flex-col items-center p-1 rounded bg-stone-900 border-2 transition shadow min-h-[50px] ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400 scale-105 z-10'
                      : isP1
                      ? 'border-sky-500/80 hover:border-sky-300'
                      : 'border-red-600/80 hover:border-red-400'
                  }`}
                >
                  {/* Faction Tag Badge */}
                  <span
                    className={`absolute -top-1.5 -left-1.5 px-1 py-0.2 rounded-sm text-[8px] font-black border shadow ${
                      isP1
                        ? 'bg-sky-600 text-white border-sky-300'
                        : 'bg-red-700 text-white border-red-300'
                    }`}
                  >
                    {ownerTag}
                  </span>

                  <div className={`w-9 h-9 rounded-full overflow-hidden border-2 bg-stone-800 ${isP1 ? 'border-sky-400' : 'border-red-500'}`}>
                    <img
                      src={fig.portraitUrl}
                      alt={fig.shortName}
                      className="w-full h-full object-cover object-top"
                      onError={e => {
                        e.currentTarget.src = CHAR_SVG_FALLBACKS[fig.key] || '';
                      }}
                    />
                  </div>
                  <span className={`text-[9px] font-extrabold truncate max-w-full mt-0.5 ${isP1 ? 'text-sky-100' : 'text-red-100'}`}>
                    {fig.shortName}
                  </span>
                  <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-sm text-[9px] font-black flex items-center justify-center border shadow ${
                    isP1
                      ? 'bg-sky-400 text-stone-950 border-sky-100'
                      : 'bg-red-500 text-white border-red-200'
                  }`}>
                    {effMp}
                  </span>
                  {fig.wait > 0 && (
                    <span className="absolute bottom-4 left-0 px-1 rounded-sm bg-red-900 text-amber-200 text-[8px] font-bold border border-amber-400">
                      封{fig.wait}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-4 bg-red-950/35 border border-red-800/70 rounded p-1.5">
          <div className="text-[9px] text-red-300 uppercase font-bold mb-1 flex justify-between">
            <span>封 Prisión Fuinjutsu</span>
            <span>Máx 2 (FIFO)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 min-h-[54px]">
            {Array.from({ length: 2 }).map((_, idx) => {
              const koId = koIds[idx];
              const fig = koId ? state.figures.find(f => f.id === koId) : null;
              if (!fig) {
                return (
                  <div
                    key={`empty_ko_${idx}`}
                    className="rounded border border-dashed border-red-900/40 bg-stone-950/30 min-h-[52px]"
                  />
                );
              }
              return (
                <button
                  key={fig.id}
                  onClick={() => onSelectUnit(fig.id)}
                  aria-label={`Ver ninja sellado: ${fig.name}`}
                  className="relative flex flex-col items-center p-1 rounded bg-red-950/60 border border-red-800 opacity-85 hover:opacity-100 transition min-h-[50px]"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-red-500 grayscale">
                    <img
                      src={fig.portraitUrl}
                      alt={fig.shortName}
                      className="w-full h-full object-cover object-top"
                      onError={e => {
                        e.currentTarget.src = CHAR_SVG_FALLBACKS[fig.key] || '';
                      }}
                    />
                  </div>
                  <span className="text-[8px] font-bold text-red-200 truncate max-w-full mt-0.5">
                    {fig.shortName}
                  </span>
                  <span className="absolute top-0 right-0 px-1 bg-red-800 text-amber-100 text-[8px] font-black">
                    封
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
