/**
 * Messaging service — conversations and messages.
 * Maps to /conversation/* and /message/* endpoints.
 *
 * Backend Reference:
 * - apps/api/src/conversation/conversation.controller.ts + conversation.service.ts
 * - apps/api/src/message/message.controller.ts + message.service.ts
 */

import api from './api'
import type { Media } from '../types/media.types'

// ── Domain types ─────────────────────────────────────────────────────────────

export interface MessageSender {
  id: string
  name: string
  username: string
  avatarMediaId?: string | null
}

export interface MessageAttachment {
  id: string
  mediaId: string
  url?: string
  mimeType?: string
  media?: Media
}

export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'STICKER' | 'VOICE' | 'LOCATION'

export interface MessageItem {
  id: string
  content?: string | null
  messageType?: MessageType
  conversationId: string
  senderId: string
  sender?: MessageSender
  replyToId?: string | null
  clientMessageId?: string | null
  isEdited?: boolean
  isDeletedForEveryone?: boolean
  createdAt?: string
  attachments?: MessageAttachment[]
}

export interface ConversationParticipant {
  id: string
  userId: string
  role: 'ADMIN' | 'MEMBER'
  user: MessageSender
}

export interface Conversation {
  id: string
  type?: 'DIRECT' | 'GROUP'
  name?: string | null
  description?: string | null
  avatarMediaId?: string | null
  creator?: MessageSender
  participants?: ConversationParticipant[]
  lastMessage?: MessageItem | null
  unreadCount?: number
  myParticipantRole?: 'ADMIN' | 'MEMBER'
  createdAt?: string
  updatedAt?: string
}

// ── Conversation API calls ───────────────────────────────────────────────────

export const conversationService = {
  /**
   * POST /conversation
   * Create a new conversation. type is inferred (DIRECT for 2 participants,
   * GROUP otherwise) if omitted. Creating a DIRECT chat with an existing pair
   * reuses the existing conversation instead of duplicating it.
   */
  create: async (payload: {
    participantIds: string[]
    type?: 'DIRECT' | 'GROUP'
    name?: string
    description?: string
    avatarMediaId?: string
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
   * PATCH /conversation/:id — rename/describe a conversation (GROUP requires admin).
   */
  update: async (id: string, payload: { name?: string; description?: string; avatarMediaId?: string }): Promise<Conversation> => {
    const { data } = await api.patch(`/conversation/${id}`, payload)
    return data
  },

  /**
   * POST /conversation/:id/participants — add/re-activate a member (GROUP, admin only).
   */
  addParticipant: async (id: string, userId: string, role?: 'ADMIN' | 'MEMBER'): Promise<Conversation> => {
    const { data } = await api.post(`/conversation/${id}/participants`, { userId, role })
    return data
  },

  /**
   * DELETE /conversation/:id/participants/:userId — remove a member (GROUP, admin only).
   */
  removeParticipant: async (id: string, userId: string): Promise<Conversation> => {
    const { data } = await api.delete(`/conversation/${id}/participants/${userId}`)
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
   * Send a message to an existing conversation. mediaIds attaches
   * already-uploaded media (images/files) to the message.
   */
  send: async (payload: {
    conversationId: string
    content?: string
    messageType?: MessageType
    replyToId?: string
    clientMessageId?: string
    mediaIds?: string[]
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
