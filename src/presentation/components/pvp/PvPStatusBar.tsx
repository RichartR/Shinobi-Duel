import React, { useState, useEffect } from 'react';
import { Wifi, Swords, Flag, Clock } from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/ShinobiAudioEngine';
import { PvPRoomSession } from '../../../domain/models/PvPNetworkPayloads';

interface PvPStatusBarProps {
  session: PvPRoomSession;
  turnPlayer: 1 | 2;
  turnCount: number;
  onSurrender: () => void;
}

export const PvPStatusBar: React.FC<PvPStatusBarProps> = ({
  session,
  turnPlayer,
  turnCount,
  onSurrender,
}) => {
  const isMyTurn = session.localPlayerNumber === turnPlayer;
  const [secondsRemaining, setSecondsRemaining] = useState(45);
  const [showSurrenderConfirm, setShowSurrenderConfirm] = useState(false);

  // Reset timer on every turn change
  useEffect(() => {
    setSecondsRemaining(45);
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [turnCount, turnPlayer]);

  const handleConfirmSurrender = () => {
    soundEngine.play('ko');
    setShowSurrenderConfirm(false);
    onSurrender();
  };

  return (
    <div className="w-full bg-stone-900 border-b-3 border-black text-white px-3 py-2 flex items-center justify-between flex-wrap gap-2 text-xs shadow-md relative z-30">
      {/* Left: Room Badge & Player Identity */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-black border border-stone-700 shadow-sm">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono font-black text-amber-400 tracking-wider">
            SALA: {session.roomCode}
          </span>
        </div>

        <div className={`px-2 py-1 font-black text-[11px] border border-black uppercase ${
          session.localPlayerNumber === 1
            ? 'bg-blue-600 text-white'
            : 'bg-rose-600 text-white'
        }`}>
          Eres Jugador {session.localPlayerNumber} ({session.localPlayerNumber === 1 ? 'Azul' : 'Rojo'})
        </div>
      </div>

      {/* Center: Turn Status & Countdown */}
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1 border-2 border-black font-black uppercase text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#000] ${
          isMyTurn
            ? 'bg-[#FA9427] text-black animate-pulse'
            : 'bg-stone-800 text-stone-300'
        }`}>
          <Swords className="w-4 h-4" />
          {isMyTurn ? '¡Es Tu Turno Ninja!' : `Turno de ${session.opponentUsername}`}
        </div>

        <div className={`flex items-center gap-1 px-2.5 py-1 border font-mono font-black text-xs ${
          secondsRemaining <= 10
            ? 'bg-red-900/80 text-red-200 border-red-500 animate-bounce'
            : 'bg-black text-stone-200 border-stone-700'
        }`}>
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{secondsRemaining}s</span>
        </div>
      </div>

      {/* Right: Surrender Button */}
      <div className="flex items-center gap-2">
        {!showSurrenderConfirm ? (
          <button
            onClick={() => setShowSurrenderConfirm(true)}
            className="px-2.5 py-1 min-h-[36px] bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-600 flex items-center gap-1.5 font-bold transition cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5 text-stone-400" /> Rendirse
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-red-950 p-1 border border-red-600 animate-in fade-in">
            <span className="text-[10px] font-bold text-red-200 px-1">¿Confirmar?</span>
            <button
              onClick={handleConfirmSurrender}
              className="px-2 py-0.5 min-h-[30px] bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase border border-black cursor-pointer"
            >
              Sí, Rendirme
            </button>
            <button
              onClick={() => setShowSurrenderConfirm(false)}
              className="px-2 py-0.5 min-h-[30px] bg-stone-700 hover:bg-stone-600 text-white font-bold text-[10px] uppercase border border-black cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
