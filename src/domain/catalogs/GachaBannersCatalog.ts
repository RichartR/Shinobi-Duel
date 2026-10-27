export interface GachaRatesConfig {
  UX: number;
  EX: number;
  R: number;
  UC: number;
  C: number;
}

export const CANONICAL_GACHA_RATES: GachaRatesConfig = {
  UX: 1.5,
  EX: 12.0,
  R: 21.5,
  UC: 25.0,
  C: 40.0,
};

export const PITY_THRESHOLD = 40;

export interface GachaBannerConfig {
  key: string;
  title: string;
  subtitle: string;
  jpTitle: string;
  costSingle: number;
  costMulti: number;
  poolFigureKeys: string[];
  rateUpShinobis: string[];
  badgeBg: string;
  accentColor: string;
  isActive: boolean;
  rates: GachaRatesConfig;
}

export const GACHA_BANNERS_CATALOG: GachaBannerConfig[] = [
  {
    key: 'arc1_novatos_konoha',
    title: 'Pergamino I: Los Novatos de Konoha',
    subtitle: 'Elenco inicial del 1er Arco. Los 10 ninjas recién graduados de la Academia cuando eran niños.',
    jpTitle: '巻之一 • 木ノ葉のルーキー (初編)',
    costSingle: 50,
    costMulti: 450,
    poolFigureKeys: [
      'naruto_genin',
      'sasuke_genin',
      'sakura_genin',
      'shikamaru_genin',
      'choji_genin',
      'ino_genin',
      'hinata_genin',
      'kiba_genin',
      'shino_genin',
      'lee_genin',
    ],
    rateUpShinobis: ['shikamaru_genin', 'choji_genin', 'lee_genin', 'hinata_genin'],
    badgeBg: 'bg-black text-[#FA9427]',
    accentColor: '#FA9427',
    isActive: true,
    rates: CANONICAL_GACHA_RATES,
  },
  {
    key: 'arc2_chunin_exam',
    title: 'Pergamino II: Exámenes Chūnin (Próximo Arco)',
    subtitle: 'Próxima expansión: Introducirá a Gaara, Kankurō, Temari, Neji, Tenten y versiones evolucionadas.',
    jpTitle: '巻之二 • 中忍選抜試験 (近日開放)',
    costSingle: 60,
    costMulti: 540,
    poolFigureKeys: ['lee_genin', 'sasuke_genin', 'naruto_genin', 'shikamaru_genin', 'hinata_genin'],
    rateUpShinobis: ['lee_genin', 'sasuke_genin', 'naruto_genin'],
    badgeBg: 'bg-[#14532D] text-emerald-300',
    accentColor: '#16A34A',
    isActive: false,
    rates: CANONICAL_GACHA_RATES,
  },
  {
    key: 'arc3_sannin_clash',
    title: 'Pergamino III: Los Tres Sannin (Bloqueado)',
    subtitle: 'Se desbloqueará al avanzar en la historia ninja. Jiraiya, Orochimaru y Tsunade.',
    jpTitle: '巻之三 • 伝説の三竦み (封印中)',
    costSingle: 70,
    costMulti: 630,
    poolFigureKeys: ['naruto_genin', 'sasuke_genin', 'sakura_genin'],
    rateUpShinobis: ['naruto_genin', 'sasuke_genin'],
    badgeBg: 'bg-stone-800 text-stone-400',
    accentColor: '#9333EA',
    isActive: false,
    rates: CANONICAL_GACHA_RATES,
  },
];

export function getBannerByKey(key: string): GachaBannerConfig {
  return GACHA_BANNERS_CATALOG.find(b => b.key === key) || GACHA_BANNERS_CATALOG[0];
}
