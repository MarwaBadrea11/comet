import { useRef, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Sun, Moon, LogOut, ChevronDown, User, Settings } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTheme } from '../../providers/ThemeProvider'
import { useAuth } from '../../context/AuthContext'

interface UserMenuProps {
  open: boolean
  onToggle: () => void
  onClose: () => void
  user: { name: string; handle: string; avatar?: string }
  className?: string
}

const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 28, mass: 0.8 },
  },
  exit: {
    opacity: 0, scale: 0.95, y: -8,
    transition: { duration: 0.15 },
  },
}

export function UserMenu({ open, onToggle, onClose, user, className }: UserMenuProps) {
  const { theme, toggleTheme } = useTheme()
  const { signOut } = useAuth()
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  const handleLogout = () => {
    onClose()
    signOut()
  }

  const handleProfile = () => {
    onClose()
    window.location.href = '/profile'
  }

  const handleSettings = () => {
    onClose()
    window.location.href = '/settings'
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Trigger */}
      <button
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={open}
        className={cn(
          'flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full transition-all duration-200 select-none',
          'hover:bg-surface-container-low',
          open && 'bg-surface-container-low',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        )}
      >
        {/* Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#6B46C0] to-[#8E5EFF] flex items-center justify-center text-white text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
        </div>

        {/* Name */}
        <div className="hidden sm:flex flex-col items-start leading-none">
          <span className="text-sm font-bold text-on-surface">{user.name}</span>
          <span className="text-[10px] text-on-surface-variant font-label">{user.handle}</span>
        </div>

        {/* Arrow */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="text-on-surface-variant"
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="menu"
            aria-label="User menu"
            className={cn(
              'absolute right-0 top-[calc(100%+10px)] z-50',
              'w-64 origin-top-right',
              'bg-white/80 dark:bg-surface-container-highest/90',
              'backdrop-blur-2xl',
              'rounded-2xl',
              'border border-outline-variant/20',
              'shadow-[0_20px_60px_rgba(107,70,192,0.14),0_4px_16px_rgba(0,0,0,0.06)]',
              'overflow-hidden',
            )}
          >
            {/* User info header */}
            <div className="px-4 pt-4 pb-3 border-b border-outline-variant/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#6B46C0] to-[#8E5EFF] flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
                  <p className="text-[11px] text-on-surface-variant truncate">{user.handle}</p>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-2">
              {/* Profile */}
              <MenuItem
                icon={<User size={16} />}
                label="View Profile"
                onClick={handleProfile}
              />

              {/* Settings */}
              <MenuItem
                icon={<Settings size={16} />}
                label="Settings & Privacy"
                onClick={handleSettings}
              />

              {/* Divider */}
              <div className="my-1.5 h-px bg-outline-variant/15 mx-2" />

              {/* Theme toggle */}
              <div
                role="menuitem"
                className={cn(
                  'flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-xl',
                  'text-on-surface-variant hover:text-on-surface',
                  'hover:bg-surface-container-low',
                  'transition-all duration-150 cursor-pointer select-none',
                )}
                onClick={toggleTheme}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                    {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
                  </span>
                  <span className="text-sm font-medium">
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>

                {/* Animated pill toggle */}
                <div
                  className={cn(
                    'relative w-9 h-5 rounded-full transition-colors duration-300 shrink-0',
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-[#6B46C0] to-[#8E5EFF]'
                      : 'bg-surface-container-high',
                  )}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={cn(
                      'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm',
                      theme === 'dark' ? 'left-[calc(100%-1.125rem)]' : 'left-0.5',
                    )}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="my-1.5 h-px bg-outline-variant/15 mx-2" />

              {/* Logout */}
              <div
                role="menuitem"
                onClick={handleLogout}
                className={cn(
                  'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl',
                  'text-error/80 hover:text-error',
                  'hover:bg-error-container/40',
                  'transition-all duration-150 cursor-pointer select-none group',
                )}
              >
                <span className="w-7 h-7 rounded-lg bg-error-container/50 group-hover:bg-error-container flex items-center justify-center shrink-0 transition-colors">
                  <LogOut size={15} className="text-error" />
                </span>
                <span className="text-sm font-semibold">Sign Out</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-outline-variant/10 bg-surface-container-low/40">
              <p className="text-[10px] text-on-surface-variant/50 font-label uppercase tracking-widest text-center">
                Comet v4.2.0 · The Celestial Curator
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Reusable menu item ──────────────────────────────────────────────────────
interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}

function MenuItem({ icon, label, onClick, danger }: MenuItemProps) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left',
        'transition-all duration-150 group',
        danger
          ? 'text-error/80 hover:text-error hover:bg-error-container/40'
          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low',
      )}
    >
      <span className={cn(
        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors',
        danger
          ? 'bg-error-container/50 group-hover:bg-error-container'
          : 'bg-surface-container group-hover:bg-surface-container-high',
      )}>
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}
