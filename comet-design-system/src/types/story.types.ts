/**
 * Story module type definitions.
 * Aligned with backend /story endpoints (apps/api/src/stories/story.service.ts).
 *
 * NOTE: unlike Post media, Story media is NOT run through the backend's
 * serializeMedia() step, so each media entry only carries {id, path, mimeType} —
 * no ready-made `url`. Build the URL client-side with getStoryMediaUrl()
 * from services/stories.ts.
 */

import type { PostVisibility } from './post.types'

export interface StoryMedia {
  media: {
    id: string
    path: string
    mimeType: string
  }
}

export interface StoryPostUser {
  id: string
  username: string
  name: string
  avatarMediaId?: string | null
}

export interface StoryPost {
  id: string
  userId: string
  content: string | null
  visibility: PostVisibility
  createdAt: string
  user: StoryPostUser
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

export interface StoryFeedGroup {
  user: StoryPostUser
  stories: Story[]
}

export interface CreateStoryRequest {
  content?: string
  visibility?: PostVisibility
  mediaIds?: string[]
  duration?: number
}

export interface UpdateStoryRequest {
  content?: string
  visibility?: PostVisibility
  duration?: number
}
