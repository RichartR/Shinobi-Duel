import { SHINOBI_FIGURES_CATALOG } from '../catalogs/ShinobiCatalog';
import { ShinobiFigureCatalogItem } from '../models/ShinobiFigure';
import { FigureRarity, DISENCHANT_YIELD } from '../models/CraftingEconomy';
import { getBannerByKey, PITY_THRESHOLD, GachaBannerConfig } from '../catalogs/GachaBannersCatalog';

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
  public executeSummon(
    bannerKey: string,
    pullCount: 1 | 10,
    currentPity: number,
    ownedFigureKeys: string[]
  ): GachaSummonResponse {
    const banner = getBannerByKey(bannerKey);
    const results: GachaPullResultItem[] = [];
    let pity = currentPity;
    const activeOwned = [...ownedFigureKeys];

    for (let i = 0; i < pullCount; i++) {
      pity += 1;
      const isGuaranteedRPlus = pullCount === 10 && i === 9;
      const isPityTrigger = pity >= PITY_THRESHOLD;

      const pull = this.pullSingle(banner, isPityTrigger, isGuaranteedRPlus, activeOwned);
      if (pull.figure.rarity === 'EX' || pull.figure.rarity === 'UX') {
        pity = 0;
      }

      if (!pull.isDuplicate) {
        activeOwned.push(pull.figure.key);
      }

      results.push({
        ...pull,
        isPity: isPityTrigger,
      });
    }

    const rarityRanks: Record<FigureRarity, number> = { C: 1, UC: 2, R: 3, EX: 4, UX: 5 };
    const highestRarity = results.reduce<FigureRarity>((maxR, item) => {
      return rarityRanks[item.figure.rarity] > rarityRanks[maxR] ? item.figure.rarity : maxR;
    }, 'C');

    const gemsSpent = pullCount === 1 ? banner.costSingle : banner.costMulti;

    return {
      results,
      highestRarity,
      gemsSpent,
      newPityCount: pity,
    };
  }

  private pullSingle(
    banner: GachaBannerConfig,
    isPity: boolean,
    isGuaranteedRPlus: boolean,
    ownedFigureKeys: string[]
  ): { figure: ShinobiFigureCatalogItem; isDuplicate: boolean; dustYield: { dustRarity: FigureRarity; amount: number; ryoBonus: number } } {
    let rarity: FigureRarity = 'C';

    if (isPity) {
      rarity = Math.random() < 0.10 ? 'UX' : 'EX';
    } else {
      const roll = Math.random() * 100;
      const rates = banner.rates;
      const thresholdUX = rates.UX;
      const thresholdEX = thresholdUX + rates.EX;
      const thresholdR = thresholdEX + rates.R;
      const thresholdUC = thresholdR + rates.UC;

      if (roll < thresholdUX) {
        rarity = 'UX';
      } else if (roll < thresholdEX) {
        rarity = 'EX';
      } else if (roll < thresholdR || isGuaranteedRPlus) {
        rarity = 'R';
      } else if (roll < thresholdUC) {
        rarity = 'UC';
      } else {
        rarity = 'C';
      }
    }

    // Filter candidate figures within the banner's designated pool
    const poolFigures = SHINOBI_FIGURES_CATALOG.filter(f => banner.poolFigureKeys.includes(f.key));
    const effectivePool = poolFigures.length > 0 ? poolFigures : SHINOBI_FIGURES_CATALOG;

    let candidateFigures = effectivePool.filter(f => f.rarity === rarity);
    if (candidateFigures.length === 0) {
      candidateFigures = effectivePool;
    }

    let selectedFigure: ShinobiFigureCatalogItem;
    const rateUpCandidates = candidateFigures.filter(f => banner.rateUpShinobis.includes(f.key));

    if (rateUpCandidates.length > 0 && Math.random() < 0.50) {
      selectedFigure = rateUpCandidates[Math.floor(Math.random() * rateUpCandidates.length)];
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
