/**
 * User service — profile, friends, suggestions, block.
 * Maps to /user/*, /friendship/*, /block/* endpoints.
 */

import api from './api'

// ── Domain types ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  name: string
  username: string
  email?: string
  city?: string
  country?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  role?: string
  avatar?: string
  bio?: string
  createdAt?: string
}

// ── API calls ────────────────────────────────────────────────────────────────

export const userService = {
  /**
   * GET /user/profile
   * Returns the authenticated user's own full profile (req.user.id).
   */
  getMe: async (): Promise<UserProfile> => {
    const { data } = await api.get('/user/profile')
    return data
  },

  /**
   * GET /user/:id
   */
  getUserById: async (id: string): Promise<UserProfile> => {
    const { data } = await api.get(`/user/${id}`)
    return data
  },
}

// ── Friendship ───────────────────────────────────────────────────────────────

export const friendshipService = {
  /**
   * POST /friendship/request/:receiverId
   */
  sendRequest: async (receiverId: string) => {
    const { data } = await api.post(`/friendship/request/${receiverId}`)
    return data
  },

  /**
   * PATCH /friendship/request/:requesterId/approve
   */
  approveRequest: async (requesterId: string) => {
    const { data } = await api.patch(`/friendship/request/${requesterId}/approve`)
    return data
  },

  /**
   * GET /friendship/my-friends?take=20&skip=0
   */
  getMyFriends: async (take = 20, skip = 0) => {
    const { data } = await api.get('/friendship/my-friends', { params: { take, skip } })
    return data
  },

  /**
   * GET /friendship/suggestions?limit=10
   */
  getSuggestions: async (limit = 10) => {
    const { data } = await api.get('/friendship/suggestions', { params: { limit } })
    return data
  },

  /**
   * DELETE /friendship/remove/:friendId
   */
  unfriend: async (friendId: string) => {
    const { data } = await api.delete(`/friendship/remove/${friendId}`)
    return data
  },
}

// ── Block ────────────────────────────────────────────────────────────────────

export const blockService = {
  /**
   * POST /block — body: { blockedId }
   */
  block: async (blockedId: string) => {
    const { data } = await api.post('/block', { blockedId })
    return data
  },

  /**
   * GET /block
   */
  getBlockedUsers: async () => {
    const { data } = await api.get('/block')
    return data
  },

  /**
   * DELETE /block/:id
   */
  unblock: async (id: string) => {
    const { data } = await api.delete(`/block/${id}`)
    return data
  },
}
