/**
 * Search module type definitions.
 * Aligned with backend /search-history endpoints.
 */

export enum SearchType {
  USERS = 'USERS',
  POSTS = 'POSTS',
  GROUPS = 'GROUPS',
}

export type SearchCategory = 'all' | 'users' | 'posts' | 'groups'

export interface SearchParams {
  q: string
  category?: SearchCategory
  page?: number
  limit?: number
}

export interface SearchHistoryItem {
  id: string
  userId: string
  query: string
  searchType: SearchType
  createdAt: string
}

export interface UserSearchResult {
  id: string
  name: string
  username: string
  email?: string
  avatarMediaId?: string | null
}

export interface PostSearchResult {
  id: string
  content: string
  user?: {
    id: string
    name: string
    username: string
  }
  createdAt?: string
}

export interface GroupSearchResult {
  id: string
  name: string
  description?: string | null
  privacy?: string
  avatarMediaId?: string | null
}

export interface SearchResults {
  users?: UserSearchResult[]
  posts?: PostSearchResult[]
  groups?: GroupSearchResult[]
  pagination?: {
    page: number
    limit: number
    total: number
  }
}
