# Story vs Post - Quick Reference Guide

## 🎯 When to Use What

### Creating a Regular Post
```typescript
import { useCreatePost } from '../../hooks/usePostsQuery'

const createPost = useCreatePost()

createPost.mutate({
  content: 'My post content',
  visibility: 'PUBLIC',
  type: 'POST', // ← Always set this!
  mediaIds: ['media-id-1', 'media-id-2'],
  feeling: '😊',
  location: 'New York'
})
```

### Creating a Story
```typescript
import { useUploadStory } from '../../hooks/useStoriesQuery'

const uploadStory = useUploadStory()

const formData = new FormData()
formData.append('content', 'My story content')
formData.append('files', mediaFile)
formData.append('visibility', 'FRIENDS')
formData.append('duration', '24') // hours
// type: 'STORY' is automatically set by the service layer

uploadStory.mutate(formData)
```

## 📊 Data Flow

### Post Creation Flow
```
User Input
    ↓
CreatePostModal / HomeFeedScreen
    ↓
useCreatePost() hook with type='POST'
    ↓
postsService.createPost() (ensures type='POST')
    ↓
POST /post endpoint
    ↓
Appears in main feed (/post/feed)
```

### Story Creation Flow
```
User Input
    ↓
CreateStoryModal
    ↓
useUploadStory() hook
    ↓
storiesService.uploadStory() (ensures type='STORY')
    ↓
POST /story/upload endpoint
    ↓
Appears in StoriesTray (/story/feed)
```

## 🔍 Filtering Logic

### Post Feed Filtering (3 layers)

**Layer 1: Service Layer** (`postsService.getFeed`)
```typescript
return posts.filter(post => !post.story && post.type !== 'STORY')
```

**Layer 2: Component Layer** (`HomeFeedScreen`)
```typescript
const posts = [
  ...localPosts.filter(p => !p.story && p.type !== 'STORY'),
  ...serverPosts.filter(p => !p.story && p.type !== 'STORY')
]
```

**Layer 3: UI Rendering**
- StoriesTray: Displays stories only (from `/story/feed`)
- Post Feed: Displays posts only (already filtered)

## 🎨 Component Structure

```
HomeFeedScreen
├── StoriesTray (stories only)
│   ├── Uses useStoriesFeed() hook
│   └── Fetches from GET /story/feed
│
├── Create Post Box (creates type='POST')
│   └── Uses useCreatePost() hook
│
└── Post Feed (posts only, stories filtered)
    ├── Uses useFeed() hook
    └── Fetches from GET /post/feed
```

## ✅ Checklist for New Features

When adding a feature that creates posts:

- [ ] Import `useCreatePost` from `usePostsQuery`
- [ ] Pass `type: 'POST'` in the mutation payload
- [ ] Ensure local fallback posts include `type: 'POST'`
- [ ] Don't invalidate story queries from post mutations

When adding a feature that creates stories:

- [ ] Import `useUploadStory` or `useCreateStory` from `useStoriesQuery`
- [ ] Use `/story/*` endpoints, not `/post/*`
- [ ] Don't invalidate post queries from story mutations
- [ ] Stories auto-expire based on `duration` field

## 🚫 Common Mistakes to Avoid

### ❌ DON'T
```typescript
// Missing type field
createPost.mutate({ content: 'Hello' })

// Using post endpoint for stories
api.post('/post', { content: 'Story', type: 'STORY' })

// Invalidating post feed from story mutations
useUploadStory({
  onSuccess: () => {
    queryClient.invalidateQueries(['feed']) // ❌ Wrong!
  }
})
```

### ✅ DO
```typescript
// Always include type
createPost.mutate({ content: 'Hello', type: 'POST' })

// Use story endpoint for stories
storiesService.uploadStory(formData)

// Only invalidate story queries from story mutations
useUploadStory({
  onSuccess: () => {
    queryClient.invalidateQueries(['stories']) // ✅ Correct!
  }
})
```

## 📱 UI Components

### For Viewing Stories
- `<StoriesTray />` - Horizontal scrollable story avatars
- `<StoryViewer />` - Full-screen story view (if implemented)

### For Viewing Posts
- `<PostCard />` - Individual post display
- `<PostFeed />` - List of posts

### For Creating
- `<CreatePostModal />` - Regular post creation
- `<CreateStoryModal />` - Story creation with 24h expiry

## 🔑 Key Differences

| Feature | Post | Story |
|---------|------|-------|
| Type | `type: 'POST'` | `type: 'STORY'` |
| Endpoint | `/post/*` | `/story/*` |
| Visibility | Main feed | StoriesTray only |
| Expiration | Never | After `duration` hours |
| Query Key | `['feed']` | `['stories']` |
| Hook | `useCreatePost()` | `useUploadStory()` |

## 🛠️ Debugging Tips

### Story appearing in post feed?
1. Check if `post.type === 'STORY'` → Filter it out
2. Check if `post.story` exists → Filter it out
3. Verify service layer filters are working
4. Check component layer filters in HomeFeedScreen

### Post not appearing?
1. Verify `type: 'POST'` is set in mutation
2. Check service layer isn't filtering it as story
3. Verify no `post.story` relation exists
4. Check localStorage fallback includes type field

### Stories not expiring?
1. Check `duration` field is set correctly
2. Verify backend Story model has `expiresAt` field
3. Check `/story/feed` endpoint filters expired stories

---

**Quick Access Links:**
- [Full Implementation Details](./STORY_FEED_SEPARATION_FIX.md)
- [Story Feature Documentation](./STORY_FEATURE_IMPLEMENTATION.md)
