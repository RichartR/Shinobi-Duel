import React, { useState, useMemo, useCallback } from 'react';
import { useShinobiDuel } from './application/hooks/useShinobiDuel';
import { soundEngine } from './infrastructure/audio/ShinobiAudioEngine';
import { MainMenu } from './presentation/components/menu/MainMenu';
import { ShinobiRulesGuide } from './presentation/components/guide/ShinobiRulesGuide';
import { ShinobiCodex } from './presentation/components/codex/ShinobiCodex';
import { ShinobiGacha } from './presentation/components/gacha/ShinobiGacha';
import { ShinobiForge } from './presentation/components/forge/ShinobiForge';
import { ShinobiArenaSelector } from './presentation/components/arena/ShinobiArenaSelector';
import { shinobiDbRepository } from './infrastructure/repositories/SupabaseShinobiRepository';
import { CANONICAL_ARENA_THEMES } from './domain/models/CraftingEconomy';
import { DEFAULT_STARTER_FIGURE_KEYS } from './domain/models/ShinobiFigure';
import { Header } from './presentation/components/common/Header';
import { ChuninArenaSVG } from './presentation/components/board/ChuninArenaSVG';
import { PlayerCommandBar } from './presentation/components/scrolls/PlayerCommandBar';
import { BingoInspectorScroll } from './presentation/components/scrolls/BingoInspectorScroll';
import { BattleChronicleLog } from './presentation/components/scrolls/BattleChronicleLog';
import { ChakraDuelModal } from './presentation/components/combat/ChakraDuelModal';
import { VictoryModal } from './presentation/components/modals/VictoryModal';
import { NarutoMangaBackground } from './presentation/components/common/NarutoMangaBackground';

type AppScreen = 'menu' | 'game' | 'guide' | 'codex' | 'gacha' | 'forge' | 'arena-select';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('menu');
  const [profile, setProfile] = useState(() => shinobiDbRepository.getProfile());

  const activeArena = useMemo(
    () => CANONICAL_ARENA_THEMES.find(a => a.key === profile.selectedArenaKey) || CANONICAL_ARENA_THEMES[0],
    [profile.selectedArenaKey]
  );

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
    const freshProfile = shinobiDbRepository.getProfile();
    const currentKeys = freshProfile.selectedTeamKeys || DEFAULT_STARTER_FIGURE_KEYS;
    if (JSON.stringify(currentKeys) !== JSON.stringify(state.selectedTeamKeys)) {
      dispatch({
        type: 'UPDATE_DECK_LOADOUT',
        payload: {
          selectedTeamKeys: currentKeys,
          selectedPlateIds: state.selectedPlateIds,
        },
      });
    }
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
          onOpenGacha={() => {
            soundEngine.play('select');
            setCurrentScreen('gacha');
          }}
          onOpenForge={() => {
            soundEngine.play('select');
            setProfile(shinobiDbRepository.getProfile());
            setCurrentScreen('forge');
          }}
          onOpenArenaSelector={() => {
            soundEngine.play('select');
            setProfile(shinobiDbRepository.getProfile());
            setCurrentScreen('arena-select');
          }}
          isMuted={isMuted}
          onToggleMute={toggleMute}
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
          setProfile(shinobiDbRepository.getProfile());
          setCurrentScreen('menu');
        }}
        onPlayGame={() => {
          soundEngine.play('select');
          setCurrentScreen('game');
        }}
        onOpenForge={() => {
          soundEngine.play('select');
          setProfile(shinobiDbRepository.getProfile());
          setCurrentScreen('forge');
        }}
        onOpenGacha={() => {
          soundEngine.play('select');
          setProfile(shinobiDbRepository.getProfile());
          setCurrentScreen('gacha');
        }}
      />
    );
  }

  // Screen 4: Shinobi Gacha Summon (Kuchiyose no Jutsu)
  if (currentScreen === 'gacha') {
    return (
      <ShinobiGacha
        onBackToMenu={() => {
          soundEngine.play('select');
          const p = shinobiDbRepository.getProfile();
          setProfile(p);
          if (p.selectedTeamKeys) {
            dispatch({
              type: 'UPDATE_DECK_LOADOUT',
              payload: { selectedTeamKeys: p.selectedTeamKeys, selectedPlateIds: state.selectedPlateIds },
            });
          }
          setCurrentScreen('menu');
        }}
        onOpenCodex={() => {
          soundEngine.play('select');
          const p = shinobiDbRepository.getProfile();
          setProfile(p);
          if (p.selectedTeamKeys) {
            dispatch({
              type: 'UPDATE_DECK_LOADOUT',
              payload: { selectedTeamKeys: p.selectedTeamKeys, selectedPlateIds: state.selectedPlateIds },
            });
          }
          setCurrentScreen('codex');
        }}
        onOpenForge={() => {
          soundEngine.play('select');
          setProfile(shinobiDbRepository.getProfile());
          setCurrentScreen('forge');
        }}
      />
    );
  }

  // Screen 5: Shinobi Forge & Chakra Dust
  if (currentScreen === 'forge') {
    return (
      <ShinobiForge
        state={state}
        dispatch={dispatch}
        onBackToMenu={() => {
          soundEngine.play('select');
          setProfile(shinobiDbRepository.getProfile());
          setCurrentScreen('menu');
        }}
        onPlayGame={() => {
          soundEngine.play('select');
          setProfile(shinobiDbRepository.getProfile());
          setCurrentScreen('game');
        }}
        onOpenGacha={() => {
          soundEngine.play('select');
          setProfile(shinobiDbRepository.getProfile());
          setCurrentScreen('gacha');
        }}
      />
    );
  }

  // Screen 6: Arena Selector & Battlegrounds
  if (currentScreen === 'arena-select') {
    return (
      <ShinobiArenaSelector
        onBackToMenu={() => {
          soundEngine.play('select');
          setProfile(shinobiDbRepository.getProfile());
          setCurrentScreen('menu');
        }}
        onPlayGame={() => {
          soundEngine.play('select');
          setProfile(shinobiDbRepository.getProfile());
          setCurrentScreen('game');
        }}
        onArenaChanged={() => {
          setProfile(shinobiDbRepository.getProfile());
        }}
      />
    );
  }

  // Screen 7: Tactical Arena Game
  return (
    <div className="min-h-screen flex flex-col text-stone-900 select-none relative bg-transparent">
      <NarutoMangaBackground />
      {/* Header Bar */}
      <Header
        state={state}
        onOpenCodexModal={() => setCurrentScreen('codex')}
        onToggleMode={() => dispatch({ type: 'TOGGLE_MODE' })}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onResetGame={() => dispatch({ type: 'RESET_GAME' })}
        onReturnToMenu={() => setCurrentScreen('menu')}
      />

      {/* Main 3-Column Layout */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-2 md:p-3 grid grid-cols-1 lg:grid-cols-12 gap-2.5 md:gap-3 items-start">
        {/* Left Column: Bingo Inspector (3 Cols) */}
        <section className="lg:col-span-3 flex flex-col gap-2 order-2 lg:order-1">
          <BingoInspectorScroll
            figure={inspectedFigure}
            state={state}
            onOpenWorkshop={() => setCurrentScreen('codex')}
          />
        </section>

        {/* Center Column: Chunin Arena & Command Bars (6 Cols) */}
        <section className="lg:col-span-6 flex flex-col gap-2 order-1 lg:order-2">
          <PlayerCommandBar
            player={2}
            state={state}
            onSelectUnit={handleSelectUnit}
            onActivateScroll={handleActivateScroll}
          />

          <ChuninArenaSVG
            state={state}
            arenaTheme={activeArena}
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
        <section className="lg:col-span-3 flex flex-col gap-2 order-3">
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
    </div>
  );
}
