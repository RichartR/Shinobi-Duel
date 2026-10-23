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
import { useTranslation } from '../../context/I18nContext';
import { getLocalizedFigure } from '../../../infrastructure/i18n/locales/figureI18n';

interface BingoInspectorScrollProps {
  figure: ShinobiFigureState | null;
  state: GameState;
  onOpenWorkshop?: () => void;
}

export const BingoInspectorScroll: React.FC<BingoInspectorScrollProps> = ({
  figure: rawFigure,
  state,
  onOpenWorkshop,
}) => {
  const { t, language } = useTranslation();
  if (!rawFigure) return null;

  const figure = getLocalizedFigure(rawFigure, language);

  const STATUS_INFO: Record<string, { label: string; desc: string; color: string; kanji: string }> = {
    burned: {
      label: t('status.burned'),
      desc: t('status.burnedDesc'),
      color: '#f97316',
      kanji: '炎',
    },
    paralyzed: {
      label: t('status.paralyzed'),
      desc: t('status.paralyzedDesc'),
      color: '#facc15',
      kanji: '痺',
    },
    confused: {
      label: t('status.confused'),
      desc: t('status.confusedDesc'),
      color: '#c084fc',
      kanji: '幻',
    },
    frozen: {
      label: t('status.frozen'),
      desc: t('status.frozenDesc'),
      color: '#38bdf8',
      kanji: '砂',
    },
  };

  const effMp = calculateEffectiveMp(figure, state.turnCount, state.activeBuffs[figure.owner]);
  const colorTotals = getFigureColorBreakdown(figure.segments);
  const statusObj = figure.status ? STATUS_INFO[figure.status] : null;
  return (
    <div className="bg-white border-3 border-black overflow-hidden shadow-[4px_4px_0px_#111111] max-h-[calc(100vh-90px)] flex flex-col">
      {/* Top Manga Header Banner */}
      <div className="h-8 bg-[#111111] border-b-3 border-black flex items-center justify-between px-3 text-[#FA9427] shrink-0">
        <span className="w-4 h-1.5 bg-[#FA9427]" />
        <span className="text-xs md:text-sm font-impact tracking-widest text-[#FA9427] uppercase">
          忍録 • BINGO BOOK INSPECTOR
        </span>
        <span className="w-4 h-1.5 bg-[#FA9427]" />
      </div>

      <div className="bg-white text-stone-900 p-3 md:p-3.5 overflow-y-auto space-y-2.5 flex-1 pr-1.5">
        <div className="flex items-start justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 border-2 border-black bg-stone-900 overflow-hidden shrink-0 shadow-[2px_2px_0px_#000]">
              <img
                src={figure.portraitUrl || CHAR_SVG_FALLBACKS[figure.key]}
                alt={figure.name}
                className="w-full h-full object-cover object-top"
                onError={e => {
                  e.currentTarget.src = CHAR_SVG_FALLBACKS[figure.key] || '';
                }}
              />
              <span className="absolute bottom-0 right-0 px-1 bg-red-700 text-white text-[10px] font-black border-t border-l border-black">
                {figure.key.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`px-2 py-0.5 text-xs font-impact uppercase tracking-wider text-white border border-black shadow-[1px_1px_0px_#000] ${
                    figure.owner === 1
                      ? 'bg-[#0284c7]'
                      : 'bg-[#dc2626]'
                  }`}
                >
                  {figure.owner === 1
                    ? `🔵 ${t('common.ally')} (${t('common.player1')})`
                    : `🔴 ${t('common.opponent')} (${state.mode === 'ai' ? t('common.ai') : t('common.player2')})`}
                </span>
                <span className="px-2 py-0.5 text-xs font-bold bg-stone-100 text-stone-900 border border-black">
                  {t('common.level')}.{figure.level || 1} • {t('common.clv')}+{figure.clv || 0}
                </span>
                {figure.evolved && (
                  <span className="px-2 py-0.5 text-xs font-black bg-purple-700 text-white border border-black uppercase">
                    {t('inspector.awakeningUx')}
                  </span>
                )}
              </div>
              <h2 className="text-lg md:text-xl font-impact text-black leading-tight uppercase tracking-wide mt-1">{figure.name}</h2>
              <p className="text-xs font-bold text-[#E77100] uppercase tracking-wider">{figure.archetype}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-[#FA9427] text-black border-2 border-black px-3 py-1 shrink-0 shadow-[2px_2px_0px_#000]">
            <span className="text-[10px] font-black uppercase tracking-wider text-black">{t('common.mp')}</span>
            <span className="text-2xl font-impact leading-none">{effMp}</span>
          </div>
        </div>

        {/* Active Status Condition */}
        {statusObj && (
          <div
            className="p-2 bg-[#fff8f0] text-stone-950 border-2 border-black border-l-6 flex items-center justify-between text-xs shadow-[2px_2px_0px_#000]"
            style={{ borderLeftColor: statusObj.color }}
          >
            <div>
              <div className="font-impact uppercase text-xs" style={{ color: statusObj.color }}>
                {statusObj.kanji} {statusObj.label}
              </div>
              <div className="text-stone-700 font-medium text-xs">{statusObj.desc}</div>
            </div>
          </div>
        )}

        {/* Active Fuinjutsu Wait Condition */}
        {figure.wait > 0 && (
          <div className="p-2 bg-[#fff5f5] text-stone-950 border-2 border-black border-l-6 border-l-red-600 flex items-center justify-between text-xs shadow-[2px_2px_0px_#000]">
            <div>
              <div className="font-impact uppercase text-xs text-red-700">
                ⏳ {t('hierarchy.waitTitle')} ({figure.wait})
              </div>
              <div className="text-stone-700 font-medium text-xs">{t('hierarchy.waitDetail')}</div>
            </div>
          </div>
        )}

        {/* Color Distribution Bar */}
        <div className="bg-[#fbf9f5] p-2 border-2 border-black shadow-[2px_2px_0px_#000] text-stone-900">
          <div className="flex items-center justify-between text-xs font-impact uppercase tracking-wider text-black mb-1.5">
            <span>{t('inspector.diskLevel', { level: figure.level || 1 })}</span>
            {onOpenWorkshop && (
              <button
                onClick={onOpenWorkshop}
                className="px-2.5 py-0.5 bg-[#FA9427] hover:bg-[#ffaa42] text-black font-impact text-xs uppercase border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
              >
                {t('inspector.forgeLevelBtn')}
              </button>
            )}
          </div>
          <div className="w-full h-3.5 overflow-hidden flex border-2 border-black">
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
          <div className="flex flex-wrap gap-1.5 mt-1.5 justify-between text-xs font-mono font-bold">
            <span className={colorTotals.white ? 'text-black' : 'text-stone-400'}>
              {t('inspector.whiteAbbr')}:{colorTotals.white}
            </span>
            <span className={colorTotals.gold ? 'text-amber-700' : 'text-stone-400'}>
              {t('inspector.goldAbbr')}:{colorTotals.gold}
            </span>
            <span className={colorTotals.purple ? 'text-purple-700' : 'text-stone-400'}>
              {t('inspector.purpleAbbr')}:{colorTotals.purple}
            </span>
            <span className={colorTotals.blue ? 'text-sky-700' : 'text-stone-400'}>
              {t('inspector.blueAbbr')}:{colorTotals.blue}
            </span>
            <span className={colorTotals.red ? 'text-red-700' : 'text-stone-400'}>
              {t('inspector.redAbbr')}:{colorTotals.red}
            </span>
          </div>
        </div>

        {/* Circular Wheel Preview */}
        <div className="flex items-center justify-center py-2 bg-[#fdfbf7] border-2 border-black shadow-[2px_2px_0px_#000]">
          <ChakraDiskSVG figure={figure} size={135} />
        </div>

        {/* Doctrine Description */}
        <div className="p-2.5 bg-[#fff8ee] border-2 border-black text-xs space-y-1 shadow-[2px_2px_0px_#000]">
          <div className="font-impact text-black text-xs uppercase flex items-center justify-between">
            <span className="text-red-700">【 {t('inspector.title')} 】</span>
            <span className="font-bold">
              {figure.status === 'burned'
                ? t('inspector.burnedTag')
                : figure.status === 'paralyzed'
                ? t('inspector.paralyzedTag')
                : figure.status === 'confused'
                ? t('inspector.confusedTag')
                : figure.status === 'frozen'
                ? t('inspector.frozenTag')
                : figure.wait > 0
                ? `⏳ ${t('common.wait')} (${figure.wait})`
                : '印'}
            </span>
          </div>
          <p className="text-xs text-stone-900 font-medium leading-relaxed">{figure.ability}</p>
        </div>

        {/* Segments Breakdown */}
        <div>
          <div className="text-xs font-impact text-black uppercase tracking-wider mb-1.5 flex justify-between">
            <span>{t('inspector.wheelSectors')}</span>
            <span>{t('inspector.powerSize')}</span>
          </div>
          <div className="space-y-1.5 text-xs">
            {figure.segments.map((seg, idx) => {
              const col = WHEEL_COLORS[seg.color];
              const pct = Math.round((seg.size / WHEEL_TOTAL_SEGMENTS) * 100);
              let valLabel = '';
              if (seg.color === 'white' || seg.color === 'gold') valLabel = `${seg.power} DMG`;
              else if (seg.color === 'purple') valLabel = `${'★'.repeat(seg.stars)} (0 DMG)`;
              else if (seg.color === 'blue') valLabel = t('inspector.dodge');
              else valLabel = t('inspector.miss');

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-[#faf8f5] text-stone-900 border border-black shadow-[1px_1px_0px_#000] hover:bg-[#fff9ee] transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-4 h-4 shrink-0 border border-black shadow-xs"
                      style={{ background: col.fill }}
                    />
                    <div className="truncate">
                      <div className="font-bold text-xs leading-tight truncate text-stone-950">{seg.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-impact uppercase tracking-wide text-black text-xs">{valLabel}</span>
                    <span className="text-xs font-mono text-black bg-stone-200 px-2 py-0.5 border border-black font-bold">
                      {seg.size}/96 ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
