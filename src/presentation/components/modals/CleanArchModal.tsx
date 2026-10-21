import React, { useState } from 'react';
import { Layers, Cpu, ChevronRight, Terminal, Copy, Check } from 'lucide-react';
import { GameState } from '../../../application/state/gameInitialState';

interface CleanArchModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
}

const ARCHITECTURE_MODULES = [
  {
    layer: 'Domain Layer (Pure TypeScript / Zero Framework Deps)',
    color: 'border-amber-500 text-amber-300',
    badge: 'domain/',
    files: [
      {
        path: 'src/domain/models/ShinobiFigure.ts',
        responsibility: 'Modelo de entidad Shinobi, ruleta de 96 segmentos (Blanco, Dorado, Morado ★, Azul, Rojo), Leveling Lv.1-5, CLv 0-10 y mutaciones de estado.',
      },
      {
        path: 'src/domain/models/BoardGraph.ts',
        responsibility: 'Topología matemática de 28 nodos de Pokémon Duel, adyacencias e invariantes de meta Hokage.',
      },
      {
        path: 'src/domain/services/BoardMovementService.ts',
        responsibility: 'BFS canónico con poda, colisiones de paso, saltos espaciales y cálculo de MP efectivo.',
      },
      {
        path: 'src/domain/services/CombatResolver.ts',
        responsibility: 'Motor determinista/probabilístico de jerarquía de colores: Azul > Todo, Dorado > Morado, Morado > Blanco, Blanco por daño y supervivencia Mew Hiraishin.',
      },
      {
        path: 'src/domain/services/SurroundService.ts',
        responsibility: 'Detección de Rodeo Fuinjutsu (Surround K.O.), inmunidad de escudo de arena y buffer FIFO de 2 plazas de la prisión.',
      },
      {
        path: 'src/domain/services/AiTacticalEngine.ts',
        responsibility: 'Evaluador heurístico multiobjetivo para el bot Akatsuki (victoria Hokage, rodeo, defensa de base).',
      },
      {
        path: 'src/domain/repositories/IShinobiRepository.ts',
        responsibility: 'Contrato de repositorio abstracto para desacoplar fuentes de datos (Mock vs Base de datos futura).',
      },
    ],
  },
  {
    layer: 'Application Layer (Use Cases & Finite State Machine)',
    color: 'border-sky-500 text-sky-300',
    badge: 'application/',
    files: [
      {
        path: 'src/application/state/gameReducer.ts',
        responsibility: 'Máquina de estados finita inmutable (SELECT_UNIT, MOVE_UNIT, ACTIVATE_SCROLL, BATTLE, RESOLVE_DUEL, END_TURN).',
      },
      {
        path: 'src/application/hooks/useShinobiDuel.ts',
        responsibility: 'Custom Hook de orquestación React que conecta el reducer puro con el audio procedural y el ciclo de vida de la IA.',
      },
    ],
  },
  {
    layer: 'Infrastructure Layer (External Adapters & Repositories)',
    color: 'border-emerald-500 text-emerald-300',
    badge: 'infrastructure/',
    files: [
      {
        path: 'src/infrastructure/repositories/MockShinobiRepository.ts',
        responsibility: 'Implementación del repositorio en memoria para datos de prueba, lista para conectarse a Supabase/REST/BBDD en el futuro.',
      },
      {
        path: 'src/infrastructure/audio/ShinobiAudioEngine.ts',
        responsibility: 'Sintetizador de sonido procedural con Web Audio API (Taiko, Kunai, Chakra, Fuinjutsu) sin ficheros de audio externos.',
      },
      {
        path: 'src/infrastructure/assets/animeAssets.ts',
        responsibility: 'Cut-ins vectoriales y fallbacks deterministas SVG para garantizar cero imágenes rotas.',
      },
    ],
  },
  {
    layer: 'Presentation Layer (React Components & UI)',
    color: 'border-purple-500 text-purple-300',
    badge: 'presentation/',
    files: [
      {
        path: 'src/presentation/components/board/ChuninArenaSVG.tsx',
        responsibility: 'Lienzo interactivo SVG de 28 nodos con textura de piedra tallada y miniaturas ninja.',
      },
      {
        path: 'src/presentation/components/menu/MainMenu.tsx',
        responsibility: 'Menú principal inicial desacoplado con accesos a Jugar, Guía Informativa y Catálogo.',
      },
      {
        path: 'src/presentation/components/guide/ShinobiRulesGuide.tsx',
        responsibility: 'Guía informativa interactiva de reglas de Pokémon Duel adaptadas a Naruto.',
      },
      {
        path: 'src/presentation/components/codex/ShinobiCodex.tsx',
        responsibility: 'Catálogo de personajes (Libro Bingo) y forja interactiva de Niveles 1-5 y CLv 0-10.',
      },
      {
        path: 'src/presentation/components/combat/ChakraDuelModal.tsx',
        responsibility: 'Modal de duelo con doble ruleta giratoria, cinemática de técnicas y re-giro Sharingan.',
      },
    ],
  },
];

export const CleanArchModal: React.FC<CleanArchModalProps> = ({ isOpen, onClose, state }) => {
  const [activeTab, setActiveTab] = useState<'layers' | 'state'>('layers');
  const [copiedCLI, setCopiedCLI] = useState(false);

  if (!isOpen) return null;

  const cliScaffoldCommand = `mkdir -p src/{domain/{models,services,repositories},application/{state,hooks},infrastructure/{audio,assets,repositories},presentation/{components/{board,scrolls,combat,modals,menu,guide,codex},styles}}`;

  const handleCopyCli = () => {
    navigator.clipboard?.writeText(cliScaffoldCommand);
    setCopiedCLI(true);
    setTimeout(() => setCopiedCLI(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-4" role="dialog" aria-modal="true">
      <div className="max-w-5xl w-full max-h-[90vh] flex flex-col rounded-xl border-2 border-amber-600 bg-[#18110c] text-stone-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#241911] border-b border-stone-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-base md:text-lg font-black text-amber-300 tracking-wide">
                ARQUITECTURA CLEAN & DDD — SHINOBI DUEL
              </h2>
              <p className="text-xs text-stone-400">
                Separación concéntrica: Domain → Application → Infrastructure → Presentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-red-900/80 hover:bg-red-800 text-amber-100 text-xs font-bold border border-red-600 transition"
          >
            ✕ Cerrar Inspector
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-2.5 bg-[#1d140e] border-b border-stone-800 flex gap-2">
          <button
            onClick={() => setActiveTab('layers')}
            className={`px-3 py-1.5 rounded-t text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'layers'
                ? 'border-amber-400 text-amber-300 bg-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Capas y Módulos
          </button>
          <button
            onClick={() => setActiveTab('state')}
            className={`px-3 py-1.5 rounded-t text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'state'
                ? 'border-amber-400 text-amber-300 bg-stone-900'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> Estado Inmutable en Vivo (FSM)
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'layers' ? (
            <>
              {/* Dependency Rule */}
              <div className="p-3.5 rounded-lg bg-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs space-y-1">
                  <div className="font-bold text-amber-400 uppercase tracking-wider">
                    Regla de Dependencia Concéntrica (Clean Architecture)
                  </div>
                  <p className="text-stone-300">
                    La capa <strong>Domain</strong> contiene las reglas matemáticas del grafo de 28 nodos y la ruleta de 96 segmentos sin dependencias de React. La capa <strong>Infrastructure</strong> implementa contratos de repositorio y síntesis Web Audio.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono bg-stone-900 px-3 py-2 rounded border border-stone-700">
                  <span className="text-purple-400">Presentation</span>
                  <ChevronRight className="w-4 h-4 text-stone-500" />
                  <span className="text-sky-400">Application</span>
                  <ChevronRight className="w-4 h-4 text-stone-500" />
                  <span className="text-amber-400 font-bold">Domain (Core)</span>
                </div>
              </div>

              {/* CLI command */}
              <div className="p-3 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 overflow-x-auto">
                  <Terminal className="w-4 h-4 shrink-0" />
                  <code>{cliScaffoldCommand}</code>
                </div>
                <button
                  onClick={handleCopyCli}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  {copiedCLI ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCLI ? 'Copiado' : 'Copiar CLI'}</span>
                </button>
              </div>

              {/* Layer Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ARCHITECTURE_MODULES.map((mod, idx) => (
                  <div
                    key={idx}
                    className={`rounded-lg p-3.5 bg-stone-900/90 border-l-4 ${mod.color} border border-stone-800 space-y-2.5`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-sm">{mod.layer}</h3>
                      <span className="px-2 py-0.5 rounded bg-stone-950 text-[11px] font-mono border border-stone-700">
                        {mod.badge}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {mod.files.map(f => (
                        <div key={f.path} className="p-2 rounded bg-stone-950/90 border border-stone-800/80">
                          <div className="font-mono text-xs text-amber-300 font-bold">{f.path}</div>
                          <p className="text-[11px] text-stone-300 mt-0.5 leading-snug">{f.responsibility}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded bg-stone-900 border border-stone-700">
                  <span className="text-stone-400 block">Fase FSM Actual</span>
                  <span className="text-sm font-black text-amber-400">{state.phase}</span>
                </div>
                <div className="p-2.5 rounded bg-stone-900 border border-stone-700">
                  <span className="text-stone-400 block">Turno / Jugador Activo</span>
                  <span className="text-sm font-black text-emerald-400">
                    Turno {state.turnCount} (J{state.turnPlayer})
                  </span>
                </div>
                <div className="p-2.5 rounded bg-stone-900 border border-stone-700">
                  <span className="text-stone-400 block">Unidades en Tablero</span>
                  <span className="text-sm font-black text-sky-400">
                    {state.figures.filter(f => f.location === 'board').length} / 12
                  </span>
                </div>
                <div className="p-2.5 rounded bg-stone-900 border border-stone-700">
                  <span className="text-stone-400 block">Prisión Fuinjutsu</span>
                  <span className="text-sm font-black text-red-400">
                    J1: {state.koQueue[1].length}/2 • J2: {state.koQueue[2].length}/2
                  </span>
                </div>
              </div>
              <pre className="p-3 rounded-lg bg-stone-950 border border-stone-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[380px]">
                {JSON.stringify(
                  {
                    mode: state.mode,
                    turnPlayer: state.turnPlayer,
                    turnCount: state.turnCount,
                    phase: state.phase,
                    selectedFigureId: state.selectedFigureId,
                    validMoveNodeIds: Object.keys(state.validMoveNodes),
                    validAttackFigureIds: state.validAttackFigureIds,
                    activeBuffs: state.activeBuffs,
                    koQueue: state.koQueue,
                    boardPositions: state.figures
                      .filter(f => f.location === 'board')
                      .map(f => ({ id: f.id, name: f.shortName, owner: f.owner, nodeId: f.nodeId, wait: f.wait })),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
