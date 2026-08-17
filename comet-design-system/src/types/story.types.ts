/**
 * Story module type definitions.
 * Aligned with backend /story endpoints (apps/api/src/stories/story.service.ts).
 *
 * NOTE: unlike Post media, Story media is NOT run through the backend's
 * serializeMedia() step, so each media entry only carries {id, path, mimeType} —
 * no ready-made `url`. Build the URL client-side with getStoryMediaUrl()
 * from services/stories.ts.
 */

/**
 * Story visibility type.
 * Matches backend StoryVisibility enum.
 */
export type StoryVisibility = 'PUBLIC' | 'FRIENDS' | 'ONLY_ME' | 'CUSTOM' | 'PRIVATE'

export interface StoryMedia {
  media: {
    id: string
    path: string
    mimeType: string
  }
}

export interface StoryAuthor {
  id: string
  username: string
  name: string
  avatarMediaId?: string | null
}

export interface StoryPost {
  id: string
  userId: string
  content: string | null
  visibility: StoryVisibility
  createdAt: string
  user: StoryAuthor
  media: StoryMedia[]
}

export interface Story {
  id: string
  postId: string
  duration: number
  expiresAt: string
  createdAt: string
  post: StoryPost
}

export interface StoryGroup {
  user: StoryAuthor
  stories: Story[]
}

export interface CreateStoryPayload {
  content?: string
  visibility?: StoryVisibility
  mediaIds?: string[]
  duration?: number
}

export interface UpdateStoryPayload {
  content?: string
  duration?: number
}

// Legacy aliases for backward compatibility
/** @deprecated Use StoryGroup instead */
export type StoryFeedGroup = StoryGroup
/** @deprecated Use CreateStoryPayload instead */
export type CreateStoryRequest = CreateStoryPayload
/** @deprecated Use UpdateStoryPayload instead */
export type UpdateStoryRequest = UpdateStoryPayload
