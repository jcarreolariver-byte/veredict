// Generado automáticamente desde Supabase · 2026-06-25
// Para regenerar: usar Supabase MCP generate_typescript_types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      daily_limits: {
        Row: {
          date: string
          user_id: string
          votes_count: number
        }
        Insert: {
          date?: string
          user_id: string
          votes_count?: number
        }
        Update: {
          date?: string
          user_id?: string
          votes_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "daily_limits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dilemmas: {
        Row: {
          category: string
          context: string | null
          country_target: string | null
          created_at: string
          id: string
          option_a: string
          option_b: string
          published_at: string | null
          question: string
          scheduled_at: string | null
          status: string
          type: string
          updated_at: string
          votes_a: number
          votes_b: number
        }
        Insert: {
          category: string
          context?: string | null
          country_target?: string | null
          created_at?: string
          id?: string
          option_a: string
          option_b: string
          published_at?: string | null
          question: string
          scheduled_at?: string | null
          status?: string
          type: string
          updated_at?: string
          votes_a?: number
          votes_b?: number
        }
        Update: {
          category?: string
          context?: string | null
          country_target?: string | null
          created_at?: string
          id?: string
          option_a?: string
          option_b?: string
          published_at?: string | null
          question?: string
          scheduled_at?: string | null
          status?: string
          type?: string
          updated_at?: string
          votes_a?: number
          votes_b?: number
        }
        Relationships: []
      }
      justification_likes: {
        Row: {
          created_at: string
          justification_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          justification_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          justification_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "justification_likes_justification_id_fkey"
            columns: ["justification_id"]
            isOneToOne: false
            referencedRelation: "justifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "justification_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      justifications: {
        Row: {
          choice: string
          content: string
          created_at: string
          dilemma_id: string
          id: string
          is_flagged: boolean
          likes_count: number
          user_id: string
        }
        Insert: {
          choice: string
          content: string
          created_at?: string
          dilemma_id: string
          id?: string
          is_flagged?: boolean
          likes_count?: number
          user_id: string
        }
        Update: {
          choice?: string
          content?: string
          created_at?: string
          dilemma_id?: string
          id?: string
          is_flagged?: boolean
          likes_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "justifications_dilemma_id_fkey"
            columns: ["dilemma_id"]
            isOneToOne: false
            referencedRelation: "dilemmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "justifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_seed: string
          country_code: string | null
          created_at: string
          id: string
          last_active: string | null
          streak_days: number
          tier: string
          username: string | null
        }
        Insert: {
          avatar_seed: string
          country_code?: string | null
          created_at?: string
          id: string
          last_active?: string | null
          streak_days?: number
          tier?: string
          username?: string | null
        }
        Update: {
          avatar_seed?: string
          country_code?: string | null
          created_at?: string
          id?: string
          last_active?: string | null
          streak_days?: number
          tier?: string
          username?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          choice: string
          country_code: string | null
          created_at: string
          dilemma_id: string
          id: string
          user_id: string
        }
        Insert: {
          choice: string
          country_code?: string | null
          created_at?: string
          dilemma_id: string
          id?: string
          user_id: string
        }
        Update: {
          choice?: string
          country_code?: string | null
          created_at?: string
          dilemma_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_dilemma_id_fkey"
            columns: ["dilemma_id"]
            isOneToOne: false
            referencedRelation: "dilemmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      dilemma_results: {
        Row: {
          country_code: string | null
          dilemma_id: string | null
          pct_a: number | null
          total_votes: number | null
          votes_a: number | null
          votes_b: number | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_dilemma_id_fkey"
            columns: ["dilemma_id"]
            isOneToOne: false
            referencedRelation: "dilemmas"
            referencedColumns: ["id"]
          },
        ]
      }
      moral_profile: {
        Row: {
          chaos_score: number | null
          empathy_score: number | null
          honesty_score: number | null
          loyalty_score: number | null
          pragmatism_score: number | null
          total_votes: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
