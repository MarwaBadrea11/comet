import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import type { CardProps } from '../../types'

const paddingMap = { sm: 'p-4', md: 'p-6', lg: 'p-8' }

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ glass, hover, padding = 'md', className, children, ...props }, ref) => {
    // Separate HTML div props from motion-specific ones to avoid type conflicts
    const { onClick, onMouseEnter, onMouseLeave, onFocus, onBlur, style, id, 'aria-label': ariaLabel, ...rest } = props as React.HTMLAttributes<HTMLDivElement> & { 'aria-label'?: string }

    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -2, boxShadow: '0 30px 60px rgba(107, 70, 192, 0.1)' } : undefined}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        style={style}
        id={id}
        aria-label={ariaLabel}
        className={cn(
          'rounded-3xl',
          glass
            ? 'bg-surface-container-highest/70 backdrop-blur-2xl border border-outline-variant/15'
            : 'bg-surface-container-lowest',
          'shadow-[0_20px_40px_rgba(107,70,192,0.06)]',
          paddingMap[padding],
          className,
        )}
        {...(rest as object)}
      >
        {children}
      </motion.div>
    )
  },
)

Card.displayName = 'Card'
