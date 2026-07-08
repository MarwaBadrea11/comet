/**
 * Comment query and mutation hooks.
 *
 * usePostComments  — derives comments from the cached post detail
 * useMyComments    — GET /comment (all accessible comments for user)
 * useComment       — GET /comment/:id (single comment)
 * useCreateComment — POST /comment, appends to the post's comment list
 * useUpdateComment — PATCH /comment/:id, edits the text of an existing comment
 * useDeleteComment — DELETE /comment/:id, deletes a comment completely
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsService } from '../services/comments'
import { postsService, type Comment, type Post } from '../services/posts'
import { queryKeys } from '../lib/queryKeys'

/**
 * Query: Get My Comments
 * 
 * GET /comment - Returns all accessible comments for the logged-in user
 * Backend filters by group membership and non-deleted posts
 * 
 * @example
 * const { data: myComments } = useMyComments()
 */
export function useMyComments() {
  return useQuery({
    queryKey: queryKeys.comments.mine(),
    queryFn: commentsService.getMyComments,
    staleTime: 30_000, // 30 seconds
  })
}

/**
 * Query: Get Single Comment
 * 
 * GET /comment/:id - Fetches a single comment by ID
 * 
 * @example
 * const { data: comment } = useComment('123')
 */
export function useComment(commentId: string) {
  return useQuery({
    queryKey: queryKeys.comments.byId(commentId),
    queryFn: () => commentsService.getComment(commentId),
    enabled: !!commentId,
  })
}

/**
 * Derive comments from the already-cached post detail.
 * Falls back to re-fetching the post if it isn't in cache yet.
 */
export function usePostComments(postId: string) {
  const qc = useQueryClient()

  return useQuery({
    queryKey: queryKeys.comments.byPost(postId),
    queryFn: async () => {
      // Try to reuse what's already in the post detail cache
      const cached = qc.getQueryData<Post>(queryKeys.posts.byId(postId))
      if (cached?.comments) return cached.comments

      // Not cached — fetch the full post to get its comments
      const post = await postsService.getPost(postId)
      return post.comments ?? []
    },
    enabled: !!postId,
  })
}

// ── Create comment ────────────────────────────────────────────────────────────

interface CreateCommentPayload {
  postId:    string
  userId:    string
  content:   string
  parentId?: string | null
}

export function useCreateComment() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => commentsService.createComment(payload),

    onMutate: async ({ postId, content, userId }) => {
      await qc.cancelQueries({ queryKey: queryKeys.comments.byPost(postId) })

      const previous = qc.getQueryData<Comment[]>(queryKeys.comments.byPost(postId))

      const optimistic: Comment = {
        id:      `optimistic-${Date.now()}`,
        content,
        user:    { id: userId, name: 'You' },
        createdAt: new Date().toISOString(),
      }

      qc.setQueryData<Comment[]>(
        queryKeys.comments.byPost(postId),
        (old) => [optimistic, ...(old ?? [])],
      )

      return { previous }
    },

    onError: (_err, { postId }, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(queryKeys.comments.byPost(postId), ctx.previous)
      }
    },

    onSettled: (_data, _err, { postId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.comments.byPost(postId) })
      qc.invalidateQueries({ queryKey: queryKeys.posts.byId(postId) })
      qc.invalidateQueries({ queryKey: queryKeys.comments.mine() })
    },
  })
}

// ── Update comment ────────────────────────────────────────────────────────────

interface UpdateCommentPayload {
  commentId: string
  postId:    string
  content:   string
}

export function useUpdateComment() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId, content }: UpdateCommentPayload) =>
      commentsService.updateComment(commentId, { content }),

    onSettled: (_data, _err, { postId, commentId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.comments.byPost(postId) })
      qc.invalidateQueries({ queryKey: queryKeys.comments.byId(commentId) })
      qc.invalidateQueries({ queryKey: queryKeys.posts.byId(postId) })
      qc.invalidateQueries({ queryKey: queryKeys.comments.mine() })
    },
  })
}

// ── Delete comment ────────────────────────────────────────────────────────────

interface DeleteCommentPayload {
  commentId: string
  postId:    string
}

export function useDeleteComment() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ commentId }: DeleteCommentPayload) =>
      commentsService.deleteComment(commentId),

    onSettled: (_data, _err, { postId, commentId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.comments.byPost(postId) })
      qc.invalidateQueries({ queryKey: queryKeys.comments.byId(commentId) })
      qc.invalidateQueries({ queryKey: queryKeys.posts.byId(postId) })
      qc.invalidateQueries({ queryKey: queryKeys.comments.mine() })
    },
  })
}