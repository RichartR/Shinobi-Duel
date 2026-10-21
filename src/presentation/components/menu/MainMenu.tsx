import React from 'react';
import { Play, BookOpen, Users, Layers, Volume2, VolumeX, Shield, Award } from 'lucide-react';

interface MainMenuProps {
  onStartGame: (mode: 'ai' | 'local') => void;
  onOpenGuide: () => void;
  onOpenCodex: () => void;
  onOpenArch: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenGuide,
  onOpenCodex,
  onOpenArch,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[#140e0a] -z-20" />
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 25%, rgba(220, 38, 38, 0.2), transparent 60%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.15), transparent 50%), repeating-linear-gradient(45deg, #18110c 0px, #18110c 16px, #140e0a 16px, #140e0a 32px)',
        }}
      />

      {/* Top Bar with Audio Toggle */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-4 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-sm bg-gradient-to-br from-red-800 to-amber-900 border-2 border-amber-500/80 flex items-center justify-center text-amber-200 font-kanji font-black text-lg shadow">
            忍
          </span>
          <span className="text-xs uppercase tracking-widest font-black text-amber-400">
            SHINOBI DUEL • EXAMEN CHUNIN
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenArch}
            className="px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold border border-amber-600/70 flex items-center gap-1.5 transition"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Arquitectura Clean</span>
          </button>
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-2 rounded bg-stone-900 hover:bg-stone-800 text-amber-200 border border-stone-700 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Center Hero Card */}
      <main className="max-w-3xl w-full mx-auto my-auto py-8">
        <div className="shadow-2xl">
          <div className="h-3 bg-gradient-to-r from-amber-700 via-red-900 to-amber-700 rounded-t border-b-2 border-stone-950" />
          <div className="bg-[#f4ebd9] text-stone-900 p-6 md:p-10 border-x-4 border-[#281b12]">
            {/* Konoha Leaf Protector Plaque */}
            <div className="flex items-center justify-center mb-6">
              <div className="px-5 py-2 rounded flex items-center gap-3 border-2 border-slate-800 bg-gradient-to-br from-slate-400 via-slate-200 to-slate-500 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-slate-900" />
                <svg className="w-8 h-8 text-slate-900" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 19c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5z" />
                  <path d="M21 19c0 5-4 9-9 9s-9-4-9-9 4-9 9-9c3.8 0 7.2 1.8 11 1.5l8-4.5-3.5 9.5C26 22 21 26 15 27" />
                  <path d="M4 28l6-4" strokeLinecap="round" />
                </svg>
                <span className="w-2 h-2 rounded-full bg-slate-900" />
              </div>
            </div>

            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl md:text-5xl font-black tracking-wider text-stone-900 uppercase font-sans">
                SHINOBI DUEL
              </h1>
              <div className="flex items-center justify-center gap-2">
                <span className="h-px w-10 bg-red-900" />
                <p className="text-xs md:text-sm font-black uppercase text-red-900 tracking-widest font-kanji">
                  中忍試験 • 盤上戦術 — TABLERO TÁCTICO NINJA
                </p>
                <span className="h-px w-10 bg-red-900" />
              </div>
              <p className="text-xs md:text-sm text-stone-700 max-w-lg mx-auto font-medium pt-1">
                Juego de tablero táctico ambientado en Naruto, con ruletas de chakra de 96 segmentos, capturas de base, jutsus morados y rodeo Fuinjutsu inspirado en Pokémon Duel.
              </p>
            </div>

            {/* Menu Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto">
              <button
                onClick={() => onStartGame('ai')}
                className="group p-4 rounded-lg bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-amber-100 border-2 border-amber-600 shadow-md transition flex items-center justify-between text-left"
              >
                <div>
                  <div className="text-xs font-black text-amber-300 uppercase tracking-wider">MODO PRINCIPAL</div>
                  <div className="text-lg font-black leading-tight">Vs IA Akatsuki</div>
                  <div className="text-[11px] text-amber-200/80 mt-0.5">Duelo táctico individual contra el bot</div>
                </div>
                <Play className="w-6 h-6 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onStartGame('local')}
                className="group p-4 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-100 border-2 border-stone-700 shadow-md transition flex items-center justify-between text-left"
              >
                <div>
                  <div className="text-xs font-black text-amber-400 uppercase tracking-wider">PASAR Y JUGAR</div>
                  <div className="text-lg font-black leading-tight">2 Jugadores Local</div>
                  <div className="text-[11px] text-stone-300 mt-0.5">Enfrentamiento en la misma pantalla</div>
                </div>
                <Users className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={onOpenGuide}
                className="group p-4 rounded-lg bg-[#ebdcc2] hover:bg-[#e4d1b1] text-stone-950 border-2 border-[#281b12] shadow transition flex items-center justify-between text-left"
              >
                <div>
                  <div className="text-xs font-black text-red-900 uppercase tracking-wider">APRENDE A JUGAR</div>
                  <div className="text-lg font-black leading-tight">Guía y Reglas Oficiales</div>
                  <div className="text-[11px] text-stone-700 mt-0.5">Jerarquía de colores, ruleta 96 y rodeo</div>
                </div>
                <BookOpen className="w-6 h-6 text-red-900 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenCodex}
                className="group p-4 rounded-lg bg-[#ebdcc2] hover:bg-[#e4d1b1] text-stone-950 border-2 border-[#281b12] shadow transition flex items-center justify-between text-left"
              >
                <div>
                  <div className="text-xs font-black text-amber-900 uppercase tracking-wider">PERSONAJES Y MAZO</div>
                  <div className="text-lg font-black leading-tight">Libro Bingo & Forja</div>
                  <div className="text-[11px] text-stone-700 mt-0.5">Catálogo, niveles Lv 1-5 y pergaminos</div>
                </div>
                <Award className="w-6 h-6 text-amber-900 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="h-3 bg-gradient-to-r from-amber-700 via-red-900 to-amber-700 rounded-b border-t-2 border-stone-950" />
        </div>
      </main>

      {/* Footer Details */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-stone-500 pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-amber-500" />
          Clean Architecture & DDD • Capas desacopladas
        </span>
        <span>Ruletas canónicas de 96 segmentos • Síntesis Web Audio procedural</span>
      </footer>
    </div>
  );
};
