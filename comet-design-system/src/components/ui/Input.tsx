import { forwardRef } from 'react'
import { cn } from '../../lib/utils'
import type { InputProps } from '../../types'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leadingIcon, trailingIcon, variant = 'default', className, ...props }, ref) => {
    const isSearch = variant === 'search'

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant px-1">
            {label}
          </label>
        )}

        <div className="relative group">
          {leadingIcon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            className={cn(
              'w-full border-none outline-none font-body text-on-surface placeholder:text-on-surface-variant/50 dark:placeholder:text-on-surface-variant/40',
              'transition-all duration-300',
              'focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30',
              isSearch
                ? 'bg-surface-container-lowest dark:bg-surface-container-high/60 shadow-[0_20px_40px_rgba(107,70,192,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.25)] rounded-full py-3.5 focus:ring-2'
                : 'bg-surface-container-low dark:bg-surface-container-high/50 rounded-2xl py-3.5 focus:bg-surface-container-lowest dark:focus:bg-surface-container-high/70',
              leadingIcon ? 'pl-12' : 'pl-5',
              trailingIcon ? 'pr-12' : 'pr-5',
              error && 'ring-2 ring-error/40',
              className,
            )}
            {...props}
          />

          {trailingIcon && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-outline cursor-pointer">
              {trailingIcon}
            </span>
          )}
        </div>

        {error && <p className="text-[11px] text-error px-1">{error}</p>}
        {hint && !error && <p className="text-[11px] text-on-surface-variant px-1">{hint}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
