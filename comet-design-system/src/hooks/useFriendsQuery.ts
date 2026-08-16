/**
 * Friends query and mutation hooks.
 *
 * usePendingRequests — GET /friendship/pending-requests
 * useMyFriends       — GET /friendship/my-friends
 * useFriendSuggestions — GET /friendship/suggestions
 * useSendFriendRequest — POST /friendship/request/:receiverId
 * useApproveFriendRequest — PATCH /friendship/request/:requesterId/approve
 * useUnfriend        — DELETE /friendship/remove/:friendId
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { friendshipService } from '../services/user'
import { queryKeys } from '../lib/queryKeys'

export interface FriendRequest {
  id: string
  senderId: string
  receiverId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  sender?: {
    id: string
    name: string
    username: string
    avatar?: string
  }
}

export interface Friend {
  id: string
  name: string
  username: string
  avatar?: string
  mutualFriends?: number
}

// ── Queries ───────────────────────────────────────────────────────────────────

export function usePendingRequests() {
  return useQuery<FriendRequest[]>({
    queryKey: queryKeys.friends.pendingRequests(),
    queryFn: async () => {
      // This endpoint doesn't exist yet in the service, but we'll return empty array for now
      // You may need to add this endpoint to the backend
      return []
    },
  })
}

export function useMyFriends(take = 20, skip = 0) {
  return useQuery<Friend[]>({
    queryKey: queryKeys.friends.myFriends(take, skip),
    queryFn: () => friendshipService.getMyFriends(take, skip),
  })
}

export function useFriendSuggestions(limit = 10) {
  return useQuery<Friend[]>({
    queryKey: queryKeys.friends.suggestions(limit),
    queryFn: () => friendshipService.getSuggestions(limit),
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useSendFriendRequest() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (receiverId: string) => friendshipService.sendRequest(receiverId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.friends.pendingRequests() })
      qc.invalidateQueries({ queryKey: queryKeys.friends.suggestions() })
    },
  })
}

export function useApproveFriendRequest() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (requesterId: string) => friendshipService.approveRequest(requesterId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.friends.pendingRequests() })
      qc.invalidateQueries({ queryKey: queryKeys.friends.myFriends() })
    },
  })
}

export function useUnfriend() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (friendId: string) => friendshipService.unfriend(friendId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.friends.myFriends() })
    },
  })
}
