import React, { useState } from 'react';
import {
  BookOpen,
  Shield,
  Sword,
  Play,
  CheckCircle2,
  Footprints,
  Flame,
  Sparkles,
  ArrowRight,
  Info,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { GUIDE_TRANSLATIONS, GuideSectionKey } from '../../../infrastructure/i18n/locales/guideI18n';

interface ShinobiRulesGuideProps {
  onBackToMenu: () => void;
  onPlayGame: () => void;
}

export const ShinobiRulesGuide: React.FC<ShinobiRulesGuideProps> = ({
  onBackToMenu,
  onPlayGame,
}) => {
  const { language, t } = useTranslation();
  const [activeSection, setActiveSection] = useState<GuideSectionKey>('objective');

  const g = GUIDE_TRANSLATIONS[language] || GUIDE_TRANSLATIONS.es;

  const navItems: Array<{ id: GuideSectionKey; label: string; icon: React.ReactNode }> = [
    { id: 'objective', label: g.nav.objective, icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'movement', label: g.nav.movement, icon: <Footprints className="w-3.5 h-3.5" /> },
    { id: 'turnflow', label: g.nav.turnflow, icon: <ArrowRight className="w-3.5 h-3.5" /> },
    { id: 'combat', label: g.nav.combat, icon: <Sword className="w-3.5 h-3.5" /> },
    { id: 'surround', label: g.nav.surround, icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'status', label: g.nav.status, icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'forge', label: g.nav.forge, icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'plates', label: g.nav.plates, icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#140e0a] text-stone-100 flex flex-col p-3 md:p-6">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-3 border-b border-stone-800 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToMenu}
            className="px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold border border-stone-700 transition flex items-center gap-1.5"
          >
            {t('common.backToMenu')}
          </button>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-sm bg-red-900 border border-amber-500/60 flex items-center justify-center text-amber-300 font-kanji font-black text-sm shadow">
              巻
            </span>
            <div>
              <h1 className="text-sm md:text-base font-black text-amber-400 uppercase tracking-wide">
                {g.headerTitle}
              </h1>
              <p className="text-[10px] text-stone-400">
                {g.headerSubtitle}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <button
            onClick={onPlayGame}
            className="px-4 py-1.5 rounded bg-red-800 hover:bg-red-700 text-amber-100 text-xs font-black uppercase tracking-wider border border-amber-500 shadow transition flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> {t('common.playNow')}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto my-4 flex-1 flex flex-col">
        {/* Navigation Tabs (8 sections) */}
        <nav className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5 mb-3 bg-stone-900/90 p-2 rounded-lg border border-stone-800" aria-label="Secciones del manual">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`px-2 py-2 rounded text-[11px] font-bold transition flex items-center justify-center gap-1 text-center truncate ${
                activeSection === item.id
                  ? 'bg-amber-600 text-stone-950 shadow-md font-black scale-102'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Content Box with Washi Parchment styling */}
        <div className="shadow-2xl flex-1 flex flex-col">
          <div className="h-2.5 bg-gradient-to-r from-amber-700 via-[#281b12] to-amber-700 rounded-t border-b-2 border-stone-950" />
          <div className="bg-[#f4ebd9] text-stone-900 p-5 md:p-8 border-x-4 border-[#281b12] flex-1 overflow-y-auto">

            {/* SECCIÓN 1: OBJETIVO Y CONDICIONES DE VICTORIA */}
            {activeSection === 'objective' && (
              <div className="space-y-4">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    {g.objective.badge}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    {g.objective.title}
                  </h2>
                </div>

                <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border border-amber-600/70 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-stone-950 text-xs font-black">
                      {g.objective.goldenRuleBadge}
                    </span>
                    <h3 className="font-black text-amber-300 text-sm">
                      {g.objective.goldenRuleTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {g.objective.goldenRuleDesc}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded bg-sky-950/80 border border-sky-600 text-sky-100">
                      <div className="font-black text-sky-300 text-xs flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-sky-500 text-stone-950 flex items-center justify-center text-[10px] font-black">P1</span>
                        {g.objective.p1Title}
                      </div>
                      <p className="text-[11px] mt-1 text-stone-300">
                        {g.objective.p1Desc}
                      </p>
                    </div>
                    <div className="p-3 rounded bg-red-950/80 border border-red-600 text-red-100">
                      <div className="font-black text-red-300 text-xs flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-black">P2</span>
                        {g.objective.p2Title}
                      </div>
                      <p className="text-[11px] mt-1 text-stone-300">
                        {g.objective.p2Desc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-lg bg-stone-900 text-stone-100 border border-stone-700">
                    <h4 className="font-black text-xs text-amber-400 mb-1 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> {g.objective.secondaryWinTitle}
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {g.objective.secondaryWinDesc}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-stone-900 text-stone-100 border border-stone-700">
                    <h4 className="font-black text-xs text-red-400 mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> {g.objective.defenseTitle}
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {g.objective.defenseDesc}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 2: MOVIMIENTO, PUNTOS MP Y DESPLIEGUE */}
            {activeSection === 'movement' && (
              <div className="space-y-4">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    {g.movement.badge}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    {g.movement.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-lg bg-stone-900 text-stone-100 border border-amber-500/50">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-amber-400 text-xs">{g.movement.mp3Title}</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-stone-950 font-black text-xs">3 MP</span>
                    </div>
                    <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
                      {g.movement.mp3Desc}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-stone-900 text-stone-100 border border-stone-700">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-stone-200 text-xs">{g.movement.mp2Title}</span>
                      <span className="px-1.5 py-0.5 rounded bg-stone-700 text-stone-100 font-black text-xs">2 MP</span>
                    </div>
                    <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
                      {g.movement.mp2Desc}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-stone-900 text-stone-100 border border-stone-700">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-stone-200 text-xs">{g.movement.mp1Title}</span>
                      <span className="px-1.5 py-0.5 rounded bg-stone-800 text-amber-300 font-black text-xs">1 MP</span>
                    </div>
                    <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
                      {g.movement.mp1Desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 space-y-3">
                  <h3 className="font-black text-amber-400 text-sm flex items-center gap-1.5">
                    <Info className="w-4 h-4" /> {g.movement.rulesTitle}
                  </h3>
                  <ul className="text-xs text-stone-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-amber-600 text-stone-950 font-bold shrink-0">{g.movement.deployTitle}</span>
                      <span>{g.movement.deployDesc}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-amber-600 text-stone-950 font-bold shrink-0">{g.movement.collisionTitle}</span>
                      <span>{g.movement.collisionDesc}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-amber-600 text-stone-950 font-bold shrink-0">{g.movement.turn1Title}</span>
                      <span>{g.movement.turn1Desc}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-red-900 text-white font-bold shrink-0">{g.movement.spawnLockTitle}</span>
                      <span>{g.movement.spawnLockDesc}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* SECCIÓN 3: FLUJO DEL TURNO PASO A PASO */}
            {activeSection === 'turnflow' && (
              <div className="space-y-4">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    {g.turnflow.badge}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    {g.turnflow.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-stone-900 text-stone-100 border-l-4 border-amber-500 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shrink-0">1</span>
                    <div>
                      <h4 className="font-black text-amber-300 text-xs uppercase">{g.turnflow.step1Title}</h4>
                      <p className="text-xs text-stone-300 mt-0.5">{g.turnflow.step1Desc}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-stone-900 text-stone-100 border-l-4 border-amber-500 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shrink-0">2</span>
                    <div>
                      <h4 className="font-black text-amber-300 text-xs uppercase">{g.turnflow.step2Title}</h4>
                      <p className="text-xs text-stone-300 mt-0.5">{g.turnflow.step2Desc}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-stone-900 text-stone-100 border-l-4 border-amber-500 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shrink-0">3</span>
                    <div>
                      <h4 className="font-black text-amber-300 text-xs uppercase">{g.turnflow.step3Title}</h4>
                      <p className="text-xs text-stone-300 mt-0.5">{g.turnflow.step3Desc}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-stone-900 text-stone-100 border-l-4 border-amber-500 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shrink-0">4</span>
                    <div>
                      <h4 className="font-black text-amber-300 text-xs uppercase">{g.turnflow.step4Title}</h4>
                      <p className="text-xs text-stone-300 mt-0.5">{g.turnflow.step4Desc}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-stone-900 text-stone-100 border-l-4 border-amber-500 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shrink-0">5</span>
                    <div>
                      <h4 className="font-black text-amber-300 text-xs uppercase">{g.turnflow.step5Title}</h4>
                      <p className="text-xs text-stone-300 mt-0.5">{g.turnflow.step5Desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 4: COMBATE Y RULETA DE 96 SEGMENTOS */}
            {activeSection === 'combat' && (
              <div className="space-y-4">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    {g.combat.badge}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    {g.combat.title}
                  </h2>
                </div>

                <p className="text-xs md:text-sm text-stone-800 leading-relaxed">
                  {g.combat.intro}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded bg-sky-950/20 border-2 border-sky-800 text-stone-900 flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded bg-sky-600 border border-stone-900 shrink-0 text-white font-bold text-xs flex items-center justify-center shadow">
                      避
                    </span>
                    <div>
                      <h4 className="font-black text-xs text-sky-900 uppercase">{g.combat.blueTitle}</h4>
                      <p className="text-xs text-stone-800 mt-0.5">{g.combat.blueDesc}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded bg-amber-950/20 border-2 border-amber-800 text-stone-900 flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded bg-amber-500 border border-stone-900 shrink-0 text-stone-950 font-bold text-xs flex items-center justify-center shadow">
                      速
                    </span>
                    <div>
                      <h4 className="font-black text-xs text-amber-950 uppercase">{g.combat.goldTitle}</h4>
                      <p className="text-xs text-stone-800 mt-0.5">{g.combat.goldDesc}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded bg-purple-950/20 border-2 border-purple-800 text-stone-900 flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded bg-purple-700 border border-stone-900 shrink-0 text-white font-bold text-xs flex items-center justify-center shadow">
                      術
                    </span>
                    <div>
                      <h4 className="font-black text-xs text-purple-950 uppercase">{g.combat.purpleTitle}</h4>
                      <p className="text-xs text-stone-800 mt-0.5">{g.combat.purpleDesc}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded bg-stone-900/10 border-2 border-stone-800 text-stone-900 flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded bg-white border border-stone-900 shrink-0 text-stone-950 font-bold text-xs flex items-center justify-center shadow">
                      撃
                    </span>
                    <div>
                      <h4 className="font-black text-xs text-stone-900 uppercase">{g.combat.whiteTitle}</h4>
                      <p className="text-xs text-stone-800 mt-0.5">{g.combat.whiteDesc}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded bg-red-950/20 border-2 border-red-800 text-stone-900 flex items-start gap-2.5 md:col-span-2">
                    <span className="w-6 h-6 rounded bg-red-700 border border-stone-900 shrink-0 text-white font-bold text-xs flex items-center justify-center shadow">
                      失
                    </span>
                    <div>
                      <h4 className="font-black text-xs text-red-900 uppercase">{g.combat.redTitle}</h4>
                      <p className="text-xs text-stone-800 mt-0.5">{g.combat.redDesc}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded bg-stone-900 text-stone-100 border border-amber-500 text-xs space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> {g.combat.sRankTitle}
                  </div>
                  <p className="text-stone-300 leading-relaxed">
                    {g.combat.sRankDesc}
                  </p>
                </div>
              </div>
            )}

            {/* SECCIÓN 5: RODEO FUINJUTSU Y PRISIÓN FIFO */}
            {activeSection === 'surround' && (
              <div className="space-y-4">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    {g.surround.badge}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    {g.surround.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 space-y-2">
                    <h3 className="font-black text-red-400 text-sm flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-red-400" /> {g.surround.surroundTitle}
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {g.surround.surroundDesc}
                    </p>
                    <p className="text-[11px] text-amber-300">
                      {g.surround.surroundTip}
                    </p>
                    <div className="p-2 rounded bg-stone-950 text-[11px] text-stone-300 border border-stone-800">
                      <strong>{g.surround.immunityTitle}:</strong> {g.surround.immunityDesc}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 space-y-2">
                    <h3 className="font-black text-amber-400 text-sm flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-amber-400" /> {g.surround.prisonTitle}
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {g.surround.prisonDesc1}
                    </p>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {g.surround.prisonDesc2}
                    </p>
                    <div className="p-2 rounded bg-stone-950 text-[11px] text-amber-300 border border-stone-800">
                      <strong>{g.surround.waitNoteTitle}:</strong> {g.surround.waitNoteDesc}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 6: ESTADOS ALTERADOS Y ASISTENCIA */}
            {activeSection === 'status' && (
              <div className="space-y-4">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    {g.status.badge}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    {g.status.title}
                  </h2>
                </div>

                <p className="text-xs md:text-sm text-stone-800 leading-relaxed">
                  {g.status.intro}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded bg-orange-950/20 border-2 border-orange-700 text-stone-900">
                    <div className="flex items-center gap-2 font-black text-orange-950">
                      <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center font-black">炎</span>
                      {g.status.burnTitle}
                    </div>
                    <p className="mt-1 text-stone-800">
                      {g.status.burnDesc}
                    </p>
                  </div>

                  <div className="p-3 rounded bg-amber-950/20 border-2 border-amber-700 text-stone-900">
                    <div className="flex items-center gap-2 font-black text-amber-950">
                      <span className="w-5 h-5 rounded-full bg-yellow-500 text-stone-950 flex items-center justify-center font-black">痺</span>
                      {g.status.paraTitle}
                    </div>
                    <p className="mt-1 text-stone-800">
                      {g.status.paraDesc}
                    </p>
                  </div>

                  <div className="p-3 rounded bg-purple-950/20 border-2 border-purple-700 text-stone-900">
                    <div className="flex items-center gap-2 font-black text-purple-950">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black">幻</span>
                      {g.status.confTitle}
                    </div>
                    <p className="mt-1 text-stone-800">
                      {g.status.confDesc}
                    </p>
                  </div>

                  <div className="p-3 rounded bg-sky-950/20 border-2 border-sky-700 text-stone-900">
                    <div className="flex items-center gap-2 font-black text-sky-950">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center font-black">砂</span>
                      {g.status.freezeTitle}
                    </div>
                    <p className="mt-1 text-stone-800">
                      {g.status.freezeDesc}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-stone-900 text-stone-100 border border-sky-500 text-xs space-y-1">
                  <div className="font-bold text-sky-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-400" /> {g.status.assistTitle}
                  </div>
                  <p className="text-stone-300 leading-relaxed">
                    {g.status.assistDesc}
                  </p>
                </div>
              </div>
            )}

            {/* SECCIÓN 7: FORJA DE FIGURAS (NIVEL Y CARMÍN CLV) */}
            {activeSection === 'forge' && (
              <div className="space-y-4">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    {g.forge.badge}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    {g.forge.title}
                  </h2>
                </div>

                <p className="text-xs md:text-sm text-stone-800 leading-relaxed">
                  {g.forge.intro}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-amber-400 text-sm">{g.forge.levelTitle}</h3>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-stone-950 font-black text-xs">{g.forge.levelBadge}</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {g.forge.levelDesc}
                    </p>
                    <div className="p-2 rounded bg-stone-950 text-[11px] font-mono text-amber-300 border border-stone-800">
                      {g.forge.levelInvariant}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-emerald-400 text-sm">{g.forge.clvTitle}</h3>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-black text-xs">{g.forge.clvBadge}</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {g.forge.clvDesc}
                    </p>
                    <div className="p-2 rounded bg-stone-950 text-[11px] font-mono text-emerald-300 border border-stone-800">
                      {g.forge.clvPurpose}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 8: PERGAMINOS TÁCTICOS */}
            {activeSection === 'plates' && (
              <div className="space-y-4">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    {g.plates.badge}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    {g.plates.title}
                  </h2>
                </div>

                <p className="text-xs md:text-sm text-stone-800 leading-relaxed">
                  {g.plates.intro}
                </p>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 flex items-center justify-between">
                    <div>
                      <span className="font-black text-amber-400 text-sm">{g.plates.goalBlockTitle}</span>
                      <p className="text-stone-300 text-xs mt-0.5">{g.plates.goalBlockDesc}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-600 text-stone-950 font-black text-xs shrink-0 shadow">{g.plates.costBadge} 2</span>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 flex items-center justify-between">
                    <div>
                      <span className="font-black text-emerald-400 text-sm">{g.plates.maxReviveTitle}</span>
                      <p className="text-stone-300 text-xs mt-0.5">{g.plates.maxReviveDesc}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-600 text-stone-950 font-black text-xs shrink-0 shadow">{g.plates.costBadge} 2</span>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 flex items-center justify-between">
                    <div>
                      <span className="font-black text-sky-400 text-sm">{g.plates.doubleChanceTitle}</span>
                      <p className="text-stone-300 text-xs mt-0.5">{g.plates.doubleChanceDesc}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-stone-800 text-amber-300 border border-stone-700 font-black text-xs shrink-0 shadow">{g.plates.costBadge} 1</span>
                  </div>

                  <div className="p-3 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 flex items-center justify-between">
                    <div>
                      <span className="font-black text-orange-400 text-sm">{g.plates.xAttackTitle}</span>
                      <p className="text-stone-300 text-xs mt-0.5">{g.plates.xAttackDesc}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-stone-800 text-amber-300 border border-stone-700 font-black text-xs shrink-0 shadow">{g.plates.costBadge} 1</span>
                  </div>
                </div>
              </div>
            )}

          </div>
          <div className="h-2.5 bg-gradient-to-r from-amber-700 via-[#281b12] to-amber-700 rounded-b border-t-2 border-stone-950" />
        </div>
      </main>
    </div>
  );
};
