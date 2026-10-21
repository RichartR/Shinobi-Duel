import React, { useState, useMemo, useCallback } from 'react';
import { useShinobiDuel } from './application/hooks/useShinobiDuel';
import { soundEngine } from './infrastructure/audio/ShinobiAudioEngine';
import { MainMenu } from './presentation/components/menu/MainMenu';
import { ShinobiRulesGuide } from './presentation/components/guide/ShinobiRulesGuide';
import { ShinobiCodex } from './presentation/components/codex/ShinobiCodex';
import { Header } from './presentation/components/common/Header';
import { ChuninArenaSVG } from './presentation/components/board/ChuninArenaSVG';
import { PlayerCommandBar } from './presentation/components/scrolls/PlayerCommandBar';
import { BingoInspectorScroll } from './presentation/components/scrolls/BingoInspectorScroll';
import { BattleChronicleLog } from './presentation/components/scrolls/BattleChronicleLog';
import { ChakraDuelModal } from './presentation/components/combat/ChakraDuelModal';
import { CleanArchModal } from './presentation/components/modals/CleanArchModal';
import { VictoryModal } from './presentation/components/modals/VictoryModal';

type AppScreen = 'menu' | 'game' | 'guide' | 'codex';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('menu');
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);

  const { state, dispatch, isMuted, toggleMute } = useShinobiDuel();

  const inspectedFigure = useMemo(
    () => state.figures.find(f => f.id === state.inspectedFigureId) || state.figures[0],
    [state.figures, state.inspectedFigureId]
  );

  const handleSelectUnit = useCallback(
    (figureId: string) => {
      if (state.mode === 'ai' && state.turnPlayer === 2 && state.phase !== 'GAMEOVER') {
        dispatch({ type: 'INSPECT_UNIT', payload: { figureId } });
        return;
      }
      soundEngine.play('select');
      dispatch({ type: 'SELECT_UNIT', payload: { figureId } });
    },
    [state.mode, state.turnPlayer, state.phase, dispatch]
  );

  const handleSelectNode = useCallback(
    (nodeId: number) => {
      if (state.mode === 'ai' && state.turnPlayer === 2) return;
      soundEngine.play('move');
      dispatch({ type: 'MOVE_UNIT', payload: { targetNodeId: nodeId } });
    },
    [state.mode, state.turnPlayer, dispatch]
  );

  const handleActivateScroll = useCallback(
    (player: 1 | 2, scrollSlotId: string) => {
      soundEngine.play('scroll');
      dispatch({ type: 'ACTIVATE_SCROLL', payload: { player, scrollSlotId } });
    },
    [dispatch]
  );

  const handleStartGame = (mode: 'ai' | 'local') => {
    soundEngine.play('select');
    if (state.mode !== mode) {
      dispatch({ type: 'TOGGLE_MODE' });
    }
    setCurrentScreen('game');
  };

  // Screen 1: Main Initial Menu
  if (currentScreen === 'menu') {
    return (
      <>
        <MainMenu
          onStartGame={handleStartGame}
          onOpenGuide={() => {
            soundEngine.play('select');
            setCurrentScreen('guide');
          }}
          onOpenCodex={() => {
            soundEngine.play('select');
            setCurrentScreen('codex');
          }}
          onOpenArch={() => setIsArchModalOpen(true)}
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
        <CleanArchModal
          isOpen={isArchModalOpen}
          onClose={() => setIsArchModalOpen(false)}
          state={state}
        />
      </>
    );
  }

  // Screen 2: Rules Guide
  if (currentScreen === 'guide') {
    return (
      <ShinobiRulesGuide
        onBackToMenu={() => {
          soundEngine.play('select');
          setCurrentScreen('menu');
        }}
        onPlayGame={() => {
          soundEngine.play('select');
          setCurrentScreen('game');
        }}
      />
    );
  }

  // Screen 3: Shinobi Codex & Deck Builder
  if (currentScreen === 'codex') {
    return (
      <ShinobiCodex
        state={state}
        dispatch={dispatch}
        onBackToMenu={() => {
          soundEngine.play('select');
          setCurrentScreen('menu');
        }}
        onPlayGame={() => {
          soundEngine.play('select');
          setCurrentScreen('game');
        }}
      />
    );
  }

  // Screen 4: Tactical Arena Game
  return (
    <div
      className="min-h-screen flex flex-col text-stone-900 select-none bg-[#140e0a]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 20%, rgba(185, 28, 28, 0.09), transparent 70%), repeating-linear-gradient(45deg, #18110c 0px, #18110c 12px, #140e0a 12px, #140e0a 24px)',
      }}
    >
      {/* Header Bar */}
      <Header
        state={state}
        onOpenArchModal={() => setIsArchModalOpen(true)}
        onOpenCodexModal={() => setCurrentScreen('codex')}
        onToggleMode={() => dispatch({ type: 'TOGGLE_MODE' })}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onResetGame={() => dispatch({ type: 'RESET_GAME' })}
        onReturnToMenu={() => setCurrentScreen('menu')}
      />

      {/* Main 3-Column Layout */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-2.5 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Bingo Inspector (3 Cols) */}
        <section className="lg:col-span-3 flex flex-col gap-3 order-2 lg:order-1">
          <BingoInspectorScroll
            figure={inspectedFigure}
            state={state}
            onOpenWorkshop={() => setCurrentScreen('codex')}
          />
        </section>

        {/* Center Column: Chunin Arena & Command Bars (6 Cols) */}
        <section className="lg:col-span-6 flex flex-col gap-2.5 order-1 lg:order-2">
          <PlayerCommandBar
            player={2}
            state={state}
            onSelectUnit={handleSelectUnit}
            onActivateScroll={handleActivateScroll}
          />

          <ChuninArenaSVG
            state={state}
            onSelectUnit={handleSelectUnit}
            onSelectNode={handleSelectNode}
            onEndPostMove={() => dispatch({ type: 'END_TURN' })}
          />

          <PlayerCommandBar
            player={1}
            state={state}
            onSelectUnit={handleSelectUnit}
            onActivateScroll={handleActivateScroll}
          />
        </section>

        {/* Right Column: Laws & Chronicle Log (3 Cols) */}
        <section className="lg:col-span-3 flex flex-col gap-3 order-3">
          <BattleChronicleLog
            logs={state.logs}
            onPassTurn={() => dispatch({ type: 'END_TURN' })}
            canPassTurn={!(state.mode === 'ai' && state.turnPlayer === 2)}
          />
        </section>
      </main>

      {/* Battle Spinning Modal */}
      {state.phase === 'BATTLE' && state.currentBattle && (
        <ChakraDuelModal
          state={state}
          onRespin={() => {
            soundEngine.play('spin');
            dispatch({ type: 'RESPIN_BATTLE_WHEEL' });
          }}
          onConfirmResolution={() => {
            soundEngine.play('ko');
            dispatch({ type: 'RESOLVE_DUEL' });
          }}
        />
      )}

      {/* Victory Modal */}
      {state.phase === 'GAMEOVER' && state.winner && (
        <VictoryModal
          winner={state.winner}
          victoryReason={state.victoryReason}
          onReset={() => dispatch({ type: 'RESET_GAME' })}
          onReturnToMenu={() => setCurrentScreen('menu')}
        />
      )}

      {/* Clean Architecture Inspector Modal */}
      <CleanArchModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
        state={state}
      />
    </div>
  );
}
