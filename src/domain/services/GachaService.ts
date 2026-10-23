import { SHINOBI_FIGURES_CATALOG } from '../../infrastructure/repositories/MockShinobiRepository';
import { ShinobiFigureCatalogItem } from '../models/ShinobiFigure';
import { FigureRarity, DISENCHANT_YIELD } from '../models/CraftingEconomy';

export interface GachaPullResultItem {
  figure: ShinobiFigureCatalogItem;
  isDuplicate: boolean;
  dustYield: {
    dustRarity: FigureRarity;
    amount: number;
    ryoBonus: number;
  };
  isPity: boolean;
}

export interface GachaSummonResponse {
  results: GachaPullResultItem[];
  highestRarity: FigureRarity;
  gemsSpent: number;
  newPityCount: number;
}

export class GachaService {
  /**
   * Ejecuta una tirada (1x o 10x) para un banner determinado
   */
  public executeSummon(
    bannerKey: string,
    pullCount: 1 | 10,
    currentPity: number,
    ownedFigureKeys: string[]
  ): GachaSummonResponse {
    const results: GachaPullResultItem[] = [];
    let pity = currentPity;

    for (let i = 0; i < pullCount; i++) {
      pity += 1;
      const isGuaranteedRPlus = pullCount === 10 && i === 9; // En la última tirada de 10x garantiza R+
      const isPityTrigger = pity >= 40;

      const pull = this.pullSingle(bannerKey, isPityTrigger, isGuaranteedRPlus, ownedFigureKeys);
      if (pull.figure.rarity === 'EX' || pull.figure.rarity === 'UX') {
        pity = 0; // Reiniciar pity al sacar EX o UX
      }

      results.push({
        ...pull,
        isPity: isPityTrigger,
      });
    }

    // Determinar la rareza más alta para el efecto visual del chakra
    const rarityRanks: Record<FigureRarity, number> = { C: 1, UC: 2, R: 3, EX: 4, UX: 5 };
    const highestRarity = results.reduce<FigureRarity>((maxR, item) => {
      return rarityRanks[item.figure.rarity] > rarityRanks[maxR] ? item.figure.rarity : maxR;
    }, 'C');

    const costPerPull = bannerKey === 'standard_ninja_summon' ? 50 : 60;
    const gemsSpent = pullCount === 1 ? costPerPull : costPerPull * 9; // Descuento en 10x (1 gratis)

    return {
      results,
      highestRarity,
      gemsSpent,
      newPityCount: pity,
    };
  }

  private pullSingle(
    bannerKey: string,
    isPity: boolean,
    isGuaranteedRPlus: boolean,
    ownedFigureKeys: string[]
  ): { figure: ShinobiFigureCatalogItem; isDuplicate: boolean; dustYield: { dustRarity: FigureRarity; amount: number; ryoBonus: number } } {
    let rarity: FigureRarity = 'C';

    if (isPity) {
      // Pity: 90% EX, 10% UX
      rarity = Math.random() < 0.10 ? 'UX' : 'EX';
    } else {
      const roll = Math.random() * 100;
      if (roll < 1.5) {
        rarity = 'UX';
      } else if (roll < 13.5) {
        rarity = 'EX';
      } else if (roll < 38.5 || isGuaranteedRPlus) {
        rarity = 'R';
      } else if (roll < 70) {
        rarity = 'UC';
      } else {
        rarity = 'C';
      }
    }

    // Filtrar figuras según rareza
    let candidateFigures = SHINOBI_FIGURES_CATALOG.filter(f => f.rarity === rarity);
    if (candidateFigures.length === 0) {
      candidateFigures = SHINOBI_FIGURES_CATALOG;
    }

    // Si es un banner destacado con personajes específicos con Rate-Up:
    let selectedFigure: ShinobiFigureCatalogItem;
    if (bannerKey === 'arc1_novatos_konoha' && candidateFigures.some(f => f.key === 'naruto' || f.key === 'sasuke')) {
      const isRateUp = Math.random() < 0.5; // 50% probabilidad de que sea Naruto o Sasuke
      if (isRateUp) {
        const featured = candidateFigures.filter(f => f.key === 'naruto' || f.key === 'sasuke');
        selectedFigure = featured[Math.floor(Math.random() * featured.length)];
      } else {
        selectedFigure = candidateFigures[Math.floor(Math.random() * candidateFigures.length)];
      }
    } else {
      selectedFigure = candidateFigures[Math.floor(Math.random() * candidateFigures.length)];
    }

    const isDuplicate = ownedFigureKeys.includes(selectedFigure.key);
    const dustYield = DISENCHANT_YIELD[selectedFigure.rarity] || DISENCHANT_YIELD.C;

    return {
      figure: selectedFigure,
      isDuplicate,
      dustYield,
    };
  }
}

export const gachaService = new GachaService();
