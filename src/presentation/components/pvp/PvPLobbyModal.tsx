import React, { useState, useRef, useEffect } from 'react';
import { X, Copy, Check, Swords, Users, ShieldAlert, ArrowRight, Loader2, Sparkles, LogOut } from 'lucide-react';
import { soundEngine } from '../../../infrastructure/audio/ShinobiAudioEngine';
import { supabasePvPService } from '../../../infrastructure/services/SupabasePvPService';
import { PvPPlayerRosterPayload, PvPRoomSession } from '../../../domain/models/PvPNetworkPayloads';
import { UserShinobiProfile } from '../../../infrastructure/repositories/SupabaseShinobiRepository';
import { FigureCustomization } from '../../../domain/models/ShinobiFigure';
import { SHINOBI_FIGURES_CATALOG } from '../../../domain/catalogs/ShinobiCatalog';
import { CHAR_SVG_FALLBACKS } from '../../../infrastructure/assets/animeAssets';

interface PvPLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserShinobiProfile;
  customizations: Record<string, FigureCustomization>;
  onStartMatch: (params: {
    session: PvPRoomSession;
    opponentRoster: PvPPlayerRosterPayload;
  }) => void;
}

export const PvPLobbyModal: React.FC<PvPLobbyModalProps> = ({
  isOpen,
  onClose,
  profile,
  customizations,
  onStartMatch,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [joinCode, setJoinCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [createdRoomCode, setCreatedRoomCode] = useState<string | null>(null);
  const [createdSession, setCreatedSession] = useState<PvPRoomSession | null>(null);
  const [opponentRoster, setOpponentRoster] = useState<PvPPlayerRosterPayload | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sessionRef = useRef<PvPRoomSession | null>(null);
  const opponentRosterRef = useRef<PvPPlayerRosterPayload | null>(null);

  useEffect(() => {
    sessionRef.current = createdSession;
  }, [createdSession]);

  useEffect(() => {
    opponentRosterRef.current = opponentRoster;
  }, [opponentRoster]);

  if (!isOpen) return null;

  const buildLocalRosterPayload = (): PvPPlayerRosterPayload => {
    const selectedKeys = profile.selectedTeamKeys && profile.selectedTeamKeys.length > 0
      ? profile.selectedTeamKeys
      : ['naruto_genin', 'sasuke_genin', 'sakura_genin'];

    return {
      playerId: profile.id,
      username: profile.username || 'Shinobi Local',
      ninjaRank: profile.ninjaRank || 'Genin',
      eloRating: profile.eloRating || 1200,
      selectedArenaKey: profile.selectedArenaKey || 'konoha_chunin',
      figures: selectedKeys.map(key => {
        const custom = customizations[key] || { level: 1, clv: 0, lvTargetIndex: 0, clvTargetIndex: 0 };
        return {
          figureId: key,
          level: custom.level || 1,
          clv: custom.clv || 0,
          lvTargetIndex: custom.lvTargetIndex || 0,
          clvTargetIndex: custom.clvTargetIndex || 0,
        };
      }),
      plateKeys: ['goal_block', 'max_revive', 'double_chance', 'x_attack'],
    };
  };

  const handleCreateRoom = async () => {
    soundEngine.play('select');
    setIsConnecting(true);
    setErrorMessage(null);

    const roster = buildLocalRosterPayload();
    const result = await supabasePvPService.createRoom(roster, {
      onRemoteEvent: (event) => {
        if (event.type === 'GAME_START') {
          const currentOpponent = opponentRosterRef.current;
          const currentSession = sessionRef.current || result.session;
          if (currentOpponent && currentSession) {
            onStartMatch({ session: currentSession, opponentRoster: currentOpponent });
          }
        }
      },
      onOpponentConnected: (data) => {
        soundEngine.play('win');
        opponentRosterRef.current = data.roster;
        setOpponentRoster(data.roster);
      },
      onOpponentDisconnected: () => {
        soundEngine.play('ko');
        opponentRosterRef.current = null;
        setOpponentRoster(null);
        setErrorMessage('El rival se ha desconectado de la sala.');
      },
      onError: (msg) => {
        soundEngine.play('ko');
        setErrorMessage(msg);
      },
    });

    setIsConnecting(false);

    if (result.success && result.session) {
      sessionRef.current = result.session;
      setCreatedSession(result.session);
      setCreatedRoomCode(result.session.roomCode);
    } else {
      setErrorMessage(result.error || 'No se pudo crear la sala online.');
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode || joinCode.length < 4) {
      setErrorMessage('Introduce un código de sala válido.');
      return;
    }

    soundEngine.play('select');
    setIsConnecting(true);
    setErrorMessage(null);

    const roster = buildLocalRosterPayload();
    const result = await supabasePvPService.joinRoom(joinCode, roster, {
      onRemoteEvent: (event) => {
        if (event.type === 'GAME_START') {
          const currentOpponent = opponentRosterRef.current || result.hostRoster;
          const currentSession = sessionRef.current || result.session;
          if (currentOpponent && currentSession) {
            onStartMatch({ session: currentSession, opponentRoster: currentOpponent });
          }
        }
      },
      onOpponentConnected: (data) => {
        soundEngine.play('win');
        opponentRosterRef.current = data.roster;
        setOpponentRoster(data.roster);
      },
      onOpponentDisconnected: () => {
        soundEngine.play('ko');
        opponentRosterRef.current = null;
        setOpponentRoster(null);
        setErrorMessage('El anfitrión ha cerrado la sala.');
      },
      onError: (msg) => {
        soundEngine.play('ko');
        setErrorMessage(msg);
      },
    });

    setIsConnecting(false);

    if (result.success && result.session) {
      sessionRef.current = result.session;
      setCreatedSession(result.session);
      if (result.hostRoster) {
        opponentRosterRef.current = result.hostRoster;
        setOpponentRoster(result.hostRoster);
      }
    } else {
      setErrorMessage(result.error || 'No se pudo conectar a la sala.');
    }
  };

  const handleCancelRoom = () => {
    soundEngine.play('select');
    supabasePvPService.leaveRoom();
    sessionRef.current = null;
    opponentRosterRef.current = null;
    setCreatedSession(null);
    setCreatedRoomCode(null);
    setOpponentRoster(null);
    setErrorMessage(null);
  };

  const handleCopyCode = () => {
    if (!createdRoomCode) return;
    navigator.clipboard.writeText(createdRoomCode);
    setCopiedCode(true);
    soundEngine.play('select');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleStartHostMatch = () => {
    if (!createdSession || !opponentRoster) return;
    soundEngine.play('jutsu');

    // Notify guest that the battle has started
    supabasePvPService.broadcastEvent({
      type: 'GAME_START',
      payload: {
        initialTurnPlayer: 1,
        timestamp: Date.now(),
      },
    });

    onStartMatch({ session: createdSession, opponentRoster });
  };

  const handleClose = () => {
    soundEngine.play('select');
    supabasePvPService.leaveRoom();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white border-4 border-black shadow-[8px_8px_0px_#000] p-4 sm:p-6 text-stone-900 max-h-[95vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pvp-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#FA9427] border-2 border-black shadow-[2px_2px_0px_#000]">
              <Swords className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 id="pvp-modal-title" className="text-lg sm:text-xl font-black uppercase tracking-tight">
                Duelo Táctico Online (PvP)
              </h2>
              <p className="text-xs text-stone-600 font-bold">
                Partida remota en tiempo real entre 2 ninjas (Coste 0€ • Broadcast en Memoria)
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center border-2 border-black hover:bg-stone-200 transition cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-red-800 text-red-900 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0px_#991b1b]">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-700" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mode Selector Tabs (only visible when not connected) */}
        {!createdSession && (
          <div className="flex border-b-2 border-black mb-5" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'create'}
              onClick={() => {
                soundEngine.play('select');
                setActiveTab('create');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 px-3 min-h-[44px] text-xs sm:text-sm font-black uppercase transition border-t-2 border-x-2 border-black flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-[#FA9427] text-black shadow-[2px_-2px_0px_#000]'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Users className="w-4 h-4" /> Crear Sala (Anfitrión)
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'join'}
              onClick={() => {
                soundEngine.play('select');
                setActiveTab('join');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2.5 px-3 min-h-[44px] text-xs sm:text-sm font-black uppercase transition border-t-2 border-x-2 border-black flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'join'
                  ? 'bg-[#FA9427] text-black shadow-[2px_-2px_0px_#000]'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <ArrowRight className="w-4 h-4" /> Unirse con Código
            </button>
          </div>
        )}

        {/* TAB 1: CREATE ROOM (Host Flow) */}
        {activeTab === 'create' && !createdSession && (
          <div className="space-y-4">
            <div className="p-3 bg-stone-50 border-2 border-black">
              <span className="text-xs font-black uppercase text-stone-700 block mb-1">
                Tu Equipo Shinobi Seleccionado
              </span>
              <div className="flex gap-2 overflow-x-auto py-1">
                {(profile.selectedTeamKeys || ['naruto_genin', 'sasuke_genin', 'sakura_genin']).map((key, idx) => {
                  const fig = SHINOBI_FIGURES_CATALOG.find(f => f.key === key);
                  const figName = fig ? fig.shortName : key;
                  const figRarity = fig ? fig.rarity : 'C';
                  return (
                    <div key={idx} className="shrink-0 bg-white border border-black p-1.5 flex flex-col items-center text-center shadow-[1px_1px_0px_#000]">
                      <img
                        src={fig?.portraitUrl || ''}
                        alt={figName}
                        className="w-10 h-10 object-cover object-top border border-black mb-1 bg-stone-100"
                        onError={(e) => {
                          e.currentTarget.src = CHAR_SVG_FALLBACKS[key] || '';
                        }}
                      />
                      <span className="text-[10px] font-black truncate max-w-[50px]">{figName}</span>
                      <span className="text-[9px] font-mono font-bold text-amber-600">[{figRarity}]</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={isConnecting}
              className="w-full min-h-[48px] manga-btn-orange py-3 px-4 border-3 border-black text-black font-black uppercase text-sm shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Creando Sala en Tiempo Real...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generar Sala Ninja Online
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 2: JOIN ROOM (Guest Flow) */}
        {activeTab === 'join' && !createdSession && (
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div>
              <label htmlFor="room-code-input" className="block text-xs font-black uppercase text-stone-700 mb-1">
                Introduce el Código de Sala (6 letras)
              </label>
              <input
                id="room-code-input"
                type="text"
                maxLength={6}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="EJ: KONO42"
                className="w-full text-center text-2xl font-mono font-black tracking-widest py-3 px-4 bg-stone-50 border-3 border-black shadow-[3px_3px_0px_#000] uppercase focus:outline-hidden focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isConnecting || joinCode.length < 4}
              className={`w-full min-h-[48px] py-3 px-4 border-3 border-black font-black uppercase text-sm transition flex items-center justify-center gap-2 ${
                joinCode.length >= 4 && !isConnecting
                  ? 'manga-btn-orange text-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] cursor-pointer active:scale-95'
                  : 'bg-stone-200 text-stone-400 border-stone-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Conectando al Anfitrión...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" /> Unirse a la Arena
                </>
              )}
            </button>
          </form>
        )}

        {/* CONNECTED / LOBBY ROOM VIEW */}
        {createdSession && (
          <div className="space-y-4">
            <div className="p-4 bg-stone-100 border-3 border-black text-center shadow-[3px_3px_0px_#000]">
              <span className="text-xs font-black uppercase text-stone-600 block mb-1">
                Código de la Sala
              </span>
              <div className="flex items-center justify-center gap-2 my-1">
                <span className="text-3xl font-mono font-black tracking-widest bg-white px-4 py-1.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                  {createdSession.roomCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-2 min-h-[44px] min-w-[44px] bg-black text-white hover:bg-stone-800 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] cursor-pointer transition active:scale-95"
                  title="Copiar código"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-stone-600 font-bold mt-2">
                Comparte este código con tu amigo ninja para que se una al combate.
              </p>
            </div>

            {/* Players Status Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Player 1 (Host - Blue) */}
              <div className="p-3 bg-sky-50 border-2 border-black shadow-[2px_2px_0px_#0284c7]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-xs font-black uppercase text-blue-900">
                    Jugador 1 (Azul / Anfitrión)
                  </span>
                </div>
                <div className="text-sm font-black truncate">
                  {createdSession.isHost ? profile.username : createdSession.opponentUsername}
                </div>
                <div className="text-[11px] text-stone-600 font-bold">
                  Rango: {createdSession.isHost ? profile.ninjaRank : createdSession.opponentRank}
                </div>
                <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black border border-black">
                  ✓ CONECTADO
                </span>
              </div>

              {/* Player 2 (Guest - Red) */}
              <div className="p-3 bg-amber-50 border-2 border-black shadow-[2px_2px_0px_#e11d48]">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${opponentRoster || !createdSession.isHost ? 'bg-red-600 animate-pulse' : 'bg-stone-400'}`} />
                  <span className="text-xs font-black uppercase text-red-900">
                    Jugador 2 (Rojo / Rival)
                  </span>
                </div>
                <div className="text-sm font-black truncate">
                  {createdSession.isHost
                    ? (opponentRoster?.username || 'Esperando rival...')
                    : profile.username}
                </div>
                <div className="text-[11px] text-stone-600 font-bold">
                  Rango: {createdSession.isHost ? (opponentRoster?.ninjaRank || 'Genin') : profile.ninjaRank}
                </div>
                {opponentRoster || !createdSession.isHost ? (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black border border-black">
                    ✓ LISTO PARA EL DUELO
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-stone-500 font-bold">
                    <Loader2 className="w-3 h-3 animate-spin" /> Esperando conexión...
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {createdSession.isHost ? (
              <button
                onClick={handleStartHostMatch}
                disabled={!opponentRoster}
                className={`w-full min-h-[48px] py-3 px-4 border-3 border-black font-black uppercase text-sm transition flex items-center justify-center gap-2 ${
                  opponentRoster
                    ? 'manga-btn-orange text-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] cursor-pointer active:scale-95'
                    : 'bg-stone-200 text-stone-400 border-stone-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Swords className="w-5 h-5" />
                {opponentRoster ? '¡Iniciar Batalla Online!' : 'Esperando a que se una el Jugador 2...'}
              </button>
            ) : (
              <div className="p-3 bg-stone-100 border-2 border-black text-center text-xs font-bold text-stone-700">
                <div className="flex items-center justify-center gap-2 text-stone-900 font-black mb-1">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                  Conectado con éxito a la sala
                </div>
                El anfitrión iniciará el combate en cuanto esté listo.
              </div>
            )}

            <button
              type="button"
              onClick={handleCancelRoom}
              className="w-full min-h-[44px] py-2 px-4 border-2 border-stone-400 hover:border-black bg-white hover:bg-stone-100 text-stone-700 hover:text-black text-xs font-black uppercase transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Cancelar y Volver a Opciones
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
