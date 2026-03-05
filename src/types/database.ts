export interface Database {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    Tables: {
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          points_per_completion: number
          requires_photo: boolean
          requires_approval: boolean
          frequency_target: 'none' | 'daily' | 'custom'
          frequency_count: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          points_per_completion: number
          requires_photo?: boolean
          requires_approval?: boolean
          frequency_target?: 'none' | 'daily' | 'custom'
          frequency_count?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          points_per_completion?: number
          requires_photo?: boolean
          requires_approval?: boolean
          frequency_target?: 'none' | 'daily' | 'custom'
          frequency_count?: number | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      action_logs: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          logged_at: string
          photo_url: string | null
          note: string | null
          status: 'pending_approval' | 'approved' | 'self_approved'
          points_awarded: number
          approved_by: string | null
          approved_at: string | null
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          logged_at?: string
          photo_url?: string | null
          note?: string | null
          status?: 'pending_approval' | 'approved' | 'self_approved'
          points_awarded?: number
          approved_by?: string | null
          approved_at?: string | null
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          logged_at?: string
          photo_url?: string | null
          note?: string | null
          status?: 'pending_approval' | 'approved' | 'self_approved'
          points_awarded?: number
          approved_by?: string | null
          approved_at?: string | null
        }
        Relationships: []
      }
      point_ledger: {
        Row: {
          id: string
          user_id: string
          delta: number
          reason: string
          reference_id: string
          reference_type: 'action_log' | 'redemption' | 'streak_bonus'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          delta: number
          reason: string
          reference_id: string
          reference_type: 'action_log' | 'redemption' | 'streak_bonus'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          delta?: number
          reason?: string
          reference_id?: string
          reference_type?: 'action_log' | 'redemption' | 'streak_bonus'
          created_at?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          id: string
          user_id: string
          title: string
          type: 'offline' | 'online'
          point_cost: number
          photo_url: string | null
          url: string | null
          description: string | null
          requires_approval: boolean
          status: 'available' | 'wishlist' | 'redeemed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type?: 'offline' | 'online'
          point_cost: number
          photo_url?: string | null
          url?: string | null
          description?: string | null
          requires_approval?: boolean
          status?: 'available' | 'wishlist' | 'redeemed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: 'offline' | 'online'
          point_cost?: number
          photo_url?: string | null
          url?: string | null
          description?: string | null
          requires_approval?: boolean
          status?: 'available' | 'wishlist' | 'redeemed'
          created_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'streak' | 'approval' | 'redemption' | 'wishlist'
          message: string
          timestamp: string
          read: boolean
        }
        Insert: {
          id?: string
          user_id: string
          type: 'streak' | 'approval' | 'redemption' | 'wishlist'
          message: string
          timestamp?: string
          read?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'streak' | 'approval' | 'redemption' | 'wishlist'
          message?: string
          timestamp?: string
          read?: boolean
        }
        Relationships: []
      }
    }
  }
}
