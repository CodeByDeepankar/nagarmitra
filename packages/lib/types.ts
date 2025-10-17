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
          status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected'
          image_url: string | null
          audio_url: string | null
          location: Json | null
          latitude: number | null
          longitude: number | null
          priority: 'low' | 'medium' | 'high'
          complaint_count: number
          sanctioned_amount: number | null
          used_amount: number | null
          amount_breakdown: Json | null
          estimated_start_date: string | null
          estimated_completion_date: string | null
          actual_completion_date: string | null
          assigned_to: string | null
          department: string | null
          rejection_reason: string | null
          progress_notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          description: string
          category: string
          status?: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected'
          image_url?: string | null
          audio_url?: string | null
          location?: Json | null
          latitude?: number | null
          longitude?: number | null
          priority?: 'low' | 'medium' | 'high'
          complaint_count?: number
          sanctioned_amount?: number | null
          used_amount?: number | null
          amount_breakdown?: Json | null
          estimated_start_date?: string | null
          estimated_completion_date?: string | null
          actual_completion_date?: string | null
          assigned_to?: string | null
          department?: string | null
          rejection_reason?: string | null
          progress_notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          description?: string
          category?: string
          status?: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected'
          image_url?: string | null
          audio_url?: string | null
          location?: Json | null
          latitude?: number | null
          longitude?: number | null
          priority?: 'low' | 'medium' | 'high'
          complaint_count?: number
          sanctioned_amount?: number | null
          used_amount?: number | null
          amount_breakdown?: Json | null
          estimated_start_date?: string | null
          estimated_completion_date?: string | null
          actual_completion_date?: string | null
          assigned_to?: string | null
          department?: string | null
          rejection_reason?: string | null
          progress_notes?: string | null
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
