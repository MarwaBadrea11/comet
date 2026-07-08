/**
 * TanStack Query — global QueryClient configuration.
 *
 * Strategy:
 *  - staleTime: data is considered fresh for 60 s → no redundant refetches on
 *    tab focus or component remount within that window.
 *  - gcTime (formerly cacheTime): keep unused query data in memory for 5 min.
 *  - retry: only retry once on network errors; auth errors (401/403) are NOT
 *    retried so the interceptor in api.ts handles them cleanly.
 *  - refetchOnWindowFocus: true in prod, false in dev to avoid noise.
 */

import { QueryClient } from '@tanstack/react-query'

function shouldRetry(failureCount: number, error: unknown): boolean {
  // Never retry auth errors — the Axios interceptor in api.ts handles 401
  const status = (error as any)?.response?.status
  if (status === 401 || status === 403 || status === 404) return false
  return failureCount < 1
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,          // 60 s
      gcTime: 5 * 60_000,         // 5 min
      retry: shouldRetry,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: false,
    },
  },
})
