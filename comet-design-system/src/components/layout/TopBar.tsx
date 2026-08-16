import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Bell, PanelLeftClose, PanelLeftOpen, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { Input } from '../ui/Input'
import { UserMenu } from '../ui/UserMenu'
import { useSidebar } from '../../providers/SidebarProvider'
import { useTranslation } from '../../hooks/useTranslation'
import { useUIStore } from '../../stores/uiStore'
import { useAuthStore } from '../../stores/authStore'
import { useMyProfile } from '../../hooks/useUserQuery'
import { EXPANDED_W, COLLAPSED_W } from './SideNav'

interface TopBarProps {
  searchPlaceholder?: string
  notificationCount?: number
  className?: string
}

export function TopBar({
  searchPlaceholder,
  notificationCount,
  className,
}: TopBarProps) {
  const navigate = useNavigate()
  const t = useTranslation()
  const isRTL = useUIStore((s) => s.isRTL)
  const { collapsed, isMobile, toggle, toggleMobile } = useSidebar()
  const [menuOpen, setMenuOpen] = useState(false)

  // Get user from auth store and profile query
  const authUser = useAuthStore((s) => s.user)
  const { data: profile } = useMyProfile()
  
  // Use profile data if available, otherwise fall back to auth store
  const user = profile ? {
    name: profile.name || authUser?.name || 'User',
    handle: profile.username ? `@${profile.username}` : '',
    avatar: profile.avatar || authUser?.avatar || undefined,
  } : {
    name: authUser?.name || 'User',
    handle: '',
    avatar: authUser?.avatar || undefined,
  }

  const closeMenu  = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen(v => !v), [])

  const sidebarW = collapsed ? COLLAPSED_W : EXPANDED_W
  const finalSearchPlaceholder = searchPlaceholder || t('header.searchPlaceholder')

  return (
    <motion.header
      // Mobile: full width from edge. Desktop: offset by sidebar width.
      animate={
        isMobile
          ? { marginLeft: 0, marginRight: 0, width: '100%' }
          : isRTL
            ? { marginLeft: 0, marginRight: sidebarW, width: `calc(100% - ${sidebarW}px)` }
            : { marginLeft: sidebarW, marginRight: 0, width: `calc(100% - ${sidebarW}px)` }
      }
      transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.85 }}
      className={cn(
        'fixed top-0 z-40 h-16 lg:h-20',
        'bg-surface-container-lowest/90 backdrop-blur-2xl',
        'border-b border-outline-variant/10',
        'shadow-[0_4px_24px_rgba(107,70,192,0.05)]',
        className,
      )}
    >
      <div className="h-full grid grid-cols-[auto_1fr_auto] items-center px-4 lg:px-6 gap-3">

        {/* Toggle — hamburger on mobile, panel icon on desktop */}
        <motion.button
          onClick={isMobile ? toggleMobile : toggle}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          aria-label="Toggle sidebar"
          className="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {isMobile
            ? <Menu size={22} />
            : collapsed
              ? <PanelLeftOpen  size={20} className={isRTL ? 'rotate-180' : ''} />
              : <PanelLeftClose size={20} className={isRTL ? 'rotate-180' : ''} />
          }
        </motion.button>

        {/* Search — centered */}
        <div className="flex justify-center">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
            <Input
              variant="search"
              placeholder={finalSearchPlaceholder}
              leadingIcon={<Search size={17} />}
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.button
            onClick={() => navigate('/notifications')}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            aria-label={t('header.notifications')}
            className="relative p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Bell size={20} />
            {notificationCount != null && notificationCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"
              />
            )}
          </motion.button>

          <div className="w-px h-5 bg-outline-variant/20 hidden sm:block" />

          <UserMenu
            open={menuOpen}
            onToggle={toggleMenu}
            onClose={closeMenu}
            user={user}
          />
        </div>
      </div>
    </motion.header>
  )
}
