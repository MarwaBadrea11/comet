# Quick Start: Stories Feature

## 🚀 How to Use

### For Users

#### Creating a Story
1. Go to Home Feed
2. Click the **"Add Story"** button (+ icon in stories tray)
3. Choose one of:
   - Upload an image/video
   - Type text-only content
   - Upload media + add text overlay
4. Configure:
   - **Visibility**: PUBLIC, FRIENDS, PRIVATE, ONLY_ME, or CUSTOM
   - **Duration**: 1-168 hours (default: 24h)
5. Click **"Share Now"**
6. ✅ Story appears in stories tray (NOT in posts feed)

#### Viewing Stories
1. Click any story ring in the horizontal tray
2. View full-screen story viewer
3. Navigation:
   - Tap left/right to skip
   - Progress bars show story duration
   - Pause/Play button
   - Close button (X)
4. Delete your own stories with trash icon

### For Developers

#### API Endpoints Used

```javascript
// Create Story
POST /api/story/upload
Content-Type: multipart/form-data
Body: {
  files: File,
  content?: string,
  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE' | 'ONLY_ME' | 'CUSTOM',
  duration: number // hours
}

// Get Stories Feed
GET /api/story/feed
Response: StoryGroup[] // Grouped by author

// Get My Stories
GET /api/story/mine?includeExpired=false
Response: Story[]

// Get Single Story
GET /api/story/:id
Response: Story

// Update Story
PATCH /api/story/:id
Body: { content?, duration? }

// Delete Story
DELETE /api/story/:id
```

#### Using the Hooks

```typescript
import { 
  useStoriesFeed, 
  useMyStories, 
  useStory,
  useUploadStory, 
  useCreateStory,
  useUpdateStory,
  useDeleteStory 
} from '@/hooks/useStoriesQuery'

// Fetch stories feed
const { data: storyGroups, isLoading } = useStoriesFeed()

// Create story with file upload
const uploadStory = useUploadStory()
const formData = new FormData()
formData.append('files', file)
formData.append('content', 'Hello!')
formData.append('visibility', 'FRIENDS')
formData.append('duration', '24')
uploadStory.mutate(formData)

// Create story with pre-uploaded media
const createStory = useCreateStory()
createStory.mutate({
  content: 'Hello!',
  visibility: 'FRIENDS',
  mediaIds: ['media-id'],
  duration: 24
})

// Delete story
const deleteStory = useDeleteStory()
deleteStory.mutate(storyId)
```

#### Using the Component

```typescript
import { StoriesTray } from '@/components/ui/StoriesTray'

function MyComponent() {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <>
      <StoriesTray onCreateStory={() => setShowModal(true)} />
      <CreateStoryModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  )
}
```

## 🎨 Customization

### StoriesTray Props
```typescript
interface StoriesTrayProps {
  onCreateStory: () => void // Callback when "Add Story" is clicked
}
```

### CreateStoryModal Props
```typescript
interface CreateStoryModalProps {
  open: boolean
  onClose: () => void
  onCreated?: () => void // Optional callback after successful creation
}
```

## 🔍 Debugging

### Stories not appearing?
1. Check backend is running on port 8000
2. Check `/api/story/feed` endpoint returns data
3. Check browser console for errors
4. Verify authentication token is present

### Stories appearing in posts feed?
This should NEVER happen. If it does:
1. Check `postsService.getFeed()` has filtering
2. Check `HomeFeedScreen` has client-side filtering
3. Check backend `/post/feed` isn't returning story-wrapped posts

### Posts appearing in stories tray?
This should NEVER happen. Stories are fetched from separate endpoint.

## 📊 Query Keys Reference

```typescript
// Stories
['stories', 'feed']                 // useStoriesFeed()
['stories', 'mine', includeExpired] // useMyStories()
['stories', 'detail', id]           // useStory()

// Posts (separate cache)
['posts', 'feed', page, size]       // useFeed()
['posts', 'detail', id]             // usePost()
['posts', 'user', username]         // usePostsByUsername()
```

## ⚠️ Important Notes

1. **Stories expire automatically** based on duration (backend handles this)
2. **Stories use different visibility enum** than posts:
   - Posts: `PUBLIC`, `FRIENDS`, `ONLY_ME`, `CUSTOM`
   - Stories: `PUBLIC`, `FRIENDS`, `PRIVATE`, `ONLY_ME`, `CUSTOM`
3. **Media URLs** are constructed client-side via `getStoryMediaUrl()`
4. **No reactions/comments** on stories (UI-only heart button)
5. **Stories auto-advance** after 5 seconds in viewer

## 🎯 Testing Checklist

- [ ] Create text-only story
- [ ] Create image story
- [ ] Create video story
- [ ] Create story with media + text
- [ ] View stories in full-screen viewer
- [ ] Navigate between stories
- [ ] Delete own story
- [ ] Verify story appears in tray only
- [ ] Verify post appears in feed only
- [ ] Test all visibility options
- [ ] Test different durations
- [ ] Test error states (401, 403, 404)

## 🐛 Common Issues

### "Failed to load stories"
- Backend not running
- Authentication issue
- Network error

### "Failed to publish story"
- File too large
- Invalid file type
- Missing required fields
- Backend validation error

### "Session expired"
- Token expired (401)
- Need to login again

## 📚 Related Files

```
src/
├── components/
│   ├── screens/
│   │   ├── CreateStoryModal.tsx    # Story creation UI
│   │   ├── StoriesScreen.tsx       # Full-screen viewer
│   │   └── HomeFeedScreen.tsx      # Uses StoriesTray
│   └── ui/
│       └── StoriesTray.tsx         # Horizontal story list
├── hooks/
│   └── useStoriesQuery.ts          # React Query hooks
├── services/
│   └── stories.ts                  # API calls
└── types/
    └── story.types.ts              # TypeScript types
```

## 🎉 Success Indicators

✅ Stories appear in horizontal tray at top  
✅ Posts appear in vertical feed below  
✅ Creating story updates stories tray only  
✅ Creating post updates posts feed only  
✅ No cache cross-contamination  
✅ No console errors  
✅ Smooth animations and transitions  
✅ Error handling works for all cases  

---

**Ready to launch! 🚀**
