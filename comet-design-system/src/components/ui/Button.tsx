import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import type { ButtonProps } from '../../types'

const sizeMap = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
}

const variantMap = {
  primary: [
    'bg-gradient-to-r from-[#6B46C0] to-[#8E5EFF]',
    'text-white font-bold',
    'shadow-[0_12px_24px_rgba(107,70,192,0.3)]',
    'hover:shadow-[0_16px_32px_rgba(107,70,192,0.4)]',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
  ].join(' '),
  secondary: [
    'border-2 border-[rgba(203,195,213,0.3)]',
    'text-primary font-bold bg-transparent',
    'hover:bg-surface-container-low',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'text-on-surface-variant font-semibold bg-transparent',
    'hover:bg-surface-container-low',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
  icon: [
    'bg-gradient-to-r from-[#6B46C0] to-[#8E5EFF]',
    'text-white rounded-full !px-0 aspect-square',
    'shadow-[0_8px_16px_rgba(107,70,192,0.2)]',
    'flex items-center justify-center',
  ].join(' '),
}

// Framer Motion spring config
const spring = { type: 'spring' as const, stiffness: 400, damping: 20 }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, iconPosition = 'left', className, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading

    return (
      // motion.div wrapper handles the animation; inner button handles all HTML semantics
      <motion.div
        whileHover={isDisabled ? {} : { scale: 1.02 }}
        whileTap={isDisabled ? {} : { scale: 0.96 }}
        transition={spring}
        className="inline-flex"
        style={{ display: 'inline-flex' }}
      >
        <button
          ref={ref}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-full font-body transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 select-none w-full',
            sizeMap[size],
            variantMap[variant],
            className,
          )}
          disabled={isDisabled}
          {...props}
        >
          {loading ? (
            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
              {children}
              {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
            </>
          )}
        </button>
      </motion.div>
    )
  },
)

Button.displayName = 'Button'
