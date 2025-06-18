import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          team_a_player_1: string
          team_a_player_2: string
          team_b_player_1: string
          team_b_player_2: string
          score_a: number
          score_b: number
          created_at: string
        }
        Insert: {
          id?: string
          team_a_player_1: string
          team_a_player_2: string
          team_b_player_1: string
          team_b_player_2: string
          score_a: number
          score_b: number
          created_at?: string
        }
        Update: {
          id?: string
          team_a_player_1?: string
          team_a_player_2?: string
          team_b_player_1?: string
          team_b_player_2?: string
          score_a?: number
          score_b?: number
          created_at?: string
        }
      }
    }
  }
}
