/**
 * Auth mutation hooks.
 *
 * useSignIn  — POST /auth/signin → stores tokens + user, navigates to /home.
 * useSignUp  — POST /auth/signup → navigates to /login on success.
 * useSignOut — POST /auth/signout → clears store + cache, navigates to /login.
 *
 * normaliseError() handles both NestJS validation error shapes:
 *   { message: "string" }          — simple message
 *   { message: ["msg1","msg2"] }   — class-validator array (400 Bad Request)
 */

import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService, type SignInPayload, type SignUpPayload } from '../services/auth'
import { useAuthStore } from '../stores/authStore'
import { queryClient } from '../lib/queryClient'

/** Turn any Axios error into a readable string, handling NestJS array messages. */
export function normaliseAuthError(error: unknown): string {
  const data = (error as any)?.response?.data
  if (!data) return 'Cannot connect to the server. Please check if it is running.'

  const msg = data.message
  if (Array.isArray(msg)) return msg.join(' · ')
  if (typeof msg === 'string' && msg) return msg

  return `Error ${data.statusCode ?? ''}: ${data.error ?? 'Something went wrong.'}`
}

// ── Sign In ───────────────────────────────────────────────────────────────────

export function useSignIn() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser   = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (payload: SignInPayload) => authService.signIn(payload),

    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken)
      setUser({ id: data.id, name: data.name, role: data.role })

      const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/home'
      navigate(from, { replace: true })
    },
  })
}

// ── Sign Up ───────────────────────────────────────────────────────────────────

export function useSignUp() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: SignUpPayload) => authService.signUp(payload),
    onSuccess: () => navigate('/login'),
  })
}

// ── Sign Out ──────────────────────────────────────────────────────────────────

export function useSignOut() {
  const navigate     = useNavigate()
  const clearSession = useAuthStore((s) => s.clearSession)

  return useMutation({
    mutationFn: () => authService.signOut(),

    onSettled: () => {
      clearSession()
      queryClient.clear()
      navigate('/login', { replace: true })
    },
  })
}
