export type SupportedLanguage = 'es' | 'en' | 'ja';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'es', label: 'Español', nativeLabel: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', flag: '🇯🇵' },
];

export interface TranslationDictionary {
  common: {
    backToMenu: string;
    playNow: string;
    playVsAi: string;
    playLocal2P: string;
    rulesGuide: string;
    characterCodex: string;
    confirm: string;
    cancel: string;
    restart: string;
    close: string;
    turn: string;
    level: string;
    clv: string;
    mp: string;
    dmg: string;
    wait: string;
    ally: string;
    opponent: string;
    player1: string;
    player2: string;
    ai: string;
    passTurn: string;
  };
  menu: {
    title: string;
    subtitle: string;
    badge: string;
    description: string;
    quickDuelTitle: string;
    quickDuelDesc: string;
    local2pTitle: string;
    local2pDesc: string;
    guideTitle: string;
    guideDesc: string;
    codexTitle: string;
    codexDesc: string;
    footerConcept: string;
    footerAudio: string;
  };
  header: {
    turnCount: string;
    playerTurn: string;
    activeBuffs: string;
    soundOn: string;
    soundOff: string;
    subtitle: string;
  };
  board: {
    arenaTitle: string;
    baseOwn: string;
    baseRival: string;
    baseKonoha: string;
    baseAkatsuki: string;
    entryP1: string;
    entryP2: string;
    bench: string;
    prison: string;
    prisonMax: string;
    deployFromCorners: string;
    duelAction: string;
    postMovePrompt: string;
    endTurnPrompt: string;
    allyBench: string;
    rivalBench: string;
    p1Faction: string;
    p2FactionAi: string;
    p2FactionLocal: string;
    deployBottomDesc: string;
    reinforcementsDesc: string;
  };
  combat: {
    duelTitle: string;
    duelSubtitle: string;
    attacker: string;
    defender: string;
    spinning: string;
    dodge: string;
    miss: string;
    fastAttack: string;
    jutsu: string;
    physical: string;
    respinButton: string;
    confirmResolution: string;
    outcomeTitle: string;
    arenaDuelBadge: string;
    whiteLabel: string;
    goldLabel: string;
    purpleLabel: string;
    blueLabel: string;
    redLabel: string;
  };
  buffs: {
    powerBonus: string;
    mpBonus: string;
    doubleChanceActive: string;
    desperateBoostActive: string;
  };
  status: {
    burned: string;
    burnedDesc: string;
    paralyzed: string;
    paralyzedDesc: string;
    confused: string;
    confusedDesc: string;
    frozen: string;
    frozenDesc: string;
    waitDesc: string;
  };
  scrolls: {
    title: string;
    goalBlock: string;
    goalBlockDesc: string;
    maxRevive: string;
    maxReviveDesc: string;
    doubleChance: string;
    doubleChanceDesc: string;
    xAttack: string;
    xAttackDesc: string;
    hurdleJump: string;
    hurdleJumpDesc: string;
    cost: string;
    used: string;
    goalBlockPrompt: string;
    healPrompt: string;
    revivePrompt: string;
    swapPrompt1: string;
    swapPrompt2: string;
  };
  codex: {
    title: string;
    tabCatalog: string;
    tabDeck: string;
    officialFigures: string;
    inDeck: string;
    movementPoints: string;
    figureLevel: string;
    segmentsGain: string;
    chainLevel: string;
    extraDamage: string;
    wheelDistribution: string;
    totalLabel: string;
    doctrine: string;
    deckConfigBadge: string;
    deckConfigTitle: string;
    squadTitle: string;
    squadDesc: string;
    platesTitle: string;
    platesDesc: string;
    costLabel: string;
    supremeTechnique: string;
    shinobiDoctrine: string;
    forgeLevel: string;
    deckCapacity: string;
    currentPlatesCost: string;
    plateSlots: string;
    addPlate: string;
    removePlate: string;
  };
  inspector: {
    title: string;
    subtitle: string;
    fsmTitle: string;
    diskLevel: string;
    forgeLevelBtn: string;
    supremeTechnique: string;
    burnedTag: string;
    paralyzedTag: string;
    confusedTag: string;
    frozenTag: string;
    wheelSectors: string;
    powerSize: string;
    dodge: string;
    miss: string;
    awakeningUx: string;
    whiteAbbr: string;
    goldAbbr: string;
    purpleAbbr: string;
    blueAbbr: string;
    redAbbr: string;
  };
  chronicle: {
    title: string;
    events: string;
  };
  guide: {
    manualTitle: string;
    manualSubtitle: string;
    tabObjective: string;
    tabMovement: string;
    tabTurnFlow: string;
    tabCombat: string;
    tabSurround: string;
    tabStatus: string;
    tabForge: string;
    tabPlates: string;
  };
  hierarchy: {
    title: string;
    statusTitle: string;
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
    burnSummary: string;
    burnDetail: string;
    paraSummary: string;
    paraDetail: string;
    confSummary: string;
    confDetail: string;
    freezeSummary: string;
    freezeDetail: string;
    waitTitle: string;
    waitDetail: string;
    assistTitle: string;
    assistDetail: string;
  };
  victory: {
    victoryTitle: string;
    defeatTitle: string;
    p1Won: string;
    p2Won: string;
    playAgain: string;
    mainMenu: string;
    baseConquest: string;
    surroundKo: string;
    totalSiege: string;
  };
}
