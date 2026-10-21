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
import { SHINOBI_FIGURES_CATALOG } from '../../../infrastructure/repositories/MockShinobiRepository';
import { CHAR_SVG_FALLBACKS } from '../../../infrastructure/assets/animeAssets';
import { ChakraDiskSVG } from '../wheel/ChakraDiskSVG';
import { Play } from 'lucide-react';

interface ShinobiCodexProps {
  state: GameState;
  dispatch: React.Dispatch<any>;
  onBackToMenu: () => void;
  onPlayGame: () => void;
}

export const ShinobiCodex: React.FC<ShinobiCodexProps> = ({
  state,
  dispatch,
  onBackToMenu,
  onPlayGame,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>('naruto');
  const [activeTab, setActiveTab] = useState<'catalog' | 'deck'>('catalog');

  const selectedFigTemplate = SHINOBI_FIGURES_CATALOG.find(f => f.key === selectedKey) || SHINOBI_FIGURES_CATALOG[0];
  const custom = state.customizations[selectedFigTemplate.key] || {
    level: 5,
    clv: 1,
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
    const t = TACTICAL_SCROLLS_CATALOG.find(s => s.id === pid);
    return acc + (t ? t.cost : 1);
  }, 0);

  return (
    <div className="min-h-screen bg-[#140e0a] text-stone-100 flex flex-col p-3 md:p-6">
      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToMenu}
            className="px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold border border-stone-700 transition"
          >
            ← Volver al Menú
          </button>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-sm bg-amber-600 border border-amber-300 flex items-center justify-center text-stone-950 font-kanji font-black text-xs">
              書
            </span>
            <h1 className="text-sm md:text-base font-black text-amber-400 uppercase tracking-wide">
              LIBRO BINGO & FORJA SHINOBI (CATÁLOGO OFICIAL)
            </h1>
          </div>
        </div>
        <button
          onClick={onPlayGame}
          className="px-4 py-1.5 rounded bg-red-800 hover:bg-red-700 text-amber-100 text-xs font-black uppercase tracking-wider border border-amber-500 shadow transition flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" /> Jugar en Arena
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto my-4 flex-1 flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-4 bg-stone-900/90 p-2 rounded-lg border border-stone-800">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded text-xs font-bold transition ${
              activeTab === 'catalog'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200'
            }`}
          >
            Catálogo y Forja (Lv.1-5 & CLv)
          </button>
          <button
            onClick={() => setActiveTab('deck')}
            className={`px-4 py-2 rounded text-xs font-bold transition ${
              activeTab === 'deck'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200'
            }`}
          >
            Configuración de Mazo (6 Figuras & 6 Costes)
          </button>
        </div>

        {/* Content Box */}
        <div className="shadow-2xl flex-1 flex flex-col">
          <div className="h-2.5 bg-gradient-to-r from-amber-700 via-[#281b12] to-amber-700 rounded-t border-b-2 border-stone-950" />
          <div className="bg-[#f4ebd9] text-stone-900 p-5 md:p-8 border-x-4 border-[#281b12] flex-1 overflow-y-auto">
            {activeTab === 'catalog' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Shinobi List Selector (4 Cols) */}
                <div className="lg:col-span-4 space-y-2">
                  <h2 className="text-xs font-black text-red-900 uppercase tracking-widest border-b border-stone-800/20 pb-1">
                    Figuras Oficiales ({SHINOBI_FIGURES_CATALOG.length})
                  </h2>
                  <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                    {SHINOBI_FIGURES_CATALOG.map(fig => {
                      const isSelected = fig.key === selectedKey;
                      const isInTeam = state.selectedTeamKeys.includes(fig.key);
                      return (
                        <button
                          key={fig.key}
                          onClick={() => setSelectedKey(fig.key)}
                          className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition ${
                            isSelected
                              ? 'bg-stone-900 text-amber-300 border-amber-500 shadow-md ring-2 ring-amber-500/50'
                              : 'bg-stone-950/70 text-stone-100 border-stone-700 hover:bg-stone-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={fig.portraitUrl}
                              alt={fig.name}
                              className="w-10 h-10 rounded object-cover object-top border border-amber-500 shrink-0 bg-stone-800"
                              onError={e => {
                                e.currentTarget.src = CHAR_SVG_FALLBACKS[fig.key] || '';
                              }}
                            />
                            <div className="truncate">
                              <div className="text-xs font-black truncate">{fig.name}</div>
                              <div className="text-[10px] text-amber-400 font-mono">
                                [{fig.rarity}] • {fig.mp} MP
                              </div>
                            </div>
                          </div>
                          {isInTeam && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-600 text-stone-950 shrink-0">
                              En Mazo
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Shinobi Details & Forge (8 Cols) */}
                <div className="lg:col-span-8 bg-stone-900 text-stone-100 p-4 md:p-6 rounded-xl border-2 border-amber-600 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-700 pb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedFigTemplate.portraitUrl}
                        alt={selectedFigTemplate.name}
                        className="w-14 h-14 rounded-lg object-cover object-top border-2 border-amber-500 bg-stone-800 shadow"
                        onError={e => {
                          e.currentTarget.src = CHAR_SVG_FALLBACKS[selectedFigTemplate.key] || '';
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-xs font-black bg-amber-500 text-stone-950 rounded">
                            {selectedFigTemplate.rarity}
                          </span>
                          <span className="text-xs font-bold text-amber-400">
                            {selectedFigTemplate.mp} Puntos de Movimiento (MP)
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-white">{selectedFigTemplate.name}</h3>
                        <p className="text-xs text-amber-200/90 font-bold">{selectedFigTemplate.archetype}</p>
                      </div>
                    </div>
                  </div>

                  {/* Level and CLv Forge Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-stone-950 border border-stone-800 text-xs">
                    <div>
                      <div className="flex items-center justify-between font-bold text-amber-300 mb-1.5">
                        <span>Nivel de Figura (Lv.{custom.level}/5):</span>
                        <span className="text-stone-400 font-normal">+{custom.level - 1} segmentos</span>
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
                            className={`flex-1 py-1 rounded font-black text-xs transition ${
                              custom.level === lv
                                ? 'bg-amber-500 text-stone-950 shadow'
                                : 'bg-stone-800 text-stone-400 hover:text-white'
                            }`}
                          >
                            Lv.{lv}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between font-bold text-emerald-300 mb-1.5">
                        <span>Nivel de Cadena (CLv):</span>
                        <span className="text-white font-mono font-black">+{custom.clv} DMG</span>
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
                          className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 font-bold text-sm"
                        >
                          -
                        </button>
                        <div className="flex-1 text-center font-mono font-black text-amber-300 bg-stone-900 py-1 rounded border border-stone-700">
                          +{custom.clv} Daño Extra
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
                          className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Visual 96-segment Bar and Circular Wheel */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 flex justify-center bg-stone-950/70 p-3 rounded-lg border border-stone-800">
                      <ChakraDiskSVG figure={previewFig} size={160} />
                    </div>

                    <div className="md:col-span-7 space-y-2">
                      <div className="text-xs font-bold text-amber-300 flex justify-between">
                        <span>Distribución Asimétrica (96 Segmentos)</span>
                        <span className="font-mono text-stone-400">Total: 96/96</span>
                      </div>
                      <div className="w-full h-3 rounded overflow-hidden flex border border-stone-700">
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

                      <div className="space-y-1 text-xs">
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
                              className={`w-full flex items-center justify-between p-1.5 rounded text-left border transition ${
                                custom.lvTargetIndex === idx
                                  ? 'bg-amber-950/80 border-amber-500'
                                  : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                              }`}
                            >
                              <span className="font-bold flex items-center gap-1.5 truncate">
                                <span
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{ background: col.fill }}
                                />
                                {seg.name}
                              </span>
                              <span className="font-mono font-black text-amber-400 shrink-0 text-[11px]">
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

                  <p className="text-xs text-stone-300 bg-stone-950 p-2.5 rounded border border-stone-800 leading-relaxed">
                    <strong>Doctrina:</strong> {selectedFigTemplate.ability}
                  </p>
                </div>
              </div>
            ) : (
              /* Deck Builder Tab */
              <div className="space-y-6">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    CONFIGURADOR TÁCTICO DE BATALLA
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    Mazo de 6 Shinobis y 6 Puntos de Pergaminos Tácticos
                  </h2>
                </div>

                {/* Team Selection */}
                <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border-2 border-amber-600 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-700 pb-2">
                    <div>
                      <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                        1. Escuadrón Konoha ({state.selectedTeamKeys.length}/6 Shinobis)
                      </h3>
                      <p className="text-[11px] text-stone-300">
                        Haz clic en una figura para alternar su inclusión en tu mazo activo.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SHINOBI_FIGURES_CATALOG.map(fig => {
                      const inTeam = state.selectedTeamKeys.includes(fig.key);
                      return (
                        <button
                          key={fig.key}
                          onClick={() => {
                            let nextKeys = [...state.selectedTeamKeys];
                            if (inTeam) {
                              if (nextKeys.length <= 6) return; // Keep at least 6
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
                          className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition ${
                            inTeam
                              ? 'bg-amber-600 text-stone-950 border-amber-300 font-bold shadow'
                              : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
                          }`}
                        >
                          <img
                            src={fig.portraitUrl}
                            alt={fig.shortName}
                            className="w-8 h-8 rounded object-cover object-top border border-stone-800 shrink-0"
                            onError={e => {
                              e.currentTarget.src = CHAR_SVG_FALLBACKS[fig.key] || '';
                            }}
                          />
                          <div className="truncate">
                            <div className="text-xs truncate font-black">{fig.shortName}</div>
                            <div className="text-[10px] font-mono">{fig.mp} MP</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Plates Selection */}
                <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border-2 border-amber-600 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-700 pb-2">
                    <div>
                      <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                        2. Pergaminos Tácticos (Capacidad: {currentPlateCost} / {MAX_PLATE_CAPACITY} Costes)
                      </h3>
                      <p className="text-[11px] text-stone-300">
                        Goal Block y Max Revive consumen 2 puntos de capacidad; las demás consumen 1 punto.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {TACTICAL_SCROLLS_CATALOG.map(sc => {
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
                          className={`p-3 rounded-lg border text-left flex flex-col justify-between transition ${
                            isEquipped
                              ? 'bg-emerald-950/80 text-emerald-200 border-emerald-400 shadow'
                              : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-xs text-white">
                              {sc.kanji} {sc.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-stone-900 text-amber-300 text-[10px] font-mono">
                              Coste {sc.cost}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-300 leading-snug">{sc.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="h-2.5 bg-gradient-to-r from-amber-700 via-[#281b12] to-amber-700 rounded-b border-t-2 border-stone-950" />
        </div>
      </main>
    </div>
  );
};
