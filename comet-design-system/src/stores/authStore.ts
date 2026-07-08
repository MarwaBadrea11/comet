/**
 * authStore — Zustand store for authentication state.
 *
 * Persisted to localStorage via the built-in `persist` middleware so the
 * session survives a full page reload without an extra /user/me round-trip
 * on startup.
 *
 * TanStack Query owns the *server* state (e.g. full profile from /user/me).
 * This store owns the *client* auth state: tokens + minimal user identity.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: string
  name: string
  role: string
  avatar?: string
  email?: string
}

interface AuthState {
  user:         AuthUser | null
  accessToken:  string | null
  refreshToken: string | null

  // Actions
  setTokens:    (access: string, refresh: string) => void
  setUser:      (user: AuthUser | null) => void
  clearSession: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),

      setUser: (user) => set({ user }),

      clearSession: () =>
        set({ user: null, accessToken: null, refreshToken: null }),

      isAuthenticated: () => {
        const { accessToken } = get()
        return !!accessToken
      },
    }),
    {
      name: 'comet-auth',          // localStorage key
      // Only persist the minimal identity & tokens — not derived state
      partialize: (state) => ({
        user:         state.user,
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
)
