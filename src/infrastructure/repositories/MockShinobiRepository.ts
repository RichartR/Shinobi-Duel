import { IShinobiRepository } from '../../domain/repositories/IShinobiRepository';
import { ShinobiFigureCatalogItem } from '../../domain/models/ShinobiFigure';
import { TacticalScroll, TACTICAL_SCROLLS_CATALOG } from '../../domain/models/TacticalScroll';

export const SHINOBI_FIGURES_CATALOG: ShinobiFigureCatalogItem[] = [
  {
    key: 'minato',
    rarity: 'EX',
    archetype: 'Corredor Anti-Jutsu (Arquetipo Mew)',
    name: 'Minato Namikaze',
    shortName: 'Minato',
    mp: 3,
    canPassThrough: true,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/14/128074.jpg',
    ability: 'Salto Espacio-Temporal: Con 48/96 Dorado destruye Jutsus Morados. Su Hiraishin (50 DMG) sobrevive e impide ser noqueado si el rival gira 100 DMG o más.',
    segments: [
      { name: 'Hiraishin no Jutsu', color: 'gold', power: 50, stars: 0, size: 48, effect: 'survive_100_plus' },
      { name: 'Rasengan Relámpago', color: 'white', power: 70, stars: 0, size: 24, effect: null },
      { name: 'Shunshin (Evasión)', color: 'blue', power: 0, stars: 0, size: 20, effect: 'dodge' },
      { name: 'Kunai Desviado (Fallo)', color: 'red', power: 0, stars: 0, size: 4, effect: null }
    ]
  },
  {
    key: 'lee',
    rarity: 'R',
    archetype: 'Taijutsu Puro (0% Morado, 0% Azul)',
    name: 'Rock Lee',
    shortName: 'Rock Lee',
    mp: 3,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/14/433353.jpg',
    ability: 'Restricción de Taijutsu Puro: Incapaz de usar Ninjutsu o esquivas Azules. Si gana con Ura Renge (140 DMG), sufre Espera 2 por desgaste.',
    segments: [
      { name: 'Omote Renge (Loto)', color: 'white', power: 110, stars: 0, size: 32, effect: null },
      { name: 'Konoha Senpū', color: 'gold', power: 60, stars: 0, size: 28, effect: null },
      { name: 'Ura Renge (8 Puertas)', color: 'white', power: 140, stars: 0, size: 16, effect: 'self_wait_2' },
      { name: 'Agotamiento Muscular', color: 'red', power: 0, stars: 0, size: 20, effect: null }
    ]
  },
  {
    key: 'itachi',
    rarity: 'EX',
    archetype: 'Controlador Genjutsu (62.5% Morado)',
    name: 'Itachi Uchiha',
    shortName: 'Itachi',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/9/284122.jpg',
    ability: 'Maestro del Genjutsu (0% Dorado): Aplica efectos de estado letales mediante Tsukuyomi (★★★) y Amaterasu (★★). Vulnerable a ataques Dorados.',
    segments: [
      { name: 'Tsukuyomi (Pesadilla)', color: 'purple', power: 0, stars: 3, size: 36, effect: 'instant_ko' },
      { name: 'Amaterasu (Llama Negra)', color: 'purple', power: 0, stars: 2, size: 24, effect: 'burn_knockback' },
      { name: 'Katon: Gōkakyū no Jutsu', color: 'white', power: 80, stars: 0, size: 16, effect: null },
      { name: 'Clon de Cuervos', color: 'blue', power: 0, stars: 0, size: 12, effect: 'dodge' },
      { name: 'Ceguera Mangekyō', color: 'red', power: 0, stars: 0, size: 8, effect: null }
    ]
  },
  {
    key: 'gaara',
    rarity: 'EX',
    archetype: 'Bastión Defensivo (Inmune a Rodeo)',
    name: 'Gaara del Desierto',
    shortName: 'Gaara',
    mp: 1,
    blocksPassThrough: true,
    immuneToSurround: true,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/10/293375.jpg',
    ability: 'Muro Inexpugnable (37.5% Azul, 0% Dorado): Inmune a Rodeo y bloquea paso. Prisión de Arena (★★) congela al enemigo en arena.',
    segments: [
      { name: 'Escudo de Shukaku', color: 'blue', power: 0, stars: 0, size: 36, effect: 'dodge' },
      { name: 'Ataúd de Arena', color: 'white', power: 130, stars: 0, size: 32, effect: null },
      { name: 'Prisión de Arena (Sello)', color: 'purple', power: 0, stars: 2, size: 16, effect: 'freeze_seal' },
      { name: 'Grieta en la Armadura', color: 'red', power: 0, stars: 0, size: 12, effect: null }
    ]
  },
  {
    key: 'naruto',
    rarity: 'EX',
    archetype: 'Brawler Ofensivo (62.5% Blanco, 25% Dorado)',
    name: 'Naruto Uzumaki',
    shortName: 'Naruto',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/2/284121.jpg',
    ability: 'Asalto Frontal (0% Azul, 0% Morado): Daño masivo frontal con Rasenshuriken (130 DMG) y Rasengan (90 DMG). Evoluciona a Modo Kurama al noquear.',
    segments: [
      { name: 'Fūton: Rasenshuriken', color: 'white', power: 130, stars: 0, size: 32, effect: null },
      { name: 'Rasengan Clásico', color: 'white', power: 90, stars: 0, size: 28, effect: null },
      { name: 'Naruto Rendan (Clones)', color: 'gold', power: 50, stars: 0, size: 24, effect: null },
      { name: 'Choque de Chakra', color: 'red', power: 0, stars: 0, size: 12, effect: null }
    ]
  },
  {
    key: 'sasuke',
    rarity: 'EX',
    archetype: 'Asesino Táctico Híbrido (0% Azul)',
    name: 'Sasuke Uchiha',
    shortName: 'Sasuke',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/9/131317.jpg',
    ability: 'Filo Relámpago: Carece de defensa Azul. Gran letalidad con Kirin (140 DMG) y parálisis con Chidori Nagashi (100 DMG).',
    segments: [
      { name: 'Chidori Nagashi', color: 'white', power: 100, stars: 0, size: 32, effect: 'paralyze_enemy' },
      { name: 'Kirin (Trueno Celestial)', color: 'white', power: 140, stars: 0, size: 24, effect: null },
      { name: 'Genjutsu: Sharingan', color: 'purple', power: 0, stars: 2, size: 24, effect: 'confuse_wait' },
      { name: 'Chidori Senbon', color: 'gold', power: 40, stars: 0, size: 8, effect: null },
      { name: 'Sobrecarga de Marca', color: 'red', power: 0, stars: 0, size: 8, effect: null }
    ]
  },
  {
    key: 'kakashi',
    rarity: 'EX',
    archetype: 'Estratega Equilibrado',
    name: 'Kakashi Hatake',
    shortName: 'Kakashi',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/7/284129.jpg',
    ability: 'Versatilidad ANBU: Cortador Relámpago Dorado (80 DMG), Kamui Morado (★★) que empuja rivales y clon de rayo con parálisis.',
    segments: [
      { name: 'Raikiri (Cortador)', color: 'gold', power: 80, stars: 0, size: 32, effect: null },
      { name: 'Kamui (Distorsión)', color: 'purple', power: 0, stars: 2, size: 24, effect: 'push_wait' },
      { name: 'Clon de Rayo (Raiton)', color: 'white', power: 90, stars: 0, size: 20, effect: 'paralyze_enemy' },
      { name: 'Doton: Muro de Tierra', color: 'blue', power: 0, stars: 0, size: 12, effect: 'dodge' },
      { name: 'Agotamiento de Chakra', color: 'red', power: 0, stars: 0, size: 8, effect: null }
    ]
  },
  {
    key: 'pain',
    rarity: 'UX',
    archetype: 'Dominador Gravitacional (Líder Akatsuki)',
    name: 'Pain (Camino Deva)',
    shortName: 'Pain',
    mp: 2,
    portraitUrl: 'https://cdn.myanimelist.net/images/characters/8/73473.jpg',
    ability: 'Seis Caminos del Dolor: Shinra Tensei (★★★) empuja con Espera 2 y Chibaku Tensei (130 DMG) aplasta la vanguardia enemiga.',
    segments: [
      { name: 'Chibaku Tensei', color: 'white', power: 130, stars: 0, size: 32, effect: null },
      { name: 'Shinra Tensei (Repulsión)', color: 'purple', power: 0, stars: 3, size: 28, effect: 'push_wait' },
      { name: 'Banshō Tenin', color: 'white', power: 90, stars: 0, size: 20, effect: null },
      { name: 'Intervalo de 5s (Fallo)', color: 'red', power: 0, stars: 0, size: 16, effect: null }
    ]
  }
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
      return Promise.resolve(['minato', 'lee', 'itachi', 'gaara', 'naruto', 'sasuke']);
    }
    return Promise.resolve(['pain', 'itachi', 'sasuke', 'gaara', 'kakashi', 'minato']);
  }

  async getDefaultPlateLoadout(): Promise<string[]> {
    return Promise.resolve(['goal_block', 'max_revive', 'double_chance', 'x_attack']);
  }
}
