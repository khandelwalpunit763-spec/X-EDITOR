import { create } from 'zustand'
import { supabase, canUseSupabase, isSupabaseConfigured } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  isMockMode: boolean

  // Actions
  initialize: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string) => Promise<void>
  signOut: () => Promise<void>
  setMockUser: (email: string, name: string) => void
}

// Mock user for dev without Supabase
const createMockUser = (email: string, name: string): User => ({
  id: `mock-${Date.now()}`,
  email,
  user_metadata: { full_name: name, name, avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${name}` },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  identities: [],
  factors: [],
  _isMock: true,
} as any)

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  isMockMode: !isSupabaseConfigured,

  initialize: async () => {
    set({ isLoading: true })

    // Try to restore mock user from localStorage
    if (!canUseSupabase()) {
      const saved = localStorage.getItem('xeditor_mock_user')
      if (saved) {
        try {
          const u = JSON.parse(saved)
          set({ user: u, isAuthenticated: true, isLoading: false, isMockMode: true })
          return
        } catch {}
      }
      set({ isLoading: false, isMockMode: true })
      return
    }

    // Supabase mode
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: false,
        isMockMode: false
      })

      // Listen to auth changes
      supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
          isMockMode: false
        })
      })
    } catch (e) {
      console.error('Auth init failed', e)
      set({ isLoading: false })
    }
  },

  signInWithGoogle: async () => {
    if (!canUseSupabase()) {
      // Mock mode — the UI (LoginModal) handles the demo sign-in flow.
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { access_type: 'offline', prompt: 'consent' }
      }
    })
    if (error) {
      console.error('Google login error', error)
      throw error
    }
  },

  signInWithEmail: async (email: string) => {
    const clean = email.trim()
    if (!clean) return

    if (!canUseSupabase()) {
      // Demo mode — create a local user (no backend needed)
      const name = clean.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim() || 'Creator'
      get().setMockUser(clean, name)
      return
    }

    // Real mode — magic link via Supabase
    const { error } = await supabase.auth.signInWithOtp({
      email: clean,
      options: { emailRedirectTo: window.location.origin }
    })
    if (error) throw error
  },

  signOut: async () => {
    if (!canUseSupabase()) {
      localStorage.removeItem('xeditor_mock_user')
      set({ user: null, session: null, isAuthenticated: false })
      return
    }
    await supabase.auth.signOut()
    set({ user: null, session: null, isAuthenticated: false })
  },

  setMockUser: (email: string, name: string) => {
    const user = createMockUser(email, name)
    localStorage.setItem('xeditor_mock_user', JSON.stringify(user))
    set({ user, isAuthenticated: true, isMockMode: true })
  }
}))
