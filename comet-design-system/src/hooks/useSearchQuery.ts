/**
 * Search query and history hooks.
 * Now maps to /search-history/* endpoints.
 *
 * useSearch              — GET /search-history?q=&category=&page=&limit=
 * useSearchHistory       — GET /search-history/history (Fetches user's recent searches)
 * useDeleteHistoryItem   — DELETE /search-history/history/:id (Removes a single item)
 * useClearAllHistory     — DELETE /search-history/history (Clears the entire history)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { searchService, type SearchCategory } from '../services/search'
import { queryKeys } from '../lib/queryKeys'

/**
 * Main search hook using the refactored /search-history endpoint.
 * @param query - Search query string (must be non-empty)
 * @param category - Search category: 'all', 'users', 'posts', or 'groups' (default: 'all')
 * @param page - Page number for pagination (default: 1)
 * @param limit - Results per page (default: 20)
 */
export function useSearch(
  query: string,
  category: SearchCategory = 'all',
  page = 1,
  limit = 20
) {
  return useQuery({
    queryKey: ['search', query, category, page, limit],
    queryFn: () => searchService.search(query, category, page, limit),
    enabled: query.trim().length >= 2, // Only search if query has at least 2 characters
    staleTime: 0, // Search results should always reflect the latest state
    gcTime: 2 * 60_000, // Keep results in memory for 2 min after unmount
  })
}

/**
 * Alternative hook for global search (if /search/global is still available).
 * Use useSearch() above for the new refactored endpoint.
 */
export function useGlobalSearch(query: string, limit = 10) {
  return useQuery({
    queryKey: queryKeys.search.global(query, limit),
    queryFn: () => searchService.globalSearch(query, limit),
    enabled: query.trim().length >= 2,
    staleTime: 0,
    gcTime: 2 * 60_000,
  })
}

// ── Fetch Search History ──────────────────────────────────────────────────────

export function useSearchHistory() {
  return useQuery({
    queryKey: ['search', 'history'],
    queryFn: () => searchService.getHistory(),
  })
}

// ── Delete Specific History Item ──────────────────────────────────────────────

export function useDeleteHistoryItem() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => searchService.deleteHistoryItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['search', 'history'] })
    },
  })
}

// ── Clear All History ─────────────────────────────────────────────────────────

export function useClearAllHistory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => searchService.clearAllHistory(),
    onMutate: async () => {
      // Optimistically empty the history list in cache
      await qc.cancelQueries({ queryKey: ['search', 'history'] })
      const previous = qc.getQueryData(['search', 'history'])
      qc.setQueryData(['search', 'history'], [])
      return { previous }
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(['search', 'history'], ctx.previous)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['search', 'history'] })
    },
  })
}
