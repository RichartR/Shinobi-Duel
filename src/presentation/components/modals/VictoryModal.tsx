import React from 'react';

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
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="max-w-md w-full">
        <div className="h-3 bg-gradient-to-r from-amber-600 via-[#281b12] to-amber-600 rounded-t" />
        <div className="bg-[#f4ebd9] p-6 text-center border-4 border-amber-700 text-stone-900 shadow-2xl">
          <div className="w-16 h-16 border-4 border-red-800 text-red-800 font-black text-3xl flex items-center justify-center mx-auto mb-3 bg-red-50">
            勝
          </div>
          <h2 className="text-2xl font-black text-stone-900">
            {winner === 1 ? '¡VICTORIA DE LA HOJA (J1)!' : '¡VICTORIA DE AKATSUKI (J2)!'}
          </h2>
          <p className="text-sm font-bold text-red-900 mt-2 mb-6">{victoryReason}</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={onReset}
              className="w-full py-3 rounded bg-red-800 hover:bg-red-700 text-amber-100 font-black uppercase tracking-wider text-xs border-2 border-amber-500 shadow-lg transition"
            >
              Nuevo Duelo en la Arena
            </button>
            <button
              onClick={onReturnToMenu}
              className="w-full py-2.5 rounded bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs border border-stone-700 transition"
            >
              Volver al Menú Principal
            </button>
          </div>
        </div>
        <div className="h-3 bg-gradient-to-r from-amber-600 via-[#281b12] to-amber-600 rounded-b" />
      </div>
    </div>
  );
};
