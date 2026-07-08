/**
 * Central Axios instance.
 *
 * FIX: Removed the ESM-incompatible `require()` call that was crashing
 * silently in Vite (type:"module" projects have no `require`).
 * The auth store is now accessed via its exported `getState()` after a
 * direct ES-module import — safe because Zustand initialises synchronously.
 */

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../stores/authStore'

export const BASE_URL = 'http://localhost:8000'

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request: attach Bearer token ──────────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState()
  
  if (accessToken && config.headers) {
    // إجبار التوكن بالصيغ المعتمدة لـ NestJS و Axios الحديث
    config.headers.set('Authorization', `Bearer ${accessToken}`)
    config.headers['Authorization'] = `Bearer ${accessToken}`
    config.headers['authorization'] = `Bearer ${accessToken}`
  } else if (!accessToken) {
    // Only warn for routes that likely need authentication (not public routes like /auth/signin)
    const isPublicRoute = config.url?.includes('/auth/signin') || 
                          config.url?.includes('/auth/signup') ||
                          config.url?.includes('/auth/refresh')
    
    if (!isPublicRoute) {
      console.warn('⚠️ No Access Token: Request may fail if authentication is required', config.url)
    }
  }
  
  return config
}, (error) => {
  return Promise.reject(error)
})

// ── Response: silent token refresh on 401 ─────────────────────────────────────
let isRefreshing = false
let queue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = []

function drainQueue(error: unknown, token: string | null = null) {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  queue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    // Only attempt a refresh on 401 responses AND only when a refresh token exists.
    // Public endpoints like /auth/signup or /auth/signin never need a refresh —
    // if they 401 it means bad credentials, not an expired session.
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    const { refreshToken, setTokens, clearSession } = useAuthStore.getState()

    // No refresh token → user is simply not logged in, pass the error through
    // without redirecting (allows public pages to handle errors themselves).
    if (!refreshToken) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => queue.push({ resolve, reject }))
        .then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          original.headers['authorization'] = `Bearer ${token}`
          return api(original)
        })
        .catch((e) => Promise.reject(e))
    }

    original._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, null, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      })

      const newAccess: string  = data.accessToken
      const newRefresh: string = data.refreshToken ?? refreshToken

      setTokens(newAccess, newRefresh)
      api.defaults.headers.common.Authorization = `Bearer ${newAccess}`
      drainQueue(null, newAccess)

      original.headers.Authorization = `Bearer ${newAccess}`
      original.headers['authorization'] = `Bearer ${newAccess}`
      return api(original)
    } catch (refreshError) {
      drainQueue(refreshError, null)
      clearSession()
      // Only hard-redirect on a failed refresh, not on every 401
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default api