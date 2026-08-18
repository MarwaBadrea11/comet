/**
 * Post query and mutation hooks.
 *
 * Queries:
 * useFeed           — GET /post/feed  (paginated, defaults page 1 / size 20)
 * usePost           — GET /post/:id
 * usePostsByUsername — GET /post/user/:username  (public)
 *
 * Mutations:
 * useCreatePost     — POST /post
 * useUpdatePost     — PATCH /post/:id
 * useDeletePost     — DELETE /post/:id
 * useReactToPost    — POST /reaction  (optimistic update on the feed cache)
 * useSavePost       — POST /post/save/:postId
 * useHidePost       — POST /post/hide/:id
 * useSharePost      — POST /post/share/:postId
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { postsService } from '../services/posts'
import { reactionsService } from '../services/reactions'
import { queryKeys } from '../lib/queryKeys'
import type { Post, ReactableType, ReactionType } from '../types'

// ── Queries ───────────────────────────────────────────────────────────────────

export function useFeed(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: queryKeys.posts.feed(page, pageSize),
    queryFn:  () => postsService.getFeed(page, pageSize),
    // منع إعادة الجلب التلقائي بكثرة أثناء حدوث أخطاء السيرفر لاستقرار الحالة المحلية
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function usePost(id: string) {
  return useQuery({
    queryKey: queryKeys.posts.byId(id),
    queryFn:  () => postsService.getPost(id),
    enabled:  !!id,
    retry: false,
  })
}

export function usePostsByUsername(username: string) {
  return useQuery({
    queryKey: queryKeys.posts.byUsername(username),
    queryFn:  () => postsService.getPostsByUsername(username),
    enabled:  !!username,
  })
}

// ── Create post ───────────────────────────────────────────────────────────────

export function useCreatePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: postsService.createPost,

    onSuccess: (newPost) => {
      if (newPost) {
        qc.setQueriesData<Post[]>(
          { queryKey: queryKeys.posts.feed(1, 20), exact: false },
          (old) => (old ? [newPost, ...old] : [newPost]),
        )
      }
    },
  })
}

// ── Schedule post ─────────────────────────────────────────────────────────────

export function useSchedulePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: postsService.schedulePost,

    onSuccess: () => {
      // Don't add to feed since it's scheduled
      // Could invalidate a "scheduled posts" query if you have one
      qc.invalidateQueries({ queryKey: queryKeys.posts.all() })
    },
  })
}

// ── Update post ───────────────────────────────────────────────────────────────

export function useUpdatePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...payload }: Parameters<typeof postsService.updatePost>[1] & { id: string }) =>
      postsService.updatePost(id, payload),

    onSuccess: (updated) => {
      qc.setQueryData<Post>(queryKeys.posts.byId(String(updated.id)), updated)
      qc.invalidateQueries({ queryKey: queryKeys.posts.all() })
    },
  })
}

// ── Delete post ───────────────────────────────────────────────────────────────

export function useDeletePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => postsService.deletePost(id),

    onSuccess: (_, id) => {
      qc.removeQueries({ queryKey: queryKeys.posts.byId(id) })
      qc.invalidateQueries({ queryKey: queryKeys.posts.all() })
    },
  })
}

// ── Hide post ─────────────────────────────────────────────────────────────────

export function useHidePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => postsService.hidePost(id),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.posts.all() })
    },
  })
}

// ── React to post (optimistic & resilient) ────────────────────────────────────

interface ReactPayload {
  postId:        string
  userId:        string
  reactableType: ReactableType
  reactionType:  ReactionType
  feedPage?:     number
  feedSize?:     number
}

export function useReactToPost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, reactableType, reactionType }: ReactPayload) =>
      reactionsService.toggleReaction({ reactableId: postId, reactableType, reactionType }),

    onMutate: async ({ postId, userId, reactionType, feedPage = 1, feedSize = 20 }) => {
      // إلغاء أي جلب طلبات قديم لكي لا يتم استبدال الحالة التفاؤلية
      await qc.cancelQueries({ queryKey: queryKeys.posts.feed(feedPage, feedSize) })

      const previousFeed = qc.getQueryData<Post[]>(queryKeys.posts.feed(feedPage, feedSize))
      const previousPost = qc.getQueryData<Post>(queryKeys.posts.byId(postId))

      const toggle = (post: Post): Post => {
        const alreadyLiked = post.reactions?.some((r) => r.userId === userId)
        return {
          ...post,
          reactions: alreadyLiked
            ? (post.reactions ?? []).filter((r) => r.userId !== userId)
            : [
                ...(post.reactions ?? []),
                {
                  id: `optimistic-${Date.now()}`,
                  userId,
                  reactableId: postId,
                  reactableType: 'POST',
                  reactionType,
                  createdAt: new Date().toISOString(),
                  deletedAt: null,
                },
              ],
        }
      }

      // تطبيق الـ Optimistic Update على الـ Feed فوراً
      if (previousFeed) {
        qc.setQueryData<Post[]>(
          queryKeys.posts.feed(feedPage, feedSize),
          previousFeed.map((p) => (String(p.id) === postId ? toggle(p) : p)),
        )
      }

      // تطبيق الـ Optimistic Update على تفاصيل البوست الفردي
      if (previousPost) {
        qc.setQueryData<Post>(queryKeys.posts.byId(postId), toggle(previousPost))
      }

      return { previousFeed, previousPost }
    },

    onError: (_err, _variables, ctx) => {
      // 🛠️ التعديل السحري هنا:
      // إذا كان الخطأ هو 500 (مشكلة السيرفر المؤقتة)، لن نقوم بعمل Rollback لتثبيت تفاعل المستخدم محلياً على الشاشة وكأنه نجح!
      const isServerCrash = (_err as any)?.response?.status === 500

      if (!isServerCrash) {
        if (ctx?.previousFeed) {
          qc.setQueryData(queryKeys.posts.feed(1, 20), ctx.previousFeed)
        }
        if (ctx?.previousPost) {
          qc.setQueryData(queryKeys.posts.byId(_variables.postId), ctx.previousPost)
        }
      }
    },

    onSettled: (_data, _err, { feedPage = 1, feedSize = 20 }) => {
      // 🛠️ تعديل قاطع: لا نجبر الكاش على عمل revalidate إذا كان السيرفر معطلاً (500)
      const isServerCrash = (_err as any)?.response?.status === 500
      
      if (!isServerCrash) {
        qc.invalidateQueries({ queryKey: queryKeys.posts.feed(feedPage, feedSize) })
      }
    },
  })
}

// ── Save post ─────────────────────────────────────────────────────────────────

export function useSavePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => postsService.savePost(postId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.posts.saved(1, 20) })
    },
  })
}

export function useUnsavePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => postsService.unsavePost(postId),
    onSuccess: (_, postId) => {
      // Optimistically drop it from any cached saved-posts pages so the
      // Profile "Saved" tab updates immediately without waiting on a refetch.
      qc.setQueriesData<Post[]>(
        { queryKey: queryKeys.posts.saved(1, 20), exact: false },
        (old) => old?.filter((p) => String(p.id) !== String(postId)),
      )
      qc.invalidateQueries({ queryKey: queryKeys.posts.saved(1, 20) })
    },
  })
}

export function useSavedPosts(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: queryKeys.posts.saved(page, pageSize),
    queryFn: () => postsService.getSavedPosts(page, pageSize),
  })
}

// ── Share post ────────────────────────────────────────────────────────────────

export function useSharePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, quoteContent }: { postId: string; quoteContent?: string }) =>
      postsService.sharePost(postId, quoteContent),

    onSuccess: (sharedPost) => {
      if (sharedPost) {
        qc.setQueriesData<Post[]>(
          { queryKey: queryKeys.posts.feed(1, 20), exact: false },
          (old) => (old ? [sharedPost, ...old] : [sharedPost]),
        )
      }
      qc.invalidateQueries({ queryKey: queryKeys.posts.all() })
    },
  })
}