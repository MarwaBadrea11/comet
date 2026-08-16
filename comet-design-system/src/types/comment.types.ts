/**
 * Comment module type definitions.
 * Aligned with backend /comment endpoints.
 * 
 * Backend Reference:
 * - Controller: apps/api/src/comment/comment.controller.ts
 * - Service: apps/api/src/comment/comment.service.ts
 * - Prisma Schema: apps/api/prisma/schema.prisma (Comment model)
 */

// Re-export Comment from post.types to avoid duplication
import type { Comment } from './post.types'
export type { Comment }

// ── Request/Response Types ───────────────────────────────────────────────────

/**
 * POST /comment - Create Comment Request
 * 
 * Backend Reference:
 * - DTO: CreateCommentDto
 * - Controller: @Post() create(@Body() createCommentDto: CreateCommentDto)
 * - Service: create(createCommentDto)
 * 
 * Important Backend Behavior:
 * - postId: Required, string (converted to BigInt internally)
 * - userId: Required in DTO, but should be extracted from JWT token in production
 *   (Currently the backend accepts it from body, but this is a security concern)
 * - parentId: Optional - Used for nested replies. Pass null/undefined for top-level comments
 * - content: Required, string. Backend extracts hashtags automatically
 * - isEdited: Optional boolean - Should NOT be set on creation (always false for new comments)
 * - Backend validates post exists before creating comment
 * - Backend triggers engagement score tracking for user interactions
 */
export interface CreateCommentRequest {
  postId: string
  userId: string // ⚠️ Note: Backend currently requires this, but ideally should use JWT
  parentId?: string | null // Optional - for nested replies
  content: string
  isEdited?: boolean // Should be false or omitted on creation
}

/**
 * POST /comment - Create Comment Response
 * Returns the created Comment object
 */
export type CreateCommentResponse = Comment

/**
 * PATCH /comment/:id - Update Comment Request
 * 
 * Backend Reference:
 * - DTO: UpdateCommentDto (PartialType of CreateCommentDto)
 * - Controller: @Patch(':id') update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto)
 * - Service: update(id, updateCommentDto)
 * 
 * Important Backend Behavior:
 * - All fields are optional (partial update)
 * - If content is updated, backend AUTOMATICALLY sets isEdited: true
 * - Do NOT need to manually pass isEdited when updating content
 * - postId, userId, parentId can technically be updated (but shouldn't be in practice)
 */
export interface UpdateCommentRequest {
  content?: string // Backend auto-sets isEdited: true when content changes
  isEdited?: boolean // Usually not needed - backend handles this
  postId?: string // Not recommended to change
  userId?: string // Not recommended to change
  parentId?: string | null // Not recommended to change
}

/**
 * PATCH /comment/:id - Update Comment Response
 * Returns the updated Comment object
 */
export type UpdateCommentResponse = Comment

/**
 * DELETE /comment/:id - Delete Comment
 * 
 * Backend Reference:
 * - Controller: @Delete(':id') remove(@Param('id') id: string)
 * - Service: remove(id) - Hard delete from database
 * 
 * Important Backend Behavior:
 * - Hard delete (permanent removal, not soft delete)
 * - Cascading delete should handle related data (replies, etc.)
 */
export type DeleteCommentResponse = Comment

/**
 * GET /comment - Get My Comments Response
 * 
 * Backend Reference:
 * - Controller: @Get() findAll(@Req() req)
 * - Service: findAll(userId)
 * 
 * Important Backend Behavior:
 * - Requires Bearer token authentication
 * - Returns comments where the user is a member of the post's group (if grouped)
 * - Filters out deleted posts (deletedAt: null)
 * - User ID extracted from JWT token (req.user.id)
 * - NOTE: Despite the name "findAll", it returns filtered comments, NOT all comments in system
 */
export type GetMyCommentsResponse = Comment[]

/**
 * GET /comment/:id - Get Single Comment Response
 * 
 * Backend Reference:
 * - Controller: @Get(':id') findOne(@Param('id') id: string)
 * - Service: findOne(id)
 * 
 * Returns a single comment by ID
 */
export type GetCommentResponse = Comment

// ── Helper Types ─────────────────────────────────────────────────────────────

/**
 * Comment with nested replies structure
 * Useful for building threaded comment UI
 */
export interface CommentThread {
  comment: Comment
  replies: CommentThread[]
  depth: number
}

/**
 * Comment form values (for UI forms)
 * Simplified version for frontend forms
 */
export interface CommentFormValues {
  content: string
  parentId?: string | null
}
