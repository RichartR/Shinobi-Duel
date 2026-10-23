import { SupportedLanguage } from '../types';

export type GuideSectionKey =
  | 'objective'
  | 'movement'
  | 'turnflow'
  | 'combat'
  | 'surround'
  | 'status'
  | 'forge'
  | 'plates';

export interface GuideI18nData {
  headerTitle: string;
  headerSubtitle: string;
  nav: Record<GuideSectionKey, string>;
  objective: {
    badge: string;
    title: string;
    goldenRuleBadge: string;
    goldenRuleTitle: string;
    goldenRuleDesc: string;
    p1Title: string;
    p1Desc: string;
    p2Title: string;
    p2Desc: string;
    secondaryWinTitle: string;
    secondaryWinDesc: string;
    defenseTitle: string;
    defenseDesc: string;
  };
  movement: {
    badge: string;
    title: string;
    mp3Title: string;
    mp3Desc: string;
    mp2Title: string;
    mp2Desc: string;
    mp1Title: string;
    mp1Desc: string;
    rulesTitle: string;
    deployTitle: string;
    deployDesc: string;
    collisionTitle: string;
    collisionDesc: string;
    turn1Title: string;
    turn1Desc: string;
    spawnLockTitle: string;
    spawnLockDesc: string;
  };
  turnflow: {
    badge: string;
    title: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
  };
  combat: {
    badge: string;
    title: string;
    intro: string;
    blueTitle: string;
    blueDesc: string;
    goldTitle: string;
    goldDesc: string;
    purpleTitle: string;
    purpleDesc: string;
    whiteTitle: string;
    whiteDesc: string;
    redTitle: string;
    redDesc: string;
    sRankTitle: string;
    sRankDesc: string;
  };
  surround: {
    badge: string;
    title: string;
    surroundTitle: string;
    surroundDesc: string;
    surroundTip: string;
    immunityTitle: string;
    immunityDesc: string;
    prisonTitle: string;
    prisonDesc1: string;
    prisonDesc2: string;
    waitNoteTitle: string;
    waitNoteDesc: string;
  };
  status: {
    badge: string;
    title: string;
    intro: string;
    burnTitle: string;
    burnDesc: string;
    paraTitle: string;
    paraDesc: string;
    confTitle: string;
    confDesc: string;
    freezeTitle: string;
    freezeDesc: string;
    assistTitle: string;
    assistDesc: string;
  };
  forge: {
    badge: string;
    title: string;
    intro: string;
    levelTitle: string;
    levelBadge: string;
    levelDesc: string;
    levelInvariant: string;
    clvTitle: string;
    clvBadge: string;
    clvDesc: string;
    clvPurpose: string;
  };
  plates: {
    badge: string;
    title: string;
    intro: string;
    costBadge: string;
    goalBlockTitle: string;
    goalBlockDesc: string;
    maxReviveTitle: string;
    maxReviveDesc: string;
    doubleChanceTitle: string;
    doubleChanceDesc: string;
    xAttackTitle: string;
    xAttackDesc: string;
  };
}

export const GUIDE_TRANSLATIONS: Record<SupportedLanguage, GuideI18nData> = {
  es: {
    headerTitle: 'MANUAL TÁCTICO CANÓNICO — SHINOBI DUEL',
    headerSubtitle: 'Reglamento oficial del sistema de juego, movimiento, colisiones, ruleta y combate',
    nav: {
      objective: '1. Objetivo y Victoria',
      movement: '2. Movimiento y MP',
      turnflow: '3. Flujo del Turno',
      combat: '4. Combate y Ruleta',
      surround: '5. Rodeo y Prisión',
      status: '6. Estados Alterados',
      forge: '7. Forja (Nv y ChLv)',
      plates: '8. Pergaminos Tácticos',
    },
    objective: {
      badge: 'FUNDAMENTO ESTRATÉGICO PRINCIPAL',
      title: 'Objetivo de la Victoria: Ocupar la Base Enemiga',
      goldenRuleBadge: 'REGLA DE ORO',
      goldenRuleTitle: 'La victoria se consigue conquistando la Meta rival, NO aniquilando a todas las figuras',
      goldenRuleDesc: 'Al igual que en los grandes juegos de tablero táctico como Pokémon Duel, la partida termina de forma inmediata y automática en el momento en que cualquiera de tus figuras pisa el nodo de Base del adversario:',
      p1Title: 'Objetivo del Jugador 1',
      p1Desc: 'Inicia en el sector inferior y debe cruzar el tablero para ocupar la Base Rival (Nodo #2) situada en el extremo superior.',
      p2Title: 'Objetivo del Jugador 2 / Oponente',
      p2Desc: 'Inicia en el sector superior y debe cruzar el tablero para ocupar la Base Rival (Nodo #15) situada en el extremo inferior.',
      secondaryWinTitle: 'Victoria Secundaria: Asedio y Capitulación',
      secondaryWinDesc: 'Si un jugador se queda sin figuras disponibles para actuar en el tablero y en el banquillo (por estar todas selladas en la Prisión Fuinjutsu o inmovilizadas sin movimientos legales posibles), es derrotado por asedio total.',
      defenseTitle: 'Defensa de la Base Propia',
      defenseDesc: 'Mantener una figura aliada centinela sobre tu propia Base (#15 o #2) o en sus nodos adyacentes impide que el rival pueda conquistarla. Si el oponente se acerca peligrosamente, pergaminos tácticos como Goal Block permiten teletransportar a un aliado a tu Base al instante.',
    },
    movement: {
      badge: 'MECÁNICA TÁCTICA FUNDAMENTAL',
      title: 'Movimiento, Puntos MP, Colisiones y Despliegue',
      mp3Title: 'FIGURAS ÁGILES (3 MP)',
      mp3Desc: 'Capaces de desplazarse hasta 3 nodos por turno. Diseñadas para avances rápidos, flanqueos y presión directa a las entradas rivales.',
      mp2Title: 'FIGURAS BALANCEADAS (2 MP)',
      mp2Desc: 'El estándar táctico de combate. Avanzan 2 nodos por turno, combinando un gran poder ofensivo en duelos y buena movilidad de posicionamiento.',
      mp1Title: 'FIGURAS DEFENSIVAS (1 MP)',
      mp1Desc: 'Movilidad contenida a 1 nodo por turno, compensada por sólidas habilidades pasivas de control territorial o inmunidades ante el rodeo.',
      rulesTitle: 'Reglas Oficiales de Movimiento y Tablero',
      deployTitle: '1. Despliegue desde el Banquillo',
      deployDesc: 'Las 6 figuras de cada jugador inician fuera del tablero (en el banquillo). Para entrar al campo de 28 nodos, deben gastar 1 punto de MP para pisar uno de sus dos puntos de entrada propios. Si la figura tiene MP restante, puede continuar avanzando por el tablero en ese mismo turno.',
      collisionTitle: '2. Bloqueo de Paso y Colisión',
      collisionDesc: 'Por regla canónica de colisión, no se puede atravesar ni saltar por encima de figuras aliadas ni enemigas. Un nodo ocupado interrumpe la línea de avance, salvo que una habilidad especial indique lo contrario.',
      turn1Title: '3. Handicap de Apertura (Turno 1)',
      turn1Desc: 'Para equilibrar la ventaja de mover primero, el jugador que abre la partida sufre una penalización de -1 MP en su primer movimiento.',
      spawnLockTitle: '4. Bloqueo de Entradas (Spawn Lock)',
      spawnLockDesc: 'Si una figura enemiga se detiene sobre tu punto de entrada, este queda bloqueado. Si el adversario ocupa tus dos puntos de entrada a la vez, tu banquillo quedará inutilizado hasta despejar al menos una entrada.',
    },
    turnflow: {
      badge: 'SECUENCIA PASO A PASO',
      title: 'Anatomía del Turno: Ciclo de Acciones',
      step1Title: 'Inicio de Turno y Mantenimiento de Espera',
      step1Desc: 'Al comenzar tu turno, todos los sellos de Espera (Wait) de tus figuras se reducen en 1. Las figuras que conserven Espera mayor a 0 no pueden moverse ni combatir.',
      step2Title: 'Activación de Pergamino Táctico (Opcional)',
      step2Desc: 'Antes de mover tu figura, puedes activar 1 pergamino táctico de tu barra de mando (ej: X Attack, Double Chance, Goal Block o Max Revive).',
      step3Title: 'Selección y Movimiento Táctico',
      step3Desc: 'Selecciona una figura válida. El sistema calculará y resaltará en dorado todos los nodos alcanzables según sus MP y colisiones. Pulsa en el destino para moverte.',
      step4Title: 'Toque de Asistencia y Rodeo Fuinjutsu',
      step4Desc: 'Si aterrizas junto a un aliado congelado, rompes el sello con un Toque de Asistencia. El sistema comprueba de inmediato si alguna figura ha quedado completamente rodeada.',
      step5Title: 'Duelo Opcional Post-Movimiento',
      step5Desc: 'Si estás en contacto adyacente con enemigos, verás el botón ⚔️ ATACAR sobre ellos. Pulsa para combatir o pulsa "Terminar Turno" para conservar la posición.',
    },
    combat: {
      badge: 'SISTEMA DE COMBATE DISCRETO',
      title: 'Choque de Discos de Chakra: Ruleta de 96 Segmentos y Jerarquía de Colores',
      intro: 'En Shinobi Duel las probabilidades son una circunferencia física discretizada en exactamente 96 segmentos unitarios. Cuando dos figuras combaten, ambas ruletas giran:',
      blueTitle: 'Azul (Esquiva / Desplazamiento)',
      blueDesc: 'Invalida cualquier ataque. Si caes en Azul, es imposible que seas noqueado, sin importar el daño o las estrellas del rival.',
      goldTitle: 'Dorado (Ataque Veloz con Prioridad)',
      goldDesc: 'Destruye Jutsus Morados sin importar sus estrellas. Contra ataques Blancos o Dorados, gana el de mayor valor numérico de daño (DMG).',
      purpleTitle: 'Morado (Técnicas Ninjutsu / Genjutsu Estelar ★)',
      purpleDesc: 'Vence a cualquier Ataque Blanco sin importar su daño. Entre técnicas moradas, gana quien tenga más estrellas (★★★ vence a ★★). Aplican efectos alterados.',
      whiteTitle: 'Blanco (Ataque Físico Directo)',
      whiteDesc: 'Choque numérico. El mayor valor de daño (DMG) vence y noquea al rival. Si ambos empatan numéricamente, nadie cae.',
      redTitle: 'Rojo (Fallo Absoluto / Miss)',
      redDesc: 'Pierde contra cualquier otro color (Blanco, Dorado, Morado, Azul). Si ambos participantes obtienen Rojo, ninguno es derrotado.',
      sRankTitle: 'Regla de Supervivencia de Rango S (Doctrina Mew)',
      sRankDesc: 'Ciertas técnicas legendarias incorporan la regla de supervivencia ante golpes masivos: si el oponente ataca con un movimiento físico o dorado de 100 DMG o superior, la figura activa evasión táctica y no es noqueada.',
    },
    surround: {
      badge: 'MECÁNICA CLAVE DE CONTROL TERRITORIAL',
      title: 'Rodeo Fuinjutsu (Surround K.O.) y Prisión FIFO',
      surroundTitle: 'Rodeo Fuinjutsu: K.O. sin Combatir',
      surroundDesc: 'Si todos los nodos adyacentes conectados a una figura rival quedan ocupados por figuras de tu equipo (o por los bordes y esquinas cerradas por tus aliados), la figura enemiga es sellada inmediatamente y enviada a la prisión sin girar ruleta.',
      surroundTip: '💡 Consejo táctico: El rodeo es la mejor estrategia para derribar figuras pesadas con ataques devastadores sin arriesgarte al combate directo.',
      immunityTitle: 'Inmunidad Pasiva',
      immunityDesc: 'Ciertas figuras con barreras automáticas poseen la habilidad pasiva de ser inmunes al Rodeo Fuinjutsu (ej: Escudo de Arena).',
      prisonTitle: 'Prisión Fuinjutsu FIFO (Capacidad 2)',
      prisonDesc1: 'Cada jugador cuenta con una Prisión Fuinjutsu con capacidad máxima para 2 figuras.',
      prisonDesc2: 'Cuando una tercera figura es noqueada y entra a la prisión, la más antigua que estaba dentro es liberada automáticamente al banquillo del jugador (First In, First Out).',
      waitNoteTitle: 'Condición de Reincorporación',
      waitNoteDesc: 'Toda figura liberada de la prisión regresa al banquillo con un sello de Espera 2 (Wait 2) antes de poder volver a actuar.',
    },
    status: {
      badge: 'CONDICIONES DE ESTADO Y CURACIÓN',
      title: 'Estados Alterados, Mutaciones de Ruleta y Toque de Asistencia',
      intro: 'Diversos jutsus morados o efectos tácticos pueden infligir estados alterados permanentes sobre las figuras, mutando los sectores de su ruleta:',
      burnTitle: 'Quemadura (Burn)',
      burnDesc: 'Penaliza con -10 DMG todos los ataques blancos y dorados de la figura. Además, el sector no-rojo de menor tamaño de su ruleta muta permanentemente a Fallo Rojo.',
      paraTitle: 'Parálisis (Paralysis)',
      paraDesc: 'El sector no-rojo de menor tamaño de su ruleta muta a Fallo Rojo, reduciendo drásticamente las probabilidades de acertar movimientos clave (sin penalización de daño numérico).',
      confTitle: 'Confusión (Confusion)',
      confDesc: 'Trastorna la precisión: el resultado de cualquier giro de ruleta se desplaza +1 sector en el sentido de las agujas del reloj respecto al sector donde aterrizó la aguja.',
      freezeTitle: 'Congelamiento / Petrificación (Frozen / Sealed)',
      freezeDesc: 'La figura queda inmovilizada: no puede moverse ni iniciar duelos, y toda su ruleta se convierte en 100% Fallo Rojo si es atacada por el rival.',
      assistTitle: 'Mecánica de Asistencia Aliada (Toque Descongelante)',
      assistDesc: 'A diferencia de otros estados, el Congelamiento / Petrificación se cura directamente en el tablero: basta con que una figura aliada se desplace hasta una casilla adyacente para romper el sello de inmediato.',
    },
    forge: {
      badge: 'PROGRESIÓN Y OPTIMIZACIÓN DE FIGURAS',
      title: 'Forja Shinobi: Subida de Nivel (Lv 1-5) y Nivel de Chakra (ChLv 0-10)',
      intro: 'En el Libro Bingo / Catálogo puedes personalizar y optimizar a tus figuras antes de entrar en combate, respetando la estricta matemática canónica de Pokémon Duel:',
      levelTitle: 'Subida de Nivel (Lv. 1 al 5)',
      levelBadge: 'Máx Nv. 5',
      levelDesc: 'Cada nivel ganado permite transferir +1 segmento de tamaño desde el Fallo Rojo hacia el movimiento que elijas (Blanco, Dorado, Morado o Azul).',
      levelInvariant: 'Invariante: La suma total de segmentos siempre es 96. El Fallo Rojo no puede reducirse a menos de 4 segmentos (4/96).',
      clvTitle: 'Nivel de Chakra (ChLv 0 al 10)',
      clvBadge: 'Máx ChLv 10',
      clvDesc: 'Concentrar chakra adicional en tus técnicas otorga +1 DMG permanente por nivel a un ataque físico o dorado específico.',
      clvPurpose: 'Propósito: Desempatar choques directos entre técnicas con el mismo daño base (ej: 101 DMG vence a 100 DMG gracias a la mayor densidad de chakra).',
    },
    plates: {
      badge: 'GESTIÓN DE PERGAMINOS TÁCTICOS (PLATES)',
      title: 'Plates y Límite Oficial de 6 Puntos de Coste',
      intro: 'Los pergaminos tácticos otorgan ventajas de un solo uso por partida. Tu mazo de pergaminos tiene una capacidad máxima estricta de 6 puntos de energía:',
      costBadge: 'Coste',
      goalBlockTitle: '守 Goal Block (Defensa de Emergencia)',
      goalBlockDesc: 'Teletransporta a una figura aliada desde cualquier casilla del campo directamente a tu Base vacía y finaliza el turno.',
      maxReviveTitle: '蘇 Max Revive (Invocación de Resurrección)',
      maxReviveDesc: 'Libera de inmediato a una figura de tu Prisión Fuinjutsu enviándola directamente a tu banquillo sin penalización de Espera.',
      doubleChanceTitle: '眼 Double Chance (Ojo de la Presciencia)',
      doubleChanceDesc: 'Permite re-girar tu disco de chakra durante el combate si el resultado obtenido en el primer intento no es favorable.',
      xAttackTitle: '力 X Attack (Píldora de Chakra)',
      xAttackDesc: 'Añade +30 DMG a todos los ataques físicos y dorados de la figura durante este turno.',
    },
  },

  en: {
    headerTitle: 'CANONICAL TACTICAL MANUAL — SHINOBI DUEL',
    headerSubtitle: 'Official rulebook: movement rules, collisions, 96-segment wheel, and combat hierarchy',
    nav: {
      objective: '1. Objective & Win',
      movement: '2. Movement & MP',
      turnflow: '3. Turn Flow',
      combat: '4. Combat & Wheel',
      surround: '5. Surround & Prison',
      status: '6. Status Conditions',
      forge: '7. Forge (Lv & ChLv)',
      plates: '8. Tactical Plates',
    },
    objective: {
      badge: 'CORE STRATEGIC FOUNDATION',
      title: 'Victory Objective: Occupy the Rival Base',
      goldenRuleBadge: 'GOLDEN RULE',
      goldenRuleTitle: 'Victory is achieved by capturing the rival Goal, NOT by eliminating all enemy figures',
      goldenRuleDesc: 'Just like iconic tactical board games such as Pokémon Duel, the match ends immediately the moment any of your figures steps onto the rival Base node:',
      p1Title: 'Player 1 Objective',
      p1Desc: 'Deploys in the bottom sector and must advance across the board to occupy the Rival Base (Node #2) located at the top center.',
      p2Title: 'Player 2 / Opponent Objective',
      p2Desc: 'Deploys in the top sector and must advance across the board to occupy the Rival Base (Node #15) located at the bottom center.',
      secondaryWinTitle: 'Secondary Victory: Total Siege & Capitulation',
      secondaryWinDesc: 'If a player has no legal moves left because all their figures are locked in the Fuinjutsu Prison or blocked from moving, they lose by total siege.',
      defenseTitle: 'Defending Your Own Base',
      defenseDesc: 'Stationing a goalie figure on your own Base (#15 or #2) or guarding adjacent nodes prevents rival infiltration. If an opponent breaches your lines, tactical plates like Goal Block let you warp an ally to your Base instantly.',
    },
    movement: {
      badge: 'FUNDAMENTAL MOVEMENT MECHANICS',
      title: 'Movement, MP Allocation, Collisions, and Deployment',
      mp3Title: 'AGILE RUNNERS (3 MP)',
      mp3Desc: 'Move up to 3 nodes per turn. Designed for rapid flank advances, early board control, and pressing rival spawn points.',
      mp2Title: 'BALANCED FIGHTERS (2 MP)',
      mp2Desc: 'The combat backbone. Move 2 nodes per turn, packing formidable wheel firepower and solid board positioning.',
      mp1Title: 'DEFENSIVE TANKS (1 MP)',
      mp1Desc: 'Moves 1 node per turn, compensated by heavy-hitting slices, territorial denial passives, or surround KO immunity.',
      rulesTitle: 'Official Board & Movement Rules',
      deployTitle: '1. Bench Deployment',
      deployDesc: 'All 6 figures start on the bench. Entering the 28-node board costs 1 MP onto one of your 2 designated entry points. Any remaining MP can be used to advance further in the same turn.',
      collisionTitle: '2. Collision & Path Blocking',
      collisionDesc: 'By canonical rule, figures cannot jump over allies or enemies. An occupied node terminates the advance path unless a figure has an explicit Pass-Through passive.',
      turn1Title: '3. Turn 1 Opening Handicap',
      turn1Desc: 'To balance first-player initiative, Player 1 receives a -1 MP penalty on their very first move (e.g., a 3 MP runner moves only 2 nodes on Turn 1).',
      spawnLockTitle: '4. Spawn Locking (Entry Blockade)',
      spawnLockDesc: 'If an enemy figure camps on your entry node, it cannot be used for deployment. If both of your entry points are occupied by rivals, bench deployment is completely locked until you clear them.',
    },
    turnflow: {
      badge: 'STEP-BY-STEP SEQUENCE',
      title: 'Anatomy of a Turn: Action Flow',
      step1Title: 'Turn Start & Wait Count Decrement',
      step1Desc: 'At the start of your turn, all Wait counters on your figures tick down by 1. Figures with Wait > 0 cannot move or declare attacks.',
      step2Title: 'Tactical Plate Activation (Optional)',
      step2Desc: 'Before moving a figure, you may activate 1 tactical plate from your action bar (e.g., X Attack, Double Chance, Goal Block, or Max Revive).',
      step3Title: 'Figure Selection & Tactical Movement',
      step3Desc: 'Select an eligible figure from your bench or field. The game highlights all reachable nodes in gold. Click on a destination node to move.',
      step4Title: 'Assistant Tag & Surround Check',
      step4Desc: 'Landing adjacent to a frozen ally executes an Assistant Tag to cure them immediately. The system then evaluates if any figure on the board is surrounded.',
      step5Title: 'Post-Move Combat (Optional)',
      step5Desc: 'If adjacent to an enemy after moving, click ⚔️ ATTACK to initiate a wheel clash, or click "End Turn" to hold your defensive ground.',
    },
    combat: {
      badge: 'DISCRETE COMBAT ENGINE',
      title: 'Chakra Disk Clash: 96-Segment Wheel & Color Hierarchy',
      intro: 'In Shinobi Duel, combat is resolved using physical 96-segment wheels. When two figures clash, both wheels spin simultaneously:',
      blueTitle: 'Blue (Dodge / Kawarimi)',
      blueDesc: 'Invalidates any incoming move. When landing on Blue, a figure cannot be knocked out regardless of opponent damage or jutsu stars.',
      goldTitle: 'Gold (Priority Fast Attack)',
      goldDesc: 'Destroys Purple Jutsus outright regardless of stars. Against White or Gold attacks, the higher damage value wins.',
      purpleTitle: 'Purple (Ninjutsu / Genjutsu ★)',
      purpleDesc: 'Defeats all White physical attacks regardless of DMG. In purple vs purple ties, the move with more stars wins (★★★ beats ★★) and inflicts status effects.',
      whiteTitle: 'White (Physical Attack)',
      whiteDesc: 'Numerical damage clash. The higher DMG value knocks out the opponent. Equal damage results in a draw with no knockout.',
      redTitle: 'Red (Miss / Vulnerability)',
      redDesc: 'Loses to any successful opponent color (White, Gold, Purple, Blue). Both landing on Red results in a neutral standoff.',
      sRankTitle: 'S-Rank Survival Rule (Mew Doctrine)',
      sRankDesc: 'Select legendary techniques carry survival mechanics: if an opponent hits with 100 DMG or higher, the figure evades the lethal blow and survives.',
    },
    surround: {
      badge: 'TERRITORIAL SURROUND MECHANIC',
      title: 'Fuinjutsu Surround (K.O.) & FIFO Prison Buffer',
      surroundTitle: 'Surround K.O.: Defeat Without Combat',
      surroundDesc: 'If all adjacent connected nodes surrounding a figure become occupied by opposing figures (or blocked corners/edges), the trapped figure is instantly sealed into the prison without spinning.',
      surroundTip: '💡 Tactical Tip: Surround K.O. is the ultimate strategy to eliminate high-damage enemy threats without risking unfavorable combat RNG.',
      immunityTitle: 'Passive Surround Immunity',
      immunityDesc: 'Figures with protective barriers (such as Gaara with Sand Shield) possess passive immunity to Surround K.O.',
      prisonTitle: 'Fuinjutsu Prison Buffer (Capacity 2 FIFO)',
      prisonDesc1: 'Each player has a Fuinjutsu Prison holding a maximum of 2 knocked-out figures.',
      prisonDesc2: 'When a third figure is sent to the prison, the oldest figure inside is automatically released back to the bench (First In, First Out).',
      waitNoteTitle: 'Bench Re-entry Wait',
      waitNoteDesc: 'Figures released from the prison return to the bench with Wait 2 before they can re-enter the battlefield.',
    },
    status: {
      badge: 'CONDITIONS & RECOVERY',
      title: 'Status Effects, Wheel Mutations & Assistant Tag',
      intro: 'Purple jutsus and tactical plates inflict persistent status conditions that mutate figure wheel slices:',
      burnTitle: 'Burn',
      burnDesc: '-10 DMG penalty to all physical and gold moves. In addition, the smallest non-red wheel slice permanently mutates into a Red Miss.',
      paraTitle: 'Paralysis',
      paraDesc: 'The smallest non-red slice mutates into a Red Miss, significantly reducing key move probabilities without damage penalties.',
      confTitle: 'Confusion',
      confDesc: 'Distorts wheel alignment: spin resolution shifts +1 slice clockwise from the needle indicator position.',
      freezeTitle: 'Frozen / Sealed',
      freezeDesc: 'The figure is completely immobilized (cannot move or initiate combat) and its entire wheel becomes 100% Red Miss when attacked.',
      assistTitle: 'Assistant Tag Recovery',
      assistDesc: 'Frozen figures can be cured on the board: moving any allied figure to an adjacent node executes an Assistant Tag, curing the seal immediately.',
    },
    forge: {
      badge: 'FIGURE OPTIMIZATION',
      title: 'Shinobi Forge: Leveling (Lv 1-5) and Chakra Level (ChLv 0-10)',
      intro: 'In the Bingo Book / Codex you can optimize your figures following the strict mathematical invariants inspired by Pokémon Duel:',
      levelTitle: 'Leveling Up (Lv. 1 to 5)',
      levelBadge: 'Max Lv. 5',
      levelDesc: 'Each level up transfers +1 slice size from Red Miss into a move of your choice (White, Gold, Purple, or Blue).',
      levelInvariant: 'Invariant: Wheel slice total is always 96. Red Miss cannot be reduced below 4 segments (4/96).',
      clvTitle: 'Chakra Level (ChLv 0 to 10)',
      clvBadge: 'Max ChLv 10',
      clvDesc: 'Infusing extra chakra into your techniques grants +1 permanent DMG per level to a selected physical or gold attack.',
      clvPurpose: 'Purpose: Breaks tie clashes between moves with identical base damage (e.g., 101 DMG beats 100 DMG thanks to chakra density).',
    },
    plates: {
      badge: 'TACTICAL PLATES MANAGEMENT',
      title: 'Plates & Official 6-Energy Capacity Limit',
      intro: 'Tactical plates provide one-time match advantages. Your plate deck has a strict maximum energy limit of 6 points:',
      costBadge: 'Cost',
      goalBlockTitle: '守 Goal Block (Emergency Base Defense)',
      goalBlockDesc: 'Warps an allied figure from any board node directly to your vacant Base, ending your turn.',
      maxReviveTitle: '蘇 Max Revive (Resurrection Plate)',
      maxReviveDesc: 'Immediately frees an allied figure from the Fuinjutsu Prison directly to your bench with no Wait penalty.',
      doubleChanceTitle: '眼 Double Chance (Precognition Eye)',
      doubleChanceDesc: 'Allows re-spinning your chakra wheel in combat if the initial spin outcome is unfavorable.',
      xAttackTitle: '力 X Attack (Combat Chakra Pill)',
      xAttackDesc: 'Grants +30 DMG to all physical and gold moves for the active figure during this turn.',
    },
  },

  ja: {
    headerTitle: '中忍試験・公式戦術指南書 — SHINOBI DUEL',
    headerSubtitle: '盤上移動則、96分割チャクラ円盤、相性階層、包囲封印の公式手引',
    nav: {
      objective: '1. 勝利目標',
      movement: '2. 移動とMP',
      turnflow: '3. 手番の流れ',
      combat: '4. 戦闘と円盤',
      surround: '5. 包囲封印',
      status: '6. 状態異常',
      forge: '7. 忍鍛冶 (Lv/ChLv)',
      plates: '8. 忍術巻物',
    },
    objective: {
      badge: '最重要勝利原則',
      title: '勝利の目標: 敵本陣の完全制圧',
      goldenRuleBadge: '鉄則',
      goldenRuleTitle: '勝利は敵本陣の制圧で決まる。全滅させる必要はない。',
      goldenRuleDesc: 'ポケモンコマスター流の盤上タクティクスと同様、自軍のいずれか1駒が敵陣本陣ノードを踏んだ瞬間に即座に勝利が確定します:',
      p1Title: 'プレイヤー1 (自軍) の制圧目標',
      p1Desc: '下部侵入点から出撃し、盤上を突破して上端の敵本陣 (ノード #2) を占領することが目標です。',
      p2Title: 'プレイヤー2 / 相手側の制圧目標',
      p2Desc: '上部侵入点から出撃し、下端の本陣 (ノード #15) を占領することが目標です。',
      secondaryWinTitle: '副次勝利: 完全包囲と行動不能',
      secondaryWinDesc: '相手のすべての駒が封印牢に収容されるか、盤上で合法な移動手段を失った場合、完全包囲による勝利となります。',
      defenseTitle: '自軍本陣の防衛',
      defenseDesc: '自陣本陣 (#15 または #2) や隣接ノードに守護役の忍を配置することで敵の突入を防ぎます。ピンチの際は「ゴールブロック」巻物で瞬時に味方を本陣へ口寄せ可能です。',
    },
    movement: {
      badge: '基本移動力学',
      title: '移動MP、衝突判定、出撃と侵入点',
      mp3Title: '疾風・俊敏型 (3 MP)',
      mp3Desc: '1手番で最大3ノード移動可能。電光石火の突破、敵侵入点の制圧、包囲網構築に適しています。',
      mp2Title: '均衡・主軸型 (2 MP)',
      mp2Desc: '戦局の中核を担う標準型。2ノード移動と強力な戦闘ルーレットを両立した主戦力。',
      mp1Title: '防衛・重装型 (1 MP)',
      mp1Desc: '移動は1ノードですが、高威力技や包囲無効などの強固な防御特性で拠点を死守します。',
      rulesTitle: '盤上移動と障害規則',
      deployTitle: '1. 控室(ベンチ)からの出撃',
      deployDesc: '出撃時はMPを1消費して自軍の侵入点ノードへ踏み込みます。残りのMPがあれば同ターン内にそのまま盤上を前進可能です。',
      collisionTitle: '2. 衝突判定と通過不可',
      collisionDesc: '駒は味方・敵を問わず飛び越えて移動することはできません。占有されたノードで進路は遮断されます(すり抜け特性を除く)。',
      turn1Title: '3. 先手初手ハンデ (-1 MP)',
      turn1Desc: '先手有利を是正するため、初手第1ターンの移動力は一律で「-1 MP」減少します。',
      spawnLockTitle: '4. 侵入点封鎖 (スポーンロック)',
      spawnLockDesc: '敵駒が自軍の侵入点に居座ると出撃不能になります。2箇所の侵入点を同時に封鎖されると、敵駒を排除するまで出撃不能となります。',
    },
    turnflow: {
      badge: '行動の手順',
      title: '手番の解剖学: アクションサイクル',
      step1Title: '手番開始 & 待機カウント減少',
      step1Desc: '手番開始時、すべての駒の待機値が1減少します。待機が1以上の駒はそのターン移動や交戦を行えません。',
      step2Title: '忍術巻物(プレート)の使用 (任意)',
      step2Desc: '駒を動かす前に、手持ちの巻物(Xアタック、ダブルチャンス、ゴールブロック等)を1回使用できます。',
      step3Title: '駒の選択と戦術移動',
      step3Desc: '動かす駒を選択します。盤上に移動可能なノードが金色で表示されます。目標ノードをタップして進軍します。',
      step4Title: 'アシスト救護 & 包囲判定',
      step4Desc: '凍結した味方に隣接すると即座に解凍。さらに盤上で完全包囲された駒がないかシステムが判定し、該当駒を封印牢へ送ります。',
      step5Title: '移動後交戦 (任意)',
      step5Desc: '移動後に敵駒と隣接している場合、「⚔️ 交戦」で戦闘を行うか、「手番終了」でその場に留まるかを選択できます。',
    },
    combat: {
      badge: '離散戦闘エンジン',
      title: 'チャクラ円盤の激突: 96分割ルーレットと色の階層律',
      intro: '本作の確率は96分割された円盤の面積で決定されます。交戦時、双方のルーレットが激突回転します:',
      blueTitle: '青 (身代わり・回避)',
      blueDesc: '相手のあらゆる攻撃を無効化。相手の威力や星の数に関わらず絶対に倒されません。',
      goldTitle: '金 (神速先制攻撃)',
      goldDesc: '紫忍術を星の数に関係なく無条件で撃破。白技や金技同士では数値の高い方が勝利します。',
      purpleTitle: '紫 (奥義忍術 ★)',
      purpleDesc: '白技に数値無関係で勝利。紫同士では星の数が多い方が勝利(★★★が★★に勝利)し、状態異常を付与します。',
      whiteTitle: '白 (白兵戦・体術)',
      whiteDesc: '数値比べ。威力の高い方が勝利し相手を撃破。同値の場合は相討ちとなり双方無事です。',
      redTitle: '赤 (ミス・隙)',
      redDesc: '相手の成功攻撃(白・金・紫・青)すべてに敗北。双方が赤ミスの場合はノーダメージです。',
      sRankTitle: 'Sランク回避律 (ミュウの法)',
      sRankDesc: '一部の伝説技は高威力攻撃に対する生存特性を備えており、相手が100以上の白・金技を出した場合でも撃破を回避します。',
    },
    surround: {
      badge: '領域支配の鉄則',
      title: '包囲封印術 (Surround K.O.) & FIFO封印牢',
      surroundTitle: '包囲封印: 戦わずして勝つ術',
      surroundDesc: '敵駒に接続されたすべての隣接ノードを自軍の駒(または盤上の角・端)で完全に塞ぐと、ルーレットを回すことなく相手を即座に封印牢へ送還します。',
      surroundTip: '💡 戦術助言: 包囲は圧倒的な戦闘力を持つ敵エースを無傷で無力化する最強の手筋です。',
      immunityTitle: '包囲無効特性',
      immunityDesc: '我愛羅の「砂の盾」など、一部の忍は包囲封印を無力化するパッシブ特性を持ちます。',
      prisonTitle: 'FIFO封印牢 (定員2体)',
      prisonDesc1: '各プレイヤーは最大2体を収容する封印牢を持ちます。',
      prisonDesc2: '3体目の駒が撃破された場合、最も古く収容されていた駒が自動的に控室へ押し出されて復帰します (先入れ先出し)。',
      waitNoteTitle: '復帰時の待機',
      waitNoteDesc: '封印牢から復帰した駒は、出撃まで「待機2」が付与されます。',
    },
    status: {
      badge: '状態と救護',
      title: '状態異常、円盤変異、アシストタッチ',
      intro: '紫忍術により、駒のルーレットセグメントが永久的に変異します:',
      burnTitle: '火傷 (Burn)',
      burnDesc: '白・金技の威力が-10低下し、最小の非赤セグメントが赤ミスに変異します。',
      paraTitle: '麻痺 (Paralysis)',
      paraDesc: '最小の非赤セグメントが赤ミスに変異し、主力技の的中率が激減します(威力低下なし)。',
      confTitle: '混乱 (Confusion)',
      confDesc: '針の判定が時計回りに+1セグメントずれて停止します。',
      freezeTitle: '封縛・砂封印 (Frozen / Sealed)',
      freezeDesc: '完全に行動不能となり、攻撃を受けた際は円盤が100%赤ミスとなります。',
      assistTitle: 'アシスト救護 (解凍)',
      assistDesc: '味方の駒を凍結した駒の隣接ノードへ進軍させることで、即座に封印を解除できます。',
    },
    forge: {
      badge: '忍の最適化',
      title: '忍鍛冶: レベル強化 (Lv 1-5) と チャクラレベル ChLv (0-10)',
      intro: 'ビンゴブックでは、コマスターの厳格な数学的不変量に基づいて駒を鍛造できます:',
      levelTitle: 'レベル強化 (Lv. 1〜5)',
      levelBadge: '最大 Lv.5',
      levelDesc: 'レベルが上がるごとに、赤ミスの幅を-1縮小し、好みの技(白・金・紫・青)の幅を+1拡大できます。',
      levelInvariant: '不変量: 円盤の総セグメント数は常に96。赤ミスは4/96未満には縮小できません。',
      clvTitle: 'チャクラレベル (ChLv 0〜10)',
      clvBadge: '最大 ChLv 10',
      clvDesc: '白技または金技にチャクラを注ぎ込み、威力を1ポイントごとに+1 DMG永続加算します。',
      clvPurpose: '目的: 同値同士の相討ちを打ち破り、チャクラ密度の差で競り勝つための鍛冶です。',
    },
    plates: {
      badge: '忍術巻物の運用',
      title: '巻物デッキと公式6コスト制限',
      intro: '巻物は対局中に1回のみ使用できる戦術支援です。デッキの総コストは厳格に6以下です:',
      costBadge: 'コスト',
      goalBlockTitle: '守 ゴールブロック (本陣緊急帰還)',
      goalBlockDesc: '盤上の味方1体を自軍の空き本陣へ即座に口寄せ転移し、手番を終了します。',
      maxReviveTitle: '蘇 マックスリバイブ (穢土転生復帰)',
      maxReviveDesc: '封印牢の味方1体を待機ペナルティなしで直接控室へ復活させます。',
      doubleChanceTitle: '眼 ダブルチャンス (先見の写輪眼)',
      doubleChanceDesc: '交戦時、最初のルーレット結果が不服な場合にもう一度再回転できます。',
      xAttackTitle: '力 Xアタック (チャクラ丸薬)',
      xAttackDesc: 'このターン、選択した忍のすべての白・金技の威力を+30上昇させます。',
    },
  },
};
