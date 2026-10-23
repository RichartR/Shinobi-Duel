import React from 'react';
import { GameState } from '../../../application/state/gameInitialState';
import { calculateEffectiveMp } from '../../../domain/services/BoardMovementService';
import { CHAR_SVG_FALLBACKS } from '../../../infrastructure/assets/animeAssets';
import { useTranslation } from '../../context/I18nContext';
import { getLocalizedFigure, getLocalizedScroll } from '../../../infrastructure/i18n/locales/figureI18n';

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
  const { t, language } = useTranslation();
  const isP1 = player === 1;
  const rawBenchFigures = state.figures.filter(f => f.owner === player && f.location === 'bench');
  const benchFigures = rawBenchFigures.map(f => getLocalizedFigure(f, language));
  const koIds = state.koQueue[player];
  const playerScrolls = state.scrolls[player].map(s => getLocalizedScroll(s, language));
  const buffs = state.activeBuffs[player];

  const activeBuffBadges: string[] = [];
  if (buffs.powerBonus > 0) activeBuffBadges.push(t('buffs.powerBonus', { value: buffs.powerBonus }));
  if (buffs.mpBonus > 0) activeBuffBadges.push(t('buffs.mpBonus'));
  if (buffs.doubleChance) activeBuffBadges.push(t('buffs.doubleChanceActive'));
  if (buffs.desperateBoost) activeBuffBadges.push(t('buffs.desperateBoostActive'));

  const ownerBadgeText = isP1 ? 'P1' : state.mode === 'ai' ? 'AI' : 'P2';

  return (
    <div
      className={`p-1.5 md:p-2 border-3 border-black shadow-[4px_4px_0px_#000] transition-colors ${
        isP1 ? 'bg-white' : 'bg-white'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5 border-b-2 border-black pb-1">
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 text-xs font-impact tracking-wider border-2 border-black shadow-[1px_1px_0px_#000] uppercase ${
              isP1
                ? 'bg-[#0284c7] text-white'
                : 'bg-[#dc2626] text-white'
            }`}
          >
            {isP1 ? 'P1 • 木ノ葉' : state.mode === 'ai' ? 'AI • 暁' : 'P2 • 暁'}
          </span>
          <span className="text-xs md:text-sm font-impact tracking-wide text-black uppercase">
            {isP1
              ? t('board.p1Faction')
              : state.mode === 'ai'
              ? t('board.p2FactionAi')
              : t('board.p2FactionLocal')}
          </span>
          {activeBuffBadges.length > 0 && (
            <span className="text-[11px] md:text-xs font-bold text-amber-950 bg-amber-200 px-1.5 py-0.2 border border-black shadow-[1px_1px_0px_#000] uppercase">
              {activeBuffBadges.join(' • ')}
            </span>
          )}
        </div>

        {/* Tactical Scrolls - Sharp Manga Scroll Badges */}
        <div className="flex items-center gap-1 flex-wrap">
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
                title={`${sc.description} (${t('scrolls.cost')}: ${sc.cost})`}
                disabled={!canUse}
                onClick={() => onActivateScroll(player, sc.slotId || sc.id)}
                className={`px-2 py-0.5 text-xs font-bold border-2 transition-all flex items-center gap-1 min-h-[26px] cursor-pointer ${
                  sc.used
                    ? 'bg-stone-200 text-stone-500 border-2 border-stone-400 line-through cursor-not-allowed opacity-60'
                    : canUse
                    ? 'bg-[#fff9ee] hover:bg-[#ffe3b8] text-stone-950 border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5'
                    : 'bg-stone-100 text-stone-500 border-2 border-stone-400 cursor-default opacity-80'
                }`}
              >
                <span className="font-kanji font-black text-red-700 text-xs">{sc.kanji}</span>
                <span className="truncate max-w-[110px] text-stone-900 font-bold">{sc.name}</span>
                <span className="px-1 py-0.2 bg-stone-900 text-amber-300 text-[10px] font-mono font-bold border border-black">
                  C{sc.cost}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bench (6 slots) & Fuinjutsu Infirmary (2 slots) - Sharp Manga Panels */}
      <div className="grid grid-cols-12 gap-1.5 items-center">
        <div className={`col-span-8 border-2 border-black p-1.5 shadow-[2px_2px_0px_#000] ${isP1 ? 'bg-[#f4f9fd]' : 'bg-[#fdf6f6]'}`}>
          <div className="text-[11px] md:text-xs uppercase font-impact tracking-wider mb-1 flex justify-between">
            <span className={isP1 ? 'text-sky-900 font-black' : 'text-red-900 font-black'}>
              {isP1 ? `陣 ${t('board.allyBench')}` : `陣 ${t('board.rivalBench')}`} ({benchFigures.length}/6)
            </span>
            <span className="text-stone-500 font-bold text-[10px] hidden sm:inline">{isP1 ? t('board.deployBottomDesc') : t('board.reinforcementsDesc')}</span>
          </div>
          <div className="grid grid-cols-6 gap-1 min-h-[50px] md:min-h-[54px]">
            {Array.from({ length: 6 }).map((_, idx) => {
              const fig = benchFigures[idx];
              if (!fig) {
                return (
                  <div
                    key={`empty_bench_${idx}`}
                    className="border-2 border-dashed border-stone-400 bg-stone-100/70 min-h-[50px] md:min-h-[54px]"
                  />
                );
              }
              const isSelected = state.selectedFigureId === fig.id;
              const effMp = calculateEffectiveMp(fig, state.turnCount, buffs);
              return (
                <button
                  key={fig.id}
                  onClick={() => onSelectUnit(fig.id)}
                  aria-label={`${t('common.confirm')}: ${fig.name}`}
                  className={`relative flex flex-col items-center p-0.5 border-2 transition-all min-h-[50px] md:min-h-[54px] cursor-pointer ${
                    isSelected
                      ? 'bg-[#FA9427] text-black border-2 border-black scale-105 z-10 shadow-[3px_3px_0px_#000]'
                      : 'bg-white border-2 border-black shadow-[2px_2px_0px_#000] hover:-translate-y-0.5'
                  }`}
                >
                  {/* Faction Tag Badge */}
                  <span
                    className={`absolute -top-1.5 -left-1.5 px-1 py-0.2 text-[9px] font-black border border-black shadow-[1px_1px_0px_#000] ${
                      isP1
                        ? 'bg-[#0284c7] text-white'
                        : 'bg-[#dc2626] text-white'
                    }`}
                  >
                    {ownerBadgeText}
                  </span>

                  {/* Sharp Authentic Anime Face Portrait */}
                  <div className="w-8 h-8 md:w-9 md:h-9 border-2 border-black overflow-hidden bg-stone-900 shadow-[1px_1px_0px_#000]">
                    <img
                      src={fig.portraitUrl || CHAR_SVG_FALLBACKS[fig.key]}
                      alt={fig.shortName}
                      className="w-full h-full object-cover object-top"
                      onError={e => {
                        e.currentTarget.src = CHAR_SVG_FALLBACKS[fig.key] || '';
                      }}
                    />
                  </div>
                  <span className="text-[11px] md:text-xs font-black tracking-tight truncate max-w-full mt-0.5 text-stone-900 uppercase">
                    {fig.shortName}
                  </span>
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[10px] font-mono font-black flex items-center justify-center border border-black bg-[#FA9427] text-black shadow-[1px_1px_0px_#000]">
                    {effMp}
                  </span>
                  {fig.wait > 0 && (
                    <span className="absolute bottom-3 left-0 px-1 bg-red-700 text-white text-[9px] font-black border border-black">
                      封{fig.wait}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fuinjutsu Prison - Sharp Manga Chamber */}
        <div className="col-span-4 bg-[#fff5f5] border-2 border-black p-1.5 shadow-[2px_2px_0px_#000]">
          <div className="text-[11px] md:text-xs text-red-900 uppercase font-impact tracking-wider mb-1 flex justify-between">
            <span className="font-black">封 {t('board.prison')}</span>
            <span className="text-stone-500 font-bold text-[10px]">{t('board.prisonMax')}</span>
          </div>
          <div className="grid grid-cols-2 gap-1 min-h-[50px] md:min-h-[54px]">
            {Array.from({ length: 2 }).map((_, idx) => {
              const koId = koIds[idx];
              const rawFig = koId ? state.figures.find(f => f.id === koId) : null;
              const fig = rawFig ? getLocalizedFigure(rawFig, language) : null;
              if (!fig) {
                return (
                  <div
                    key={`empty_ko_${idx}`}
                    className="border-2 border-dashed border-stone-400 bg-stone-100/60 min-h-[50px] md:min-h-[54px]"
                  />
                );
              }
              return (
                <button
                  key={fig.id}
                  onClick={() => onSelectUnit(fig.id)}
                  aria-label={`${t('board.prison')}: ${fig.name}`}
                  className="relative flex flex-col items-center p-0.5 bg-white border-2 border-black opacity-90 hover:opacity-100 transition-all shadow-[2px_2px_0px_#000] min-h-[50px] md:min-h-[54px] cursor-pointer"
                >
                  <div className="w-8 h-8 md:w-9 md:h-9 border-2 border-black grayscale overflow-hidden bg-stone-900">
                    <img
                      src={fig.portraitUrl || CHAR_SVG_FALLBACKS[fig.key]}
                      alt={fig.shortName}
                      className="w-full h-full object-cover object-top"
                      onError={e => {
                        e.currentTarget.src = CHAR_SVG_FALLBACKS[fig.key] || '';
                      }}
                    />
                  </div>
                  <span className="text-[11px] md:text-xs font-black uppercase text-red-900 truncate max-w-full mt-0.5">
                    {fig.shortName}
                  </span>
                  <span className="absolute top-0 right-0 px-1 bg-red-700 text-white text-[9px] font-black border border-black">
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
