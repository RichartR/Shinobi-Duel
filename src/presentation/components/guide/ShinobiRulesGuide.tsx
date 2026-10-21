import React, { useState } from 'react';
import { BookOpen, Shield, Sword, RotateCcw, Play, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

interface ShinobiRulesGuideProps {
  onBackToMenu: () => void;
  onPlayGame: () => void;
}

type GuideSection = 'basics' | 'wheel' | 'colors' | 'surround' | 'plates';

export const ShinobiRulesGuide: React.FC<ShinobiRulesGuideProps> = ({
  onBackToMenu,
  onPlayGame,
}) => {
  const [activeSection, setActiveSection] = useState<GuideSection>('basics');

  return (
    <div className="min-h-screen bg-[#140e0a] text-stone-100 flex flex-col p-3 md:p-6">
      {/* Top Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBackToMenu}
            className="px-3 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold border border-stone-700 transition flex items-center gap-1.5"
          >
            ← Volver al Menú
          </button>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-sm bg-red-900 border border-amber-500/60 flex items-center justify-center text-amber-300 font-kanji font-black text-xs">
              書
            </span>
            <h1 className="text-sm md:text-base font-black text-amber-400 uppercase tracking-wide">
              GUÍA TÁCTICA DEL EXAMEN CHUNIN (REGLAS OFICIALES)
            </h1>
          </div>
        </div>
        <button
          onClick={onPlayGame}
          className="px-4 py-1.5 rounded bg-red-800 hover:bg-red-700 text-amber-100 text-xs font-black uppercase tracking-wider border border-amber-500 shadow transition flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" /> Jugar Ahora
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto my-4 flex-1 flex flex-col">
        {/* Navigation Tabs */}
        <nav className="flex flex-wrap gap-2 mb-4 bg-stone-900/90 p-2 rounded-lg border border-stone-800" aria-label="Secciones de la guía">
          <button
            onClick={() => setActiveSection('basics')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 ${
              activeSection === 'basics'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> 1. Objetivo y Tablero
          </button>
          <button
            onClick={() => setActiveSection('wheel')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 ${
              activeSection === 'wheel'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> 2. Ruleta de 96 Segmentos
          </button>
          <button
            onClick={() => setActiveSection('colors')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 ${
              activeSection === 'colors'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sword className="w-3.5 h-3.5" /> 3. Jerarquía de Colores
          </button>
          <button
            onClick={() => setActiveSection('surround')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 ${
              activeSection === 'surround'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> 4. Rodeo Fuinjutsu & Prisión
          </button>
          <button
            onClick={() => setActiveSection('plates')}
            className={`px-3 py-2 rounded text-xs font-bold transition flex items-center gap-1.5 ${
              activeSection === 'plates'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'bg-stone-950 text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> 5. Pergaminos (Plates)
          </button>
        </nav>

        {/* Content Box with Washi styling */}
        <div className="shadow-2xl flex-1 flex flex-col">
          <div className="h-2.5 bg-gradient-to-r from-amber-700 via-[#281b12] to-amber-700 rounded-t border-b-2 border-stone-950" />
          <div className="bg-[#f4ebd9] text-stone-900 p-5 md:p-8 border-x-4 border-[#281b12] flex-1 overflow-y-auto">
            {activeSection === 'basics' && (
              <div className="space-y-4">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    CONCEPTO CENTRAL DEL JUEGO
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    Objetivo de la Victoria y Despliegue en los 28 Nodos
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 space-y-2">
                    <h3 className="font-black text-amber-400 text-sm flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-red-900 text-white text-xs">勝</span>
                      Condición de Victoria: Captura de la Base
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      El objetivo principal no es noquear a todos los ninjas enemigos, sino <strong>ocupar la Base rival</strong>:
                    </p>
                    <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
                      <li><strong>Jugador 1 (Konoha):</strong> Gana pisando la Base Akatsuki (Nodo #2).</li>
                      <li><strong>Jugador 2 (Akatsuki):</strong> Gana pisando el Monumento Hokage (Nodo #15).</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 space-y-2">
                    <h3 className="font-black text-amber-400 text-sm flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-amber-600 text-stone-950 text-xs">陣</span>
                      Puntos de Infiltración y Despliegue
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Cada jugador inicia con 6 figuras en el banquillo. Se despliegan a través de sus puntos de infiltración:
                    </p>
                    <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
                      <li><strong>Konoha (J1):</strong> Nodos esquineros #13 y #17.</li>
                      <li><strong>Akatsuki (J2):</strong> Nodos esquineros #0 y #4.</li>
                      <li><strong>Regla Turno 1:</strong> El jugador que abre la partida sufre un handicap inicial de <strong>-1 MP</strong>.</li>
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 rounded bg-amber-950/15 border-l-4 border-amber-800 text-xs text-stone-900">
                  <strong>Bloqueo de Infiltración:</strong> Si una figura rival ocupa tu punto de infiltración (#13 o #17), no podrás desplegar más figuras por esa esquina hasta eliminarla o desplazarla.
                </div>
              </div>
            )}

            {activeSection === 'wheel' && (
              <div className="space-y-4">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    MÉTRICA MATEMÁTICA CANÓNICA
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    Ruleta de 96 Segmentos, Subida de Nivel y Fusión CLv
                  </h2>
                </div>

                <p className="text-xs md:text-sm text-stone-800 leading-relaxed">
                  En <em>Pokémon Duel</em>, las probabilidades no son porcentajes arbitrarios del 100%, sino una circunferencia discretizada en exactamente <strong>96 segmentos</strong> unitarios. Cada sector mide entre 4 y 96 unidades discretas.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 space-y-2">
                    <h3 className="font-black text-amber-400 text-sm">
                      Subida de Nivel (Lv. 1 al 5)
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Cada nivel ganado (hasta Nivel 5) permite transferir <strong>+1 segmento</strong> desde el sector de Fallo Rojo hacia cualquier técnica elegida (Blanco, Dorado, Morado o Azul).
                    </p>
                    <div className="p-2 rounded bg-stone-950 text-[11px] font-mono text-amber-300 border border-stone-800">
                      Invariante: El sector Rojo nunca puede reducirse a menos de 4 segmentos (4/96).
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 space-y-2">
                    <h3 className="font-black text-emerald-400 text-sm">
                      Nivel de Cadena (CLv 0 al 10)
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      La fusión de figuras repetidas otorga puntos de Chain Level. Cada punto suma <strong>+1 DMG</strong> específico a un ataque Blanco o Dorado.
                    </p>
                    <div className="p-2 rounded bg-stone-950 text-[11px] font-mono text-emerald-300 border border-stone-800">
                      Propósito: Resolver quirúrgicamente empates de idéntico valor base (ej: 101 DMG vence a 100 DMG).
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'colors' && (
              <div className="space-y-4">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    SISTEMA DE COMBATE CANÓNICO
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    Jerarquía de Colores y Resolución de Duelos
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-sky-950/20 border-2 border-sky-800 text-stone-900 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-sky-600 border border-stone-900 shrink-0 text-white font-bold text-xs flex items-center justify-center">
                      避
                    </span>
                    <div>
                      <h3 className="font-black text-xs text-sky-900 uppercase">Azul (Kawarimi / Esquiva)</h3>
                      <p className="text-xs text-stone-800">
                        <strong>Invalida cualquier ataque.</strong> Si giras Azul, nunca eres noqueado, sin importar qué gire el rival.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-amber-950/20 border-2 border-amber-800 text-stone-900 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-amber-500 border border-stone-900 shrink-0 text-stone-950 font-bold text-xs flex items-center justify-center">
                      速
                    </span>
                    <div>
                      <h3 className="font-black text-xs text-amber-950 uppercase">Dorado (Ataque Veloz)</h3>
                      <p className="text-xs text-stone-800">
                        <strong>Destruye Jutsus Morados.</strong> Vence a Blanco por comparación de daño.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-purple-950/20 border-2 border-purple-800 text-stone-900 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-purple-700 border border-stone-900 shrink-0 text-white font-bold text-xs flex items-center justify-center">
                      術
                    </span>
                    <div>
                      <h3 className="font-black text-xs text-purple-950 uppercase">Morado (Jutsu Estelar ★)</h3>
                      <p className="text-xs text-stone-800">
                        <strong>Vence a Blanco sin importar el daño.</strong> Aplica efectos (Quemadura, Parálisis, Desplazamiento). Se compara por estrellas (★★★ vence a ★★).
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-stone-900/10 border-2 border-stone-800 text-stone-900 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-white border border-stone-900 shrink-0 text-stone-950 font-bold text-xs flex items-center justify-center">
                      撃
                    </span>
                    <div>
                      <h3 className="font-black text-xs text-stone-900 uppercase">Blanco (Ataque Físico)</h3>
                      <p className="text-xs text-stone-800">
                        <strong>Choque numérico.</strong> El mayor daño noquea al rival. Si ambos empatan numéricamente, nadie cae.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-red-950/20 border-2 border-red-800 text-stone-900 flex items-start gap-2.5 md:col-span-2">
                    <span className="w-5 h-5 rounded bg-red-700 border border-stone-900 shrink-0 text-white font-bold text-xs flex items-center justify-center">
                      失
                    </span>
                    <div>
                      <h3 className="font-black text-xs text-red-900 uppercase">Rojo (Fallo Absoluto)</h3>
                      <p className="text-xs text-stone-800">
                        <strong>Pierde contra cualquier otro color.</strong> Si ambos ninjas caen en Rojo, ninguno es noqueado.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded bg-stone-900 text-stone-100 border border-amber-600 text-xs">
                  <div className="font-bold text-amber-300">Regla Mew / Hiraishin (Minato Namikaze):</div>
                  <p className="text-stone-300 mt-0.5">
                    El Hiraishin no Jutsu de Minato Namikaze (50 DMG Dorado) posee la doctrina especial de supervivencia: si el enemigo gira 100 DMG o más en un ataque físico o dorado, Minato no es noqueado.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'surround' && (
              <div className="space-y-4">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    MECÁNICA CLAVE DE POSICIONAMIENTO
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    Rodeo Fuinjutsu (Surround K.O.) y Prisión FIFO
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 space-y-2">
                    <h3 className="font-black text-red-400 text-sm">
                      Rodeo Fuinjutsu (K.O. sin combatir)
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Si una figura enemiga queda rodeada en <strong>todos sus nodos adyacentes</strong> por figuras de tu equipo, es eliminada inmediatamente sin necesidad de girar la ruleta.
                    </p>
                    <p className="text-[11px] text-amber-300">
                      Excepción: Gaara del Desierto es inmune al Rodeo gracias a su Escudo de Arena.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-stone-900 text-stone-100 border border-stone-700 space-y-2">
                    <h3 className="font-black text-amber-400 text-sm">
                      Prisión Fuinjutsu FIFO (Capacidad 2)
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      La prisión de cada bando almacena un máximo de 2 ninjas noqueados.
                    </p>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Cuando un tercer ninja es sellado, el más antiguo de la cola es <strong>liberado automáticamente al banquillo</strong> con condición de <strong>Espera 2</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'plates' && (
              <div className="space-y-4">
                <div className="border-b-2 border-stone-800/30 pb-3">
                  <span className="text-xs font-black text-red-900 uppercase tracking-widest">
                    GESTIÓN DE PERGAMINOS TÁCTICOS
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-stone-900">
                    Plates y Límite Oficial de 6 Puntos de Capacidad
                  </h2>
                </div>

                <p className="text-xs md:text-sm text-stone-800 leading-relaxed">
                  Los pergaminos tácticos otorgan ventajas críticas de un solo uso durante la partida. El mazo de pergaminos tiene una capacidad máxima de <strong>6 puntos de coste</strong>:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded bg-stone-900 text-stone-100 border border-stone-700 flex items-center justify-between">
                    <div>
                      <span className="font-black text-amber-400">守 Goal Block (Defensa de Base)</span>
                      <p className="text-stone-300 text-[11px]">Teletransporta a un aliado desde el campo directamente a tu Base y finaliza el turno.</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-600 text-stone-950 font-black shrink-0">Coste 2</span>
                  </div>

                  <div className="p-2.5 rounded bg-stone-900 text-stone-100 border border-stone-700 flex items-center justify-between">
                    <div>
                      <span className="font-black text-emerald-400">蘇 Max Revive (Edo Tensei)</span>
                      <p className="text-stone-300 text-[11px]">Resucita a un ninja de tu Prisión Fuinjutsu directamente a tu banquillo sin Espera.</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-600 text-stone-950 font-black shrink-0">Coste 2</span>
                  </div>

                  <div className="p-2.5 rounded bg-stone-900 text-stone-100 border border-stone-700 flex items-center justify-between">
                    <div>
                      <span className="font-black text-sky-400">眼 Double Chance (Ojo de la Presciencia)</span>
                      <p className="text-stone-300 text-[11px]">Permite re-girar tu ruleta de chakra en combate si el resultado no es favorable.</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-stone-800 text-amber-300 font-black shrink-0">Coste 1</span>
                  </div>

                  <div className="p-2.5 rounded bg-stone-900 text-stone-100 border border-stone-700 flex items-center justify-between">
                    <div>
                      <span className="font-black text-orange-400">力 X Attack (Píldora de Chakra)</span>
                      <p className="text-stone-300 text-[11px]">+30 DMG a todos los ataques físicos y dorados del ninja durante este turno.</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-stone-800 text-amber-300 font-black shrink-0">Coste 1</span>
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
