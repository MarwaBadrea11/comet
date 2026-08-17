/**
 * Story query and mutation hooks.
 * Maps to /story/* endpoints.
 *
 * Queries:
 * useStoriesFeed — GET /story/feed  (active stories from self + friends, grouped by author)
 * useMyStories   — GET /story/mine?includeExpired=
 * useStory       — GET /story/:id
 *
 * Mutations:
 * useUploadStory — POST /story/upload (multipart/form-data)
 * useCreateStory — POST /story
 * useUpdateStory — PATCH /story/:id
 * useDeleteStory — DELETE /story/:id (with optimistic removal)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { storiesService } from '../services/stories'
import { queryKeys } from '../lib/queryKeys'
import type { CreateStoryPayload, UpdateStoryPayload, StoryGroup } from '../types'

// ── Queries ───────────────────────────────────────────────────────────────────

export function useStoriesFeed() {
  return useQuery({
    queryKey: queryKeys.stories.feed(),
    queryFn: storiesService.getFeed,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useMyStories(includeExpired = false) {
  return useQuery({
    queryKey: queryKeys.stories.mine(includeExpired),
    queryFn: () => storiesService.getMine(includeExpired),
  })
}

export function useStory(id: string) {
  return useQuery({
    queryKey: queryKeys.stories.byId(id),
    queryFn: () => storiesService.getById(id),
    enabled: !!id,
  })
}

// ── Create story ──────────────────────────────────────────────────────────────

export function useUploadStory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => storiesService.uploadStory(formData),
    onSuccess: () => {
      // Only invalidate story queries, NOT post feed
      qc.invalidateQueries({ queryKey: queryKeys.stories.feed() })
      qc.invalidateQueries({ queryKey: queryKeys.stories.mine(false) })
    },
  })
}

export function useCreateStory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateStoryPayload) => storiesService.createStory(payload),
    onSuccess: () => {
      // Only invalidate story queries, NOT post feed
      qc.invalidateQueries({ queryKey: queryKeys.stories.feed() })
      qc.invalidateQueries({ queryKey: queryKeys.stories.mine(false) })
    },
  })
}

// ── Update story ──────────────────────────────────────────────────────────────

export function useUpdateStory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateStoryPayload & { id: string }) =>
      storiesService.updateStory(id, payload),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.stories.byId(String(updated.id)), updated)
      qc.invalidateQueries({ queryKey: queryKeys.stories.feed() })
    },
  })
}

// ── Delete story (with optimistic removal) ────────────────────────────────────

export function useDeleteStory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => storiesService.deleteStory(id),

    onMutate: async (id) => {
      // Cancel outgoing queries
      await qc.cancelQueries({ queryKey: queryKeys.stories.feed() })

      // Snapshot previous state
      const previousFeed = qc.getQueryData<StoryGroup[]>(queryKeys.stories.feed())

      // Optimistically remove the story from the feed
      if (previousFeed) {
        qc.setQueryData<StoryGroup[]>(
          queryKeys.stories.feed(),
          previousFeed
            .map((group) => ({
              ...group,
              stories: group.stories.filter((story) => String(story.id) !== id),
            }))
            .filter((group) => group.stories.length > 0), // Remove empty groups
        )
      }

      return { previousFeed }
    },

    onError: (_err, _id, context) => {
      // Roll back to previous state on error
      if (context?.previousFeed) {
        qc.setQueryData(queryKeys.stories.feed(), context.previousFeed)
      }
    },

    onSettled: (_, __, id) => {
      // Clean up and revalidate
      qc.removeQueries({ queryKey: queryKeys.stories.byId(id) })
      qc.invalidateQueries({ queryKey: queryKeys.stories.feed() })
      qc.invalidateQueries({ queryKey: queryKeys.stories.mine(false) })
      qc.invalidateQueries({ queryKey: queryKeys.stories.mine(true) })
    },
  })
}
