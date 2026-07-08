# Frontend Refactor Migration Guide

## 🎯 Overview

This guide helps you migrate from the old API structure to the refactored backend endpoints.

---

## 📋 Breaking Changes Summary

### 1. **Removed Endpoints**

| Old Endpoint | Status | New Solution |
|--------------|--------|--------------|
| `POST /post/adding-post` | ❌ Removed | Use `POST /post` |
| `DELETE /post/delete-media/:id` | ❌ Removed | Use `DELETE /media/:id` |
| `GET /post/make-hashtags` | ❌ Removed | Auto-extracted from content |
| `GET /post/open-search-history` | ❌ Moved | Use `GET /search-history/history` |
| `GET /post/search-bar` | ❌ Moved | Use `GET /search-history?q=...` |

### 2. **Updated Endpoints**

| Old Endpoint | New Endpoint | Changes |
|--------------|--------------|---------|
| `POST /post/hide-post/:id` | `POST /post/hide/:postId` | Parameter name changed |
| `GET /search/history` | `GET /search-history/history` | Path changed |
| `DELETE /search/history/clear/all` | `DELETE /search-history/history` | Path simplified |

---

## 🔄 Migration Steps

### Step 1: Update Search Functionality

#### Before:
```typescript
// ❌ Old - doesn't exist anymore
import { searchService } from '@/services/search'
const history = await searchService.getHistory() // GET /search/history
```

#### After:
```typescript
// ✅ New - correct endpoint
import { searchService } from '@/services/search'
const history = await searchService.getHistory() // GET /search-history/history
```

#### Search Query:
```typescript
// ❌ Old
const results = await searchService.global('query', 10)

// ✅ New - with category support
const results = await searchService.search('query', 'all', 1, 20)
```

---

### Step 2: Update Hide Post Calls

#### Before:
```typescript
// ❌ Old route
await postsService.hidePost(postId) // POST /post/hide-post/:id
```

#### After:
```typescript
// ✅ New route - same function, backend updated
await postsService.hidePost(postId) // POST /post/hide/:postId
```

**Note:** The service function remains the same, only the backend route changed.

---

### Step 3: Replace Hashtag Extraction

#### Before:
```typescript
// ❌ Old - manual extraction or API call
const hashtags = extractHashtagsFromContent(content)
// OR
const hashtags = await postsService.makeHashtags(content)
```

#### After:
```typescript
// ✅ New - just pass content, backend handles it
await postsService.createPost({
  content: 'This is #awesome and #cool! 🚀'
  // Backend automatically extracts hashtags
})
```

**No frontend hashtag logic needed!** Backend uses regex: `/#[\w\u0600-\u06FF]+/g`

---

### Step 4: Update Media Deletion

#### Before:
```typescript
// ❌ Old - wrong endpoint
await api.delete(`/post/delete-media/${mediaId}`)
```

#### After:
```typescript
// ✅ New - correct endpoint
import { mediaService } from '@/services/media'
await mediaService.delete(mediaId) // DELETE /media/:id
```

---

### Step 5: Update Search History Clearing

#### Before:
```typescript
// ❌ Old path
await api.delete('/search/history/clear/all')
```

#### After:
```typescript
// ✅ New simplified path
import { searchService } from '@/services/search'
await searchService.clearAllHistory() // DELETE /search-history/history
```

---

## 🎨 Component Updates

### Search Component Example

#### Before:
```typescript
// ❌ Old
import { useSearch, useSearchHistory } from '@/hooks/useSearchQuery'

function SearchBar() {
  const { data: results } = useSearch(query, 10)
  const { data: history } = useSearchHistory() // Wrong endpoint
  
  return (/* ... */)
}
```

#### After:
```typescript
// ✅ New
import { useSearch, useSearchHistory } from '@/hooks/useSearchQuery'

function SearchBar() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<SearchCategory>('all')
  
  // New hook signature with category support
  const { data: results } = useSearch(query, category, 1, 20)
  const { data: history } = useSearchHistory() // Correct endpoint
  
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value as SearchCategory)}>
        <option value="all">All</option>
        <option value="users">Users</option>
        <option value="posts">Posts</option>
        <option value="groups">Groups</option>
      </select>
    </div>
  )
}
```

---

### Post Creation with Media

#### Before:
```typescript
// ❌ Old - maybe custom hashtag logic
const hashtags = extractHashtags(content)
await postsService.createPost({ content, hashtags })
```

#### After:
```typescript
// ✅ New - clean and simple
const { mutate: uploadMedia } = useUploadMedia()
const { mutate: createPost } = useCreatePost()

const handleSubmit = async () => {
  // Upload media first
  const media = await uploadMedia(file)
  
  // Create post with media IDs
  createPost({
    content: 'Check out this #photo! 📸',
    mediaIds: [media.id]
    // Hashtags auto-extracted from content
  })
}
```

---

## 📦 New Features

### 1. **Media Service**
New dedicated service for file uploads:

```typescript
import { mediaService } from '@/services/media'

// Upload single file
const media = await mediaService.upload(file)

// Upload multiple files
const mediaList = await mediaService.uploadMultiple([file1, file2])

// Delete media
await mediaService.delete(mediaId)
```

### 2. **Search Categories**
Search now supports filtering by category:

```typescript
import { useSearch } from '@/hooks/useSearchQuery'

// Search only users
const { data } = useSearch('john', 'users', 1, 20)

// Search only posts
const { data } = useSearch('react', 'posts', 1, 20)
```

### 3. **Type Safety**
New comprehensive type definitions:

```typescript
import type {
  Post,
  PostVisibility,
  CreatePostRequest,
  SearchResults,
  SearchCategory,
  Media,
} from '@/types'
```

---

## ✅ Checklist

Use this checklist to ensure complete migration:

- [ ] Replace all `POST /post/adding-post` with `POST /post`
- [ ] Update media deletion to use `DELETE /media/:id`
- [ ] Remove any hashtag extraction logic from components
- [ ] Update search history calls to `/search-history/*`
- [ ] Update search queries to use new category parameter
- [ ] Import types from `@/types` instead of inline definitions
- [ ] Update `useSearch` hook calls with new signature
- [ ] Test file uploads with `mediaService.upload()`
- [ ] Verify hide post functionality with updated route
- [ ] Update any hardcoded API paths in components

---

## 🐛 Troubleshooting

### "Search query cannot be empty" error
**Cause:** New backend validation requires non-empty query.

**Solution:**
```typescript
// Add validation before calling
if (query.trim().length >= 2) {
  const results = await searchService.search(query, 'all')
}
```

### "File field not found" error
**Cause:** FormData field name doesn't match backend expectation.

**Solution:**
```typescript
// ❌ Wrong
formData.append('media', file)

// ✅ Correct - MUST be 'file'
formData.append('file', file)
```

### 404 on search history
**Cause:** Using old `/search/history` path.

**Solution:**
```typescript
// ❌ Old
GET /search/history

// ✅ New
GET /search-history/history
```

---

## 📚 Resources

- [Services README](./src/services/README.md) - Detailed API documentation
- [Type Definitions](./src/types/) - All TypeScript types
- [Query Hooks](./src/hooks/) - TanStack Query hooks

---

## 🆘 Need Help?

If you encounter issues during migration:

1. Check the [Services README](./src/services/README.md)
2. Review backend controller changes
3. Verify endpoint paths match backend exactly
4. Check browser DevTools Network tab for actual requests
