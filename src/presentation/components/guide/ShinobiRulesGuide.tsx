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
  Type,
  Minus,
  Plus,
} from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { GUIDE_TRANSLATIONS, GuideSectionKey } from '../../../infrastructure/i18n/locales/guideI18n';
import { NarutoMangaBackground } from '../common/NarutoMangaBackground';

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
  
  // Accessibility Text Scaling: 0 = Compact, 1 = Comfortable (Default), 2 = Large
  const [textSize, setTextSize] = useState<number>(1);

  const g = GUIDE_TRANSLATIONS[language] || GUIDE_TRANSLATIONS.es;

  // Accessible font scaling helpers based on user preference
  const bodySizeClass = textSize === 0 
    ? 'text-sm leading-relaxed' 
    : textSize === 1 
    ? 'text-base leading-relaxed' 
    : 'text-lg sm:text-xl leading-loose';

  const subTextSizeClass = textSize === 0 
    ? 'text-xs sm:text-sm leading-normal' 
    : textSize === 1 
    ? 'text-sm sm:text-base leading-relaxed' 
    : 'text-base sm:text-lg leading-relaxed';

  const cardHeadingClass = textSize === 0 
    ? 'text-sm sm:text-base font-extrabold' 
    : textSize === 1 
    ? 'text-base sm:text-lg font-extrabold' 
    : 'text-lg sm:text-xl font-extrabold';

  const navItems: Array<{ id: GuideSectionKey; label: string; icon: React.ReactNode }> = [
    { id: 'objective', label: g.nav.objective, icon: <Shield className="w-4 h-4 shrink-0" /> },
    { id: 'movement', label: g.nav.movement, icon: <Footprints className="w-4 h-4 shrink-0" /> },
    { id: 'turnflow', label: g.nav.turnflow, icon: <ArrowRight className="w-4 h-4 shrink-0" /> },
    { id: 'combat', label: g.nav.combat, icon: <Sword className="w-4 h-4 shrink-0" /> },
    { id: 'surround', label: g.nav.surround, icon: <CheckCircle2 className="w-4 h-4 shrink-0" /> },
    { id: 'status', label: g.nav.status, icon: <Flame className="w-4 h-4 shrink-0" /> },
    { id: 'forge', label: g.nav.forge, icon: <Award className="w-4 h-4 shrink-0" /> },
    { id: 'plates', label: g.nav.plates, icon: <BookOpen className="w-4 h-4 shrink-0" /> },
  ];

  return (
    <div className="min-h-screen text-black flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none relative bg-transparent overflow-x-hidden font-sans">
      <NarutoMangaBackground />

      {/* 1. TOP OFFICIAL TOURNAMENT BAR - ACCESSIBLE HIGH CONTRAST */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between p-3 md:px-5 md:py-2.5 border-3 border-black bg-[#111111] shadow-[4px_4px_0px_#000] flex-wrap gap-3 text-white relative z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMenu}
            className="manga-btn-white px-3.5 py-2 text-xs md:text-sm font-bold uppercase tracking-wide border-2 border-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fa9427]"
            aria-label={t('common.backToMenu')}
          >
            ← {t('common.backToMenu')}
          </button>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 bg-[#FA9427] border-2 border-black flex items-center justify-center text-black font-kanji font-black text-lg shadow-[2px_2px_0px_#000]" aria-hidden="true">
              巻
            </span>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-black text-[#FA9427] tracking-wide uppercase leading-tight drop-shadow-[1px_1px_0px_#000]">
                {g.headerTitle}
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 font-medium tracking-wide mt-0.5">
                {g.headerSubtitle}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher compact />
          <button
            onClick={onPlayGame}
            className="manga-btn-orange px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-wide flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
          >
            <Play className="w-4 h-4 fill-current" /> {t('common.playNow')}
          </button>
        </div>
      </header>

      {/* 2. MAIN CENTER CARD - HIGH READABILITY & NEUTRAL ACCESSIBILITY */}
      <main className="max-w-6xl w-full mx-auto my-2 md:my-3 relative z-20 flex-1 flex flex-col">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] flex-1 flex flex-col p-4 sm:p-6 md:p-7 relative overflow-hidden">
          
          {/* Streamlined Header Banner with Konoha Emblem and Accessibility Text-Size Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-3 border-black pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="ninja-headband-plate px-3 py-1.5 flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_#111111] shrink-0" aria-hidden="true">
                <span className="w-1.5 h-1.5 bg-slate-800" />
                <svg 
                  className="w-6 h-6 text-slate-900 filter drop-shadow-[0_1px_0px_rgba(255,255,255,0.8)]" 
                  viewBox="0 0 36 36" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.8"
                >
                  <path d="M21 19c0-2.8-2.2-5-5-5s-5 2.2-5 5 2.2 5 5 5 5-2.2 5-5z" />
                  <path d="M21 19c0 5-4 9-9 9s-9-4-9-9 4-9 9-9c3.8 0 7.2 1.8 11 1.5l8-4.5-3.5 9.5C26 22 21 26 15 27" />
                  <path d="M4 28l6-4" strokeLinecap="round" />
                </svg>
                <span className="w-1.5 h-1.5 bg-slate-800" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-black text-[#FA9427] font-bold text-xs uppercase tracking-wider border border-black shadow-[1px_1px_0px_#FA9427]">
                    木ノ葉隠れの里 • 忍道指南録
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight leading-tight mt-0.5">
                  {g.headerTitle}
                </h2>
              </div>
            </div>

            {/* Accessibility Font Size Controls: A- / A / A+ (WCAG 1.4.4 Resize Text) */}
            <div 
              className="flex items-center gap-1.5 bg-stone-100 p-1.5 border-2 border-black shadow-[2px_2px_0px_#000] shrink-0 self-start sm:self-center" 
              role="group" 
              aria-label="Tamaño del texto"
            >
              <span className="text-xs font-bold text-black px-1.5 uppercase tracking-wider flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-[#fa9427]" />
                {language === 'es' ? 'Letra:' : language === 'ja' ? '文字:' : 'Font:'}
              </span>
              <button
                type="button"
                onClick={() => setTextSize(prev => Math.max(0, prev - 1))}
                disabled={textSize === 0}
                className="px-2.5 py-1 text-xs font-black border-2 border-black bg-white hover:bg-stone-200 disabled:opacity-40 transition-colors shadow-[1px_1px_0px_#000] cursor-pointer flex items-center gap-0.5 focus-visible:ring-2 focus-visible:ring-[#fa9427]"
                aria-label="Disminuir tamaño de letra"
                title="Texto compacto"
              >
                <Minus className="w-3 h-3" /> A
              </button>
              <button
                type="button"
                onClick={() => setTextSize(1)}
                className={`px-2.5 py-1 text-xs font-black border-2 border-black transition-colors shadow-[1px_1px_0px_#000] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#fa9427] ${
                  textSize === 1 
                    ? 'bg-[#FA9427] text-black shadow-[2px_2px_0px_#000]' 
                    : 'bg-white hover:bg-stone-200 text-black'
                }`}
                aria-label="Tamaño de letra estándar"
                title="Texto estándar"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setTextSize(prev => Math.min(2, prev + 1))}
                disabled={textSize === 2}
                className="px-2.5 py-1 text-xs font-black border-2 border-black bg-white hover:bg-stone-200 disabled:opacity-40 transition-colors shadow-[1px_1px_0px_#000] cursor-pointer flex items-center gap-0.5 focus-visible:ring-2 focus-visible:ring-[#fa9427]"
                aria-label="Aumentar tamaño de letra"
                title="Texto grande"
              >
                A <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Integrated Navigation Tabs Bar - 2 rows of 4 tabs with 44px tap targets */}
          <nav 
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 bg-stone-100 p-2.5 border-3 border-black shadow-[3px_3px_0px_#000]" 
            role="tablist" 
            aria-label="Secciones del manual de reglas"
          >
            {navItems.map(item => {
              const isSelected = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-3 py-2.5 min-h-[46px] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 text-center cursor-pointer border-2 border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fa9427] ${
                    isSelected
                      ? 'bg-[#FA9427] text-black shadow-[3px_3px_0px_#000] font-black scale-[1.01]'
                      : 'bg-white text-black hover:bg-amber-100/70 shadow-[1px_1px_0px_#000]'
                  }`}
                >
                  {item.icon}
                  <span className="leading-snug text-left truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Scrollable Content Container - Ultra-Readable, Accessible Typography */}
          <div 
            id={`panel-${activeSection}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeSection}`}
            className="bg-white text-black flex-1 overflow-y-auto pr-2 pb-4"
          >

            {/* SECCIÓN 1: OBJETIVO Y CONDICIONES DE VICTORIA */}
            {activeSection === 'objective' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2.5 border-b-3 border-black">
                  <span className="px-3 py-1 bg-black text-[#FA9427] font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-black shadow-[2px_2px_0px_#000]">
                    {g.objective.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight leading-snug">
                    {g.objective.title}
                  </h3>
                </div>

                {/* Golden Rule Card */}
                <div className="p-4 sm:p-6 bg-[#FEF3C7] text-black border-3 border-black space-y-3.5 shadow-[4px_4px_0px_#000]">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 bg-[#FA9427] text-black text-xs sm:text-sm font-black uppercase border-2 border-black shadow-[2px_2px_0px_#000]">
                      {g.objective.goldenRuleBadge}
                    </span>
                    <h4 className="font-black text-black text-base sm:text-lg md:text-xl tracking-tight">
                      {g.objective.goldenRuleTitle}
                    </h4>
                  </div>
                  <p className={`${bodySizeClass} text-black font-medium`}>
                    {g.objective.goldenRuleDesc}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div className="p-4 sm:p-5 bg-white border-2 border-black text-black shadow-[3px_3px_0px_#000]">
                      <div className={`${cardHeadingClass} text-black flex items-center gap-2 uppercase tracking-wide`}>
                        <span className="w-6 h-6 bg-[#0284c7] text-white flex items-center justify-center text-xs font-black border border-black shadow-[1px_1px_0px_#000]">P1</span>
                        {g.objective.p1Title}
                      </div>
                      <p className={`${subTextSizeClass} text-black font-normal mt-2`}>
                        {g.objective.p1Desc}
                      </p>
                    </div>
                    <div className="p-4 sm:p-5 bg-white border-2 border-black text-black shadow-[3px_3px_0px_#000]">
                      <div className={`${cardHeadingClass} text-black flex items-center gap-2 uppercase tracking-wide`}>
                        <span className="w-6 h-6 bg-[#dc2626] text-white flex items-center justify-center text-xs font-black border border-black shadow-[1px_1px_0px_#000]">P2</span>
                        {g.objective.p2Title}
                      </div>
                      <p className={`${subTextSizeClass} text-black font-normal mt-2`}>
                        {g.objective.p2Desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secondary Victory and Base Defense */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 sm:p-5 bg-white text-black border-3 border-black shadow-[4px_4px_0px_#000]">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="w-8 h-8 bg-[#FA9427] border-2 border-black text-black flex items-center justify-center text-sm font-black shadow-[1px_1px_0px_#000]">
                        <Award className="w-5 h-5 text-black" />
                      </span>
                      <h4 className={`${cardHeadingClass} text-black tracking-tight`}>
                        {g.objective.secondaryWinTitle}
                      </h4>
                    </div>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.objective.secondaryWinDesc}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 bg-white text-black border-3 border-black shadow-[4px_4px_0px_#000]">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="w-8 h-8 bg-[#dc2626] border-2 border-black text-white flex items-center justify-center text-sm font-black shadow-[1px_1px_0px_#000]">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </span>
                      <h4 className={`${cardHeadingClass} text-black tracking-tight`}>
                        {g.objective.defenseTitle}
                      </h4>
                    </div>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.objective.defenseDesc}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 2: MOVIMIENTO, PUNTOS MP Y DESPLIEGUE */}
            {activeSection === 'movement' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2.5 border-b-3 border-black">
                  <span className="px-3 py-1 bg-black text-[#FA9427] font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-black shadow-[2px_2px_0px_#000]">
                    {g.movement.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight leading-snug">
                    {g.movement.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="p-4 sm:p-5 bg-white text-black border-3 border-black shadow-[4px_4px_0px_#000]">
                    <div className="flex items-center justify-between pb-2 border-b-2 border-black mb-2.5">
                      <span className={`${cardHeadingClass} text-black`}>{g.movement.mp3Title}</span>
                      <span className="px-2.5 py-1 bg-[#fa9427] text-black font-black text-xs border border-black shadow-[1px_1px_0px_#000]">3 MP</span>
                    </div>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.movement.mp3Desc}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 bg-white text-black border-3 border-black shadow-[4px_4px_0px_#000]">
                    <div className="flex items-center justify-between pb-2 border-b-2 border-black mb-2.5">
                      <span className={`${cardHeadingClass} text-black`}>{g.movement.mp2Title}</span>
                      <span className="px-2.5 py-1 bg-stone-200 text-black font-black text-xs border border-black shadow-[1px_1px_0px_#000]">2 MP</span>
                    </div>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.movement.mp2Desc}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 bg-white text-black border-3 border-black shadow-[4px_4px_0px_#000]">
                    <div className="flex items-center justify-between pb-2 border-b-2 border-black mb-2.5">
                      <span className={`${cardHeadingClass} text-black`}>{g.movement.mp1Title}</span>
                      <span className="px-2.5 py-1 bg-stone-100 text-black font-black text-xs border border-black shadow-[1px_1px_0px_#000]">1 MP</span>
                    </div>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.movement.mp1Desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-6 bg-[#FEF3C7] text-black border-3 border-black space-y-3.5 shadow-[4px_4px_0px_#000]">
                  <h4 className="font-black text-black text-base sm:text-lg md:text-xl flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#FA9427]" /> {g.movement.rulesTitle}
                  </h4>
                  <ul className="space-y-3 text-black">
                    <li className="flex items-start gap-3 bg-white p-3.5 sm:p-4 border-2 border-black shadow-[2px_2px_0px_#000]">
                      <span className="px-2.5 py-1 bg-[#fa9427] text-black font-black text-xs sm:text-sm shrink-0 border border-black shadow-[1px_1px_0px_#000]">{g.movement.deployTitle}</span>
                      <span className={`${subTextSizeClass} font-normal text-black`}>{g.movement.deployDesc}</span>
                    </li>
                    <li className="flex items-start gap-3 bg-white p-3.5 sm:p-4 border-2 border-black shadow-[2px_2px_0px_#000]">
                      <span className="px-2.5 py-1 bg-[#fa9427] text-black font-black text-xs sm:text-sm shrink-0 border border-black shadow-[1px_1px_0px_#000]">{g.movement.collisionTitle}</span>
                      <span className={`${subTextSizeClass} font-normal text-black`}>{g.movement.collisionDesc}</span>
                    </li>
                    <li className="flex items-start gap-3 bg-white p-3.5 sm:p-4 border-2 border-black shadow-[2px_2px_0px_#000]">
                      <span className="px-2.5 py-1 bg-[#fa9427] text-black font-black text-xs sm:text-sm shrink-0 border border-black shadow-[1px_1px_0px_#000]">{g.movement.turn1Title}</span>
                      <span className={`${subTextSizeClass} font-normal text-black`}>{g.movement.turn1Desc}</span>
                    </li>
                    <li className="flex items-start gap-3 bg-white p-3.5 sm:p-4 border-2 border-black shadow-[2px_2px_0px_#000]">
                      <span className="px-2.5 py-1 bg-[#dc2626] text-white font-black text-xs sm:text-sm shrink-0 border border-black shadow-[1px_1px_0px_#000]">{g.movement.spawnLockTitle}</span>
                      <span className={`${subTextSizeClass} font-normal text-black`}>{g.movement.spawnLockDesc}</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* SECCIÓN 3: FLUJO DEL TURNO PASO A PASO */}
            {activeSection === 'turnflow' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2.5 border-b-3 border-black">
                  <span className="px-3 py-1 bg-black text-[#FA9427] font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-black shadow-[2px_2px_0px_#000]">
                    {g.turnflow.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight leading-snug">
                    {g.turnflow.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {[
                    { num: '1', title: g.turnflow.step1Title, desc: g.turnflow.step1Desc },
                    { num: '2', title: g.turnflow.step2Title, desc: g.turnflow.step2Desc },
                    { num: '3', title: g.turnflow.step3Title, desc: g.turnflow.step3Desc },
                    { num: '4', title: g.turnflow.step4Title, desc: g.turnflow.step4Desc },
                    { num: '5', title: g.turnflow.step5Title, desc: g.turnflow.step5Desc },
                  ].map(step => (
                    <div key={step.num} className="p-4 sm:p-5 bg-white text-black border-3 border-black shadow-[3px_3px_0px_#000] flex items-start gap-4">
                      <span className="w-10 h-10 sm:w-12 sm:h-12 bg-[#fa9427] text-black font-impact text-lg sm:text-2xl flex items-center justify-center shrink-0 border-2 border-black shadow-[2px_2px_0px_#000]">
                        {step.num}
                      </span>
                      <div className="flex-1">
                        <h4 className={`${cardHeadingClass} text-black uppercase tracking-wide`}>{step.title}</h4>
                        <p className={`${subTextSizeClass} text-black mt-1 font-normal`}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIÓN 4: COMBATE Y RULETA DE 96 SEGMENTOS */}
            {activeSection === 'combat' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2.5 border-b-3 border-black">
                  <span className="px-3 py-1 bg-black text-[#FA9427] font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-black shadow-[2px_2px_0px_#000]">
                    {g.combat.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight leading-snug">
                    {g.combat.title}
                  </h3>
                </div>

                <p className={`${bodySizeClass} text-black font-medium bg-[#FEF3C7] p-4 border-2 border-black shadow-[2px_2px_0px_#000]`}>
                  {g.combat.intro}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-4 sm:p-5 bg-white border-3 border-black text-black flex items-start gap-3.5 shadow-[3px_3px_0px_#000]">
                    <span className="w-11 h-11 bg-[#0284c7] border-2 border-black shrink-0 text-white font-kanji font-black text-lg flex items-center justify-center shadow-[1px_1px_0px_#000]">
                      避
                    </span>
                    <div>
                      <h4 className={`${cardHeadingClass} text-black uppercase tracking-wide`}>{g.combat.blueTitle}</h4>
                      <p className={`${subTextSizeClass} text-black mt-1.5 font-normal`}>{g.combat.blueDesc}</p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-white border-3 border-black text-black flex items-start gap-3.5 shadow-[3px_3px_0px_#000]">
                    <span className="w-11 h-11 bg-[#fa9427] border-2 border-black shrink-0 text-black font-kanji font-black text-lg flex items-center justify-center shadow-[1px_1px_0px_#000]">
                      速
                    </span>
                    <div>
                      <h4 className={`${cardHeadingClass} text-black uppercase tracking-wide`}>{g.combat.goldTitle}</h4>
                      <p className={`${subTextSizeClass} text-black mt-1.5 font-normal`}>{g.combat.goldDesc}</p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-white border-3 border-black text-black flex items-start gap-3.5 shadow-[3px_3px_0px_#000]">
                    <span className="w-11 h-11 bg-[#9333ea] border-2 border-black shrink-0 text-white font-kanji font-black text-lg flex items-center justify-center shadow-[1px_1px_0px_#000]">
                      術
                    </span>
                    <div>
                      <h4 className={`${cardHeadingClass} text-black uppercase tracking-wide`}>{g.combat.purpleTitle}</h4>
                      <p className={`${subTextSizeClass} text-black mt-1.5 font-normal`}>{g.combat.purpleDesc}</p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-white border-3 border-black text-black flex items-start gap-3.5 shadow-[3px_3px_0px_#000]">
                    <span className="w-11 h-11 bg-stone-100 border-2 border-black shrink-0 text-black font-kanji font-black text-lg flex items-center justify-center shadow-[1px_1px_0px_#000]">
                      撃
                    </span>
                    <div>
                      <h4 className={`${cardHeadingClass} text-black uppercase tracking-wide`}>{g.combat.whiteTitle}</h4>
                      <p className={`${subTextSizeClass} text-black mt-1.5 font-normal`}>{g.combat.whiteDesc}</p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 bg-white border-3 border-black text-black flex items-start gap-3.5 md:col-span-2 shadow-[3px_3px_0px_#000]">
                    <span className="w-11 h-11 bg-[#dc2626] border-2 border-black shrink-0 text-white font-kanji font-black text-lg flex items-center justify-center shadow-[1px_1px_0px_#000]">
                      失
                    </span>
                    <div>
                      <h4 className={`${cardHeadingClass} text-black uppercase tracking-wide`}>{g.combat.redTitle}</h4>
                      <p className={`${subTextSizeClass} text-black mt-1.5 font-normal`}>{g.combat.redDesc}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-[#FEF3C7] text-black border-3 border-black space-y-2 shadow-[3px_3px_0px_#000]">
                  <div className={`${cardHeadingClass} text-black flex items-center gap-2`}>
                    <Sparkles className="w-5 h-5 text-[#fa9427]" /> {g.combat.sRankTitle}
                  </div>
                  <p className={`${subTextSizeClass} text-black font-normal`}>
                    {g.combat.sRankDesc}
                  </p>
                </div>
              </div>
            )}

            {/* SECCIÓN 5: RODEO FUINJUTSU Y PRISIÓN FIFO */}
            {activeSection === 'surround' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2.5 border-b-3 border-black">
                  <span className="px-3 py-1 bg-black text-[#FA9427] font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-black shadow-[2px_2px_0px_#000]">
                    {g.surround.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight leading-snug">
                    {g.surround.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 sm:p-6 bg-white text-black border-3 border-black space-y-3.5 shadow-[4px_4px_0px_#000]">
                    <h4 className="font-black text-black text-base sm:text-lg md:text-xl flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#dc2626]" /> {g.surround.surroundTitle}
                    </h4>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.surround.surroundDesc}
                    </p>
                    <p className={`${subTextSizeClass} text-amber-950 bg-amber-100 p-2.5 border-2 border-black font-bold shadow-[1px_1px_0px_#000]`}>
                      💡 {g.surround.surroundTip}
                    </p>
                    <div className="p-3.5 bg-stone-100 text-black border-2 border-black shadow-[2px_2px_0px_#000]">
                      <p className={`${subTextSizeClass}`}>
                        <strong className="text-black uppercase">{g.surround.immunityTitle}:</strong> {g.surround.immunityDesc}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-white text-black border-3 border-black space-y-3.5 shadow-[4px_4px_0px_#000]">
                    <h4 className="font-black text-black text-base sm:text-lg md:text-xl flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#fa9427]" /> {g.surround.prisonTitle}
                    </h4>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.surround.prisonDesc1}
                    </p>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.surround.prisonDesc2}
                    </p>
                    <div className="p-3.5 bg-[#FEF3C7] text-black border-2 border-black shadow-[2px_2px_0px_#000]">
                      <p className={`${subTextSizeClass}`}>
                        <strong className="text-black uppercase">{g.surround.waitNoteTitle}:</strong> {g.surround.waitNoteDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 6: ESTADOS ALTERADOS Y ASISTENCIA */}
            {activeSection === 'status' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2.5 border-b-3 border-black">
                  <span className="px-3 py-1 bg-black text-[#FA9427] font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-black shadow-[2px_2px_0px_#000]">
                    {g.status.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight leading-snug">
                    {g.status.title}
                  </h3>
                </div>

                <p className={`${bodySizeClass} text-black font-medium bg-[#FEF3C7] p-4 border-2 border-black shadow-[2px_2px_0px_#000]`}>
                  {g.status.intro}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-4 sm:p-5 bg-white border-3 border-black text-black shadow-[3px_3px_0px_#000]">
                    <div className="flex items-center gap-2.5 font-black text-black text-base sm:text-lg mb-2">
                      <span className="w-8 h-8 bg-orange-600 border border-black text-white flex items-center justify-center font-kanji font-black text-sm shadow-[1px_1px_0px_#000]">炎</span>
                      {g.status.burnTitle}
                    </div>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.status.burnDesc}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 bg-white border-3 border-black text-black shadow-[3px_3px_0px_#000]">
                    <div className="flex items-center gap-2.5 font-black text-black text-base sm:text-lg mb-2">
                      <span className="w-8 h-8 bg-yellow-500 border border-black text-black flex items-center justify-center font-kanji font-black text-sm shadow-[1px_1px_0px_#000]">痺</span>
                      {g.status.paraTitle}
                    </div>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.status.paraDesc}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 bg-white border-3 border-black text-black shadow-[3px_3px_0px_#000]">
                    <div className="flex items-center gap-2.5 font-black text-black text-base sm:text-lg mb-2">
                      <span className="w-8 h-8 bg-purple-600 border border-black text-white flex items-center justify-center font-kanji font-black text-sm shadow-[1px_1px_0px_#000]">幻</span>
                      {g.status.confTitle}
                    </div>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.status.confDesc}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 bg-white border-3 border-black text-black shadow-[3px_3px_0px_#000]">
                    <div className="flex items-center gap-2.5 font-black text-black text-base sm:text-lg mb-2">
                      <span className="w-8 h-8 bg-sky-600 border border-black text-white flex items-center justify-center font-kanji font-black text-sm shadow-[1px_1px_0px_#000]">砂</span>
                      {g.status.freezeTitle}
                    </div>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.status.freezeDesc}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-[#FEF3C7] text-black border-3 border-black space-y-2 shadow-[3px_3px_0px_#000]">
                  <div className={`${cardHeadingClass} text-black flex items-center gap-2`}>
                    <Sparkles className="w-5 h-5 text-[#fa9427]" /> {g.status.assistTitle}
                  </div>
                  <p className={`${subTextSizeClass} text-black font-normal`}>
                    {g.status.assistDesc}
                  </p>
                </div>
              </div>
            )}

            {/* SECCIÓN 7: FORJA DE FIGURAS (NIVEL Y CARMÍN CLV) */}
            {activeSection === 'forge' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2.5 border-b-3 border-black">
                  <span className="px-3 py-1 bg-black text-[#FA9427] font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-black shadow-[2px_2px_0px_#000]">
                    {g.forge.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight leading-snug">
                    {g.forge.title}
                  </h3>
                </div>

                <p className={`${bodySizeClass} text-black font-medium bg-[#FEF3C7] p-4 border-2 border-black shadow-[2px_2px_0px_#000]`}>
                  {g.forge.intro}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 sm:p-6 bg-white text-black border-3 border-black space-y-3 shadow-[4px_4px_0px_#000]">
                    <div className="flex items-center justify-between pb-2 border-b-2 border-black">
                      <h4 className={`${cardHeadingClass} text-black`}>{g.forge.levelTitle}</h4>
                      <span className="px-2.5 py-1 bg-[#fa9427] text-black font-black text-xs border border-black shadow-[1px_1px_0px_#000]">{g.forge.levelBadge}</span>
                    </div>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.forge.levelDesc}
                    </p>
                    <div className="p-3 bg-stone-100 text-black border-2 border-black shadow-[2px_2px_0px_#000]">
                      <p className={`${subTextSizeClass} font-mono font-bold text-black`}>
                        {g.forge.levelInvariant}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 bg-white text-black border-3 border-black space-y-3 shadow-[4px_4px_0px_#000]">
                    <div className="flex items-center justify-between pb-2 border-b-2 border-black">
                      <h4 className={`${cardHeadingClass} text-black`}>{g.forge.clvTitle}</h4>
                      <span className="px-2.5 py-1 bg-emerald-600 text-white font-black text-xs border border-black shadow-[1px_1px_0px_#000]">{g.forge.clvBadge}</span>
                    </div>
                    <p className={`${subTextSizeClass} text-black font-normal`}>
                      {g.forge.clvDesc}
                    </p>
                    <div className="p-3 bg-stone-100 text-black border-2 border-black shadow-[2px_2px_0px_#000]">
                      <p className={`${subTextSizeClass} font-mono font-bold text-black`}>
                        {g.forge.clvPurpose}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN 8: PERGAMINOS TÁCTICOS */}
            {activeSection === 'plates' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2.5 border-b-3 border-black">
                  <span className="px-3 py-1 bg-black text-[#FA9427] font-extrabold text-xs sm:text-sm uppercase tracking-wider border border-black shadow-[2px_2px_0px_#000]">
                    {g.plates.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight leading-snug">
                    {g.plates.title}
                  </h3>
                </div>

                <p className={`${bodySizeClass} text-black font-medium bg-[#FEF3C7] p-4 border-2 border-black shadow-[2px_2px_0px_#000]`}>
                  {g.plates.intro}
                </p>

                <div className="space-y-3.5">
                  <div className="p-4 sm:p-5 bg-white text-black border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className={`${cardHeadingClass} text-black`}>{g.plates.goalBlockTitle}</h4>
                      <p className={`${subTextSizeClass} text-black mt-1.5 font-normal`}>{g.plates.goalBlockDesc}</p>
                    </div>
                    <span className="px-3 py-1.5 bg-[#fa9427] text-black font-black text-xs sm:text-sm shrink-0 border-2 border-black shadow-[2px_2px_0px_#000]">{g.plates.costBadge} 2</span>
                  </div>

                  <div className="p-4 sm:p-5 bg-white text-black border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className={`${cardHeadingClass} text-black`}>{g.plates.maxReviveTitle}</h4>
                      <p className={`${subTextSizeClass} text-black mt-1.5 font-normal`}>{g.plates.maxReviveDesc}</p>
                    </div>
                    <span className="px-3 py-1.5 bg-[#fa9427] text-black font-black text-xs sm:text-sm shrink-0 border-2 border-black shadow-[2px_2px_0px_#000]">{g.plates.costBadge} 2</span>
                  </div>

                  <div className="p-4 sm:p-5 bg-white text-black border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className={`${cardHeadingClass} text-black`}>{g.plates.doubleChanceTitle}</h4>
                      <p className={`${subTextSizeClass} text-black mt-1.5 font-normal`}>{g.plates.doubleChanceDesc}</p>
                    </div>
                    <span className="px-3 py-1.5 bg-stone-100 text-black border-2 border-black font-black text-xs sm:text-sm shrink-0 shadow-[2px_2px_0px_#000]">{g.plates.costBadge} 1</span>
                  </div>

                  <div className="p-4 sm:p-5 bg-white text-black border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className={`${cardHeadingClass} text-black`}>{g.plates.xAttackTitle}</h4>
                      <p className={`${subTextSizeClass} text-black mt-1.5 font-normal`}>{g.plates.xAttackDesc}</p>
                    </div>
                    <span className="px-3 py-1.5 bg-stone-100 text-black border-2 border-black font-black text-xs sm:text-sm shrink-0 shadow-[2px_2px_0px_#000]">{g.plates.costBadge} 1</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* 3. BOTTOM OFFICIAL TOURNAMENT BAR */}
      <footer className="max-w-6xl w-full mx-auto bg-[#111111] text-white p-2.5 md:px-4 border-3 border-black shadow-[4px_4px_0px_#000] flex items-center justify-between text-xs font-bold tracking-wider relative z-20 flex-wrap gap-2 mt-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#FA9427]" />
          <span className="text-stone-200 uppercase">
            {language === 'es' ? 'DOCUMENTO OFICIAL DE KONOHA • REGLAMENTO DE COMBATE' : language === 'ja' ? '木ノ葉隠れの里 公式規則 • 戦闘規定' : 'KONOHA OFFICIAL DOCUMENT • COMBAT REGULATIONS'}
          </span>
        </div>
        <div className="text-amber-400 font-mono text-xs">
          SISTEMA SHINOBI DUEL • V1.0 CANONICAL
        </div>
      </footer>
    </div>
  );
};
