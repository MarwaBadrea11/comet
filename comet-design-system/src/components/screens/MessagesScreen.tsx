import { useState, useEffect, useRef } from 'react'
import { Search, Phone, Video, Info, Send, Image, Mic, Plus, ArrowLeft, Loader2 } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Input } from '../ui/Input'
import { useConversations, useMessages, useSendMessage } from '../../hooks/useMessagesQuery'
import { useAuthStore } from '../../stores/authStore'
import type { Conversation } from '../../services/messages'

export function MessagesScreen() {
  const user = useAuthStore(s => s.user)

  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [msg, setMsg]                   = useState('')
  const [showChat, setShowChat]         = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ── Queries & mutations ────────────────────────────────────────────────────
  const { data: conversations = [], isLoading: loadingConvs, isError: convError, refetch } = useConversations()
  const { data: messages = [], isLoading: loadingMsgs } = useMessages(activeConvId ?? '')
  const sendMessage = useSendMessage()

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

  // ── Helpers ────────────────────────────────────────────────────────────────
  const convName = (conv: Conversation) => {
    if (conv.name) return conv.name
    return conv.participants?.find(p => p.id !== user?.id)?.name ?? 'Unknown'
  }

  const convAvatar = (conv: Conversation) => {
    const other = conv.participants?.find(p => p.id !== user?.id)
    return other?.avatar ?? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(convName(conv))}`
  }

  const activeConv = conversations.find(c => c.id === activeConvId)

  // ── Send ───────────────────────────────────────────────────────────────────
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!msg.trim() || !activeConvId || !user) return

    sendMessage.mutate(
      { conversationId: activeConvId, content: msg.trim(), senderId: user.id },
      { onSuccess: () => setMsg('') },
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] overflow-hidden">

      {/* Conversations list */}
      <section className={`flex flex-col bg-surface border-r border-outline-variant/15 w-full sm:w-80 lg:w-96 shrink-0 ${showChat ? 'hidden sm:flex' : 'flex'}`}>
        <div className="p-5 lg:p-8 pb-3 lg:pb-4">
          <h1 className="text-xl lg:text-2xl font-extrabold font-headline text-on-surface tracking-tight mb-4 lg:mb-6">Direct Messages</h1>
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
            <div className="text-center py-12 px-4"><p className="text-sm text-on-surface-variant">No conversations yet.</p></div>
          )}

          {conversations.map(c => {
            const name    = convName(c)
            const avatar  = convAvatar(c)
            const isActive = c.id === activeConvId
            const lastMsg = c.lastMessage?.content ?? 'No messages yet'
            const unread  = c.unreadCount ?? 0

            return (
              <div
                key={c.id}
                onClick={() => { setActiveConvId(c.id); setShowChat(true) }}
                className={`flex items-center gap-3 p-3 lg:p-4 rounded-2xl cursor-pointer transition-all ${isActive ? 'bg-surface-container-lowest shadow-sm border border-primary/10' : 'hover:bg-surface-container-low'}`}
              >
                <Avatar src={avatar} alt={name} size="md" className="shrink-0" />
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
                <Avatar src={convAvatar(activeConv)} alt={convName(activeConv)} size="sm" />
                <div>
                  <h2 className="font-headline font-bold text-on-surface text-sm lg:text-base">{convName(activeConv)}</h2>
                  <span className="text-[10px] text-on-surface-variant/60">{activeConv.type === 'GROUP' ? 'Group' : 'Direct message'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 lg:gap-5">
                {([<Phone size={18} />, <Video size={18} />, <Info size={18} />] as React.ReactNode[]).map((icon, i) => (
                  <button key={i} className="text-on-surface-variant hover:text-primary transition-colors hidden sm:block">{icon}</button>
                ))}
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col gap-5 lg:gap-6">
              {loadingMsgs && <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>}
              {!loadingMsgs && messages.length === 0 && (
                <div className="text-center py-12 text-on-surface-variant text-sm">No messages yet. Say hello!</div>
              )}
              {messages.map(m => {
                const isMe = m.senderId === user?.id
                return (
                  <div key={m.id} className={`flex gap-3 max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] ${isMe ? 'self-end flex-row-reverse' : ''}`}>
                    {!isMe && <Avatar src={convAvatar(activeConv)} alt={convName(activeConv)} size="sm" className="shrink-0 mt-auto" />}
                    <div>
                      <div className={`p-4 rounded-2xl shadow-sm ${isMe ? 'bg-gradient-to-br from-primary to-primary-container rounded-br-none' : 'bg-surface-container-lowest rounded-bl-none'}`}>
                        <p className={`text-sm leading-relaxed ${isMe ? 'text-white' : 'text-on-surface'}`}>{m.content}</p>
                      </div>
                      <span className={`text-[10px] text-on-surface-variant/50 mt-1 block ${isMe ? 'text-right' : ''}`}>
                        {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <footer className="p-3 lg:p-6 shrink-0">
              <form onSubmit={handleSend} className="bg-surface-container-lowest rounded-2xl lg:rounded-[2rem] p-2 lg:p-3 shadow-lg flex items-end gap-2 border border-outline-variant/10">
                <div className="flex gap-0.5 mb-0.5">
                  {([<Plus size={18} />, <Image size={18} />, <Mic size={18} />] as React.ReactNode[]).map((icon, i) => (
                    <button key={i} type="button" className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all">{icon}</button>
                  ))}
                </div>
                <textarea
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as any) } }}
                  className="flex-1 bg-transparent border-none focus:ring-0 py-2 text-sm resize-none max-h-28 outline-none"
                  placeholder="Type your celestial message..."
                  rows={1}
                />
                <button type="submit" disabled={sendMessage.isPending || !msg.trim()} className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-full shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 disabled:opacity-50">
                  {sendMessage.isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={16} />}
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-[0.3em]">Encrypted End-to-End</p>
            </footer>
          </>
        )}
      </section>
    </div>
  )
}
