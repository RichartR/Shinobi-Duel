import { supabase } from '../database/supabaseClient';
import { 
  PvPPlayerRosterPayload, 
  PvPBroadcastEvent, 
  PvPRoomSession 
} from '../../domain/models/PvPNetworkPayloads';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface PvPServiceCallbacks {
  onRemoteEvent: (event: PvPBroadcastEvent) => void;
  onOpponentConnected: (payload: { opponentUsername: string; opponentRank: string; opponentElo: number; roster: PvPPlayerRosterPayload }) => void;
  onOpponentDisconnected: () => void;
  onError: (errorMsg: string) => void;
}

export class SupabasePvPService {
  private activeChannel: RealtimeChannel | null = null;
  private currentSession: PvPRoomSession | null = null;

  public getSession(): PvPRoomSession | null {
    return this.currentSession;
  }

  /**
   * Generates a clean, readable 6-character room code (e.g. "KONO42")
   */
  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Host creates a room (Player 1)
   */
  public async createRoom(
    hostRoster: PvPPlayerRosterPayload,
    callbacks: PvPServiceCallbacks
  ): Promise<{ success: boolean; session?: PvPRoomSession; error?: string }> {
    try {
      this.leaveRoom();

      const roomCode = this.generateRoomCode();
      const { data, error } = await supabase
        .from('game_rooms' as any)
        .insert({
          room_code: roomCode,
          player1_roster: hostRoster as any,
          board_theme: hostRoster.selectedArenaKey || 'konoha_chunin',
          status: 'waiting',
          current_turn_player: 1,
        })
        .select('id')
        .single();

      if (error || !data) {
        return { success: false, error: error?.message || 'Error al crear la sala en Supabase' };
      }

      const createdRoom = data as any;
      this.currentSession = {
        roomId: createdRoom.id,
        roomCode,
        isHost: true,
        localPlayerNumber: 1,
        opponentUsername: 'Esperando rival...',
        opponentRank: 'Genin',
        opponentElo: 1200,
        selectedArenaKey: hostRoster.selectedArenaKey,
      };

      this.connectChannel(roomCode, hostRoster, callbacks);
      return { success: true, session: this.currentSession };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Error inesperado de red' };
    }
  }

  /**
   * Guest joins an existing room (Player 2)
   */
  public async joinRoom(
    roomCodeInput: string,
    guestRoster: PvPPlayerRosterPayload,
    callbacks: PvPServiceCallbacks
  ): Promise<{ success: boolean; session?: PvPRoomSession; hostRoster?: PvPPlayerRosterPayload; error?: string }> {
    try {
      this.leaveRoom();

      const roomCode = roomCodeInput.trim().toUpperCase();
      const { data: room, error: findError } = await supabase
        .from('game_rooms' as any)
        .select('*')
        .eq('room_code', roomCode)
        .eq('status', 'waiting')
        .single();

      if (findError || !room) {
        return { success: false, error: 'Código de sala no encontrado o la partida ya ha comenzado' };
      }

      const roomRecord = room as any;
      const hostRoster = roomRecord.player1_roster as unknown as PvPPlayerRosterPayload;

      // Update room status to in_progress
      const { error: updateError } = await supabase
        .from('game_rooms' as any)
        .update({
          player2_roster: guestRoster as any,
          status: 'in_progress',
        })
        .eq('id', roomRecord.id);

      if (updateError) {
        return { success: false, error: 'No se pudo unir a la sala: ' + updateError.message };
      }

      this.currentSession = {
        roomId: roomRecord.id,
        roomCode,
        isHost: false,
        localPlayerNumber: 2,
        opponentUsername: hostRoster?.username || 'Anfitrión Ninja',
        opponentRank: hostRoster?.ninjaRank || 'Genin',
        opponentElo: hostRoster?.eloRating || 1200,
        selectedArenaKey: roomRecord.board_theme || 'konoha_chunin',
      };

      this.connectChannel(roomCode, guestRoster, callbacks);

      // Notify guest about host info
      if (hostRoster) {
        callbacks.onOpponentConnected({
          opponentUsername: hostRoster.username,
          opponentRank: hostRoster.ninjaRank,
          opponentElo: hostRoster.eloRating,
          roster: hostRoster,
        });
      }

      return { success: true, session: this.currentSession, hostRoster };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Error inesperado al unirse' };
    }
  }

  private eventListeners: Array<(event: PvPBroadcastEvent) => void> = [];

  public onEvent(listener: (event: PvPBroadcastEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter(l => l !== listener);
    };
  }

  /**
   * Connects to Supabase Realtime Broadcast Channel (Memory only, 0 database writes)
   */
  private connectChannel(
    roomCode: string,
    localRoster: PvPPlayerRosterPayload,
    callbacks: PvPServiceCallbacks
  ): void {
    const channelName = `pvp_room:${roomCode}`;
    this.activeChannel = supabase.channel(channelName, {
      config: {
        broadcast: { ack: false, self: false },
        presence: { key: localRoster.playerId || localRoster.username },
      },
    });

    // 1. Listen for broadcast game actions
    this.activeChannel.on(
      'broadcast',
      { event: 'pvp_action' },
      ({ payload }: { payload: PvPBroadcastEvent }) => {
        if (!payload) return;

        if (payload.type === 'PLAYER_READY' && this.currentSession) {
          callbacks.onOpponentConnected({
            opponentUsername: payload.payload.roster.username,
            opponentRank: payload.payload.roster.ninjaRank,
            opponentElo: payload.payload.roster.eloRating,
            roster: payload.payload.roster,
          });
        }

        callbacks.onRemoteEvent(payload);
        this.eventListeners.forEach(listener => listener(payload));
      }
    );

    // 2. Track peer presence (Connection / Disconnection)
    this.activeChannel
      .on('presence', { event: 'leave' }, () => {
        callbacks.onOpponentDisconnected();
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && this.currentSession) {
          await this.activeChannel?.track({
            username: localRoster.username,
            onlineAt: new Date().toISOString(),
          });

          // Broadcast readiness to the peer
          this.broadcastEvent({
            type: 'PLAYER_READY',
            payload: {
              playerNumber: this.currentSession.localPlayerNumber,
              roster: localRoster,
            },
          });
        }
      });
  }

  /**
   * Broadcast game action (Ultra-low latency, in-memory WebSocket)
   */
  public broadcastEvent(event: PvPBroadcastEvent): void {
    if (!this.activeChannel) return;
    this.activeChannel.send({
      type: 'broadcast',
      event: 'pvp_action',
      payload: event,
    });
  }

  /**
   * Records match outcome at the end (Only 1 database write at game conclusion)
   */
  public async finishMatch(
    winnerPlayerNumber: 1 | 2,
    reason: string
  ): Promise<void> {
    if (!this.currentSession) return;
    try {
      await supabase
        .from('game_rooms' as any)
        .update({
          status: 'finished',
        })
        .eq('id', this.currentSession.roomId);

      this.broadcastEvent({
        type: 'MATCH_FINISHED',
        payload: {
          winnerPlayerNumber,
          reason: reason as any,
        },
      });
    } catch (e) {
      console.warn('Could not update match completion in Supabase:', e);
    }
  }

  /**
   * Cleans up channel connection
   */
  public leaveRoom(): void {
    if (this.activeChannel) {
      supabase.removeChannel(this.activeChannel);
      this.activeChannel = null;
    }
    this.currentSession = null;
  }
}

export const supabasePvPService = new SupabasePvPService();
