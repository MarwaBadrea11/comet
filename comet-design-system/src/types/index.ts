/**
 * Central export for all type definitions.
 * Import types from here for convenience.
 */

// Post types (exports: Post, PostUser, PostVisibility, ScheduledPostStatus, etc.)
export * from './post.types'

// Story types
export * from './story.types'

// Search types
export * from './search.types'

// Media types are already exported from post.types, so we skip to avoid duplicates
// export * from './media.types'

// Re-export specific types from reaction and comment modules
export type { 
  // Reaction request/response types
  ToggleReactionRequest,
  ToggleReactionResponse,
  GetMyReactionsResponse,
  ReactionSummary,
  UserReactionStatus,
} from './reaction.types'

export type {
  // Comment request/response types
  CreateCommentRequest,
  CreateCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
  DeleteCommentResponse,
  GetMyCommentsResponse,
  GetCommentResponse,
  CommentThread,
  CommentFormValues,
} from './comment.types'

// Friendship types
export interface FriendRequest {
  id: string
  requesterId: string
  receiverId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  requester?: UserProfile
  receiver?: UserProfile
}

export interface FriendshipStatus {
  isFriend: boolean
  isPending: boolean
  isOutgoing: boolean
  requestId?: string
}

export interface BlockedUser {
  id: string
  blockerId: string
  blockedId: string
  createdAt: string
  blocked?: UserProfile
}

export interface UserProfile {
  id: string
  name: string
  username: string
  email?: string
  city?: string
  country?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  role?: string
  bio?: string
  avatar?: string
  avatarMedia?: any
  coverMedia?: any
  createdAt?: string
  friendsCount?: number
}

// UI Component Props
export interface BaseProps {
  className?: string
  children?: React.ReactNode
}

export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: number
  active?: boolean
}

// Avatar Props
export interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  badge?: boolean
  ring?: boolean
  ringVariant?: string
  verified?: boolean
  className?: string
}

// Badge Props
export interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  className?: string
}

// Button Props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

// Card Props
export interface CardProps {
  children: React.ReactNode
  padding?: 'sm' | 'md' | 'lg'
  clickable?: boolean
  glass?: boolean
  hover?: boolean
  className?: string
}

// Input Props
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  variant?: string
}

// Modal Props
export interface ModalProps {
  isOpen?: boolean
  open?: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

// Spinner Props
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: string
  className?: string
}
