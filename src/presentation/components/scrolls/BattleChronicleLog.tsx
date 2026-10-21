import React from 'react';
import { GameLogEntry } from '../../../application/state/gameInitialState';

interface BattleChronicleLogProps {
  logs: GameLogEntry[];
  onPassTurn: () => void;
  canPassTurn: boolean;
}

export const BattleChronicleLog: React.FC<BattleChronicleLogProps> = ({
  logs,
  onPassTurn,
  canPassTurn,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Hierarchy Laws Card */}
      <div className="shadow-2xl">
        <div className="h-2.5 bg-gradient-to-r from-amber-700 via-[#281b12] to-amber-700 rounded-t border-b-2 border-stone-950" />
        <div className="bg-[#f4ebd9] text-stone-900 p-3.5 border-x-4 border-[#281b12]">
          <div className="flex items-center justify-between border-b-2 border-stone-800/30 pb-2 mb-2.5">
            <h3 className="font-black text-xs text-stone-900 uppercase flex items-center gap-1.5">
              <span className="px-1 py-0.5 text-[10px] border-2 border-red-800 text-red-800 font-black">
                法
              </span>
              Jerarquía de Colores
            </h3>
            <button
              onClick={onPassTurn}
              disabled={!canPassTurn}
              className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-amber-300 text-[11px] font-bold transition shadow"
            >
              Pasar Turno
            </button>
          </div>

          <div className="space-y-1.5 text-[11px] font-medium text-stone-900">
            <div className="flex items-center gap-2 p-1.5 rounded bg-stone-900/10 border border-stone-800/20">
              <span className="w-3.5 h-3.5 rounded-sm bg-sky-600 border border-stone-900 shrink-0" />
              <span>
                <strong className="text-sky-900">Azul (Kawarimi):</strong> Esquiva e invalida cualquier ataque.
              </span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-stone-900/10 border border-stone-800/20">
              <span className="w-3.5 h-3.5 rounded-sm bg-amber-400 border border-stone-900 shrink-0" />
              <span>
                <strong className="text-amber-900">Dorado (Veloz):</strong> Destruye Jutsus Morados y vence a Blanco menor.
              </span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-stone-900/10 border border-stone-800/20">
              <span className="w-3.5 h-3.5 rounded-sm bg-purple-700 border border-stone-900 shrink-0" />
              <span>
                <strong className="text-purple-900">Morado (Jutsu ★):</strong> 0 DMG numérico; vence a Blanco y aplica estados.
              </span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-stone-900/10 border border-stone-800/20">
              <span className="w-3.5 h-3.5 rounded-sm bg-white border border-stone-900 shrink-0" />
              <span>
                <strong className="text-stone-950">Blanco (Físico):</strong> Gana el daño mayor.
              </span>
            </div>
          </div>

          {/* Status Effects Summary */}
          <div className="mt-2.5 pt-2 border-t border-stone-800/30 grid grid-cols-2 gap-1 text-[10px]">
            <div className="p-1 rounded bg-stone-900 text-amber-100">
              <strong className="text-orange-400">炎 Quemadura:</strong> -10 DMG + 1 sector a Rojo
            </div>
            <div className="p-1 rounded bg-stone-900 text-amber-100">
              <strong className="text-yellow-400">痺 Parálisis:</strong> Sector menor pasa a Rojo
            </div>
            <div className="p-1 rounded bg-stone-900 text-amber-100">
              <strong className="text-purple-300">幻 Confusión:</strong> Desvía giro +1 sector
            </div>
            <div className="p-1 rounded bg-stone-900 text-amber-100">
              <strong className="text-sky-300">砂 Arena:</strong> 100% Rojo hasta asistencia
            </div>
          </div>
        </div>
        <div className="h-2.5 bg-gradient-to-r from-amber-700 via-[#281b12] to-amber-700 rounded-b border-t-2 border-stone-950" />
      </div>

      {/* Battle Chronicle Log */}
      <div className="bg-gradient-to-b from-[#261911] to-[#170f0a] border-2 border-stone-700 rounded-lg p-3.5 flex flex-col max-h-[350px] shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-700 pb-2 mb-2">
          <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <span className="px-1 py-0.5 text-[10px] bg-red-950 text-red-400 border border-red-600 font-black">
              録
            </span>
            CRÓNICA DE LA ARENA CHUNIN
          </h3>
          <span className="text-[10px] text-stone-400">{logs.length} eventos</span>
        </div>
        <div className="overflow-y-auto space-y-1.5 pr-1 text-[11px] font-medium max-h-[280px]">
          {logs.map(entry => {
            let textStyle = 'text-stone-200';
            if (entry.tone === 'highlight') textStyle = 'text-amber-300 font-bold';
            if (entry.tone === 'ko') textStyle = 'text-red-400 font-bold';
            if (entry.tone === 'p1') textStyle = 'text-orange-300';
            if (entry.tone === 'p2') textStyle = 'text-red-300';

            return (
              <div
                key={entry.id}
                className={`p-1.5 rounded bg-stone-950/85 border border-stone-800 ${textStyle}`}
              >
                <span className="text-amber-600 font-bold mr-1">[T{entry.turn}]</span>
                {entry.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
