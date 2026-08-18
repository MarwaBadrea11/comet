import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { friendshipService } from '../services/user'
import { queryKeys } from '../lib/queryKeys'
import { toast } from '../components/ui/Toast'
import type { FriendRequest } from '../types'

// Backend friendship errors are plain NestJS HttpExceptions
// ({message, error, statusCode}) with a genuinely useful message (e.g.
// "A friend request is already pending between these users") — show that
// instead of a generic failure toast so users understand what happened.
function friendshipErrorMessage(err: unknown, fallback: string): string {
  return (err as any)?.response?.data?.message ?? fallback
}

// Requests the current user has SENT and are still pending. There is no
// backend endpoint to list these (only incoming requests are queryable), so
// we track them client-side for the lifetime of the session, seeded from
// sendRequest/cancel mutations. Good enough for same-session UX; a page
// reload will forget outgoing state until the other side responds.
const OUTGOING_IDS_KEY = ['friendship', 'outgoingIds'] as const

function useOutgoingIdsCache() {
  const qc = useQueryClient()
  return {
    ids: qc.getQueryData<string[]>(OUTGOING_IDS_KEY) ?? [],
    add: (id: string) =>
      qc.setQueryData<string[]>(OUTGOING_IDS_KEY, (old) => Array.from(new Set([...(old ?? []), String(id)]))),
    remove: (id: string) =>
      qc.setQueryData<string[]>(OUTGOING_IDS_KEY, (old) => (old ?? []).filter((x) => x !== String(id))),
  }
}

// ── Queries ──────────────────────────────────────────────────────────────────

export function useIncomingRequests() {
  return useQuery<FriendRequest[]>({
    queryKey: queryKeys.friendship.incoming(),
    queryFn: () => friendshipService.getPendingRequests(),
    staleTime: 30_000,
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

/**
 * Derived (non-fetching) relationship status for one other user, composed
 * from data we can actually query: the friends list, incoming requests, and
 * the client-side outgoing-request cache above.
 */
export function useFriendshipStatus(userId: string | undefined) {
  const { data: friends = [], isLoading: loadingFriends } = useMyFriends()
  const { data: incoming = [], isLoading: loadingIncoming } = useIncomingRequests()
  const { ids: outgoingIds } = useOutgoingIdsCache()

  const isFriend = !!userId && friends.some((f: any) => String(f.id) === String(userId))
  const incomingReq = userId ? incoming.find((r) => String(r.requester.id) === String(userId)) : undefined
  const isIncoming = !!incomingReq
  const isOutgoing = !!userId && outgoingIds.includes(String(userId))

  return {
    data: {
      isFriend,
      isPending: isIncoming || isOutgoing,
      isOutgoing,
      isIncoming,
      status: isFriend ? 'ACCEPTED' : isIncoming || isOutgoing ? 'PENDING' : undefined,
      friendshipId: incomingReq?.friendshipId,
    },
    isLoading: loadingFriends || loadingIncoming,
  }
}

// ── Mutations ────────────────────────────────────────────────────────────────

export function useSendFriendRequest() {
  const qc = useQueryClient()
  const { add } = useOutgoingIdsCache()

  return useMutation({
    mutationFn: (receiverId: string) => friendshipService.sendRequest(receiverId),
    onSuccess: (_, receiverId) => {
      add(receiverId)
      qc.invalidateQueries({ queryKey: queryKeys.friendship.incoming() })
      toast.success('Friend request sent')
    },
    onError: (err) => {
      toast.error(friendshipErrorMessage(err, 'Failed to send friend request'))
    },
  })
}

export function useApproveFriendRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (requesterId: string) => friendshipService.approveRequest(requesterId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.friendship.incoming() })
      qc.invalidateQueries({ queryKey: queryKeys.friendship.friends() })
      toast.success('Friend request accepted')
    },
    onError: (err) => {
      toast.error(friendshipErrorMessage(err, 'Failed to accept friend request'))
    },
  })
}

/** Declines an incoming request OR cancels one you sent — same backend action either way. */
export function useDeclineFriendRequest() {
  const qc = useQueryClient()
  const { remove } = useOutgoingIdsCache()

  return useMutation({
    mutationFn: (targetId: string) => friendshipService.rejectOrCancelRequest(targetId),
    onSuccess: (_, targetId) => {
      remove(targetId)
      qc.invalidateQueries({ queryKey: queryKeys.friendship.incoming() })
      toast.success('Request removed')
    },
    onError: (err) => {
      toast.error(friendshipErrorMessage(err, 'Failed to remove request'))
    },
  })
}

export function useUnfriend() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (friendId: string) => friendshipService.unfriend(friendId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.friendship.friends() })
      toast.success('Unfriended')
    },
    onError: (err) => {
      toast.error(friendshipErrorMessage(err, 'Failed to unfriend'))
    },
  })
}
