/**
 * AuthContext — backward-compatible bridge over the Zustand authStore.
 *
 * All components that already call `useAuth()` continue to work without
 * any changes. New code should prefer importing `useAuthStore` directly
 * for individual selector subscriptions (better performance).
 *
 * The `signOut` action here calls the mutation hook which handles the
 * server call + cache clear + navigation.
 */

import { createContext, useContext, type ReactNode } from 'react'
import { useAuthStore, type AuthUser } from '../stores/authStore'
import { useSignOut } from '../hooks/useAuthMutations'

interface AuthContextValue {
  user:            AuthUser | null
  setUser:         (u: AuthUser | null) => void
  signOut:         () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const user           = useAuthStore((s) => s.user)
  const setUser        = useAuthStore((s) => s.setUser)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())

  // The mutation handles server call, cache clear, and navigation
  const signOutMutation = useSignOut()
  const signOut = () => signOutMutation.mutate()

  return (
    <AuthContext.Provider value={{ user, setUser, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
