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
      issues: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          description: string
          category: string
          status: 'Pending' | 'In Progress' | 'Resolved'
          image_url: string | null
          location: Json | null
          latitude: number | null
          longitude: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          description: string
          category: string
          status?: 'Pending' | 'In Progress' | 'Resolved'
          image_url?: string | null
          location?: Json | null
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          description?: string
          category?: string
          status?: 'Pending' | 'In Progress' | 'Resolved'
          image_url?: string | null
          location?: Json | null
          latitude?: number | null
          longitude?: number | null
        }
      }
      comments: {
        Row: {
          id: string
          created_at: string
          issue_id: string
          user_id: string
          content: string
        }
        Insert: {
          id?: string
          created_at?: string
          issue_id: string
          user_id: string
          content: string
        }
        Update: {
          id?: string
          created_at?: string
          issue_id?: string
          user_id?: string
          content?: string
        }
      }
    }
  }
}

export type Issue = Database['public']['Tables']['issues']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
