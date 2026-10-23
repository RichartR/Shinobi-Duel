import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'chronicle' | 'laws' | 'status'>('chronicle');

  return (
    <div className="bg-white border-3 border-black overflow-hidden shadow-[4px_4px_0px_#111111] max-h-[calc(100vh-90px)] flex flex-col select-none">
      {/* Top Header Banner */}
      <div className="h-8 bg-[#111111] border-b-3 border-black flex items-center justify-between px-3 text-[#FA9427] shrink-0">
        <span className="w-4 h-1.5 bg-[#FA9427]" />
        <span className="text-xs md:text-sm font-impact tracking-widest text-[#FA9427] uppercase">
          忍法典 • TACTICAL SCROLL & CHRONICLE
        </span>
        <span className="w-4 h-1.5 bg-[#FA9427]" />
      </div>

      {/* Action & Quick Pass Turn Bar */}
      <div className="p-2.5 md:p-3 bg-[#fdfbf7] border-b-2 border-black flex items-center justify-between gap-2 shrink-0">
        <div className="flex gap-1.5">
          <button
            onClick={() => setActiveTab('chronicle')}
            className={`px-2.5 py-1 text-xs font-impact uppercase tracking-wider border-2 transition-all cursor-pointer ${
              activeTab === 'chronicle'
                ? 'bg-[#FA9427] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'bg-white text-stone-700 border-2 border-black hover:bg-stone-100 shadow-[1px_1px_0px_#000]'
            }`}
          >
            📜 {t('chronicle.title')} ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('laws')}
            className={`px-2.5 py-1 text-xs font-impact uppercase tracking-wider border-2 transition-all cursor-pointer ${
              activeTab === 'laws'
                ? 'bg-[#FA9427] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'bg-white text-stone-700 border-2 border-black hover:bg-stone-100 shadow-[1px_1px_0px_#000]'
            }`}
          >
            ⚖️ {t('hierarchy.title')}
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`px-2.5 py-1 text-xs font-impact uppercase tracking-wider border-2 transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'bg-[#FA9427] text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'bg-white text-stone-700 border-2 border-black hover:bg-stone-100 shadow-[1px_1px_0px_#000]'
            }`}
          >
            🌀 {t('hierarchy.statusTitle')}
          </button>
        </div>

        <button
          onClick={onPassTurn}
          disabled={!canPassTurn}
          className="px-3.5 py-1.5 bg-[#FA9427] hover:bg-[#ffaa42] disabled:opacity-40 text-black text-xs font-impact uppercase tracking-wider border-2 border-black transition-all shadow-[2px_2px_0px_#000] cursor-pointer shrink-0"
        >
          {t('common.passTurn')}
        </button>
      </div>

      {/* Main Tab Content - Large, Readable Typography */}
      <div className="p-3 md:p-3.5 overflow-y-auto flex-1 bg-white text-stone-900">
        {/* TAB 1: LIVE CHRONICLE EVENTS */}
        {activeTab === 'chronicle' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-impact uppercase text-stone-600 border-b-2 border-black pb-1">
              <span>{t('chronicle.title')}</span>
              <span>{t('chronicle.events', { count: logs.length })}</span>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {logs.map(entry => {
                let badgeStyle = 'bg-stone-200 text-black';
                let textStyle = 'text-stone-900';
                if (entry.tone === 'highlight') {
                  badgeStyle = 'bg-amber-400 text-black';
                  textStyle = 'text-amber-950 font-black';
                }
                if (entry.tone === 'ko') {
                  badgeStyle = 'bg-red-600 text-white';
                  textStyle = 'text-red-700 font-black';
                }
                if (entry.tone === 'info') {
                  badgeStyle = 'bg-sky-500 text-white';
                  textStyle = 'text-sky-900 font-bold';
                }
                if (entry.tone === 'p1') {
                  badgeStyle = 'bg-[#0284c7] text-white';
                  textStyle = 'text-sky-950 font-bold';
                }
                if (entry.tone === 'p2') {
                  badgeStyle = 'bg-[#dc2626] text-white';
                  textStyle = 'text-red-950 font-bold';
                }

                return (
                  <div
                    key={entry.id}
                    className="p-2 bg-[#fbf9f5] border-2 border-black flex items-start gap-2 text-xs md:text-sm leading-snug transition-colors shadow-[2px_2px_0px_#000]"
                  >
                    <span className={`px-1.5 py-0.5 font-mono text-xs font-black border border-black shrink-0 shadow-[1px_1px_0px_#000] ${badgeStyle}`}>
                      T{entry.turn}
                    </span>
                    <span className={textStyle}>{entry.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: COMBAT LAWS HIERARCHY */}
        {activeTab === 'laws' && (
          <div className="space-y-2.5">
            <div className="text-xs font-impact uppercase text-stone-600 border-b-2 border-black pb-1">
              {t('hierarchy.title')}
            </div>

            <div className="space-y-2 text-xs md:text-sm font-medium">
              <div className="p-2.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-start gap-2.5">
                <span className="w-5 h-5 bg-[#0284c7] border-2 border-black shrink-0 mt-0.5 shadow-[1px_1px_0px_#000]" />
                <div>
                  <h4 className="text-xs md:text-sm font-impact text-[#0369a1] uppercase">{t('hierarchy.blueTitle')}</h4>
                  <p className="text-stone-800 text-xs md:text-sm mt-0.5 leading-relaxed">{t('hierarchy.blueDesc')}</p>
                </div>
              </div>

              <div className="p-2.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-start gap-2.5">
                <span className="w-5 h-5 bg-[#fa9427] border-2 border-black shrink-0 mt-0.5 shadow-[1px_1px_0px_#000]" />
                <div>
                  <h4 className="text-xs md:text-sm font-impact text-amber-800 uppercase">{t('hierarchy.goldTitle')}</h4>
                  <p className="text-stone-800 text-xs md:text-sm mt-0.5 leading-relaxed">{t('hierarchy.goldDesc')}</p>
                </div>
              </div>

              <div className="p-2.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-start gap-2.5">
                <span className="w-5 h-5 bg-[#9333ea] border-2 border-black shrink-0 mt-0.5 shadow-[1px_1px_0px_#000]" />
                <div>
                  <h4 className="text-xs md:text-sm font-impact text-purple-900 uppercase">{t('hierarchy.purpleTitle')}</h4>
                  <p className="text-stone-800 text-xs md:text-sm mt-0.5 leading-relaxed">{t('hierarchy.purpleDesc')}</p>
                </div>
              </div>

              <div className="p-2.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-start gap-2.5">
                <span className="w-5 h-5 bg-stone-100 border-2 border-black shrink-0 mt-0.5 shadow-[1px_1px_0px_#000]" />
                <div>
                  <h4 className="text-xs md:text-sm font-impact text-black uppercase">{t('hierarchy.whiteTitle')}</h4>
                  <p className="text-stone-800 text-xs md:text-sm mt-0.5 leading-relaxed">{t('hierarchy.whiteDesc')}</p>
                </div>
              </div>

              <div className="p-2.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000] flex items-start gap-2.5">
                <span className="w-5 h-5 bg-[#dc2626] border-2 border-black shrink-0 mt-0.5 shadow-[1px_1px_0px_#000]" />
                <div>
                  <h4 className="text-xs md:text-sm font-impact text-red-700 uppercase">{t('hierarchy.redTitle')}</h4>
                  <p className="text-stone-800 text-xs md:text-sm mt-0.5 leading-relaxed">{t('hierarchy.redDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STATUS CONDITIONS & ASSIST */}
        {activeTab === 'status' && (
          <div className="space-y-2.5">
            <div className="text-xs font-impact uppercase text-stone-600 border-b-2 border-black pb-1">
              {t('hierarchy.statusTitle')}
            </div>

            <div className="space-y-2 text-xs md:text-sm">
              <div className="p-2.5 bg-white text-stone-950 border-2 border-black shadow-[3px_3px_0px_#000]">
                <div className="flex items-center justify-between font-impact uppercase text-xs md:text-sm">
                  <span className="text-orange-700">炎 {t('status.burned')}</span>
                  <span className="text-xs font-mono font-bold text-stone-700">{t('hierarchy.burnSummary')}</span>
                </div>
                <div className="text-xs md:text-sm text-stone-800 mt-1 leading-relaxed font-medium">{t('hierarchy.burnDetail')}</div>
              </div>

              <div className="p-2.5 bg-white text-stone-950 border-2 border-black shadow-[3px_3px_0px_#000]">
                <div className="flex items-center justify-between font-impact uppercase text-xs md:text-sm">
                  <span className="text-amber-800">痺 {t('status.paralyzed')}</span>
                  <span className="text-xs font-mono font-bold text-stone-700">{t('hierarchy.paraSummary')}</span>
                </div>
                <div className="text-xs md:text-sm text-stone-800 mt-1 leading-relaxed font-medium">{t('hierarchy.paraDetail')}</div>
              </div>

              <div className="p-2.5 bg-white text-stone-950 border-2 border-black shadow-[3px_3px_0px_#000]">
                <div className="flex items-center justify-between font-impact uppercase text-xs md:text-sm">
                  <span className="text-purple-800">幻 {t('status.confused')}</span>
                  <span className="text-xs font-mono font-bold text-stone-700">{t('hierarchy.confSummary')}</span>
                </div>
                <div className="text-xs md:text-sm text-stone-800 mt-1 leading-relaxed font-medium">{t('hierarchy.confDetail')}</div>
              </div>

              <div className="p-2.5 bg-white text-stone-950 border-2 border-black shadow-[3px_3px_0px_#000]">
                <div className="flex items-center justify-between font-impact uppercase text-xs md:text-sm">
                  <span className="text-sky-800">砂 {t('status.frozen')}</span>
                  <span className="text-xs font-mono font-bold text-stone-700">{t('hierarchy.freezeSummary')}</span>
                </div>
                <div className="text-xs md:text-sm text-stone-800 mt-1 leading-relaxed font-medium">{t('hierarchy.freezeDetail')}</div>
              </div>

              <div className="p-2.5 bg-[#fffbeb] border-2 border-black shadow-[3px_3px_0px_#000]">
                <strong className="text-amber-800 font-impact uppercase tracking-wider text-xs md:text-sm">⏳ {t('hierarchy.waitTitle')}:</strong>
                <p className="text-xs md:text-sm text-stone-800 mt-0.5 leading-relaxed font-medium">{t('hierarchy.waitDetail')}</p>
              </div>

              <div className="p-2.5 bg-[#f0f9ff] border-2 border-black shadow-[3px_3px_0px_#000]">
                <strong className="text-sky-800 font-impact uppercase tracking-wider text-xs md:text-sm">🤝 {t('hierarchy.assistTitle')}:</strong>
                <p className="text-xs md:text-sm text-stone-800 mt-0.5 leading-relaxed font-medium">{t('hierarchy.assistDetail')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
