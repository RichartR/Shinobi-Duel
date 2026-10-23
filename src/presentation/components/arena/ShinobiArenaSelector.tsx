import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  MapPin, 
  Play, 
  Gift, 
  CloudRain, 
  Wind, 
  Flame, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { 
  CANONICAL_ARENA_THEMES, 
  ArenaThemeItem 
} from '../../../domain/models/CraftingEconomy';
import { 
  shinobiDbRepository, 
  UserShinobiProfile 
} from '../../../infrastructure/repositories/SupabaseShinobiRepository';
import { soundEngine } from '../../../infrastructure/audio/ShinobiAudioEngine';
import { useTranslation } from '../../context/I18nContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { NarutoMangaBackground } from '../common/NarutoMangaBackground';

interface ShinobiArenaSelectorProps {
  onBackToMenu: () => void;
  onPlayGame: () => void;
  onArenaChanged?: (arenaKey: string) => void;
}

const PARTICLE_INFO: Record<ArenaThemeItem['particleType'], { label: string; icon: React.ReactNode; color: string }> = {
  falling_leaves: { label: 'Hojas de la Voluntad de Fuego', icon: <Wind className="w-3.5 h-3.5" />, color: '#FA9427' },
  rain: { label: 'Lluvia y Bruma Torrencial', icon: <CloudRain className="w-3.5 h-3.5" />, color: '#0284C7' },
  poison_mist: { label: 'Bruma Venenosa y Esporas', icon: <Sparkles className="w-3.5 h-3.5" />, color: '#16A34A' },
  sandstorm: { label: 'Tormenta de Arena Caliente', icon: <Wind className="w-3.5 h-3.5" />, color: '#EAB308' },
  none: { label: 'Atmósfera Serena', icon: <Shield className="w-3.5 h-3.5" />, color: '#78716c' },
};

export const ShinobiArenaSelector: React.FC<ShinobiArenaSelectorProps> = ({
  onBackToMenu,
  onPlayGame,
  onArenaChanged,
}) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserShinobiProfile>(() => shinobiDbRepository.getProfile());
  const [selectedInspectKey, setSelectedInspectKey] = useState<string>(profile.selectedArenaKey);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    shinobiDbRepository.saveProfile(profile);
  }, [profile]);

  const showToast = (text: string, type: 'success' | 'error') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const inspectedArena = CANONICAL_ARENA_THEMES.find(a => a.key === selectedInspectKey) || CANONICAL_ARENA_THEMES[0];
  const isUnlocked = inspectedArena.isUnlockedByDefault || profile.unlockedArenaKeys.includes(inspectedArena.key);
  const isActive = profile.selectedArenaKey === inspectedArena.key;

  const handleClaimRyoMission = () => {
    soundEngine.play('win');
    const updated: UserShinobiProfile = {
      ...profile,
      ryoCoins: profile.ryoCoins + 3000,
    };
    setProfile(updated);
    shinobiDbRepository.saveProfile(updated);
    showToast('¡Recompensa de misión ninja cobrada (+3,000 🪙 Ryo)!', 'success');
  };

  const handleUnlockArena = (arenaKey: string) => {
    const result = shinobiDbRepository.unlockArena(profile, arenaKey);
    if (!result.success) {
      soundEngine.play('ko');
      showToast(result.error || 'No se pudo desbloquear la arena', 'error');
      return;
    }

    soundEngine.play('win');
    setProfile(result.updatedProfile);
    if (onArenaChanged) onArenaChanged(arenaKey);
    showToast(`¡Arena "${inspectedArena.name}" desbloqueada y equipada para tus duelos!`, 'success');
  };

  const handleEquipArena = (arenaKey: string) => {
    const result = shinobiDbRepository.selectArena(profile, arenaKey);
    if (!result.success) {
      soundEngine.play('ko');
      showToast(result.error || 'No se pudo equipar la arena', 'error');
      return;
    }

    soundEngine.play('select');
    setProfile(result.updatedProfile);
    if (onArenaChanged) onArenaChanged(arenaKey);
    showToast(`¡Arena "${inspectedArena.name}" equipada como campo de batalla activo!`, 'success');
  };

  return (
    <div className="min-h-screen text-stone-900 flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none relative bg-transparent overflow-x-hidden">
      <NarutoMangaBackground />

      {/* 1. TOP OFFICIAL TOURNAMENT BAR */}
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
              場
            </span>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-impact text-[#FA9427] tracking-wider uppercase leading-none drop-shadow-[1px_1px_0px_#000]">
                CAMPOS DE BATALLA • SELECTOR DE ARENAS
              </h1>
              <p className="text-[10px] text-stone-300 font-bold uppercase tracking-wider mt-0.5">
                PERSONALIZACIÓN VISUAL DEL TABLERO TÁCTICO CANÓNICO
              </p>
            </div>
          </div>
        </div>

        {/* Currency Display & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-stone-900 px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_#FA9427]">
            <span className="text-xs sm:text-sm font-black text-amber-400">🪙 {profile.ryoCoins.toLocaleString()} Ryo</span>
          </div>

          <button
            onClick={handleClaimRyoMission}
            className="px-2.5 py-1.5 bg-[#FA9427] hover:bg-[#ffaa42] text-black font-black text-xs uppercase border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
            title="Cobrar recompensa de misión para desbloquear arenas"
          >
            <Gift className="w-3.5 h-3.5" /> +3,000 🪙 Ryo
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

      {/* Feedback Toast */}
      {notification && (
        <div className={`max-w-6xl w-full mx-auto mt-2 p-2.5 border-3 border-black shadow-[4px_4px_0px_#000] text-xs sm:text-sm font-bold flex items-center gap-2 relative z-30 transition-all ${
          notification.type === 'success' ? 'bg-emerald-300 text-stone-950' : 'bg-red-400 text-stone-950'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* 2. MAIN WORKSPACE */}
      <main className="max-w-6xl w-full mx-auto my-2 md:my-3 relative z-20 flex-1 flex flex-col">
        <div className="bg-white border-4 border-black overflow-hidden shadow-[8px_8px_0px_#000] flex-1 flex flex-col p-4 sm:p-5 md:p-6 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start flex-1 overflow-y-auto">
            
            {/* Left Column: 5 Arenas Selection List (5 Cols) */}
            <div className="lg:col-span-5 space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b-2 border-black">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FA9427]" />
                  <h3 className="text-xs font-impact uppercase tracking-wider text-black">
                    CAMPOS CANÓNICOS ({CANONICAL_ARENA_THEMES.length})
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-stone-500 uppercase">
                  {profile.unlockedArenaKeys.length} / 5 DESBLOQUEADAS
                </span>
              </div>

              <div className="space-y-2">
                {CANONICAL_ARENA_THEMES.map(arena => {
                  const arenaUnlocked = arena.isUnlockedByDefault || profile.unlockedArenaKeys.includes(arena.key);
                  const arenaActive = profile.selectedArenaKey === arena.key;
                  const isInspected = selectedInspectKey === arena.key;
                  const pInfo = PARTICLE_INFO[arena.particleType];

                  return (
                    <button
                      key={arena.key}
                      onClick={() => {
                        soundEngine.play('select');
                        setSelectedInspectKey(arena.key);
                      }}
                      className={`w-full p-2.5 border-3 text-left flex items-center justify-between transition cursor-pointer relative overflow-hidden ${
                        isInspected
                          ? 'border-black bg-amber-50 shadow-[4px_4px_0px_#000]'
                          : 'border-stone-800 bg-white hover:bg-stone-50 shadow-[2px_2px_0px_#000]'
                      }`}
                    >
                      {/* Left Color Bar */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1.5"
                        style={{ backgroundColor: arena.gridGlowColor }}
                      />

                      <div className="flex items-center gap-3 min-w-0 pl-1.5">
                        <img
                          src={arena.backgroundUrl}
                          alt={arena.name}
                          className="w-14 h-14 object-cover border-2 border-black shrink-0 bg-stone-900 shadow-[1px_1px_0px_#000]"
                        />

                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-black uppercase truncate">
                              {arena.name}
                            </span>
                          </div>

                          <div className="text-[11px] font-bold text-stone-500 font-kanji mt-0.5">
                            {arena.jpName}
                          </div>

                          <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold">
                            <span className="flex items-center gap-1 text-stone-600">
                              {pInfo.icon}
                              <span className="truncate max-w-[140px]">{pInfo.label}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Badges */}
                      <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                        {arenaActive ? (
                          <span className="px-2 py-0.5 bg-black text-[#FA9427] font-impact text-[10px] uppercase border border-black shadow-[1px_1px_0px_#000]">
                            ✓ ACTIVA
                          </span>
                        ) : arenaUnlocked ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase border border-emerald-400">
                            LISTA
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-stone-900 text-amber-400 font-mono font-bold text-[10px] uppercase border border-black flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            {arena.unlockCostRyo.toLocaleString()} 🪙
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Arena Inspection & Dynamic Board Preview (7 Cols) */}
            <div className="lg:col-span-7 bg-[#fff8ee] text-stone-900 p-4 sm:p-5 border-3 border-black shadow-[4px_4px_0px_#000] flex flex-col justify-between space-y-4">
              
              <div>
                {/* Hero Artwork Header */}
                <div className="relative w-full h-44 sm:h-52 border-3 border-black overflow-hidden shadow-[3px_3px_0px_#000] group mb-3">
                  <img
                    src={inspectedArena.backgroundUrl}
                    alt={inspectedArena.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-black/30 to-transparent pointer-events-none" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                    <span 
                      className="px-2.5 py-0.5 text-xs font-black uppercase text-black border-2 border-black shadow-[2px_2px_0px_#000]"
                      style={{ backgroundColor: inspectedArena.gridGlowColor }}
                    >
                      {inspectedArena.jpName}
                    </span>
                    {isActive && (
                      <span className="px-2.5 py-0.5 text-xs font-black uppercase bg-black text-[#FA9427] border-2 border-black shadow-[2px_2px_0px_#000]">
                        ARENA ACTIVA EN COMBATE
                      </span>
                    )}
                  </div>

                  {/* Bottom Text in Image */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h2 className="text-xl sm:text-2xl font-impact tracking-wide uppercase drop-shadow-[2px_2px_0px_#000] leading-tight">
                      {inspectedArena.name}
                    </h2>
                  </div>
                </div>

                {/* Lore & Ambiance Details */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                    {inspectedArena.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-300 text-xs">
                    <div className="bg-white p-2 border-2 border-black flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded-full border border-black shrink-0" 
                        style={{ backgroundColor: inspectedArena.gridGlowColor }}
                      />
                      <span className="font-bold text-stone-800">
                        Color de Resplandor: <span className="font-mono">{inspectedArena.gridGlowColor}</span>
                      </span>
                    </div>

                    <div className="bg-white p-2 border-2 border-black flex items-center gap-2">
                      {PARTICLE_INFO[inspectedArena.particleType].icon}
                      <span className="font-bold text-stone-800">
                        Efecto Clima: <span className="text-stone-600">{PARTICLE_INFO[inspectedArena.particleType].label}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Equip or Unlock */}
              <div className="pt-3 border-t-2 border-black">
                {isActive ? (
                  <div className="w-full py-3 bg-stone-900 text-[#FA9427] font-impact text-sm uppercase tracking-wider text-center border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Esta arena ya está activa para todos tus duelos
                  </div>
                ) : isUnlocked ? (
                  <button
                    onClick={() => handleEquipArena(inspectedArena.key)}
                    className="w-full py-3 bg-[#FA9427] hover:bg-[#ffaa42] text-black font-impact text-sm uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Equipar "{inspectedArena.name}" para Duelos
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUnlockArena(inspectedArena.key)}
                      disabled={profile.ryoCoins < inspectedArena.unlockCostRyo}
                      className={`w-full py-3 text-sm font-impact uppercase tracking-wider border-2 border-black flex items-center justify-center gap-2 transition cursor-pointer ${
                        profile.ryoCoins >= inspectedArena.unlockCostRyo
                          ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-[3px_3px_0px_#000] active:scale-95'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed border-stone-300'
                      }`}
                    >
                      <Unlock className="w-4 h-4" />
                      Desbloquear por {inspectedArena.unlockCostRyo.toLocaleString()} 🪙 Ryo
                    </button>

                    {profile.ryoCoins < inspectedArena.unlockCostRyo && (
                      <p className="text-[11px] text-red-600 font-bold text-center">
                        Te faltan {(inspectedArena.unlockCostRyo - profile.ryoCoins).toLocaleString()} 🪙 Ryo. ¡Puedes reclamar recompensas de misión arriba!
                      </p>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>

    </div>
  );
};
