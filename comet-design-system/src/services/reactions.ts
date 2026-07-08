/**
 * Reactions Service
 * Maps to /reaction/* endpoints
 * 
 * Backend Reference:
 * - Base URL: http://localhost:8000/reaction
 * - Controller: apps/api/src/reaction/reaction.controller.ts
 * - Service: apps/api/src/reaction/reaction.service.ts
 */

import api from './api'
import type {
  ToggleReactionRequest,
  ToggleReactionResponse,
  GetMyReactionsResponse,
  ReactionType,
  ReactableType,
} from '../types'

// ── API Service ──────────────────────────────────────────────────────────────

export const reactionsService = {
  /**
   * POST /reaction - Toggle Reaction
   * 
   * Backend Behavior:
   * - If no reaction exists: Creates new reaction
   * - If reaction exists with SAME reactionType: Deletes the reaction (toggle off)
   * - If reaction exists with DIFFERENT reactionType: Updates to new type
   * - User ID is extracted from Bearer token (req.user.id)
   * - reactionType defaults to 'LIKE' if not provided
   * 
   * @param reactableId - ID of post or comment (string, converted to BigInt on backend)
   * @param reactableType - Must be 'POST' or 'COMMENT'
   * @param reactionType - Optional, defaults to 'LIKE'
   * @returns Created, updated, or deleted reaction object
   * 
   * @example
   * // React with LOVE to a post
   * await reactionsService.toggleReaction({
   *   reactableId: '1024',
   *   reactableType: 'POST',
   *   reactionType: 'LOVE'
   * })
   * 
   * // Toggle LIKE on a comment (default reaction type)
   * await reactionsService.toggleReaction({
   *   reactableId: '42',
   *   reactableType: 'COMMENT',
   * })
   */
  toggleReaction: async (payload: ToggleReactionRequest): Promise<ToggleReactionResponse> => {
    const { data } = await api.post<ToggleReactionResponse>('/reaction', payload)
    return data
  },

  /**
   * GET /reaction - Get My Reactions
   * 
   * Backend Behavior:
   * - Returns ALL reactions created by the logged-in user
   * - User ID extracted from Bearer token (req.user.id)
   * - Does NOT filter by post or comment - returns complete reaction history
   * - Useful for checking if user has already reacted to items
   * 
   * @returns Array of all user's reactions
   * 
   * @example
   * const myReactions = await reactionsService.getMyReactions()
   * // Check if user has reacted to a specific post
   * const hasReacted = myReactions.some(r => 
   *   r.reactableId === '1024' && r.reactableType === 'POST'
   * )
   */
  getMyReactions: async (): Promise<GetMyReactionsResponse> => {
    const { data } = await api.get<GetMyReactionsResponse>('/reaction')
    return data
  },
}

// ── Helper Utilities ─────────────────────────────────────────────────────────

/**
 * Helper: Create optimistic reaction payload for UI updates
 * Useful for optimistic updates in TanStack Query mutations
 */
export const createOptimisticReaction = (
  reactableId: string,
  reactableType: ReactableType,
  reactionType: ReactionType,
  userId: string,
): ToggleReactionResponse => ({
  id: `temp-${Date.now()}`, // Temporary ID for optimistic update
  userId,
  reactableId,
  reactableType,
  reactionType,
  createdAt: new Date().toISOString(),
  deletedAt: null,
})

/**
 * Helper: Check if user has reacted to a specific entity
 */
export const hasUserReacted = (
  reactions: GetMyReactionsResponse,
  reactableId: string,
  reactableType: ReactableType,
): boolean => {
  return reactions.some(
    (r) => r.reactableId === reactableId && r.reactableType === reactableType && !r.deletedAt,
  )
}

/**
 * Helper: Get user's reaction type for a specific entity
 */
export const getUserReactionType = (
  reactions: GetMyReactionsResponse,
  reactableId: string,
  reactableType: ReactableType,
): ReactionType | null => {
  const reaction = reactions.find(
    (r) => r.reactableId === reactableId && r.reactableType === reactableType && !r.deletedAt,
  )
  return reaction?.reactionType ?? null
}
