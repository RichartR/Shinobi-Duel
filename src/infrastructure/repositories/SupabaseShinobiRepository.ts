import { supabase, isSupabaseConfigured } from '../database/supabaseClient';
import { ShinobiFigureCatalogItem, WheelSegment, WheelColor, FigureCustomization, DEFAULT_STARTER_FIGURE_KEYS } from '../../domain/models/ShinobiFigure';
import { SHINOBI_FIGURES_CATALOG } from '../../domain/catalogs/ShinobiCatalog';
import { 
  CANONICAL_ARENA_THEMES, 
  ArenaThemeItem, 
  ChakraDustInventory, 
  FigureRarity, 
  DISENCHANT_YIELD, 
  LEVEL_UP_COSTS,
  CLV_UPGRADE_COST 
} from '../../domain/models/CraftingEconomy';

export interface UserShinobiProfile {
  id: string;
  username: string;
  ninjaRank: string;
  ryoCoins: number;
  chakraGems: number;
  eloRating: number;
  dust: ChakraDustInventory;
  selectedArenaKey: string;
  unlockedArenaKeys: string[];
  unlockedFigureKeys: string[];
  selectedTeamKeys?: string[];
  pityCount?: number;
}

export const DEFAULT_GUEST_PROFILE: UserShinobiProfile = {
  id: 'guest_ninja_local',
  username: 'Shinobi Invitado',
  ninjaRank: 'Genin',
  ryoCoins: 2500,
  chakraGems: 500,
  eloRating: 1200,
  pityCount: 0,
  dust: {
    c: 50,
    uc: 30,
    r: 15,
    ex: 10,
    ux: 0,
  },
  selectedArenaKey: 'konoha_chunin',
  unlockedArenaKeys: ['konoha_chunin'],
  unlockedFigureKeys: [...DEFAULT_STARTER_FIGURE_KEYS],
  selectedTeamKeys: [...DEFAULT_STARTER_FIGURE_KEYS],
};

const LEGACY_FIGURE_KEY_MAP: Record<string, string> = {
  naruto: 'naruto_genin',
  sasuke: 'sasuke_genin',
  sakura: 'sakura_genin',
  shikamaru: 'shikamaru_genin',
  choji: 'choji_genin',
  ino: 'ino_genin',
  hinata: 'hinata_genin',
  kiba: 'kiba_genin',
  shino: 'shino_genin',
  lee: 'lee_genin',
};

const LOCAL_STORAGE_KEY_PROFILE = 'shinobi_duel_user_profile';
const LOCAL_STORAGE_KEY_CUSTOMS = 'shinobi_duel_customizations';

export class SupabaseShinobiRepository {
  /**
   * Carga el catálogo completo de figuras uniendo shinobi_figures, figure_attacks y attacks
   */
  async getFiguresCatalog(): Promise<ShinobiFigureCatalogItem[]> {
    return Promise.resolve(SHINOBI_FIGURES_CATALOG);
  }

  /**
   * Obtiene o inicializa el perfil de usuario (invitado local o Supabase Auth)
   */
  getProfile(): UserShinobiProfile {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
      if (stored) {
        const parsed: UserShinobiProfile = JSON.parse(stored);
        let migrated = false;
        if (!parsed.unlockedFigureKeys || !Array.isArray(parsed.unlockedFigureKeys) || parsed.unlockedFigureKeys.length === 0) {
          parsed.unlockedFigureKeys = [...DEFAULT_STARTER_FIGURE_KEYS];
          migrated = true;
        } else if (parsed.unlockedFigureKeys.some(k => LEGACY_FIGURE_KEY_MAP[k])) {
          parsed.unlockedFigureKeys = parsed.unlockedFigureKeys.map(k => LEGACY_FIGURE_KEY_MAP[k] || k);
          migrated = true;
        }
        if (!parsed.selectedTeamKeys || !Array.isArray(parsed.selectedTeamKeys) || parsed.selectedTeamKeys.length === 0) {
          parsed.selectedTeamKeys = [...DEFAULT_STARTER_FIGURE_KEYS];
          migrated = true;
        } else if (parsed.selectedTeamKeys.some(k => LEGACY_FIGURE_KEY_MAP[k])) {
          parsed.selectedTeamKeys = parsed.selectedTeamKeys.map(k => LEGACY_FIGURE_KEY_MAP[k] || k);
          migrated = true;
        }
        if (migrated) {
          this.saveProfile(parsed);
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read profile from localStorage:', e);
    }
    return DEFAULT_GUEST_PROFILE;
  }

  saveProfile(profile: UserShinobiProfile): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Could not save profile to localStorage:', e);
    }
  }

  unlockFigure(profile: UserShinobiProfile, figureKey: string): UserShinobiProfile {
    if (profile.unlockedFigureKeys.includes(figureKey)) {
      return profile;
    }
    const updated: UserShinobiProfile = {
      ...profile,
      unlockedFigureKeys: [...profile.unlockedFigureKeys, figureKey],
    };
    this.saveProfile(updated);
    return updated;
  }

  resetStarterFigures(profile: UserShinobiProfile): UserShinobiProfile {
    const updated: UserShinobiProfile = {
      ...profile,
      unlockedFigureKeys: [...DEFAULT_STARTER_FIGURE_KEYS],
      selectedTeamKeys: [...DEFAULT_STARTER_FIGURE_KEYS],
    };
    this.saveProfile(updated);
    return updated;
  }

  /**
   * Obtiene la lista de arenas con su estado de desbloqueo según el perfil
   */
  getArenasWithUnlockStatus(profile: UserShinobiProfile): Array<ArenaThemeItem & { isUnlocked: boolean }> {
    return CANONICAL_ARENA_THEMES.map(theme => ({
      ...theme,
      isUnlocked: theme.isUnlockedByDefault || profile.unlockedArenaKeys.includes(theme.key),
    }));
  }

  /**
   * Desbloquea una arena gastando Ryo
   */
  unlockArena(profile: UserShinobiProfile, arenaKey: string): { success: boolean; updatedProfile: UserShinobiProfile; error?: string } {
    const arena = CANONICAL_ARENA_THEMES.find(a => a.key === arenaKey);
    if (!arena) {
      return { success: false, updatedProfile: profile, error: 'Arena no encontrada' };
    }
    if (profile.unlockedArenaKeys.includes(arenaKey)) {
      return { success: true, updatedProfile: profile };
    }
    if (profile.ryoCoins < arena.unlockCostRyo) {
      return { success: false, updatedProfile: profile, error: `Ryo insuficiente (requiere ${arena.unlockCostRyo} Ryo)` };
    }

    const updatedProfile: UserShinobiProfile = {
      ...profile,
      ryoCoins: profile.ryoCoins - arena.unlockCostRyo,
      unlockedArenaKeys: [...profile.unlockedArenaKeys, arenaKey],
      selectedArenaKey: arenaKey, // Se selecciona automáticamente al comprar
    };

    this.saveProfile(updatedProfile);
    return { success: true, updatedProfile };
  }

  /**
   * Desencantar figura por Polvos de Chakra según su rareza
   */
  disenchantFigure(
    profile: UserShinobiProfile, 
    rarity: FigureRarity
  ): { updatedProfile: UserShinobiProfile; gainedDust: number; gainedRyo: number } {
    const yieldData = DISENCHANT_YIELD[rarity] || DISENCHANT_YIELD.C;
    const dustKey = rarity.toLowerCase() as keyof ChakraDustInventory;

    const updatedProfile: UserShinobiProfile = {
      ...profile,
      ryoCoins: profile.ryoCoins + yieldData.ryoBonus,
      dust: {
        ...profile.dust,
        [dustKey]: (profile.dust[dustKey] || 0) + yieldData.amount,
      },
    };

    this.saveProfile(updatedProfile);
    return {
      updatedProfile,
      gainedDust: yieldData.amount,
      gainedRyo: yieldData.ryoBonus,
    };
  }

  /**
   * Comprueba si el usuario tiene suficientes polvos y ryo para subir de nivel una figura
   */
  canLevelUp(profile: UserShinobiProfile, rarity: FigureRarity, targetLevel: number): { allowed: boolean; reason?: string } {
    if (targetLevel > 5) return { allowed: false, reason: 'Nivel máximo alcanzado (Lv 5)' };
    const cost = LEVEL_UP_COSTS[targetLevel];
    if (!cost) return { allowed: false, reason: 'Nivel inválido' };

    const dustKey = rarity.toLowerCase() as keyof ChakraDustInventory;
    const availableDust = profile.dust[dustKey] || 0;

    if (availableDust < cost.dustAmount) {
      return { allowed: false, reason: `Polvo ${rarity} insuficiente (${availableDust}/${cost.dustAmount})` };
    }
    if (profile.ryoCoins < cost.ryoAmount) {
      return { allowed: false, reason: `Ryo insuficiente (${profile.ryoCoins}/${cost.ryoAmount})` };
    }

    return { allowed: true };
  }

  /**
   * Consume polvos y ryo para subir de nivel
   */
  consumeLevelUpCost(
    profile: UserShinobiProfile, 
    rarity: FigureRarity, 
    targetLevel: number
  ): { success: boolean; updatedProfile: UserShinobiProfile; error?: string } {
    const check = this.canLevelUp(profile, rarity, targetLevel);
    if (!check.allowed) {
      return { success: false, updatedProfile: profile, error: check.reason };
    }

    const cost = LEVEL_UP_COSTS[targetLevel];
    const dustKey = rarity.toLowerCase() as keyof ChakraDustInventory;

    const updatedProfile: UserShinobiProfile = {
      ...profile,
      ryoCoins: profile.ryoCoins - cost.ryoAmount,
      dust: {
        ...profile.dust,
        [dustKey]: profile.dust[dustKey] - cost.dustAmount,
      },
    };

    this.saveProfile(updatedProfile);
    return { success: true, updatedProfile };
  }

  /**
   * Comprueba si el usuario puede subir el Nivel de Chakra (ChLv)
   */
  canUpgradeChLv(profile: UserShinobiProfile, rarity: FigureRarity, currentChLv: number): { allowed: boolean; reason?: string } {
    if (currentChLv >= 10) return { allowed: false, reason: 'Nivel máximo de Chakra alcanzado (ChLv +10)' };
    const dustKey = rarity.toLowerCase() as keyof ChakraDustInventory;
    const availableDust = profile.dust[dustKey] || 0;

    if (availableDust < CLV_UPGRADE_COST.dustAmount) {
      return { allowed: false, reason: `Polvo ${rarity} insuficiente (${availableDust}/${CLV_UPGRADE_COST.dustAmount})` };
    }
    if (profile.ryoCoins < CLV_UPGRADE_COST.ryoAmount) {
      return { allowed: false, reason: `Ryo insuficiente (${profile.ryoCoins}/${CLV_UPGRADE_COST.ryoAmount})` };
    }

    return { allowed: true };
  }

  /**
   * Consume polvos y ryo para subir el Nivel de Chakra (ChLv)
   */
  consumeChLvCost(
    profile: UserShinobiProfile,
    rarity: FigureRarity,
    currentChLv: number
  ): { success: boolean; updatedProfile: UserShinobiProfile; error?: string } {
    const check = this.canUpgradeChLv(profile, rarity, currentChLv);
    if (!check.allowed) {
      return { success: false, updatedProfile: profile, error: check.reason };
    }

    const dustKey = rarity.toLowerCase() as keyof ChakraDustInventory;
    const updatedProfile: UserShinobiProfile = {
      ...profile,
      ryoCoins: profile.ryoCoins - CLV_UPGRADE_COST.ryoAmount,
      dust: {
        ...profile.dust,
        [dustKey]: profile.dust[dustKey] - CLV_UPGRADE_COST.dustAmount,
      },
    };

    this.saveProfile(updatedProfile);
    return { success: true, updatedProfile };
  }

  /**
   * Selecciona una arena previamente desbloqueada
   */
  selectArena(profile: UserShinobiProfile, arenaKey: string): { success: boolean; updatedProfile: UserShinobiProfile; error?: string } {
    const arena = CANONICAL_ARENA_THEMES.find(a => a.key === arenaKey);
    if (!arena) {
      return { success: false, updatedProfile: profile, error: 'Arena no encontrada' };
    }
    const isUnlocked = arena.isUnlockedByDefault || profile.unlockedArenaKeys.includes(arenaKey);
    if (!isUnlocked) {
      return { success: false, updatedProfile: profile, error: 'Esta arena aún no ha sido desbloqueada' };
    }

    const updatedProfile: UserShinobiProfile = {
      ...profile,
      selectedArenaKey: arenaKey,
    };
    this.saveProfile(updatedProfile);
    return { success: true, updatedProfile };
  }

  /**
   * Obtiene las personalizaciones de nivel y ChLv de las figuras guardadas
   */
  getCustomizations(): Record<string, FigureCustomization> {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOMS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read customizations from localStorage:', e);
    }
    return {};
  }

  /**
   * Guarda las personalizaciones de nivel y ChLv en localStorage
   */
  saveCustomizations(customs: Record<string, FigureCustomization>): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOMS, JSON.stringify(customs));
    } catch (e) {
      console.error('Could not save customizations to localStorage:', e);
    }
  }

  /**
   * Restablece todas las figuras a Nivel 1 y ChLv 0
   */
  resetAllCustomizations(): Record<string, FigureCustomization> {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY_CUSTOMS);
    } catch (e) {
      console.error('Could not clear customizations from localStorage:', e);
    }
    const defaults: Record<string, FigureCustomization> = {};
    SHINOBI_FIGURES_CATALOG.forEach(tpl => {
      defaults[tpl.key] = {
        level: 1,
        clv: 0,
        lvTargetIndex: 0,
        clvTargetIndex: 0,
      };
    });
    return defaults;
  }
}

export const shinobiDbRepository = new SupabaseShinobiRepository();
