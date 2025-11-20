export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      players: {
        Row: {
          id: number
          user_id: string
          name: string
          avatar: string | null
          rank: string
          sect_rank: string
          level: number
          qi: number
          max_qi: number
          spirit_root: string
          mind_state: string
          inner_demon: number
          contribution: number
          spirit_stones: number
          cave_level: number
          inventory: Json
          equipped: Json
          materials: Json
          history: Json
          created_at: string
          last_login_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          name: string
          avatar?: string | null
          rank?: string
          sect_rank?: string
          level?: number
          qi?: number
          max_qi?: number
          spirit_root?: string
          mind_state?: string
          inner_demon?: number
          contribution?: number
          spirit_stones?: number
          cave_level?: number
          inventory?: Json
          equipped?: Json
          materials?: Json
          history?: Json
          created_at?: string
          last_login_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          name?: string
          avatar?: string | null
          rank?: string
          sect_rank?: string
          level?: number
          qi?: number
          max_qi?: number
          spirit_root?: string
          mind_state?: string
          inner_demon?: number
          contribution?: number
          spirit_stones?: number
          cave_level?: number
          inventory?: Json
          equipped?: Json
          materials?: Json
          history?: Json
          created_at?: string
          last_login_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      sects: {
        Row: {
          id: string
          name: string
          description: string
          level: number
          reputation: number
          leader_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          level?: number
          reputation?: number
          leader_id: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          level?: number
          reputation?: number
          leader_id?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      sect_members: {
        Row: {
          id: string
          player_id: number
          sect_id: string
          rank: string
          joined_at: string
        }
        Insert: {
          id?: string
          player_id: number
          sect_id: string
          rank?: string
          joined_at?: string
        }
        Update: {
          id?: string
          player_id?: number
          sect_id?: string
          rank?: string
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sect_members_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sect_members_sect_id_fkey"
            columns: ["sect_id"]
            isOneToOne: false
            referencedRelation: "sects"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          player_id: number
          title: string
          description: string
          type: string
          difficulty: string
          category: string
          reward_qi: number
          reward_contribution: number
          reward_stones: number
          duration: number
          status: string
          url: string | null
          quiz: Json | null
          enemy: Json | null
          created_at: string
          started_at: string | null
          completed_at: string | null
          accepted_at: string | null
        }
        Insert: {
          id?: string
          player_id: number
          title: string
          description: string
          type: string
          difficulty?: string
          category?: string
          reward_qi: number
          reward_contribution: number
          reward_stones: number
          duration: number
          status?: string
          url?: string | null
          quiz?: Json | null
          enemy?: Json | null
          created_at?: string
          started_at?: string | null
          completed_at?: string | null
          accepted_at?: string | null
        }
        Update: {
          id?: string
          player_id?: number
          title?: string
          description?: string
          type?: string
          difficulty?: string
          category?: string
          reward_qi?: number
          reward_contribution?: number
          reward_stones?: number
          duration?: number
          status?: string
          url?: string | null
          quiz?: Json | null
          enemy?: Json | null
          created_at?: string
          started_at?: string | null
          completed_at?: string | null
          accepted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
      seasons: {
        Row: {
          id: string
          name: string
          start_date: string
          end_date: string
          is_active: boolean
        }
        Insert: {
          id: string
          name: string
          start_date: string
          end_date: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          id: string
          player_id: number
          season_id: string
          player_name: string
          player_avatar: string | null
          rank: string
          level: number
          realm_score: number
          power_score: number
          wealth_score: number
          contribution_score: number
          updated_at: string
        }
        Insert: {
          id?: string
          player_id: number
          season_id: string
          player_name: string
          player_avatar?: string | null
          rank: string
          level: number
          realm_score?: number
          power_score?: number
          wealth_score?: number
          contribution_score?: number
          updated_at?: string
        }
        Update: {
          id?: string
          player_id?: number
          season_id?: string
          player_name?: string
          player_avatar?: string | null
          rank?: string
          level?: number
          realm_score?: number
          power_score?: number
          wealth_score?: number
          contribution_score?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          }
        ]
      }
      event_logs: {
        Row: {
          id: string
          player_id: number
          event_id: string
          event_type: string
          title: string
          description: string
          choice_id: string | null
          choice_text: string | null
          result: Json
          created_at: string
        }
        Insert: {
          id?: string
          player_id: number
          event_id: string
          event_type: string
          title: string
          description: string
          choice_id?: string | null
          choice_text?: string | null
          result: Json
          created_at?: string
        }
        Update: {
          id?: string
          player_id?: number
          event_id?: string
          event_type?: string
          title?: string
          description?: string
          choice_id?: string | null
          choice_text?: string | null
          result?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_logs_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
      player_status_effects: {
        Row: {
          id: string
          player_id: number
          effect_id: string
          name: string
          description: string
          modifiers: Json
          started_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          player_id: number
          effect_id: string
          name: string
          description: string
          modifiers: Json
          started_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          player_id?: number
          effect_id?: string
          name?: string
          description?: string
          modifiers?: Json
          started_at?: string
          expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_status_effects_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      complete_task: {
        Args: {
          p_task_id: string
          p_player_id: number
          p_reward_qi: number
          p_reward_contribution: number
          p_reward_stones: number
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

// 导出常用类型
export type Player = Tables<'players'>
export type Task = Tables<'tasks'>
export type Season = Tables<'seasons'>
export type LeaderboardEntry = Tables<'leaderboard'>
export type Rank = string
export type TaskType = string
export type TaskStatus = string
export type TaskDifficulty = string
export type TaskCategory = string