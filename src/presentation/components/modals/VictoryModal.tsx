import React from 'react';
import { useTranslation } from '../../context/I18nContext';

interface VictoryModalProps {
  winner: 1 | 2;
  victoryReason: string;
  onReset: () => void;
  onReturnToMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  victoryReason,
  onReset,
  onReturnToMenu,
}) => {
  const { t } = useTranslation();

  const getLocalizedVictoryReason = (reason: string) => {
    if (reason.includes('Conquista') || reason.includes('Conquest') || reason.includes('本陣制圧')) {
      return t('victory.baseConquest');
    }
    if (reason.includes('Rodeo') || reason.includes('Surround') || reason.includes('包囲')) {
      return t('victory.surroundKo');
    }
    if (reason.includes('Asedio') || reason.includes('Siege') || reason.includes('完全包囲')) {
      return t('victory.totalSiege');
    }
    return reason;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="max-w-md w-full">
        <div className="h-3 bg-gradient-to-r from-amber-600 via-[#281b12] to-amber-600 rounded-t" />
        <div className="bg-[#f4ebd9] p-6 text-center border-4 border-amber-700 text-stone-900 shadow-2xl">
          <div className="w-16 h-16 border-4 border-red-800 text-red-800 font-black text-3xl flex items-center justify-center mx-auto mb-3 bg-red-50">
            勝
          </div>
          <h2 className="text-2xl font-black text-stone-900">
            {winner === 1 ? `${t('victory.victoryTitle')} (${t('common.player1')})` : `${t('victory.defeatTitle')} (${t('common.player2')})`}
          </h2>
          <p className="text-sm font-bold text-red-900 mt-2 mb-6">
            {getLocalizedVictoryReason(victoryReason)}
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={onReset}
              className="w-full py-3 rounded bg-red-800 hover:bg-red-700 text-amber-100 font-black uppercase tracking-wider text-xs border-2 border-amber-500 shadow-lg transition"
            >
              {t('victory.playAgain')}
            </button>
            <button
              onClick={onReturnToMenu}
              className="w-full py-2.5 rounded bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs border border-stone-700 transition"
            >
              {t('victory.mainMenu')}
            </button>
          </div>
        </div>
        <div className="h-3 bg-gradient-to-r from-amber-600 via-[#281b12] to-amber-600 rounded-b" />
      </div>
    </div>
  );
};
