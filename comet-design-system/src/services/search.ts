/**
 * Search service.
 * Maps to /search-history/* endpoints for search functionality and history.
 */

import api from './api'

export type SearchCategory = 'all' | 'users' | 'posts' | 'groups'

export enum SearchType {
  USERS = 'USERS',
  POSTS = 'POSTS',
  GROUPS = 'GROUPS',
}

export interface SearchResults {
  users?: Array<{ 
    id: string
    name: string
    username: string
    email?: string
    avatarMediaId?: string | null
  }>
  posts?: Array<{ 
    id: string
    content: string
    user?: { id: string; name: string; username: string }
    createdAt?: string
  }>
  groups?: Array<{ 
    id: string
    name: string
    description?: string | null
    privacy?: string
  }>
  pagination?: {
    page: number
    limit: number
    total: number
  }
}

export interface SearchHistoryItem {
  id: string
  userId: string
  query: string
  searchType: SearchType
  createdAt: string
}

export const searchService = {
  /**
   * GET /search-history?q=query&category=all&page=1&limit=20
   * Main search endpoint with query parameter (required).
   * Backend throws 400 BadRequest if q is empty or missing.
   */
  search: async (
    query: string,
    category: SearchCategory = 'all',
    page = 1,
    limit = 20
  ): Promise<SearchResults> => {
    if (!query?.trim()) {
      throw new Error('Search query cannot be empty')
    }

    const { data } = await api.get('/search-history', {
      params: { q: query, category, page, limit },
    })
    return data
  },

  /**
   * GET /search-history/history
   * Fetches the authenticated user's recent search history.
   */
  getHistory: async (): Promise<SearchHistoryItem[]> => {
    const { data } = await api.get('/search-history/history')
    return Array.isArray(data) ? data : data?.history ?? []
  },

  /**
   * DELETE /search-history/history/:id
   * Removes a single search history item.
   */
  deleteHistoryItem: async (id: string): Promise<void> => {
    await api.delete(`/search-history/history/${id}`)
  },

  /**
   * DELETE /search-history/history
   * Clears all search history for the authenticated user.
   */
  clearAllHistory: async (): Promise<void> => {
    await api.delete('/search-history/history')
  },

  /**
   * GET /search/global?q=query&limit=10
   * Alternative global search endpoint (if still available on backend).
   */
  globalSearch: async (query: string, limit = 10): Promise<SearchResults> => {
    const { data } = await api.get('/search/global', { params: { q: query, limit } })
    return data
  },
}
