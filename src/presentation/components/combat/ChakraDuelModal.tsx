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
            className="px-2 py-0.5 rounded-sm text-[10px] font-black uppercase"
            style={{ background: col.fill, color: seg.color === 'white' || seg.color === 'gold' ? '#0f172a' : '#ffffff' }}
          >
            {COLOR_LABELS[seg.color] || col.label} • {valStr}
          </span>
          <span className="text-[10px] font-mono text-amber-300 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-700">
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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="max-w-4xl w-full my-auto">
        <div className="h-3 bg-gradient-to-r from-amber-600 via-[#281b12] to-amber-600 rounded-t" />
        <div className="bg-[#f4ebd9] text-stone-900 p-4 md:p-6 border-4 border-stone-900 shadow-2xl">
          <div className="flex items-center justify-between border-b-2 border-stone-800/30 pb-2.5 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 flex items-center justify-center border-2 border-red-700 text-red-700 font-black text-base bg-red-100">
                闘
              </span>
              <div>
                <h2 className="text-lg md:text-2xl font-black text-stone-900 leading-none">
                  {t('combat.duelTitle')}
                </h2>
                <p className="text-xs text-red-900 font-bold">
                  {t('combat.duelSubtitle')}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-stone-900 text-amber-300 text-xs font-bold border border-amber-600">
              {t('combat.arenaDuelBadge')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Attacker Wheel */}
            <div className="bg-gradient-to-b from-[#261911] to-[#170f0a] rounded-lg p-3.5 border-2 border-amber-600 flex flex-col items-center">
              <div className="w-full flex items-center gap-3 border-b border-stone-700 pb-2 mb-2">
                <img
                  src={attacker.portraitUrl}
                  alt={attacker.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 bg-stone-800"
                  onError={e => {
                    e.currentTarget.src = CHAR_SVG_FALLBACKS[attacker.key] || '';
                  }}
                />
                <div className="text-left">
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-orange-600 text-white rounded-sm">
                    {t('combat.attacker')} (P{attacker.owner})
                  </span>
                  <h3 className="text-base font-black text-amber-100">{attacker.name}</h3>
                </div>
              </div>

              <div className="relative w-48 h-48 flex items-center justify-center my-1">
                <div className={`absolute -top-3.5 z-20 drop-shadow transition-transform ${isSpinning ? 'animate-needle-vibe' : ''}`}>
                  <svg width="28" height="30" viewBox="0 0 24 28">
                    <circle cx="12" cy="4" r="3" fill="none" stroke="#f59e0b" strokeWidth="2" />
                    <polygon points="12,27 5,9 12,12 19,9" fill="#dc2626" stroke="#fef3c7" strokeWidth="1.5" />
                  </svg>
                </div>
                <div
                  className={`w-44 h-44 rounded-full wheel-spin-transition ${
                    isSpinning ? 'ring-4 ring-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.6)]' : ''
                  }`}
                  style={{ transform: `rotate(${atkAngle}deg)` }}
                >
                  <ChakraDiskSVG figure={attacker} size={176} />
                </div>
              </div>

              <div className="w-full mt-2 p-2 rounded bg-stone-950 border border-stone-700 text-center min-h-[54px] flex flex-col justify-center">
                {revealed && spinAttacker ? (
                  renderSpinBadge(spinAttacker.segment, attacker)
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-block w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-amber-300 font-mono tracking-wide">
                      {t('combat.spinning')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Defender Wheel */}
            <div className="bg-gradient-to-b from-[#261911] to-[#170f0a] rounded-lg p-3.5 border-2 border-red-700 flex flex-col items-center">
              <div className="w-full flex items-center gap-3 border-b border-stone-700 pb-2 mb-2">
                <img
                  src={defender.portraitUrl}
                  alt={defender.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500 bg-stone-800"
                  onError={e => {
                    e.currentTarget.src = CHAR_SVG_FALLBACKS[defender.key] || '';
                  }}
                />
                <div className="text-left">
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-red-700 text-white rounded-sm">
                    {t('combat.defender')} (P{defender.owner})
                  </span>
                  <h3 className="text-base font-black text-stone-100">{defender.name}</h3>
                </div>
              </div>

              <div className="relative w-48 h-48 flex items-center justify-center my-1">
                <div className={`absolute -top-3.5 z-20 drop-shadow transition-transform ${isSpinning ? 'animate-needle-vibe' : ''}`}>
                  <svg width="28" height="30" viewBox="0 0 24 28">
                    <circle cx="12" cy="4" r="3" fill="none" stroke="#ef4444" strokeWidth="2" />
                    <polygon points="12,27 5,9 12,12 19,9" fill="#dc2626" stroke="#fef3c7" strokeWidth="1.5" />
                  </svg>
                </div>
                <div
                  className={`w-44 h-44 rounded-full wheel-spin-transition ${
                    isSpinning ? 'ring-4 ring-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.6)]' : ''
                  }`}
                  style={{ transform: `rotate(${defAngle}deg)` }}
                >
                  <ChakraDiskSVG figure={defender} size={176} />
                </div>
              </div>

              <div className="w-full mt-2 p-2 rounded bg-stone-950 border border-stone-700 text-center min-h-[54px] flex flex-col justify-center">
                {revealed && spinDefender ? (
                  renderSpinBadge(spinDefender.segment, defender)
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-block w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-red-300 font-mono tracking-wide">
                      {t('combat.spinning')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Outcome & Cut-in Banner */}
          {revealed && outcome && (
            <div className="mt-4 p-3 rounded-lg bg-stone-950 border-2 border-stone-800 text-white flex flex-col md:flex-row items-center gap-3">
              <div className="w-full md:w-36 h-16 rounded overflow-hidden border border-amber-500 shrink-0">
                <img src={cutinArt} alt="Jutsu Art" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="text-[10px] uppercase font-bold text-amber-400">
                  {t('combat.outcomeTitle')}
                </span>
                <p className="text-xs md:text-sm font-bold text-stone-200 mt-0.5">
                  {outcome.reason}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {canRespin && (
                  <button
                    onClick={onRespin}
                    className="px-3 py-2 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs transition shadow"
                  >
                    {t('combat.respinButton')}
                  </button>
                )}
                <button
                  onClick={onConfirmResolution}
                  className="px-4 py-2 rounded bg-red-800 hover:bg-red-700 text-amber-100 font-black text-xs uppercase tracking-wider transition shadow"
                >
                  {t('combat.confirmResolution')}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="h-3 bg-gradient-to-r from-amber-600 via-[#281b12] to-amber-600 rounded-b" />
      </div>
    </div>
  );
};
