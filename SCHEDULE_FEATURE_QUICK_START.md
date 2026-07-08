# 🚀 Post Scheduling - Quick Start Guide

## What Was Implemented?

Your Comet frontend now supports scheduling posts for future publishing! Users can select a date and time, and the post will automatically route to the correct backend endpoint.

## Files Modified/Created

### ✨ New Component
- `src/components/ui/DateTimePicker.tsx` - Reusable date/time picker

### 🔧 Updated Files
- `src/components/screens/CreatePostModal.tsx` - Added scheduling UI
- `src/services/posts.ts` - Added `schedulePost()` method
- `src/hooks/usePostsQuery.ts` - Added `useSchedulePost()` hook
- `src/components/ui/index.ts` - Exported DateTimePicker

## How It Works

### User Experience

1. **Open Create Post Modal**
2. **Click the "Schedule" button** (Clock icon)
3. **Pick date and time** in the expanded scheduler
4. **Click "Schedule Post"** button

### Technical Flow

```
User selects date → scheduledDate state updated
                  ↓
User clicks submit → Check if scheduledDate exists
                  ↓
          ┌───────┴───────┐
          ↓               ↓
   Has date?         No date?
          ↓               ↓
  POST /post/schedule  POST /post
  with scheduledAt     (immediate)
```

## Backend Integration

### Regular Post Endpoint
```
POST http://localhost:8000/post
{
  "content": "...",
  "visibility": "PUBLIC",
  "mediaIds": [...]
}
```

### Scheduled Post Endpoint (NEW!)
```
POST http://localhost:8000/post/schedule
{
  "content": "...",
  "visibility": "PUBLIC", 
  "mediaIds": [...],
  "scheduledAt": "2026-07-10T14:30:00.000Z"
}
```

## TypeScript Types

### Payload Structure
```typescript
// Immediate post
type CreatePostPayload = {
  content?: string
  visibility?: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE'
  feeling?: string
  location?: string
  mediaIds?: string[]
}

// Scheduled post (extends CreatePostPayload)
type SchedulePostPayload = CreatePostPayload & {
  scheduledAt: string  // ISO 8601 timestamp
}
```

## Key Features

✅ **Smart Routing** - Automatically uses correct endpoint based on date selection
✅ **Type Safe** - Full TypeScript support with proper types
✅ **Validation** - Prevents selecting past dates
✅ **UI Feedback** - Button text changes ("Post Now" vs "Schedule Post")
✅ **Reusable Component** - DateTimePicker can be used elsewhere
✅ **Clear Button** - Easy to reset and post immediately instead
✅ **No Backend Changes** - Works with existing API

## Usage Example

```tsx
import { DateTimePicker } from '../ui/DateTimePicker'

function MyComponent() {
  const [date, setDate] = useState<Date | undefined>()
  
  return (
    <DateTimePicker
      value={date}
      onChange={setDate}
      label="Schedule for"
      placeholder="Pick a date"
    />
  )
}
```

## Testing the Feature

1. Start your backend: `cd lll_social/apps/api && npm run dev`
2. Start your frontend: `cd comet-design-system && npm run dev`
3. Login to your app
4. Open Create Post modal
5. Click the Schedule button (Clock icon)
6. Select a future date and time
7. Click "Schedule Post"
8. Check backend - post should have `status: 'PENDING'`

## Validation Rules

- ✅ Date must be in the future
- ✅ Both date AND time must be selected
- ✅ Clear button removes schedule (posts immediately)
- ✅ ISO 8601 format sent to backend
- ✅ Minimum date is current date/time

## Backend Response

Scheduled posts return with:
```json
{
  "id": "123",
  "content": "...",
  "status": "PENDING",
  "createdAt": "2026-07-08T...",
  "user": {...}
}
```

Regular posts return with:
```json
{
  "id": "123", 
  "content": "...",
  "status": "PUBLISHED",
  "createdAt": "2026-07-08T...",
  "user": {...}
}
```

## Common Issues & Solutions

### Issue: Scheduled posts appear in feed immediately
**Solution:** Check that you're using `useSchedulePost()` hook, not `useCreatePost()`

### Issue: Getting 400 Bad Request
**Solution:** Verify `scheduledAt` is ISO 8601 format: `date.toISOString()`

### Issue: Can't select dates
**Solution:** Check browser date input support or use a third-party library

### Issue: Past dates are selectable
**Solution:** DateTimePicker validates this - check `minDate` prop

## What's Next?

Consider these enhancements:
- 📅 View scheduled posts list
- ✏️ Edit scheduled posts
- ⏰ Time zone selection
- 🔁 Recurring posts
- 📊 Calendar view

---

**Status:** ✅ Ready to use
**Backend API:** Compatible ✓
**Type Safety:** Full TypeScript ✓
**Testing:** Manual testing recommended ✓
