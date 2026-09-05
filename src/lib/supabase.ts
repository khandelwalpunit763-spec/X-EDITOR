import { createClient } from '@supabase/supabase-js'

// Supabase credentials - .env se ayega
// Agar .env nahi hai toh mock mode me chalega (dev ke liye)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase not configured! Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env\n' +
    'Mock mode enabled - auth will be simulated locally.'
  )
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: { eventsPerSecond: 10 }
      }
    })
  : null as any

// Helper to check if we can use supabase
export const canUseSupabase = () => isSupabaseConfigured && supabase !== null

// Types for DB tables
export interface DbProject {
  id: string
  user_id: string
  name: string
  type: 'photo' | 'video'
  width: number
  height: number
  fps: number
  aspect_ratio: string
  background: any
  data: any // layers + tracks + timeline state
  thumbnail?: string
  created_at: string
  updated_at: string
}

export interface DbTemplate {
  id: string
  user_id: string
  title: string
  category: string
  preview_image: string
  width: number
  height: number
  type: 'photo' | 'video'
  tags: string[]
  is_public: boolean
  likes: number
  downloads: number
  created_at: string
}

export interface DbProfile {
  id: string
  email: string
  full_name: string
  avatar_url: string
  created_at: string
}
