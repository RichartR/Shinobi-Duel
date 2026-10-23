import { supabase, isSupabaseConfigured } from '../database/supabaseClient';
import { ShinobiFigureCatalogItem, WheelSegment, WheelColor } from '../../domain/models/ShinobiFigure';
import { SHINOBI_FIGURES_CATALOG } from './MockShinobiRepository';
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
}

export const DEFAULT_GUEST_PROFILE: UserShinobiProfile = {
  id: 'guest_ninja_local',
  username: 'Shinobi Invitado',
  ninjaRank: 'Genin',
  ryoCoins: 2500,
  chakraGems: 150,
  eloRating: 1200,
  dust: {
    c: 50,
    uc: 30,
    r: 15,
    ex: 10,
    ux: 0,
  },
  selectedArenaKey: 'konoha_chunin',
  unlockedArenaKeys: ['konoha_chunin'], // Solo Konoha habilitada al inicio
};

const LOCAL_STORAGE_KEY_PROFILE = 'shinobi_duel_user_profile';
const LOCAL_STORAGE_KEY_CUSTOMS = 'shinobi_duel_customizations';

export class SupabaseShinobiRepository {
  /**
   * Carga el catálogo completo de figuras uniendo shinobi_figures, figure_attacks y attacks
   */
  async getFiguresCatalog(): Promise<ShinobiFigureCatalogItem[]> {
    if (!isSupabaseConfigured) {
      return SHINOBI_FIGURES_CATALOG;
    }

    try {
      const { data: figuresData, error: figuresError } = await supabase
        .from('shinobi_figures')
        .select(`
          id,
          key,
          name,
          short_name,
          rarity,
          mp,
          archetype,
          ability_title,
          ability_desc,
          can_pass_through,
          immune_to_surround,
          portrait_url,
          figure_attacks (
            slot_index,
            base_size,
            custom_power,
            custom_stars,
            custom_effect,
            attacks (
              key,
              name,
              color,
              base_power,
              stars,
              effect_type,
              description
            )
          )
        `);

      if (figuresError || !figuresData || figuresData.length === 0) {
        console.warn('Falling back to local catalog due to Supabase query error:', figuresError);
        return SHINOBI_FIGURES_CATALOG;
      }

      // Mapear el resultado relacional a la interfaz de dominio ShinobiFigureCatalogItem
      return figuresData.map(f => {
        // Ordenar los segmentos según slot_index
        const sortedAttacks = (f.figure_attacks || []).sort((a, b) => a.slot_index - b.slot_index);
        
        const segments: WheelSegment[] = sortedAttacks.map(fa => {
          const atk = fa.attacks as any;
          return {
            name: atk?.name || 'Ataque',
            color: (atk?.color || 'white') as WheelColor,
            power: fa.custom_power !== null ? fa.custom_power : (atk?.base_power || 0),
            stars: fa.custom_stars !== null ? fa.custom_stars : (atk?.stars || 0),
            size: fa.base_size,
            effect: fa.custom_effect || atk?.effect_type || null,
          };
        });

        return {
          key: f.key,
          name: f.name,
          shortName: f.short_name,
          rarity: f.rarity as any,
          mp: f.mp,
          archetype: f.archetype || '',
          ability: `${f.ability_title ? f.ability_title + ': ' : ''}${f.ability_desc || ''}`,
          canPassThrough: f.can_pass_through ?? false,
          immuneToSurround: f.immune_to_surround ?? false,
          portraitUrl: f.portrait_url,
          segments: segments.length > 0 ? segments : (SHINOBI_FIGURES_CATALOG.find(m => m.key === f.key)?.segments || []),
        };
      });
    } catch (err) {
      console.error('Error fetching figures from Supabase:', err);
      return SHINOBI_FIGURES_CATALOG;
    }
  }

  /**
   * Obtiene o inicializa el perfil de usuario (invitado local o Supabase Auth)
   */
  getProfile(): UserShinobiProfile {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read profile from localStorage:', e);
    }
    return DEFAULT_GUEST_PROFILE;
  }

  /**
   * Guarda las actualizaciones del perfil (Ryo, Polvos, Arena activa)
   */
  saveProfile(profile: UserShinobiProfile): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Could not save profile to localStorage:', e);
    }
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
}

export const shinobiDbRepository = new SupabaseShinobiRepository();
