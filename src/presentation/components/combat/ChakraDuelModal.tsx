import React, { useState, useEffect, useRef } from 'react';
import { GameState } from '../../../application/state/gameInitialState';
import { WHEEL_COLORS, WheelSegment, ShinobiFigureState } from '../../../domain/models/ShinobiFigure';
import { ChakraDiskSVG } from '../wheel/ChakraDiskSVG';
import { CHAR_SVG_FALLBACKS, JUTSU_ANIME_CUTINS } from '../../../infrastructure/assets/animeAssets';
import { useTranslation } from '../../context/I18nContext';
import { getLocalizedFigure } from '../../../infrastructure/i18n/locales/figureI18n';

interface ChakraDuelModalProps {
  state: GameState;
  onRespin: () => void;
  onConfirmResolution: () => void;
}

export const ChakraDuelModal: React.FC<ChakraDuelModalProps> = ({
  state,
  onRespin,
  onConfirmResolution,
}) => {
  const { t, language } = useTranslation();
  const b = state.currentBattle;
  if (!b) return null;

  const attacker = getLocalizedFigure(b.attacker, language);
  const defender = getLocalizedFigure(b.defender, language);
  const { spinAttacker, spinDefender, outcome, revealed } = b;
  const rawHero = outcome?.hero || b.attacker;
  const hero = getLocalizedFigure(rawHero, language);
  const winningSeg = outcome?.seg || spinAttacker?.segment;
  const cutinArt = JUTSU_ANIME_CUTINS[winningSeg?.effect || hero.key] || JUTSU_ANIME_CUTINS.rasengan;

  const canRespin =
    revealed &&
    state.activeBuffs[attacker.owner]?.doubleChance &&
    !(state.mode === 'ai' && attacker.owner === 2);

  const prevBattleKeyRef = useRef<string | null>(null);
  const [atkAngle, setAtkAngle] = useState(0);
  const [defAngle, setDefAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);

  useEffect(() => {
    const battleKey = `${b.attackerId}_vs_${b.defenderId}_${b.atkRotations}`;
    const isNewDuel = prevBattleKeyRef.current !== `${b.attackerId}_vs_${b.defenderId}`;
    prevBattleKeyRef.current = `${b.attackerId}_vs_${b.defenderId}`;

    if (isNewDuel) {
      setAtkAngle(0);
      setDefAngle(0);
      setIsSpinning(true);

      let r2: number;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => {
          setAtkAngle(b.atkRotations);
          setDefAngle(b.defRotations);
        });
      });
      return () => {
        cancelAnimationFrame(r1);
        if (r2) cancelAnimationFrame(r2);
      };
    } else {
      setIsSpinning(true);
      setAtkAngle(b.atkRotations);
      setDefAngle(b.defRotations);
    }
  }, [b.attackerId, b.defenderId, b.atkRotations, b.defRotations]);

  useEffect(() => {
    if (revealed) {
      setIsSpinning(false);
    }
  }, [revealed]);

  const renderSpinBadge = (seg: WheelSegment, unit: ShinobiFigureState) => {
    const col = WHEEL_COLORS[seg.color];
    const burnPenalty = unit.status === 'burned' ? -10 : 0;
    const bonus =
      seg.color === 'white' || seg.color === 'gold'
        ? (state.activeBuffs[unit.owner]?.powerBonus || 0) + burnPenalty
        : 0;
    const totalPower = Math.max(0, seg.power + bonus);

    let valStr = '';
    if (seg.color === 'white' || seg.color === 'gold') {
      valStr = `${totalPower} DMG${bonus !== 0 ? ` (${bonus > 0 ? `+${bonus}` : bonus})` : ''}`;
    } else if (seg.color === 'purple') {
      valStr = `${'★'.repeat(seg.stars)} (0 DMG)`;
    } else if (seg.color === 'blue') {
      valStr = t('combat.dodge');
    } else {
      valStr = t('combat.miss');
    }

    const COLOR_LABELS: Record<string, string> = {
      white: t('combat.whiteLabel'),
      gold: t('combat.goldLabel'),
      purple: t('combat.purpleLabel'),
      blue: t('combat.blueLabel'),
      red: t('combat.redLabel'),
    };

    const locUnit = getLocalizedFigure(unit, language);
    const segName = locUnit.segments.find(s => s.color === seg.color && s.size === seg.size)?.name || seg.name;

    return (
      <div>
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span
            className="px-2 py-0.5 text-[10px] font-black uppercase border border-black shadow-[1px_1px_0px_#000]"
            style={{ background: col.fill, color: seg.color === 'white' || seg.color === 'gold' ? '#0f172a' : '#ffffff' }}
          >
            {COLOR_LABELS[seg.color] || col.label} • {valStr}
          </span>
          <span className="text-[10px] font-mono text-amber-300 bg-stone-900 px-1.5 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
            {seg.size}/96
          </span>
        </div>
        <div className="text-xs font-extrabold text-white mt-1">
          {segName}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto select-none" role="dialog" aria-modal="true">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] max-w-4xl w-full my-auto overflow-hidden animate-scale-up">
        {/* Top Header Banner */}
        <div className="bg-[#111111] border-b-3 border-black px-4 py-2.5 flex items-center justify-between text-[#FA9427]">
          <span className="w-5 h-2 bg-[#FA9427]" />
          <span className="text-xs md:text-sm font-impact tracking-widest text-[#FA9427] uppercase">
            忍術激突 • CHAKRA DUEL RESOLUTION
          </span>
          <span className="w-5 h-2 bg-[#FA9427]" />
        </div>

        <div className="bg-white text-stone-900 p-4 md:p-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 flex items-center justify-center border-2 border-black text-black font-kanji font-black text-2xl bg-[#FA9427] shadow-[2px_2px_0px_#000]">
                闘
              </span>
              <div>
                <h2 className="text-2xl md:text-3xl font-impact tracking-wider text-black uppercase leading-none">
                  {t('combat.duelTitle')}
                </h2>
                <p className="text-xs text-red-600 font-bold uppercase tracking-wider mt-0.5">
                  {t('combat.duelSubtitle')}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#FA9427] text-black text-xs font-impact uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000]">
              {t('combat.arenaDuelBadge')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Attacker Wheel (Player 1 Blue / Konoha) */}
            <div className="bg-[#fdfcf9] p-4 border-3 border-black shadow-[4px_4px_0px_#000] flex flex-col items-center">
              <div className="w-full flex items-center gap-3 border-b-2 border-black pb-2 mb-2">
                <div className="w-14 h-14 border-2 border-black bg-stone-900 overflow-hidden shadow-[2px_2px_0px_#000] shrink-0">
                  <img
                    src={attacker.portraitUrl || CHAR_SVG_FALLBACKS[attacker.key]}
                    alt={attacker.name}
                    className="w-full h-full object-cover object-top"
                    onError={e => {
                      e.currentTarget.src = CHAR_SVG_FALLBACKS[attacker.key] || '';
                    }}
                  />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <span className="px-2 py-0.5 text-[9px] font-impact uppercase bg-[#0284c7] text-white border border-black shadow-[1px_1px_0px_#000]">
                    {t('combat.attacker')} (P{attacker.owner})
                  </span>
                  <h3 className="text-base font-impact text-black uppercase tracking-wide truncate mt-0.5">
                    {attacker.name}
                  </h3>
                </div>
              </div>

              <div className="relative w-48 h-48 flex items-center justify-center my-1 bg-stone-100 border-2 border-black p-1 shadow-[2px_2px_0px_#000]">
                <div className={`absolute -top-3.5 z-20 drop-shadow transition-transform ${isSpinning ? 'animate-needle-vibe' : ''}`}>
                  <svg width="28" height="30" viewBox="0 0 24 28">
                    <circle cx="12" cy="4" r="3" fill="none" stroke="#fa9427" strokeWidth="2" />
                    <polygon points="12,27 5,9 12,12 19,9" fill="#dc2626" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <div
                  className={`w-44 h-44 rounded-full wheel-spin-transition ${
                    isSpinning ? 'ring-4 ring-[#fa9427]' : ''
                  }`}
                  style={{ transform: `rotate(${atkAngle}deg)` }}
                >
                  <ChakraDiskSVG figure={attacker} size={176} />
                </div>
              </div>

              <div className="w-full mt-2.5 p-2 bg-white border-2 border-black text-center min-h-[54px] flex flex-col justify-center shadow-[2px_2px_0px_#000]">
                {revealed && spinAttacker ? (
                  renderSpinBadge(spinAttacker.segment, attacker)
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-block w-3.5 h-3.5 border-2 border-[#fa9427] border-t-transparent animate-spin" />
                    <span className="text-xs text-stone-900 font-mono font-bold tracking-wide">
                      {t('combat.spinning')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Defender Wheel (Player 2 Red / Akatsuki) */}
            <div className="bg-[#fdfcf9] p-4 border-3 border-black shadow-[4px_4px_0px_#000] flex flex-col items-center">
              <div className="w-full flex items-center gap-3 border-b-2 border-black pb-2 mb-2">
                <div className="w-14 h-14 border-2 border-black bg-stone-900 overflow-hidden shadow-[2px_2px_0px_#000] shrink-0">
                  <img
                    src={defender.portraitUrl || CHAR_SVG_FALLBACKS[defender.key]}
                    alt={defender.name}
                    className="w-full h-full object-cover object-top"
                    onError={e => {
                      e.currentTarget.src = CHAR_SVG_FALLBACKS[defender.key] || '';
                    }}
                  />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <span className="px-2 py-0.5 text-[9px] font-impact uppercase bg-[#dc2626] text-white border border-black shadow-[1px_1px_0px_#000]">
                    {t('combat.defender')} (P{defender.owner})
                  </span>
                  <h3 className="text-base font-impact text-black uppercase tracking-wide truncate mt-0.5">
                    {defender.name}
                  </h3>
                </div>
              </div>

              <div className="relative w-48 h-48 flex items-center justify-center my-1 bg-stone-100 border-2 border-black p-1 shadow-[2px_2px_0px_#000]">
                <div className={`absolute -top-3.5 z-20 drop-shadow transition-transform ${isSpinning ? 'animate-needle-vibe' : ''}`}>
                  <svg width="28" height="30" viewBox="0 0 24 28">
                    <circle cx="12" cy="4" r="3" fill="none" stroke="#dc2626" strokeWidth="2" />
                    <polygon points="12,27 5,9 12,12 19,9" fill="#dc2626" stroke="#111111" strokeWidth="1.5" />
                  </svg>
                </div>
                <div
                  className={`w-44 h-44 rounded-full wheel-spin-transition ${
                    isSpinning ? 'ring-4 ring-red-500' : ''
                  }`}
                  style={{ transform: `rotate(${defAngle}deg)` }}
                >
                  <ChakraDiskSVG figure={defender} size={176} />
                </div>
              </div>

              <div className="w-full mt-2.5 p-2 bg-white border-2 border-black text-center min-h-[54px] flex flex-col justify-center shadow-[2px_2px_0px_#000]">
                {revealed && spinDefender ? (
                  renderSpinBadge(spinDefender.segment, defender)
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-block w-3.5 h-3.5 border-2 border-red-500 border-t-transparent animate-spin" />
                    <span className="text-xs text-stone-900 font-mono font-bold tracking-wide">
                      {t('combat.spinning')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Outcome & Cut-in Banner - Sharp Manga Panel */}
          {revealed && outcome && (
            <div className="mt-4 p-4 bg-[#fff8ee] border-3 border-black text-stone-950 flex flex-col md:flex-row items-center gap-4 shadow-[4px_4px_0px_#000]">
              <div className="w-full md:w-36 h-18 overflow-hidden border-2 border-black shrink-0 shadow-[2px_2px_0px_#000]">
                <img src={cutinArt} alt="Jutsu Art" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="text-[10px] uppercase font-impact tracking-wider text-red-700">
                  【 {t('combat.outcomeTitle')} 】
                </span>
                <p className="text-sm md:text-base font-impact uppercase tracking-wide text-black mt-0.5">
                  {outcome.reason}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {canRespin && (
                  <button
                    onClick={onRespin}
                    className="manga-btn-white px-3 py-2 text-xs font-impact uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                  >
                    {t('combat.respinButton')}
                  </button>
                )}
                <button
                  onClick={onConfirmResolution}
                  className="manga-btn-orange px-5 py-2.5 text-xs font-impact uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
                >
                  {t('combat.confirmResolution')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
