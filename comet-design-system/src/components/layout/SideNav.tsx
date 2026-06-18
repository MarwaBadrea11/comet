import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Avatar } from '../ui/Avatar'
import { useSidebar } from '../../providers/SidebarProvider'
import type { NavItem } from '../../types'

// ─────────────────────────────────────────────────────────────────────────────
//  Layout constants — exported so TopBar & AppShell stay in sync
// ─────────────────────────────────────────────────────────────────────────────
export const EXPANDED_W  = 240  // px
export const COLLAPSED_W = 64   // px  ← icon-only rail

// The icon button in collapsed mode is this size, perfectly centered in the rail
const ICON_BTN = 40  // px  (h-10 w-10)

// ─────────────────────────────────────────────────────────────────────────────
//  Framer Motion variants
// ─────────────────────────────────────────────────────────────────────────────
const sidebarSpring = { type: 'spring' as const, stiffness: 300, damping: 30, mass: 0.85 }

const labelVariants = {
  expanded:  { opacity: 1, x: 0,  width: 'auto', transition: { delay: 0.07, duration: 0.18 } },
  collapsed: { opacity: 0, x: -8, width: 0,      transition: { duration: 0.13 } },
}

const logoTextVariants = {
  expanded:  { opacity: 1, x: 0,  transition: { delay: 0.07, duration: 0.18 } },
  collapsed: { opacity: 0, x: -6, transition: { duration: 0.12 } },
}

// ─────────────────────────────────────────────────────────────────────────────
//  Tooltip
// ─────────────────────────────────────────────────────────────────────────────
function NavTooltip({ label, visible }: { label: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -6, scale: 0.92 }}
          animate={{ opacity: 1, x: 0,  scale: 1 }}
          exit={{    opacity: 0, x: -4, scale: 0.92 }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          // Sits to the right of the 64px rail
          className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 z-[200] pointer-events-none"
        >
          <div className="relative px-3 py-1.5 rounded-lg bg-on-surface/90 text-inverse-on-surface text-[11px] font-label font-semibold tracking-wide whitespace-nowrap shadow-[0_6px_20px_rgba(0,0,0,0.18)]">
            {label}
            {/* Left-pointing caret */}
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-on-surface/90" />
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
    // Outer wrapper: full width in expanded, fixed-size centered square in collapsed
    <div
      className={cn(
        'relative',
        collapsed
          ? 'flex items-center justify-center w-full'  // center the icon button inside the rail
          : 'w-full',
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.button
        onClick={() => onClick(item.href)}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'flex items-center rounded-xl transition-colors duration-150',
          'font-headline font-medium tracking-tight',
          'outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
          // ── Collapsed: fixed square, icon centered ──
          // ── Expanded:  full width, left-padded row  ──
          collapsed
            ? `h-[${ICON_BTN}px] w-[${ICON_BTN}px] justify-center shrink-0`
            : 'w-full gap-3 px-3 py-2.5',
          item.active
            ? 'text-primary bg-primary/[0.08] font-bold'
            : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low',
        )}
        // Inline style for the collapsed fixed size (Tailwind JIT can't interpolate vars)
        style={collapsed ? { height: ICON_BTN, width: ICON_BTN } : undefined}
      >
        {/* Icon */}
        <motion.span
          animate={
            collapsed && hovered && !item.active
              ? { scale: 1.22, filter: 'drop-shadow(0 3px 10px rgba(107,70,192,0.45))' }
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

        {/* Label */}
        <motion.span
          variants={labelVariants}
          animate={collapsed ? 'collapsed' : 'expanded'}
          className="flex-1 text-left text-sm overflow-hidden whitespace-nowrap"
        >
          {item.label}
        </motion.span>

        {/* Badge pill — expanded only */}
        <AnimatePresence>
          {!collapsed && item.badge != null && item.badge > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{    opacity: 0, scale: 0.6 }}
              className="h-5 min-w-[1.25rem] px-1 bg-error rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0"
            >
              {item.badge}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Badge dot — collapsed only, positioned relative to the icon button */}
        <AnimatePresence>
          {collapsed && item.badge != null && item.badge > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{    opacity: 0, scale: 0 }}
              className="absolute top-0.5 right-0.5 w-2 h-2 bg-error rounded-full border-2 border-white"
            />
          )}
        </AnimatePresence>
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
  const [createHovered, setCreateHovered] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
      initial={false}
      transition={sidebarSpring}
      className={cn(
        'h-screen fixed left-0 top-0 z-50 overflow-hidden',
        'bg-white/82 backdrop-blur-xl',
        'border-r border-outline-variant/10',
        'flex flex-col',
        'shadow-[2px_0_24px_rgba(107,70,192,0.07)]',
        className,
      )}
      style={{ minWidth: COLLAPSED_W }}
    >

      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      {/*
        Strategy: always render a flex row.
        - Collapsed: justify-content center, no padding → orb sits dead-center in 64px
        - Expanded:  justify-content flex-start, px-5 → orb + text left-aligned
      */}
      <div
        className={cn(
          'flex items-center shrink-0 h-20',
          collapsed ? 'justify-center' : 'justify-start gap-3 px-5',
        )}
      >
        {/* Orb — always rendered, always the same size */}
        <div
          className="shrink-0 rounded-lg bg-gradient-to-br from-[#6B46C0] to-[#00D4FF] flex items-center justify-center shadow-[0_4px_14px_rgba(107,70,192,0.30)]"
          style={{ width: 32, height: 32 }}
        >
          <span
            className="material-symbols-outlined text-white select-none"
            style={{ fontSize: 16, fontVariationSettings: "'FILL' 1", lineHeight: 1 }}
          >
            flare
          </span>
        </div>

        {/* Brand text — fades out when collapsed */}
        <motion.div
          variants={logoTextVariants}
          animate={collapsed ? 'collapsed' : 'expanded'}
          className="overflow-hidden min-w-0"
        >
          <p className="text-[18px] font-headline font-extrabold bg-gradient-to-r from-[#6B46C0] to-[#00D4FF] bg-clip-text text-transparent leading-none whitespace-nowrap">
            Comet
          </p>
          <p className="text-[8.5px] font-label font-semibold tracking-[0.16em] uppercase text-on-surface-variant whitespace-nowrap mt-0.5">
            The Celestial Curator
          </p>
        </motion.div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div className="mx-3 h-px bg-outline-variant/10 shrink-0" />

      {/* ── Nav items ────────────────────────────────────────────────────── */}
      {/*
        Collapsed: flex-col + items-center → each NavItemRow wrapper is full-width
                   but its inner button is a fixed 40×40 square, so it centers.
        Expanded:  flex-col, no items-center → rows are full-width left-padded.
      */}
      <nav
        className={cn(
          'flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-3 gap-0.5',
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
          'shrink-0 pb-3',
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
              'flex items-center justify-center',
              'bg-gradient-to-r from-[#6B46C0] to-[#8E5EFF] text-white font-bold',
              'shadow-[0_6px_18px_rgba(107,70,192,0.28)] hover:shadow-[0_10px_26px_rgba(107,70,192,0.40)]',
              'transition-shadow duration-200 rounded-full',
              collapsed ? 'gap-0' : 'w-full h-11 gap-2 px-4',
            )}
            style={collapsed ? { height: ICON_BTN, width: ICON_BTN } : undefined}
          >
            <Plus size={collapsed ? 18 : 16} strokeWidth={2.5} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto', transition: { delay: 0.07 } }}
                  exit={{    opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap text-sm font-bold"
                >
                  Create
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {collapsed && <NavTooltip label="Create Post" visible={createHovered} />}
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
            <Avatar src={user.avatar} alt={user.name} size="sm" className="shrink-0" />
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
