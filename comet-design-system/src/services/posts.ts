/**
 * Posts service — CRUD, feed, sharing, scheduling.
 * Maps to /post/* endpoints.
 *
 * Reactions and comments live in services/reactions.ts and services/comments.ts.
 *
 * REMOVED ENDPOINTS (backend refactor):
 * - /post/adding-post (use POST /post instead)
 * - /post/delete-media/:id (use DELETE /media/:id instead)
 * - /post/make-hashtags (hashtags auto-extracted from content)
 * - /post/open-search-history (moved to /search-history/history)
 * - /post/search-bar (moved to /search-history?q=...)
 */

import api from './api'
import type { Post, PostVisibility } from '../types'

// ── API calls ────────────────────────────────────────────────────────────────

export const postsService = {
  /**
   * GET /post/feed?page=1&pageSize=20
   * Returns the authenticated user's personalized feed.
   * Excludes stories (which are fetched separately via GET /story/feed).
   */
  getFeed: async (page = 1, pageSize = 20): Promise<Post[]> => {
    const { data } = await api.get('/post/feed', {
      params: { page, pageSize },
    })
    // Normalize: API may return array or { posts: [] } or { data: [] }
    let posts: Post[] = []
    if (Array.isArray(data)) {
      posts = data
    } else if (Array.isArray(data?.posts)) {
      posts = data.posts
    } else if (Array.isArray(data?.data)) {
      posts = data.data
    }
    
    // Filter out any stories that might have leaked into the feed
    // Stories have a story table entry and should only appear in /story/feed
    return posts.filter(post => !post.story)
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
   * Returns posts by username, excluding stories.
   */
  getPostsByUsername: async (username: string): Promise<Post[]> => {
    const { data } = await api.get(`/post/user/${username}`)
    const posts = Array.isArray(data) ? data : data?.posts ?? []
    // Filter out stories
    return posts.filter((post: Post) => !post.story)
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
    groupId?: string
  }): Promise<Post> => {
    const { data } = await api.post('/post', payload)
    return data
  },

  /**
   * POST /post/schedule
   * Schedule a post for future publishing.
   * NOTE: the controller's inline body type says `scheduledTime`, but that's
   * just a TS annotation with no runtime validation (no DTO/ValidationPipe on
   * this route) — post.service.ts's schedulePost() actually reads
   * `data.scheduledAt` (falling back to `data.scheduledFor`). Send `scheduledAt`.
   */
  schedulePost: async (payload: {
    content?: string
    visibility?: PostVisibility
    feeling?: string
    location?: string
    mediaIds?: string[]
    scheduledAt: string // ISO 8601 timestamp
    groupId?: string
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
