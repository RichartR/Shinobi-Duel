import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  BookOpen,
  Info,
  Gift,
  CheckCircle2,
  X,
  Zap,
  ChevronRight,
  Award,
} from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { NarutoMangaBackground } from '../common/NarutoMangaBackground';
import { soundEngine } from '../../../infrastructure/audio/ShinobiAudioEngine';
import { 
  shinobiDbRepository, 
  UserShinobiProfile 
} from '../../../infrastructure/repositories/SupabaseShinobiRepository';
import { 
  gachaService, 
  GachaPullResultItem, 
  GachaSummonResponse 
} from '../../../domain/services/GachaService';
import { FigureRarity } from '../../../domain/models/CraftingEconomy';
import { CHAR_SVG_FALLBACKS } from '../../../infrastructure/assets/animeAssets';

interface ShinobiGachaProps {
  onBackToMenu: () => void;
  onOpenCodex: () => void;
  onOpenForge?: () => void;
}

interface GachaBannerConfig {
  key: string;
  title: string;
  subtitle: string;
  jpTitle: string;
  rateUpShinobis: string[];
  costSingle: number;
  costMulti: number;
  badgeBg: string;
  accentColor: string;
}

const BANNERS: GachaBannerConfig[] = [
  {
    key: 'arc1_novatos_konoha',
    title: 'Pergamino I: Los Novatos de Konoha',
    subtitle: 'Elenco inicial del 1er Arco. Los 10 ninjas recién graduados de la Academia cuando eran niños (Rango C).',
    jpTitle: '巻之一 • 木ノ葉のルーキー (初編)',
    rateUpShinobis: ['naruto', 'sasuke', 'sakura', 'shikamaru'],
    costSingle: 50,
    costMulti: 450,
    badgeBg: 'bg-black text-[#FA9427]',
    accentColor: '#FA9427',
  },
  {
    key: 'arc2_chunin_exam',
    title: 'Pergamino II: Exámenes Chūnin (Próximo Arco)',
    subtitle: 'Próxima expansión de historia: Introducirá a Gaara, Neji, Temari y versiones evolucionadas UC/R.',
    jpTitle: '巻之二 • 中忍選抜試験 (近日開放)',
    rateUpShinobis: ['lee', 'sasuke', 'naruto'],
    costSingle: 60,
    costMulti: 540,
    badgeBg: 'bg-[#14532D] text-emerald-300',
    accentColor: '#16A34A',
  },
  {
    key: 'arc3_sannin_clash',
    title: 'Pergamino III: Los Tres Sannin (Bloqueado)',
    subtitle: 'Se desbloqueará al avanzar en la historia ninja. Jiraiya, Orochimaru y Tsunade.',
    jpTitle: '巻之三 • 伝説の三竦み (封印中)',
    rateUpShinobis: ['naruto', 'sasuke'],
    costSingle: 70,
    costMulti: 630,
    badgeBg: 'bg-stone-800 text-stone-400',
    accentColor: '#9333EA',
  },
];

type SummonStage = 
  | 'idle' 
  | 'ritual_seals' 
  | 'scroll_unroll' 
  | 'blood_slam' 
  | 'smoke_explosion' 
  | 'card_reveal' 
  | 'summary';

const HAND_SEALS = [
  { kanji: '亥', name: 'Jabalí', romaji: 'I' },
  { kanji: '戌', name: 'Perro', romaji: 'Inu' },
  { kanji: '酉', name: 'Pájaro', romaji: 'Tori' },
  { kanji: '申', name: 'Mono', romaji: 'Saru' },
  { kanji: '未', name: 'Carnero', romaji: 'Hitsuji' },
];

const RARITY_AURA_CONFIG: Record<FigureRarity, {
  color: string;
  glowClass: string;
  beamGradient: string;
  badgeBg: string;
  label: string;
  kanji: string;
}> = {
  UX: {
    color: '#f59e0b',
    glowClass: 'shadow-[0_0_40px_#f59e0b]',
    beamGradient: 'from-amber-400 via-rose-500 to-purple-600',
    badgeBg: 'bg-gradient-to-r from-red-600 via-amber-500 to-purple-600 text-white font-black',
    label: 'PRESENCIA ULTRA LEGENDARIA (UX)',
    kanji: '極',
  },
  EX: {
    color: '#9333ea',
    glowClass: 'shadow-[0_0_35px_#9333ea]',
    beamGradient: 'from-purple-600 via-fuchsia-500 to-indigo-600',
    badgeBg: 'bg-[#FA9427] text-black font-black',
    label: 'CHAKRA ÉLITE DESPERTADO (EX)',
    kanji: '秘',
  },
  R: {
    color: '#0284c7',
    glowClass: 'shadow-[0_0_25px_#0284c7]',
    beamGradient: 'from-sky-400 via-blue-500 to-cyan-500',
    badgeBg: 'bg-[#0284C7] text-white font-black',
    label: 'CHAKRA ELEVADO (RARO)',
    kanji: '忍',
  },
  UC: {
    color: '#16a34a',
    glowClass: 'shadow-[0_0_20px_#16a34a]',
    beamGradient: 'from-emerald-400 to-green-600',
    badgeBg: 'bg-[#16A34A] text-white font-bold',
    label: 'CHAKRA CHŪNIN (UC)',
    kanji: '術',
  },
  C: {
    color: '#78716c',
    glowClass: 'shadow-[0_0_15px_#78716c]',
    beamGradient: 'from-stone-400 to-stone-600',
    badgeBg: 'bg-stone-300 text-black font-bold',
    label: 'CHAKRA GENIN (C)',
    kanji: '印',
  },
};

export const ShinobiGacha: React.FC<ShinobiGachaProps> = ({
  onBackToMenu,
  onOpenCodex,
  onOpenForge,
}) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserShinobiProfile>(() => shinobiDbRepository.getProfile());
  const [activeBannerKey, setActiveBannerKey] = useState<string>('hokage_legends');
  const [pityCount, setPityCount] = useState<number>(14);
  const [summonStage, setSummonStage] = useState<SummonStage>('idle');
  const [lastSummonResponse, setLastSummonResponse] = useState<GachaSummonResponse | null>(null);
  const [showRatesModal, setShowRatesModal] = useState<boolean>(false);
  const [activeSealIndex, setActiveSealIndex] = useState<number>(0);
  const [revealIndex, setRevealIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [timeouts, setTimeouts] = useState<NodeJS.Timeout[]>([]);

  const activeBanner = BANNERS.find(b => b.key === activeBannerKey) || BANNERS[0];

  useEffect(() => {
    shinobiDbRepository.saveProfile(profile);
  }, [profile]);

  const clearTimeouts = () => {
    timeouts.forEach(t => clearTimeout(t));
    setTimeouts([]);
  };

  const handleSkipAnimation = () => {
    clearTimeouts();
    setSummonStage('summary');
  };

  const handleClaimDailyGems = () => {
    soundEngine.play('win');
    const updated = {
      ...profile,
      chakraGems: profile.chakraGems + 150,
      ryoCoins: profile.ryoCoins + 1000,
    };
    setProfile(updated);
    shinobiDbRepository.saveProfile(updated);
  };

  const handleTriggerSummon = (pullCount: 1 | 10) => {
    const cost = pullCount === 1 ? activeBanner.costSingle : activeBanner.costMulti;
    if (profile.chakraGems < cost) {
      soundEngine.play('ko');
      alert(`Gemas de Chakra insuficientes. Tienes ${profile.chakraGems} 💎 y necesitas ${cost} 💎. ¡Puedes reclamar gemas gratuitas en el botón superior!`);
      return;
    }

    const ownedKeys = ['naruto', 'sasuke', 'lee']; // Figuras en posesión para duplicados
    const response = gachaService.executeSummon(activeBanner.key, pullCount, pityCount, ownedKeys);

    let updatedProfile = {
      ...profile,
      chakraGems: profile.chakraGems - response.gemsSpent,
    };

    response.results.forEach(res => {
      if (res.isDuplicate) {
        const dustKey = res.dustYield.dustRarity.toLowerCase() as keyof typeof updatedProfile.dust;
        updatedProfile = {
          ...updatedProfile,
          ryoCoins: updatedProfile.ryoCoins + res.dustYield.ryoBonus,
          dust: {
            ...updatedProfile.dust,
            [dustKey]: (updatedProfile.dust[dustKey] || 0) + res.dustYield.amount,
          },
        };
      }
    });

    setProfile(updatedProfile);
    shinobiDbRepository.saveProfile(updatedProfile);
    setPityCount(response.newPityCount);
    setLastSummonResponse(response);

    // Iniciar la cinemática anime de invocación Kuchiyose no Jutsu
    clearTimeouts();
    setSummonStage('ritual_seals');
    setActiveSealIndex(0);
    setRevealIndex(0);
    setIsCardFlipped(false);
    soundEngine.play('jutsu');

    const scheduled: NodeJS.Timeout[] = [];
    [1, 2, 3, 4].forEach((idx, i) => {
      scheduled.push(setTimeout(() => setActiveSealIndex(idx), (i + 1) * 120));
    });

    // Unroll scroll
    scheduled.push(setTimeout(() => {
      setSummonStage('scroll_unroll');
      soundEngine.play('scroll');
    }, 750));

    // Blood seal slam
    scheduled.push(setTimeout(() => {
      setSummonStage('blood_slam');
      soundEngine.play('summon');
    }, 1600));

    // Smoke explosion with chakra burst
    scheduled.push(setTimeout(() => {
      setSummonStage('smoke_explosion');
      soundEngine.play('jutsu');
    }, 2450));

    // Enter interactive card reveal
    scheduled.push(setTimeout(() => {
      setSummonStage('card_reveal');
      setRevealIndex(0);
      setIsCardFlipped(false);
    }, 3500));

    setTimeouts(scheduled);
  };

  const handleFlipCurrentCard = () => {
    if (!lastSummonResponse) return;
    const currentPull = lastSummonResponse.results[revealIndex];
    if (!currentPull) return;
    const isHighRarity = currentPull.figure.rarity === 'EX' || currentPull.figure.rarity === 'UX';
    soundEngine.play(isHighRarity ? 'win' : 'forge');
    setIsCardFlipped(true);
  };

  const handleNextCard = () => {
    if (!lastSummonResponse) return;
    if (revealIndex < lastSummonResponse.results.length - 1) {
      soundEngine.play('select');
      setRevealIndex(prev => prev + 1);
      setIsCardFlipped(false);
    } else {
      soundEngine.play('win');
      setSummonStage('summary');
    }
  };

  const getRarityBadgeStyle = (rarity: FigureRarity) => {
    switch (rarity) {
      case 'UX': return 'bg-gradient-to-r from-red-600 via-amber-500 to-purple-600 text-white font-black shadow-[2px_2px_0px_#000]';
      case 'EX': return 'bg-[#FA9427] text-black font-black shadow-[2px_2px_0px_#000]';
      case 'R': return 'bg-[#0284C7] text-white font-black shadow-[2px_2px_0px_#000]';
      case 'UC': return 'bg-[#16A34A] text-white font-bold shadow-[2px_2px_0px_#000]';
      default: return 'bg-stone-300 text-black font-bold border border-black shadow-[1px_1px_0px_#000]';
    }
  };

  return (
    <div className="min-h-screen text-black flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none relative bg-transparent overflow-x-hidden font-sans">
      <NarutoMangaBackground />

      {/* 1. TOP HEADER - TOURNAMENT BAR */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between p-3 md:px-5 md:py-2.5 border-3 border-black bg-[#111111] shadow-[4px_4px_0px_#000] flex-wrap gap-3 text-white relative z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="manga-btn-white px-3.5 py-2 text-xs md:text-sm font-bold uppercase tracking-wide border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fa9427]"
          >
            ← {t('common.backToMenu')}
          </button>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 bg-[#FA9427] border-2 border-black flex items-center justify-center text-black font-kanji font-black text-lg shadow-[2px_2px_0px_#000]">
              契
            </span>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-black text-[#FA9427] tracking-wide uppercase leading-tight drop-shadow-[1px_1px_0px_#000]">
                SALA DE INVOCACIONES SHINOBI
              </h1>
              <p className="text-xs text-stone-300 font-medium tracking-wide">
                KUCHIYOSE NO JUTSU • PERGAMINOS DE CONTRATO
              </p>
            </div>
          </div>
        </div>

        {/* Currency Display & Free Gems Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 bg-stone-900 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#FA9427]">
            <span className="text-sm font-black text-amber-400">🪙 {profile.ryoCoins.toLocaleString()}</span>
            <span className="text-stone-500">|</span>
            <span className="text-sm font-black text-cyan-400">💎 {profile.chakraGems.toLocaleString()}</span>
          </div>

          <button
            onClick={handleClaimDailyGems}
            className="px-3 py-1.5 bg-[#FA9427] hover:bg-[#ffaa42] text-black font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
            title="Reclamar 150 gemas y 1000 ryo para pruebas"
          >
            <Gift className="w-3.5 h-3.5" /> +150 💎 Misión
          </button>

          <LanguageSwitcher compact />
        </div>
      </header>

      {/* 2. MAIN CENTER CONTENT CARD */}
      <main className="max-w-6xl w-full mx-auto my-2 md:my-3 relative z-20 flex-1 flex flex-col">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] flex-1 flex flex-col p-4 sm:p-6 md:p-7 relative overflow-hidden">
          
          {/* Banner Selector Tabs */}
          <div className="flex items-center justify-between gap-2 border-b-3 border-black pb-3 mb-4 flex-wrap">
            <div className="flex gap-2 flex-wrap" role="tablist">
              {BANNERS.map(banner => {
                const isSelected = activeBannerKey === banner.key;
                return (
                  <button
                    key={banner.key}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      soundEngine.play('select');
                      setActiveBannerKey(banner.key);
                    }}
                    className={`px-3 sm:px-4 py-2 min-h-[44px] text-xs sm:text-sm font-bold uppercase transition border-2 border-black cursor-pointer ${
                      isSelected
                        ? 'bg-[#FA9427] text-black shadow-[3px_3px_0px_#000] font-black'
                        : 'bg-stone-100 text-stone-800 hover:bg-stone-200 shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    {banner.title}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowRatesModal(true)}
              className="px-3 py-2 text-xs font-bold bg-stone-100 hover:bg-stone-200 border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-stone-700" /> Probabilidades
            </button>
          </div>

          {/* Banner Hero Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch">
            
            {/* Left Col (8 cols): Giant Banner Artwork & Rate-Up Showcase */}
            <div className="lg:col-span-8 bg-[#111111] text-white p-5 border-3 border-black shadow-[5px_5px_0px_#000] flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                  <span className={`px-2.5 py-1 text-xs font-black uppercase tracking-wider border border-black shadow-[2px_2px_0px_#000] ${activeBanner.badgeBg}`}>
                    {activeBanner.jpTitle}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-black/60 px-2.5 py-1 border border-stone-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Pity actual: <span className="font-mono text-white font-black">{pityCount}/40</span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FA9427] tracking-tight uppercase leading-tight drop-shadow-[2px_2px_0px_#000]">
                  {activeBanner.title}
                </h2>
                <p className="text-sm text-stone-300 max-w-xl font-medium mt-1 leading-relaxed">
                  {activeBanner.subtitle}
                </p>
              </div>

              {/* Featured Ninjas Portrait Spotlight */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                {activeBanner.rateUpShinobis.map(shinobiKey => {
                  const names: Record<string, string> = {
                    minato: 'Minato (EX)',
                    kakashi: 'Kakashi (EX)',
                    itachi: 'Itachi (EX)',
                    naruto: 'Naruto (EX)',
                    sasuke: 'Sasuke (EX)',
                    gaara: 'Gaara (EX)',
                    lee: 'Rock Lee (R)',
                  };
                  return (
                    <div 
                      key={shinobiKey} 
                      className="bg-black/80 border-2 border-stone-700 p-2 flex flex-col items-center text-center shadow-[2px_2px_0px_#FA9427]"
                    >
                      <img 
                        src={`/assets/${shinobiKey}_hero.jpg`} 
                        alt={shinobiKey} 
                        className="w-16 h-16 object-cover object-top border border-black shadow-sm mb-1.5"
                        onError={e => {
                          e.currentTarget.src = CHAR_SVG_FALLBACKS[shinobiKey] || '';
                        }}
                      />
                      <span className="text-xs font-black text-amber-300 uppercase truncate w-full">
                        {names[shinobiKey] || shinobiKey}
                      </span>
                      <span className="text-[10px] text-stone-400 font-bold uppercase">
                        ★ RATE UP x3
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Pity Progress Bar Indicator */}
              <div className="relative z-10 pt-2 border-t border-stone-800">
                <div className="flex justify-between text-xs font-bold text-stone-300 mb-1">
                  <span>Protección de Invocación (Pity)</span>
                  <span className="text-amber-400">{40 - pityCount} tiradas para EX/UX garantizado</span>
                </div>
                <div className="w-full h-3 bg-stone-800 border border-black overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#fa9427] to-[#e77100] transition-all duration-300"
                    style={{ width: `${Math.min(100, (pityCount / 40) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Col (4 cols): Summon Action Controls & Polvo Status */}
            <div className="lg:col-span-4 bg-[#FFFDF5] p-5 border-3 border-black shadow-[5px_5px_0px_#000] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-2 border-b-2 border-black mb-3">
                  <span className="w-7 h-7 bg-black text-[#FA9427] flex items-center justify-center font-bold text-sm border border-black">
                    印
                  </span>
                  <div>
                    <h3 className="font-black text-black text-base uppercase">Sello de Contrato</h3>
                    <p className="text-xs text-stone-600 font-medium">Elige la modalidad de invocación</p>
                  </div>
                </div>

                {/* Duplicates Disenchanting Policy Reminder */}
                <div className="p-3 bg-amber-50 border-2 border-black text-xs text-stone-900 space-y-1 mb-4 shadow-[2px_2px_0px_#000]">
                  <strong className="text-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Política Canónica de Duplicados:
                  </strong>
                  <p className="leading-relaxed">
                    Las copias repetidas se convierten automáticamente en <strong>Polvos de Chakra</strong> de su rareza para subir el <strong>Nivel de Chakra (ChLv)</strong> de tus cartas en la Forja.
                  </p>
                </div>

                {/* Current Dust Inventory Quick Glance */}
                <div className="bg-white p-3 border-2 border-black shadow-[2px_2px_0px_#000] mb-4">
                  <div className="text-xs font-black uppercase text-black mb-1.5 flex items-center justify-between">
                    <span>Tus Polvos de Chakra:</span>
                    <button 
                      onClick={onOpenForge || onOpenCodex}
                      className="text-[11px] text-[#FA9427] hover:underline font-bold"
                    >
                      Ir a Forja →
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-1 text-center font-mono text-xs">
                    <div className="p-1 bg-stone-100 border border-black">
                      <div className="text-[10px] font-bold text-stone-600">C</div>
                      <div className="font-black text-black">{profile.dust.c}</div>
                    </div>
                    <div className="p-1 bg-emerald-50 border border-black">
                      <div className="text-[10px] font-bold text-emerald-700">UC</div>
                      <div className="font-black text-emerald-950">{profile.dust.uc}</div>
                    </div>
                    <div className="p-1 bg-sky-50 border border-black">
                      <div className="text-[10px] font-bold text-sky-700">R</div>
                      <div className="font-black text-sky-950">{profile.dust.r}</div>
                    </div>
                    <div className="p-1 bg-amber-50 border border-black">
                      <div className="text-[10px] font-bold text-amber-700">EX</div>
                      <div className="font-black text-amber-950">{profile.dust.ex}</div>
                    </div>
                    <div className="p-1 bg-purple-50 border border-black">
                      <div className="text-[10px] font-bold text-purple-700">UX</div>
                      <div className="font-black text-purple-950">{profile.dust.ux}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Summon Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => handleTriggerSummon(1)}
                  className="w-full manga-btn-white py-3 px-4 flex items-center justify-between border-3 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] cursor-pointer"
                >
                  <div className="text-left">
                    <div className="text-sm font-black uppercase text-black">Invocación Individual</div>
                    <div className="text-xs text-stone-600 font-bold">1 Figura Shinobi</div>
                  </div>
                  <div className="px-3 py-1 bg-black text-[#FA9427] font-black text-xs border border-black shadow-[1px_1px_0px_#FA9427]">
                    💎 {activeBanner.costSingle}
                  </div>
                </button>

                <button
                  onClick={() => handleTriggerSummon(10)}
                  className="w-full manga-btn-orange py-3.5 px-4 flex items-center justify-between border-3 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] cursor-pointer relative overflow-hidden"
                >
                  <div className="text-left relative z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black uppercase text-black">Invocación x10</span>
                      <span className="px-1.5 py-0.5 bg-black text-[#FA9427] text-[9px] font-black uppercase border border-black">
                        1 R+ GARANTIZADA
                      </span>
                    </div>
                    <div className="text-xs text-stone-900 font-bold">10 Figuras + 1 Gratis</div>
                  </div>
                  <div className="px-3 py-1 bg-black text-white font-black text-xs border border-black shadow-[1px_1px_0px_#fff] relative z-10">
                    💎 {activeBanner.costMulti}
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 3. CINEMATIC SUMMON MODAL OVERLAY (KUCHIYOSE NO JUTSU) */}
      {summonStage !== 'idle' && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-5 select-none overflow-hidden">
          
          {/* Persistent Skip Animation Button */}
          <button
            onClick={handleSkipAnimation}
            className="absolute top-4 right-4 z-50 bg-stone-900/90 hover:bg-[#FA9427] text-white hover:text-black border-2 border-white px-3 py-1.5 font-impact text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 shadow-[3px_3px_0px_#FA9427] cursor-pointer transition-all"
          >
            ⏩ SALTAR ANIMACIÓN
          </button>

          {/* STAGE 1: RITUAL HAND SEALS (MONTAGE SHINOBI) */}
          {summonStage === 'ritual_seals' && (
            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 max-w-xl w-full">
              {/* Radiating Conic Speedlines */}
              <div 
                className="absolute -inset-40 opacity-25 pointer-events-none"
                style={{ backgroundImage: 'repeating-conic-gradient(from 0deg, #FA9427 0deg 2deg, transparent 2deg 8deg)' }}
              />

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white font-impact text-xs uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_#000]">
                口寄せの術 • KUCHIYOSE NO JUTSU
              </div>

              <h2 className="text-3xl sm:text-5xl font-impact tracking-wider uppercase text-white drop-shadow-[4px_4px_0px_#000]">
                EJECUTANDO SELLOS MANUALES
              </h2>

              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                {HAND_SEALS.map((seal, idx) => {
                  const isActive = activeSealIndex === idx;
                  const isDone = activeSealIndex > idx;
                  return (
                    <div
                      key={seal.kanji}
                      className={`w-14 h-18 sm:w-16 sm:h-22 border-3 border-black flex flex-col items-center justify-center transition-all ${
                        isActive
                          ? 'bg-[#FA9427] text-black scale-110 shadow-[0_0_30px_#FA9427] font-black'
                          : isDone
                          ? 'bg-red-700 text-white shadow-[2px_2px_0px_#000]'
                          : 'bg-stone-900 text-stone-500 border-stone-800'
                      }`}
                    >
                      <span className="font-kanji text-2xl sm:text-4xl font-black">{seal.kanji}</span>
                      <span className="text-[9px] font-bold uppercase mt-1 tracking-wider">{seal.name}</span>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs sm:text-sm font-bold text-amber-400 font-kanji animate-pulse">
                シュッ... シュッ... シュッ... ¡CONCENTRANDO CHAKRA PARA EL PACTO!
              </p>
            </div>
          )}

          {/* STAGE 2: UNROLLING GIANT MAKIMONO SCROLL */}
          {summonStage === 'scroll_unroll' && (
            <div className="relative z-10 max-w-2xl w-full mx-auto p-4 flex flex-col items-center justify-center">
              <div className="w-full bg-[#FFF9E6] border-4 border-black p-6 sm:p-10 shadow-[10px_10px_0px_#FA9427] relative animate-scroll-unroll overflow-hidden">
                {/* Scroll Wooden Rollers */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-stone-800 via-amber-950 to-stone-900 border-r-2 border-black" />
                <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-stone-800 via-amber-950 to-stone-900 border-l-2 border-black" />

                <div className="text-center space-y-4">
                  <div className="font-kanji font-black text-xs text-stone-700 uppercase tracking-widest">
                    契約之巻 • PERGAMINO ANCESTRAL DE CONTRATO ESPIRITUAL
                  </div>
                  
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full border-4 border-black flex items-center justify-center bg-white relative shadow-[4px_4px_0px_#000]">
                    <div className="absolute inset-1 border border-dashed border-stone-400 rounded-full" />
                    <span className="font-kanji font-black text-5xl text-stone-950">
                      契
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-impact tracking-wider uppercase text-black">
                    DESENROLLANDO FÓRMULA DE SELLADO...
                  </h3>
                  <p className="text-xs sm:text-sm font-kanji font-bold text-amber-800">
                    ザザザッ... (ZAZAZÁ...)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: BLOOD SEAL SLAM */}
          {summonStage === 'blood_slam' && (
            <div className="relative z-10 max-w-2xl w-full mx-auto p-4 flex flex-col items-center justify-center animate-screen-shake">
              <div className="w-full bg-[#FFF9E6] border-4 border-black p-6 sm:p-10 shadow-[12px_12px_0px_#DC2626] relative overflow-hidden">
                <div className="text-center space-y-4">
                  <div className="inline-block bg-red-600 text-white font-impact text-xs px-2.5 py-0.5 uppercase border border-black">
                    口寄せの術 • PACTO DE SANGRE
                  </div>

                  {/* Slammed Blood Seal */}
                  <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full border-4 border-red-700 flex flex-col items-center justify-center bg-red-100 relative shadow-[0_0_35px_#DC2626] animate-blood-slam">
                    <span className="font-kanji font-black text-6xl text-red-800">
                      忍
                    </span>
                    <span className="text-[10px] font-black text-red-950 uppercase tracking-widest mt-1">
                      PACTO SELLADO
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-5xl font-impact tracking-wider uppercase text-red-700 drop-shadow-[2px_2px_0px_#000]">
                    ズドォォン！！ (¡DOKAN!)
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-stone-800 uppercase tracking-widest">
                    ¡CONTRATO FIRMADO! INVOCANDO AL CAMPO DE BATALLA...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: SMOKE EXPLOSION & CHAKRA BURST */}
          {summonStage === 'smoke_explosion' && lastSummonResponse && (
            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
              {(() => {
                const hAura = RARITY_AURA_CONFIG[lastSummonResponse.highestRarity] || RARITY_AURA_CONFIG.C;
                return (
                  <>
                    {/* Billowing Smoke & Rising Chakra Pillar */}
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                      <div className="absolute inset-0 bg-stone-200/90 rounded-full filter blur-xl animate-smoke-puff" />
                      <div className="absolute inset-4 bg-white/95 rounded-full filter blur-md animate-smoke-puff delay-100" />
                      
                      <div 
                        className={`absolute inset-0 bg-gradient-to-t ${hAura.beamGradient} rounded-full opacity-60 filter blur-2xl animate-pulse`} 
                      />

                      {/* Giant Manga Onomatopoeia */}
                      <div className="relative z-20 font-impact text-6xl sm:text-8xl text-white drop-shadow-[6px_6px_0px_#000] tracking-widest animate-bounce">
                        ドカン！！
                      </div>
                    </div>

                    <div className="relative z-20">
                      <span className="inline-block px-3 py-1 bg-black text-[#FA9427] font-impact text-sm sm:text-base uppercase tracking-widest border-2 border-white shadow-[3px_3px_0px_#000]">
                        {hAura.label}
                      </span>
                      <p className="text-xs sm:text-sm text-stone-300 font-bold uppercase mt-2">
                        La cortina de humo se disipa y los guerreros emergen...
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* STAGE 5: INTERACTIVE CARD-BY-CARD REVEAL */}
          {summonStage === 'card_reveal' && lastSummonResponse && (
            <div className="relative z-10 max-w-lg w-full mx-auto flex flex-col items-center justify-between">
              {(() => {
                const currentPull = lastSummonResponse.results[revealIndex];
                if (!currentPull) return null;
                const pullAura = RARITY_AURA_CONFIG[currentPull.figure.rarity] || RARITY_AURA_CONFIG.C;

                return (
                  <>
                    {/* Progress Header */}
                    <div className="w-full flex items-center justify-between text-white mb-2">
                      <span className="font-impact text-xs sm:text-sm tracking-wider uppercase bg-stone-900 px-3 py-1 border border-stone-700 shadow-[2px_2px_0px_#000]">
                        NINJA {revealIndex + 1} DE {lastSummonResponse.results.length}
                      </span>
                      <span className="text-xs font-bold text-amber-400">
                        {isCardFlipped ? `${currentPull.figure.rarity} • ${currentPull.figure.name}` : 'SELLADO'}
                      </span>
                    </div>

                    {/* THE CARD (SEALED OR REVEALED) */}
                    <div className="w-full my-2">
                      {!isCardFlipped ? (
                        /* SEALED MAKIMONO SCROLL (CLICK TO REVEAL) */
                        <div
                          onClick={handleFlipCurrentCard}
                          className={`w-full min-h-[380px] sm:min-h-[420px] bg-[#FFFDF5] border-4 border-black p-6 sm:p-8 flex flex-col items-center justify-between cursor-pointer transition-all hover:scale-[1.02] active:scale-95 relative overflow-hidden ${pullAura.glowClass}`}
                        >
                          {/* Scroll Wooden Rollers */}
                          <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-stone-900 to-amber-950 border-r-2 border-black" />
                          <div className="absolute right-0 top-0 bottom-0 w-3.5 bg-gradient-to-l from-stone-900 to-amber-950 border-l-2 border-black" />

                          {/* Top Banner */}
                          <div className="text-center">
                            <span className="bg-black text-white font-impact text-xs px-2.5 py-0.5 border border-black uppercase tracking-wider">
                              口寄せ契約封印 • {pullAura.label}
                            </span>
                          </div>

                          {/* Central Pulsing Rarity Seal */}
                          <div className="relative my-4 flex items-center justify-center">
                            <div 
                              className="absolute w-36 h-36 rounded-full opacity-40 filter blur-xl animate-pulse"
                              style={{ backgroundColor: pullAura.color }}
                            />
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-black flex flex-col items-center justify-center bg-white shadow-[4px_4px_0px_#000] relative">
                              <span className="font-kanji font-black text-5xl sm:text-6xl text-stone-950">
                                {pullAura.kanji}
                              </span>
                              <span className="text-[10px] font-black uppercase text-stone-600 mt-0.5">
                                {currentPull.figure.rarity}
                              </span>
                            </div>
                          </div>

                          {/* Click Call to Action */}
                          <div className="text-center w-full">
                            <div className="w-full py-2.5 bg-[#FA9427] hover:bg-[#ffaa42] text-black font-impact text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-1.5 animate-bounce">
                              <Sparkles className="w-4 h-4" />
                              TOCA LA CARTA PARA ROMPER EL SELLO Y REVELAR
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* FLIPPED & REVEALED CHARACTER CARD */
                        <div className="w-full bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-4 sm:p-5 flex flex-col justify-between animate-card-flip relative overflow-hidden min-h-[380px] sm:min-h-[420px]">
                          
                          {/* Header Badges */}
                          <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 text-xs font-black uppercase border border-black ${pullAura.badgeBg}`}>
                                {currentPull.figure.rarity}
                              </span>
                              <span className="text-xs font-impact uppercase text-stone-800">
                                {currentPull.figure.mp} PUNTOS DE MOVIMIENTO
                              </span>
                            </div>
                            {currentPull.isPity && (
                              <span className="bg-red-600 text-white font-impact text-[10px] px-2 py-0.5 border border-black uppercase">
                                GARANTÍA DE PIEDAD
                              </span>
                            )}
                          </div>

                          {/* Character Anime Portrait & Hero Info */}
                          <div className="flex items-center gap-4 mb-3">
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-stone-950 border-3 border-black overflow-hidden shrink-0 shadow-[3px_3px_0px_#000]">
                              <img
                                src={currentPull.figure.portraitUrl}
                                alt={currentPull.figure.name}
                                className="w-full h-full object-cover object-top"
                                onError={e => {
                                  e.currentTarget.src = CHAR_SVG_FALLBACKS[currentPull.figure.key] || '';
                                }}
                              />
                            </div>

                            <div className="min-w-0">
                              <h3 className="text-xl sm:text-2xl font-impact tracking-wide text-black uppercase leading-tight truncate">
                                {currentPull.figure.name}
                              </h3>
                              <p className="text-xs font-bold text-amber-700 font-kanji">
                                {currentPull.figure.shortName || currentPull.figure.name}
                              </p>
                              <p className="text-xs font-black text-stone-600 mt-1 uppercase">
                                {currentPull.figure.archetype}
                              </p>
                              <p className="text-[11px] text-stone-700 font-medium mt-1 line-clamp-2">
                                {currentPull.figure.ability}
                              </p>
                            </div>
                          </div>

                          {/* Transmutation / Duplicate Dissolve Alert */}
                          {currentPull.isDuplicate ? (
                            <div className="bg-amber-100 border-2 border-black p-2.5 mb-3 space-y-1 relative overflow-hidden shadow-[2px_2px_0px_#000]">
                              <div className="flex items-center justify-between text-xs font-black text-amber-950 uppercase">
                                <span className="flex items-center gap-1">
                                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                                  ¡FIGURA REPETIDA • CONVERTIDA EN POLVOS!
                                </span>
                                <span className="text-emerald-700 font-mono">
                                  +{currentPull.dustYield.amount} POLVOS [{currentPull.figure.rarity}]
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-700 font-medium leading-tight">
                                Ya posees esta figura en tu Libro Bingo. Se transformó en <strong>{currentPull.dustYield.amount} Polvos de Chakra {currentPull.figure.rarity}</strong> y <strong>+{currentPull.dustYield.ryoBonus} 🪙 Ryo</strong> para subir su Nivel de Chakra (ChLv) en la Forja.
                              </p>
                            </div>
                          ) : (
                            <div className="bg-emerald-100 border-2 border-black p-2.5 mb-3 flex items-center gap-2 shadow-[2px_2px_0px_#000]">
                              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                              <div className="text-xs font-black text-emerald-950 uppercase">
                                ¡NUEVA FIGURA RECLUTADA! YA PUEDES EQUIPARLA EN TU MAZO.
                              </div>
                            </div>
                          )}

                          {/* Next Button */}
                          <div className="pt-2">
                            <button
                              onClick={handleNextCard}
                              className="w-full py-2.5 bg-black hover:bg-stone-800 text-white font-impact text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#FA9427] flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
                            >
                              {revealIndex < lastSummonResponse.results.length - 1 ? (
                                <>
                                  <span>Revelar Siguiente Ninja ({revealIndex + 2}/{lastSummonResponse.results.length})</span>
                                  <ChevronRight className="w-4 h-4 text-[#FA9427]" />
                                </>
                              ) : (
                                <>
                                  <Award className="w-4 h-4 text-[#FA9427]" />
                                  <span>Ver Resumen Completo de Invocaciones →</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* STAGE 6: FINAL SUMMARY GRID */}
          {summonStage === 'summary' && lastSummonResponse && (
            <div className="max-w-5xl w-full bg-white border-4 border-black shadow-[10px_10px_0px_#000] p-4 sm:p-6 max-h-[90vh] flex flex-col justify-between overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 bg-[#FA9427] border-2 border-black flex items-center justify-center text-black font-black text-base">
                    得
                  </span>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">
                      ¡INVOCACIÓN COMPLETADA!
                    </h3>
                    <p className="text-xs text-stone-700 font-bold">
                      {lastSummonResponse.results.length} figura(s) invocada(s) y polvos acreditados
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSummonStage('idle')}
                  className="p-1.5 bg-stone-100 hover:bg-stone-200 border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000]"
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 overflow-y-auto pr-1 py-2 flex-1">
                {lastSummonResponse.results.map((res, idx) => (
                  <div
                    key={`${res.figure.key}_${idx}`}
                    className="p-2.5 bg-white border-3 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between relative group hover:scale-[1.02] transition-transform"
                  >
                    {/* Top Tag: Rarity & MP */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2 py-0.5 text-[10px] uppercase border border-black ${getRarityBadgeStyle(res.figure.rarity)}`}>
                        {res.figure.rarity}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-stone-800">
                        {res.figure.mp} MP
                      </span>
                    </div>

                    {/* Figure Portrait */}
                    <div className="w-full h-24 sm:h-28 bg-stone-900 border-2 border-black overflow-hidden mb-2 relative">
                      <img
                        src={res.figure.portraitUrl}
                        alt={res.figure.name}
                        className="w-full h-full object-cover object-top"
                        onError={e => {
                          e.currentTarget.src = CHAR_SVG_FALLBACKS[res.figure.key] || '';
                        }}
                      />
                      {res.isPity && (
                        <div className="absolute top-1 right-1 bg-red-600 text-white font-black text-[8px] px-1 py-0.5 border border-black uppercase">
                          PITY
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div>
                      <h4 className="text-xs font-black text-black uppercase truncate mb-0.5">
                        {res.figure.name}
                      </h4>
                      <p className="text-[10px] text-stone-600 font-medium line-clamp-1 mb-1">
                        {res.figure.archetype}
                      </p>
                    </div>

                    {/* Duplicate Status or New Figure Badge */}
                    <div className="mt-1 pt-1.5 border-t border-stone-200">
                      {res.isDuplicate ? (
                        <div className="bg-amber-100 border border-black p-1 text-center">
                          <span className="text-[9px] font-black text-amber-900 uppercase block">
                            DUPLICADO: +{res.dustYield.amount} Polvo {res.figure.rarity}
                          </span>
                          <span className="text-[8px] font-bold text-stone-700 block">
                            +{res.dustYield.ryoBonus} Ryo abonados
                          </span>
                        </div>
                      ) : (
                        <div className="bg-emerald-100 border border-black p-1 text-center">
                          <span className="text-[9px] font-black text-emerald-900 uppercase block">
                            ✨ ¡NUEVA FIGURA!
                          </span>
                          <span className="text-[8px] font-bold text-emerald-800 block">
                            Desbloqueada en tu mazo
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t-3 border-black mt-2 flex-wrap">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                  <Zap className="w-4 h-4 text-[#FA9427]" />
                  <span>Gemas restantes: <strong className="text-black font-mono">💎 {profile.chakraGems}</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      setSummonStage('idle');
                      if (onOpenForge) onOpenForge();
                      else onOpenCodex();
                    }}
                    className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                  >
                    Ver en Forja →
                  </button>
                  <button
                    onClick={() => handleTriggerSummon(lastSummonResponse.results.length === 1 ? 1 : 10)}
                    className="px-4 py-2 bg-[#FA9427] hover:bg-[#ffaa42] text-xs font-black uppercase border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Tirar de Nuevo
                  </button>
                  <button
                    onClick={() => setSummonStage('idle')}
                    className="px-4 py-2 bg-black text-white text-xs font-black uppercase border-2 border-black shadow-[2px_2px_0px_#FA9427] cursor-pointer"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. RATES PROBABILITIES MODAL */}
      {showRatesModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border-4 border-black p-5 shadow-[8px_8px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-black text-base uppercase text-black">Probabilidades de Invocación</h3>
              <button onClick={() => setShowRatesModal(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-purple-50 border border-black">
                <span className="font-black text-purple-900">UX (Ultra Secreto)</span>
                <span className="font-mono font-black text-purple-950">1.5%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-amber-50 border border-black">
                <span className="font-black text-amber-900">EX (Extremadamente Raro)</span>
                <span className="font-mono font-black text-amber-950">12.0%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-sky-50 border border-black">
                <span className="font-black text-sky-900">R (Raro)</span>
                <span className="font-mono font-black text-sky-950">25.0%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-emerald-50 border border-black">
                <span className="font-black text-emerald-900">UC (Infrecuente)</span>
                <span className="font-mono font-black text-emerald-950">31.5%</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-stone-100 border border-black">
                <span className="font-black text-stone-800">C (Común)</span>
                <span className="font-mono font-black text-stone-900">30.0%</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-600 bg-stone-100 p-2.5 border border-black space-y-1">
              <p>• <strong>Tirada x10:</strong> Garantiza al menos 1 figura de rareza R o superior en el slot final.</p>
              <p>• <strong>Pity System:</strong> Si alcanzas 40 tiradas sin una figura EX/UX, la siguiente tirada garantiza un EX o UX.</p>
            </div>

            <button
              onClick={() => setShowRatesModal(false)}
              className="w-full py-2 bg-black text-white font-black text-xs uppercase border-2 border-black cursor-pointer shadow-[2px_2px_0px_#FA9427]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* 5. BOTTOM BAR */}
      <footer className="max-w-6xl w-full mx-auto bg-[#111111] text-white p-2.5 md:px-4 border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between text-xs font-bold tracking-wider relative z-20 flex-wrap gap-2 mt-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#FA9427]" />
          <span className="text-stone-200 uppercase">
            SISTEMA OFICIAL DE INVOCACIÓN • KUCHIYOSE NO JUTSU
          </span>
        </div>
        <div className="text-amber-400 font-mono text-xs">
          SHINOBI DUEL • GACHA ENGINE V1.0
        </div>
      </footer>
    </div>
  );
};
