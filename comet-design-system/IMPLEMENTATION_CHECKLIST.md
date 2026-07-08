# Reactions & Comments - Implementation Checklist

## ✅ Setup Verification

### Step 1: Verify Files Created
- [ ] `src/types/reaction.types.ts` exists
- [ ] `src/types/comment.types.ts` exists
- [ ] `src/services/reactions.ts` exists
- [ ] `src/services/comments.ts` exists
- [ ] `src/hooks/useReactionsQuery.ts` exists
- [ ] `src/hooks/useCommentsQuery.ts` updated
- [ ] `src/lib/queryKeys.ts` updated
- [ ] All documentation files created

### Step 2: Run TypeScript Check
```bash
npm run typecheck
# or
tsc --noEmit
```
- [ ] No TypeScript errors in new files

### Step 3: Verify Imports
Check that these imports work without errors:
```typescript
import { ReactionType, ReactableType, Comment } from '@/types'
import { reactionsService, commentsService } from '@/services'
import { useToggleReactionMutation, useUserReactionStatus } from '@/hooks/useReactionsQuery'
import { useCreateComment, useUpdateComment } from '@/hooks/useCommentsQuery'
```
- [ ] All imports resolve correctly

---

## 🎯 Feature Implementation Checklist

### Phase 1: Reactions (Basic)
- [ ] **1.1** Add "Like" button to post card
- [ ] **1.2** Toggle like on/off functionality works
- [ ] **1.3** UI shows correct state (liked vs not liked)
- [ ] **1.4** Test toggle same reaction twice (should remove)
- [ ] **1.5** Verify backend receives correct payload

### Phase 2: Reactions (Advanced)
- [ ] **2.1** Add reaction picker with all types (LIKE, LOVE, HAHA, WOW, SAD, ANGRY)
- [ ] **2.2** Change reaction type (e.g., LIKE → LOVE)
- [ ] **2.3** Display current user's reaction on post
- [ ] **2.4** Show reaction counts by type
- [ ] **2.5** React to comments (not just posts)

### Phase 3: Comments (Basic)
- [ ] **3.1** Display existing comments on post
- [ ] **3.2** Add comment form below post
- [ ] **3.3** Create new top-level comment
- [ ] **3.4** Show loading state while creating
- [ ] **3.5** Comment appears in list after creation

### Phase 4: Comments (Edit/Delete)
- [ ] **4.1** Add "Edit" button to user's own comments
- [ ] **4.2** Inline edit mode for comments
- [ ] **4.3** Save edited comment
- [ ] **4.4** Verify `(edited)` label appears
- [ ] **4.5** Add "Delete" button to user's own comments
- [ ] **4.6** Confirm before delete
- [ ] **4.7** Comment removed from list after deletion

### Phase 5: Nested Comments (Replies)
- [ ] **5.1** Add "Reply" button to comments
- [ ] **5.2** Reply form appears below parent comment
- [ ] **5.3** Create nested reply with `parentId`
- [ ] **5.4** Display nested structure with indentation
- [ ] **5.5** Support multiple levels of nesting
- [ ] **5.6** Collapse/expand nested replies

### Phase 6: Optimizations
- [ ] **6.1** Implement optimistic updates for reactions
- [ ] **6.2** Implement optimistic updates for comments
- [ ] **6.3** Add loading spinners/skeletons
- [ ] **6.4** Add error handling and toasts
- [ ] **6.5** Debounce rapid clicks on reactions
- [ ] **6.6** Virtualize long comment lists

---

## 🧪 Testing Checklist

### API Endpoints Testing

#### Reactions
- [ ] **GET /reaction**
  - [ ] Returns array of user's reactions
  - [ ] Bearer token required
  - [ ] Returns 401 without token

- [ ] **POST /reaction (CREATE)**
  - [ ] Create new reaction on post
  - [ ] Create new reaction on comment
  - [ ] Default to LIKE if reactionType omitted
  - [ ] User ID extracted from JWT (not from body)

- [ ] **POST /reaction (TOGGLE OFF)**
  - [ ] Click same reaction twice removes it
  - [ ] Reaction deleted from database
  - [ ] UI updates correctly

- [ ] **POST /reaction (UPDATE)**
  - [ ] Change LIKE to LOVE
  - [ ] Change LOVE to HAHA
  - [ ] Reaction updated in database

#### Comments
- [ ] **GET /comment**
  - [ ] Returns accessible comments
  - [ ] Filters by group membership
  - [ ] Filters out deleted posts

- [ ] **GET /comment/:id**
  - [ ] Returns single comment
  - [ ] Returns 404 if not found

- [ ] **POST /comment**
  - [ ] Create top-level comment (parentId: null)
  - [ ] Create nested reply (with parentId)
  - [ ] Hashtags extracted automatically
  - [ ] Returns created comment with all fields

- [ ] **PATCH /comment/:id**
  - [ ] Update comment content
  - [ ] `isEdited` set to true automatically
  - [ ] Don't send `isEdited` from frontend

- [ ] **DELETE /comment/:id**
  - [ ] Hard delete works
  - [ ] Comment removed from database
  - [ ] Returns 404 on subsequent GET

---

## 🎨 UI/UX Testing

### Reactions
- [ ] Reaction button shows correct emoji
- [ ] Active state shows user has reacted
- [ ] Smooth animation on click
- [ ] Reaction count updates immediately
- [ ] Hover shows reaction picker (if implemented)
- [ ] Keyboard accessible (Enter/Space to toggle)

### Comments
- [ ] Comment list loads on page load
- [ ] Loading skeleton while fetching
- [ ] New comment form always visible
- [ ] Textarea auto-expands with content
- [ ] Submit button disabled when empty
- [ ] Loading indicator on submit button
- [ ] Comment appears at correct position after creation
- [ ] Edited label shows on edited comments
- [ ] Timestamps formatted correctly (e.g., "2 hours ago")

### Nested Comments
- [ ] Nested comments indented properly
- [ ] Reply button visible on hover
- [ ] Reply form appears inline
- [ ] Reply form cancellable
- [ ] Thread structure clear
- [ ] Collapse/expand works smoothly

---

## 🐛 Error Handling Testing

### Network Errors
- [ ] Show error toast on failed API call
- [ ] Retry mechanism for failed mutations
- [ ] Rollback optimistic updates on error
- [ ] Show offline indicator
- [ ] Queue mutations when offline

### Validation Errors
- [ ] Empty comment content prevented
- [ ] Max length validation (if any)
- [ ] Invalid enum values caught
- [ ] Show field-specific error messages

### Auth Errors
- [ ] 401 redirects to login
- [ ] Token refresh on 401
- [ ] Show "Please log in" message
- [ ] Disable actions for logged-out users

---

## 🔐 Security Testing

### Authentication
- [ ] Reactions require authentication
- [ ] Comments require authentication
- [ ] Bearer token sent with every request
- [ ] Token stored securely (httpOnly cookie or secure storage)

### Authorization
- [ ] Can only edit own comments
- [ ] Can only delete own comments
- [ ] Can react to any accessible post/comment
- [ ] Group-restricted comments not shown to non-members

### Input Validation
- [ ] XSS prevented (sanitize HTML in comments)
- [ ] SQL injection prevented (using Prisma ORM)
- [ ] CSRF token validated (if applicable)
- [ ] Rate limiting on repeated actions

---

## ⚡ Performance Testing

### Query Performance
- [ ] Reactions query caches properly
- [ ] Comments query caches properly
- [ ] Background refetch works
- [ ] Stale time configured appropriately
- [ ] GC time prevents memory leaks

### Mutation Performance
- [ ] Optimistic updates feel instant
- [ ] No layout shift on comment creation
- [ ] Smooth animations (no jank)
- [ ] Large comment lists don't lag

### Network Performance
- [ ] Minimal payload sizes
- [ ] Gzip compression enabled
- [ ] No unnecessary refetches
- [ ] Parallel requests where possible

---

## 📱 Cross-Browser/Device Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Mobile UI responsive
- [ ] Touch interactions work

### Accessibility
- [ ] Screen reader announces actions
- [ ] Keyboard navigation works
- [ ] Focus visible on interactive elements
- [ ] Color contrast meets WCAG AA
- [ ] ARIA labels present

---

## 🚀 Production Readiness

### Code Quality
- [ ] No console.log() in production code
- [ ] All TypeScript types defined
- [ ] No `any` types used
- [ ] ESLint warnings addressed
- [ ] Code formatted consistently

### Documentation
- [ ] API integration documented
- [ ] Component usage examples provided
- [ ] Edge cases documented
- [ ] Known issues listed

### Monitoring
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics events tracked
- [ ] Performance metrics collected
- [ ] User feedback mechanism

---

## 🔄 Future Enhancements (Optional)

- [ ] Real-time updates via WebSocket
- [ ] Notification when someone reacts/comments
- [ ] Mention users in comments (@username)
- [ ] Rich text editor for comments
- [ ] Image/video uploads in comments
- [ ] Comment moderation tools
- [ ] Report inappropriate content
- [ ] Pin important comments
- [ ] Sort comments by date/likes
- [ ] Filter comments (show only replies)
- [ ] Reaction summary modal (who reacted)
- [ ] Edit history for comments
- [ ] Soft delete with undo

---

## 📝 Implementation Priority

### High Priority (Must Have)
1. Basic reactions (toggle like)
2. Display comments
3. Create comments
4. Edit/delete own comments

### Medium Priority (Should Have)
1. Multiple reaction types
2. Nested comments/replies
3. Optimistic updates
4. Error handling

### Low Priority (Nice to Have)
1. Real-time updates
2. Rich text comments
3. Comment sorting
4. Reaction analytics

---

## ✅ Sign-Off Checklist

Before marking as complete:
- [ ] All high-priority features implemented
- [ ] All API endpoints tested
- [ ] TypeScript errors resolved
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Documentation reviewed
- [ ] Code reviewed by peer
- [ ] QA testing passed
- [ ] Security review passed
- [ ] Performance benchmarks met

---

## 🎉 Completion

Date: _______________
Implemented by: _______________
Reviewed by: _______________

**Notes:**
_Add any implementation notes, deviations from plan, or known issues here._

---

**Next Steps After Completion:**
1. Update project README with new features
2. Create user guide for reactions/comments
3. Schedule training session for team
4. Monitor error logs for first week
5. Gather user feedback
6. Plan next iteration improvements
