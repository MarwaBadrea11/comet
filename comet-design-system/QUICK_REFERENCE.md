# Quick Reference Card

## 🚀 Refactored API Endpoints

### Posts Module (`/post/*`)
```typescript
// ✅ Working Endpoints
POST   /post                    - Create post
POST   /post/schedule           - Schedule post
PATCH  /post/:id                - Update post
DELETE /post/:id                - Delete post
GET    /post/feed               - Get feed (paginated)
GET    /post/:id                - Get single post
GET    /post/user/:username     - Get user posts (public)
POST   /post/share/:postId      - Share/quote post
POST   /post/save/:postId       - Save post
POST   /post/hide/:postId       - Hide post ✅ UPDATED
PATCH  /post/update-privacy/:postId - Update visibility
```

### Search Module (`/search-history/*`)
```typescript
// ✅ New Refactored Endpoints
GET    /search-history?q=...&category=...  - Search ✅ NEW
GET    /search-history/history              - Get history ✅ UPDATED
DELETE /search-history/history/:id          - Delete item ✅ UPDATED
DELETE /search-history/history              - Clear all ✅ UPDATED

// Legacy (if available)
GET    /search/global?q=...&limit=...       - Global search
```

### Media Module (`/media/*`)
```typescript
// ✅ New Module
POST   /media/upload            - Upload file ✅ NEW
DELETE /media/:id               - Delete media ✅ NEW
```

---

## 🔴 Removed Endpoints

```typescript
// ❌ REMOVED - DO NOT USE
POST   /post/adding-post        → Use POST /post
DELETE /post/delete-media/:id   → Use DELETE /media/:id
GET    /post/make-hashtags      → Auto-extracted from content
GET    /post/open-search-history → Use GET /search-history/history
GET    /post/search-bar         → Use GET /search-history?q=...
```

---

## 📦 Import Patterns

### Services
```typescript
import { postsService } from '@/services/posts'
import { searchService } from '@/services/search'
import { mediaService } from '@/services/media'
```

### Hooks
```typescript
// Posts
import { 
  useFeed,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useHidePost,
  useSavePost,
  useSchedulePost,
  useSharePost,
} from '@/hooks/usePostsQuery'

// Search
import {
  useSearch,
  useSearchHistory,
  useDeleteHistoryItem,
  useClearAllHistory,
} from '@/hooks/useSearchQuery'

// Media
import {
  useUploadMedia,
  useUploadMultiple,
  useDeleteMedia,
} from '@/hooks/useMediaQuery'
```

### Types
```typescript
import type {
  Post,
  PostVisibility,
  CreatePostRequest,
  UpdatePostRequest,
  SchedulePostRequest,
  SearchResults,
  SearchCategory,
  SearchType,
  Media,
} from '@/types'
```

---

## ⚡ Common Patterns

### Create Post with Hashtags
```typescript
const { mutate } = useCreatePost()

mutate({
  content: 'This is #awesome! 🚀',
  visibility: 'PUBLIC',
  // Hashtags auto-extracted by backend
})
```

### Upload & Attach Media
```typescript
const { mutate: upload } = useUploadMedia()
const { mutate: create } = useCreatePost()

// 1. Upload file
upload(file, {
  onSuccess: (media) => {
    // 2. Create post with media ID
    create({
      content: 'Check this out!',
      mediaIds: [media.id]
    })
  }
})
```

### Search with Categories
```typescript
const { data } = useSearch(
  'query',      // q (required)
  'users',      // category: 'all' | 'users' | 'posts' | 'groups'
  1,            // page
  20            // limit
)
```

### Hide Post
```typescript
const { mutate } = useHidePost()
mutate(postId)  // POST /post/hide/:postId
```

---

## 🔒 Auth Requirements

| Endpoint | Auth Required |
|----------|--------------|
| All `/post/*` except `/post/user/:username` | ✅ Yes |
| All `/search-history/*` | ✅ Yes |
| All `/media/*` | ✅ Yes |
| GET `/post/user/:username` | ❌ No (Public) |

---

## 📝 Important Notes

1. **Hashtags**: No frontend extraction needed - backend auto-parses
2. **Search Query**: Cannot be empty - backend returns 400
3. **Media Field**: FormData field MUST be named `'file'`
4. **File Size**: Max 50MB (backend enforces)
5. **Hide vs Delete**: Hide creates record in `hiddenPost` table

---

## 🐛 Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 400 | Empty search query | Validate `q.trim().length >= 2` |
| 404 | Wrong endpoint path | Check path matches backend exactly |
| 409 | Post already saved | Handle duplicate gracefully |
| 413 | File > 50MB | Show file size limit error |

---

## 📚 Documentation Links

- [Full Services README](./src/services/README.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Code Examples](./src/examples/api-usage-examples.tsx)
- [Complete Summary](./REFACTOR_SUMMARY.md)
