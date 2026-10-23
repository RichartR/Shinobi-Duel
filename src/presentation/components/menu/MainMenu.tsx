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
  Zap, 
  Flame, 
  Wind, 
  Compass, 
  Crosshair,
  Clapperboard,
  Hammer,
  MapPin
} from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { soundEngine } from '../../../infrastructure/audio/ShinobiAudioEngine';
import { CHAR_SVG_FALLBACKS, JUTSU_ANIME_CUTINS } from '../../../infrastructure/assets/animeAssets';
import { NarutoIntroCutscene } from '../intro/NarutoIntroCutscene';
import { NarutoMangaBackground } from '../common/NarutoMangaBackground';

interface MainMenuProps {
  onStartGame: (mode: 'ai' | 'local') => void;
  onOpenGuide: () => void;
  onOpenCodex: () => void;
  onOpenGacha?: () => void;
  onOpenForge?: () => void;
  onOpenArenaSelector?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

interface ShinobiHighlight {
  id: string;
  name: string;
  jpName: string;
  title: string;
  jutsuKey: string;
  image: string;
  quote: string;
  element: string;
  elementName: string;
  elementColor: string;
  badgeBg: string;
  mp: number;
}

const INTRO_SEEN_STORAGE_KEY = 'shinobi_duel_intro_seen_v1';

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenGuide,
  onOpenCodex,
  onOpenGacha,
  onOpenForge,
  onOpenArenaSelector,
  isMuted,
  onToggleMute,
}) => {
  const { t } = useTranslation();
  // Only auto-play the Naruto intro animation once.
  // We check localStorage to avoid repeating it whenever navigating back to the main menu.
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

  // Featured Shinobi roster for interactive inspection with authentic anime artwork
  const featuredShinobi: ShinobiHighlight[] = [
    {
      id: 'naruto',
      name: 'Naruto Uzumaki (Genin)',
      jpName: 'うずまきナルト',
      title: 'Kage Bunshin no Jutsu (影分身)',
      jutsuKey: 'kagebunshin',
      image: '/assets/naruto_hero.jpg',
      quote: '«¡Jamás retrocederé a mi palabra! ¡Ese es mi camino ninja!»',
      element: '風',
      elementName: 'Viento',
      elementColor: 'text-amber-500',
      badgeBg: 'bg-[#FA9427] text-black',
      mp: 3,
    },
    {
      id: 'sasuke',
      name: 'Sasuke Uchiha (Genin)',
      jpName: 'うちはサスケ',
      title: 'Katon: Gōkakyū no Jutsu (豪火球)',
      jutsuKey: 'chidori',
      image: '/assets/sasuke_hero.jpg',
      quote: '«Soy un vengador del clan Uchiha, no me detendré ante nadie.»',
      element: '火',
      elementName: 'Fuego',
      elementColor: 'text-blue-500',
      badgeBg: 'bg-[#0284C7] text-white',
      mp: 3,
    },
    {
      id: 'sakura',
      name: 'Sakura Haruno (Genin)',
      jpName: '春野サクラ',
      title: '¡Shānnarō! (しゃーんなろー)',
      jutsuKey: 'lotus',
      image: 'https://cdn.myanimelist.net/images/characters/16/323862.jpg',
      quote: '«¡Esta vez no me quedaré atrás mirando vuestras espaldas!»',
      element: '心',
      elementName: 'Chakra',
      elementColor: 'text-pink-500',
      badgeBg: 'bg-[#BE185D] text-white',
      mp: 2,
    },
    {
      id: 'shikamaru',
      name: 'Shikamaru Nara (Genin)',
      jpName: '奈良シカマル',
      title: 'Kagemane no Jutsu (影真似)',
      jutsuKey: 'tsukuyomi',
      image: 'https://cdn.myanimelist.net/images/characters/2/74737.jpg',
      quote: '«Qué fastidio de nubes... sólo quiero vivir una vida tranquila.»',
      element: '影',
      elementName: 'Sombra',
      elementColor: 'text-emerald-500',
      badgeBg: 'bg-[#14532D] text-emerald-300',
      mp: 2,
    },
    {
      id: 'lee',
      name: 'Rock Lee (Genin)',
      jpName: 'ロック・リー',
      title: 'Konoha Senpū (木ノ葉旋風)',
      jutsuKey: 'lotus',
      image: 'https://cdn.myanimelist.net/images/characters/14/433353.jpg',
      quote: '«¡Un perdedor puede superar a un genio con puro esfuerzo y sudor!»',
      element: '体',
      elementName: 'Taijutsu',
      elementColor: 'text-green-500',
      badgeBg: 'bg-[#047857] text-white',
      mp: 3,
    },
  ];

  const [selectedShinobi, setSelectedShinobi] = useState<ShinobiHighlight>(featuredShinobi[0]);

  const handleSelectShinobi = (ninja: ShinobiHighlight) => {
    soundEngine.play('select');
    setSelectedShinobi(ninja);
  };

  const handlePlayIntro = () => {
    soundEngine.play('select');
    setShowIntro(true);
  };

  return (
    <>
      {/* Anime Intro Overlay when active */}
      {showIntro && <NarutoIntroCutscene onComplete={handleIntroComplete} />}

      <div className="min-h-screen flex flex-col justify-between p-3 sm:p-5 md:p-6 relative overflow-x-hidden text-stone-900 select-none bg-transparent">
        {/* Global Naruto Manga Background */}
        <NarutoMangaBackground />

        {/* 1. TOP OFFICIAL TOURNAMENT BAR - SHARP GEOMETRY */}
        <header className="max-w-6xl w-full mx-auto bg-[#111111] text-white p-3 md:px-5 md:py-2.5 border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between gap-3 flex-wrap relative z-20">
          {/* Left: Diamond Emblem & Game Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FA9427] border-2 border-white flex items-center justify-center text-black font-kanji font-black text-2xl shadow-[2px_2px_0px_#000]">
              忍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-impact text-xl md:text-2xl tracking-wider text-[#FA9427] drop-shadow-[1px_1px_0px_#000]">
                  SHINOBI DUEL
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 hidden sm:inline">
                  OFFICIAL ARENA
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-bold tracking-wider hidden sm:block uppercase">
                {t('menu.badge')}
              </p>
            </div>
          </div>

          {/* Center: Quick Tournament Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-stone-900 border border-stone-800 text-xs font-bold text-stone-300">
            <span className="w-2 h-2 bg-emerald-500 animate-ping" />
            <span className="text-stone-400 uppercase tracking-wider text-[11px]">SISTEMA:</span>
            <span className="text-amber-400 font-mono">28 NODOS • 96 SEGMENTOS CHAKRA</span>
          </div>

          {/* Right: Intro Replay + Language Pill + Sound FX Toggle */}
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

        {/* 2. MAIN CENTER HERO & ACTION ARENA - SHARP MANGA PANELS */}
        <main className="max-w-6xl w-full mx-auto my-auto py-2 md:py-3 relative z-20">
          {/* Main Center Card: Pure Solid White Manga Container */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-4 sm:p-5 md:p-6 relative overflow-hidden">
            {/* Authentic Leaf Village Headband Metal Plate with Screws & Cut Corners */}
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

            {/* Title Header with Japanese Manga Typography & 3D Shading */}
            <div className="text-center space-y-1 mb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-black text-[#FA9427] font-kanji font-bold text-[11px] uppercase tracking-widest border border-black shadow-[2px_2px_0px_#FA9427]">
                <span>木ノ葉隠れの里 • 忍道決闘録</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-impact tracking-wider uppercase text-black drop-shadow-[3px_3px_0px_#FA9427] leading-none">
                SHINOBI DUEL
              </h1>

              <div className="flex items-center justify-center gap-2 pt-0.5 flex-wrap">
                <span className="bg-[#FA9427] text-black font-black text-xs md:text-sm px-3.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  {t('menu.subtitle')}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 max-w-2xl mx-auto font-medium pt-1 leading-relaxed">
                {t('menu.description')}
              </p>
            </div>

            {/* 3. TWO-COLUMN LAYOUT: MODES ON THE LEFT, INTERACTIVE ROSTER ON THE RIGHT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              {/* Left Column: 4 Game Mode Scrolls (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-2.5">
                {/* Card 1: Primary Hero S-Rank Action: VS AI (Akatsuki Heuristic Engine) */}
                <button
                  onClick={() => onStartGame('ai')}
                  className="w-full manga-btn-orange p-3.5 sm:p-4 text-left flex items-center justify-between group cursor-pointer border-3 border-black shadow-[4px_4px_0px_#111111] hover:shadow-[6px_6px_0px_#111111] transition-all relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="bg-black text-[#FA9427] font-impact text-[11px] px-2 py-0.5 border border-black uppercase tracking-wider">
                        独闘 • MISIÓN RANGO S
                      </span>
                      <span className="bg-white/90 text-black font-black text-[9px] px-1.5 py-0.5 border border-black uppercase tracking-wider">
                        RECOMENDADO
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-impact tracking-wide text-black leading-tight">
                      {t('menu.quickDuelTitle')}
                    </div>
                    <div className="text-xs font-bold text-stone-900 mt-0.5 max-w-md leading-snug">
                      {t('menu.quickDuelDesc')}
                    </div>
                  </div>

                  <div className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 bg-black text-[#FA9427] border-2 border-black flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform flex-shrink-0 ml-2 shadow-[2px_2px_0px_#FA9427]">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
                  </div>
                </button>

                {/* Card 2: 2-Player Local Duel */}
                <button
                  onClick={() => onStartGame('local')}
                  className="w-full manga-btn-white p-3 sm:p-3.5 text-left flex items-center justify-between group cursor-pointer border-3 border-black shadow-[3px_3px_0px_#111111] hover:shadow-[5px_5px_0px_#111111] transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="bg-[#0284C7] text-white font-impact text-[11px] px-2 py-0.5 border border-black uppercase tracking-wider">
                        対戦 • 1 VS 1 LOCAL
                      </span>
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                        MISMA PANTALLA
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-impact tracking-wide text-black leading-tight">
                      {t('menu.local2pTitle')}
                    </div>
                    <div className="text-xs font-medium text-stone-700 mt-0.5 leading-snug">
                      {t('menu.local2pDesc')}
                    </div>
                  </div>

                  <div className="w-10 h-10 bg-[#0284C7] text-white border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 ml-2 shadow-[2px_2px_0px_#000]">
                    <Users className="w-5 h-5" />
                  </div>
                </button>

                {/* Card 3: Kuchiyose Gacha Summon */}
                {onOpenGacha && (
                  <button
                    onClick={onOpenGacha}
                    className="w-full manga-btn-white p-2.5 sm:p-3 text-left flex items-center justify-between group cursor-pointer border-3 border-black shadow-[3px_3px_0px_#111111] hover:shadow-[4px_4px_0px_#111111] transition-all bg-gradient-to-r from-amber-50 to-orange-50"
                  >
                    <div className="min-w-0 pr-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="bg-[#FA9427] text-black font-bold text-[10px] px-1.5 py-0.2 border border-black uppercase tracking-wider">
                          口寄せ • INVOCACIÓN GACHA
                        </span>
                        <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider">
                          NUEVAS FIGURAS & POLVOS
                        </span>
                      </div>
                      <div className="text-base sm:text-lg font-impact tracking-wide text-black leading-tight">
                        Sala de Invocaciones Shinobi
                      </div>
                      <div className="text-[11px] font-medium text-stone-700 mt-0.5 line-clamp-1">
                        Desenrolla contratos para invocar ninjas y acumular Polvos de Chakra.
                      </div>
                    </div>

                    <div className="w-8 h-8 bg-[#FA9427] text-black border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 ml-2 shadow-[2px_2px_0px_#000]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </button>
                )}

                {/* Sub-grid: 2 Feature Hubs (Forge & Arena Selector) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Hub 1: Forge */}
                  {onOpenForge && (
                    <button
                      onClick={onOpenForge}
                      className="manga-btn-white p-2.5 sm:p-3 text-left flex items-center justify-between group cursor-pointer border-3 border-black shadow-[3px_3px_0px_#111111] hover:shadow-[4px_4px_0px_#111111] transition-all bg-gradient-to-r from-orange-50 to-amber-50"
                    >
                      <div className="min-w-0 pr-1">
                        <span className="bg-[#D97706] text-white font-impact text-[10px] px-1.5 py-0.5 border border-black inline-block tracking-wider">
                          鍛冶場 • FORJA & CHAKRA
                        </span>
                        <div className="text-sm sm:text-base font-impact tracking-wide text-black mt-0.5 leading-tight truncate">
                          Forja Shinobi
                        </div>
                        <div className="text-[10px] font-medium text-stone-600 mt-0.5 line-clamp-1">
                          Sube Nv.1-5, ChLv y desencanta rollos.
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-[#D97706] text-white border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 shadow-[2px_2px_0px_#000]">
                        <Hammer className="w-4 h-4" />
                      </div>
                    </button>
                  )}

                  {/* Hub 2: Arena Selector */}
                  {onOpenArenaSelector && (
                    <button
                      onClick={onOpenArenaSelector}
                      className="manga-btn-white p-2.5 sm:p-3 text-left flex items-center justify-between group cursor-pointer border-3 border-black shadow-[3px_3px_0px_#111111] hover:shadow-[4px_4px_0px_#111111] transition-all bg-gradient-to-r from-sky-50 to-blue-50"
                    >
                      <div className="min-w-0 pr-1">
                        <span className="bg-[#0284C7] text-white font-impact text-[10px] px-1.5 py-0.5 border border-black inline-block tracking-wider">
                          戦場選択 • 5 ARENAS
                        </span>
                        <div className="text-sm sm:text-base font-impact tracking-wide text-black mt-0.5 leading-tight truncate">
                          Selector de Arenas
                        </div>
                        <div className="text-[10px] font-medium text-stone-600 mt-0.5 line-clamp-1">
                          Personaliza el campo con climas y auras.
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-[#0284C7] text-white border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 shadow-[2px_2px_0px_#000]">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Sub-grid: 2 Companion Cards (Rules & Bingo Book) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Card: Rules Guide */}
                  <button
                    onClick={onOpenGuide}
                    className="manga-btn-white p-2.5 sm:p-3 text-left flex items-center justify-between group cursor-pointer border-3 border-black shadow-[3px_3px_0px_#111111] hover:shadow-[4px_4px_0px_#111111] transition-all"
                  >
                    <div className="min-w-0 pr-1">
                      <span className="bg-[#C5221F] text-white font-impact text-[10px] px-1.5 py-0.5 border border-black inline-block tracking-wider">
                        指南 • REGLAS CANÓNICAS
                      </span>
                      <div className="text-sm sm:text-base font-impact tracking-wide text-black mt-0.5 leading-tight truncate">
                        {t('menu.guideTitle')}
                      </div>
                      <div className="text-[10px] font-medium text-stone-600 mt-0.5 line-clamp-1">
                        {t('menu.guideDesc')}
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-[#C5221F] text-white border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 shadow-[2px_2px_0px_#000]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Card: Bingo Book / Codex */}
                  <button
                    onClick={onOpenCodex}
                    className="manga-btn-white p-2.5 sm:p-3 text-left flex items-center justify-between group cursor-pointer border-3 border-black shadow-[3px_3px_0px_#111111] hover:shadow-[4px_4px_0px_#111111] transition-all"
                  >
                    <div className="min-w-0 pr-1">
                      <span className="bg-[#7C3AED] text-white font-impact text-[10px] px-1.5 py-0.5 border border-black inline-block tracking-wider">
                        賞金首 • LIBRO BINGO
                      </span>
                      <div className="text-sm sm:text-base font-impact tracking-wide text-black mt-0.5 leading-tight truncate">
                        {t('menu.codexTitle')}
                      </div>
                      <div className="text-[10px] font-medium text-stone-600 mt-0.5 line-clamp-1">
                        {t('menu.codexDesc')}
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-[#7C3AED] text-white border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 shadow-[2px_2px_0px_#000]">
                      <Award className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Shinobi Preview & Real Anime Art (5 cols) */}
              <div className="lg:col-span-5 bg-stone-900 text-white p-3.5 sm:p-4 border-3 border-black shadow-[4px_4px_0px_#111111] flex flex-col justify-between">
                {/* Top: Active Inspect Banner */}
                <div>
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Crosshair className="w-4 h-4 text-[#FA9427]" />
                      <span className="font-impact text-xs tracking-wider uppercase text-amber-400">
                        FIGURAS DESTACADAS • ROSTER
                      </span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider bg-stone-800 px-1.5 py-0.5 text-stone-300 border border-stone-700">
                      ARTE ANIME OFICIAL
                    </span>
                  </div>

                  {/* Active Shinobi Spotlight: Authentic Anime Visual & Manga Card */}
                  <div className="bg-stone-950 border-2 border-stone-800 relative overflow-hidden flex flex-col shadow-[4px_4px_0px_#000]">
                    {/* Real Anime Art Frame with Dynamic Visual Impact */}
                    <div className="relative w-full h-44 sm:h-48 md:h-52 bg-black overflow-hidden group">
                      {/* Real Anime Image */}
                      <img 
                        src={selectedShinobi.image} 
                        alt={selectedShinobi.name}
                        key={selectedShinobi.id}
                        className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                      />

                      {/* Manga Speedlines and Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-black/25 to-transparent pointer-events-none" />

                      {/* Top-Left: Element & MP Seal Badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                        <span className={`text-[10px] font-black px-2 py-0.5 ${selectedShinobi.badgeBg} border-2 border-black shadow-[2px_2px_0px_#000] uppercase tracking-wider`}>
                          {selectedShinobi.element} {selectedShinobi.elementName}
                        </span>
                        <span className="bg-black/85 text-amber-300 font-mono text-[10px] font-bold px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                          {selectedShinobi.mp} MP
                        </span>
                      </div>

                      {/* Top-Right: Authentic Japanese Kanji Seal */}
                      <div className="absolute top-2 right-2 z-10 bg-black/80 text-white font-kanji font-black text-xs px-2.5 py-0.5 border border-white/40 shadow-[2px_2px_0px_#000]">
                        {selectedShinobi.jpName}
                      </div>

                      {/* Bottom: Name & Jutsu Overlay inside the Art Panel */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 z-10">
                        <h3 className="font-impact text-xl sm:text-2xl text-white tracking-wide uppercase drop-shadow-[2px_2px_0px_#000] leading-none">
                          {selectedShinobi.name}
                        </h3>
                        <p className="text-[11px] font-bold text-amber-400 drop-shadow-[1px_1px_0px_#000] mt-0.5 flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-current text-amber-400" />
                          {selectedShinobi.title}
                        </p>
                      </div>
                    </div>

                    {/* Quote Strip below the artwork */}
                    <div className="p-2 sm:p-2.5 bg-stone-950 border-t-2 border-stone-800">
                      <p className="text-[11px] text-stone-300 font-medium italic line-clamp-2 leading-tight">
                        {selectedShinobi.quote}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom: Ninja Selector Strip */}
                <div className="mt-3 pt-2 border-t border-stone-800">
                  <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 mb-1.5 uppercase tracking-wider">
                    <span>Elegir combatiente canónico:</span>
                    <span className="text-amber-400 font-mono text-[9px]">CANON SHIPPUDEN</span>
                  </div>

                  <div className="grid grid-cols-6 gap-1.5">
                    {featuredShinobi.map((ninja) => {
                      const isSelected = selectedShinobi.id === ninja.id;
                      return (
                        <button
                          key={ninja.id}
                          onClick={() => handleSelectShinobi(ninja)}
                          aria-label={`Inspeccionar figura de ${ninja.name} (${ninja.elementName})`}
                          aria-pressed={isSelected}
                          className={`p-1 border-2 transition-all flex flex-col items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                            isSelected
                              ? 'bg-[#FA9427] border-white text-black shadow-[2px_2px_0px_#fff] scale-105 z-10'
                              : 'bg-stone-800 border-stone-700 hover:border-stone-500 text-stone-300 hover:bg-stone-750'
                          }`}
                          title={`${ninja.name} - ${ninja.title}`}
                        >
                          <div className="w-8 h-8 sm:w-9 sm:h-9 border border-black overflow-hidden bg-black flex-shrink-0">
                            <img 
                              src={ninja.image} 
                              alt={ninja.name} 
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <span className="text-[8px] font-black uppercase truncate max-w-full leading-none">
                            {ninja.name.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. CANONICAL FEATURES TICKER (Sharp Manga Badges) */}
            <div className="mt-4 pt-3 border-t-2 border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold text-stone-800">
              <div className="p-2 bg-stone-100 border-2 border-black flex items-center gap-2 shadow-[2px_2px_0px_#000]">
                <Compass className="w-3.5 h-3.5 text-[#FA9427] flex-shrink-0" />
                <span className="truncate text-[11px] sm:text-xs">Ruleta 96 Segmentos</span>
              </div>
              <div className="p-2 bg-stone-100 border-2 border-black flex items-center gap-2 shadow-[2px_2px_0px_#000]">
                <Flame className="w-3.5 h-3.5 text-[#DC2626] flex-shrink-0" />
                <span className="truncate text-[11px] sm:text-xs">Rodeo Fūinjutsu (KO)</span>
              </div>
              <div className="p-2 bg-stone-100 border-2 border-black flex items-center gap-2 shadow-[2px_2px_0px_#000]">
                <Wind className="w-3.5 h-3.5 text-[#0284C7] flex-shrink-0" />
                <span className="truncate text-[11px] sm:text-xs">Grafo de 28 Nodos</span>
              </div>
              <div className="p-2 bg-stone-100 border-2 border-black flex items-center gap-2 shadow-[2px_2px_0px_#000]">
                <Zap className="w-3.5 h-3.5 text-[#7C3AED] flex-shrink-0" />
                <span className="truncate text-[11px] sm:text-xs">Pergaminos Tácticos</span>
              </div>
            </div>
          </div>
        </main>

        {/* 5. FOOTER: SHARP BLACK MANGA CREST BAR */}
        <footer className="max-w-6xl w-full mx-auto bg-[#111111] text-stone-300 p-3 sm:px-5 border-3 border-black shadow-[4px_4px_0px_#000] flex flex-wrap items-center justify-between gap-3 text-xs font-bold relative z-20">
          <span className="flex items-center gap-2 text-white">
            <Shield className="w-4 h-4 text-[#FA9427]" />
            {t('menu.footerConcept')}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-impact tracking-wider text-sm">
              {t('menu.footerAudio')}
            </span>
            <span className="text-[10px] text-stone-500 uppercase tracking-widest hidden md:inline">
              • V1.0 CANONICAL
            </span>
          </div>
        </footer>
      </div>
    </>
  );
};
