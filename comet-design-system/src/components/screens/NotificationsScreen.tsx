import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, UserPlus, UserCheck, AtSign, Mail, MoreHorizontal, Loader2, Bell } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { useAvatarUrl } from '../ui/UserAvatar'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../../hooks/useNotificationsQuery'
import { categorizeNotification, type Notification, type NotificationCategory } from '../../services/notifications'
import { useTranslation } from '../../hooks/useTranslation'
import type { Translations } from '../../i18n/translations'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getIcon(type: string) {
  switch (type) {
    case 'LIKE':                     return <Heart size={14} fill="currentColor" />
    case 'COMMENT':                  return <MessageCircle size={14} fill="currentColor" />
    case 'FRIEND_REQUEST':           return <UserPlus size={14} />
    case 'FRIEND_REQUEST_ACCEPTED':  return <UserCheck size={14} />
    case 'MENTION':                  return <AtSign size={14} fill="currentColor" />
    case 'MESSAGE':                  return <Mail size={14} fill="currentColor" />
    default:                         return <Bell size={14} />
  }
}

function getIconBg(type: string) {
  switch (type) {
    case 'LIKE':                     return 'bg-gradient-to-br from-[#6B46C0] to-[#00D4FF]'
    case 'COMMENT':                  return 'bg-[#00D4FF]'
    case 'FRIEND_REQUEST':           return 'bg-cyan-400'
    case 'FRIEND_REQUEST_ACCEPTED':  return 'bg-emerald-400'
    case 'MENTION':                  return 'bg-violet-500'
    case 'MESSAGE':                  return 'bg-amber-400'
    default:                         return 'bg-surface-container-high'
  }
}

function getMessage(item: Notification, t: Translations): string {
  switch (item.type) {
    case 'LIKE':
      return item.entityType === 'COMMENT' ? t.notifications.reactedToComment : t.notifications.reactedToPost
    case 'COMMENT':
      return t.notifications.commentedOnPost
    case 'FRIEND_REQUEST':
      return t.notifications.sentFriendRequest
    case 'FRIEND_REQUEST_ACCEPTED':
      return t.notifications.acceptedFriendRequest
    case 'MENTION':
      return t.notifications.mentionedYou
    case 'MESSAGE':
      return item.data?.preview
        ? t.notifications.sentMessageWithPreview.replace('{preview}', item.data.preview)
        : t.notifications.sentMessage
    default:
      return t.notifications.interacted
  }
}

function formatTime(d: string | undefined, t: Translations) {
  if (!d) return ''
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), day = Math.floor(diff / 86400000)
  if (m < 60) return t.notifications.minutesAgo.replace('{n}', String(m))
  if (h < 24) return t.notifications.hoursAgo.replace('{n}', String(h))
  return t.notifications.daysAgo.replace('{n}', String(day))
}

/** Where tapping a notification should take you. */
function getNotificationLink(item: Notification): string | null {
  switch (item.type) {
    case 'FRIEND_REQUEST':
      return '/friend-requests'
    case 'FRIEND_REQUEST_ACCEPTED':
      return item.actorId ? `/profile/${item.actorId}` : null
    case 'MESSAGE':
      return '/messages'
    case 'LIKE':
      return item.entityType === 'POST' && item.entityId ? `/post/${item.entityId}` : null
    case 'COMMENT':
    case 'MENTION':
      return item.data?.postId ? `/post/${item.data.postId}` : null
    default:
      return null
  }
}

// ── NotifItem ─────────────────────────────────────────────────────────────────

function NotifItem({ item, onRead, onNavigate }: { item: Notification; onRead: (id: string) => void; onNavigate: (link: string) => void }) {
  const t = useTranslation()
  const actorName = item.actor?.name ?? t.notifications.someone
  const avatarSrc = useAvatarUrl({ name: actorName, avatarMediaId: item.actor?.avatarMediaId })
  const link = getNotificationLink(item)

  const handleClick = () => {
    if (!item.isRead) onRead(item.id)
    if (link) onNavigate(link)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleClick}
      className={`group relative flex items-center gap-6 p-5 md:p-6 bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(107,70,192,0.03)] hover:shadow-[0_20px_40px_rgba(107,70,192,0.08)] transition-all duration-300 ${link ? 'cursor-pointer' : ''} ${item.isRead ? 'opacity-70' : ''}`}
    >
      <div className="relative shrink-0">
        <Avatar src={avatarSrc} alt={actorName} size="lg" />
        <div className={`absolute -bottom-1 -right-1 ${getIconBg(item.type)} p-1 rounded-full border-2 border-white text-white`}>
          {getIcon(item.type)}
        </div>
      </div>

      <div className="flex-grow min-w-0">
        <p className="text-on-surface text-sm leading-relaxed">
          <strong>{actorName}</strong> {getMessage(item, t)}
        </p>
        <span className="text-xs text-on-surface-variant/60 mt-1 block">{formatTime(item.createdAt, t)}</span>
      </div>

      {!item.isRead && (
        <button
          onClick={(e) => { e.stopPropagation(); onRead(item.id) }}
          className="hidden group-hover:flex p-2 text-on-surface-variant hover:text-primary transition-colors"
          aria-label="Mark as read"
        >
          <MoreHorizontal size={18} />
        </button>
      )}
    </motion.div>
  )
}

// ── Screen ────────────────────────────────────────────────────────────────────

export function NotificationsScreen() {
  const t = useTranslation()
  const navigate = useNavigate()
  const [tab, setTab] = useState<NotificationCategory>('direct')

  const TABS: Array<{ id: NotificationCategory; label: string; description: string }> = [
    { id: 'direct', label: t.notifications.tabDirect, description: t.notifications.tabDirectDesc },
    { id: 'activity', label: t.notifications.tabActivity, description: t.notifications.tabActivityDesc },
  ]
  const { data: notifications = [], isLoading, isError, refetch } = useNotifications()
  const markRead    = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const grouped = notifications.reduce<Record<NotificationCategory, Notification[]>>(
    (acc, n) => {
      acc[categorizeNotification(n.type)].push(n)
      return acc
    },
    { direct: [], activity: [] },
  )

  const visible = grouped[tab]
  const now    = Date.now()
  const today  = visible.filter(n => !n.createdAt || (now - new Date(n.createdAt).getTime()) < 86400000)
  const older  = visible.filter(n => n.createdAt && (now - new Date(n.createdAt).getTime()) >= 86400000)
  const hasUnread = visible.some(n => !n.isRead)

  return (
    <div className="pt-8 md:pt-12 pb-20 px-4 md:px-12 flex justify-center">
      <div className="max-w-4xl w-full">

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2">{t.notifications.title}</h1>
            <p className="text-on-surface-variant text-base md:text-lg">{t.notifications.subtitle}</p>
          </div>
          {hasUnread && (
            <button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="text-primary font-semibold py-2 px-4 hover:bg-surface-container-low rounded-xl transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              {t.notifications.markAllRead}
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-10 p-1 bg-surface-container-low rounded-2xl border border-outline-variant/15 w-fit">
          {TABS.map(tabDef => {
            const count = grouped[tabDef.id].filter(n => !n.isRead).length
            return (
              <button
                key={tabDef.id}
                onClick={() => setTab(tabDef.id)}
                className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tab === tabDef.id ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tabDef.label}
                {count > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-primary text-white">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-on-surface-variant/60 -mt-8 mb-8">{TABS.find(tabDef => tabDef.id === tab)?.description}</p>

        {isLoading && <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}

        {isError && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center text-sm text-red-500 font-semibold mb-6">
            {t.notifications.loadError}
            <button onClick={() => refetch()} className="block mx-auto mt-1 text-xs text-primary underline">{t.common.retry}</button>
          </div>
        )}

        {!isLoading && !isError && visible.length === 0 && (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-primary/20 mx-auto mb-4" />
            <p className="text-on-surface-variant font-medium">{t.notifications.allCaughtUp}</p>
          </div>
        )}

        {!isLoading && today.length > 0 && (
          <section className="mb-12 md:mb-16">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{t.notifications.today}</span>
              <div className="h-px flex-grow bg-outline-variant/15" />
            </div>
            <div className="flex flex-col gap-4">
              {today.map(n => <NotifItem key={n.id} item={n} onRead={id => markRead.mutate(id)} onNavigate={navigate} />)}
            </div>
          </section>
        )}

        {!isLoading && older.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{t.notifications.earlier}</span>
              <div className="h-px flex-grow bg-outline-variant/15" />
            </div>
            <div className="flex flex-col gap-4">
              {older.map(n => <NotifItem key={n.id} item={n} onRead={id => markRead.mutate(id)} onNavigate={navigate} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
