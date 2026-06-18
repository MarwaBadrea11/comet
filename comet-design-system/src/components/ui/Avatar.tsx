import { cn } from '../../lib/utils'
import type { AvatarProps } from '../../types'

const sizeMap = {
  sm: { outer: 'h-8 w-8', inner: 'border-2', badge: 'h-3 w-3 border', text: 'text-xs' },
  md: { outer: 'h-12 w-12', inner: 'border-2', badge: 'h-4 w-4 border-2', text: 'text-sm' },
  lg: { outer: 'h-16 w-16', inner: 'border-[3px]', badge: 'h-5 w-5 border-2', text: 'text-base' },
  xl: { outer: 'h-24 w-24', inner: 'border-4', badge: 'h-6 w-6 border-2', text: 'text-lg' },
}

export function Avatar({ src, alt = '', size = 'md', ring, ringVariant = 'gradient', verified, className }: AvatarProps) {
  const s = sizeMap[size]

  const inner = (
    <div className={cn('rounded-full overflow-hidden bg-surface-container-high', s.outer, className)}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className={cn('w-full h-full flex items-center justify-center bg-primary-fixed text-primary font-bold', s.text)}>
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )

  if (!ring && !verified) return inner

  return (
    <div className="relative inline-flex shrink-0">
      {ring ? (
        <div
          className={cn(
            'rounded-full p-[3px]',
            ringVariant === 'gradient'
              ? 'bg-gradient-to-tr from-[#6B46C0] to-[#00D4FF]'
              : 'bg-outline-variant/40',
          )}
        >
          <div className={cn('rounded-full p-0.5 bg-surface', s.inner.replace('border-', ''))}>
            <div className={cn('rounded-full overflow-hidden bg-surface-container-high', s.outer)}>
              {src ? (
                <img src={src} alt={alt} className={cn('w-full h-full object-cover', ringVariant === 'viewed' && 'grayscale')} />
              ) : (
                <div className={cn('w-full h-full flex items-center justify-center bg-primary-fixed text-primary font-bold', s.text)}>
                  {alt.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : inner}

      {verified && (
        <div className={cn('absolute bottom-0 right-0 bg-primary rounded-full border-surface flex items-center justify-center text-white', s.badge)}>
          <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        </div>
      )}
    </div>
  )
}
