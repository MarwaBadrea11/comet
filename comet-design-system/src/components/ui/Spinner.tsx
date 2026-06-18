import { cn } from '../../lib/utils'
import type { SpinnerProps } from '../../types'

const sizeMap = { sm: 'h-5 w-5 border-2', md: 'h-8 w-8 border-[3px]', lg: 'h-12 w-12 border-4' }
const dotSizeMap = { sm: 'w-1.5 h-1.5', md: 'w-2 h-2', lg: 'w-3 h-3' }

export function Spinner({ size = 'md', variant = 'spin', className }: SpinnerProps) {
  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {[0, 0.15, 0.3].map((delay, i) => (
          <span
            key={i}
            className={cn('rounded-full bg-primary animate-bounce', dotSizeMap[size])}
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-full border-surface-container-high border-t-primary animate-spin',
        sizeMap[size],
        className,
      )}
    />
  )
}
