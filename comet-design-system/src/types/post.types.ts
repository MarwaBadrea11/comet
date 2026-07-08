/**
 * Post module type definitions.
 * Aligned with backend /post endpoints.
 */

// ── Enums ────────────────────────────────────────────────────────────────────

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  FRIENDS = 'FRIENDS',
  ONLY_ME = 'ONLY_ME',
  CUSTOM = 'CUSTOM',
}

export enum ScheduledPostStatus {
  DIRECT = 'DIRECT',
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
}

export enum ReactionType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  CARE = 'CARE',
  HAHA = 'HAHA',
  WOW = 'WOW',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
}

export enum ReactableType {
  POST = 'POST',
  COMMENT = 'COMMENT',
}

// ── User Types ───────────────────────────────────────────────────────────────

export interface PostUser {
  id: string
  name: string
  username: string
  email?: string
  avatarMediaId?: string | null
}

// ── Media Types ──────────────────────────────────────────────────────────────

export interface Media {
  id: string
  fileName: string
  originalName: string
  mimeType: string
  path: string
  size: string
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

// ── Post Types ───────────────────────────────────────────────────────────────

export interface Post {
  id: string
  userId: string
  content: string | null
  visibility: PostVisibility
  feeling: string | null
  location: string | null
  isEdited: boolean
  viewsCount: number
  globalScore: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  sharedPostId: string | null
  status?: ScheduledPostStatus
  // Relations
  user?: PostUser
  media?: Media[]
  reactions?: Reaction[]
  comments?: Comment[]
  hashtags?: Hashtag[]
  _count?: {
    comments: number
    reactions: number
  }
}

export interface Reaction {
  id: string
  userId: string
  reactableId: string
  reactableType: ReactableType
  reactionType: ReactionType
  createdAt: string
  deletedAt: string | null
}

export interface Comment {
  id: string
  postId: string
  userId: string
  parentId: string | null
  content: string
  isEdited: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  user?: PostUser
  replies?: Comment[]
}

export interface Hashtag {
  id: string
  name: string
  nameLower: string
  createdAt: string
}

export interface HiddenPost {
  userId: string
  postId: string
  createdAt: string
}

export interface SavedPost {
  id: string
  userId: string
  postId: string
  createdAt: string
}

// ── Request/Response Types ───────────────────────────────────────────────────

export interface CreatePostRequest {
  content?: string
  visibility?: PostVisibility
  feeling?: string
  location?: string
  mediaIds?: string[]
}

export interface UpdatePostRequest {
  content?: string
  visibility?: PostVisibility
  feeling?: string
  location?: string
  mediaIds?: string[]
}

export interface SchedulePostRequest {
  content?: string
  visibility?: PostVisibility
  feeling?: string
  location?: string
  mediaIds?: string[]
  scheduledAt: string // ISO 8601 timestamp
}

export interface SharePostRequest {
  quoteContent?: string
}

export interface FeedParams {
  page?: number
  pageSize?: number
}

export interface FeedResponse {
  posts: Post[]
  pagination?: {
    page: number
    pageSize: number
    total: number
    hasMore: boolean
  }
}
