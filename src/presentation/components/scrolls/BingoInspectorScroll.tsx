import React from 'react';
import { GameState } from '../../../application/state/gameInitialState';
import {
  ShinobiFigureState,
  WHEEL_COLORS,
  WHEEL_TOTAL_SEGMENTS,
  getFigureColorBreakdown,
  WheelColor,
} from '../../../domain/models/ShinobiFigure';
import { calculateEffectiveMp } from '../../../domain/services/BoardMovementService';
import { ChakraDiskSVG } from '../wheel/ChakraDiskSVG';
import { CHAR_SVG_FALLBACKS, JUTSU_ANIME_CUTINS } from '../../../infrastructure/assets/animeAssets';

interface BingoInspectorScrollProps {
  figure: ShinobiFigureState | null;
  state: GameState;
  onOpenWorkshop?: () => void;
}

const STATUS_INFO: Record<string, { label: string; desc: string; color: string; kanji: string }> = {
  burned: {
    label: 'Quemadura (Amaterasu)',
    desc: '-10 DMG en ataques y su sector no-Rojo más pequeño muta a Fallo Rojo.',
    color: '#f97316',
    kanji: '炎',
  },
  paralyzed: {
    label: 'Parálisis (Raiton)',
    desc: 'Su sector no-Rojo más pequeño pasa a ser Fallo Rojo.',
    color: '#facc15',
    kanji: '痺',
  },
  confused: {
    label: 'Confusión (Genjutsu)',
    desc: 'El resultado del giro se desfasa +1 sector en sentido horario.',
    color: '#c084fc',
    kanji: '幻',
  },
  frozen: {
    label: 'Sellado en Arena (Congelado)',
    desc: 'Inmovilizado. Ruleta 100% Fallo Rojo hasta toque de asistencia aliado.',
    color: '#38bdf8',
    kanji: '砂',
  },
};

export const BingoInspectorScroll: React.FC<BingoInspectorScrollProps> = ({
  figure,
  state,
  onOpenWorkshop,
}) => {
  if (!figure) return null;

  const effMp = calculateEffectiveMp(figure, state.turnCount, state.activeBuffs[figure.owner]);
  const colorTotals = getFigureColorBreakdown(figure.segments);
  const statusObj = figure.status ? STATUS_INFO[figure.status] : null;

  return (
    <div className="shadow-2xl">
      <div className="h-2.5 bg-gradient-to-r from-amber-700 via-[#281b12] to-amber-700 rounded-t border-b-2 border-stone-950" />
      <div className="bg-[#f4ebd9] text-stone-900 p-3.5 border-x-4 border-[#281b12] shadow-inner">
        <div className="flex items-start justify-between border-b-2 border-stone-800/30 pb-2.5 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="relative w-16 h-16 rounded border-2 border-stone-900 bg-stone-800 overflow-hidden shrink-0 shadow-md">
              <img
                src={figure.portraitUrl}
                alt={figure.name}
                className="w-full h-full object-cover object-top"
                onError={e => {
                  e.currentTarget.src = CHAR_SVG_FALLBACKS[figure.key] || '';
                }}
              />
              <span className="absolute bottom-0 right-0 px-1 bg-red-800 text-amber-100 text-[9px] font-black">
                {figure.key.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1 flex-wrap">
                <span
                  className={`px-2 py-0.5 text-[10px] font-black uppercase text-white rounded shadow-sm border ${
                    figure.owner === 1
                      ? 'bg-sky-600 border-sky-300'
                      : 'bg-red-700 border-red-300'
                  }`}
                >
                  {figure.owner === 1
                    ? '🔵 ALIADO (JUGADOR 1)'
                    : `🔴 OPONENTE (${state.mode === 'ai' ? 'IA AKATSUKI' : 'JUGADOR 2'})`}
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-stone-900 text-amber-400 rounded-sm border border-amber-500">
                  Nv.{figure.level || 1} • CLv+{figure.clv || 0}
                </span>
                {figure.evolved && (
                  <span className="px-1.5 py-0.5 text-[9px] font-black bg-purple-800 text-amber-200 rounded-sm">
                    ★ DESPERTAR UX
                  </span>
                )}
              </div>
              <h2 className="text-base font-black text-stone-900 leading-tight mt-0.5">{figure.name}</h2>
              <p className="text-[10px] font-extrabold text-amber-900">{figure.archetype}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-stone-900 text-amber-400 border-2 border-amber-600 rounded px-2.5 py-1 shrink-0 shadow">
            <span className="text-[9px] font-bold uppercase tracking-tighter text-amber-200/80">PASOS MP</span>
            <span className="text-xl font-black leading-none">{effMp}</span>
          </div>
        </div>

        {/* Active Status Condition */}
        {statusObj && (
          <div
            className="mb-2 p-2 rounded bg-stone-950 text-white border-l-4 flex items-center justify-between text-[10px]"
            style={{ borderColor: statusObj.color }}
          >
            <div>
              <div className="font-black uppercase" style={{ color: statusObj.color }}>
                {statusObj.kanji} ESTADO: {statusObj.label}
              </div>
              <div className="text-stone-300">{statusObj.desc}</div>
            </div>
          </div>
        )}

        {/* Color Distribution Bar */}
        <div className="mb-2.5 bg-stone-900/95 p-2 rounded border border-stone-700 text-stone-100">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase text-amber-300 mb-1">
            <span>Disco Nv.{figure.level || 1} (Base 96)</span>
            {onOpenWorkshop && (
              <button
                onClick={onOpenWorkshop}
                className="px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-[9px] transition"
              >
                ⚒️ Forja / Nivel
              </button>
            )}
          </div>
          <div className="w-full h-2.5 rounded-sm overflow-hidden flex border border-stone-600">
            {(['white', 'gold', 'purple', 'blue', 'red'] as WheelColor[]).map(cKey => {
              const val = colorTotals[cKey] || 0;
              if (val === 0) return null;
              return (
                <div
                  key={cKey}
                  style={{
                    width: `${(val / WHEEL_TOTAL_SEGMENTS) * 100}%`,
                    backgroundColor: WHEEL_COLORS[cKey].fill,
                  }}
                  title={`${WHEEL_COLORS[cKey].label}: ${val}/96`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1 mt-1.5 justify-between text-[9px] font-mono">
            <span className={colorTotals.white ? 'text-white font-bold' : 'text-stone-600'}>
              BLA:{colorTotals.white}
            </span>
            <span className={colorTotals.gold ? 'text-amber-400 font-bold' : 'text-stone-600'}>
              DOR:{colorTotals.gold}
            </span>
            <span className={colorTotals.purple ? 'text-purple-300 font-bold' : 'text-stone-600'}>
              MOR:{colorTotals.purple}
            </span>
            <span className={colorTotals.blue ? 'text-sky-300 font-bold' : 'text-stone-600'}>
              AZU:{colorTotals.blue}
            </span>
            <span className={colorTotals.red ? 'text-red-400 font-bold' : 'text-stone-600'}>
              ROJ:{colorTotals.red}
            </span>
          </div>
        </div>

        {/* Anime Cut-In Art */}
        <div className="mb-2 rounded border-2 border-stone-800 bg-stone-900 overflow-hidden shadow relative h-20">
          <img
            src={JUTSU_ANIME_CUTINS[figure.key] || JUTSU_ANIME_CUTINS.rasengan}
            alt="Jutsu Cut-in"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2">
            <span className="text-[10px] uppercase font-bold text-amber-300">
              Técnica Suprema de Combate
            </span>
            <div className="text-xs font-black text-white tracking-wide">{figure.name}</div>
          </div>
        </div>

        {/* Circular Wheel Preview */}
        <div className="flex items-center justify-center my-1.5 bg-stone-900/10 rounded-xl py-1.5 border border-stone-800/20">
          <ChakraDiskSVG figure={figure} size={148} />
        </div>

        {/* Doctrine Description */}
        <div className="mt-2 p-2 rounded bg-amber-950/10 border-l-4 border-red-800 text-xs space-y-1">
          <div className="font-black text-red-900 text-[10px] flex items-center justify-between">
            <span>DOCTRINA SHINOBI</span>
            <span>{figure.status === 'burned' ? '🔥 QUEMADO (-10 DMG)' : '印'}</span>
          </div>
          <p className="text-[10px] text-stone-800 font-medium leading-snug">{figure.ability}</p>
        </div>

        {/* Segments Breakdown */}
        <div className="mt-2.5">
          <div className="text-[10px] font-extrabold text-stone-700 uppercase tracking-wider mb-1 flex justify-between">
            <span>Sectores del Disco</span>
            <span>Poder / Tamaño</span>
          </div>
          <div className="space-y-1 text-xs">
            {figure.segments.map((seg, idx) => {
              const col = WHEEL_COLORS[seg.color];
              const pct = Math.round((seg.size / WHEEL_TOTAL_SEGMENTS) * 100);
              let valLabel = '';
              if (seg.color === 'white' || seg.color === 'gold') valLabel = `${seg.power} DMG`;
              else if (seg.color === 'purple') valLabel = `${'★'.repeat(seg.stars)} (0 DMG)`;
              else if (seg.color === 'blue') valLabel = 'Esquiva';
              else valLabel = 'Fallo';

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-1.5 rounded bg-stone-900 text-stone-100 border border-stone-700"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-sm shrink-0 border border-white/40"
                      style={{ background: col.fill }}
                    />
                    <div className="truncate">
                      <div className="font-bold text-[11px] leading-tight truncate">{seg.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-extrabold text-amber-400 text-[10px]">{valLabel}</span>
                    <span className="text-[10px] font-mono text-stone-300 bg-stone-950 px-1.5 py-0.5 rounded border border-stone-700">
                      {seg.size}/96 ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="h-2.5 bg-gradient-to-r from-amber-700 via-[#281b12] to-amber-700 rounded-b border-t-2 border-stone-950" />
    </div>
  );
};
