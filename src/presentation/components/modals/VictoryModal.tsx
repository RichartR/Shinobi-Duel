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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none" role="dialog" aria-modal="true">
      <div className="bg-white border-4 border-black overflow-hidden shadow-[8px_8px_0px_#000] max-w-md w-full animate-scale-up">
        {/* Top Header Banner */}
        <div className="bg-[#111111] border-b-3 border-black px-4 py-2.5 flex items-center justify-between text-[#FA9427]">
          <span className="w-5 h-2 bg-[#FA9427]" />
          <span className="text-xs font-impact tracking-widest text-[#FA9427] uppercase">
            決闘終結 • DUEL CONCLUDED
          </span>
          <span className="w-5 h-2 bg-[#FA9427]" />
        </div>

        <div className="bg-white p-6 text-center text-stone-900">
          <div className="w-16 h-16 border-3 border-black text-black font-kanji font-black text-4xl flex items-center justify-center mx-auto mb-3 bg-[#FA9427] shadow-[3px_3px_0px_#000]">
            勝
          </div>
          <h2 className="text-2xl md:text-3xl font-impact tracking-wider text-black uppercase">
            {winner === 1 ? `${t('victory.victoryTitle')} (${t('common.player1')})` : `${t('victory.defeatTitle')} (${t('common.player2')})`}
          </h2>
          <div className="text-xs font-impact uppercase tracking-wider text-red-700 bg-red-50 border-2 border-black p-2.5 my-4 shadow-[2px_2px_0px_#000]">
            {getLocalizedVictoryReason(victoryReason)}
          </div>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={onReset}
              className="manga-btn-orange w-full py-3 font-impact uppercase tracking-wider text-xs border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
            >
              {t('victory.playAgain')}
            </button>
            <button
              onClick={onReturnToMenu}
              className="manga-btn-white w-full py-2.5 font-impact uppercase tracking-wider text-xs border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              {t('victory.mainMenu')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
