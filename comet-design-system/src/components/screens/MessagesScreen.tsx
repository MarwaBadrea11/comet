import { useState, useEffect, useRef } from 'react'
import { Search, Phone, Video, Info, Send, Image, Mic, Plus, ArrowLeft, Loader2, X, Users } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { useAvatarUrl } from '../ui/UserAvatar'
import { Input } from '../ui/Input'
import { toast } from '../ui/Toast'
import { useConversations, useMessages, useSendMessage, useCreateConversation, useMarkAsRead } from '../../hooks/useMessagesQuery'
import { useMyFriends } from '../../hooks/useFriendsQuery'
import { useUploadMedia } from '../../hooks/useMediaQuery'
import { useAuthStore } from '../../stores/authStore'
import type { Conversation, MessageItem } from '../../services/messages'
import { CreateGroupChatModal } from './CreateGroupChatModal'

// A conversation's other participant(s) only carry avatarMediaId (no nested
// avatarMedia object) — resolve the real URL so map() stays rules-of-hooks safe.
function ParticipantAvatar({ name, avatarMediaId, size = 'md', className }: { name?: string; avatarMediaId?: string | null; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const src = useAvatarUrl({ name, avatarMediaId })
  return <Avatar src={src} alt={name} size={size} className={className} />
}

function MessageBubble({ message, isMe, showAvatar }: { message: MessageItem; isMe: boolean; showAvatar: boolean }) {
  return (
    <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}>
      {!isMe && (
        showAvatar
          ? <ParticipantAvatar name={message.sender?.name} avatarMediaId={message.sender?.avatarMediaId} size="sm" className="shrink-0 mt-auto" />
          : <div className="w-8 shrink-0" />
      )}
      <div>
        {message.attachments && message.attachments.length > 0 && (
          <div className={`mb-1.5 grid gap-1 ${message.attachments.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {message.attachments.map(a => (
              <img key={a.id} src={a.url} alt="Attachment" className="rounded-2xl max-h-64 object-cover w-full" />
            ))}
          </div>
        )}
        {message.content && (
          <div className={`p-4 rounded-2xl shadow-sm ${isMe ? 'bg-gradient-to-br from-primary to-primary-container rounded-br-none' : 'bg-surface-container-lowest rounded-bl-none'}`}>
            <p className={`text-sm leading-relaxed ${isMe ? 'text-white' : 'text-on-surface'}`}>{message.content}</p>
          </div>
        )}
        <span className={`text-[10px] text-on-surface-variant/50 mt-1 block ${isMe ? 'text-right' : ''}`}>
          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </span>
      </div>
    </div>
  )
}

function NewConversationModal({ onClose }: { onClose: () => void }) {
  const { data: friends = [], isLoading } = useMyFriends()
  const createConversation = useCreateConversation()
  const [selected, setSelected] = useState<string[]>([])
  const [groupName, setGroupName] = useState('')
  const isGroup = selected.length > 1

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleCreate = () => {
    if (selected.length === 0) return
    createConversation.mutate(
      {
        participantIds: selected,
        type: isGroup ? 'GROUP' : 'DIRECT',
        name: isGroup ? (groupName.trim() || undefined) : undefined,
      },
      {
        onSuccess: () => { toast.success(isGroup ? 'Group created!' : 'Conversation started!'); onClose() },
        onError: () => toast.error('Failed to start conversation. Please try again.'),
      },
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-sm rounded-[2rem] flex flex-col overflow-hidden shadow-2xl max-h-[80vh]">
          <div className="px-6 py-5 flex items-center justify-between border-b border-outline-variant/10">
            <h2 className="font-headline text-lg font-bold text-on-surface">New Message</h2>
            <button onClick={onClose} className="p-1 hover:bg-surface rounded-full"><X size={18} /></button>
          </div>

          {isGroup && (
            <div className="px-6 pt-4">
              <Input placeholder="Group name (optional)" value={groupName} onChange={e => setGroupName(e.target.value)} />
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-3 py-3">
            {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>}
            {!isLoading && friends.length === 0 && (
              <p className="text-center text-sm text-on-surface-variant py-8">No friends yet to message.</p>
            )}
            {friends.map(f => {
              const checked = selected.includes(f.id)
              return (
                <button
                  key={f.id}
                  onClick={() => toggle(f.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors ${checked ? 'bg-primary/10' : 'hover:bg-surface'}`}
                >
                  <ParticipantAvatar name={f.name} avatarMediaId={(f as any).avatarMediaId} size="sm" />
                  <span className="flex-1 text-left text-sm font-semibold text-on-surface">{f.name}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checked ? 'bg-primary border-primary' : 'border-outline-variant/40'}`}>
                    {checked && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="px-6 py-4 border-t border-outline-variant/10">
            <button
              onClick={handleCreate}
              disabled={selected.length === 0 || createConversation.isPending}
              className="w-full h-11 rounded-xl bg-primary text-white font-bold disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {createConversation.isPending ? <Loader2 size={16} className="animate-spin" /> : (isGroup ? <Users size={16} /> : <Send size={16} />)}
              {isGroup ? 'Create Group' : 'Start Conversation'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export function MessagesScreen() {
  const user = useAuthStore(s => s.user)

  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [msg, setMsg]                   = useState('')
  const [showChat, setShowChat]         = useState(false)
  const [showNewConv, setShowNewConv]   = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [pendingImage, setPendingImage] = useState<{ file: File; previewUrl: string } | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastMarkedMessageRef = useRef<string | null>(null)

  // ── Queries & mutations ────────────────────────────────────────────────────
  const { data: conversations = [], isLoading: loadingConvs, isError: convError, refetch } = useConversations()
  const { data: messages = [], isLoading: loadingMsgs } = useMessages(activeConvId ?? '')
  const sendMessage = useSendMessage()
  const uploadMedia = useUploadMedia()
  const markAsRead = useMarkAsRead()

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !activeConvId) {
      setActiveConvId(conversations[0].id)
    }
  }, [conversations, activeConvId])

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark messages as read when conversation is opened and has messages
  useEffect(() => {
    if (activeConvId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage && lastMessage.id && lastMessage.id !== lastMarkedMessageRef.current) {
        lastMarkedMessageRef.current = lastMessage.id
        markAsRead.mutate({ conversationId: activeConvId, messageId: lastMessage.id })
      }
    }
  }, [activeConvId, messages])

  // Reset last marked message when changing conversations
  useEffect(() => {
    lastMarkedMessageRef.current = null
  }, [activeConvId])

  // ── Helpers ────────────────────────────────────────────────────────────────
  const otherParticipant = (conv: Conversation) =>
    conv.participants?.find(p => String(p.user.id) !== String(user?.id))?.user

  const convName = (conv: Conversation) => {
    if (conv.name) return conv.name
    return otherParticipant(conv)?.name ?? 'Unknown'
  }

  const activeConv = conversations.find(c => c.id === activeConvId)
  const activeConvOther = activeConv ? otherParticipant(activeConv) : undefined

  // ── Send ───────────────────────────────────────────────────────────────────
  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPendingImage({ file, previewUrl: URL.createObjectURL(file) })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!msg.trim() && !pendingImage) || !activeConvId || !user) return

    let mediaIds: string[] | undefined
    if (pendingImage) {
      try {
        const media = await uploadMedia.mutateAsync(pendingImage.file)
        mediaIds = [media.id]
      } catch {
        toast.error('Failed to upload image. Please try again.')
        return
      }
    }

    const content = msg.trim() || undefined
    sendMessage.mutate(
      { conversationId: activeConvId, content, mediaIds },
      {
        onSuccess: () => {
          setMsg('')
          if (pendingImage) URL.revokeObjectURL(pendingImage.previewUrl)
          setPendingImage(null)
        },
        onError: () => toast.error('Failed to send message.'),
      },
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] overflow-hidden">

      {/* Conversations list */}
      <section className={`flex flex-col bg-surface border-r border-outline-variant/15 w-full sm:w-80 lg:w-96 shrink-0 ${showChat ? 'hidden sm:flex' : 'flex'}`}>
        <div className="p-5 lg:p-8 pb-3 lg:pb-4">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h1 className="text-xl lg:text-2xl font-extrabold font-headline text-on-surface tracking-tight">Messages</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateGroup(true)}
                className="h-9 px-3 flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#00D4FF] text-white hover:opacity-90 transition-opacity text-sm font-semibold"
                aria-label="Create group"
              >
                <Users size={16} />
                <span className="hidden sm:inline">Group</span>
              </button>
              <button
                onClick={() => setShowNewConv(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white hover:opacity-90 transition-opacity shrink-0"
                aria-label="New message"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          <Input variant="search" placeholder="Search conversations..." leadingIcon={<Search size={18} />} />
        </div>

        <div className="flex-1 overflow-y-auto px-3 lg:px-4 pb-6 space-y-1.5">
          {loadingConvs && <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>}

          {convError && (
            <div className="p-4 text-center text-sm text-red-500 font-medium">
              Could not load conversations.
              <button onClick={() => refetch()} className="block mx-auto mt-1 text-xs text-primary underline">Retry</button>
            </div>
          )}

          {!loadingConvs && !convError && conversations.length === 0 && (
            <div className="text-center py-12 px-4">
              <p className="text-sm text-on-surface-variant mb-3">No conversations yet.</p>
              <button onClick={() => setShowNewConv(true)} className="text-sm font-bold text-primary">Start a conversation</button>
            </div>
          )}

          {conversations.map(c => {
            const name    = convName(c)
            const other   = otherParticipant(c)
            const isActive = c.id === activeConvId
            const lastMsg = c.lastMessage?.content ?? (c.lastMessage?.attachments?.length ? '📷 Photo' : 'No messages yet')
            const unread  = c.unreadCount ?? 0

            return (
              <div
                key={c.id}
                onClick={() => { setActiveConvId(c.id); setShowChat(true) }}
                className={`flex items-center gap-3 p-3 lg:p-4 rounded-2xl cursor-pointer transition-all ${isActive ? 'bg-surface-container-lowest shadow-sm border border-primary/10' : 'hover:bg-surface-container-low'}`}
              >
                {c.type === 'GROUP' ? (
                  c.avatarMediaId ? (
                    <ParticipantAvatar name={name} avatarMediaId={c.avatarMediaId} size="md" className="shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-[#00D4FF] flex items-center justify-center shrink-0">
                      <Users size={20} className="text-white" />
                    </div>
                  )
                ) : (
                  <ParticipantAvatar name={name} avatarMediaId={other?.avatarMediaId} size="md" className="shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-bold text-on-surface text-sm truncate">{name}</h3>
                    <span className="text-[10px] text-on-surface-variant/60 shrink-0 ml-2">
                      {c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${unread ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>{lastMsg}</p>
                </div>
                {unread > 0 && (
                  <div className="w-5 h-5 bg-[#00D4FF] flex items-center justify-center rounded-full shrink-0">
                    <span className="text-[10px] font-bold text-white">{unread}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Chat window */}
      <section className={`flex-1 bg-surface-container-low flex flex-col relative min-w-0 ${showChat ? 'flex' : 'hidden sm:flex'}`}>
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant">
            <p className="text-sm font-medium">Select a conversation to start messaging.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <header className="h-14 lg:h-16 flex items-center justify-between px-4 lg:px-8 bg-white/70 backdrop-blur-2xl z-10 border-b border-outline-variant/10 shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowChat(false)} className="sm:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors mr-1">
                  <ArrowLeft size={20} />
                </button>
                {activeConv.type === 'GROUP' ? (
                  activeConv.avatarMediaId ? (
                    <ParticipantAvatar name={convName(activeConv)} avatarMediaId={activeConv.avatarMediaId} size="sm" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-[#00D4FF] flex items-center justify-center shrink-0">
                      <Users size={16} className="text-white" />
                    </div>
                  )
                ) : (
                  <ParticipantAvatar name={convName(activeConv)} avatarMediaId={activeConvOther?.avatarMediaId} size="sm" />
                )}
                <div>
                  <h2 className="font-headline font-bold text-on-surface text-sm lg:text-base">{convName(activeConv)}</h2>
                  <span className="text-[10px] text-on-surface-variant/60">
                    {activeConv.type === 'GROUP' ? `${activeConv.participants?.length ?? 0} members` : 'Direct message'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 lg:gap-5">
                {([<Phone size={18} />, <Video size={18} />, <Info size={18} />] as React.ReactNode[]).map((icon, i) => (
                  <button key={i} className="text-on-surface-variant hover:text-primary transition-colors hidden sm:block">{icon}</button>
                ))}
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col gap-3 lg:gap-4">
              {loadingMsgs && <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>}
              {!loadingMsgs && messages.length === 0 && (
                <div className="text-center py-12 text-on-surface-variant text-sm">No messages yet. Say hello!</div>
              )}
              {messages.map((m, i) => {
                const isMe = String(m.senderId) === String(user?.id)
                const nextIsSameSender = messages[i + 1] && String(messages[i + 1].senderId) === String(m.senderId)
                return (
                  <MessageBubble key={m.id} message={m} isMe={isMe} showAvatar={!nextIsSameSender} />
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <footer className="p-3 lg:p-6 shrink-0">
              {pendingImage && (
                <div className="mb-2 relative inline-block">
                  <img src={pendingImage.previewUrl} alt="Selected" className="h-20 rounded-xl object-cover border border-outline-variant/20" />
                  <button
                    type="button"
                    onClick={() => { URL.revokeObjectURL(pendingImage.previewUrl); setPendingImage(null) }}
                    className="absolute -top-1.5 -right-1.5 bg-black/70 hover:bg-red-600 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <form onSubmit={handleSend} className="bg-surface-container-lowest rounded-2xl lg:rounded-[2rem] p-2 lg:p-3 shadow-lg flex items-end gap-2 border border-outline-variant/10">
                <div className="flex gap-0.5 mb-0.5">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all">
                    <Image size={18} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
                  <button type="button" className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all">
                    <Mic size={18} />
                  </button>
                </div>
                <textarea
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as any) } }}
                  className="flex-1 bg-transparent border-none focus:ring-0 py-2 text-sm resize-none max-h-28 outline-none"
                  placeholder="Type your celestial message..."
                  rows={1}
                />
                <button type="submit" disabled={sendMessage.isPending || uploadMedia.isPending || (!msg.trim() && !pendingImage)} className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-full shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 disabled:opacity-50">
                  {sendMessage.isPending || uploadMedia.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-[0.3em]">Encrypted End-to-End</p>
            </footer>
          </>
        )}
      </section>

      {showNewConv && <NewConversationModal onClose={() => setShowNewConv(false)} />}
      
      {showCreateGroup && (
        <CreateGroupChatModal
          onClose={() => setShowCreateGroup(false)}
          onGroupCreated={(conversationId) => {
            setActiveConvId(conversationId)
            setShowChat(true)
          }}
        />
      )}
    </div>
  )
}
