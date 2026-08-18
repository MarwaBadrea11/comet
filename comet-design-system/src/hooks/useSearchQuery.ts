/**
 * Search query and history hooks.
 *
 * useGlobalSearch        — GET /search/global?q=&limit= (users incl. by email, posts, groups)
 * useSaveSearch          — POST /search-history
 * useRecentSearches      — GET /search-history/recent?searchType=
 * useSearchHistory       — GET /search-history/history
 * useDeleteHistoryItem   — DELETE /search-history/:id
 * useClearAllHistory     — DELETE /search-history/clear/all
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { searchService, type SearchType } from '../services/search'
import { queryKeys } from '../lib/queryKeys'

// ── Global search ────────────────────────────────────────────────────────────

export function useGlobalSearch(query: string, limit = 10) {
  return useQuery({
    queryKey: queryKeys.search.global(query, limit),
    queryFn: () => searchService.globalSearch(query, limit),
    enabled: query.trim().length >= 2,
    staleTime: 0,
    gcTime: 2 * 60_000,
  })
}

// ── Save a search term to history ─────────────────────────────────────────────

export function useSaveSearch() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ query, searchType }: { query: string; searchType?: SearchType }) =>
      searchService.saveSearch(query, searchType),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.search.history() })
      qc.invalidateQueries({ queryKey: queryKeys.search.recent() })
    },
  })
}

// ── Recent searches (raw, optionally filtered by type) ────────────────────────

export function useRecentSearches(searchType?: SearchType) {
  return useQuery({
    queryKey: queryKeys.search.recent(searchType),
    queryFn: () => searchService.getRecentSearches(searchType),
  })
}

// ── Fetch search history ──────────────────────────────────────────────────────

export function useSearchHistory() {
  return useQuery({
    queryKey: queryKeys.search.history(),
    queryFn: () => searchService.getHistory(),
  })
}

// ── Delete specific history item ──────────────────────────────────────────────

export function useDeleteHistoryItem() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => searchService.deleteHistoryItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.search.history() })
      qc.invalidateQueries({ queryKey: queryKeys.search.recent() })
    },
  })
}

// ── Clear all history ──────────────────────────────────────────────────────────

export function useClearAllHistory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => searchService.clearAllHistory(),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: queryKeys.search.history() })
      const previous = qc.getQueryData(queryKeys.search.history())
      qc.setQueryData(queryKeys.search.history(), [])
      return { previous }
    },
    onError: (_err, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.search.history(), ctx.previous)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.search.history() })
      qc.invalidateQueries({ queryKey: queryKeys.search.recent() })
    },
  })
}
