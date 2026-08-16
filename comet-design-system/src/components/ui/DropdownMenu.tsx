/**
 * Dropdown Menu Component
 * 
 * Usage:
 * <DropdownMenu>
 *   <DropdownMenu.Trigger>
 *     <button><MoreHorizontal /></button>
 *   </DropdownMenu.Trigger>
 *   <DropdownMenu.Content>
 *     <DropdownMenu.Item onClick={handleEdit}>Edit</DropdownMenu.Item>
 *     <DropdownMenu.Item onClick={handleDelete}>Delete</DropdownMenu.Item>
 *   </DropdownMenu.Content>
 * </DropdownMenu>
 */

import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DropdownContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined)

function useDropdown() {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error('Dropdown components must be used within DropdownMenu')
  }
  return context
}

// Main Component
export function DropdownMenu({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  )
}

// Trigger Component
DropdownMenu.Trigger = function Trigger({ children }: { children: ReactNode }) {
  const { isOpen, setIsOpen } = useDropdown()
  
  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      {children}
    </div>
  )
}

// Content Component
DropdownMenu.Content = function Content({ 
  children, 
  align = 'right' 
}: { 
  children: ReactNode
  align?: 'left' | 'right' 
}) {
  const { isOpen, setIsOpen } = useDropdown()
  const ref = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, setIsOpen])

  // Close on escape
  useEffect(() => {
    if (!isOpen) return

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, setIsOpen])

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className={`absolute ${alignmentClasses[align]} top-full mt-2 w-56 bg-white/95 backdrop-blur-md border border-outline-variant/20 rounded-2xl shadow-xl overflow-hidden z-50`}
        >
          <div className="py-2">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Item Component
DropdownMenu.Item = function Item({ 
  children, 
  onClick, 
  icon,
  variant = 'default',
  disabled = false 
}: { 
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
  variant?: 'default' | 'danger'
  disabled?: boolean
}) {
  const { setIsOpen } = useDropdown()

  const handleClick = () => {
    if (disabled) return
    onClick?.()
    setIsOpen(false)
  }

  const variantClasses = {
    default: 'hover:bg-surface-container text-on-surface',
    danger: 'hover:bg-error/10 text-error',
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-3 transition-colors ${
        disabled ? 'opacity-40 cursor-not-allowed' : variantClasses[variant]
      }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
    </button>
  )
}

// Separator Component
DropdownMenu.Separator = function Separator() {
  return <div className="h-px bg-outline-variant/20 my-1.5" />
}

// Label Component
DropdownMenu.Label = function Label({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">
      {children}
    </div>
  )
}
