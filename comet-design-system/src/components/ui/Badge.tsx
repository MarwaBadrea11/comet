import { cn } from '../../lib/utils'
import type { BadgeProps } from '../../types'

const variantMap = {
  primary: 'bg-primary-fixed text-primary font-bold',
  secondary: 'bg-secondary-fixed text-secondary font-bold',
  success: 'bg-emerald-100 text-emerald-700 font-bold',
  error: 'bg-error-container text-on-error-container font-bold',
  outline: 'border border-outline-variant/30 text-on-surface-variant',
}

const sizeMap = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
}

export function Badge({ variant = 'primary', size = 'md', dot, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-label uppercase tracking-wider',
        variantMap[variant],
        sizeMap[size],
        className,
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
