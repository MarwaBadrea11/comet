import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { SideNav, EXPANDED_W, COLLAPSED_W } from './SideNav'
import { TopBar } from './TopBar'
import { FAB } from './FAB'
import { CreatePostModal } from '../screens/CreatePostModal'
import { SidebarProvider, useSidebar } from '../../providers/SidebarProvider'
import type { NavItem } from '../../types'

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',          icon: 'home',          href: '/home' },
  { label: 'Explore',       icon: 'explore',       href: '/explore' },
  { label: 'Messages',      icon: 'mail',          href: '/messages' },
  { label: 'Groups',        icon: 'group',         href: '/groups' },
  { label: 'Notifications', icon: 'notifications', href: '/notifications', badge: 3 },
  { label: 'Settings',      icon: 'settings',      href: '/settings' },
]

const NO_SHELL_ROUTES = ['/', '/login', '/register', '/onboarding', '/stories']
const NO_FAB_ROUTES   = ['/messages', '/settings', '/notifications']

function ShellInner({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { collapsed, isMobile } = useSidebar()
  const [createOpen, setCreateOpen] = useState(false)

  const path    = location.pathname
  const hideFab = NO_FAB_ROUTES.includes(path)

  // On mobile: no margin offset (drawer overlays content)
  // On desktop: animate margin with sidebar width
  const desktopMargin = collapsed ? COLLAPSED_W : EXPANDED_W

  const navItems = NAV_ITEMS.map(item => ({
    ...item,
    active: path.startsWith(item.href),
  }))

  return (
    <div className="bg-surface min-h-screen">
      <SideNav
        items={navItems}
        user={{ name: 'Alex Vance', handle: '@thecurator', avatar: 'https://i.pravatar.cc/150?img=47' }}
        onCreateClick={() => setCreateOpen(true)}
      />

      <TopBar notificationCount={3} />

      <motion.main
        animate={{ marginLeft: isMobile ? 0 : desktopMargin }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.85 }}
        className="pt-16 lg:pt-20 min-h-screen"
      >
        {children}
      </motion.main>

      {!hideFab && <FAB onClick={() => setCreateOpen(true)} />}

      <CreatePostModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const hideShell = NO_SHELL_ROUTES.includes(location.pathname)

  if (hideShell) return <>{children}</>

  return (
    <SidebarProvider>
      <ShellInner>{children}</ShellInner>
    </SidebarProvider>
  )
}
