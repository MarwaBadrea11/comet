/**
 * Comments Service
 * Maps to /comment/* endpoints
 * 
 * Backend Reference:
 * - Base URL: http://localhost:8000/comment
 * - Controller: apps/api/src/comment/comment.controller.ts
 * - Service: apps/api/src/comment/comment.service.ts
 */

import api from './api'
import type {
  Comment,
  CreateCommentRequest,
  CreateCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
  DeleteCommentResponse,
  GetMyCommentsResponse,
  GetCommentResponse,
} from '../types'

// ── API Service ──────────────────────────────────────────────────────────────

export const commentsService = {
  /**
   * POST /comment - Create Comment
   * 
   * Backend Behavior:
   * - postId: Required, validated as existing post
   * - userId: Required in request body (⚠️ security note: should ideally use JWT)
   * - parentId: Optional - for nested replies. Null/undefined = top-level comment
   * - content: Required, hashtags extracted automatically by backend
   * - isEdited: Should NOT be provided on creation (always false for new comments)
   * - Backend triggers engagement score tracking
   * - Throws NotFoundException if post doesn't exist
   * 
   * @param payload - Comment creation data
   * @returns Created comment object
   * 
   * @example
   * // Create top-level comment
   * await commentsService.createComment({
   *   postId: '1',
   *   userId: '1',
   *   content: 'This is a great post!'
   * })
   * 
   * // Create nested reply
   * await commentsService.createComment({
   *   postId: '1',
   *   userId: '1',
   *   content: 'I agree!',
   *   parentId: '2'
   * })
   */
  createComment: async (payload: CreateCommentRequest): Promise<CreateCommentResponse> => {
    const { data } = await api.post<CreateCommentResponse>('/comment', payload)
    return data
  },

  /**
   * PATCH /comment/:id - Update Comment
   * 
   * Backend Behavior:
   * - All fields are optional (partial update)
   * - If content is updated, backend AUTOMATICALLY sets isEdited: true
   * - Do NOT need to manually send isEdited when updating content
   * - postId, userId, parentId CAN be updated but shouldn't be in practice
   * 
   * @param id - Comment ID (string, converted to BigInt on backend)
   * @param payload - Fields to update
   * @returns Updated comment object
   * 
   * @example
   * // Update comment content (isEdited set automatically)
   * await commentsService.updateComment('1', {
   *   content: 'Updated comment text'
   * })
   */
  updateComment: async (id: string, payload: UpdateCommentRequest): Promise<UpdateCommentResponse> => {
    const { data } = await api.patch<UpdateCommentResponse>(`/comment/${id}`, payload)
    return data
  },

  /**
   * DELETE /comment/:id - Delete Comment
   * 
   * Backend Behavior:
   * - Hard delete (permanent removal, not soft delete)
   * - Cascading delete handles related data
   * - Replies may be deleted or orphaned depending on DB constraints
   * 
   * @param id - Comment ID to delete
   * @returns Deleted comment object
   * 
   * @example
   * await commentsService.deleteComment('1')
   */
  deleteComment: async (id: string): Promise<DeleteCommentResponse> => {
    const { data } = await api.delete<DeleteCommentResponse>(`/comment/${id}`)
    return data
  },

  /**
   * GET /comment - Get My Comments
   * 
   * Backend Behavior:
   * - Requires Bearer token authentication
   * - Returns comments where user is member of the post's group (if grouped)
   * - Filters out deleted posts (deletedAt: null)
   * - User ID extracted from JWT token (req.user.id)
   * - Despite name "findAll", returns FILTERED comments, not all system comments
   * 
   * @returns Array of accessible comments
   * 
   * @example
   * const myComments = await commentsService.getMyComments()
   */
  getMyComments: async (): Promise<GetMyCommentsResponse> => {
    const { data } = await api.get<GetMyCommentsResponse>('/comment')
    return data
  },

  /**
   * GET /comment/:id - Get Single Comment
   * 
   * @param id - Comment ID
   * @returns Single comment object
   * 
   * @example
   * const comment = await commentsService.getComment('1')
   */
  getComment: async (id: string): Promise<GetCommentResponse> => {
    const { data } = await api.get<GetCommentResponse>(`/comment/${id}`)
    return data
  },
}

// ── Helper Utilities ─────────────────────────────────────────────────────────

/**
 * Helper: Build threaded comment structure from flat list
 * Converts flat array of comments into nested structure for UI
 * 
 * @param comments - Flat array of comments
 * @param parentId - Parent ID to filter by (null for top-level)
 * @param depth - Current nesting depth
 * @returns Nested comment thread structure
 */
export const buildCommentThread = (
  comments: Comment[],
  parentId: string | null = null,
  depth = 0,
): Array<{ comment: Comment; replies: any[]; depth: number }> => {
  return comments
    .filter((c) => c.parentId === parentId)
    .map((comment) => ({
      comment,
      replies: buildCommentThread(comments, comment.id, depth + 1),
      depth,
    }))
}

/**
 * Helper: Create optimistic comment for UI
 * Useful for optimistic updates in TanStack Query mutations
 */
export const createOptimisticComment = (
  postId: string,
  userId: string,
  content: string,
  parentId?: string | null,
): Comment => {
  const now = new Date().toISOString()
  return {
    id: `temp-${Date.now()}`,
    postId,
    userId,
    parentId: parentId ?? null,
    content,
    isEdited: false,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  }
}

/**
 * Helper: Count total comments including nested replies
 */
export const countTotalComments = (comments: Comment[]): number => {
  let count = comments.length
  comments.forEach((comment) => {
    if (comment.replies) {
      count += countTotalComments(comment.replies)
    }
  })
  return count
}

/**
 * Helper: Find comment by ID in nested structure
 */
export const findCommentById = (comments: Comment[], id: string): Comment | null => {
  for (const comment of comments) {
    if (comment.id === id) return comment
    if (comment.replies) {
      const found = findCommentById(comment.replies, id)
      if (found) return found
    }
  }
  return null
}
