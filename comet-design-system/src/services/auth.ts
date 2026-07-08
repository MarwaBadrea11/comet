/**
 * Auth service — raw API calls only.
 *
 * Side-effects (writing to the store) are handled by the mutation hooks in
 * src/hooks/useAuthMutations.ts so this file stays testable and side-effect-free.
 */

import api, { BASE_URL } from './api'
import axios from 'axios'

// ── DTOs ──────────────────────────────────────────────────────────────────────

export interface SignUpPayload {
  name:     string
  email:    string
  password: string
  city?:    string
  country?: string
  gender?:  'MALE' | 'FEMALE'
  role?:    'USER' | 'ADMIN' | 'EDITOR'
}

export interface SignInPayload {
  email:    string
  password: string
}

export interface AuthResponse {
  id:           string
  name:         string
  role:         string
  accessToken:  string
  refreshToken: string
}

// ── Calls ─────────────────────────────────────────────────────────────────────

export const authService = {
  /** POST /auth/signup */
  signUp: async (payload: SignUpPayload) => {
    const { data } = await api.post('/auth/signup', payload)
    return data
  },

  /**
   * POST /auth/signin
   * Returns tokens + user identity. Caller is responsible for storing them.
   */
  signIn: async (payload: SignInPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/signin', payload)
    return data
  },

  /**
   * POST /auth/signout
   * Revokes the refresh token server-side.
   */
  signOut: async (): Promise<void> => {
    await api.post('/auth/signout').catch(() => {/* best-effort */})
  },

  /**
   * POST /auth/refresh
   * Called directly by the Axios interceptor. Also exposed for manual use.
   */
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const { data } = await axios.post<AuthResponse>(`${BASE_URL}/auth/refresh`, null, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
    return data
  },
}
