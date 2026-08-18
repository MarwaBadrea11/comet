import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { SideNav, EXPANDED_W, COLLAPSED_W } from './SideNav'
import { TopBar } from './TopBar'
import { CreatePostModal } from '../screens/CreatePostModal'
import { SidebarProvider, useSidebar } from '../../providers/SidebarProvider'
import { useAuthStore } from '../../stores/authStore'
import { useUIStore } from '../../stores/uiStore'
import { useTranslation } from '../../hooks/useTranslation'
import { usePendingRequests } from '../../hooks/useFriendsQuery'
import { useMyProfile } from '../../hooks/useUserQuery'
import type { NavItem } from '../../types'

function ShellInner({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { collapsed, isMobile } = useSidebar()
  const t = useTranslation()
  const isRTL = useUIStore((s) => s.isRTL)

  const user             = useAuthStore(s => s.user)
  const { data: profile } = useMyProfile()
  const unread           = useUIStore(s => s.unreadNotifications)
  const createPostOpen   = useUIStore(s => s.createPostOpen)
  const openCreatePost   = useUIStore(s => s.openCreatePost)
  const closeCreatePost  = useUIStore(s => s.closeCreatePost)

  const { data: friendRequests } = usePendingRequests()
  const pendingCount = friendRequests?.length || 0

  const path = location.pathname
  const desktopMargin = collapsed ? COLLAPSED_W : EXPANDED_W

  const NAV_ITEMS: NavItem[] = useMemo(() => [
    { label: t('sidebar.home'),          icon: 'home',          href: '/home' },
    { label: t('sidebar.explore'),       icon: 'explore',       href: '/explore' },
    { label: t('sidebar.messages'),      icon: 'mail',          href: '/messages' },
    { label: t('sidebar.friendRequests'), icon: 'person_add',   href: '/friend-requests' },
    { label: t('sidebar.notifications'), icon: 'notifications', href: '/notifications' },
    { label: t('sidebar.settings'),      icon: 'settings',      href: '/settings' },
  ], [t])

  const navItems: NavItem[] = useMemo(() => NAV_ITEMS.map(item => ({
    ...item,
    active: path.startsWith(item.href),
    badge:
      item.href === '/notifications'
        ? (unread > 0 ? unread : undefined)
        : item.href === '/friend-requests'
        ? (pendingCount > 0 ? pendingCount : undefined)
        : item.badge,
  })), [NAV_ITEMS, path, unread, pendingCount])

  const displayUser = useMemo(() => ({
    name:   profile?.name || user?.name || 'Comet User',
    handle: profile?.username ? `@${profile.username}` : `@${(user?.name ?? 'user').toLowerCase().replace(/\s+/g, '')}`,
    avatar: profile?.avatar || user?.avatar || undefined,
  }), [profile, user])

  return (
    <div className="bg-surface min-h-screen transition-colors duration-300">
      <SideNav items={navItems} user={displayUser} onCreateClick={openCreatePost} />
      <TopBar notificationCount={unread} />

      <motion.main
        animate={{ 
          [isRTL ? 'marginRight' : 'marginLeft']: isMobile ? 0 : desktopMargin,
          [isRTL ? 'marginLeft' : 'marginRight']: 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.85 }}
        className="pt-16 lg:pt-20 min-h-screen"
      >
        {children}
      </motion.main>

      <CreatePostModal open={createPostOpen} onClose={closeCreatePost} />
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ShellInner>{children}</ShellInner>
    </SidebarProvider>
  )
}
