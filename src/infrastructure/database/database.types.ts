export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      arena_themes: {
        Row: {
          ambient_audio_track: string | null
          background_url: string
          created_at: string | null
          description: string | null
          grid_glow_color: string | null
          id: string
          is_unlocked_by_default: boolean | null
          key: string
          name: string
          particle_type: string | null
          unlock_cost_ryo: number | null
        }
        Insert: {
          ambient_audio_track?: string | null
          background_url: string
          created_at?: string | null
          description?: string | null
          grid_glow_color?: string | null
          id?: string
          is_unlocked_by_default?: boolean | null
          key: string
          name: string
          particle_type?: string | null
          unlock_cost_ryo?: number | null
        }
        Update: {
          ambient_audio_track?: string | null
          background_url?: string
          created_at?: string | null
          description?: string | null
          grid_glow_color?: string | null
          id?: string
          is_unlocked_by_default?: boolean | null
          key?: string
          name?: string
          particle_type?: string | null
          unlock_cost_ryo?: number | null
        }
        Relationships: []
      }
      attacks: {
        Row: {
          base_power: number | null
          color: string
          created_at: string | null
          description: string | null
          effect_type: string | null
          id: string
          jp_name: string | null
          key: string
          name: string
          stars: number | null
        }
        Insert: {
          base_power?: number | null
          color: string
          created_at?: string | null
          description?: string | null
          effect_type?: string | null
          id?: string
          jp_name?: string | null
          key: string
          name: string
          stars?: number | null
        }
        Update: {
          base_power?: number | null
          color?: string
          created_at?: string | null
          description?: string | null
          effect_type?: string | null
          id?: string
          jp_name?: string | null
          key?: string
          name?: string
          stars?: number | null
        }
        Relationships: []
      }
      deck_figures: {
        Row: {
          deck_id: string
          slot_position: number
          user_figure_id: string
        }
        Insert: {
          deck_id: string
          slot_position: number
          user_figure_id: string
        }
        Update: {
          deck_id?: string
          slot_position?: number
          user_figure_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deck_figures_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deck_figures_user_figure_id_fkey"
            columns: ["user_figure_id"]
            isOneToOne: false
            referencedRelation: "user_figures"
            referencedColumns: ["id"]
          },
        ]
      }
      decks: {
        Row: {
          deck_name: string | null
          deck_number: number
          id: string
          is_active: boolean | null
          user_id: string
        }
        Insert: {
          deck_name?: string | null
          deck_number: number
          id?: string
          is_active?: boolean | null
          user_id: string
        }
        Update: {
          deck_name?: string | null
          deck_number?: number
          id?: string
          is_active?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      figure_attacks: {
        Row: {
          attack_id: string
          base_size: number
          custom_effect: string | null
          custom_power: number | null
          custom_stars: number | null
          figure_id: string
          id: string
          slot_index: number
        }
        Insert: {
          attack_id: string
          base_size: number
          custom_effect?: string | null
          custom_power?: number | null
          custom_stars?: number | null
          figure_id: string
          id?: string
          slot_index: number
        }
        Update: {
          attack_id?: string
          base_size?: number
          custom_effect?: string | null
          custom_power?: number | null
          custom_stars?: number | null
          figure_id?: string
          id?: string
          slot_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "figure_attacks_attack_id_fkey"
            columns: ["attack_id"]
            isOneToOne: false
            referencedRelation: "attacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "figure_attacks_figure_id_fkey"
            columns: ["figure_id"]
            isOneToOne: false
            referencedRelation: "shinobi_figures"
            referencedColumns: ["id"]
          },
        ]
      }
      gacha_banners: {
        Row: {
          accent_color: string | null
          badge_bg: string | null
          banner_image_url: string | null
          cost_gems: number
          cost_multi: number
          cost_single: number
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          jp_title: string | null
          key: string
          pity_threshold: number | null
          pool_figure_ids: string[]
          rate_up_figure_ids: string[]
          rates: Json
          subtitle: string | null
          title: string
        }
        Insert: {
          accent_color?: string | null
          badge_bg?: string | null
          banner_image_url?: string | null
          cost_gems?: number
          cost_multi?: number
          cost_single?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          jp_title?: string | null
          key: string
          pity_threshold?: number | null
          pool_figure_ids?: string[]
          rate_up_figure_ids?: string[]
          rates?: Json
          subtitle?: string | null
          title: string
        }
        Update: {
          accent_color?: string | null
          badge_bg?: string | null
          banner_image_url?: string | null
          cost_gems?: number
          cost_multi?: number
          cost_single?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          jp_title?: string | null
          key?: string
          pity_threshold?: number | null
          pool_figure_ids?: string[]
          rate_up_figure_ids?: string[]
          rates?: Json
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      gacha_pulls: {
        Row: {
          banner_id: string
          figure_id: string
          id: string
          is_pity_trigger: boolean | null
          pulled_at: string | null
          pulled_rarity: string
          user_id: string
        }
        Insert: {
          banner_id: string
          figure_id: string
          id?: string
          is_pity_trigger?: boolean | null
          pulled_at?: string | null
          pulled_rarity: string
          user_id: string
        }
        Update: {
          banner_id?: string
          figure_id?: string
          id?: string
          is_pity_trigger?: boolean | null
          pulled_at?: string | null
          pulled_rarity?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gacha_pulls_banner_id_fkey"
            columns: ["banner_id"]
            isOneToOne: false
            referencedRelation: "gacha_banners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gacha_pulls_figure_id_fkey"
            columns: ["figure_id"]
            isOneToOne: false
            referencedRelation: "shinobi_figures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gacha_pulls_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_rooms: {
        Row: {
          board_theme: string
          created_at: string | null
          current_turn_player: number
          id: string
          player1_id: string | null
          player1_roster: Json | null
          player2_id: string | null
          player2_roster: Json | null
          room_code: string
          status: string
          updated_at: string | null
          winner_id: string | null
        }
        Insert: {
          board_theme?: string
          created_at?: string | null
          current_turn_player?: number
          id?: string
          player1_id?: string | null
          player1_roster?: Json | null
          player2_id?: string | null
          player2_roster?: Json | null
          room_code: string
          status?: string
          updated_at?: string | null
          winner_id?: string | null
        }
        Update: {
          board_theme?: string
          created_at?: string | null
          current_turn_player?: number
          id?: string
          player1_id?: string | null
          player1_roster?: Json | null
          player2_id?: string | null
          player2_roster?: Json | null
          room_code?: string
          status?: string
          updated_at?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_rooms_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_rooms_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_rooms_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          chakra_gems: number | null
          created_at: string | null
          dust_c: number | null
          dust_ex: number | null
          dust_r: number | null
          dust_uc: number | null
          dust_ux: number | null
          elo_rating: number | null
          id: string
          ninja_rank: string | null
          pity_count: number
          ryo_coins: number | null
          selected_arena_key: string | null
          selected_team_ids: string[]
          unlocked_figure_ids: string[]
          updated_at: string | null
          username: string
        }
        Insert: {
          chakra_gems?: number | null
          created_at?: string | null
          dust_c?: number | null
          dust_ex?: number | null
          dust_r?: number | null
          dust_uc?: number | null
          dust_ux?: number | null
          elo_rating?: number | null
          id: string
          ninja_rank?: string | null
          pity_count?: number
          ryo_coins?: number | null
          selected_arena_key?: string | null
          selected_team_ids?: string[]
          unlocked_figure_ids?: string[]
          updated_at?: string | null
          username: string
        }
        Update: {
          chakra_gems?: number | null
          created_at?: string | null
          dust_c?: number | null
          dust_ex?: number | null
          dust_r?: number | null
          dust_uc?: number | null
          dust_ux?: number | null
          elo_rating?: number | null
          id?: string
          ninja_rank?: string | null
          pity_count?: number
          ryo_coins?: number | null
          selected_arena_key?: string | null
          selected_team_ids?: string[]
          unlocked_figure_ids?: string[]
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      shinobi_figures: {
        Row: {
          ability_desc: string | null
          ability_title: string | null
          archetype: string | null
          can_pass_through: boolean | null
          character_id: string | null
          created_at: string | null
          id: string
          immune_to_surround: boolean | null
          is_starter: boolean | null
          jp_name: string | null
          key: string
          mp: number
          name: string
          portrait_url: string
          rarity: string
          short_name: string
        }
        Insert: {
          ability_desc?: string | null
          ability_title?: string | null
          archetype?: string | null
          can_pass_through?: boolean | null
          character_id?: string | null
          created_at?: string | null
          id?: string
          immune_to_surround?: boolean | null
          is_starter?: boolean | null
          jp_name?: string | null
          key: string
          mp: number
          name: string
          portrait_url: string
          rarity: string
          short_name: string
        }
        Update: {
          ability_desc?: string | null
          ability_title?: string | null
          archetype?: string | null
          can_pass_through?: boolean | null
          character_id?: string | null
          created_at?: string | null
          id?: string
          immune_to_surround?: boolean | null
          is_starter?: boolean | null
          jp_name?: string | null
          key?: string
          mp?: number
          name?: string
          portrait_url?: string
          rarity?: string
          short_name?: string
        }
        Relationships: []
      }
      user_arenas: {
        Row: {
          arena_id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          arena_id: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          arena_id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_arenas_arena_id_fkey"
            columns: ["arena_id"]
            isOneToOne: false
            referencedRelation: "arena_themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_arenas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_figures: {
        Row: {
          acquired_at: string | null
          clv: number | null
          clv_target_slot: number | null
          duplicate_count: number | null
          figure_id: string
          figure_key: string | null
          id: string
          is_favorite: boolean | null
          level: number | null
          lv_target_slot: number | null
          user_id: string
        }
        Insert: {
          acquired_at?: string | null
          clv?: number | null
          clv_target_slot?: number | null
          duplicate_count?: number | null
          figure_id: string
          figure_key?: string | null
          id?: string
          is_favorite?: boolean | null
          level?: number | null
          lv_target_slot?: number | null
          user_id: string
        }
        Update: {
          acquired_at?: string | null
          clv?: number | null
          clv_target_slot?: number | null
          duplicate_count?: number | null
          figure_id?: string
          figure_key?: string | null
          id?: string
          is_favorite?: boolean | null
          level?: number | null
          lv_target_slot?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_figures_figure_id_fkey"
            columns: ["figure_id"]
            isOneToOne: false
            referencedRelation: "shinobi_figures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_figures_figure_key_fkey"
            columns: ["figure_key"]
            isOneToOne: false
            referencedRelation: "shinobi_figures"
            referencedColumns: ["key"]
          },
          {
            foreignKeyName: "user_figures_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
