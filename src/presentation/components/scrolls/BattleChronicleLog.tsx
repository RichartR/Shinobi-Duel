import React from 'react';
import { GameLogEntry } from '../../../application/state/gameInitialState';
import { useTranslation } from '../../context/I18nContext';

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
  const { t } = useTranslation();

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
              {t('hierarchy.title')}
            </h3>
            <button
              onClick={onPassTurn}
              disabled={!canPassTurn}
              className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-amber-300 text-[11px] font-bold transition shadow"
            >
              {t('common.passTurn')}
            </button>
          </div>

          <div className="space-y-1.5 text-[11px] font-medium text-stone-900">
            <div className="flex items-center gap-2 p-1.5 rounded bg-stone-900/10 border border-stone-800/20">
              <span className="w-3.5 h-3.5 rounded-sm bg-sky-600 border border-stone-900 shrink-0" />
              <span>
                <strong className="text-sky-900">{t('hierarchy.blueTitle')}:</strong> {t('hierarchy.blueDesc')}
              </span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-stone-900/10 border border-stone-800/20">
              <span className="w-3.5 h-3.5 rounded-sm bg-amber-400 border border-stone-900 shrink-0" />
              <span>
                <strong className="text-amber-900">{t('hierarchy.goldTitle')}:</strong> {t('hierarchy.goldDesc')}
              </span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-stone-900/10 border border-stone-800/20">
              <span className="w-3.5 h-3.5 rounded-sm bg-purple-700 border border-stone-900 shrink-0" />
              <span>
                <strong className="text-purple-900">{t('hierarchy.purpleTitle')}:</strong> {t('hierarchy.purpleDesc')}
              </span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-stone-900/10 border border-stone-800/20">
              <span className="w-3.5 h-3.5 rounded-sm bg-white border border-stone-900 shrink-0" />
              <span>
                <strong className="text-stone-950">{t('hierarchy.whiteTitle')}:</strong> {t('hierarchy.whiteDesc')}
              </span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded bg-stone-900/10 border border-stone-800/20">
              <span className="w-3.5 h-3.5 rounded-sm bg-red-600 border border-stone-900 shrink-0" />
              <span>
                <strong className="text-red-900">{t('hierarchy.redTitle')}:</strong> {t('hierarchy.redDesc')}
              </span>
            </div>
          </div>

          {/* Status Effects Summary */}
          <div className="mt-3 pt-2.5 border-t-2 border-stone-800/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase text-red-900 tracking-wider flex items-center gap-1">
                <span>印</span>
                {t('hierarchy.statusTitle')}
              </span>
            </div>

            <div className="space-y-1.5 text-[10px]">
              <div className="p-1.5 rounded bg-stone-900 text-stone-100 border-l-4 border-orange-500">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-orange-400">炎 {t('status.burned').split(' ')[0]}</span>
                  <span className="text-[9px] text-orange-200/90 font-mono">{t('hierarchy.burnSummary')}</span>
                </div>
                <div className="text-[9.5px] text-stone-300 mt-0.5 leading-snug">{t('hierarchy.burnDetail')}</div>
              </div>

              <div className="p-1.5 rounded bg-stone-900 text-stone-100 border-l-4 border-yellow-400">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-yellow-400">痺 {t('status.paralyzed').split(' ')[0]}</span>
                  <span className="text-[9px] text-yellow-200/90 font-mono">{t('hierarchy.paraSummary')}</span>
                </div>
                <div className="text-[9.5px] text-stone-300 mt-0.5 leading-snug">{t('hierarchy.paraDetail')}</div>
              </div>

              <div className="p-1.5 rounded bg-stone-900 text-stone-100 border-l-4 border-purple-400">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-purple-300">幻 {t('status.confused').split(' ')[0]}</span>
                  <span className="text-[9px] text-purple-200/90 font-mono">{t('hierarchy.confSummary')}</span>
                </div>
                <div className="text-[9.5px] text-stone-300 mt-0.5 leading-snug">{t('hierarchy.confDetail')}</div>
              </div>

              <div className="p-1.5 rounded bg-stone-900 text-stone-100 border-l-4 border-sky-400">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-sky-300">砂 {t('status.frozen').split(' ')[0]}</span>
                  <span className="text-[9px] text-sky-200/90 font-mono">{t('hierarchy.freezeSummary')}</span>
                </div>
                <div className="text-[9.5px] text-stone-300 mt-0.5 leading-snug">{t('hierarchy.freezeDetail')}</div>
              </div>
            </div>

            {/* Wait & Assist Mechanics Badges */}
            <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[9px]">
              <div className="p-1 rounded bg-stone-950/80 border border-amber-600/50 text-stone-300">
                <strong className="text-amber-400">⏳ {t('hierarchy.waitTitle')}:</strong> {t('hierarchy.waitDetail')}
              </div>
              <div className="p-1 rounded bg-stone-950/80 border border-sky-600/50 text-stone-300">
                <strong className="text-sky-300">🤝 {t('hierarchy.assistTitle')}:</strong> {t('hierarchy.assistDetail')}
              </div>
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
            {t('chronicle.title')}
          </h3>
          <span className="text-[10px] text-stone-400">{t('chronicle.events', { count: logs.length })}</span>
        </div>
        <div className="overflow-y-auto space-y-1.5 pr-1 text-[11px] font-medium max-h-[280px]">
          {logs.map(entry => {
            let textStyle = 'text-stone-200';
            if (entry.tone === 'highlight') textStyle = 'text-amber-300 font-bold';
            if (entry.tone === 'ko') textStyle = 'text-red-400 font-black';
            if (entry.tone === 'info') textStyle = 'text-sky-300 font-bold';
            if (entry.tone === 'p1') textStyle = 'text-sky-200';
            if (entry.tone === 'p2') textStyle = 'text-red-200';

            return (
              <div key={entry.id} className="flex items-start gap-1.5 leading-snug">
                <span className="text-[9px] font-mono text-stone-500 shrink-0">
                  T{entry.turn}
                </span>
                <span className={textStyle}>{entry.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
