import React from 'react';
import { BookOpen, Users, Volume2, VolumeX, RotateCcw, Home } from 'lucide-react';
import { GameState } from '../../../application/state/gameInitialState';
import { useTranslation } from '../../context/I18nContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  state: GameState;
  onOpenCodexModal: () => void;
  onToggleMode: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetGame: () => void;
  onReturnToMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onOpenCodexModal,
  onToggleMode,
  isMuted,
  onToggleMute,
  onResetGame,
  onReturnToMenu,
}) => {
  const { t } = useTranslation();

  return (
    <header className="bg-[#111111] border-b-3 border-black px-3 md:px-4 py-1.5 sticky top-0 z-30 shadow-[3px_3px_0px_#000]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 md:gap-3 flex-nowrap">
        {/* Konoha Plaque & Title */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReturnToMenu}
            title={t('common.backToMenu')}
            className="manga-btn-white p-1.5 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center cursor-pointer transition-all"
          >
            <Home className="w-4 h-4 text-stone-900" />
          </button>
          
          {/* Authentic Sharp Metal Headband Plate */}
          <div className="ninja-headband-plate px-2 py-0.5 flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_#000]">
            <span className="w-1 h-1 bg-slate-900 shadow-inner" />
            <svg className="w-4 h-4 text-slate-950 filter drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.8">
              <path d="M21 19c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5z" />
              <path d="M21 19c0 5-4 9-9 9s-9-4-9-9 4-9 9-9c3.8 0 7.2 1.8 11 1.5l8-4.5-3.5 9.5C26 22 21 26 15 27" />
              <path d="M4 28l6-4" strokeLinecap="round" />
            </svg>
            <span className="w-1 h-1 bg-slate-900 shadow-inner" />
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-impact tracking-wider text-[#FA9427] drop-shadow-[1px_1px_0px_#000] leading-none">
              SHINOBI DUEL
            </h1>
            <span className="hidden sm:inline-block px-1.5 py-0.5 bg-[#FA9427] text-black text-[11px] font-black uppercase tracking-wider border border-black shadow-[1px_1px_0px_#000]">
              CHUNIN ARENA
            </span>
          </div>
        </div>

        {/* Dynamic Turn Status Banner - Sharp Manga Panel */}
        <div
          className="px-2.5 py-1 flex items-center gap-2 border-2 border-black bg-white shadow-[2px_2px_0px_#000] transition-colors shrink-0"
        >
          <span
            className={`w-6 h-6 flex items-center justify-center font-kanji font-black text-xs border border-black text-white shadow-[1px_1px_0px_#000] ${
              state.turnPlayer === 1
                ? 'bg-[#0284c7]'
                : 'bg-[#dc2626]'
            }`}
          >
            {state.turnPlayer === 1 ? '火' : '暁'}
          </span>
          
          <div className="flex items-center gap-1.5">
            <span className="text-xs md:text-sm font-impact tracking-wider text-black uppercase">
              {state.turnPlayer === 1
                ? `${t('header.turnCount')} ${state.turnCount}: KONOHA (${t('common.player1')})`
                : state.mode === 'ai'
                ? `${t('header.turnCount')} ${state.turnCount}: AKATSUKI (${t('common.ai')})...`
                : `${t('header.turnCount')} ${state.turnCount}: AKATSUKI (${t('common.player2')})`}
            </span>
            {state.turnCount === 1 && (
              <span className="px-1.5 py-0.2 text-[10px] font-black bg-red-600 text-white border border-black uppercase">
                -1 MP
              </span>
            )}
          </div>
        </div>

        {/* Navigation & Action Controls - Sharp Comic Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <LanguageSwitcher compact />
          
          <button
            onClick={onOpenCodexModal}
            title={t('common.characterCodex')}
            className="manga-btn-white px-2.5 py-1 text-xs font-impact tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] transition-all flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-stone-900" />
            <span className="hidden lg:inline uppercase">{t('common.characterCodex')}</span>
          </button>

          <button
            onClick={onToggleMode}
            title={state.mode === 'ai' ? t('common.playVsAi') : t('common.playLocal2P')}
            className="manga-btn-white px-2.5 py-1 text-xs font-impact tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] transition-all flex items-center gap-1 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-stone-900" />
            <span className="hidden md:inline uppercase">{state.mode === 'ai' ? t('common.playVsAi') : t('common.playLocal2P')}</span>
          </button>

          <button
            onClick={onToggleMute}
            aria-label={isMuted ? t('header.soundOn') : t('header.soundOff')}
            className="manga-btn-white p-1.5 border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center cursor-pointer transition-all"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-600" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-700" />}
          </button>

          <button
            onClick={onResetGame}
            title={t('common.restart')}
            className="manga-btn-orange px-2.5 py-1 text-xs font-impact tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] transition-all flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline uppercase text-black">{t('common.restart')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
