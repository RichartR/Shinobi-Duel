import React from 'react';
import { Layers, BookOpen, Users, Volume2, VolumeX, RotateCcw, Home } from 'lucide-react';
import { GameState } from '../../../application/state/gameInitialState';

interface HeaderProps {
  state: GameState;
  onOpenArchModal: () => void;
  onOpenCodexModal: () => void;
  onToggleMode: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetGame: () => void;
  onReturnToMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onOpenArchModal,
  onOpenCodexModal,
  onToggleMode,
  isMuted,
  onToggleMute,
  onResetGame,
  onReturnToMenu,
}) => {
  return (
    <header className="bg-gradient-to-b from-[#261911] to-[#170f0a] border-b-4 border-red-900 px-3 py-2 sticky top-0 z-30 shadow-xl">
      <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Konoha Plaque & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToMenu}
            title="Volver al Menú Principal"
            className="p-1.5 rounded bg-stone-900 hover:bg-stone-800 text-amber-300 border border-stone-700 transition"
          >
            <Home className="w-4 h-4" />
          </button>
          <div className="px-2.5 py-1.5 rounded flex items-center gap-2 border-2 border-slate-800 bg-gradient-to-br from-slate-400 via-slate-200 to-slate-500 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            <svg className="w-5 h-5 text-slate-900" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M21 19c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5z" />
              <path d="M21 19c0 5-4 9-9 9s-9-4-9-9 4-9 9-9c3.8 0 7.2 1.8 11 1.5l8-4.5-3.5 9.5C26 22 21 26 15 27" />
              <path d="M4 28l6-4" strokeLinecap="round" />
            </svg>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-black tracking-wider text-amber-400">
                SHINOBI DUEL
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-black bg-red-950 text-red-400 border border-red-600 rounded-sm">
                CLEAN ARCH
              </span>
            </div>
            <p className="text-[10px] text-amber-200/75 hidden sm:block -mt-0.5">
              中忍試験 • 盤上戦術 — Tablero Táctico de 28 Nodos
            </p>
          </div>
        </div>

        {/* Turn Status Washi Banner */}
        <div className="bg-[#f4ebd9] px-3 py-1 rounded flex items-center gap-2 border-2 border-amber-950 shadow">
          <span className="w-5 h-5 flex items-center justify-center border-2 border-red-700 text-red-700 font-black text-xs bg-red-50">
            {state.turnPlayer === 1 ? '火' : '暁'}
          </span>
          <span className="text-xs font-black tracking-wide text-stone-900">
            {state.turnPlayer === 1
              ? `TURNO ${state.turnCount}: KONOHA (J1)`
              : state.mode === 'ai'
              ? `TURNO ${state.turnCount}: AKATSUKI (IA)...`
              : `TURNO ${state.turnCount}: AKATSUKI (J2)`}
          </span>
          {state.turnCount === 1 && (
            <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-red-800 text-amber-100 rounded-sm">
              -1 MP
            </span>
          )}
        </div>

        {/* Navigation & Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={onOpenArchModal}
            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 border border-amber-300 text-xs font-black transition flex items-center gap-1 shadow"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Arquitectura</span>
          </button>
          <button
            onClick={onOpenCodexModal}
            className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-600 text-xs font-bold transition flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Libro Bingo</span>
          </button>
          <button
            onClick={onToggleMode}
            className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-600 text-xs font-bold transition flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>{state.mode === 'ai' ? 'Vs IA' : '2J Local'}</span>
          </button>
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-600 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <button
            onClick={onResetGame}
            className="px-2 py-1 rounded bg-red-900 hover:bg-red-800 text-red-100 border border-red-600 text-xs font-bold transition flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
