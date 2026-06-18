import type { ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from 'react'

export type Size = 'sm' | 'md' | 'lg'
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon'
export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'outline'

export interface BaseProps {
  className?: string
  children?: ReactNode
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseProps {
  variant?: ButtonVariant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  variant?: 'default' | 'search'
}

export interface CardProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  glass?: boolean
  hover?: boolean
  padding?: Size
}

export interface BadgeProps extends BaseProps {
  variant?: BadgeVariant
  size?: Size
  dot?: boolean
}

export interface ModalProps extends BaseProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
}

export interface SpinnerProps {
  size?: Size
  variant?: 'spin' | 'dots'
  className?: string
}

export interface AvatarProps {
  src?: string
  alt?: string
  size?: Size | 'xl'
  ring?: boolean
  ringVariant?: 'gradient' | 'viewed'
  verified?: boolean
  className?: string
}

export interface NavItem {
  label: string
  icon: string
  href: string
  active?: boolean
  badge?: number
}
