import React, { useState } from 'react';
import { 
  Play, 
  BookOpen, 
  Users, 
  Volume2, 
  VolumeX, 
  Shield, 
  Award, 
  Sparkles, 
  Clapperboard,
  Hammer,
  MapPin,
  Swords,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { soundEngine } from '../../../infrastructure/audio/ShinobiAudioEngine';
import { NarutoIntroCutscene } from '../intro/NarutoIntroCutscene';
import { NarutoMangaBackground } from '../common/NarutoMangaBackground';

interface MainMenuProps {
  onStartGame: (mode: 'ai' | 'local') => void;
  onOpenGuide: () => void;
  onOpenCodex: () => void;
  onOpenGacha?: () => void;
  onOpenForge?: () => void;
  onOpenArenaSelector?: () => void;
  onOpenPvPLobby?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const INTRO_SEEN_STORAGE_KEY = 'shinobi_duel_intro_seen_v1';

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenGuide,
  onOpenCodex,
  onOpenGacha,
  onOpenForge,
  onOpenArenaSelector,
  onOpenPvPLobby,
  isMuted,
  onToggleMute,
}) => {
  const { t } = useTranslation();
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(INTRO_SEEN_STORAGE_KEY) !== 'true';
    } catch {
      return false;
    }
  });

  const handleIntroComplete = () => {
    try {
      localStorage.setItem(INTRO_SEEN_STORAGE_KEY, 'true');
    } catch {
      // Ignore localStorage exceptions in restricted contexts
    }
    setShowIntro(false);
  };

  const handlePlayIntro = () => {
    soundEngine.play('select');
    setShowIntro(true);
  };

  return (
    <>
      {showIntro && <NarutoIntroCutscene onComplete={handleIntroComplete} />}

      <div className="min-h-screen flex flex-col justify-between p-3 sm:p-5 md:p-6 relative overflow-x-hidden text-stone-900 select-none bg-transparent">
        <NarutoMangaBackground />

        {/* 1. TOP OFFICIAL TOURNAMENT BAR */}
        <header className="max-w-6xl w-full mx-auto bg-[#111111] text-white p-3 md:px-5 md:py-2.5 border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between gap-3 flex-wrap relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FA9427] border-2 border-white flex items-center justify-center text-black font-kanji font-black text-2xl shadow-[2px_2px_0px_#000]">
              忍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-impact text-xl md:text-2xl tracking-wider text-[#FA9427] drop-shadow-[1px_1px_0px_#000]">
                  SHINOBI DUEL
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-400/50 px-2 py-0.5 hidden sm:inline">
                  OFFICIAL ARENA
                </span>
              </div>
              <p className="text-[10px] text-stone-300 font-bold tracking-wider hidden sm:block uppercase">
                {t('menu.badge')}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-stone-900 border border-stone-800 text-xs font-bold text-stone-200">
            <span className="w-2 h-2 bg-emerald-500 animate-ping" />
            <span className="text-stone-300 uppercase tracking-wider text-[11px] font-bold">SISTEMA:</span>
            <span className="text-amber-400 font-mono font-bold">28 NODOS • 96 SEGMENTOS CHAKRA</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayIntro}
              className="px-2.5 py-1.5 bg-[#FA9427] hover:bg-[#ffaa42] text-black font-impact text-xs tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reproducir animación inicial de Naruto"
            >
              <Clapperboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">VER INTRO</span>
            </button>

            <LanguageSwitcher />

            <button
              onClick={onToggleMute}
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
              className="p-2 bg-stone-900 hover:bg-stone-800 text-amber-300 border-2 border-stone-700 hover:border-amber-400 transition-all shadow-[2px_2px_0px_#000] flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse hidden sm:inline-block" />
                </div>
              )}
            </button>
          </div>
        </header>

        {/* 2. MAIN CENTER HERO & DISTRIBUTED ACTION ARENA */}
        <main className="max-w-6xl w-full mx-auto my-auto py-2 md:py-3 relative z-20">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-4 sm:p-5 md:p-6 relative overflow-hidden">
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
            <div className="text-center space-y-1 mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-black text-[#FA9427] font-kanji font-bold text-xs uppercase tracking-widest border border-black shadow-[2px_2px_0px_#FA9427]">
                <span>木ノ葉隠れの里 • 忍道決闘録</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-impact tracking-wider uppercase text-black drop-shadow-[3px_3px_0px_#FA9427] leading-none pt-1">
                SHINOBI DUEL
              </h1>

              <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                <span className="bg-[#FA9427] text-black font-black text-xs md:text-sm px-4 py-1 border-2 border-black shadow-[2px_2px_0px_#000] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-black" />
                  {t('menu.subtitle')}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-900 max-w-2xl mx-auto font-semibold pt-1.5 leading-relaxed">
                {t('menu.description')}
              </p>
            </div>

            {/* SECTION 1: MODOS DE COMBATE (3-CARD GRID) */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b-3 border-black">
                <div className="flex items-center gap-2.5">
                  <span className="bg-black text-[#FA9427] font-black text-xs px-2.5 py-0.5 border-2 border-black uppercase tracking-wider shadow-[2px_2px_0px_#FA9427]">
                    戦闘 • MODOS DE COMBATE
                  </span>
                  <span className="text-xs font-black text-stone-800 uppercase tracking-wide hidden sm:inline">
                    Duelos Tácticos 1 vs 1 en el Tablero de 28 Nodos
                  </span>
                </div>
                <span className="text-[11px] font-black text-stone-700 font-mono">3 MODOS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 1.1: Quick Duel vs Akatsuki AI */}
                <button
                  onClick={() => onStartGame('ai')}
                  className="w-full manga-menu-card p-4 text-left flex flex-col justify-between group cursor-pointer min-h-[145px]"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      <span className="bg-black text-[#FA9427] font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                        独闘 • RANGO S
                      </span>
                      <span className="bg-white text-black font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                        RECOMENDADO
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-black text-stone-950 tracking-tight leading-tight font-sans">
                      Duelo Rápido (vs IA)
                    </div>
                    <div className="text-xs font-medium text-stone-800 mt-1.5 leading-snug">
                      Enfréntate en solitario a la IA Akatsuki con evaluación táctica multi-objetivo.
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3.5 pt-2 border-t-2 border-black/20">
                    <span className="text-xs font-black uppercase text-black flex items-center gap-1">
                      Partida Rápida <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <div className="w-9 h-9 bg-black text-[#FA9427] border-2 border-black flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-[2px_2px_0px_#000]">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </button>

                {/* 1.2: Realtime Online PvP */}
                {onOpenPvPLobby && (
                  <button
                    onClick={onOpenPvPLobby}
                    className="w-full manga-menu-card p-4 text-left flex flex-col justify-between group cursor-pointer min-h-[145px]"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <span className="bg-[#DC2626] text-white font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                          通信対戦 • PVP ONLINE
                        </span>
                        <span className="bg-emerald-100 text-emerald-900 font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                          TIEMPO REAL
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-black text-stone-950 tracking-tight leading-tight font-sans">
                        Duelo Ninja Online (1v1)
                      </div>
                      <div className="text-xs font-medium text-stone-800 mt-1.5 leading-snug">
                        Crea una sala privada con código de 6 letras o desafía a un rival remoto vía WebSockets.
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3.5 pt-2 border-t-2 border-black/20">
                      <span className="text-xs font-black uppercase text-black flex items-center gap-1">
                        Unirse con Código <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <div className="w-9 h-9 bg-black text-[#FA9427] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-[2px_2px_0px_#000]">
                        <Swords className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                )}

                {/* 1.3: 2-Player Local Duel */}
                <button
                  onClick={() => onStartGame('local')}
                  className="w-full manga-menu-card p-4 text-left flex flex-col justify-between group cursor-pointer min-h-[145px]"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      <span className="bg-[#0284C7] text-white font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                        対戦 • 1 VS 1 LOCAL
                      </span>
                      <span className="bg-sky-100 text-sky-900 font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                        MISMA PANTALLA
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-black text-stone-950 tracking-tight leading-tight font-sans">
                      Duelo 2 Jugadores Local
                    </div>
                    <div className="text-xs font-medium text-stone-800 mt-1.5 leading-snug">
                      Juega en el mismo dispositivo contra un amigo por turnos alternos cara a cara.
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3.5 pt-2 border-t-2 border-black/20">
                    <span className="text-xs font-black uppercase text-black flex items-center gap-1">
                      Cara a Cara <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <div className="w-9 h-9 bg-black text-[#FA9427] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-[2px_2px_0px_#000]">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* SECTION 2: GESTIÓN & ARSENAL DE LA ALDEA (3-CARD GRID) */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b-3 border-black">
                <div className="flex items-center gap-2.5">
                  <span className="bg-stone-900 text-amber-400 font-black text-xs px-2.5 py-0.5 border-2 border-black uppercase tracking-wider shadow-[2px_2px_0px_#f59e0b]">
                    拠点 • ALDEA Y ARSENAL
                  </span>
                  <span className="text-xs font-black text-stone-800 uppercase tracking-wide hidden sm:inline">
                    Invocación Gacha, Forja de Técnicas y Selección de Escenarios
                  </span>
                </div>
                <span className="text-[11px] font-black text-stone-700 font-mono">3 CENTROS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* 2.1: Gacha Summon Room */}
                {onOpenGacha && (
                  <button
                    onClick={onOpenGacha}
                    className="w-full manga-menu-card p-4 text-left flex flex-col justify-between group cursor-pointer min-h-[145px]"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <span className="bg-[#FA9427] text-black font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                          口寄せ • INVOCACIÓN
                        </span>
                        <span className="bg-amber-100 text-amber-900 font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                          GACHA & PITY
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-black text-stone-950 tracking-tight leading-tight font-sans">
                        Sala de Invocaciones
                      </div>
                      <div className="text-xs font-medium text-stone-800 mt-1.5 leading-snug">
                        Desenrolla contratos para invocar ninjas y acumular Polvos de Chakra.
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3.5 pt-2 border-t-2 border-black/20">
                      <span className="text-xs font-black uppercase text-black flex items-center gap-1">
                        Invocar Shinobis <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <div className="w-9 h-9 bg-black text-[#FA9427] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-[2px_2px_0px_#000]">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                )}

                {/* 2.2: Shinobi Forge */}
                {onOpenForge && (
                  <button
                    onClick={onOpenForge}
                    className="w-full manga-menu-card p-4 text-left flex flex-col justify-between group cursor-pointer min-h-[145px]"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <span className="bg-[#D97706] text-white font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                          鍛冶場 • FORJA
                        </span>
                        <span className="bg-orange-100 text-orange-900 font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                          NV.1-5 & CLV
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-black text-stone-950 tracking-tight leading-tight font-sans">
                        Forja Shinobi
                      </div>
                      <div className="text-xs font-medium text-stone-800 mt-1.5 leading-snug">
                        Aumenta sectores de la ruleta y potencia el Daño Carmín (+DMG).
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3.5 pt-2 border-t-2 border-black/20">
                      <span className="text-xs font-black uppercase text-black flex items-center gap-1">
                        Mejorar Habilidades <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <div className="w-9 h-9 bg-black text-[#FA9427] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-[2px_2px_0px_#000]">
                        <Hammer className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                )}

                {/* 2.3: Arena Selector */}
                {onOpenArenaSelector && (
                  <button
                    onClick={onOpenArenaSelector}
                    className="w-full manga-menu-card p-4 text-left flex flex-col justify-between group cursor-pointer min-h-[145px]"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <span className="bg-[#0284C7] text-white font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                          戦場 • 5 ARENAS
                        </span>
                        <span className="bg-sky-100 text-sky-900 font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                          CLIMAS & AURAS
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-black text-stone-950 tracking-tight leading-tight font-sans">
                        Selector de Arenas
                      </div>
                      <div className="text-xs font-medium text-stone-800 mt-1.5 leading-snug">
                        Personaliza el campo: Chunin, Valle del Fin, Bosque Konoha.
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3.5 pt-2 border-t-2 border-black/20">
                      <span className="text-xs font-black uppercase text-black flex items-center gap-1">
                        Elegir Escenario <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <div className="w-9 h-9 bg-black text-[#FA9427] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-[2px_2px_0px_#000]">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* SECTION 3: ACADEMIA & REGISTROS (2-CARD GRID) */}
            <div>
              <div className="flex items-center justify-between mb-2 pb-1.5 border-b-3 border-black">
                <div className="flex items-center gap-2.5">
                  <span className="bg-stone-900 text-purple-300 font-black text-xs px-2.5 py-0.5 border-2 border-black uppercase tracking-wider shadow-[2px_2px_0px_#9333ea]">
                    巻物 • CONOCIMIENTO & MAZO
                  </span>
                  <span className="text-xs font-black text-stone-800 uppercase tracking-wide hidden sm:inline">
                    Libro Bingo, Configuración de Equipo y Reglas Oficiales
                  </span>
                </div>
                <span className="text-[11px] font-black text-stone-700 font-mono">2 GUÍAS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 3.1: Bingo Book / Codex */}
                <button
                  onClick={onOpenCodex}
                  className="w-full manga-menu-card p-4 text-left flex flex-col justify-between group cursor-pointer min-h-[145px]"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      <span className="bg-[#7C3AED] text-white font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                        賞金首 • LIBRO BINGO
                      </span>
                      <span className="bg-purple-100 text-purple-900 font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                        COLECCIÓN & DECK
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-black text-stone-950 tracking-tight leading-tight font-sans">
                      Libro Bingo: Catálogo & Mazo
                    </div>
                    <div className="text-xs font-medium text-stone-800 mt-1.5 leading-snug">
                      Consulta todas las figuras canónicas, ruletas de 96 segmentos y configura tu equipo titular.
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3.5 pt-2 border-t-2 border-black/20">
                    <span className="text-xs font-black uppercase text-black flex items-center gap-1">
                      Abrir Catálogo y Mazo <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <div className="w-9 h-9 bg-black text-[#FA9427] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-[2px_2px_0px_#000]">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* 3.2: Rules Guide */}
                <button
                  onClick={onOpenGuide}
                  className="w-full manga-menu-card p-4 text-left flex flex-col justify-between group cursor-pointer min-h-[145px]"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      <span className="bg-[#C5221F] text-white font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                        指南 • REGLAS CANÓNICAS
                      </span>
                      <span className="bg-rose-100 text-rose-900 font-black text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                        ACADEMIA TÁCTICA
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-black text-stone-950 tracking-tight leading-tight font-sans">
                      Guía Táctica de Reglas
                    </div>
                    <div className="text-xs font-medium text-stone-800 mt-1.5 leading-snug">
                      Aprende la jerarquía de la ruleta, rodeo Fūinjutsu KO, estados alterados y uso de pergaminos.
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3.5 pt-2 border-t-2 border-black/20">
                    <span className="text-xs font-black uppercase text-black flex items-center gap-1">
                      Consultar Manual <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <div className="w-9 h-9 bg-black text-[#FA9427] border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-[2px_2px_0px_#000]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* 5. FOOTER: SHARP BLACK MANGA CREST BAR */}
        <footer className="max-w-6xl w-full mx-auto bg-[#111111] text-stone-200 p-3 sm:px-5 border-3 border-black shadow-[4px_4px_0px_#000] flex flex-wrap items-center justify-between gap-3 text-xs font-bold relative z-20">
          <span className="flex items-center gap-2 text-white font-bold">
            <Shield className="w-4 h-4 text-[#FA9427]" />
            {t('menu.footerConcept')}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-impact tracking-wider text-sm">
              {t('menu.footerAudio')}
            </span>
            <span className="text-[10px] text-stone-400 uppercase tracking-widest hidden md:inline font-bold">
              • V1.0 CANONICAL
            </span>
          </div>
        </footer>
      </div>
    </>
  );
};
