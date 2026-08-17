/**
 * Groups service — CRUD, join, leave, post approval.
 * Maps to /group/* endpoints.
 */

import api from './api'

// ── Domain types ─────────────────────────────────────────────────────────────

export interface Group {
  id: string
  name: string
  description?: string
  privacy?: 'PUBLIC' | 'PRIVATE'
  postsNeedApproval?: boolean
  requiresApproval?: boolean
  membersCount?: number
  role?: string | null
  createdAt?: string
  ownerId?: string
  creatorId?: string  // Backend uses creatorId
}

// ── API calls ────────────────────────────────────────────────────────────────

export const groupsService = {
  /**
   * GET /group
   * Returns all groups. Does not require auth (public endpoint).
   */
  getAll: async (): Promise<Group[]> => {
    const { data } = await api.get('/group')
    return Array.isArray(data) ? data : data?.groups ?? []
  },

  /**
   * GET /group/:id
   */
  getById: async (id: string): Promise<Group> => {
    const { data } = await api.get(`/group/${id}`)
    return data
  },

  /**
   * POST /group
   */
  create: async (payload: {
    name: string
    description?: string
    privacy?: 'PUBLIC' | 'PRIVATE'
    postsNeedApproval?: boolean
  }): Promise<Group> => {
    const { data } = await api.post('/group', payload)
    return data
  },

  /**
   * POST /group/:id/join
   * Joins a public group immediately
   */
  join: async (id: string): Promise<void> => {
    try {
      await api.post(`/group/${id}/join`)
    } catch (err: any) {
      const status = err.response?.status
      const message = err.response?.data?.message || err.message

      // 409 Conflict means already a member - treat as success
      if (status === 409) {
        return // Silently succeed - user is already a member
      }

      // Re-throw other errors
      throw err
    }
  },

  /**
   * POST /group/:id/leave
   */
  leave: async (id: string): Promise<void> => {
    await api.post(`/group/${id}/leave`)
  },

  /**
   * PATCH /group/:id
   */
  update: async (
    id: string,
    payload: { name?: string; description?: string; privacy?: 'PUBLIC' | 'PRIVATE' },
  ): Promise<Group> => {
    const { data } = await api.patch(`/group/${id}`, payload)
    return data
  },

  /**
   * DELETE /group/:id
   */
  remove: async (id: string): Promise<void> => {
    await api.delete(`/group/${id}`)
  },

  /**
   * GET /group/:id/posts
   * Get all posts in a specific group
   */
  getGroupPosts: async (id: string): Promise<any[]> => {
    const { data } = await api.get(`/group/${id}/posts`)
    return Array.isArray(data) ? data : data?.posts ?? []
  },

  /**
   * POST /group/:id/posts/:postId/approve
   */
  approvePost: async (groupId: string, postId: string): Promise<void> => {
    await api.post(`/group/${groupId}/posts/${postId}/approve`)
  },

  /**
   * POST /group/:id/posts/:postId/reject
   */
  rejectPost: async (groupId: string, postId: string): Promise<void> => {
    await api.post(`/group/${groupId}/posts/${postId}/reject`)
  },
}
