import React, { useEffect, useState } from 'react';
import { Sparkles, Zap, Play } from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/ShinobiAudioEngine';
import { CHAR_SVG_FALLBACKS, JUTSU_ANIME_CUTINS } from '../../../infrastructure/assets/animeAssets';

interface NarutoIntroCutsceneProps {
  onComplete: () => void;
}

export const NarutoIntroCutscene: React.FC<NarutoIntroCutsceneProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'charging' | 'slash' | 'rasengan' | 'burst'>('charging');

  useEffect(() => {
    // Sound & phase timeline
    soundEngine.play('jutsu');

    const t1 = setTimeout(() => {
      setPhase('slash');
    }, 600);

    const t2 = setTimeout(() => {
      setPhase('rasengan');
    }, 1200);

    const t3 = setTimeout(() => {
      setPhase('burst');
    }, 2800);

    const t4 = setTimeout(() => {
      onComplete();
    }, 3400);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] flex items-center justify-center overflow-hidden select-none">
      {/* 1. Manga Radiating Speedlines Background */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'repeating-conic-gradient(from 0deg, #1e293b 0deg 2deg, transparent 2deg 6deg)',
        }}
      />

      {/* 2. Skip Button */}
      <button
        onClick={onComplete}
        className="absolute top-4 right-4 z-50 bg-black/80 hover:bg-[#FA9427] text-white hover:text-black border-2 border-white px-3 py-1 font-impact tracking-wider text-sm transition-all cursor-pointer shadow-[3px_3px_0px_#FA9427]"
      >
        SALTAR INTRO [ESC] ✕
      </button>

      {/* PHASE 1: CHARGING CHAKRA */}
      {phase === 'charging' && (
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
          <div className="w-20 h-20 border-4 border-[#FA9427] bg-black flex items-center justify-center shadow-[0_0_30px_#FA9427]">
            <span className="font-kanji text-5xl text-[#FA9427] font-black">忍</span>
          </div>
          <div className="font-impact text-2xl text-stone-300 tracking-widest uppercase">
            CONCENTRANDO CHAKRA...
          </div>
          <div className="font-kanji text-4xl text-amber-500 font-black animate-bounce">
            ゴゴゴゴ...
          </div>
        </div>
      )}

      {/* PHASE 2: LIGHTNING SLASH */}
      {phase === 'slash' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform -rotate-12 shadow-[0_0_30px_#38bdf8] scale-150 animate-ping" />
          <div className="absolute font-impact text-7xl md:text-9xl text-white tracking-widest uppercase transform rotate-[-6deg] drop-shadow-[5px_5px_0px_#0284c7]">
            参上！！
          </div>
        </div>
      )}

      {/* PHASE 3: FULL RASENGAN CLASH & NARUTO CHARGE (REAL ANIME ARTWORK) */}
      {(phase === 'rasengan' || phase === 'burst') && (
        <div className="relative z-10 max-w-2xl w-full mx-auto p-4 flex flex-col items-center justify-center text-center animate-chakra-pulse">
          {/* Action Character Badge & Artwork */}
          <div className="relative mb-4">
            {/* Spinning Background Rasengan Glow */}
            <div className="absolute -inset-10 bg-sky-500/40 rounded-full filter blur-2xl animate-spin" />
            
            {/* Real Anime Illustration Container - Sharp Manga Frame */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 border-4 border-black bg-stone-900 shadow-[8px_8px_0px_#FA9427] overflow-hidden transform -rotate-1">
              <img 
                src="/assets/naruto_hero.jpg" 
                alt="Naruto Uzumaki - Rasengan" 
                className="w-full h-full object-cover scale-105"
              />
            </div>

            {/* Sound Effect Kanji Seal */}
            <div className="absolute -bottom-3 -right-6 bg-red-600 text-white font-kanji font-black px-4 py-1 border-2 border-black shadow-[3px_3px_0px_#000] text-xl transform rotate-6 animate-bounce">
              ドォォン!!
            </div>
          </div>

          {/* Epic Manga Shout Out */}
          <div className="space-y-1.5 mt-2">
            <span className="bg-[#FA9427] text-black font-black font-kanji text-xs md:text-sm px-3.5 py-1 border-2 border-black inline-block uppercase tracking-wider shadow-[3px_3px_0px_#000]">
              うずまきナルト — 木ノ葉の忍
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-impact tracking-wider text-white uppercase drop-shadow-[4px_4px_0px_#dc2626]">
              ¡SHINOBI DUEL HA COMENZADO!
            </h2>
            <p className="text-stone-300 font-bold text-xs sm:text-sm tracking-wide">
              «¡Jamás retrocederé a mi palabra! ¡Ese es mi camino ninja!»
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
