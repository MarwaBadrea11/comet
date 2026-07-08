# Changelog

All notable changes to the frontend codebase.

## [2.0.0] - 2025-01-XX - Backend Alignment Refactor

### 🎯 Overview
Major refactor to align frontend with cleaned and refactored backend API endpoints.

---

### ✨ Added

#### New Services
- **Media Service** (`src/services/media.ts`)
  - `upload(file)` - Upload files to backend
  - `delete(mediaId)` - Delete uploaded files
  - `uploadMultiple(files)` - Batch upload helper

#### New Hooks
- **Media Hooks** (`src/hooks/useMediaQuery.ts`)
  - `useUploadMedia()` - Single file upload mutation
  - `useUploadMultiple()` - Multiple file upload mutation
  - `useDeleteMedia()` - File deletion mutation

#### New Type Definitions
- `src/types/post.types.ts` - Complete post module types
- `src/types/search.types.ts` - Complete search module types
- `src/types/media.types.ts` - Media upload types
- `src/types/index.ts` - Central type exports

#### New Documentation
- `src/services/README.md` - Complete API documentation
- `MIGRATION_GUIDE.md` - Step-by-step migration instructions
- `REFACTOR_SUMMARY.md` - Complete refactor overview
- `QUICK_REFERENCE.md` - Quick reference card
- `src/examples/api-usage-examples.tsx` - 7 working examples
- `CHANGELOG.md` - This file

#### New Features
- **Search Categories**: Filter search by `all`, `users`, `posts`, or `groups`
- **Auto Hashtag Extraction**: Backend automatically extracts hashtags from content
- **Media Management**: Dedicated service for file uploads and deletion

---

### 🔄 Changed

#### Search Service (`src/services/search.ts`)
- **BREAKING**: Complete rewrite to use `/search-history/*` endpoints
- `search()` now requires category parameter
- `getHistory()` path changed from `/search/history` to `/search-history/history`
- `deleteHistoryItem()` path changed to `/search-history/history/:id`
- `clearAllHistory()` path changed to `/search-history/history`
- Added `SearchCategory` type: `'all' | 'users' | 'posts' | 'groups'`

#### Search Hooks (`src/hooks/useSearchQuery.ts`)
- **BREAKING**: Complete rewrite with new signatures
- `useSearch()` now accepts `(query, category, page, limit)` parameters
- Added `useGlobalSearch()` for legacy `/search/global` support

#### Posts Service (`src/services/posts.ts`)
- Updated documentation to reflect removed endpoints
- `hidePost()` now uses `POST /post/hide/:postId` (was `/post/hide-post/:id`)

#### Query Keys (`src/lib/queryKeys.ts`)
- Added `search.query()` for new search endpoint
- Added `media.all()` and `media.byId()` keys
- Updated `search.global()` for legacy support

---

### ❌ Removed

#### Obsolete Endpoints
1. `POST /post/adding-post`
   - **Reason**: Duplicate of `POST /post`
   - **Migration**: Use `postsService.createPost()` instead

2. `DELETE /post/delete-media/:id`
   - **Reason**: Moved to dedicated media module
   - **Migration**: Use `mediaService.delete(mediaId)` instead

3. `GET /post/make-hashtags`
   - **Reason**: Backend now auto-extracts hashtags from content
   - **Migration**: Remove hashtag extraction logic, just pass content

4. `GET /post/open-search-history`
   - **Reason**: Moved to search-history module
   - **Migration**: Use `searchService.getHistory()` which calls `/search-history/history`

5. `GET /post/search-bar`
   - **Reason**: Moved to search-history module with better structure
   - **Migration**: Use `searchService.search(query, category, page, limit)`

---

### 🐛 Fixed

- Search query validation now happens client-side before API call
- Media upload FormData field name now correctly set to `'file'`
- Post hiding now uses correct backend parameter name (`postId` not `id`)

---

### 📝 Breaking Changes

#### Search Module
```typescript
// ❌ Before (v1.x)
import { searchService } from '@/services/search'
const results = await searchService.global('query', 10)
const history = await searchService.getHistory() // Wrong endpoint

// ✅ After (v2.0)
import { searchService } from '@/services/search'
const results = await searchService.search('query', 'all', 1, 20)
const history = await searchService.getHistory() // Correct endpoint
```

#### Media Deletion
```typescript
// ❌ Before (v1.x)
await api.delete(`/post/delete-media/${mediaId}`)

// ✅ After (v2.0)
import { mediaService } from '@/services/media'
await mediaService.delete(mediaId)
```

#### Hashtag Handling
```typescript
// ❌ Before (v1.x)
const hashtags = extractHashtags(content)
await postsService.createPost({ content, hashtags })

// ✅ After (v2.0)
await postsService.createPost({ 
  content: 'This is #awesome' 
  // Hashtags auto-extracted by backend
})
```

---

### 🔧 Migration Guide

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed migration instructions.

**Estimated Migration Time**: 1-2 hours for small projects, 4-6 hours for large projects

**Key Steps**:
1. Update all search-related components to use new endpoints
2. Replace media deletion calls with new media service
3. Remove hashtag extraction logic from post creation
4. Update imports to use new type definitions
5. Test all API interactions thoroughly

---

### 📊 Statistics

- **Files Created**: 11
- **Files Modified**: 4
- **Lines Added**: ~2,500
- **Endpoints Removed**: 5
- **Endpoints Updated**: 3
- **New Features**: 3

---

### 🙏 Credits

- Backend refactor aligned with NestJS best practices
- TanStack Query v5 for data fetching
- TypeScript for type safety

---

## [1.0.0] - 2024-XX-XX - Initial Release

### Added
- Initial project setup
- Basic post CRUD operations
- Search functionality
- Comment system
- Reaction system
- Authentication flow

---

## Version Format

Format: `[MAJOR.MINOR.PATCH]`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)
