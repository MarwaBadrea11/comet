/**
 * Groups query and mutation hooks.
 *
 * useGroups    — GET /group
 * useGroup     — GET /group/:id
 * useJoinGroup — POST /group/:id/join  (optimistic role assignment)
 * useLeaveGroup — POST /group/:id/leave  (optimistic removal from joined list)
 * useCreateGroup — POST /group
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsService, type Group } from '../services/groups'
import { queryKeys } from '../lib/queryKeys'

export function useGroups() {
  return useQuery({
    queryKey: queryKeys.groups.all(),
    queryFn:  groupsService.getAll,
  })
}

export function useGroup(id: string) {
  return useQuery({
    queryKey: queryKeys.groups.byId(id),
    queryFn:  () => groupsService.getById(id),
    enabled:  !!id,
  })
}

// ── Join group ────────────────────────────────────────────────────────────────

export function useJoinGroup() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (groupId: string) => groupsService.join(groupId),

    onMutate: async (groupId) => {
      await qc.cancelQueries({ queryKey: queryKeys.groups.all() })
      const previous = qc.getQueryData<Group[]>(queryKeys.groups.all())

      qc.setQueryData<Group[]>(queryKeys.groups.all(), (old) =>
        (old ?? []).map((g) =>
          g.id === groupId ? { ...g, role: 'Member' } : g,
        ),
      )

      return { previous }
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.groups.all(), ctx.previous)
    },

    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.groups.all() }),
  })
}

// ── Leave group ───────────────────────────────────────────────────────────────

export function useLeaveGroup() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (groupId: string) => groupsService.leave(groupId),

    onMutate: async (groupId) => {
      await qc.cancelQueries({ queryKey: queryKeys.groups.all() })
      const previous = qc.getQueryData<Group[]>(queryKeys.groups.all())

      qc.setQueryData<Group[]>(queryKeys.groups.all(), (old) =>
        (old ?? []).map((g) =>
          g.id === groupId ? { ...g, role: null } : g,
        ),
      )

      return { previous }
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.groups.all(), ctx.previous)
    },

    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.groups.all() }),
  })
}

// ── Create group ──────────────────────────────────────────────────────────────

export function useCreateGroup() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: groupsService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.groups.all() }),
  })
}
