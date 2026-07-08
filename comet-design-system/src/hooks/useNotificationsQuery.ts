/**
 * Notifications query and mutation hooks.
 *
 * useNotifications — GET /notification
 *   Also syncs the unread count into uiStore so the TopBar badge stays current.
 *
 * useMarkNotificationRead  — PATCH /notification/:id
 * useMarkAllRead            — marks all unread via Promise.allSettled
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { notificationsService, type Notification } from '../services/notifications'
import { queryKeys } from '../lib/queryKeys'
import { useUIStore } from '../stores/uiStore'

export function useNotifications() {
  const setUnread = useUIStore((s) => s.setUnreadNotifications)

  const query = useQuery({
    queryKey: queryKeys.notifications.all(),
    queryFn:  notificationsService.getAll,
    staleTime: 30_000,
    refetchInterval: 60_000, // poll every minute
  })

  // Keep the badge count in sync whenever data changes
  useEffect(() => {
    if (query.data) {
      setUnread(query.data.filter((n) => !n.isRead).length)
    }
  }, [query.data, setUnread])

  return query
}

// ── Mark one read ─────────────────────────────────────────────────────────────

export function useMarkNotificationRead() {
  const qc        = useQueryClient()
  const decrement = useUIStore((s) => s.decrementUnread)

  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.notifications.all() })
      const previous = qc.getQueryData<Notification[]>(queryKeys.notifications.all())

      qc.setQueryData<Notification[]>(
        queryKeys.notifications.all(),
        (old) => (old ?? []).map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      )

      decrement()
      return { previous }
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.notifications.all(), ctx.previous)
    },
  })
}

// ── Mark all read ─────────────────────────────────────────────────────────────

export function useMarkAllNotificationsRead() {
  const qc       = useQueryClient()
  const setUnread = useUIStore((s) => s.setUnreadNotifications)

  return useMutation({
    mutationFn: async () => {
      const all = qc.getQueryData<Notification[]>(queryKeys.notifications.all()) ?? []
      const unread = all.filter((n) => !n.isRead)
      await Promise.allSettled(unread.map((n) => notificationsService.markRead(n.id)))
    },

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: queryKeys.notifications.all() })
      const previous = qc.getQueryData<Notification[]>(queryKeys.notifications.all())

      qc.setQueryData<Notification[]>(
        queryKeys.notifications.all(),
        (old) => (old ?? []).map((n) => ({ ...n, isRead: true })),
      )
      setUnread(0)

      return { previous }
    },

    onError: (_err, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(queryKeys.notifications.all(), ctx.previous)
    },
  })
}
