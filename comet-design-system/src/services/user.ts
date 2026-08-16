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
  // Extract avatar URL from avatarMedia object if available
  const avatarUrl = data?.avatarMedia?.url || data?.avatar || null
  return { 
    ...data, 
    avatar: avatarUrl 
  }
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
    return normalizeProfile(data)
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
// Backend Reference: apps/api/src/friendship/friendship.controller.ts

export interface PendingFriendRequest {
  friendshipId: string
  createdAt: string
  requester: {
    id: string
    username: string
    name: string
    avatarMediaId?: string | null
    isVerified?: boolean
    status?: string
  }
}

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
   * DELETE /friendship/request/:targetId/reject
   * Deletes whatever PENDING friendship row exists between the two users —
   * used both to decline an incoming request and to cancel one you sent.
   */
  rejectOrCancelRequest: async (targetId: string) => {
    const { data } = await api.delete(`/friendship/request/${targetId}/reject`)
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
   * GET /friendship/requests/pending
   * Incoming requests sent TO the current user (there is no backend endpoint
   * to list requests the current user has SENT — see useFriendshipStatus for
   * how outgoing state is tracked client-side instead).
   */
  getPendingRequests: async (): Promise<PendingFriendRequest[]> => {
    const { data } = await api.get('/friendship/requests/pending')
    return data
  },

  /**
   * GET /friendship/suggestions?limit=10
   * Returns only {userId, mutualFriends, sharedInterests, score} — no display
   * info. Callers needing name/avatar must resolve each userId separately
   * (e.g. via userService.getUserById).
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
// Backend Reference: apps/api/src/block/block.controller.ts

export interface BlockRow {
  id: string
  blockerId: string
  blockedId: string
  createdAt: string
}

export const blockService = {
  /**
   * POST /block — body: { blockedId }
   * Toggle: creates a block if none exists between these two users, or
   * deletes the existing one (unblock) if it does. Same call for both
   * directions — no need to resolve a block-row id first.
   */
  toggle: async (blockedId: string): Promise<BlockRow> => {
    const { data } = await api.post('/block', { blockedId })
    return data
  },

  /**
   * GET /block — every block row involving the current user, either
   * direction (they blocked you, or you blocked them).
   */
  getAll: async (): Promise<BlockRow[]> => {
    const { data } = await api.get('/block')
    return data
  },

  /**
   * DELETE /block/:id — id is the block ROW id (not a user id).
   */
  remove: async (blockRowId: string) => {
    const { data } = await api.delete(`/block/${blockRowId}`)
    return data
  },
}
