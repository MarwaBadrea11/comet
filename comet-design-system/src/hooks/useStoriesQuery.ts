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
 * useCreateStory — POST /story
 * useUpdateStory — PATCH /story/:id
 * useDeleteStory — DELETE /story/:id
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { storiesService } from '../services/stories'
import { queryKeys } from '../lib/queryKeys'
import type { CreateStoryRequest, UpdateStoryRequest } from '../types'

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

export function useCreateStory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateStoryRequest) => storiesService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.stories.feed() })
    },
  })
}

// ── Update story ──────────────────────────────────────────────────────────────

export function useUpdateStory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateStoryRequest & { id: string }) =>
      storiesService.update(id, payload),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.stories.byId(String(updated.id)), updated)
      qc.invalidateQueries({ queryKey: queryKeys.stories.feed() })
    },
  })
}

// ── Delete story ──────────────────────────────────────────────────────────────

export function useDeleteStory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => storiesService.remove(id),
    onSuccess: (_, id) => {
      qc.removeQueries({ queryKey: queryKeys.stories.byId(id) })
      qc.invalidateQueries({ queryKey: queryKeys.stories.feed() })
    },
  })
}
