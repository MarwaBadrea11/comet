/**
 * Notifications service.
 * Maps to /notification/* endpoints.
 */

import api from './api'

// ── Domain types ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  type?: string
  message?: string
  isRead?: boolean
  createdAt?: string
  actorId?: string
  actor?: { id: string; name: string; avatar?: string }
  targetId?: string
  targetType?: string
}

// ── API calls ────────────────────────────────────────────────────────────────

export const notificationsService = {
  /**
   * GET /notification
   */
  getAll: async (): Promise<Notification[]> => {
    const { data } = await api.get('/notification')
    return Array.isArray(data) ? data : data?.notifications ?? []
  },

  /**
   * GET /notification/:id
   */
  getById: async (id: string): Promise<Notification> => {
    const { data } = await api.get(`/notification/${id}`)
    return data
  },

  /**
   * PATCH /notification/:id  — mark as read
   */
  markRead: async (id: string): Promise<Notification> => {
    const { data } = await api.patch(`/notification/${id}`, { isRead: true })
    return data
  },

  /**
   * DELETE /notification/:id
   */
  remove: async (id: string): Promise<void> => {
    await api.delete(`/notification/${id}`)
  },
}
