/**
 * Stories service — maps to /story/* endpoints.
 *
 * Backend Reference:
 * - Controller: apps/api/src/stories/story.controller.ts
 * - Service: apps/api/src/stories/story.service.ts
 *
 * A Story wraps a Post (created together in one call) that auto-expires
 * after `duration` hours (1-168, default 24).
 */

import api, { BASE_URL } from './api'
import type { Story, StoryFeedGroup, CreateStoryRequest, UpdateStoryRequest } from '../types'

export const storiesService = {
  /**
   * POST /story
   * Creates a Post + Story together.
   */
  create: async (payload: CreateStoryRequest): Promise<Story> => {
    const { data } = await api.post('/story', payload)
    return data
  },

  /**
   * GET /story/feed
   * Active (non-expired) stories from the current user + friends, grouped by author.
   */
  getFeed: async (): Promise<StoryFeedGroup[]> => {
    const { data } = await api.get('/story/feed')
    return Array.isArray(data) ? data : []
  },

  /**
   * GET /story/mine?includeExpired=
   */
  getMine: async (includeExpired = false): Promise<Story[]> => {
    const { data } = await api.get('/story/mine', { params: { includeExpired } })
    return Array.isArray(data) ? data : []
  },

  /**
   * GET /story/:id
   */
  getById: async (id: string): Promise<Story> => {
    const { data } = await api.get(`/story/${id}`)
    return data
  },

  /**
   * PATCH /story/:id — owner only.
   */
  update: async (id: string, payload: UpdateStoryRequest): Promise<Story> => {
    const { data } = await api.patch(`/story/${id}`, payload)
    return data
  },

  /**
   * DELETE /story/:id — owner only, cascades to the underlying post.
   */
  remove: async (id: string): Promise<void> => {
    await api.delete(`/story/${id}`)
  },
}

/**
 * Story media isn't pre-serialized with an absolute `url` by the backend
 * (unlike Post media) — build it from the relative `path` ourselves.
 */
export function getStoryMediaUrl(story: Story): string | undefined {
  const path = story.post.media?.[0]?.media?.path
  return path ? `${BASE_URL}${path}` : undefined
}
