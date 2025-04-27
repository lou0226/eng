export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      words: {
        Row: {
          id: string
          user_id: string
          term: string
          definition: string
          phonetic: string | null
          tags: string[]
          created_at: string
          last_reviewed: string | null
          review_count: number
          mastery: number
        }
        Insert: {
          id?: string
          user_id: string
          term: string
          definition: string
          phonetic?: string | null
          tags?: string[]
          created_at?: string
          last_reviewed?: string | null
          review_count?: number
          mastery?: number
        }
        Update: {
          id?: string
          user_id?: string
          term?: string
          definition?: string
          phonetic?: string | null
          tags?: string[]
          created_at?: string
          last_reviewed?: string | null
          review_count?: number
          mastery?: number
        }
      }
    }
  }
}