/**
 * Search service.
 * Maps to /search/global and /search-history/* endpoints.
 *
 * Backend Reference:
 * - apps/api/src/search/search.controller.ts — GET /search/global (public, working)
 * - apps/api/src/search-history/search-history.controller.ts — history CRUD
 *
 * NOTE: the category-filtered `GET /search-history?q=&category=` endpoint
 * (search-history.controller.ts's bare @Get()) calls a service method whose
 * success path never returns a value — it always resolves to `undefined`.
 * Use globalSearch() (GET /search/global) instead, which is fully implemented.
 */

import api from './api'

export const SearchType = {
  USERS: 'USERS',
  POSTS: 'POSTS',
  GROUPS: 'GROUPS',
} as const

export type SearchType = typeof SearchType[keyof typeof SearchType]

/** Media as serialized by the backend's serializeMedia() — null when unset. */
export interface SerializedMedia {
  id: string
  url?: string
  mimeType?: string
  [key: string]: unknown
}

export interface SearchResults {
  users: Array<{
    id: string
    name: string
    username: string
    email?: string
    bio?: string | null
    role?: string
    createdAt?: string
    avatar: SerializedMedia | null
  }>
  posts: Array<{
    id: string
    content: string | null
    createdAt?: string
    user: { id: string; name: string; username: string; email?: string; avatar: SerializedMedia | null }
    media?: SerializedMedia[]
  }>
  groups: Array<{
    id: string
    name: string
    description?: string | null
    privacy?: string
    avatar: SerializedMedia | null
  }>
}

export interface SearchHistoryItem {
  id: string
  userId?: string
  query: string
  searchType: SearchType
  createdAt: string
}

export const searchService = {
  /**
   * GET /search/global?q=query&limit=10
   * Public — no auth required. Searches users (incl. by email), posts, and
   * groups in one call. This is the endpoint SearchScreen (search-by-email) uses.
   */
  globalSearch: async (query: string, limit = 10): Promise<SearchResults> => {
    const { data } = await api.get('/search/global', { params: { q: query, limit } })
    return {
      users: data?.users ?? [],
      posts: data?.posts ?? [],
      groups: data?.groups ?? [],
    }
  },

  /**
   * POST /search-history — body: { query?, searchType? }
   * Saves (or bumps the timestamp of) a search term for the current user.
   */
  saveSearch: async (query: string, searchType: SearchType = 'USERS'): Promise<void> => {
    await api.post('/search-history', { query, searchType })
  },

  /**
   * GET /search-history/recent?searchType=
   * Latest 10 raw search-history rows, optionally filtered by type.
   */
  getRecentSearches: async (searchType?: SearchType): Promise<SearchHistoryItem[]> => {
    const { data } = await api.get('/search-history/recent', {
      params: searchType ? { searchType } : undefined,
    })
    return Array.isArray(data) ? data : []
  },

  /**
   * GET /search-history/history
   * Fetches the authenticated user's recent search history (latest 10).
   */
  getHistory: async (): Promise<SearchHistoryItem[]> => {
    const { data } = await api.get('/search-history/history')
    return Array.isArray(data) ? data : data?.history ?? []
  },

  /**
   * DELETE /search-history/:id
   * Removes a single search history item (matches the Postman "delete-history-item" route).
   */
  deleteHistoryItem: async (id: string): Promise<void> => {
    await api.delete(`/search-history/${id}`)
  },

  /**
   * DELETE /search-history/clear/all
   * Clears all search history for the authenticated user.
   */
  clearAllHistory: async (): Promise<void> => {
    await api.delete('/search-history/clear/all')
  },
}
