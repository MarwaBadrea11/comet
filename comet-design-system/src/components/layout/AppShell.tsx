import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { SideNav, EXPANDED_W, COLLAPSED_W } from './SideNav'
import { TopBar } from './TopBar'
import { FAB } from './FAB'
import { CreatePostModal } from '../screens/CreatePostModal'
import { SidebarProvider, useSidebar } from '../../providers/SidebarProvider'
import { useAuthStore } from '../../stores/authStore'
import { useUIStore } from '../../stores/uiStore'
import type { NavItem } from '../../types'

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',          icon: 'home',          href: '/home' },
  { label: 'Explore',       icon: 'explore',       href: '/explore' },
  { label: 'Messages',      icon: 'mail',          href: '/messages' },
  { label: 'Groups',        icon: 'group',         href: '/groups' },
  { label: 'Notifications', icon: 'notifications', href: '/notifications' },
  { label: 'Settings',      icon: 'settings',      href: '/settings' },
]

const NO_FAB_ROUTES = ['/messages', '/settings', '/notifications']

function ShellInner({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { collapsed, isMobile } = useSidebar()

  const user             = useAuthStore(s => s.user)
  const unread           = useUIStore(s => s.unreadNotifications)
  const createPostOpen   = useUIStore(s => s.createPostOpen)
  const openCreatePost   = useUIStore(s => s.openCreatePost)
  const closeCreatePost  = useUIStore(s => s.closeCreatePost)

  const path    = location.pathname
  const hideFab = NO_FAB_ROUTES.includes(path)

  const desktopMargin = collapsed ? COLLAPSED_W : EXPANDED_W

  const navItems: NavItem[] = NAV_ITEMS.map(item => ({
    ...item,
    active: path.startsWith(item.href),
    // Live badge on Notifications from Zustand store
    badge: item.href === '/notifications' ? (unread > 0 ? unread : undefined) : item.badge,
  }))

  const displayUser = {
    name:   user?.name   ?? 'Comet User',
    handle: `@${(user?.name ?? 'user').toLowerCase().replace(/\s+/g, '')}`,
    avatar: user?.avatar ?? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name ?? 'user')}`,
  }

  return (
    <div className="bg-surface min-h-screen">
      <SideNav items={navItems} user={displayUser} onCreateClick={openCreatePost} />
      <TopBar notificationCount={unread} user={displayUser} />

      <motion.main
        animate={{ marginLeft: isMobile ? 0 : desktopMargin }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.85 }}
        className="pt-16 lg:pt-20 min-h-screen"
      >
        {children}
      </motion.main>

      {!hideFab && <FAB onClick={openCreatePost} />}

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
