import { IShinobiRepository } from '../../domain/repositories/IShinobiRepository';
import { ShinobiFigureCatalogItem } from '../../domain/models/ShinobiFigure';
import { TacticalScroll, TACTICAL_SCROLLS_CATALOG } from '../../domain/models/TacticalScroll';

export const SHINOBI_FIGURES_CATALOG: ShinobiFigureCatalogItem[] = [
  {
    key: 'naruto',
    rarity: 'C',
    archetype: 'Brawler Impetuoso de la Academia',
    name: 'Naruto Uzumaki (Genin)',
    shortName: 'Naruto',
    mp: 3,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/2/284121.jpg',
    ability: 'Perseverancia Shinobi: Su voluntad inquebrantable supera su falta de técnica inicial. Si empata en una batalla, gana +1 MP en su siguiente turno.',
    segments: [
      { name: 'Kage Bunshin no Jutsu', color: 'purple', power: 0, stars: 1, size: 24, effect: 'confuse_wait' },
      { name: 'Taijutsu de la Academia', color: 'white', power: 40, stars: 0, size: 32, effect: null },
      { name: 'Oiroke no Jutsu', color: 'purple', power: 0, stars: 1, size: 16, effect: 'confuse_wait' },
      { name: 'Kawarimi no Jutsu', color: 'blue', power: 0, stars: 0, size: 12, effect: 'dodge' },
      { name: 'Tropezón de Novato', color: 'red', power: 0, stars: 0, size: 12, effect: null },
    ],
  },
  {
    key: 'sasuke',
    rarity: 'C',
    archetype: 'Prodigio del Clan Uchiha',
    name: 'Sasuke Uchiha (Genin)',
    shortName: 'Sasuke',
    mp: 3,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/9/131317.jpg',
    ability: 'Orgullo Uchiha: Su Shurikenjutsu Dorado (24/96) destruye Jutsus Morados si el rival es de igual o menor rango.',
    segments: [
      { name: 'Katon: Gōkakyū no Jutsu', color: 'white', power: 50, stars: 0, size: 32, effect: null },
      { name: 'Shurikenjutsu Veloz', color: 'gold', power: 30, stars: 0, size: 24, effect: null },
      { name: 'Taijutsu del Halcón', color: 'white', power: 40, stars: 0, size: 20, effect: null },
      { name: 'Esquiva Táctica', color: 'blue', power: 0, stars: 0, size: 12, effect: 'dodge' },
      { name: 'Duda Juvenil', color: 'red', power: 0, stars: 0, size: 8, effect: null },
    ],
  },
  {
    key: 'sakura',
    rarity: 'C',
    archetype: 'Estratega de Apoyo Académico',
    name: 'Sakura Haruno (Genin)',
    shortName: 'Sakura',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/16/323862.jpg',
    ability: 'Control Fino de Chakra: Las figuras aliadas adyacentes reducen su segmento de fallo Rojo en 4.',
    segments: [
      { name: '¡Shānnarō!', color: 'white', power: 50, stars: 0, size: 24, effect: null },
      { name: 'Lanzamiento de Kunai', color: 'white', power: 30, stars: 0, size: 28, effect: null },
      { name: 'Bunshin Ilusorio', color: 'purple', power: 0, stars: 1, size: 16, effect: 'confuse_wait' },
      { name: 'Posición Defensiva', color: 'blue', power: 0, stars: 0, size: 16, effect: 'dodge' },
      { name: 'Duda ante el Peligro', color: 'red', power: 0, stars: 0, size: 12, effect: null },
    ],
  },
  {
    key: 'shikamaru',
    rarity: 'C',
    archetype: 'Controlador Táctico de Sombras',
    name: 'Shikamaru Nara (Genin)',
    shortName: 'Shikamaru',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/2/74737.jpg',
    ability: 'Estrategia Perezosa: Si el enemigo inicia batalla contra él, Shikamaru puede forzar a ambos a girar de nuevo una vez por combate.',
    segments: [
      { name: 'Kagemane no Jutsu', color: 'purple', power: 0, stars: 2, size: 32, effect: 'paralyze_enemy' },
      { name: 'Trampa con Hilos Ninja', color: 'gold', power: 30, stars: 0, size: 20, effect: null },
      { name: 'Golpe Calculado', color: 'white', power: 30, stars: 0, size: 20, effect: null },
      { name: 'Retirada Estratégica', color: 'blue', power: 0, stars: 0, size: 12, effect: 'dodge' },
      { name: 'Qué Fastidio...', color: 'red', power: 0, stars: 0, size: 12, effect: null },
    ],
  },
  {
    key: 'choji',
    rarity: 'C',
    archetype: 'Ariete de Impacto Frontal',
    name: 'Chōji Akimichi (Genin)',
    shortName: 'Chōji',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/16/74736.jpg',
    ability: 'Glotón Imparable (0% Azul): Si gana con Nikudan Sensha, empuja a la figura rival 1 casilla hacia atrás.',
    segments: [
      { name: 'Nikudan Sensha', color: 'white', power: 60, stars: 0, size: 36, effect: 'push_wait' },
      { name: 'Baika no Jutsu (Parcial)', color: 'white', power: 40, stars: 0, size: 28, effect: null },
      { name: 'Placaje Pesado', color: 'white', power: 30, stars: 0, size: 16, effect: null },
      { name: 'Merienda Inoportuna', color: 'red', power: 0, stars: 0, size: 16, effect: null },
    ],
  },
  {
    key: 'ino',
    rarity: 'C',
    archetype: 'Infiltradora Mental de Apoyo',
    name: 'Ino Yamanaka (Genin)',
    shortName: 'Ino',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/11/74738.jpg',
    ability: 'Transferencia Mental: Shintenshin no Jutsu (★★) confunde al enemigo y le aplica Espera 2 si gana.',
    segments: [
      { name: 'Shintenshin no Jutsu', color: 'purple', power: 0, stars: 2, size: 28, effect: 'confuse_wait' },
      { name: 'Flor Trampa con Senbon', color: 'gold', power: 30, stars: 0, size: 24, effect: null },
      { name: 'Bofetada Certera', color: 'white', power: 30, stars: 0, size: 20, effect: null },
      { name: 'Esquiva Grácil', color: 'blue', power: 0, stars: 0, size: 12, effect: 'dodge' },
      { name: 'Desconexión Espiritual', color: 'red', power: 0, stars: 0, size: 12, effect: null },
    ],
  },
  {
    key: 'hinata',
    rarity: 'C',
    archetype: 'Bloqueadora de Tenketsu',
    name: 'Hinata Hyūga (Genin)',
    shortName: 'Hinata',
    mp: 2,
    immuneToSurround: true,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/7/74739.jpg',
    ability: 'Visión del Byakugan: Inmune a Rodeo si hay al menos una figura aliada a 2 casillas.',
    segments: [
      { name: 'Jūken: Golpe Suave', color: 'white', power: 40, stars: 0, size: 32, effect: 'paralyze_enemy' },
      { name: 'Reflejo Byakugan', color: 'gold', power: 30, stars: 0, size: 24, effect: null },
      { name: 'Guardia Protectora', color: 'blue', power: 0, stars: 0, size: 24, effect: 'dodge' },
      { name: 'Bloqueo de Tenketsu', color: 'purple', power: 0, stars: 1, size: 8, effect: 'confuse_wait' },
      { name: 'Timidez Paralizante', color: 'red', power: 0, stars: 0, size: 8, effect: null },
    ],
  },
  {
    key: 'kiba',
    rarity: 'C',
    archetype: 'Rastreador Cuadrúpedo de Asalto',
    name: 'Kiba Inuzuka & Akamaru (Genin)',
    shortName: 'Kiba',
    mp: 3,
    canPassThrough: true,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/5/74740.jpg',
    ability: 'Dúo Canino: Puede atravesar figuras aliadas durante su movimiento sin gastar MP extra.',
    segments: [
      { name: 'Tsūga (Colmillo Perforador)', color: 'white', power: 50, stars: 0, size: 36, effect: null },
      { name: 'Shikyaku no Jutsu', color: 'gold', power: 30, stars: 0, size: 24, effect: null },
      { name: 'Mordisco de Akamaru', color: 'white', power: 30, stars: 0, size: 20, effect: null },
      { name: 'Desvío Rápido', color: 'blue', power: 0, stars: 0, size: 8, effect: 'dodge' },
      { name: 'Distracción Canina', color: 'red', power: 0, stars: 0, size: 8, effect: null },
    ],
  },
  {
    key: 'shino',
    rarity: 'C',
    archetype: 'Parásito Drenador de Chakra',
    name: 'Shino Aburame (Genin)',
    shortName: 'Shino',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/12/74741.jpg',
    ability: 'Enjambre Kikaichū: Si empata en combate, la figura rival pierde 1 MP en su próximo turno.',
    segments: [
      { name: 'Mushi Dama', color: 'purple', power: 0, stars: 2, size: 32, effect: 'paralyze_enemy' },
      { name: 'Drenaje Kikaichū', color: 'white', power: 40, stars: 0, size: 28, effect: null },
      { name: 'Clon de Insectos', color: 'blue', power: 0, stars: 0, size: 20, effect: 'dodge' },
      { name: 'Ataque Sorpresa', color: 'white', power: 30, stars: 0, size: 8, effect: null },
      { name: 'Dispersión de Enjambre', color: 'red', power: 0, stars: 0, size: 8, effect: null },
    ],
  },
  {
    key: 'lee',
    rarity: 'C',
    archetype: 'Genin de Taijutsu Puro',
    name: 'Rock Lee (Genin)',
    shortName: 'Rock Lee',
    mp: 3,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/14/433353.jpg',
    ability: 'Pesas en los Tobillos (0% Morado, 0% Azul): Incapaz de usar Ninjutsu o esquivas. Si gana con Konoha Senpū, avanza 1 casilla.',
    segments: [
      { name: 'Konoha Senpū', color: 'gold', power: 40, stars: 0, size: 36, effect: null },
      { name: 'Patada Directa', color: 'white', power: 50, stars: 0, size: 32, effect: null },
      { name: 'Ráfaga de Puños', color: 'white', power: 30, stars: 0, size: 16, effect: null },
      { name: 'Tropiezo con las Pesas', color: 'red', power: 0, stars: 0, size: 12, effect: null },
    ],
  },
];

export class MockShinobiRepository implements IShinobiRepository {
  async getFiguresCatalog(): Promise<ShinobiFigureCatalogItem[]> {
    return Promise.resolve(SHINOBI_FIGURES_CATALOG);
  }

  async getFigureByKey(key: string): Promise<ShinobiFigureCatalogItem | null> {
    const figure = SHINOBI_FIGURES_CATALOG.find(f => f.key === key) || null;
    return Promise.resolve(figure);
  }

  async getTacticalScrolls(): Promise<TacticalScroll[]> {
    return Promise.resolve(TACTICAL_SCROLLS_CATALOG);
  }

  async getDefaultTeam(player: 1 | 2): Promise<string[]> {
    if (player === 1) {
      return Promise.resolve(['naruto', 'sasuke', 'sakura', 'shikamaru', 'choji', 'lee']);
    }
    return Promise.resolve(['kiba', 'shino', 'hinata', 'ino', 'sasuke', 'naruto']);
  }

  async getDefaultPlateLoadout(_player: 1 | 2): Promise<string[]> {
    return Promise.resolve(['goal_block', 'max_revive', 'double_chance', 'x_attack']);
  }
}
