import React, { useState } from 'react';
import { GameState } from '../../../application/state/gameInitialState';
import {
  WHEEL_COLORS,
  WHEEL_TOTAL_SEGMENTS,
  getComputedFigureSegments,
  getFigureColorBreakdown,
  WheelColor,
} from '../../../domain/models/ShinobiFigure';
import { TACTICAL_SCROLLS_CATALOG, MAX_PLATE_CAPACITY } from '../../../domain/models/TacticalScroll';
import { SHINOBI_FIGURES_CATALOG } from '../../../domain/catalogs/ShinobiCatalog';
import { CHAR_SVG_FALLBACKS } from '../../../infrastructure/assets/animeAssets';
import { ChakraDiskSVG } from '../wheel/ChakraDiskSVG';
import { Play, BookOpen, Hammer, Lock, Sparkles } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { getLocalizedFigure, getLocalizedScroll } from '../../../infrastructure/i18n/locales/figureI18n';
import { NarutoMangaBackground } from '../common/NarutoMangaBackground';
import { shinobiDbRepository } from '../../../infrastructure/repositories/SupabaseShinobiRepository';
import { DEFAULT_STARTER_FIGURE_KEYS } from '../../../domain/models/ShinobiFigure';

interface ShinobiCodexProps {
  state: GameState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: React.Dispatch<any>;
  onBackToMenu: () => void;
  onPlayGame: () => void;
  onOpenForge?: () => void;
  onOpenGacha?: () => void;
}

export const ShinobiCodex: React.FC<ShinobiCodexProps> = ({
  state,
  dispatch,
  onBackToMenu,
  onPlayGame,
  onOpenForge,
  onOpenGacha,
}) => {
  const { t, language } = useTranslation();
  const profile = shinobiDbRepository.getProfile();
  const unlockedKeys = profile.unlockedFigureKeys || DEFAULT_STARTER_FIGURE_KEYS;
  const [selectedKey, setSelectedKey] = useState<string>('naruto');
  const [activeTab, setActiveTab] = useState<'catalog' | 'deck'>('catalog');

  const rawTemplate = SHINOBI_FIGURES_CATALOG.find(f => f.key === selectedKey) || SHINOBI_FIGURES_CATALOG[0];
  const selectedFigTemplate = getLocalizedFigure(rawTemplate, language);

  const custom = state.customizations[selectedFigTemplate.key] || {
    level: 1,
    clv: 0,
    lvTargetIndex: 0,
    clvTargetIndex: 0,
  };

  const previewFig = {
    ...selectedFigTemplate,
    id: `preview_${selectedFigTemplate.key}`,
    baseSegments: selectedFigTemplate.segments,
    level: custom.level,
    clv: custom.clv,
    lvTargetIndex: custom.lvTargetIndex,
    clvTargetIndex: custom.clvTargetIndex,
    evolved: false,
    status: null,
  };

  const computedSegs = getComputedFigureSegments(previewFig);
  const totals = getFigureColorBreakdown(computedSegs);

  // Deck cost calculation
  const currentPlateCost = state.selectedPlateIds.reduce((acc, pid) => {
    const tPlate = TACTICAL_SCROLLS_CATALOG.find(s => s.id === pid);
    return acc + (tPlate ? tPlate.cost : 1);
  }, 0);

  return (
    <div className="min-h-screen text-stone-900 flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none relative bg-transparent overflow-x-hidden">
      <NarutoMangaBackground />

      {/* 1. TOP OFFICIAL TOURNAMENT BAR - STANDARDIZED WITH MAIN MENU */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between p-3 md:px-5 md:py-2.5 border-3 border-black bg-[#111111] shadow-[4px_4px_0px_#000] flex-wrap gap-3 text-white relative z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="manga-btn-white px-3.5 py-2 min-h-[44px] text-xs md:text-sm font-bold uppercase tracking-wide border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fa9427] flex items-center"
          >
            ← {t('common.backToMenu')}
          </button>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 bg-[#FA9427] border-2 border-black flex items-center justify-center text-black font-kanji font-black text-lg shadow-[2px_2px_0px_#000]">
              書
            </span>
            <div>
              <h1 className="text-lg md:text-xl font-impact text-[#FA9427] tracking-wider uppercase leading-none drop-shadow-[1px_1px_0px_#000]">
                {t('codex.title')}
              </h1>
              <p className="text-[10px] text-stone-300 font-bold uppercase tracking-wider mt-0.5">
                BINGO BOOK • NIKKI SHINOBI
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <button
            onClick={onPlayGame}
            className="manga-btn-orange px-4 py-2 min-h-[44px] text-xs md:text-sm font-bold uppercase tracking-wide flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
          >
            <Play className="w-4 h-4 fill-current" /> {t('common.playNow')}
          </button>
        </div>
      </header>

      {/* 2. MAIN CENTER CARD - STANDARDIZED BORDER-4 BORDER-BLACK SHADOW-[8px_8px_0px_#000] */}
      <main className="max-w-6xl w-full mx-auto my-auto py-2 md:py-3 relative z-20 flex-1 flex flex-col">
        <div className="bg-white border-4 border-black overflow-hidden shadow-[8px_8px_0px_#000] flex-1 flex flex-col p-4 sm:p-5 md:p-6 relative">
          {/* Authentic Leaf Village Headband Metal Plate */}
          <div className="flex items-center justify-center mb-2">
            <div className="ninja-headband-plate px-7 py-1.5 flex items-center gap-3 border-2 border-black shadow-[2px_2px_0px_#111111]">
              <span className="w-2.5 h-2.5 bg-slate-800 shadow-inner" />
              <svg 
                className="w-8 h-8 text-slate-900 filter drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" 
                viewBox="0 0 36 36" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.8"
                aria-label="Emblema oficial de Konoha"
              >
                <path d="M21 19c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5z" />
                <path d="M21 19c0 5-4 9-9 9s-9-4-9-9 4-9 9-9c3.8 0 7.2 1.8 11 1.5l8-4.5-3.5 9.5C26 22 21 26 15 27" />
                <path d="M4 28l6-4" strokeLinecap="round" />
              </svg>
              <span className="w-2.5 h-2.5 bg-slate-800 shadow-inner" />
            </div>
          </div>

          {/* Title Header with Japanese Manga Typography */}
          <div className="text-center space-y-1 mb-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-black text-[#FA9427] font-kanji font-bold text-[11px] uppercase tracking-widest border border-black shadow-[2px_2px_0px_#FA9427]">
              <span>木ノ葉隠れの里 • 忍録鍛冶場</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-impact tracking-wider uppercase text-black drop-shadow-[2px_2px_0px_#FA9427] leading-none">
              SHINOBI CODEX & FORGE
            </h2>
          </div>

          {/* Navigation Tabs Bar */}
          <nav className="flex gap-2 mb-4 bg-stone-100 p-2.5 border-3 border-black shadow-[3px_3px_0px_#000]" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'catalog'}
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2.5 min-h-[44px] text-xs sm:text-sm font-bold uppercase tracking-wide transition border-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fa9427] ${
                activeTab === 'catalog'
                  ? 'bg-[#FA9427] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-stone-900 hover:text-black hover:bg-[#FA9427]/30 border-2 border-black shadow-[1px_1px_0px_#000]'
              }`}
            >
              {t('codex.tabCatalog')}
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'deck'}
              onClick={() => setActiveTab('deck')}
              className={`px-4 py-2.5 min-h-[44px] text-xs sm:text-sm font-bold uppercase tracking-wide transition border-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fa9427] ${
                activeTab === 'deck'
                  ? 'bg-[#FA9427] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-stone-900 hover:text-black hover:bg-[#FA9427]/30 border-2 border-black shadow-[1px_1px_0px_#000]'
              }`}
            >
              {t('codex.tabDeck')}
            </button>
          </nav>

          {/* Content Box */}
          <div className="bg-white text-stone-900 flex-1 overflow-y-auto pr-1">
            {activeTab === 'catalog' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Shinobi List Selector (4 Cols) */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="flex items-center gap-2 pb-1.5 border-b-3 border-black">
                    <span className="px-2 py-0.5 bg-black text-[#FA9427] font-impact text-xs uppercase tracking-wider border border-black shadow-[1px_1px_0px_#000]">
                      忍者
                    </span>
                    <h3 className="text-xs font-impact text-black uppercase tracking-widest">
                      {t('codex.officialFigures')} ({SHINOBI_FIGURES_CATALOG.length})
                    </h3>
                  </div>
                  <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                    {SHINOBI_FIGURES_CATALOG.map(figRaw => {
                      const fig = getLocalizedFigure(figRaw, language);
                      const isSelected = fig.key === selectedKey;
                      const isUnlocked = unlockedKeys.includes(fig.key);
                      const isInTeam = state.selectedTeamKeys.includes(fig.key);
                      return (
                        <button
                          key={fig.key}
                          onClick={() => setSelectedKey(fig.key)}
                          className={`w-full p-2.5 border-2 text-left flex items-center justify-between transition cursor-pointer ${
                            isSelected
                              ? 'bg-[#FA9427] text-black border-2 border-black shadow-[3px_3px_0px_#000]'
                              : !isUnlocked
                              ? 'bg-stone-50 text-stone-500 border-2 border-dashed border-stone-300 hover:bg-stone-100 shadow-[1px_1px_0px_#000]'
                              : 'bg-white text-stone-900 border-2 border-black hover:bg-stone-50 shadow-[2px_2px_0px_#000]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={fig.portraitUrl}
                                alt={fig.name}
                                className={`w-10 h-10 object-cover object-top border-2 border-black shrink-0 bg-stone-900 shadow-[1px_1px_0px_#000] ${!isUnlocked ? 'grayscale opacity-75' : ''}`}
                                onError={e => {
                                  e.currentTarget.src = CHAR_SVG_FALLBACKS[fig.key] || '';
                                }}
                              />
                              {!isUnlocked && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <Lock className="w-3.5 h-3.5 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="truncate">
                              <div className="text-sm font-bold uppercase tracking-wide truncate text-black">{fig.name}</div>
                              <div className="text-xs font-mono font-bold text-stone-800 flex items-center gap-2">
                                <span>[{fig.rarity}] • {fig.mp} MP</span>
                                {!isUnlocked ? (
                                  <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1 py-0.2 border border-amber-300">
                                    Bloqueado
                                  </span>
                                ) : figRaw.isStarter ? (
                                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1 py-0.2 border border-emerald-300">
                                    Inicial
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          {isInTeam && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-black text-[#FA9427] border border-black shrink-0 shadow-[1px_1px_0px_#000]">
                              {t('codex.inDeck')}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Shinobi Details & Forge (8 Cols) */}
                <div className="lg:col-span-8 bg-[#fff8ee] text-stone-900 p-4 md:p-6 border-3 border-black shadow-[4px_4px_0px_#000] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b-3 border-black pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedFigTemplate.portraitUrl}
                        alt={selectedFigTemplate.name}
                        className="w-16 h-16 object-cover object-top border-3 border-black bg-stone-900 shadow-[3px_3px_0px_#000]"
                        onError={e => {
                          e.currentTarget.src = CHAR_SVG_FALLBACKS[selectedFigTemplate.key] || '';
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-xs font-impact uppercase bg-[#fa9427] text-stone-950 border-2 border-black shadow-[2px_2px_0px_#000]">
                            {selectedFigTemplate.rarity}
                          </span>
                          <span className="text-xs font-impact uppercase text-stone-800">
                            {selectedFigTemplate.mp} {t('codex.movementPoints')}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-impact tracking-wide text-black uppercase mt-0.5">
                          {selectedFigTemplate.name}
                        </h3>
                        <p className="text-xs text-[#e77100] font-black">{selectedFigTemplate.archetype}</p>
                      </div>
                    </div>
                  </div>

                  {/* Lock Notice if Figure Not Unlocked */}
                  {!unlockedKeys.includes(selectedFigTemplate.key) && (
                    <div className="p-3 bg-amber-50 border-2 border-dashed border-amber-400 text-stone-900 flex items-center justify-between gap-3 shadow-[2px_2px_0px_#000]">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Este shinobi aún no está en tu colección. Desbloquéalo invocando en la Sala Gacha.</span>
                      </div>
                      {onOpenGacha && (
                        <button
                          onClick={onOpenGacha}
                          className="px-3 py-1.5 bg-[#FA9427] hover:bg-[#ffaa42] text-black font-impact text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer shrink-0"
                        >
                          Ir a Invocar →
                        </button>
                      )}
                    </div>
                  )}

                  {/* Link to Full Shinobi Forge */}
                  {onOpenForge && (
                    <button
                      onClick={onOpenForge}
                      className="w-full p-2.5 bg-gradient-to-r from-amber-400 to-[#FA9427] hover:brightness-105 text-black font-impact text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
                    >
                      <Hammer className="w-4 h-4" />
                      Ir a la Forja Ninja (Mejorar Nivel y ChLv con Polvos de Chakra) →
                    </button>
                  )}

                  {/* Level and CLv Forge Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white border-3 border-black text-xs shadow-[3px_3px_0px_#000]">
                    <div>
                      <div className="flex items-center justify-between font-bold text-xs sm:text-sm text-black uppercase tracking-wide mb-1.5">
                        <span>{t('codex.figureLevel', { level: custom.level })}</span>
                        <span className="text-stone-700 font-mono text-xs font-bold">
                          {t('codex.segmentsGain', { count: custom.level - 1 })}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(lv => (
                          <button
                            key={lv}
                            onClick={() =>
                              dispatch({
                                type: 'UPDATE_FIGURE_WORKSHOP',
                                payload: { ...custom, figKey: selectedFigTemplate.key, level: lv },
                              })
                            }
                            className={`flex-1 py-1 font-impact text-xs transition border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer ${
                              custom.level === lv
                                ? 'bg-[#fa9427] text-stone-950'
                                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            }`}
                          >
                            Lv.{lv}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between font-bold text-xs sm:text-sm text-black uppercase tracking-wide mb-1.5">
                        <span>{t('codex.chainLevel')}</span>
                        <span className="text-emerald-700 font-mono font-black text-sm">+{custom.clv} DMG</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_FIGURE_WORKSHOP',
                              payload: {
                                ...custom,
                                figKey: selectedFigTemplate.key,
                                clv: Math.max(0, custom.clv - 1),
                              },
                            })
                          }
                          className="px-3 py-1 bg-stone-100 hover:bg-stone-200 border-2 border-black font-impact text-sm shadow-[2px_2px_0px_#000] cursor-pointer"
                        >
                          -
                        </button>
                        <div className="flex-1 text-center font-mono font-black text-stone-950 bg-stone-100 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                          {t('codex.extraDamage', { count: custom.clv })}
                        </div>
                        <button
                          onClick={() =>
                            dispatch({
                              type: 'UPDATE_FIGURE_WORKSHOP',
                              payload: {
                                ...custom,
                                figKey: selectedFigTemplate.key,
                                clv: Math.min(10, custom.clv + 1),
                              },
                            })
                          }
                          className="px-3 py-1 bg-stone-100 hover:bg-stone-200 border-2 border-black font-impact text-sm shadow-[2px_2px_0px_#000] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Visual 96-segment Bar and Circular Wheel */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 flex justify-center bg-white p-3 border-3 border-black shadow-[3px_3px_0px_#000]">
                      <ChakraDiskSVG figure={previewFig} size={160} />
                    </div>

                    <div className="md:col-span-7 space-y-2">
                      <div className="text-xs font-impact text-black uppercase tracking-wider flex justify-between">
                        <span>{t('codex.wheelDistribution')}</span>
                        <span className="font-mono text-stone-600 font-bold">{t('codex.totalLabel')}: 96/96</span>
                      </div>
                      <div className="w-full h-3 flex border-2 border-black shadow-[2px_2px_0px_#000]">
                        {(['white', 'gold', 'purple', 'blue', 'red'] as WheelColor[]).map(cKey => {
                          const val = totals[cKey] || 0;
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

                      <div className="space-y-1 text-xs max-h-[160px] overflow-y-auto pr-1">
                        {computedSegs.map((seg, idx) => {
                          const col = WHEEL_COLORS[seg.color];
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (seg.color === 'red') return;
                                dispatch({
                                  type: 'UPDATE_FIGURE_WORKSHOP',
                                  payload: {
                                    ...custom,
                                    figKey: selectedFigTemplate.key,
                                    lvTargetIndex: idx,
                                    clvTargetIndex:
                                      seg.color === 'white' || seg.color === 'gold'
                                        ? idx
                                        : custom.clvTargetIndex,
                                  },
                                });
                              }}
                              className={`w-full flex items-center justify-between p-1.5 border-2 text-left transition cursor-pointer ${
                                custom.lvTargetIndex === idx
                                  ? 'bg-[#fff8ee] border-2 border-black font-black shadow-[2px_2px_0px_#000]'
                                  : 'bg-white border-2 border-black hover:bg-stone-50 shadow-[1px_1px_0px_#000]'
                              }`}
                            >
                              <span className="font-bold flex items-center gap-1.5 truncate text-stone-900">
                                <span
                                  className="w-3.5 h-3.5 border border-black shadow-[1px_1px_0px_#000]"
                                  style={{ background: col.fill }}
                                />
                                {seg.name}
                              </span>
                              <span className="font-mono font-black text-stone-950 shrink-0 text-[11px]">
                                {seg.color === 'white' || seg.color === 'gold'
                                  ? `${seg.power} DMG`
                                  : seg.color === 'purple'
                                  ? '★'.repeat(seg.stars)
                                  : seg.color.toUpperCase()}{' '}
                                • {seg.size}/96
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-900 bg-white p-3 border-2 border-black leading-relaxed shadow-[3px_3px_0px_#000]">
                    <strong className="text-red-700 font-impact uppercase tracking-wider text-sm">【 {t('codex.doctrine')} 】</strong> {selectedFigTemplate.ability}
                  </p>
                </div>
              </div>
            ) : (
              /* Deck Builder Tab */
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b-3 border-black">
                  <span className="px-2.5 py-0.5 bg-black text-[#FA9427] font-impact text-xs uppercase tracking-wider border border-black shadow-[2px_2px_0px_#000]">
                    {t('codex.deckConfigBadge')}
                  </span>
                  <h3 className="text-xl md:text-2xl font-impact text-black uppercase tracking-wide">
                    {t('codex.deckConfigTitle')}
                  </h3>
                </div>

                {/* Team Selection */}
                <div className="p-4 bg-[#fff8ee] text-stone-900 border-3 border-black shadow-[4px_4px_0px_#000] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-3 border-black pb-2">
                    <div>
                      <h4 className="text-sm font-impact text-black uppercase tracking-wider">
                        {t('codex.squadTitle', { count: state.selectedTeamKeys.length })}
                      </h4>
                      <p className="text-[11px] text-stone-700 font-medium">
                        {t('codex.squadDesc')}
                      </p>
                      {state.selectedTeamKeys.length < 6 && (
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 border border-amber-300">
                            {state.selectedTeamKeys.length}/6 Shinobis equipados
                          </span>
                          {onOpenGacha && (
                            <button
                              onClick={onOpenGacha}
                              className="text-xs text-[#FA9427] hover:underline font-impact uppercase tracking-wide cursor-pointer flex items-center gap-1"
                            >
                              <Sparkles className="w-3.5 h-3.5" /> Invocar nuevos ninjas en el Gacha →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SHINOBI_FIGURES_CATALOG.map(figRaw => {
                      const fig = getLocalizedFigure(figRaw, language);
                      const isUnlocked = unlockedKeys.includes(fig.key);
                      const inTeam = state.selectedTeamKeys.includes(fig.key);
                      return (
                        <button
                          key={fig.key}
                          disabled={!isUnlocked}
                          onClick={() => {
                            if (!isUnlocked) return;
                            let nextKeys = [...state.selectedTeamKeys];
                            if (inTeam) {
                              if (nextKeys.length <= 1) return;
                              nextKeys = nextKeys.filter(k => k !== fig.key);
                            } else {
                              if (nextKeys.length >= 6) nextKeys.shift();
                              nextKeys.push(fig.key);
                            }
                            dispatch({
                              type: 'UPDATE_DECK_LOADOUT',
                              payload: {
                                selectedTeamKeys: nextKeys,
                                selectedPlateIds: state.selectedPlateIds,
                              },
                            });
                          }}
                          className={`p-2.5 border-2 text-left flex items-center gap-2.5 transition ${
                            !isUnlocked
                              ? 'bg-stone-100 text-stone-400 border-dashed border-stone-300 cursor-not-allowed opacity-60'
                              : inTeam
                              ? 'bg-[#fa9427] text-stone-950 border-2 border-black font-black shadow-[2px_2px_0px_#000] cursor-pointer'
                              : 'bg-white text-stone-900 border-2 border-black hover:bg-stone-50 font-bold shadow-[2px_2px_0px_#000] cursor-pointer'
                          }`}
                        >
                          <div className="relative shrink-0">
                            <img
                              src={fig.portraitUrl}
                              alt={fig.shortName}
                              className={`w-9 h-9 object-cover object-top border-2 border-black shrink-0 bg-stone-900 shadow-[2px_2px_0px_#000] ${!isUnlocked ? 'grayscale' : ''}`}
                              onError={e => {
                                e.currentTarget.src = CHAR_SVG_FALLBACKS[fig.key] || '';
                              }}
                            />
                            {!isUnlocked && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Lock className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="truncate flex-1">
                            <div className="text-xs truncate font-impact uppercase tracking-wide flex items-center justify-between">
                              <span>{fig.shortName}</span>
                              {!isUnlocked && <span className="text-[9px] text-stone-500 font-bold">Bloqueado</span>}
                            </div>
                            <div className="text-[10px] font-mono font-bold text-stone-700">{fig.mp} MP</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Plates Selection */}
                <div className="p-4 bg-[#fff8ee] text-stone-900 border-3 border-black shadow-[4px_4px_0px_#000] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-3 border-black pb-2">
                    <div>
                      <h4 className="text-sm font-impact text-black uppercase tracking-wider">
                        {t('codex.platesTitle', { cost: currentPlateCost, max: MAX_PLATE_CAPACITY })}
                      </h4>
                      <p className="text-[11px] text-stone-700 font-medium">
                        {t('codex.platesDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {TACTICAL_SCROLLS_CATALOG.map(scRaw => {
                      const sc = getLocalizedScroll(scRaw, language);
                      const isEquipped = state.selectedPlateIds.includes(sc.id);
                      return (
                        <button
                          key={sc.id}
                          onClick={() => {
                            let nextPlates = [...state.selectedPlateIds];
                            if (isEquipped) {
                              nextPlates = nextPlates.filter(id => id !== sc.id);
                            } else if (currentPlateCost + sc.cost <= MAX_PLATE_CAPACITY) {
                              nextPlates.push(sc.id);
                            }
                            dispatch({
                              type: 'UPDATE_DECK_LOADOUT',
                              payload: {
                                selectedTeamKeys: state.selectedTeamKeys,
                                selectedPlateIds: nextPlates,
                              },
                            });
                          }}
                          className={`p-3 border-2 text-left flex flex-col justify-between transition cursor-pointer ${
                            isEquipped
                              ? 'bg-emerald-100 text-emerald-950 border-2 border-black font-black shadow-[3px_3px_0px_#000]'
                              : 'bg-white text-stone-900 border-2 border-black hover:bg-stone-50 font-bold shadow-[2px_2px_0px_#000]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-impact uppercase tracking-wide text-xs text-stone-950">
                              {sc.kanji} {sc.name}
                            </span>
                            <span className="px-1.5 py-0.5 bg-stone-100 text-stone-900 text-[10px] font-mono font-bold border border-black shadow-[1px_1px_0px_#000]">
                              {t('codex.costLabel', { cost: sc.cost })}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-700 leading-snug font-medium">{sc.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. BOTTOM OFFICIAL TOURNAMENT BAR - STANDARDIZED WITH MAIN MENU */}
      <footer className="max-w-6xl w-full mx-auto bg-[#111111] text-white p-2 md:px-4 border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between text-[11px] font-bold tracking-wider relative z-20 flex-wrap gap-2 mt-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-[#FA9427]" />
          <span className="text-stone-300 uppercase">
            REGISTRO OFICIAL SHINOBI • CATÁLOGO & FORJA
          </span>
        </div>
        <div className="text-amber-400 font-mono text-[10px]">
          SISTEMA SHINOBI DUEL • V1.0 CANONICAL
        </div>
      </footer>
    </div>
  );
};
