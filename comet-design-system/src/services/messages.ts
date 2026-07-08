/**
 * Messaging service — conversations and messages.
 * Maps to /conversation/* and /message/* endpoints.
 */

import api from './api'

// ── Domain types ─────────────────────────────────────────────────────────────

export interface ConversationParticipant {
  id: string
  name: string
  avatar?: string
}

export interface Conversation {
  id: string
  name?: string
  description?: string
  type?: 'DIRECT' | 'GROUP'
  participants?: ConversationParticipant[]
  lastMessage?: MessageItem
  unreadCount?: number
  createdAt?: string
  updatedAt?: string
}

export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE'

export interface MessageItem {
  id: string
  content?: string
  messageType?: MessageType
  conversationId: string
  senderId?: string
  sender?: ConversationParticipant
  replyToId?: string
  createdAt?: string
  updatedAt?: string
}

// ── Conversation API calls ───────────────────────────────────────────────────

export const conversationService = {
  /**
   * POST /conversation
   * Create a new direct or group conversation.
   */
  create: async (payload: {
    participantIds: string[]
    type?: 'DIRECT' | 'GROUP'
    name?: string
  }): Promise<Conversation> => {
    const { data } = await api.post('/conversation', payload)
    return data
  },

  /**
   * GET /conversation/mine
   * All conversations for the authenticated user, with unread counts.
   */
  getMine: async (): Promise<Conversation[]> => {
    const { data } = await api.get('/conversation/mine')
    return Array.isArray(data) ? data : data?.conversations ?? []
  },

  /**
   * GET /conversation/:id
   */
  getById: async (id: string): Promise<Conversation> => {
    const { data } = await api.get(`/conversation/${id}`)
    return data
  },

  /**
   * POST /conversation/:id/leave
   */
  leave: async (id: string): Promise<void> => {
    await api.post(`/conversation/${id}/leave`)
  },
}

// ── Message API calls ────────────────────────────────────────────────────────

export const messageService = {
  /**
   * POST /message
   * Send a message to an existing conversation.
   * Body: { conversationId, content?, messageType?, replyToId?, clientMessageId? }
   */
  send: async (payload: {
    conversationId: string
    content?: string
    messageType?: MessageType
    replyToId?: string
    clientMessageId?: string
  }): Promise<MessageItem> => {
    const { data } = await api.post('/message', payload)
    return data
  },

  /**
   * GET /message/conversation/:conversationId?limit=&beforeId=
   * Paginated message history for a conversation.
   */
  getConversationMessages: async (
    conversationId: string,
    limit?: number,
    beforeId?: string,
  ): Promise<MessageItem[]> => {
    const { data } = await api.get(`/message/conversation/${conversationId}`, {
      params: { ...(limit ? { limit } : {}), ...(beforeId ? { beforeId } : {}) },
    })
    return Array.isArray(data) ? data : data?.messages ?? []
  },

  /**
   * POST /message/conversation/:conversationId/read/:messageId
   * Mark messages as read up to the given message pointer.
   */
  markRead: async (conversationId: string, messageId: string): Promise<void> => {
    await api.post(`/message/conversation/${conversationId}/read/${messageId}`)
  },

  /**
   * PATCH /message/:id
   */
  update: async (id: string, content: string): Promise<MessageItem> => {
    const { data } = await api.patch(`/message/${id}`, { content })
    return data
  },

  /**
   * DELETE /message/:id
   */
  remove: async (id: string): Promise<void> => {
    await api.delete(`/message/${id}`)
  },
}
