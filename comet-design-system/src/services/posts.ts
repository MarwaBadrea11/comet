/**
 * Posts service — CRUD, feed, sharing, reactions, comments.
 * Maps to /post/*, /reaction/*, and /comment/* endpoints.
 * 
 * REMOVED ENDPOINTS (backend refactor):
 * - /post/adding-post (use POST /post instead)
 * - /post/delete-media/:id (use DELETE /media/:id instead)
 * - /post/make-hashtags (hashtags auto-extracted from content)
 * - /post/open-search-history (moved to /search-history/history)
 * - /post/search-bar (moved to /search-history?q=...)
 */

import api from './api'

// ── Domain types ─────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string
  url: string
  type: 'IMAGE' | 'VIDEO'
}

export interface PostUser {
  id: string
  name: string
  avatar?: string
}

export interface Reaction {
  id: string
  type: string
  userId: string
}

export interface Comment {
  id: string
  content: string
  user: PostUser
  createdAt?: string
  parentId?: string | null
}

export interface Hashtag {
  id: string
  name: string
}

export interface Post {
  id: string
  content: string
  type: 'POST' | 'STORY'
  visibility: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE'
  feeling?: string
  location?: string
  createdAt: string
  user: PostUser
  media?: MediaItem[]
  reactions?: Reaction[]
  comments?: Comment[]
  hashtags?: Hashtag[]
}

export interface FeedResponse {
  posts?: Post[]
  data?: Post[]
  total?: number
  page?: number
  pageSize?: number
}

export type PostVisibility = 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE'

// ── API calls ────────────────────────────────────────────────────────────────

export const postsService = {
  /**
   * GET /post/feed?page=1&pageSize=20
   * Returns the authenticated user's personalized feed.
   */
  getFeed: async (page = 1, pageSize = 20): Promise<Post[]> => {
    const { data } = await api.get('/post/feed', {
      params: { page, pageSize },
    })
    // Normalize: API may return array or { posts: [] } or { data: [] }
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.posts)) return data.posts
    if (Array.isArray(data?.data)) return data.data
    return []
  },

  /**
   * GET /post/:id
   */
  getPost: async (id: string): Promise<Post> => {
    const { data } = await api.get(`/post/${id}`)
    return data
  },

  /**
   * GET /post/user/:username
   * Public — no auth required.
   */
  getPostsByUsername: async (username: string): Promise<Post[]> => {
    const { data } = await api.get(`/post/user/${username}`)
    return Array.isArray(data) ? data : data?.posts ?? []
  },

  /**
   * POST /post
   */
  createPost: async (payload: {
    content?: string
    visibility?: PostVisibility
    feeling?: string
    location?: string
    mediaIds?: string[]
  }): Promise<Post> => {
    const { data } = await api.post('/post', payload)
    return data
  },

  /**
   * POST /post/schedule
   * Schedule a post for future publishing
   */
  schedulePost: async (payload: {
    content?: string
    visibility?: PostVisibility
    feeling?: string
    location?: string
    mediaIds?: string[]
    scheduledAt: string // ISO 8601 timestamp
  }): Promise<Post> => {
    const { data } = await api.post('/post/schedule', payload)
    return data
  },

  /**
   * PATCH /post/:id
   */
  updatePost: async (
    id: string,
    payload: { content?: string; visibility?: PostVisibility; feeling?: string; location?: string },
  ): Promise<Post> => {
    const { data } = await api.patch(`/post/${id}`, payload)
    return data
  },

  /**
   * DELETE /post/:id
   */
  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/post/${id}`)
  },

  /**
   * POST /post/share/:postId
   */
  sharePost: async (postId: string, quoteContent?: string): Promise<Post> => {
    const { data } = await api.post(`/post/share/${postId}`, { quoteContent })
    return data
  },

  /**
   * POST /post/save/:postId
   */
  savePost: async (postId: string): Promise<void> => {
    await api.post(`/post/save/${postId}`)
  },

  /**
   * POST /post/hide/:postId
   * Hides a post from the user's feed (backend uses upsert on hiddenPost table)
   */
  hidePost: async (postId: string): Promise<void> => {
    await api.post(`/post/hide/${postId}`)
  },

  /**
   * PATCH /post/update-privacy/:postId
   */
  updatePrivacy: async (postId: string, visibility: PostVisibility): Promise<void> => {
    await api.patch(`/post/update-privacy/${postId}`, { visibility })
  },
}

// ── Reactions ────────────────────────────────────────────────────────────────

export type ReactableType = 'POST' | 'COMMENT' | 'STORY'
export type ReactionType = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY'

export const reactionsService = {
  /**
   * POST /reaction
   * Body: { reactableId, reactableType, reactionType? }
   */
  react: async (reactableId: string, reactableType: ReactableType, reactionType: ReactionType = 'LIKE') => {
    const { data } = await api.post('/reaction', { reactableId, reactableType, reactionType })
    return data
  },

  /**
   * GET /reaction
   * Returns all reactions made by the current user.
   */
  getMyReactions: async () => {
    const { data } = await api.get('/reaction')
    return data
  },
}

// ── Comments ─────────────────────────────────────────────────────────────────

export const commentsService = {
  /**
   * POST /comment
   */
  createComment: async (payload: {
    postId: string
    userId: string
    content: string
    parentId?: string
  }): Promise<Comment> => {
    const { data } = await api.post('/comment', payload)
    return data
  },

  /**
   * GET /comment/:id
   */
  getComment: async (id: string): Promise<Comment> => {
    const { data } = await api.get(`/comment/${id}`)
    return data
  },

  /**
   * PATCH /comment/:id
   */
  updateComment: async (id: string, payload: { content: string }): Promise<Comment> => {
    const { data } = await api.patch(`/comment/${id}`, payload)
    return data
  },

  /**
   * DELETE /comment/:id
   */
  deleteComment: async (id: string): Promise<void> => {
    await api.delete(`/comment/${id}`)
  },
}