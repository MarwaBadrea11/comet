import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  description?: string
  className?: string
}

export function Toggle({ checked, onChange, label, description, className }: ToggleProps) {
  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {(label || description) && (
        <div>
          {label && <p className="font-headline font-bold text-sm text-on-surface">{label}</p>}
          {description && <p className="text-[11px] text-on-surface-variant">{description}</p>}
        </div>
      )}
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-14 h-8 rounded-full p-1 transition-colors duration-300 shrink-0',
          checked
            ? 'bg-gradient-to-r from-[#6B46C0] to-[#8E5EFF] shadow-[0_4px_12px_rgba(107,70,192,0.3)]'
            : 'bg-surface-container-high',
        )}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn('h-6 w-6 bg-white rounded-full shadow-md', checked ? 'ml-auto' : 'ml-0')}
        />
      </button>
    </div>
  )
}
