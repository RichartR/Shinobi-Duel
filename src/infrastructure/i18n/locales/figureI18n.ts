import { SupportedLanguage } from '../types';
import { WheelSegment } from '../../../domain/models/ShinobiFigure';
import { TacticalScroll } from '../../../domain/models/TacticalScroll';

export interface LocalizedFigureData {
  name: string;
  shortName: string;
  archetype: string;
  ability: string;
  segmentNames: string[];
}

export interface LocalizedScrollData {
  name: string;
  description: string;
}

const FIGURE_I18N: Record<SupportedLanguage, Record<string, LocalizedFigureData>> = {
  es: {
    minato: {
      name: 'Minato Namikaze',
      shortName: 'Minato',
      archetype: 'Corredor Anti-Jutsu (Arquetipo Mew)',
      ability: 'Salto Espacio-Temporal: Con 48/96 Dorado destruye Jutsus Morados. Su Hiraishin (50 DMG) sobrevive e impide ser noqueado si el rival gira 100 DMG o más.',
      segmentNames: [
        'Hiraishin no Jutsu',
        'Rasengan Relámpago',
        'Shunshin (Evasión)',
        'Kunai Desviado (Fallo)',
      ],
    },
    lee: {
      name: 'Rock Lee',
      shortName: 'Rock Lee',
      archetype: 'Taijutsu Puro (0% Morado, 0% Azul)',
      ability: 'Restricción de Taijutsu Puro: Incapaz de usar Ninjutsu o esquivas Azules. Si gana con Ura Renge (140 DMG), sufre Espera 2 por desgaste.',
      segmentNames: [
        'Omote Renge (Loto)',
        'Konoha Senpū',
        'Ura Renge (8 Puertas)',
        'Agotamiento Muscular (Fallo)',
      ],
    },
    itachi: {
      name: 'Itachi Uchiha',
      shortName: 'Itachi',
      archetype: 'Controlador Genjutsu (62.5% Morado)',
      ability: 'Maestro del Genjutsu (0% Dorado): Aplica efectos de estado letales mediante Tsukuyomi (★★★) y Amaterasu (★★). Vulnerable a ataques Dorados.',
      segmentNames: [
        'Tsukuyomi (Pesadilla)',
        'Amaterasu (Llama Negra)',
        'Katon: Gōkakyū no Jutsu',
        'Clon de Cuervos (Evasión)',
        'Ceguera Mangekyō (Fallo)',
      ],
    },
    gaara: {
      name: 'Gaara del Desierto',
      shortName: 'Gaara',
      archetype: 'Bastión Defensivo (Inmune a Rodeo)',
      ability: 'Muro Inexpugnable (37.5% Azul, 0% Dorado): Inmune a Rodeo y bloquea paso. Prisión de Arena (★★) congela al enemigo en arena.',
      segmentNames: [
        'Escudo de Shukaku (Evasión)',
        'Ataúd de Arena',
        'Prisión de Arena (Sello)',
        'Grieta en la Armadura (Fallo)',
      ],
    },
    naruto: {
      name: 'Naruto Uzumaki',
      shortName: 'Naruto',
      archetype: 'Brawler Ofensivo (62.5% Blanco, 25% Dorado)',
      ability: 'Asalto Frontal (0% Azul, 0% Morado): Daño masivo frontal con Rasenshuriken (130 DMG) y Rasengan (90 DMG). Evoluciona a Modo Kurama al noquear.',
      segmentNames: [
        'Fūton: Rasenshuriken',
        'Rasengan Clásico',
        'Naruto Rendan (Clones)',
        'Choque de Chakra (Fallo)',
      ],
    },
    sasuke: {
      name: 'Sasuke Uchiha',
      shortName: 'Sasuke',
      archetype: 'Asesino Táctico Híbrido (0% Azul)',
      ability: 'Filo Relámpago: Carece de defensa Azul. Gran letalidad con Kirin (140 DMG) y parálisis con Chidori Nagashi (100 DMG).',
      segmentNames: [
        'Chidori Nagashi',
        'Kirin (Trueno Celestial)',
        'Genjutsu: Sharingan',
        'Chidori Senbon',
        'Sobrecarga de Marca (Fallo)',
      ],
    },
    kakashi: {
      name: 'Kakashi Hatake',
      shortName: 'Kakashi',
      archetype: 'Estratega Equilibrado',
      ability: 'Versatilidad ANBU: Cortador Relámpago Dorado (80 DMG), Kamui Morado (★★) que empuja rivales y clon de rayo con parálisis.',
      segmentNames: [
        'Raikiri (Cortador)',
        'Kamui (Distorsión)',
        'Clon de Rayo (Raiton)',
        'Doton: Muro de Tierra (Evasión)',
        'Agotamiento de Chakra (Fallo)',
      ],
    },
    pain: {
      name: 'Pain (Camino Deva)',
      shortName: 'Pain',
      archetype: 'Dominador Gravitacional (Líder Akatsuki)',
      ability: 'Seis Caminos del Dolor: Shinra Tensei (★★★) empuja con Espera 2 y Chibaku Tensei (130 DMG) aplasta la vanguardia enemiga.',
      segmentNames: [
        'Chibaku Tensei',
        'Shinra Tensei (Repulsión)',
        'Banshō Tenin',
        'Intervalo de 5s (Fallo)',
      ],
    },
  },

  en: {
    minato: {
      name: 'Minato Namikaze',
      shortName: 'Minato',
      archetype: 'Anti-Jutsu Runner (Mew Archetype)',
      ability: 'Space-Time Leap: With 48/96 Gold destroys Purple Jutsus. Flying Raijin (50 DMG) survives and prevents knockout if the opponent spins 100 DMG or higher.',
      segmentNames: [
        'Flying Raijin Jutsu',
        'Lightning Rasengan',
        'Body Flicker (Dodge)',
        'Deflected Kunai (Miss)',
      ],
    },
    lee: {
      name: 'Rock Lee',
      shortName: 'Rock Lee',
      archetype: 'Pure Taijutsu (0% Purple, 0% Blue)',
      ability: 'Pure Taijutsu Discipline: Incapable of Ninjutsu or Blue Dodges. Winning with Hidden Lotus (140 DMG) inflicts Wait 2 due to physical recoil.',
      segmentNames: [
        'Primary Lotus',
        'Leaf Hurricane',
        'Hidden Lotus (8 Gates)',
        'Muscle Fatigue (Miss)',
      ],
    },
    itachi: {
      name: 'Itachi Uchiha',
      shortName: 'Itachi',
      archetype: 'Genjutsu Controller (62.5% Purple)',
      ability: 'Genjutsu Master (0% Gold): Inflicts deadly status effects through Tsukuyomi (★★★) and Amaterasu (★★). Vulnerable to Gold priority attacks.',
      segmentNames: [
        'Tsukuyomi (Nightmare)',
        'Amaterasu (Black Flame)',
        'Fire Style: Fireball Jutsu',
        'Crow Clone (Dodge)',
        'Mangekyo Strain (Miss)',
      ],
    },
    gaara: {
      name: 'Gaara of the Desert',
      shortName: 'Gaara',
      archetype: 'Defensive Bastion (Surround Immune)',
      ability: 'Impregnable Wall (37.5% Blue, 0% Gold): Immune to Surround KO and blocks pass-through. Sand Prison (★★) freezes enemies in sand.',
      segmentNames: [
        'Shield of Sand (Dodge)',
        'Sand Binding Coffin',
        'Sand Prison (Seal)',
        'Armor Fracture (Miss)',
      ],
    },
    naruto: {
      name: 'Naruto Uzumaki',
      shortName: 'Naruto',
      archetype: 'Frontline Brawler (62.5% White, 25% Gold)',
      ability: 'Frontal Assault (0% Blue, 0% Purple): Massive damage with Rasenshuriken (130 DMG) and Rasengan (90 DMG). Awakens to Kurama Mode on KO.',
      segmentNames: [
        'Wind Style: Rasenshuriken',
        'Classic Rasengan',
        'Naruto Uzumaki Combo',
        'Chakra Clash (Miss)',
      ],
    },
    sasuke: {
      name: 'Sasuke Uchiha',
      shortName: 'Sasuke',
      archetype: 'Tactical Hybrid Assassin (0% Blue)',
      ability: 'Lightning Edge: Lacks Blue dodge. High lethality with Kirin (140 DMG) and paralysis via Chidori Nagashi (100 DMG).',
      segmentNames: [
        'Chidori Current',
        'Kirin (Celestial Lightning)',
        'Genjutsu: Sharingan',
        'Chidori Senbon',
        'Curse Mark Overload (Miss)',
      ],
    },
    kakashi: {
      name: 'Kakashi Hatake',
      shortName: 'Kakashi',
      archetype: 'Balanced Strategist',
      ability: 'ANBU Versatility: Lightning Blade Gold (80 DMG), Kamui Purple (★★) knockback, and Lightning Clone with paralysis.',
      segmentNames: [
        'Lightning Blade (Raikiri)',
        'Kamui (Dimensional Warp)',
        'Lightning Clone',
        'Earth Style: Mud Wall (Dodge)',
        'Chakra Depletion (Miss)',
      ],
    },
    pain: {
      name: 'Pain (Deva Path)',
      shortName: 'Pain',
      archetype: 'Gravitational Dominator (Akatsuki Leader)',
      ability: 'Six Paths of Pain: Shinra Tensei (★★★) knocks back with Wait 2, and Chibaku Tensei (130 DMG) crushes the enemy frontline.',
      segmentNames: [
        'Catastrophic Planetary Construction',
        'Almighty Push (Shinra Tensei)',
        'Universal Pull (Bansho Tenin)',
        '5-Second Interval (Miss)',
      ],
    },
  },

  ja: {
    minato: {
      name: '波風ミナト',
      shortName: 'ミナト',
      archetype: '抗術・疾風ランナー (ミュウ型)',
      ability: '時空間跳躍: 48/96の金技で敵の紫奥義を瞬時に破滅。飛雷神(50 DMG)は相手が100 DMG以上の大技を出しても致死打撃を完全無効化し生き残る。',
      segmentNames: [
        '飛雷神の術',
        '迅雷の螺旋丸',
        '瞬身の術 (回避)',
        'クナイ逸れ (ミス)',
      ],
    },
    lee: {
      name: 'ロック・リー',
      shortName: 'リー',
      archetype: '剛拳体術・真髄 (紫0%・青0%)',
      ability: '純粋体術の掟: 忍術や青回避を一切持たない剛拳。裏蓮華(140 DMG)で勝利した際、肉体反動により待機2が付与される。',
      segmentNames: [
        '表蓮華',
        '木ノ葉旋風',
        '裏蓮華 (八門遁甲)',
        '筋肉疲労 (ミス)',
      ],
    },
    itachi: {
      name: 'うちはイタチ',
      shortName: 'イタチ',
      archetype: '幻術支配・奥義特化 (紫62.5%)',
      ability: '幻術の達人 (金0%): 月読(★★★)による即死と天照(★★)の黒炎火傷で盤面を制圧。速攻の金技に弱い弱点を持つ。',
      segmentNames: [
        '月読 (悪夢)',
        '天照 (黒炎)',
        '火遁・豪火球の術',
        '烏分身 (回避)',
        '万華鏡の反動 (ミス)',
      ],
    },
    gaara: {
      name: '砂漠の我愛羅',
      shortName: '我愛羅',
      archetype: '絶対防御・本陣守護 (包囲無効)',
      ability: '砂の防壁 (青37.5%・金0%): 包囲封印を完全無効化し通過も遮断。砂縛牢(★★)で敵を砂結界に封印凍結する。',
      segmentNames: [
        '守鶴の盾 (回避)',
        '砂縛柩',
        '砂の牢獄 (封印)',
        '砂の鎧破損 (ミス)',
      ],
    },
    naruto: {
      name: 'うずまきナルト',
      shortName: 'ナルト',
      archetype: '正面突破・猛攻型 (白62.5%・金25%)',
      ability: '猪突猛進 (青0%・紫0%): 螺旋手裏剣(130 DMG)と螺旋丸(90 DMG)の圧倒的破壊力。敵を撃破すると九喇嘛モードへ覚醒。',
      segmentNames: [
        '風遁・螺旋手裏剣',
        '本家・螺旋丸',
        'うずまきナルト連弾',
        'チャクラ乱れ (ミス)',
      ],
    },
    sasuke: {
      name: 'うちはサスケ',
      shortName: 'サスケ',
      archetype: '雷遁暗殺・万能型 (青0%)',
      ability: '雷撃の刃: 青回避を持たない攻撃特化。麒麟(140 DMG)の超威力と千鳥流し(100 DMG)の麻痺付与で敵を制圧。',
      segmentNames: [
        '千鳥流し',
        '麒麟 (天雷)',
        '写輪眼の幻術',
        '千鳥千本',
        '呪印暴走 (ミス)',
      ],
    },
    kakashi: {
      name: 'はたけカカシ',
      shortName: 'カカシ',
      archetype: '万能写輪眼・戦術家',
      ability: '暗部の経験: 金技・雷切(80 DMG)、敵を強制吹き飛ばす神威(★★)、麻痺を与える雷分身を駆使する名軍師。',
      segmentNames: [
        '雷切 (神速)',
        '神威 (時空間)',
        '雷遁・雷分身',
        '土遁・土流壁 (回避)',
        'チャクラ枯渇 (ミス)',
      ],
    },
    pain: {
      name: 'ペイン (天道)',
      shortName: 'ペイン',
      archetype: '重力支配・暁の神 (UX規格)',
      ability: '輪廻の力: 神羅天征(★★★)で敵を強制後退させ待機2を付与。地爆天星(130 DMG)で敵陣を一撃粉砕する。',
      segmentNames: [
        '地爆天星',
        '神羅天征 (斥力)',
        '万象天引 (引力)',
        '5秒の空白 (ミス)',
      ],
    },
  },
};

const SCROLL_I18N: Record<SupportedLanguage, Record<string, LocalizedScrollData>> = {
  es: {
    goal_block: {
      name: 'Pergamino de Protección (Goal Block)',
      description: 'Teletransporta a un aliado desde el banquillo o campo directamente a la Base propia.',
    },
    max_revive: {
      name: 'Sello de Resurrección (Max Revive)',
      description: 'Libera de inmediato a una figura aliada de la Prisión Fuinjutsu a la banca sin condición de espera.',
    },
    double_chance: {
      name: 'Ojo de la Presciencia (Double Chance)',
      description: 'Permite re-girar la ruleta de chakra en el siguiente combate si el resultado no es favorable.',
    },
    x_attack: {
      name: 'Píldora Militar de Chakra (X Attack)',
      description: 'Aumenta en +30 DMG todos los ataques blancos y dorados del ninja durante este turno.',
    },
    hurdle_jump: {
      name: 'Salto de Teletransporte (Hurdle Jump)',
      description: 'Permite saltar sobre una figura adyacente (aliada o enemiga) hacia un nodo libre continuo.',
    },
  },
  en: {
    goal_block: {
      name: 'Protection Scroll (Goal Block)',
      description: 'Warps an ally from the bench or board directly to your own Base.',
    },
    max_revive: {
      name: 'Resurrection Seal (Max Revive)',
      description: 'Instantly frees an allied figure from the Fuinjutsu Prison to the bench with no wait penalty.',
    },
    double_chance: {
      name: 'Eye of Precognition (Double Chance)',
      description: 'Allows re-spinning the chakra wheel in the next battle if the outcome is unfavorable.',
    },
    x_attack: {
      name: 'Military Chakra Pill (X Attack)',
      description: 'Increases all white and gold attacks by +30 DMG for the active ninja this turn.',
    },
    hurdle_jump: {
      name: 'Hurdle Leap (Hurdle Jump)',
      description: 'Allows leaping over an adjacent figure (ally or enemy) to an open connected node.',
    },
  },
  ja: {
    goal_block: {
      name: '守護の巻物 (ゴールブロック)',
      description: '味方1体を盤上または控えから自陣本陣へ直接口寄せします。',
    },
    max_revive: {
      name: '蘇生の封印 (マックスリバイブ)',
      description: '封印牢の味方1体を待機ペナルティなしで即座に控えへ解放します。',
    },
    double_chance: {
      name: '先見の瞳 (ダブルチャンス)',
      description: '次の戦闘で結果が不利な場合、チャクラルーレットの再回転が可能です。',
    },
    x_attack: {
      name: '兵糧丸の力 (Xアタック)',
      description: 'この手番中、忍のすべての白技・金技の威力を+30 DMG強化します。',
    },
    hurdle_jump: {
      name: '跳躍の術 (ハードルジャンプ)',
      description: '隣接する駒(味方・敵)を飛び越えて、その先の空きノードへ着地します。',
    },
  },
};

export function getLocalizedFigure<T extends { key: string; name: string; shortName: string; archetype: string; ability: string; segments?: WheelSegment[] }>(
  fig: T,
  lang: SupportedLanguage
): T {
  const dict = FIGURE_I18N[lang] || FIGURE_I18N.es;
  const loc = dict[fig.key];
  if (!loc) return fig;

  const localizedSegments = fig.segments
    ? fig.segments.map((s, idx) => ({
        ...s,
        name: loc.segmentNames[idx] || s.name,
      }))
    : undefined;

  return {
    ...fig,
    name: loc.name,
    shortName: loc.shortName,
    archetype: loc.archetype,
    ability: loc.ability,
    ...(localizedSegments ? { segments: localizedSegments } : {}),
  };
}

export function getLocalizedScroll<T extends TacticalScroll>(scroll: T, lang: SupportedLanguage): T {
  const dict = SCROLL_I18N[lang] || SCROLL_I18N.es;
  const loc = dict[scroll.id];
  if (!loc) return scroll;

  return {
    ...scroll,
    name: loc.name,
    description: loc.description,
  };
}
