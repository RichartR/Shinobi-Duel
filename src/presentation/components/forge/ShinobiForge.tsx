import React, { useState, useEffect } from 'react';
import { 
  Hammer, 
  Sparkles, 
  Trash2, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  Play,
  RotateCcw,
  Info,
  Gift,
  Lock
} from 'lucide-react';
import { GameState } from '../../../application/state/gameInitialState';
import { 
  WHEEL_COLORS, 
  getComputedFigureSegments,
  getFigureColorBreakdown,
  DEFAULT_STARTER_FIGURE_KEYS
} from '../../../domain/models/ShinobiFigure';
import { 
  FigureRarity, 
  LEVEL_UP_COSTS, 
  CLV_UPGRADE_COST, 
  DISENCHANT_YIELD,
  ChakraDustInventory 
} from '../../../domain/models/CraftingEconomy';
import { 
  shinobiDbRepository, 
  UserShinobiProfile 
} from '../../../infrastructure/repositories/SupabaseShinobiRepository';
import { SHINOBI_FIGURES_CATALOG } from '../../../domain/catalogs/ShinobiCatalog';
import { CHAR_SVG_FALLBACKS } from '../../../infrastructure/assets/animeAssets';
import { ChakraDiskSVG } from '../wheel/ChakraDiskSVG';
import { soundEngine } from '../../../infrastructure/audio/ShinobiAudioEngine';
import { useTranslation } from '../../context/I18nContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { NarutoMangaBackground } from '../common/NarutoMangaBackground';
import { getLocalizedFigure } from '../../../infrastructure/i18n/locales/figureI18n';

interface ShinobiForgeProps {
  state: GameState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: React.Dispatch<any>;
  onBackToMenu: () => void;
  onPlayGame: () => void;
  onOpenGacha?: () => void;
}

const RARITY_BADGE_STYLES: Record<FigureRarity, { bg: string; text: string; border: string; label: string }> = {
  C: { bg: 'bg-stone-200', text: 'text-stone-800', border: 'border-stone-400', label: 'Común' },
  UC: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-500', label: 'Infrecuente' },
  R: { bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-500', label: 'Raro' },
  EX: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-500', label: 'Élite EX' },
  UX: { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-500', label: 'Ultra UX' },
};

const DUST_BADGE_INFO: Record<keyof ChakraDustInventory, { name: string; color: string; bg: string; text: string }> = {
  c: { name: 'Polvo C', color: '#78716c', bg: 'bg-stone-200', text: 'text-stone-800' },
  uc: { name: 'Polvo UC', color: '#10b981', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  r: { name: 'Polvo R', color: '#0284c7', bg: 'bg-sky-100', text: 'text-sky-800' },
  ex: { name: 'Polvo EX', color: '#9333ea', bg: 'bg-purple-100', text: 'text-purple-800' },
  ux: { name: 'Polvo UX', color: '#f59e0b', bg: 'bg-amber-200', text: 'text-amber-900' },
};

export const ShinobiForge: React.FC<ShinobiForgeProps> = ({
  state,
  dispatch,
  onBackToMenu,
  onPlayGame,
  onOpenGacha,
}) => {
  const { t, language } = useTranslation();
  const [profile, setProfile] = useState<UserShinobiProfile>(() => shinobiDbRepository.getProfile());
  const [selectedFigKey, setSelectedFigKey] = useState<string>('naruto');
  const [activeTab, setActiveTab] = useState<'forge' | 'disenchant'>('forge');
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Selected figure template
  const rawTemplate = SHINOBI_FIGURES_CATALOG.find(f => f.key === selectedFigKey) || SHINOBI_FIGURES_CATALOG[0];
  const selectedFig = getLocalizedFigure(rawTemplate, language);

  const custom = state.customizations[selectedFig.key] || {
    level: 1,
    clv: 0,
    lvTargetIndex: 0,
    clvTargetIndex: 0,
  };

  const previewFig = {
    ...selectedFig,
    id: `forge_preview_${selectedFig.key}`,
    baseSegments: selectedFig.segments,
    level: custom.level,
    clv: custom.clv,
    lvTargetIndex: custom.lvTargetIndex,
    clvTargetIndex: custom.clvTargetIndex,
    evolved: false,
    status: null,
  };

  const computedSegs = getComputedFigureSegments(previewFig);
  const totals = getFigureColorBreakdown(computedSegs);

  // Sync profile to localStorage on changes
  useEffect(() => {
    shinobiDbRepository.saveProfile(profile);
  }, [profile]);

  const showNotification = (text: string, type: 'success' | 'error') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  // Reclaim test supplies for smooth progression testing
  const handleClaimFreeSupplies = () => {
    soundEngine.play('win');
    const updated: UserShinobiProfile = {
      ...profile,
      ryoCoins: profile.ryoCoins + 3000,
      chakraGems: profile.chakraGems + 100,
      dust: {
        c: profile.dust.c + 50,
        uc: profile.dust.uc + 40,
        r: profile.dust.r + 30,
        ex: profile.dust.ex + 20,
        ux: profile.dust.ux + 10,
      },
    };
    setProfile(updated);
    shinobiDbRepository.saveProfile(updated);
    showNotification('¡Suministros de entrenamiento ninja acreditados (+3,000 🪙 y Polvos de Chakra)!', 'success');
  };

  const unlockedKeys = profile.unlockedFigureKeys || DEFAULT_STARTER_FIGURE_KEYS;
  const isFigureUnlocked = unlockedKeys.includes(selectedFig.key);

  // Upgrading level (1 -> 5)
  const targetLevel = custom.level + 1;
  const levelUpCost = targetLevel <= 5 ? LEVEL_UP_COSTS[targetLevel] : null;
  const dustKey = selectedFig.rarity.toLowerCase() as keyof ChakraDustInventory;
  const availableDustForFigure = profile.dust[dustKey] || 0;

  const canLevelUpResult = !isFigureUnlocked
    ? { allowed: false, reason: 'Figura no desbloqueada (obtener en Gacha)' }
    : targetLevel <= 5 
    ? shinobiDbRepository.canLevelUp(profile, selectedFig.rarity as FigureRarity, targetLevel)
    : { allowed: false, reason: 'Nivel Máximo (Lv 5)' };

  const handleLevelUp = () => {
    if (!canLevelUpResult.allowed || !levelUpCost) {
      soundEngine.play('ko');
      showNotification(canLevelUpResult.reason || 'No se puede mejorar el nivel', 'error');
      return;
    }

    const consume = shinobiDbRepository.consumeLevelUpCost(profile, selectedFig.rarity as FigureRarity, targetLevel);
    if (!consume.success) {
      soundEngine.play('ko');
      showNotification(consume.error || 'Error en la forja', 'error');
      return;
    }

    soundEngine.play('forge');
    setProfile(consume.updatedProfile);

    dispatch({
      type: 'UPDATE_FIGURE_WORKSHOP',
      payload: {
        ...custom,
        figKey: selectedFig.key,
        level: targetLevel,
      },
    });

    showNotification(`¡Forja completada! ${selectedFig.name} ascendió a Nivel ${targetLevel}. +1 Segmento de Ruleta.`, 'success');
  };

  // Upgrading Chakra Level (0 -> 10)
  const canChLvUpResult = !isFigureUnlocked
    ? { allowed: false, reason: 'Figura no desbloqueada (obtener en Gacha)' }
    : shinobiDbRepository.canUpgradeChLv(profile, selectedFig.rarity as FigureRarity, custom.clv);

  const handleUpgradeChLv = () => {
    if (!canChLvUpResult.allowed) {
      soundEngine.play('ko');
      showNotification(canChLvUpResult.reason || 'No se puede subir el Nivel de Chakra', 'error');
      return;
    }

    const consume = shinobiDbRepository.consumeChLvCost(profile, selectedFig.rarity as FigureRarity, custom.clv);
    if (!consume.success) {
      soundEngine.play('ko');
      showNotification(consume.error || 'Error al infundir Chakra', 'error');
      return;
    }

    soundEngine.play('forge');
    setProfile(consume.updatedProfile);

    const nextClv = custom.clv + 1;
    dispatch({
      type: 'UPDATE_FIGURE_WORKSHOP',
      payload: {
        ...custom,
        figKey: selectedFig.key,
        clv: nextClv,
      },
    });

    showNotification(`¡Chakra Infundido! Nivel de Chakra subió a ChLv +${nextClv} (+${nextClv} daño de desempate).`, 'success');
  };

  // Reset figure to base Lv.1 & ChLv 0
  const handleResetFigure = () => {
    if (!isFigureUnlocked) return;
    soundEngine.play('select');
    dispatch({
      type: 'UPDATE_FIGURE_WORKSHOP',
      payload: {
        figKey: selectedFig.key,
        level: 1,
        clv: 0,
        lvTargetIndex: 0,
        clvTargetIndex: 0,
      },
    });
    showNotification(`¡${selectedFig.name} restablecido a Nivel 1 y ChLv 0!`, 'success');
  };

  // Reset all figures to base Lv.1 & ChLv 0
  const handleResetAllFigures = () => {
    soundEngine.play('select');
    dispatch({ type: 'RESET_ALL_FIGURE_WORKSHOP' });
    showNotification('¡Todas las figuras han sido restablecidas a Nivel 1 y ChLv 0!', 'success');
  };

  // Disenchant figure for dust & ryo
  const handleDisenchant = (rarity: FigureRarity) => {
    soundEngine.play('jutsu');
    const result = shinobiDbRepository.disenchantFigure(profile, rarity);
    setProfile(result.updatedProfile);
    showNotification(
      `¡Rollo desencantado! Obtuviste +${result.gainedDust} Polvos ${rarity} y +${result.gainedRyo} 🪙 Ryo.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen text-stone-900 flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none relative bg-transparent overflow-x-hidden">
      <NarutoMangaBackground />

      {/* 1. TOP OFFICIAL TOURNAMENT BAR */}
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
              鍛
            </span>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-impact text-[#FA9427] tracking-wider uppercase leading-none drop-shadow-[1px_1px_0px_#000]">
                FORJA SHINOBI & POLVOS DE CHAKRA
              </h1>
              <p className="text-[10px] text-stone-300 font-bold uppercase tracking-wider mt-0.5">
                KAZA SHINOBI • MEJORAS DE COMBATE (NV. 1-5 & CHLV)
              </p>
            </div>
          </div>
        </div>

        {/* Resources Badges & Free Supplies Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Ryo & Gems */}
          <div className="flex items-center gap-2 bg-stone-900 px-2.5 py-1.5 min-h-[44px] border-2 border-black shadow-[2px_2px_0px_#FA9427]">
            <span className="text-xs sm:text-sm font-black text-amber-400">🪙 {profile.ryoCoins.toLocaleString()}</span>
            <span className="text-stone-500">|</span>
            <span className="text-xs sm:text-sm font-black text-cyan-400">💎 {profile.chakraGems.toLocaleString()}</span>
          </div>

          <button
            onClick={handleClaimFreeSupplies}
            className="px-2.5 py-2 min-h-[44px] bg-[#FA9427] hover:bg-[#ffaa42] text-black font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
            title="Recargar suministros de entrenamiento"
          >
            <Gift className="w-3.5 h-3.5" /> +Suministros
          </button>

          <button
            onClick={handleResetAllFigures}
            className="px-2.5 py-2 min-h-[44px] bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
            title="Restablecer todas las figuras a Nivel 1 y ChLv 0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Nv.1
          </button>

          <LanguageSwitcher compact />
          <button
            onClick={onPlayGame}
            className="manga-btn-orange px-3 py-1.5 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> {t('common.playNow')}
          </button>
        </div>
      </header>

      {/* Chakra Dust Inventory Strip */}
      <div className="max-w-6xl w-full mx-auto mt-2 bg-stone-900 text-white p-2.5 border-3 border-black shadow-[3px_3px_0px_#000] relative z-20 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs font-impact uppercase text-stone-300">
          <Sparkles className="w-4 h-4 text-[#FA9427]" />
          <span>INVENTARIO DE POLVOS DE CHAKRA:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
          {(['c', 'uc', 'r', 'ex', 'ux'] as Array<keyof ChakraDustInventory>).map(k => {
            const info = DUST_BADGE_INFO[k];
            const amount = profile.dust[k] || 0;
            return (
              <div 
                key={k} 
                className={`px-2.5 py-0.5 border border-black shadow-[1px_1px_0px_#000] flex items-center gap-1.5 ${info.bg} ${info.text}`}
              >
                <span className="font-mono font-black uppercase text-[10px]">{info.name}:</span>
                <span className="font-black text-xs">{amount}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className={`max-w-6xl w-full mx-auto mt-2 p-2.5 border-3 border-black shadow-[4px_4px_0px_#000] text-xs sm:text-sm font-bold flex items-center gap-2 relative z-30 transition-all ${
          feedbackMessage.type === 'success' ? 'bg-emerald-300 text-stone-950' : 'bg-red-400 text-stone-950'
        }`}>
          {feedbackMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* 2. MAIN CENTER CARD */}
      <main className="max-w-6xl w-full mx-auto my-auto py-2 md:py-3 relative z-20 flex-1 flex flex-col">
        <div className="bg-white border-4 border-black overflow-hidden shadow-[8px_8px_0px_#000] flex-1 flex flex-col p-4 sm:p-5 md:p-6 relative">
          
          {/* Tab Navigation */}
          <nav className="flex gap-2 mb-4 bg-stone-100 p-2.5 border-3 border-black shadow-[3px_3px_0px_#000]" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'forge'}
              onClick={() => {
                soundEngine.play('select');
                setActiveTab('forge');
              }}
              className={`px-4 py-2 min-h-[44px] text-xs sm:text-sm font-bold uppercase tracking-wide transition border-2 cursor-pointer flex items-center gap-2 ${
                activeTab === 'forge'
                  ? 'bg-[#FA9427] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-stone-900 hover:bg-[#FA9427]/30 border-2 border-black shadow-[1px_1px_0px_#000]'
              }`}
            >
              <Hammer className="w-4 h-4" />
              Forja de Atributos (Nv. 1-5 & ChLv)
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'disenchant'}
              onClick={() => {
                soundEngine.play('select');
                setActiveTab('disenchant');
              }}
              className={`px-4 py-2 min-h-[44px] text-xs sm:text-sm font-bold uppercase tracking-wide transition border-2 cursor-pointer flex items-center gap-2 ${
                activeTab === 'disenchant'
                  ? 'bg-[#FA9427] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-stone-900 hover:bg-[#FA9427]/30 border-2 border-black shadow-[1px_1px_0px_#000]'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Desencantar Rollos (Obtener Polvos)
            </button>
          </nav>

          {/* TAB 1: FORGE & UPGRADES */}
          {activeTab === 'forge' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start flex-1 overflow-y-auto">
              
              {/* Figure Selector List (4 Cols) */}
              <div className="lg:col-span-4 space-y-2">
                <div className="flex items-center gap-2 pb-1 border-b-2 border-black">
                  <span className="px-2 py-0.5 bg-black text-[#FA9427] font-impact text-xs uppercase">
                    SELECCIONAR
                  </span>
                  <h3 className="text-xs font-impact uppercase tracking-wider text-black">
                    FIGURAS DISPONIBLES ({SHINOBI_FIGURES_CATALOG.length})
                  </h3>
                </div>

                <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                  {SHINOBI_FIGURES_CATALOG.map(raw => {
                    const fig = getLocalizedFigure(raw, language);
                    const isSelected = fig.key === selectedFigKey;
                    const isFigUnlocked = unlockedKeys.includes(fig.key);
                    const isStarter = DEFAULT_STARTER_FIGURE_KEYS.includes(fig.key);
                    const figCustom = state.customizations[fig.key] || { level: 1, clv: 0 };
                    const rStyle = RARITY_BADGE_STYLES[fig.rarity as FigureRarity] || RARITY_BADGE_STYLES.C;

                    return (
                      <button
                        key={fig.key}
                        onClick={() => {
                          soundEngine.play('select');
                          setSelectedFigKey(fig.key);
                        }}
                        className={`w-full p-2 border-2 text-left flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#FA9427] text-black border-2 border-black shadow-[3px_3px_0px_#000]'
                            : isFigUnlocked
                            ? 'bg-white text-stone-900 border-2 border-black hover:bg-stone-50 shadow-[1px_1px_0px_#000]'
                            : 'bg-stone-100 text-stone-700 border-2 border-stone-400 hover:bg-stone-200 shadow-[1px_1px_0px_#000]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={fig.portraitUrl}
                              alt={fig.name}
                              className={`w-10 h-10 object-cover object-top border-2 border-black bg-stone-900 shadow-[1px_1px_0px_#000] ${
                                !isFigUnlocked ? 'grayscale contrast-75 brightness-75' : ''
                              }`}
                              onError={e => {
                                e.currentTarget.src = CHAR_SVG_FALLBACKS[fig.key] || '';
                              }}
                            />
                            {!isFigUnlocked && (
                              <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                                <Lock className="w-4 h-4 text-white drop-shadow" />
                              </div>
                            )}
                          </div>
                          <div className="truncate">
                            <div className="text-xs sm:text-sm font-bold uppercase truncate">{fig.name}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`text-[9px] font-bold px-1.5 py-0.2 border ${rStyle.bg} ${rStyle.text} ${rStyle.border}`}>
                                {fig.rarity}
                              </span>
                              {isFigUnlocked ? (
                                <>
                                  {isStarter && (
                                    <span className="text-[9px] font-bold px-1 py-0.2 bg-amber-200 text-amber-900 border border-amber-400">
                                      Inicial
                                    </span>
                                  )}
                                  <span className="text-[10px] font-mono font-bold text-stone-700">
                                    Nv.{figCustom.level} • ChLv +{figCustom.clv}
                                  </span>
                                </>
                              ) : (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-stone-800 text-stone-300 border border-black flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5 text-stone-400" />
                                  Bloqueado
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-black' : 'text-stone-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Forge Workspace & Wheel Customization (8 Cols) */}
              <div className="lg:col-span-8 bg-[#fff8ee] text-stone-900 p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0px_#000] space-y-4">
                
                {/* Shinobi Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedFig.portraitUrl}
                      alt={selectedFig.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover object-top border-3 border-black bg-stone-900 shadow-[2px_2px_0px_#000]"
                      onError={e => {
                        e.currentTarget.src = CHAR_SVG_FALLBACKS[selectedFig.key] || '';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-impact uppercase bg-[#FA9427] text-stone-950 border-2 border-black shadow-[1px_1px_0px_#000]">
                          {selectedFig.rarity}
                        </span>
                        <span className="text-xs font-impact uppercase text-stone-800">
                          {selectedFig.mp} {t('codex.movementPoints')}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-impact tracking-wide text-black uppercase mt-0.5">
                        {selectedFig.name}
                      </h3>
                      <p className="text-xs text-[#e77100] font-black">{selectedFig.archetype}</p>
                    </div>
                  </div>

                  {/* Level & ChLv Status Badges */}
                  <div className="flex flex-col gap-1.5 items-end">
                    <span className="px-3 py-1 bg-black text-[#FA9427] font-impact text-xs tracking-wider border border-black shadow-[2px_2px_0px_#000]">
                      NIVEL {custom.level} / 5
                    </span>
                    <span className="px-3 py-1 bg-emerald-600 text-white font-impact text-xs tracking-wider border border-black shadow-[2px_2px_0px_#000]">
                      CHAKRA ChLv +{custom.clv} DMG
                    </span>
                    {isFigureUnlocked && (custom.level > 1 || custom.clv > 0) && (
                      <button
                        onClick={handleResetFigure}
                        className="px-2 py-0.5 bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 text-[10px] font-bold uppercase border border-stone-400 hover:border-red-500 flex items-center gap-1 cursor-pointer active:scale-95 transition-all shadow-[1px_1px_0px_#000]"
                        title="Restablecer esta figura a Nivel 1 y ChLv 0"
                      >
                        <RotateCcw className="w-3 h-3" /> Restablecer Nv.1
                      </button>
                    )}
                  </div>
                </div>

                {!isFigureUnlocked && (
                  <div className="p-3 bg-stone-900 border-2 border-black text-white flex items-center justify-between gap-3 shadow-[2px_2px_0px_#000]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-stone-800 border border-stone-600 shrink-0">
                        <Lock className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="font-impact uppercase tracking-wider text-xs sm:text-sm text-[#FA9427]">
                          FIGURA BLOQUEADA
                        </div>
                        <p className="text-[11px] sm:text-xs text-stone-300">
                          No posees esta figura en tu alineación. Puedes desbloquearla abriendo pergaminos en el Gacha.
                        </p>
                      </div>
                    </div>
                    {onOpenGacha && (
                      <button
                        onClick={onOpenGacha}
                        className="px-3 py-1.5 bg-[#FA9427] hover:bg-[#ffaa42] text-black font-impact text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer whitespace-nowrap active:scale-95 transition-all"
                      >
                        Ir al Gacha →
                      </button>
                    )}
                  </div>
                )}

                {/* TWO FORGE PANELS (LEVEL UP & CHLV UP) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  
                  {/* PANEL 1: FORGE LEVEL (1 -> 5) */}
                  <div className="bg-white p-3.5 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-stone-200 pb-1.5 mb-2">
                        <div className="flex items-center gap-1.5">
                          <Hammer className="w-4 h-4 text-[#FA9427]" />
                          <h4 className="text-xs font-impact uppercase tracking-wider text-black">
                            1. FORJAR NIVEL (NV. 1 - 5)
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-stone-500">
                          +{custom.level - 1} Segmentos Ruleta
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-600 mb-2.5 leading-snug">
                        Aumenta el tamaño del ataque asignado en +1 punto y reduce el fallo (Miss).
                      </p>

                      {/* Cost Display */}
                      {targetLevel <= 5 && levelUpCost ? (
                        <div className="bg-amber-50 p-2 border border-amber-300 mb-3 space-y-1 text-xs">
                          <div className="font-bold text-stone-800 text-[11px] uppercase">
                            Coste para Nivel {targetLevel}:
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-700">Polvo {selectedFig.rarity}:</span>
                            <span className={`font-mono font-bold ${
                              availableDustForFigure >= levelUpCost.dustAmount ? 'text-emerald-700' : 'text-red-600'
                            }`}>
                              {availableDustForFigure} / {levelUpCost.dustAmount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-700">Ryo:</span>
                            <span className={`font-mono font-bold ${
                              profile.ryoCoins >= levelUpCost.ryoAmount ? 'text-emerald-700' : 'text-red-600'
                            }`}>
                              🪙 {profile.ryoCoins.toLocaleString()} / {levelUpCost.ryoAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-stone-100 p-2.5 text-center text-xs font-bold text-stone-700 mb-3 border border-stone-300">
                          🏆 ¡Nivel Máximo (Lv 5) alcanzado!
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleLevelUp}
                      disabled={!canLevelUpResult.allowed || targetLevel > 5 || !isFigureUnlocked}
                      className={`w-full py-2 px-3 text-xs font-impact uppercase tracking-wider border-2 border-black flex items-center justify-center gap-2 transition ${
                        isFigureUnlocked && canLevelUpResult.allowed && targetLevel <= 5
                          ? 'bg-[#FA9427] hover:bg-[#ffaa42] text-black shadow-[2px_2px_0px_#000] active:scale-95 cursor-pointer'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed border-stone-300'
                      }`}
                    >
                      <Hammer className="w-3.5 h-3.5" />
                      {!isFigureUnlocked ? 'Figura Bloqueada' : targetLevel <= 5 ? `Forjar Nivel ${targetLevel}` : 'Nivel Máximo'}
                    </button>
                  </div>

                  {/* PANEL 2: FORGE CHAKRA LEVEL (ChLv 0 -> 10) */}
                  <div className="bg-white p-3.5 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-stone-200 pb-1.5 mb-2">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-emerald-600" />
                          <h4 className="text-xs font-impact uppercase tracking-wider text-black">
                            2. NIVEL DE CHAKRA (ChLv 0-10)
                          </h4>
                        </div>
                        <span className="text-xs font-mono font-black text-emerald-700">
                          +{custom.clv} DMG
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-600 mb-2.5 leading-snug">
                        Otorga +1 de daño extra para ganar desempates cuando ambos ataques tienen la misma potencia.
                      </p>

                      {/* Cost Display */}
                      {custom.clv < 10 ? (
                        <div className="bg-emerald-50 p-2 border border-emerald-300 mb-3 space-y-1 text-xs">
                          <div className="font-bold text-stone-800 text-[11px] uppercase">
                            Coste para ChLv +{custom.clv + 1}:
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-700">Polvo {selectedFig.rarity}:</span>
                            <span className={`font-mono font-bold ${
                              availableDustForFigure >= CLV_UPGRADE_COST.dustAmount ? 'text-emerald-700' : 'text-red-600'
                            }`}>
                              {availableDustForFigure} / {CLV_UPGRADE_COST.dustAmount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-700">Ryo:</span>
                            <span className={`font-mono font-bold ${
                              profile.ryoCoins >= CLV_UPGRADE_COST.ryoAmount ? 'text-emerald-700' : 'text-red-600'
                            }`}>
                              🪙 {profile.ryoCoins.toLocaleString()} / {CLV_UPGRADE_COST.ryoAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-stone-100 p-2.5 text-center text-xs font-bold text-stone-700 mb-3 border border-stone-300">
                          ⚡ ¡Chakra Máximo (ChLv +10) dominado!
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleUpgradeChLv}
                      disabled={!canChLvUpResult.allowed || custom.clv >= 10 || !isFigureUnlocked}
                      className={`w-full py-2 px-3 text-xs font-impact uppercase tracking-wider border-2 border-black flex items-center justify-center gap-2 transition ${
                        isFigureUnlocked && canChLvUpResult.allowed && custom.clv < 10
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[2px_2px_0px_#000] active:scale-95 cursor-pointer'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed border-stone-300'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      {!isFigureUnlocked ? 'Figura Bloqueada' : custom.clv < 10 ? `Infundir Chakra (ChLv +${custom.clv + 1})` : 'Chakra Máximo (+10)'}
                    </button>
                  </div>
                </div>

                {/* Ruleta Wheel Preview & Segment Assignment */}
                <div className="bg-white p-3.5 border-2 border-black shadow-[3px_3px_0px_#000]">
                  <div className="text-xs font-impact uppercase text-black mb-2 flex items-center justify-between">
                    <span>ASIGNACIÓN DE LA FORJA • RULETA DE CHAKRA (96 SEGMENTOS)</span>
                    <span className="font-mono text-stone-600">Total: 96/96</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5 flex justify-center bg-stone-50 p-2 border border-stone-200">
                      <ChakraDiskSVG figure={previewFig} size={150} />
                    </div>

                    <div className="md:col-span-7 space-y-2">
                      <div className="text-[11px] font-bold text-stone-700">
                        Selecciona el ataque que recibirá el crecimiento de tamaño (+1 por nivel):
                      </div>

                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                        {computedSegs.map((seg, idx) => {
                          const col = WHEEL_COLORS[seg.color];
                          const isTarget = custom.lvTargetIndex === idx;
                          const isWhiteOrMiss = seg.color === 'white';

                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (!isFigureUnlocked) return;
                                soundEngine.play('select');
                                dispatch({
                                  type: 'UPDATE_FIGURE_WORKSHOP',
                                  payload: { ...custom, figKey: selectedFig.key, lvTargetIndex: idx },
                                });
                              }}
                              disabled={!isFigureUnlocked}
                              className={`w-full p-1.5 text-xs text-left border flex items-center justify-between transition ${
                                !isFigureUnlocked
                                  ? 'border-stone-200 bg-stone-100 opacity-60 cursor-not-allowed'
                                  : isTarget
                                  ? 'border-2 border-black bg-amber-100 shadow-[2px_2px_0px_#000] font-black cursor-pointer'
                                  : 'border-stone-300 bg-white hover:bg-stone-50 cursor-pointer'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span
                                  className="w-3 h-3 rounded-full border border-black shrink-0"
                                  style={{ backgroundColor: col.fill }}
                                />
                                <span className="truncate font-bold">{seg.name}</span>
                              </div>
                              <div className="flex items-center gap-2 font-mono shrink-0">
                                {seg.power > 0 && <span className="font-bold">{seg.power} DMG</span>}
                                {seg.stars > 0 && <span className="font-bold text-purple-700">★{seg.stars}</span>}
                                <span className="bg-stone-100 px-1.5 py-0.2 border border-stone-300 font-bold">
                                  {seg.size}/96
                                </span>
                                {isTarget && (
                                  <span className="text-[9px] bg-black text-[#FA9427] px-1 py-0.2 font-bold uppercase">
                                    Objetivo
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: DISENCHANT FIGURES FOR CHAKRA DUST */}
          {activeTab === 'disenchant' && (
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              <div className="bg-stone-900 text-white p-4 border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <h3 className="text-base sm:text-lg font-impact tracking-wider uppercase text-amber-400">
                      ALTAR DE DESENCANTAMIENTO NINJA
                    </h3>
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Desmantela rollos ninja y copias repetidas para extraer Polvos de Chakra puros y Ryo adicional.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold bg-stone-800 px-3 py-1.5 border border-stone-700">
                  <span>Saldo Ryo:</span>
                  <span className="text-amber-400 font-mono">🪙 {profile.ryoCoins.toLocaleString()}</span>
                </div>
              </div>

              {/* Disenchant Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(['C', 'UC', 'R', 'EX', 'UX'] as FigureRarity[]).map(rarity => {
                  const yieldInfo = DISENCHANT_YIELD[rarity];
                  const rStyle = RARITY_BADGE_STYLES[rarity];
                  const dustInfo = DUST_BADGE_INFO[rarity.toLowerCase() as keyof ChakraDustInventory];

                  return (
                    <div 
                      key={rarity} 
                      className="bg-white p-3.5 border-3 border-black shadow-[3px_3px_0px_#000] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between border-b-2 border-stone-200 pb-2 mb-2">
                          <span className={`px-2 py-0.5 text-xs font-black uppercase border ${rStyle.bg} ${rStyle.text} ${rStyle.border}`}>
                            Rollo Ninja [{rarity}]
                          </span>
                          <span className="text-xs font-bold text-stone-600">{rStyle.label}</span>
                        </div>

                        <div className="space-y-1.5 my-3 text-xs">
                          <div className="flex items-center justify-between bg-stone-50 p-2 border border-stone-200">
                            <span className="text-stone-700">Rendimiento en Polvo:</span>
                            <span className="font-black text-stone-900 font-mono">
                              +{yieldInfo.amount} {dustInfo.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-stone-50 p-2 border border-stone-200">
                            <span className="text-stone-700">Bonificación Ryo:</span>
                            <span className="font-black text-amber-700 font-mono">
                              +{yieldInfo.ryoBonus} 🪙 Ryo
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDisenchant(rarity)}
                        className="w-full py-2 px-3 bg-red-600 hover:bg-red-500 text-white font-impact text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Desencantar Rollo [{rarity}]
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Informative Note Box */}
              <div className="bg-amber-50 p-3.5 border-2 border-black text-xs space-y-1 text-stone-800">
                <div className="flex items-center gap-1.5 font-bold text-black uppercase">
                  <Info className="w-4 h-4 text-[#FA9427]" />
                  <span>Sobre el Desencantamiento y las Tiradas Gacha:</span>
                </div>
                <p>
                  Cuando realizas invocaciones en la Sala Gacha (<em>Kuchiyose no Jutsu</em>), cualquier figura que ya poseas se convierte <strong>automáticamente</strong> en Polvos de Chakra de su rareza según esta misma tabla de rendimiento.
                </p>
              </div>

            </div>
          )}

        </div>
      </main>

    </div>
  );
};
