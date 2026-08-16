import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { friendshipService } from '../services/user'
import { queryKeys } from '../lib/queryKeys'
import { toast } from '../components/ui/Toast'
import type { FriendRequest } from '../types'

export function useFriendshipStatus(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.friendship.status(userId ?? ''),
    queryFn: () => friendshipService.getStatus(userId!),
    enabled: !!userId,
    staleTime: 30_000,
  })
}

export function useSendFriendRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (receiverId: string) => friendshipService.sendRequest(receiverId),
    onSuccess: (_, receiverId) => {
      qc.invalidateQueries({ queryKey: queryKeys.friendship.status(receiverId) })
      qc.invalidateQueries({ queryKey: queryKeys.friendship.outgoing() })
      toast.success('Friend request sent')
    },
    onError: () => {
      toast.error('Failed to send friend request')
    },
  })
}

export function useApproveFriendRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (requesterId: string) => friendshipService.approveRequest(requesterId),
    onSuccess: (_, requesterId) => {
      qc.invalidateQueries({ queryKey: queryKeys.friendship.status(requesterId) })
      qc.invalidateQueries({ queryKey: queryKeys.friendship.incoming() })
      qc.invalidateQueries({ queryKey: queryKeys.friendship.friends() })
      toast.success('Friend request accepted')
    },
    onError: () => {
      toast.error('Failed to accept friend request')
    },
  })
}

export function useDeclineFriendRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (requesterId: string) => friendshipService.declineRequest(requesterId),
    onSuccess: (_, requesterId) => {
      qc.invalidateQueries({ queryKey: queryKeys.friendship.status(requesterId) })
      qc.invalidateQueries({ queryKey: queryKeys.friendship.incoming() })
      qc.invalidateQueries({ queryKey: queryKeys.friendship.outgoing() })
      toast.success('Request declined')
    },
    onError: () => {
      toast.error('Failed to decline request')
    },
  })
}

export function useUnfriend() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (friendId: string) => friendshipService.unfriend(friendId),
    onSuccess: (_, friendId) => {
      qc.invalidateQueries({ queryKey: queryKeys.friendship.status(friendId) })
      qc.invalidateQueries({ queryKey: queryKeys.friendship.friends() })
      toast.success('Unfriended')
    },
    onError: () => {
      toast.error('Failed to unfriend')
    },
  })
}

export function useIncomingRequests() {
  return useQuery<FriendRequest[]>({
    queryKey: queryKeys.friendship.incoming(),
    queryFn: () => friendshipService.getIncomingRequests(),
    staleTime: 60_000,
  })
}

export function useOutgoingRequests() {
  return useQuery<FriendRequest[]>({
    queryKey: queryKeys.friendship.outgoing(),
    queryFn: () => friendshipService.getOutgoingRequests(),
    staleTime: 60_000,
  })
}

export function useMyFriends(take = 20, skip = 0) {
  return useQuery({
    queryKey: queryKeys.friendship.friends(),
    queryFn: () => friendshipService.getMyFriends(take, skip),
    staleTime: 60_000,
  })
}

export function useFriendSuggestions(limit = 10) {
  return useQuery({
    queryKey: queryKeys.friendship.suggestions(),
    queryFn: () => friendshipService.getSuggestions(limit),
    staleTime: 300_000,
  })
}
