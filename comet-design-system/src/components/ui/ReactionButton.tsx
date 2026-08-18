import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Reaction, ReactionType } from '../../types'

/**
 * All 7 reaction types the backend actually supports (Prisma ReactionType
 * enum) — see apps/api/prisma/schema.prisma. Previously only LIKE was wired
 * up anywhere in the UI.
 */
const REACTIONS: Array<{ type: ReactionType; emoji: string; label: string; color: string }> = [
  { type: 'LIKE', emoji: '👍', label: 'Like', color: 'text-[#2C7BE5]' },
  { type: 'LOVE', emoji: '❤️', label: 'Love', color: 'text-red-500' },
  { type: 'CARE', emoji: '🥰', label: 'Care', color: 'text-yellow-500' },
  { type: 'HAHA', emoji: '😂', label: 'Haha', color: 'text-yellow-500' },
  { type: 'WOW', emoji: '😮', label: 'Wow', color: 'text-yellow-500' },
  { type: 'SAD', emoji: '😢', label: 'Sad', color: 'text-yellow-500' },
  { type: 'ANGRY', emoji: '😡', label: 'Angry', color: 'text-orange-600' },
]

const REACTION_BY_TYPE = Object.fromEntries(REACTIONS.map((r) => [r.type, r]))

interface ReactionButtonProps {
  reactions?: Reaction[]
  userId?: string
  onReact: (reactionType: ReactionType) => void
  disabled?: boolean
  className?: string
}

export function ReactionButton({ reactions, userId, onReact, disabled, className }: ReactionButtonProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)

  const myReaction = userId ? reactions?.find((r) => r.userId === userId) : undefined
  const current = myReaction ? REACTION_BY_TYPE[myReaction.reactionType] : undefined

  const openPicker = () => {
    window.clearTimeout(closeTimer.current)
    setPickerOpen(true)
  }

  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setPickerOpen(false), 250)
  }

  const handleMainClick = () => {
    // Simple click: toggle current reaction off, or default to LIKE.
    onReact(myReaction ? myReaction.reactionType : 'LIKE')
    setPickerOpen(false)
  }

  const handlePick = (type: ReactionType) => {
    onReact(type)
    setPickerOpen(false)
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={openPicker}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={handleMainClick}
        disabled={disabled}
        className={
          className ??
          `flex items-center gap-1.5 p-2 hover:bg-surface rounded-xl transition-all active:scale-95 ${
            current ? current.color : 'hover:text-red-500'
          }`
        }
      >
        <span className="text-base leading-none">{current ? current.emoji : '🤍'}</span>
        <span>{reactions?.length ?? 0}</span>
      </button>

      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            onMouseEnter={openPicker}
            onMouseLeave={scheduleClose}
            className="absolute bottom-full left-0 mb-2 flex items-center gap-1 bg-surface-container-lowest rounded-full shadow-xl border border-outline-variant/15 px-2 py-1.5 z-20"
          >
            {REACTIONS.map((r) => (
              <button
                key={r.type}
                type="button"
                onClick={() => handlePick(r.type)}
                title={r.label}
                className="text-xl leading-none p-1 rounded-full hover:scale-125 hover:-translate-y-1 transition-transform"
              >
                {r.emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
