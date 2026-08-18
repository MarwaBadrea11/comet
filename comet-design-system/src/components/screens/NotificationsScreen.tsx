import { motion } from 'framer-motion'
import { Heart, MessageCircle, UserPlus, AtSign, MoreHorizontal, Loader2, Bell } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { motionVariants } from '../../lib/theme'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../../hooks/useNotificationsQuery'
import type { Notification } from '../../services/notifications'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getIcon(type?: string) {
  switch (type?.toLowerCase()) {
    case 'like': case 'reaction': return <Heart size={14} fill="currentColor" />
    case 'comment': case 'reply': return <MessageCircle size={14} fill="currentColor" />
    case 'follow': case 'friend': return <UserPlus size={14} />
    case 'mention':               return <AtSign size={14} fill="currentColor" />
    default:                      return <Bell size={14} />
  }
}

function getIconBg(type?: string) {
  switch (type?.toLowerCase()) {
    case 'like': case 'reaction': return 'bg-gradient-to-br from-[#6B46C0] to-[#00D4FF]'
    case 'comment': case 'reply': return 'bg-[#00D4FF]'
    case 'follow': case 'friend': return 'bg-cyan-400'
    case 'mention':               return 'bg-violet-500'
    default:                      return 'bg-surface-container-high'
  }
}

function formatTime(d?: string) {
  if (!d) return ''
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), day = Math.floor(diff / 86400000)
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${day}d ago`
}

// ── NotifItem ─────────────────────────────────────────────────────────────────

function NotifItem({ item, onRead }: { item: Notification; onRead: (id: string) => void }) {
  const actorName = item.actor?.name ?? 'Someone'
  const isSystem  = item.type === 'system' || item.type === 'achievement'
  const avatarSrc = item.actor?.avatar ?? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(actorName)}`

  return (
    <motion.div
      {...motionVariants.fadeIn}
      className={`group relative flex items-center gap-6 p-5 md:p-6 bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(107,70,192,0.03)] hover:shadow-[0_20px_40px_rgba(107,70,192,0.08)] transition-all duration-300 ${item.isRead ? 'opacity-70' : ''}`}
    >
      <div className="relative shrink-0">
        {isSystem ? (
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-primary/10 to-[#00D4FF]/10 flex items-center justify-center border-2 border-white">
            <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
        ) : (
          <Avatar src={avatarSrc} alt={actorName} size="lg" />
        )}
        <div className={`absolute -bottom-1 -right-1 ${getIconBg(item.type)} p-1 rounded-full border-2 border-white text-white`}>
          {getIcon(item.type)}
        </div>
      </div>

      <div className="flex-grow min-w-0">
        <p className="text-on-surface text-sm leading-relaxed">
          {isSystem
            ? <><strong>System:</strong> {item.message ?? 'You have a new notification.'}</>
            : <><strong>{actorName}</strong> {item.message ?? 'interacted with your content.'}</>
          }
        </p>
        <span className="text-xs text-on-surface-variant/60 mt-1 block">{formatTime(item.createdAt)}</span>
      </div>

      {item.type === 'follow' && <Button variant="secondary" size="sm">Follow back</Button>}

      <button onClick={() => onRead(item.id)} className="hidden group-hover:flex p-2 text-on-surface-variant hover:text-primary transition-colors">
        <MoreHorizontal size={18} />
      </button>
    </motion.div>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function NotificationsScreen() {
  const { data: notifications = [], isLoading, isError, refetch } = useNotifications()
  const markRead    = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const now    = Date.now()
  const today  = notifications.filter(n => !n.createdAt || (now - new Date(n.createdAt).getTime()) < 86400000)
  const older  = notifications.filter(n => n.createdAt && (now - new Date(n.createdAt).getTime()) >= 86400000)
  const hasUnread = notifications.some(n => !n.isRead)

  return (
    <div className="pt-8 md:pt-12 pb-20 px-4 md:px-12 flex justify-center">
      <div className="max-w-4xl w-full">

        <div className="flex justify-between items-end mb-8 md:mb-12">
          <div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">Notifications</h1>
            <p className="text-on-surface-variant text-base md:text-lg">Your cosmic interactions and updates.</p>
          </div>
          {hasUnread && (
            <button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="text-primary font-semibold py-2 px-4 hover:bg-surface-container-low rounded-xl transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              Mark all read
            </button>
          )}
        </div>

        {isLoading && <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}

        {isError && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center text-sm text-red-500 font-semibold mb-6">
            Could not load notifications.
            <button onClick={() => refetch()} className="block mx-auto mt-1 text-xs text-primary underline">Retry</button>
          </div>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-primary/20 mx-auto mb-4" />
            <p className="text-on-surface-variant font-medium">You're all caught up!</p>
          </div>
        )}

        {!isLoading && today.length > 0 && (
          <section className="mb-12 md:mb-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Today</span>
              <div className="h-px flex-grow bg-outline-variant/15" />
            </div>
            <div className="flex flex-col gap-4">
              {today.map(n => <NotifItem key={n.id} item={n} onRead={id => markRead.mutate(id)} />)}
            </div>
          </section>
        )}

        {!isLoading && older.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Earlier</span>
              <div className="h-px flex-grow bg-outline-variant/15" />
            </div>
            <div className="flex flex-col gap-4">
              {older.map(n => <NotifItem key={n.id} item={n} onRead={id => markRead.mutate(id)} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
