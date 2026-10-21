import { ShinobiFigureState, WheelSegment } from '../models/ShinobiFigure';
import { BattleSpinResult, DuelOutcome } from '../models/BattleResult';

export function spinFigureChakraWheel(figure: { segments: WheelSegment[] }): BattleSpinResult {
  const total = figure.segments.reduce((acc, s) => acc + s.size, 0);
  const rand = Math.random() * total;
  let cumulative = 0;

  for (let i = 0; i < figure.segments.length; i++) {
    const seg = figure.segments[i];
    const startPct = cumulative / total;
    cumulative += seg.size;
    const endPct = cumulative / total;

    if (rand <= cumulative || i === figure.segments.length - 1) {
      const midPct = (startPct + endPct) / 2;
      const jitter = (Math.random() - 0.5) * ((endPct - startPct) * 0.5);
      const targetFraction = midPct + jitter;
      const targetDeg = 360 - targetFraction * 360;
      return { segment: seg, index: i, targetDeg };
    }
  }

  // Fallback
  return {
    segment: figure.segments[0],
    index: 0,
    targetDeg: 0,
  };
}

export function resolveChakraDuelOutcome(
  attacker: ShinobiFigureState,
  defender: ShinobiFigureState,
  segA: WheelSegment,
  segD: WheelSegment,
  activeBuffs: Record<number, { powerBonus?: number }>
): DuelOutcome {
  const atkBurnPenalty = attacker.status === 'burned' ? -10 : 0;
  const defBurnPenalty = defender.status === 'burned' ? -10 : 0;

  const atkBonus =
    segA.color === 'white' || segA.color === 'gold'
      ? (activeBuffs[attacker.owner]?.powerBonus || 0) + atkBurnPenalty
      : 0;
  const defBonus =
    segD.color === 'white' || segD.color === 'gold'
      ? (activeBuffs[defender.owner]?.powerBonus || 0) + defBurnPenalty
      : 0;

  const powA = Math.max(0, segA.power + atkBonus);
  const powD = Math.max(0, segD.power + defBonus);

  // 1. BLUE (Kawarimi / Dodge) invalidates any enemy attack
  if (segA.color === 'blue' || segD.color === 'blue') {
    const dodger = segA.color === 'blue' ? attacker : defender;
    const dSeg = segA.color === 'blue' ? segA : segD;
    return {
      winner: 'none',
      hero: dodger,
      seg: dSeg,
      powA,
      powD,
      reason: `¡Defensa Azul (${dSeg.name} • ${dSeg.size}/96)! ${dodger.shortName} esquiva e invalida cualquier técnica rival.`,
    };
  }

  // 2. RED (Miss) outcomes
  if (segA.color === 'red' && segD.color === 'red') {
    return {
      winner: 'none',
      hero: attacker,
      seg: segA,
      powA,
      powD,
      reason: '¡Doble Fallo Rojo! Ambos ninjas pierden el equilibrio sin infligir daño.',
    };
  }
  if (segA.color === 'red') {
    return {
      winner: segD.color === 'purple' ? 'def_purple' : 'def_ko',
      hero: defender,
      seg: segD,
      powA,
      powD,
      reason: `¡${attacker.shortName} cayó en Fallo Rojo (${segA.size}/96) y recibió ${segD.name} de ${defender.shortName}!`,
    };
  }
  if (segD.color === 'red') {
    return {
      winner: segA.color === 'purple' ? 'atk_purple' : 'atk_ko',
      hero: attacker,
      seg: segA,
      powA,
      powD,
      reason: `¡${defender.shortName} cayó en Fallo Rojo (${segD.size}/96) y fue impactado por ${segA.name}!`,
    };
  }

  // 3. GOLD priority breaks PURPLE Jutsus
  if (segA.color === 'gold' && segD.color === 'purple') {
    return {
      winner: 'atk_ko',
      hero: attacker,
      seg: segA,
      powA,
      powD,
      reason: `¡Prioridad Dorada! ${segA.name} (${powA} DMG) corta y neutraliza el Jutsu Morado (${'★'.repeat(segD.stars)}) de ${defender.shortName}.`,
    };
  }
  if (segD.color === 'gold' && segA.color === 'purple') {
    return {
      winner: 'def_ko',
      hero: defender,
      seg: segD,
      powA,
      powD,
      reason: `¡Prioridad Dorada! ${segD.name} (${powD} DMG) corta y neutraliza el Jutsu Morado (${'★'.repeat(segA.stars)}) de ${attacker.shortName}.`,
    };
  }

  // 4. PURPLE (0 DMG, Star-based) wins against WHITE regardless of numerical damage
  if (segA.color === 'purple' && segD.color === 'white') {
    return {
      winner: 'atk_purple',
      hero: attacker,
      seg: segA,
      powA,
      powD,
      reason: `¡Jutsu Morado (${'★'.repeat(segA.stars)}) vence al ataque físico Blanco (${powD} DMG) de ${defender.shortName}!`,
    };
  }
  if (segD.color === 'purple' && segA.color === 'white') {
    return {
      winner: 'def_purple',
      hero: defender,
      seg: segD,
      powA,
      powD,
      reason: `¡Jutsu Morado (${'★'.repeat(segD.stars)}) vence al ataque físico Blanco (${powA} DMG) de ${attacker.shortName}!`,
    };
  }

  // 5. PURPLE vs PURPLE comparison by star rank
  if (segA.color === 'purple' && segD.color === 'purple') {
    if (segA.stars > segD.stars) {
      return {
        winner: 'atk_purple',
        hero: attacker,
        seg: segA,
        powA,
        powD,
        reason: `¡${segA.name} (${'★'.repeat(segA.stars)}) supera en rango estelar al Jutsu (${'★'.repeat(segD.stars)}) de ${defender.shortName}!`,
      };
    }
    if (segD.stars > segA.stars) {
      return {
        winner: 'def_purple',
        hero: defender,
        seg: segD,
        powA,
        powD,
        reason: `¡${segD.name} (${'★'.repeat(segD.stars)}) supera en rango estelar al Jutsu (${'★'.repeat(segA.stars)}) de ${attacker.shortName}!`,
      };
    }
    return {
      winner: 'none',
      hero: attacker,
      seg: segA,
      powA,
      powD,
      reason: `¡Choque de Jutsus Morados de igual rango (${'★'.repeat(segA.stars)})! Ambos se neutralizan.`,
    };
  }

  // 6. Numerical power clash (WHITE/GOLD vs WHITE/GOLD) with Mew-like Hiraishin survival
  if (powA > powD) {
    if (segD.effect === 'survive_100_plus' && powA >= 100) {
      return {
        winner: 'none',
        hero: defender,
        seg: segD,
        powA,
        powD,
        reason: `¡Reflejo Hiraishin (Estilo Mew)! ${defender.shortName} sobrevive porque ${segA.name} (${powA} DMG) es de 100 DMG o más.`,
      };
    }
    return {
      winner: 'atk_ko',
      hero: attacker,
      seg: segA,
      powA,
      powD,
      reason: `¡${segA.name} (${powA} DMG) supera a ${segD.name} (${powD} DMG)!`,
    };
  }

  if (powD > powA) {
    if (segA.effect === 'survive_100_plus' && powD >= 100) {
      return {
        winner: 'none',
        hero: attacker,
        seg: segA,
        powA,
        powD,
        reason: `¡Reflejo Hiraishin (Estilo Mew)! ${attacker.shortName} sobrevive porque ${segD.name} (${powD} DMG) es de 100 DMG o más.`,
      };
    }
    return {
      winner: 'def_ko',
      hero: defender,
      seg: segD,
      powA,
      powD,
      reason: `¡Contraataque letal! ${segD.name} (${powD} DMG) supera a ${segA.name} (${powA} DMG)!`,
    };
  }

  return {
    winner: 'none',
    hero: attacker,
    seg: segA,
    powA,
    powD,
    reason: `¡Empate exacto de poder (${powA} vs ${powD})! Ambos shinobis mantienen su posición.`,
  };
}
