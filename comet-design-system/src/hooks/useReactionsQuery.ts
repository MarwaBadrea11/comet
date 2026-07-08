/**
 * TanStack Query hooks for Reactions
 * Maps to /reaction/* endpoints
 * 
 * Backend Reference:
 * - GET  /reaction     → getMyReactions (all user reactions)
 * - POST /reaction     → toggleReaction (create/update/delete)
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reactionsService } from '../services'
import { queryKeys } from '../lib/queryKeys'
import type { ToggleReactionRequest, ReactionType, ReactableType } from '../types'

// ── Queries ──────────────────────────────────────────────────────────────────

/**
 * Query: Get My Reactions
 * 
 * Fetches all reactions created by the logged-in user.
 * Useful for checking if user has already reacted to posts/comments.
 * 
 * Backend: GET /reaction
 * - Requires Bearer token
 * - Returns complete reaction history for user
 * 
 * @example
 * const { data: myReactions } = useMyReactionsQuery()
 * 
 * // Check if user reacted to a specific post
 * const hasReacted = myReactions?.some(r => 
 *   r.reactableId === postId && r.reactableType === 'POST'
 * )
 */
export const useMyReactionsQuery = () => {
  return useQuery({
    queryKey: queryKeys.reactions.mine(),
    queryFn: reactionsService.getMyReactions,
    staleTime: 30_000, // 30 seconds - reactions change frequently
    gcTime: 5 * 60_000, // 5 minutes cache
  })
}

// ── Mutations ────────────────────────────────────────────────────────────────

/**
 * Mutation: Toggle Reaction
 * 
 * Creates, updates, or deletes a reaction (toggle behavior).
 * Backend behavior:
 * - No reaction exists → Creates new reaction
 * - Same reactionType → Deletes reaction (toggle off)
 * - Different reactionType → Updates to new type
 * 
 * Backend: POST /reaction
 * 
 * @example
 * const toggleReaction = useToggleReactionMutation()
 * 
 * // React with LOVE to a post
 * toggleReaction.mutate({
 *   reactableId: '1024',
 *   reactableType: 'POST',
 *   reactionType: 'LOVE'
 * })
 * 
 * // Toggle LIKE on a comment
 * toggleReaction.mutate({
 *   reactableId: '42',
 *   reactableType: 'COMMENT',
 *   reactionType: 'LIKE'
 * })
 */
export const useToggleReactionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reactionsService.toggleReaction,
    onSuccess: () => {
      // Invalidate my reactions to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.reactions.mine() })
      
      // Also invalidate posts feed to update reaction counts
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.feed(1, 20) })
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all() })
    },
    onError: (error) => {
      console.error('Failed to toggle reaction:', error)
    },
  })
}

// ── Optimistic Mutations ─────────────────────────────────────────────────────

/**
 * Mutation: Toggle Reaction with Optimistic Update
 * 
 * Same as useToggleReactionMutation but with optimistic UI updates
 * for instant feedback without waiting for server response.
 * 
 * @example
 * const toggleReaction = useToggleReactionOptimistic()
 * 
 * toggleReaction.mutate({
 *   reactableId: '1024',
 *   reactableType: 'POST',
 *   reactionType: 'LOVE',
 *   userId: currentUser.id // Required for optimistic update
 * })
 */
export const useToggleReactionOptimistic = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reactionsService.toggleReaction,
    
    // Optimistic update
    onMutate: async (variables: ToggleReactionRequest & { userId: string }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.reactions.mine() })

      // Snapshot previous value
      const previousReactions = queryClient.getQueryData(queryKeys.reactions.mine())

      // Optimistically update
      queryClient.setQueryData(queryKeys.reactions.mine(), (old: any[] = []) => {
        const existing = old.find(
          (r) =>
            r.reactableId === variables.reactableId &&
            r.reactableType === variables.reactableType &&
            !r.deletedAt,
        )

        if (existing) {
          // Same type = remove (toggle off)
          if (existing.reactionType === variables.reactionType) {
            return old.filter((r) => r.id !== existing.id)
          }
          // Different type = update
          return old.map((r) =>
            r.id === existing.id ? { ...r, reactionType: variables.reactionType } : r,
          )
        }

        // New reaction
        return [
          ...old,
          {
            id: `temp-${Date.now()}`,
            userId: variables.userId,
            reactableId: variables.reactableId,
            reactableType: variables.reactableType,
            reactionType: variables.reactionType || 'LIKE',
            createdAt: new Date().toISOString(),
            deletedAt: null,
          },
        ]
      })

      return { previousReactions }
    },

    // Rollback on error
    onError: (_err, _variables, context) => {
      if (context?.previousReactions) {
        queryClient.setQueryData(queryKeys.reactions.mine(), context.previousReactions)
      }
    },

    // Refetch on settle
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reactions.mine() })
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all() })
    },
  })
}

// ── Helper Hooks ─────────────────────────────────────────────────────────────

/**
 * Hook: Get User Reaction Status for a specific entity
 * 
 * Checks if user has reacted and returns the reaction type.
 * 
 * @param reactableId - Post or comment ID
 * @param reactableType - 'POST' or 'COMMENT'
 * @returns { hasReacted, reactionType, isLoading }
 * 
 * @example
 * const { hasReacted, reactionType } = useUserReactionStatus('1024', 'POST')
 * 
 * if (hasReacted) {
 *   console.log(`User reacted with ${reactionType}`)
 * }
 */
export const useUserReactionStatus = (reactableId: string, reactableType: ReactableType) => {
  const { data: reactions, isLoading } = useMyReactionsQuery()

  const reaction = reactions?.find(
    (r) => r.reactableId === reactableId && r.reactableType === reactableType && !r.deletedAt,
  )

  return {
    hasReacted: !!reaction,
    reactionType: reaction?.reactionType || null,
    reactionId: reaction?.id || null,
    isLoading,
  }
}
