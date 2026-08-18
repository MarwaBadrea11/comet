import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Avatar } from '../ui/Avatar'
import { useSidebar } from '../../providers/SidebarProvider'
import { useTranslation } from '../../hooks/useTranslation'
import type { NavItem } from '../../types'
import logoImg from '../../assets/logo.png'

// Helper function to get avatar URL or undefined
const getAvatarUrl = (user?: { avatar?: string }) => user?.avatar

// ─────────────────────────────────────────────────────────────────────────────
//  Layout constants — exported so TopBar & AppShell stay in sync
// ─────────────────────────────────────────────────────────────────────────────
export const EXPANDED_W  = 240  // px
export const COLLAPSED_W = 80   // px  ← icon-only rail (increased for better spacing)

// The icon button in collapsed mode is this size, perfectly centered in the rail
const ICON_BTN_SIZE = 44  // px  (w-11 h-11 for better touch targets)

// ─────────────────────────────────────────────────────────────────────────────
//  Framer Motion variants
// ─────────────────────────────────────────────────────────────────────────────
const sidebarSpring = { type: 'spring' as const, stiffness: 300, damping: 30, mass: 0.85 }

const labelVariants = {
  expanded:  { opacity: 1, x: 0,  width: 'auto', transition: { delay: 0.07, duration: 0.18 } },
  collapsed: { opacity: 0, x: -8, width: 0,      transition: { duration: 0.13 } },
}

// ─────────────────────────────────────────────────────────────────────────────
//  Tooltip
// ─────────────────────────────────────────────────────────────────────────────
function NavTooltip({ label, visible }: { label: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{    opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          // Sits to the right of the rail in LTR, left in RTL
          className="absolute left-[calc(100%+10px)] rtl:left-auto rtl:right-[calc(100%+10px)] top-1/2 -translate-y-1/2 z-[200] pointer-events-none"
        >
          <div className="relative px-3 py-1.5 rounded-lg bg-on-surface/90 text-inverse-on-surface text-[11px] font-label font-semibold tracking-wide whitespace-nowrap shadow-[0_6px_20px_rgba(0,0,0,0.18)]">
            {label}
            {/* Pointing caret */}
            <span className="absolute right-full rtl:right-auto rtl:left-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-on-surface/90 rtl:border-r-transparent rtl:border-l-on-surface/90" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  Single nav row
// ─────────────────────────────────────────────────────────────────────────────
interface NavItemRowProps {
  item: NavItem
  collapsed: boolean
  onClick: (href: string) => void
}

function NavItemRow({ item, collapsed, onClick }: NavItemRowProps) {
  const [hovered, setHovered] = useState(false)

  return (
    // Outer wrapper: full width in expanded, flex container for centering in collapsed
    <div
      className={cn(
        'relative',
        collapsed ? 'flex items-center justify-center w-full' : 'w-full',
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.button
        onClick={() => onClick(item.href)}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative flex items-center justify-center transition-all duration-300 ease-in-out',
          'font-headline font-medium tracking-tight',
          'outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
          // ── Collapsed: fixed square (w-11 h-11), perfectly centered, rounded-full ──
          // ── Expanded:  full width, left-padded row, rounded-xl  ──
          collapsed
            ? 'w-11 h-11 rounded-full shrink-0'
            : 'w-full gap-3 px-3 py-2.5 rounded-xl',
          item.active
            ? 'text-primary bg-primary/[0.08] font-bold'
            : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low',
        )}
      >
        {/* Icon */}
        <motion.span
          animate={
            collapsed && hovered && !item.active
              ? { scale: 1.15, filter: 'drop-shadow(0 3px 10px rgba(107,70,192,0.45))' }
              : { scale: 1,    filter: 'none' }
          }
          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
          className="material-symbols-outlined shrink-0 select-none"
          style={{
            fontSize: 22,
            lineHeight: 1,
            fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          {item.icon}
        </motion.span>

        {/* Label - only render when expanded */}
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 text-left text-sm overflow-hidden whitespace-nowrap"
          >
            {item.label}
          </motion.span>
        )}

        {/* Badge pill — expanded only */}
        {!collapsed && item.badge != null && item.badge > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2 }}
            className="h-5 min-w-[1.25rem] px-1 bg-error rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0"
          >
            {item.badge}
          </motion.span>
        )}

        {/* Badge dot — collapsed only, positioned at top-right of button */}
        {collapsed && item.badge != null && item.badge > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full border-2 border-surface-container-lowest"
          />
        )}
      </motion.button>

      {/* Tooltip — collapsed mode only */}
      {collapsed && <NavTooltip label={item.label} visible={hovered} />}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
//  SideNav
// ─────────────────────────────────────────────────────────────────────────────
interface SideNavProps {
  items: NavItem[]
  user?: { name: string; handle: string; avatar?: string }
  onCreateClick?: () => void
  className?: string
}

export function SideNav({ items, user, onCreateClick, className }: SideNavProps) {
  const { collapsed } = useSidebar()
  const navigate = useNavigate()
  const t = useTranslation()
  const [createHovered, setCreateHovered] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
      initial={false}
      transition={sidebarSpring}
      className={cn(
        'h-screen fixed top-0 z-50 overflow-hidden',
        'bg-surface-container-lowest/95 backdrop-blur-xl',
        'shadow-[2px_0_24px_rgba(107,70,192,0.07)]',
        'flex flex-col',
        'left-0 border-r rtl:left-auto rtl:right-0 rtl:border-r-0 rtl:border-l border-outline-variant/10',
        className,
      )}
      style={{ 
        minWidth: COLLAPSED_W,
      }}
    >

      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center shrink-0 h-20">
        {/* Logo image — always rendered, always the same size */}
        <img
          src={logoImg}
          alt="Comet logo"
          className="shrink-0 object-contain"
          style={{ width: 120, height: 120 }}
        />
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div className="mx-3 h-px bg-outline-variant/10 shrink-0" />

      {/* ── Nav items ────────────────────────────────────────────────────── */}
      {/*
        Collapsed: flex-col + items-center → each NavItemRow wrapper is full-width
                   but its inner button is a fixed 44×44 circle, perfectly centered.
        Expanded:  flex-col, no items-center → rows are full-width left-padded.
      */}
      <nav
        className={cn(
          'flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-4 gap-1 transition-all duration-300',
          collapsed ? 'items-center px-0' : 'items-stretch px-2',
        )}
      >
        {items.map(item => (
          <NavItemRow
            key={item.href}
            item={item}
            collapsed={collapsed}
            onClick={href => navigate(href)}
          />
        ))}
      </nav>

      {/* ── Create button ────────────────────────────────────────────────── */}
      <div
        className={cn(
          'shrink-0 pb-4 transition-all duration-300',
          collapsed ? 'flex justify-center px-0' : 'px-2',
        )}
      >
        <div
          className="relative"
          onMouseEnter={() => setCreateHovered(true)}
          onMouseLeave={() => setCreateHovered(false)}
        >
          <motion.button
            onClick={onCreateClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={cn(
              'flex items-center justify-center transition-all duration-300',
              'bg-gradient-to-r from-[#6B46C0] to-[#8E5EFF] text-white font-bold',
              'shadow-[0_6px_18px_rgba(107,70,192,0.28)] hover:shadow-[0_10px_26px_rgba(107,70,192,0.40)]',
              'rounded-full',
              collapsed ? 'w-11 h-11' : 'w-full h-11 gap-2 px-4',
            )}
          >
            <Plus size={collapsed ? 20 : 16} strokeWidth={2.5} className="shrink-0" />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="overflow-hidden whitespace-nowrap text-sm font-bold"
              >
                {t('sidebar.create')}
              </motion.span>
            )}
          </motion.button>

          {collapsed && <NavTooltip label={t('sidebar.createPost')} visible={createHovered} />}
        </div>
      </div>

      {/* ── User footer ──────────────────────────────────────────────────── */}
      {user && (
        <>
          <div className="mx-3 h-px bg-outline-variant/10 shrink-0" />
          <div
            className={cn(
              'flex items-center shrink-0 py-3 overflow-hidden',
              collapsed ? 'justify-center px-0' : 'gap-3 px-3',
            )}
          >
            <Avatar src={getAvatarUrl(user)} alt={user.name} size="sm" className="shrink-0" />
            <motion.div
              variants={labelVariants}
              animate={collapsed ? 'collapsed' : 'expanded'}
              className="overflow-hidden min-w-0"
            >
              <p className="text-sm font-bold text-on-surface truncate whitespace-nowrap leading-tight">
                {user.name}
              </p>
              <p className="text-[11px] text-on-surface-variant truncate whitespace-nowrap">
                {user.handle}
              </p>
            </motion.div>
          </div>
        </>
      )}
    </motion.aside>
  )
}
