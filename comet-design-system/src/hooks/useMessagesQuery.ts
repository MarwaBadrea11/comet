/**
 * Messaging query and mutation hooks.
 *
 * useConversations      — GET /conversation/mine
 * useMessages           — GET /message/conversation/:id
 * useSendMessage        — POST /message  (optimistic append, supports mediaIds)
 * useCreateConversation — POST /conversation
 * useAddParticipant     — POST /conversation/:id/participants
 * useRemoveParticipant  — DELETE /conversation/:id/participants/:userId
 * useLeaveConversation  — POST /conversation/:id/leave
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationService, messageService, type MessageItem, type MessageType } from '../services/messages'
import { useAuthStore } from '../stores/authStore'
import { queryKeys } from '../lib/queryKeys'

// ── Conversations ─────────────────────────────────────────────────────────────

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations.mine(),
    queryFn:  conversationService.getMine,
    staleTime: 30_000, // conversations list can tolerate 30 s staleness
  })
}

// ── Messages in a conversation ────────────────────────────────────────────────

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: queryKeys.messages.byConversation(conversationId),
    queryFn:  () => messageService.getConversationMessages(conversationId, 50),
    enabled:  !!conversationId,
    staleTime: 10_000,
    refetchInterval: 15_000, // Poll every 15 s as a fallback (no WebSocket yet)
  })
}

// ── Send message ──────────────────────────────────────────────────────────────

interface SendPayload {
  conversationId: string
  content?:       string
  mediaIds?:      string[]
  messageType?:   MessageType
}

export function useSendMessage() {
  const qc = useQueryClient()
  const currentUser = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: ({ conversationId, content, mediaIds, messageType }: SendPayload) =>
      messageService.send({
        conversationId,
        content,
        mediaIds,
        messageType: messageType ?? (mediaIds?.length ? 'IMAGE' : 'TEXT'),
      }),

    onMutate: async ({ conversationId, content, mediaIds }) => {
      await qc.cancelQueries({ queryKey: queryKeys.messages.byConversation(conversationId) })

      const previous = qc.getQueryData<MessageItem[]>(
        queryKeys.messages.byConversation(conversationId),
      )

      const optimistic: MessageItem = {
        id:             `optimistic-${Date.now()}`,
        content,
        messageType:    mediaIds?.length ? 'IMAGE' : 'TEXT',
        conversationId,
        senderId:       currentUser?.id ?? '',
        sender:         currentUser ? { id: currentUser.id, name: currentUser.name, username: '' } : undefined,
        createdAt:      new Date().toISOString(),
      }

      qc.setQueryData<MessageItem[]>(
        queryKeys.messages.byConversation(conversationId),
        (old) => [...(old ?? []), optimistic],
      )

      return { previous }
    },

    onError: (_err, { conversationId }, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(queryKeys.messages.byConversation(conversationId), ctx.previous)
      }
    },

    onSuccess: (sent, { conversationId }) => {
      // Replace the optimistic message with the real server response
      qc.setQueryData<MessageItem[]>(
        queryKeys.messages.byConversation(conversationId),
        (old) =>
          (old ?? []).map((m) =>
            m.id.startsWith('optimistic-') ? sent : m,
          ),
      )
      // Refresh the conversations list so the last-message preview updates
      qc.invalidateQueries({ queryKey: queryKeys.conversations.mine() })
    },
  })
}

// ── Create conversation ───────────────────────────────────────────────────────

export function useCreateConversation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: conversationService.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: queryKeys.conversations.mine() }),
  })
}

// ── Group participants ────────────────────────────────────────────────────────

export function useAddParticipant() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, userId, role }: { conversationId: string; userId: string; role?: 'ADMIN' | 'MEMBER' }) =>
      conversationService.addParticipant(conversationId, userId, role),
    onSuccess: (_, { conversationId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.conversations.byId(conversationId) })
      qc.invalidateQueries({ queryKey: queryKeys.conversations.mine() })
    },
  })
}

export function useRemoveParticipant() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, userId }: { conversationId: string; userId: string }) =>
      conversationService.removeParticipant(conversationId, userId),
    onSuccess: (_, { conversationId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.conversations.byId(conversationId) })
      qc.invalidateQueries({ queryKey: queryKeys.conversations.mine() })
    },
  })
}

export function useLeaveConversation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (conversationId: string) => conversationService.leave(conversationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.conversations.mine() }),
  })
}
