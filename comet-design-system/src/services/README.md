# API Services Documentation

## Overview

This directory contains all API service modules that interact with the backend. Each service corresponds to a specific backend module/controller.

## 🔄 Backend Refactor Changes

The following endpoints have been **REMOVED** or **MOVED** after backend refactor:

### ❌ Removed from /post module:
- `POST /post/adding-post` → Use `POST /post` instead
- `DELETE /post/delete-media/:id` → Use `DELETE /media/:id` instead  
- `GET /post/make-hashtags` → Hashtags are now auto-extracted from post content
- `GET /post/open-search-history` → Moved to `GET /search-history/history`
- `GET /post/search-bar` → Moved to `GET /search-history?q=...`

### ✅ Updated Routes:
- `POST /post/hide-post/:id` → `POST /post/hide/:postId` (parameter name changed)

---

## 📁 Service Modules

### 1. **posts.ts** - Post Management
Maps to `/post/*`, `/reaction/*`, and `/comment/*` endpoints.

#### Available Methods:

**Posts:**
- `getFeed(page, pageSize)` - GET /post/feed
- `getPost(id)` - GET /post/:id
- `getPostsByUsername(username)` - GET /post/user/:username (Public)
- `createPost(payload)` - POST /post
- `schedulePost(payload)` - POST /post/schedule
- `updatePost(id, payload)` - PATCH /post/:id
- `deletePost(id)` - DELETE /post/:id
- `sharePost(postId, quoteContent?)` - POST /post/share/:postId
- `savePost(postId)` - POST /post/save/:postId
- `hidePost(postId)` - POST /post/hide/:postId ✅ Updated
- `updatePrivacy(postId, visibility)` - PATCH /post/update-privacy/:postId

**Reactions:**
- `react(reactableId, reactableType, reactionType)` - POST /reaction
- `getMyReactions()` - GET /reaction

**Comments:**
- `createComment(payload)` - POST /comment
- `getComment(id)` - GET /comment/:id
- `updateComment(id, payload)` - PATCH /comment/:id
- `deleteComment(id)` - DELETE /comment/:id

---

### 2. **search.ts** - Search & History
Maps to `/search-history/*` endpoints.

#### Available Methods:

- `search(query, category, page, limit)` - GET /search-history?q=...&category=... ✅ New
- `getHistory()` - GET /search-history/history ✅ Updated
- `deleteHistoryItem(id)` - DELETE /search-history/history/:id ✅ Updated
- `clearAllHistory()` - DELETE /search-history/history ✅ Updated
- `globalSearch(query, limit)` - GET /search/global (Legacy, if available)

**Important:** Query parameter `q` is **required** and cannot be empty.

---

### 3. **media.ts** - File Upload & Management
Maps to `/media/*` endpoints.

#### Available Methods:

- `upload(file)` - POST /media/upload
- `delete(mediaId)` - DELETE /media/:id ✅ New
- `uploadMultiple(files)` - Sequential upload helper

**Important:** 
- FormData field name MUST be `'file'` (matches backend's `FileInterceptor('file')`)
- Max file size: **50MB** (enforced by backend)

---

## 🎯 Usage Examples

### Search with new endpoint:
```typescript
import { searchService } from '@/services/search'

// New refactored endpoint
const results = await searchService.search('query', 'all', 1, 20)

// Get search history
const history = await searchService.getHistory()
```

### Hide a post:
```typescript
import { postsService } from '@/services/posts'

// Updated route with correct parameter name
await postsService.hidePost('123') // POST /post/hide/123
```

### Upload media:
```typescript
import { mediaService } from '@/services/media'

const file = document.querySelector('input[type="file"]').files[0]
const media = await mediaService.upload(file)
// Use media.id in post creation
await postsService.createPost({ content: 'Check this out!', mediaIds: [media.id] })
```

### Hashtags (automatic):
```typescript
// ❌ No longer needed - backend auto-extracts hashtags
// Just include them in your content:
await postsService.createPost({
  content: 'This is #awesome and #cool! 🚀'
  // Backend automatically extracts: ['awesome', 'cool']
})
```

---

## 🔐 Authentication

All endpoints except the following require JWT Bearer token:
- `GET /post/user/:username` (Public)

Token is automatically included via Axios interceptor in `api.ts`.

---

## 📦 Type Safety

Import types from `@/types`:
```typescript
import type { 
  Post, 
  PostVisibility, 
  CreatePostRequest,
  SearchResults,
  SearchCategory,
  Media 
} from '@/types'
```

---

## 🐛 Error Handling

Services throw errors that should be handled in hooks or components:

```typescript
try {
  await searchService.search('', 'all') // Empty query
} catch (error) {
  console.error('Search query cannot be empty')
}
```

Common HTTP errors:
- `400` - Bad request (invalid data, empty query)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not found
- `409` - Conflict (e.g., post already saved)
- `413` - Payload too large (file > 50MB)
- `500` - Server error

---

## 📝 Notes

1. **Hashtag Extraction**: No frontend logic needed - backend automatically extracts hashtags from post content using regex `/#[\w\u0600-\u06FF]+/g`

2. **Search Query Validation**: Backend throws `400 BadRequest` if search query is empty or only whitespace

3. **Media Upload**: Field name in FormData MUST be `'file'` - any other name will fail

4. **Post Hiding**: Creates record in `hiddenPost` table but doesn't delete the post

5. **Scheduled Posts**: Posts with `scheduledAt` get status `PENDING` and are published via queue system
