/**
 * Segmented Control Component
 * 
 * Usage:
 * <SegmentedControl
 *   value={selected}
 *   onChange={setSelected}
 *   options={[
 *     { value: 'all', label: 'All', icon: <Globe /> },
 *     { value: 'users', label: 'Users', icon: <Users /> },
 *   ]}
 * />
 */

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Option<T extends string = string> {
  value: T
  label: string
  icon?: ReactNode
  description?: string
}

interface SegmentedControlProps<T extends string = string> {
  value: T
  onChange: (value: T) => void
  options: Option<T>[]
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'pills'
  fullWidth?: boolean
}

export function SegmentedControl<T extends string = string>({
  value,
  onChange,
  options,
  size = 'md',
  variant = 'default',
  fullWidth = false,
}: SegmentedControlProps<T>) {
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  }

  const paddingClasses = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  }

  const containerClasses = variant === 'default'
    ? 'bg-surface-container/50 backdrop-blur-sm rounded-xl p-1 border border-outline-variant/20'
    : 'gap-2'

  return (
    <div 
      className={`inline-flex items-center ${containerClasses} ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      {options.map((option) => {
        const isSelected = value === option.value

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`relative ${sizeClasses[size]} ${paddingClasses[size]} font-medium transition-colors ${
              fullWidth ? 'flex-1' : ''
            } ${
              variant === 'pills' ? 'rounded-xl' : 'rounded-lg'
            } ${
              isSelected
                ? variant === 'default'
                  ? 'text-on-primary'
                  : 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            } flex items-center justify-center gap-2`}
          >
            {/* Background for selected item in default variant */}
            {isSelected && variant === 'default' && (
              <motion.div
                layoutId="segmented-control-bg"
                className="absolute inset-0 bg-primary rounded-lg shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
              {option.icon && <span className="shrink-0">{option.icon}</span>}
              <span>{option.label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

/**
 * Vertical Segmented Control with descriptions
 */
export function SegmentedControlVertical<T extends string = string>({
  value,
  onChange,
  options,
}: SegmentedControlProps<T>) {
  return (
    <div className="space-y-2">
      {options.map((option) => {
        const isSelected = value === option.value

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-outline-variant/20 hover:border-outline-variant/40 hover:bg-surface-container/50'
            }`}
          >
            <div className="flex items-start gap-3">
              {option.icon && (
                <div className={`shrink-0 p-2 rounded-lg ${
                  isSelected ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {option.icon}
                </div>
              )}
              <div className="flex-1">
                <div className={`font-bold text-sm mb-1 ${
                  isSelected ? 'text-primary' : 'text-on-surface'
                }`}>
                  {option.label}
                </div>
                {option.description && (
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {option.description}
                  </p>
                )}
              </div>
              {isSelected && (
                <div className="shrink-0 w-2 h-2 bg-primary rounded-full" />
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
