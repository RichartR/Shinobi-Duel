import { ShinobiFigureCatalogItem } from '../models/ShinobiFigure';
import { TacticalScroll } from '../models/TacticalScroll';

/**
 * Clean Architecture Repository Interface.
 * Allows the game to operate seamlessly with mock data today,
 * while enabling immediate connection to a real backend / database later.
 */
export interface IShinobiRepository {
  /**
   * Retrieves all available shinobi figures in the catalog.
   */
  getFiguresCatalog(): Promise<ShinobiFigureCatalogItem[]>;

  /**
   * Retrieves a single shinobi figure by its unique key.
   */
  getFigureByKey(key: string): Promise<ShinobiFigureCatalogItem | null>;

  /**
   * Retrieves all tactical scrolls / plates available for deck building.
   */
  getTacticalScrolls(): Promise<TacticalScroll[]>;

  /**
   * Retrieves the default 6-shinobi team for Player 1 (Konoha) or Player 2 (Akatsuki).
   */
  getDefaultTeam(player: 1 | 2): Promise<string[]>;

  /**
   * Retrieves the default tactical plates equipped.
   */
  getDefaultPlateLoadout(player: 1 | 2): Promise<string[]>;
}
