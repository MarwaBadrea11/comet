/**
 * Reaction module type definitions.
 * Aligned with backend /reaction endpoints.
 * 
 * Backend Reference:
 * - Controller: apps/api/src/reaction/reaction.controller.ts
 * - Service: apps/api/src/reaction/reaction.service.ts
 * - Prisma Schema: apps/api/prisma/schema.prisma (Reaction model)
 */

// Re-export from post.types to avoid duplication
import type { ReactionType, ReactableType, Reaction } from './post.types'
export type { ReactionType, ReactableType, Reaction }

// ── Request/Response Types ───────────────────────────────────────────────────

/**
 * POST /reaction - Toggle Reaction Request
 * 
 * Backend Reference:
 * - DTO: CreateReactionDto
 * - Controller: @Post() create(@Body() createReactionDto: CreateReactionDto)
 * - Service: toggleReaction() - Creates new, updates existing, or deletes if same type
 * 
 * Important Backend Behavior:
 * - reactableId is validated as a string in DTO, converted to BigInt internally
 * - reactableType must be enum value: "POST" or "COMMENT" (case-sensitive)
 * - reactionType is optional - defaults to "LIKE" if not provided
 * - If reaction exists with same reactionType: deletes the reaction (toggle off)
 * - If reaction exists with different reactionType: updates the reaction
 * - If no reaction exists: creates new reaction
 * - User ID is extracted from JWT token (req.user.id), NOT from request body
 */
export interface ToggleReactionRequest {
  reactableId: string
  reactableType: ReactableType
  reactionType?: ReactionType // Optional - defaults to LIKE on backend
}

/**
 * POST /reaction - Toggle Reaction Response
 * 
 * Returns the created/updated Reaction object
 * If deleted (toggle off), returns the deleted Reaction object
 */
export type ToggleReactionResponse = Reaction

/**
 * GET /reaction - Get My Reactions Response
 * 
 * Backend Reference:
 * - Controller: @Get() findOne(@Req() req)
 * - Service: findOne(userId) - Returns all reactions by the logged-in user
 * 
 * Important Backend Behavior:
 * - Requires Bearer token authentication
 * - Returns array of ALL reactions created by the current user
 * - Does NOT filter by post or comment - returns user's complete reaction history
 * - User ID is extracted from JWT token (req.user.id)
 */
export type GetMyReactionsResponse = Reaction[]

// ── Helper Types ─────────────────────────────────────────────────────────────

/**
 * Reaction summary for aggregating reactions on a post/comment
 * Used for displaying reaction counts grouped by type
 */
export interface ReactionSummary {
  reactionType: ReactionType
  count: number
  userIds: string[] // List of user IDs who reacted with this type
}

/**
 * User reaction status for a specific reactable entity
 * Useful for UI to show if current user has reacted and with what type
 */
export interface UserReactionStatus {
  hasReacted: boolean
  reactionType?: ReactionType
  reactionId?: string
}
