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
    naruto: {
      name: 'Naruto Uzumaki (Genin)',
      shortName: 'Naruto',
      archetype: 'Brawler Impetuoso de la Academia',
      ability: 'Perseverancia Shinobi: Su voluntad inquebrantable supera su falta de técnica inicial. Si empata en una batalla, gana +1 MP en su siguiente turno.',
      segmentNames: [
        'Kage Bunshin no Jutsu',
        'Taijutsu de la Academia',
        'Oiroke no Jutsu',
        'Kawarimi no Jutsu',
        'Tropezón de Novato',
      ],
    },
    sasuke: {
      name: 'Sasuke Uchiha (Genin)',
      shortName: 'Sasuke',
      archetype: 'Prodigio del Clan Uchiha',
      ability: 'Orgullo Uchiha: Su Shurikenjutsu Dorado (24/96) destruye Jutsus Morados si el rival es de igual o menor rango.',
      segmentNames: [
        'Katon: Gōkakyū no Jutsu',
        'Shurikenjutsu Veloz',
        'Taijutsu del Halcón',
        'Esquiva Táctica',
        'Duda Juvenil',
      ],
    },
    sakura: {
      name: 'Sakura Haruno (Genin)',
      shortName: 'Sakura',
      archetype: 'Estratega de Apoyo Académico',
      ability: 'Control Fino de Chakra: Las figuras aliadas adyacentes reducen su segmento de fallo Rojo en 4.',
      segmentNames: [
        '¡Shānnarō!',
        'Lanzamiento de Kunai',
        'Bunshin Ilusorio',
        'Posición Defensiva',
        'Duda ante el Peligro',
      ],
    },
    shikamaru: {
      name: 'Shikamaru Nara (Genin)',
      shortName: 'Shikamaru',
      archetype: 'Controlador Táctico de Sombras',
      ability: 'Estrategia Perezosa: Si el enemigo inicia batalla contra él, Shikamaru puede forzar a ambos a girar de nuevo una vez por combate.',
      segmentNames: [
        'Kagemane no Jutsu',
        'Trampa con Hilos Ninja',
        'Golpe Calculado',
        'Retirada Estratégica',
        'Qué Fastidio...',
      ],
    },
    choji: {
      name: 'Chōji Akimichi (Genin)',
      shortName: 'Chōji',
      archetype: 'Ariete de Impacto Frontal',
      ability: 'Glotón Imparable (0% Azul): Si gana con Nikudan Sensha, empuja a la figura rival 1 casilla hacia atrás.',
      segmentNames: [
        'Nikudan Sensha',
        'Baika no Jutsu (Parcial)',
        'Placaje Pesado',
        'Merienda Inoportuna',
      ],
    },
    ino: {
      name: 'Ino Yamanaka (Genin)',
      shortName: 'Ino',
      archetype: 'Infiltradora Mental de Apoyo',
      ability: 'Transferencia Mental: Shintenshin no Jutsu (★★) confunde al enemigo y le aplica Espera 2 si gana.',
      segmentNames: [
        'Shintenshin no Jutsu',
        'Flor Trampa con Senbon',
        'Bofetada Certera',
        'Esquiva Grácil',
        'Desconexión Espiritual',
      ],
    },
    hinata: {
      name: 'Hinata Hyūga (Genin)',
      shortName: 'Hinata',
      archetype: 'Bloqueadora de Tenketsu',
      ability: 'Visión del Byakugan: Inmune a Rodeo si hay al menos una figura aliada a 2 casillas.',
      segmentNames: [
        'Jūken: Golpe Suave',
        'Reflejo Byakugan',
        'Guardia Protectora',
        'Bloqueo de Tenketsu',
        'Timidez Paralizante',
      ],
    },
    kiba: {
      name: 'Kiba Inuzuka & Akamaru (Genin)',
      shortName: 'Kiba',
      archetype: 'Rastreador Cuadrúpedo de Asalto',
      ability: 'Dúo Canino: Puede atravesar figuras aliadas durante su movimiento sin gastar MP extra.',
      segmentNames: [
        'Tsūga (Colmillo Perforador)',
        'Shikyaku no Jutsu',
        'Mordisco de Akamaru',
        'Desvío Rápido',
        'Distracción Canina',
      ],
    },
    shino: {
      name: 'Shino Aburame (Genin)',
      shortName: 'Shino',
      archetype: 'Parásito Drenador de Chakra',
      ability: 'Enjambre Kikaichū: Si empata en combate, la figura rival pierde 1 MP en su próximo turno.',
      segmentNames: [
        'Mushi Dama',
        'Drenaje Kikaichū',
        'Clon de Insectos',
        'Ataque Sorpresa',
        'Dispersión de Enjambre',
      ],
    },
    lee: {
      name: 'Rock Lee (Genin)',
      shortName: 'Rock Lee',
      archetype: 'Genin de Taijutsu Puro',
      ability: 'Pesas en los Tobillos (0% Morado, 0% Azul): Incapaz de usar Ninjutsu o esquivas. Si gana con Konoha Senpū, avanza 1 casilla.',
      segmentNames: [
        'Konoha Senpū',
        'Patada Directa',
        'Ráfaga de Puños',
        'Tropiezo con las Pesas',
      ],
    },
  },

  en: {
    naruto: {
      name: 'Naruto Uzumaki (Genin)',
      shortName: 'Naruto',
      archetype: 'Impetuous Academy Brawler',
      ability: 'Shinobi Grit: Unyielding spirit overcomes lack of raw technique. If tying in battle, gains +1 MP on next turn.',
      segmentNames: [
        'Shadow Clone Jutsu',
        'Academy Taijutsu',
        'Sexy Jutsu',
        'Substitution Jutsu',
        'Rookie Slip-up',
      ],
    },
    sasuke: {
      name: 'Sasuke Uchiha (Genin)',
      shortName: 'Sasuke',
      archetype: 'Uchiha Clan Prodigy',
      ability: 'Uchiha Pride: Gold Shurikenjutsu (24/96) destroys equal or lower rank Purple Jutsus.',
      segmentNames: [
        'Fire Style: Fireball Jutsu',
        'Swift Shurikenjutsu',
        'Falcon Taijutsu',
        'Tactical Dodge',
        'Youthful Hesitation',
      ],
    },
    sakura: {
      name: 'Sakura Haruno (Genin)',
      shortName: 'Sakura',
      archetype: 'Academy Support Tactician',
      ability: 'Chakra Control: Adjacent allied figures reduce their Red miss segment by 4.',
      segmentNames: [
        'Cha! (Shānnarō)',
        'Kunai Throw',
        'Illusion Clone',
        'Guarded Stance',
        'Battle Hesitation',
      ],
    },
    shikamaru: {
      name: 'Shikamaru Nara (Genin)',
      shortName: 'Shikamaru',
      archetype: 'Shadow Tactician',
      ability: 'Lazy Strategy: If an enemy initiates battle against him, Shikamaru can force both to respin once per battle.',
      segmentNames: [
        'Shadow Possession Jutsu',
        'Wire & Kunai Trap',
        'Calculated Strike',
        'Tactical Retreat',
        'What a Drag...',
      ],
    },
    choji: {
      name: 'Chōji Akimichi (Genin)',
      shortName: 'Chōji',
      archetype: 'Heavy Frontline Batter',
      ability: 'Unstoppable Glutton (0% Blue): Winning with Human Boulder pushes the opposing figure 1 node backwards.',
      segmentNames: [
        'Human Boulder',
        'Expansion Jutsu (Partial)',
        'Heavy Tackle',
        'Untimely Snack',
      ],
    },
    ino: {
      name: 'Ino Yamanaka (Genin)',
      shortName: 'Ino',
      archetype: 'Mind Infiltrator Support',
      ability: 'Mind Transfer: Mind Transfer Jutsu (★★) confuses the enemy and inflicts Wait 2 if victorious.',
      segmentNames: [
        'Mind Transfer Jutsu',
        'Flower Senbon Trap',
        'Accurate Slap',
        'Graceful Dodge',
        'Spiritual Disconnect',
      ],
    },
    hinata: {
      name: 'Hinata Hyūga (Genin)',
      shortName: 'Hinata',
      archetype: 'Chakra Point Blocker',
      ability: 'Byakugan Sight: Immune to Surround KO if at least one allied figure is within 2 nodes.',
      segmentNames: [
        'Gentle Fist: Soft Palm',
        'Byakugan Reflex',
        'Protective Stance',
        'Tenketsu Block',
        'Paralyzing Shyness',
      ],
    },
    kiba: {
      name: 'Kiba Inuzuka & Akamaru (Genin)',
      shortName: 'Kiba',
      archetype: 'Quadrupedal Tracker',
      ability: 'Canine Duo: Can pass through allied figures during movement without extra MP cost.',
      segmentNames: [
        'Tunneling Fang (Tsūga)',
        'Four Legs Technique',
        'Akamaru Bite',
        'Quick Sidestep',
        'Puppy Distraction',
      ],
    },
    shino: {
      name: 'Shino Aburame (Genin)',
      shortName: 'Shino',
      archetype: 'Parasitic Chakra Drainer',
      ability: 'Kikaichū Swarm: Tying in combat drains 1 MP from the opponent figure on their next turn.',
      segmentNames: [
        'Parasitic Insect Sphere',
        'Chakra Drain',
        'Insect Clone',
        'Surprise Ambush',
        'Swarm Dispersion',
      ],
    },
    lee: {
      name: 'Rock Lee (Genin)',
      shortName: 'Rock Lee',
      archetype: 'Pure Taijutsu Discipline',
      ability: 'Ankle Weights (0% Purple, 0% Blue): Cannot use Ninjutsu or Blue Dodges. Winning with Leaf Hurricane moves 1 node forward.',
      segmentNames: [
        'Leaf Hurricane',
        'Direct Kick',
        'Flurry of Punches',
        'Weight Stumble',
      ],
    },
  },

  ja: {
    naruto: {
      name: 'うずまきナルト (下忍)',
      shortName: 'ナルト',
      archetype: '熱血アカデミー突撃手',
      ability: '不屈の忍道: 引き分け時、次ターンに移動MP+1を獲得。',
      segmentNames: [
        '影分身の術',
        'アカデミー体術',
        'お色気の術',
        '変わり身の術',
        '新人のつまずき',
      ],
    },
    sasuke: {
      name: 'うちはサスケ (下忍)',
      shortName: 'サスケ',
      archetype: 'うちは一族の天才',
      ability: 'うちはの誇り: 金技(24/96)で同等以下の紫技を撃破。',
      segmentNames: [
        '火遁・豪火球の術',
        '疾風手裏剣術',
        '隼の体術',
        '戦術回避',
        '若き躊躇',
      ],
    },
    sakura: {
      name: '春野サクラ (下忍)',
      shortName: 'サクラ',
      archetype: '知性派サポート下忍',
      ability: '緻密なチャクラコントロール: 隣接する味方のミス幅を4減少。',
      segmentNames: [
        'しゃーんなろー！',
        'クナイ投擲',
        '幻分身',
        '防御姿勢',
        '恐怖の竦み',
      ],
    },
    shikamaru: {
      name: '奈良シカマル (下忍)',
      shortName: 'シカマル',
      archetype: '影の戦術統率者',
      ability: '面倒くさがり戦略: 敵から戦闘を仕掛けられた時、一度だけ再回転可能。',
      segmentNames: [
        '影真似の術',
        '仕込み糸罠',
        '計算された打撃',
        '戦略的撤退',
        'めんどくせぇ...',
      ],
    },
    choji: {
      name: '秋道チョウジ (下忍)',
      shortName: 'チョウジ',
      archetype: '肉弾衝撃突進手',
      ability: '止められない食欲: 肉弾戦車で勝利時、敵を1マス押し戻す。',
      segmentNames: [
        '肉弾戦車',
        '倍化の術 (部分)',
        '重厚タックル',
        '不意の間食',
      ],
    },
    ino: {
      name: '山中いの (下忍)',
      shortName: 'いの',
      archetype: '精神潜入サポート',
      ability: '心転身の術: 勝利時、相手に混乱と待機2を付与。',
      segmentNames: [
        '心転身の術',
        '千本仕込みの花',
        '的確な平手打ち',
        '優雅な回避',
        '精神離脱の隙',
      ],
    },
    hinata: {
      name: '日向ヒナタ (下忍)',
      shortName: 'ヒナタ',
      archetype: '点穴遮断・柔拳使い',
      ability: '白眼の視界: 2マス以内に味方がいる場合、包囲KOを完全無効化。',
      segmentNames: [
        '柔拳・掌打',
        '白眼の見切り',
        '守護の構え',
        '点穴封鎖',
        '竦む恥じらい',
      ],
    },
    kiba: {
      name: '犬塚キバ & 赤丸 (下忍)',
      shortName: 'キバ',
      archetype: '四脚急襲追跡手',
      ability: '犬忍コンビ: 移動時、味方駒をすり抜けて前進可能。',
      segmentNames: [
        '通牙',
        '四脚の術',
        '赤丸の噛みつき',
        '瞬速ステップ',
        '子犬の気まぐれ',
      ],
    },
    shino: {
      name: '油女シノ (下忍)',
      shortName: 'シノ',
      archetype: '寄壊蟲チャクラ吸収手',
      ability: '寄壊蟲の群れ: 引き分け時、相手の次ターンMPを1奪う。',
      segmentNames: [
        '蟲玉',
        'チャクラ吸収',
        '蟲分身',
        '奇襲攻撃',
        '蟲の拡散',
      ],
    },
    lee: {
      name: 'ロック・リー (下忍)',
      shortName: 'リー',
      archetype: '剛拳体術・下忍',
      ability: '足の重り: 忍術・回避不可。木ノ葉旋風で勝利時、1マス追加前進。',
      segmentNames: [
        '木ノ葉旋風',
        '直撃キック',
        '連打ラッシュ',
        '重りのつまずき',
      ],
    },
  },
};

const SCROLL_I18N: Record<SupportedLanguage, Record<string, LocalizedScrollData>> = {
  es: {
    goal_block: {
      name: 'Sello de Protección del Portal',
      description: 'Si una figura rival pisa tu portal, este sello bloquea la victoria instantánea y lo noquea.',
    },
    max_revive: {
      name: 'Pergamino de Resurrección Sagrada',
      description: 'Devuelve inmediatamente una figura de tu Prisión Fūinjutsu al banquillo lista para combatir.',
    },
    double_chance: {
      name: 'Ojo de Precognición',
      description: 'Permite volver a girar la ruleta de chakra una vez si el resultado no fue favorable.',
    },
    x_attack: {
      name: 'Píldora Militar de Chakra',
      description: 'Durante este turno, todos los ataques blancos y dorados de tu figura ganan +30 DMG.',
    },
    hurdle_jump: {
      name: 'Salto Acrobático Shinobi',
      description: 'Salta sobre una figura adyacente (aliada o rival) y aterriza en el nodo siguiente si está libre.',
    },
  },
  en: {
    goal_block: {
      name: 'Portal Protection Scroll',
      description: 'If an enemy lands on your goal, blocks instant victory and sends them to the prison.',
    },
    max_revive: {
      name: 'Sacred Resurrection Scroll',
      description: 'Instantly revives a figure from your Fuinjutsu Prison to the bench ready to battle.',
    },
    double_chance: {
      name: 'Eye of Precognition',
      description: 'Allows you to spin the chakra wheel again once if the outcome was unfavorable.',
    },
    x_attack: {
      name: 'Military Chakra Pill',
      description: 'All white and gold attacks on your figure gain +30 DMG during this turn.',
    },
    hurdle_jump: {
      name: 'Acrobatic Shinobi Leap',
      description: 'Leap over an adjacent figure (ally or foe) and land on the free node beyond.',
    },
  },
  ja: {
    goal_block: {
      name: '防壁の封印 (ゴールブロック)',
      description: '敵が陣地を踏んだ際、即時敗北を阻止し相手を牢獄へ送ります。',
    },
    max_revive: {
      name: '蘇生の巻物 (マックスリバイブ)',
      description: '牢獄の駒を即座にベンチへ復帰させます。',
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
