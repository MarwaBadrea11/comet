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
  membershipStatus?: 'ACTIVE' | 'PENDING' | null
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
   * Throws structured errors for proper handling in UI
   */
  join: async (id: string): Promise<void> => {
    try {
    await api.post(`/group/${id}/join`)
    } catch (err: any) {
      const status = err.response?.status
      const message = err.response?.data?.message || err.message

      // Enhanced error information for UI handling
      if (status === 409) {
        throw {
          status: 409,
          code: 'ALREADY_MEMBER',
          message: message || 'You are already a member of this group',
          originalError: err,
        }
      }

      if (status === 403) {
        throw {
          status: 403,
          code: 'FORBIDDEN',
          message: message || 'You cannot join this group',
          originalError: err,
        }
      }

      if (status === 401) {
        throw {
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'Please log in to join groups',
          originalError: err,
        }
      }

      // Re-throw with enhanced info
      throw {
        status: status || 500,
        code: 'JOIN_FAILED',
        message: message || 'Failed to join group',
        originalError: err,
      }
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
