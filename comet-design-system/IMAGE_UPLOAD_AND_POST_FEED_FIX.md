# Image Upload & Post Feed Fix Summary

## Issues Fixed

### 1. **Story vs Post Separation**
**Problem**: Stories were appearing in the main posts feed alongside regular posts.

**Solution**:
- Added explicit `type` field to Post interface (`'POST' | 'STORY'`)
- Updated all post creation endpoints to explicitly set `type: 'POST'`
- Updated all story creation endpoints to explicitly set `type: 'STORY'`
- Added dual filtering in feed queries:
  - Filter by `!post.story` (relation check)
  - Filter by `post.type !== 'STORY'` (explicit type check)

**Files Modified**:
- `src/types/post.types.ts` - Added `type` field to Post interface
- `src/types/story.types.ts` - Added `type` field to CreateStoryPayload
- `src/services/posts.ts` - Added type filtering and explicit type setting
- `src/services/stories.ts` - Ensure stories are marked with type='STORY'
- `src/components/screens/HomeFeedScreen.tsx` - Added story filtering
- `src/components/screens/CreatePostModal.tsx` - Explicitly set type='POST'

---

### 2. **Image Upload Flow**
**Problem**: Local blob preview URLs were being used instead of proper server-uploaded media URLs.

**Solution**:

#### A. FileDropzone Component
- Create preview URLs using `URL.createObjectURL()` **only for local display**
- Pass actual `File` objects to parent component, NOT preview URLs
- Implement proper cleanup with `URL.revokeObjectURL()` to prevent memory leaks
- Added cleanup on file removal and component unmount

#### B. CreatePostModal Component
- Upload files to `/media/upload` endpoint as `FormData` with actual File objects
- Extract media IDs from server response: `response.data.id`
- Store **only media IDs** in state, not preview URLs
- Clean up preview URLs immediately after successful upload
- Added `uploadedFiles` state to track files with their preview URLs
- Implemented cleanup effect to revoke all preview URLs on unmount

**Key Changes**:
```typescript
// ❌ WRONG - Don't send preview URLs
formData.append('file', file.preview) // blob:http://...

// ✅ CORRECT - Send actual File object
formData.append('file', file) // File object

// After upload, store only the media ID
setMediaIds(prev => [...prev, response.data.id])

// Clean up preview URL
URL.revokeObjectURL(previewUrl)
```

**Files Modified**:
- `src/components/ui/FileDropzone.tsx` - Fixed preview URL handling and cleanup
- `src/components/screens/CreatePostModal.tsx` - Fixed upload flow and state management

---

### 3. **HomeFeedScreen Post Creation**
**Problem**: Quick post box in HomeFeedScreen didn't support image uploads. The Image button was non-functional.

**Solution**:
- Added `CreatePostModal` to HomeFeedScreen
- Image button now opens the full CreatePostModal with file upload support
- Clicking on the textarea also opens CreatePostModal when empty (better UX)
- Keep simple text-only quick post for users who just want to type

**Files Modified**:
- `src/components/screens/HomeFeedScreen.tsx` - Added CreatePostModal integration

---

## Technical Details

### Memory Management
1. **Preview URLs**: Created with `URL.createObjectURL()` for local display only
2. **Cleanup**: All preview URLs are revoked with `URL.revokeObjectURL()` to free memory
3. **Timing**: Cleanup happens:
   - After successful upload
   - When file is removed manually
   - When component unmounts

### Upload Flow
```
1. User selects files → FileDropzone
2. Create preview URLs for local display (blob: URLs)
3. Pass File objects to CreatePostModal
4. Upload File objects to /media/upload endpoint
5. Receive media IDs from server response
6. Store media IDs (not preview URLs)
7. Clean up preview URLs
8. Submit post with media IDs to /post endpoint
9. Server returns post with full media objects (with URLs)
10. Display post with server-provided media URLs
```

### Type Safety
- All endpoints now explicitly declare post type
- TypeScript interfaces updated with type field
- Runtime filtering ensures separation

---

## Testing Checklist

✅ Stories appear only in StoriesTray, not in main feed
✅ Posts appear only in main feed, not in story strip
✅ Image upload works in CreatePostModal
✅ Uploaded images display correctly in posts
✅ No blob: URLs in submitted data
✅ Memory leaks prevented (preview URLs cleaned up)
✅ HomeFeedScreen Image button opens CreatePostModal
✅ Clicking textarea opens CreatePostModal
✅ Simple text posts still work from quick post box

---

## API Endpoints

### Post Creation
- `POST /post` - Creates regular post (type='POST')
- `POST /post/schedule` - Schedules post (type='POST')
- `POST /media/upload` - Uploads media files, returns media ID

### Story Creation
- `POST /story/upload` - Creates story with media (type='STORY')
- `POST /story` - Creates story with pre-uploaded media IDs (type='STORY')

### Feed Retrieval
- `GET /post/feed` - Returns posts (filtered: no stories)
- `GET /story/feed` - Returns stories (grouped by author)
- `GET /post/user/:username` - User posts (filtered: no stories)

---

## Best Practices Implemented

1. **Explicit Type Setting**: Always set `type` field when creating posts or stories
2. **Dual Filtering**: Filter by both relation and type for robustness
3. **Memory Management**: Always revoke object URLs to prevent leaks
4. **Separation of Concerns**: Stories and posts use different endpoints and rendering
5. **Proper FormData**: Send actual File objects, not preview URLs
6. **State Management**: Store server-provided data (IDs, URLs), not client-side previews

---

## Future Improvements

1. Add progress indicators for file uploads
2. Support drag-and-drop in HomeFeedScreen quick post box
3. Add image preview thumbnails in HomeFeedScreen
4. Implement image editing/cropping before upload
5. Add video preview and playback controls
6. Optimize image compression before upload
