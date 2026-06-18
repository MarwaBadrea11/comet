import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/utils'

interface FABProps {
  onClick?: () => void
  icon?: React.ReactNode
  className?: string
}

export function FAB({ onClick, icon, className }: FABProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn(
        'fixed bottom-10 right-10 z-50',
        'h-16 w-16 rounded-full',
        'bg-gradient-to-br from-[#6B46C0] to-[#8E5EFF]',
        'text-white shadow-[0_20px_40px_rgba(107,70,192,0.3)]',
        'flex items-center justify-center',
        'group',
        className,
      )}
      aria-label="Create"
    >
      <motion.span
        className="group-hover:rotate-90 transition-transform duration-300"
      >
        {icon ?? <Plus size={28} />}
      </motion.span>
    </motion.button>
  )
}
