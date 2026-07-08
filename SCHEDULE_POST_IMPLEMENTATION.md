# Post Scheduling Feature - Frontend Implementation

## Overview
This document outlines the complete implementation of the Post Scheduling feature in the Comet frontend. The feature allows users to schedule posts for future publishing directly from the post creation modal.

## Backend API Understanding

### Endpoint: `POST /post/schedule`

**Request Body:**
```typescript
{
  content?: string
  visibility?: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE'
  feeling?: string
  location?: string
  mediaIds?: string[]
  scheduledAt: string  // ISO 8601 timestamp (e.g., "2026-07-10T14:30:00.000Z")
}
```

**Response:**
Returns a `Post` object with status `PENDING`

**Key Differences from Regular Post:**
- Uses `/post/schedule` endpoint instead of `/post`
- Requires `scheduledAt` field (ISO 8601 string)
- Post is created with `status: 'PENDING'`
- Backend accepts both `scheduledAt` and `scheduledFor` for flexibility

## Frontend Implementation

### 1. DateTimePicker Component

**Location:** `src/components/ui/DateTimePicker.tsx`

A reusable React component for selecting future dates and times.

**Features:**
- Separate date and time inputs with calendar and clock icons
- Validation to prevent past dates
- Clear button to reset selection
- Real-time preview of selected date/time
- Automatic formatting to ISO 8601

**Props:**
```typescript
interface DateTimePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  minDate?: Date
  label?: string
  placeholder?: string
}
```

**Usage:**
```tsx
<DateTimePicker
  value={scheduledDate}
  onChange={setScheduledDate}
  label="Schedule Post"
  placeholder="Pick a future date and time"
/>
```

### 2. Posts Service Update

**Location:** `src/services/posts.ts`

Added new service method:

```typescript
schedulePost: async (payload: {
  content?: string
  visibility?: PostVisibility
  feeling?: string
  location?: string
  mediaIds?: string[]
  scheduledAt: string // ISO 8601 timestamp
}): Promise<Post> => {
  const { data } = await api.post('/post/schedule', payload)
  return data
}
```

### 3. TanStack Query Hook

**Location:** `src/hooks/usePostsQuery.ts`

Added new mutation hook:

```typescript
export function useSchedulePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: postsService.schedulePost,
    onSuccess: () => {
      // Don't add to feed since it's scheduled
      qc.invalidateQueries({ queryKey: queryKeys.posts.all() })
    },
  })
}
```

**Key Difference from `useCreatePost`:**
- Scheduled posts are NOT added to the feed immediately
- Only invalidates queries for future scheduled posts list

### 4. CreatePostModal Enhancement

**Location:** `src/components/screens/CreatePostModal.tsx`

**New State:**
```typescript
const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
const [showScheduler, setShowScheduler] = useState(false)
const schedulePost = useSchedulePost()
```

**Smart Routing Logic:**
```typescript
const handlePost = () => {
  const isScheduled = scheduledDate && scheduledDate.getTime() > Date.now()

  if (isScheduled) {
    // Route to /post/schedule
    schedulePost.mutate({
      content,
      visibility,
      mediaIds,
      feeling,
      location,
      scheduledAt: scheduledDate.toISOString()
    })
  } else {
    // Route to /post
    createPost.mutate({ content, visibility, mediaIds, feeling, location })
  }
}
```

**UI Changes:**
1. Added Schedule button with Clock icon
2. Collapsible scheduler section
3. Dynamic button text: "Schedule Post" vs "Post Now"
4. Visual indicator when post is scheduled

## Type Safety

All TypeScript types are properly aligned with backend expectations:

```typescript
// Backend DTO
export class CreateScheduledPostDto {
  userId: string
  content?: string
  visibility?: PostVisibility
  feeling?: string
  location?: string
  scheduledFor: string  // ISO date string
  status?: ScheduledPostStatus
}

// Frontend payload
{
  content?: string
  visibility?: PostVisibility
  feeling?: string
  location?: string
  mediaIds?: string[]
  scheduledAt: string  // ISO date string
}
```

## User Flow

1. User opens Create Post Modal
2. Writes content and optionally adds media
3. Clicks "Schedule" button (Clock icon)
4. Scheduler section expands with DateTimePicker
5. User selects future date and time
6. Button changes to "Schedule Post"
7. On submit:
   - If date selected → POST to `/post/schedule`
   - If no date → POST to `/post` (immediate)
8. Success feedback and modal closes

## Visual Design

The scheduler integrates seamlessly with Comet's cosmic theme:
- Matches existing surface colors and borders
- Uses outline-variant for subtle borders
- Primary color for interactive elements
- Smooth transitions and hover states
- Icons from lucide-react (Clock, Calendar)

## Testing Checklist

- [ ] Can select future dates
- [ ] Cannot select past dates
- [ ] Time picker works correctly
- [ ] Clear button removes selection
- [ ] Button text changes based on scheduling state
- [ ] Correct endpoint is called (schedule vs regular)
- [ ] ISO 8601 format is sent correctly
- [ ] Scheduled posts don't appear in feed immediately
- [ ] Error handling works
- [ ] Mobile responsive design

## Example Request/Response

**Request to `/post/schedule`:**
```json
{
  "content": "This is a scheduled post!",
  "visibility": "PUBLIC",
  "feeling": "excited",
  "location": "San Francisco",
  "mediaIds": ["123", "456"],
  "scheduledAt": "2026-07-10T14:30:00.000Z"
}
```

**Response:**
```json
{
  "id": "789",
  "content": "This is a scheduled post!",
  "visibility": "PUBLIC",
  "status": "PENDING",
  "feeling": "excited",
  "location": "San Francisco",
  "createdAt": "2026-07-08T10:00:00.000Z",
  "user": { ... },
  "media": [ ... ]
}
```

## Notes

- Backend handles both `scheduledAt` and `scheduledFor` field names
- A cron job on the backend publishes scheduled posts at the specified time
- Frontend does NOT need to modify backend codebase
- All changes are isolated to frontend React components
- Reusable DateTimePicker can be used for other features

## Future Enhancements

- View list of scheduled posts
- Edit/delete scheduled posts
- Calendar view of scheduled content
- Recurring post scheduling
- Time zone selection
- Quick schedule presets (1 hour, tomorrow, next week)

---

**Implementation Status:** ✅ Complete
**Backend Changes:** ❌ None required
**Frontend Files Modified:** 5
**New Components Created:** 1 (DateTimePicker)
