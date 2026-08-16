/**
 * User service — profile, friends, suggestions, block.
 * Maps to /user/*, /friendship/*, /block/* endpoints.
 */

import api from './api'
import type { Media } from '../types/media.types'

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
  bio?: string
  /** Derived from avatarMedia.url — the field every screen already reads. */
  avatar?: string
  avatarMedia?: Media | null
  coverMedia?: Media | null
  createdAt?: string
  friendsCount?: number
}

function normalizeProfile(data: any): UserProfile {
  return { ...data, avatar: data?.avatarMedia?.url }
}

export interface UpdateProfileRequest {
  name?: string
  username?: string
  bio?: string
  phone?: string
  dateOfBirth?: string
  location?: string
  city?: string
  country?: string
  gender?: UserProfile['gender']
  avatarMediaId?: string
  coverMediaId?: string
}

// ── API calls ────────────────────────────────────────────────────────────────

export const userService = {
  /**
   * GET /user/profile
   * Returns the authenticated user's own full profile (req.user.id).
   */
  getMe: async (): Promise<UserProfile> => {
    const { data } = await api.get('/user/profile')
    return normalizeProfile(data)
  },

  /**
   * PATCH /user/profile
   * Updates the authenticated user's own profile — including
   * avatarMediaId/coverMediaId pointing at an already-uploaded media record.
   */
  updateProfile: async (payload: UpdateProfileRequest): Promise<UserProfile> => {
    const { data } = await api.patch('/user/profile', payload)
    return normalizeProfile(data)
  },

  /**
   * GET /user/:id
   */
  getUserById: async (id: string): Promise<UserProfile> => {
    const { data } = await api.get(`/user/${id}`)
    return data
  },

  /**
   * Search user by email using the search endpoint
   * This uses the general search API filtered for users
   */
  searchByEmail: async (email: string): Promise<UserProfile | null> => {
    if (!email?.trim()) {
      throw new Error('Email cannot be empty')
    }
    
    const { data } = await api.get('/search-history', {
      params: { 
        q: email, 
        category: 'users',
        page: 1,
        limit: 1
      },
    })
    
    // Return the first user if found, otherwise null
    if (data?.users && data.users.length > 0) {
      return normalizeProfile(data.users[0])
    }
    
    return null
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
   * DELETE /friendship/request/:requestId/decline (cancel or decline)
   */
  declineRequest: async (requesterId: string) => {
    const { data } = await api.delete(`/friendship/request/${requesterId}/decline`)
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
   * GET /friendship/incoming-requests
   */
  getIncomingRequests: async () => {
    const { data } = await api.get('/friendship/incoming-requests')
    return data
  },

  /**
   * GET /friendship/outgoing-requests
   */
  getOutgoingRequests: async () => {
    const { data } = await api.get('/friendship/outgoing-requests')
    return data
  },

  /**
   * GET /friendship/status/:userId - Check friendship status with another user
   */
  getStatus: async (userId: string) => {
    const { data } = await api.get(`/friendship/status/${userId}`)
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
   * GET /block/:id
   */
  getBlockById: async (id: string) => {
    const { data } = await api.get(`/block/${id}`)
    return data
  },

  /**
   * DELETE /block/:blockId (unblock)
   */
  unblock: async (blockId: string) => {
    const { data } = await api.delete(`/block/${blockId}`)
    return data
  },

  /**
   * Check if a user is blocked
   */
  isBlocked: async (userId: string): Promise<boolean> => {
    try {
      const blocked = await blockService.getBlockedUsers()
      return blocked.some((b: any) => b.blockedId === userId)
    } catch {
      return false
    }
  },
}
