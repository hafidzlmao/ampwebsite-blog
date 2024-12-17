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
      posts: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string | null
          category: string
          tags: string[]
          featured: boolean
          pub_date: string
          updated_date: string
          author: Json
          reading_time: number | null
          created_at: string
          deleted: boolean
          deleted_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content?: string | null
          category: string
          tags?: string[]
          featured?: boolean
          pub_date?: string
          updated_date?: string
          author: Json
          reading_time?: number | null
          created_at?: string
          deleted?: boolean
          deleted_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          content?: string | null
          category?: string
          tags?: string[]
          featured?: boolean
          pub_date?: string
          updated_date?: string
          author?: Json
          reading_time?: number | null
          created_at?: string
          deleted?: boolean
          deleted_at?: string | null
        }
      }
    }
  }
} 