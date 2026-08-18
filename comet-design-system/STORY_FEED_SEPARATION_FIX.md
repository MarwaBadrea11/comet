# Story and Post Feed Separation - Implementation Summary

## 🎯 Objective
Fix the story publishing and feed rendering flow so that uploaded stories do not appear in the main posts feed. Stories should only appear in the dedicated `StoriesTray` component at the top of the home feed.

## 📋 Changes Implemented

### 1. **Type System Updates**

#### `src/types/post.types.ts`
- **Added `type` field to Post interface**: `type?: 'POST' | 'STORY'`
  - This explicitly tracks whether a post is a regular post or a story
- **Updated CreatePostRequest interface**: Added `type?: 'POST' | 'STORY'`
- **Updated SchedulePostRequest interface**: Added `type?: 'POST' | 'STORY'`

#### `src/types/story.types.ts`
- **Updated CreateStoryPayload interface**: Added `type?: 'STORY'`
  - This ensures stories are explicitly marked during creation

### 2. **API Service Layer Updates**

#### `src/services/posts.ts`

##### `getFeed()` function
```typescript
// CRITICAL: Filter out stories from post feed
// Filter by:
// 1. post.story relation (backend links stories to posts)
// 2. post.type === 'STORY' (explicit type check)
return posts.filter(post => !post.story && post.type !== 'STORY')
```

##### `getPostsByUsername()` function
```typescript
// CRITICAL: Filter out stories from user post timelines
return posts.filter((post: Post) => !post.story && post.type !== 'STORY')
```

##### `createPost()` function
```typescript
// Ensure regular posts are explicitly marked as 'POST' type
const postPayload = { ...payload, type: payload.type || 'POST' }
```

##### `schedulePost()` function
```typescript
// Ensure scheduled posts are explicitly marked as 'POST' type
const postPayload = { ...payload, type: payload.type || 'POST' }
```

#### `src/services/stories.ts`

##### `uploadStory()` function
```typescript
// Ensure the story type is explicitly set
if (!formData.has('type')) {
  formData.append('type', 'STORY')
}
```

##### `createStory()` function
```typescript
// Explicitly set type to STORY to prevent it from appearing in post feeds
const storyPayload = { ...payload, type: 'STORY' }
```

### 3. **Component Updates**

#### `src/components/screens/CreatePostModal.tsx`
- **Immediate post creation**: Added `type: 'POST'` to payload
- **Scheduled post creation**: Added `type: 'POST'` to payload
- Ensures all posts created through this modal are explicitly marked as POST type

#### `src/components/screens/HomeFeedScreen.tsx`

##### Data filtering (lines ~50-62)
```typescript
// CRITICAL FILTER: Exclude stories from the main post feed
// Stories should ONLY appear in the StoriesTray component at the top
// Filter by:
// 1. post.story relation (backend links stories to posts)
// 2. post.type === 'STORY' (explicit type check)
const posts = [
  ...currentAccountLocalPosts.filter((p: any) => !p.story && p.type !== 'STORY'),
  ...serverPosts.filter((p: any) => !p.story && p.type !== 'STORY')
]
```

##### Quick post creation
```typescript
createPost.mutate(
  { content: pendingText, visibility: 'PUBLIC', type: 'POST' }, // Explicitly set type='POST'
```

#### `src/components/screens/CreateStoryModal.tsx`
- Already correctly uses `useUploadStory()` hook which calls `/story/upload` endpoint
- The service layer now ensures `type: 'STORY'` is set

#### `src/examples/api-usage-examples.tsx`
- Updated example to include `type: 'POST'` in createPost call

### 4. **Query Hooks Updates**

#### `src/hooks/useStoriesQuery.ts`
- **useUploadStory**: Only invalidates story queries, NOT post feed queries
- **useCreateStory**: Only invalidates story queries, NOT post feed queries
- This prevents stories from polluting the post feed cache

## 🔒 Multi-Layer Defense Strategy

The implementation uses a **defense-in-depth** approach with multiple filtering layers:

### Layer 1: Type Assignment at Creation
- **Posts**: Explicitly set `type: 'POST'` in all post creation calls
- **Stories**: Explicitly set `type: 'STORY'` in all story creation calls

### Layer 2: Service Layer Filtering
- `postsService.getFeed()`: Filters out stories using both `post.story` relation and `post.type`
- `postsService.getPostsByUsername()`: Same dual-filter approach

### Layer 3: Component Layer Filtering
- `HomeFeedScreen`: Additional filtering at the component level as final safety net
- Filters both local posts and server posts before rendering

### Layer 4: Query Invalidation Isolation
- Story mutations only invalidate story-related queries
- Post mutations only invalidate post-related queries
- Prevents cross-contamination between story and post caches

## 🎨 UI Architecture

```
┌─────────────────────────────────────────┐
│         HomeFeedScreen                  │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     StoriesTray Component         │ │ ← Stories ONLY appear here
│  │  (Fetches from /story/feed)       │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     Create Post Box               │ │ ← Creates type='POST'
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     Post Feed                     │ │ ← Posts ONLY (stories filtered)
│  │  (Fetches from /post/feed)        │ │
│  │  - Filtered by post.story         │ │
│  │  - Filtered by post.type          │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 🔍 API Endpoints

### Post Endpoints
- `GET /post/feed` → Returns posts (stories filtered out)
- `POST /post` → Creates a post with `type: 'POST'`
- `POST /post/schedule` → Schedules a post with `type: 'POST'`

### Story Endpoints
- `GET /story/feed` → Returns stories grouped by author
- `POST /story/upload` → Creates a story with `type: 'STORY'`
- `POST /story` → Creates a story with pre-uploaded media

## ✅ Testing Checklist

- [ ] Create a regular post → Should appear in main feed only
- [ ] Create a story → Should appear in StoriesTray only
- [ ] View user profile → Should show posts only, not stories
- [ ] Schedule a post → Should appear in feed when published (not in stories)
- [ ] Check localStorage fallback → Local posts should have `type: 'POST'`
- [ ] Verify story expiration → Expired stories should not affect post feed

## 🚀 Key Benefits

1. **Clear Separation**: Stories and posts are completely isolated
2. **Type Safety**: TypeScript types enforce the post/story distinction
3. **Defense in Depth**: Multiple filtering layers prevent leakage
4. **Backward Compatible**: Existing posts without type field default to 'POST'
5. **Cache Isolation**: Story and post queries don't interfere with each other

## 📝 Notes

- The backend should ideally handle this filtering, but client-side filtering provides additional safety
- If the backend starts sending a `type` field consistently, the client-side filters will work seamlessly
- The `post.story` relation check provides compatibility with existing backend behavior
- Local storage posts created offline also respect the `type: 'POST'` convention

## 🔧 Backend Recommendations

For optimal performance, the backend `/post/feed` endpoint should:
1. Exclude posts that have a `story` relation
2. Filter by `type !== 'STORY'` if the type field exists in the database
3. This would make client-side filtering redundant but harmless

## 📚 Related Files

- `src/types/post.types.ts`
- `src/types/story.types.ts`
- `src/services/posts.ts`
- `src/services/stories.ts`
- `src/hooks/usePostsQuery.ts`
- `src/hooks/useStoriesQuery.ts`
- `src/components/screens/HomeFeedScreen.tsx`
- `src/components/screens/CreatePostModal.tsx`
- `src/components/screens/CreateStoryModal.tsx`
- `src/components/ui/StoriesTray.tsx`

---

**Implementation Date**: 2026-08-18  
**Status**: ✅ Complete
