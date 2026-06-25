import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { UserTier } from '@/types/verdict'

interface AuthState {
  user: User | null
  tier: UserTier
  setUser: (user: User | null) => void
  setTier: (tier: UserTier) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tier: 'free',
  setUser: (user) => set({ user }),
  setTier: (tier) => set({ tier }),
  clear: () => set({ user: null, tier: 'free' }),
}))
