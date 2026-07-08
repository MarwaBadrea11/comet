/**
 * Messaging query and mutation hooks.
 *
 * useConversations      — GET /conversation/mine
 * useMessages           — GET /message/conversation/:id
 * useSendMessage        — POST /message  (optimistic append)
 * useCreateConversation — POST /conversation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationService, messageService, type MessageItem } from '../services/messages'
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
  content:        string
  senderId:       string
}

export function useSendMessage() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, content }: SendPayload) =>
      messageService.send({ conversationId, content, messageType: 'TEXT' }),

    onMutate: async ({ conversationId, content, senderId }) => {
      await qc.cancelQueries({ queryKey: queryKeys.messages.byConversation(conversationId) })

      const previous = qc.getQueryData<MessageItem[]>(
        queryKeys.messages.byConversation(conversationId),
      )

      const optimistic: MessageItem = {
        id:             `optimistic-${Date.now()}`,
        content,
        messageType:    'TEXT',
        conversationId,
        senderId,
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
