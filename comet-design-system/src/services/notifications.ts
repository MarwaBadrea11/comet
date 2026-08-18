/**
 * Notifications service.
 * Maps to /notification/* endpoints.
 *
 * Backend Reference: apps/api/src/notification/*
 * Notification.type is a free-form string column — these are the literals
 * every producer in the backend actually writes today:
 *   - FRIEND_REQUEST          (friendship.service.ts:sentrequest)
 *   - FRIEND_REQUEST_ACCEPTED (friendship.service.ts:approveFriendRequest)
 *   - MENTION                 (comment.service.ts:create, @handle in content)
 *   - MESSAGE                 (message.service.ts:sendMessage)
 *   - LIKE                    (reaction.service.ts:toggleReaction)
 *   - COMMENT                 (comment.service.ts:create)
 */

import api from './api'

export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'FRIEND_REQUEST_ACCEPTED'
  | 'MENTION'
  | 'MESSAGE'
  | 'LIKE'
  | 'COMMENT'

// "Direct" = personal interactions aimed at you specifically.
// "Activity" = engagement on content you posted.
export type NotificationCategory = 'direct' | 'activity'

const ACTIVITY_TYPES = new Set<string>(['LIKE', 'COMMENT'])

export function categorizeNotification(type: string): NotificationCategory {
  return ACTIVITY_TYPES.has(type) ? 'activity' : 'direct'
}

export interface NotificationActor {
  id: string
  username: string
  name: string
  avatarMediaId?: string | null
}

export interface Notification {
  id: string
  userId: string
  actorId?: string | null
  actor?: NotificationActor | null
  type: NotificationType | string
  /** Parsed from the backend's JSON-string `data` column. Shape depends on `type`. */
  data?: Record<string, any> | null
  entityId?: string | null
  entityType?: string | null
  isRead: boolean
  createdAt: string
}

function parseNotification(raw: any): Notification {
  let data: Record<string, any> | null = null
  if (raw?.data) {
    if (typeof raw.data === 'string') {
      try { data = JSON.parse(raw.data) } catch { data = null }
    } else {
      data = raw.data
    }
  }
  return { ...raw, data }
}

export const notificationsService = {
  /**
   * GET /notification
   */
  getAll: async (): Promise<Notification[]> => {
    const { data } = await api.get('/notification')
    const list = Array.isArray(data) ? data : data?.notifications ?? []
    return list.map(parseNotification)
  },

  /**
   * GET /notification/:id
   */
  getById: async (id: string): Promise<Notification> => {
    const { data } = await api.get(`/notification/${id}`)
    return parseNotification(data)
  },

  /**
   * PATCH /notification/:id — mark as read
   */
  markRead: async (id: string): Promise<Notification> => {
    const { data } = await api.patch(`/notification/${id}`, { isRead: true })
    return parseNotification(data)
  },

  /**
   * DELETE /notification/:id
   */
  remove: async (id: string): Promise<void> => {
    await api.delete(`/notification/${id}`)
  },
}
