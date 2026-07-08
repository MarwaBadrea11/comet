# Visual Testing Guide 🧪

This guide provides step-by-step instructions for manually testing all newly integrated UI components and features.

---

## 🎯 Pre-Testing Setup

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Login to the Application
- Navigate to `http://localhost:5173`
- Login with test credentials or create a new account
- Ensure you're on the Home Feed screen (`/home`)

### 3. Open Browser DevTools
- Press F12 or right-click → Inspect
- Go to Console tab to monitor toast events
- Go to Network tab to monitor API calls

---

## 📋 Test Scenarios

### Test Suite 1: Toast Notification System ✅

**Objective**: Verify toast notifications appear correctly for all actions

#### Test 1.1: Success Toast
1. Create a new post with text content
2. Click "Launch" button
3. **Expected**: Green success toast appears at bottom-right: "Post created successfully!"
4. **Expected**: Toast auto-dismisses after 5 seconds
5. **Expected**: Close button (X) works to dismiss early

#### Test 1.2: Error Toast
1. Open Create Post modal
2. Open browser DevTools → Network tab
3. Set network to "Offline" mode
4. Try to create a post
5. **Expected**: Red error toast appears (fallback triggers)
6. **Expected**: Toast shows "Post saved locally (offline mode)" as warning

#### Test 1.3: Warning Toast
1. Create a post successfully
2. Find the post in your feed
3. Click MoreHorizontal (⋯) → Save Post
4. Click MoreHorizontal (⋯) → Save Post again (duplicate)
5. **Expected**: Yellow/amber warning toast: "Post already saved"

#### Test 1.4: Multiple Toasts
1. Quickly perform 3 actions: Create post, Save post, Share post
2. **Expected**: Multiple toasts stack vertically
3. **Expected**: Each toast animates in smoothly
4. **Expected**: Toasts dismiss in order (FIFO)

---

### Test Suite 2: File Upload with Dropzone 📤

**Objective**: Verify file upload, validation, and preview functionality

#### Test 2.1: Drag & Drop Upload
1. Click the FAB (+) button or "Launch" in create post box
2. Open Create Post modal
3. Find the FileDropzone (drag & drop area)
4. Open File Explorer and select 1-3 image files
5. Drag files over the dropzone
6. **Expected**: Dropzone highlights with blue border and scale animation
7. Drop files
8. **Expected**: Upload progress shown
9. **Expected**: Success toast: "X file(s) uploaded successfully"
10. **Expected**: Preview thumbnails appear in grid below dropzone

#### Test 2.2: Click to Browse Upload
1. Open Create Post modal
2. Click anywhere in the dropzone area
3. **Expected**: File picker dialog opens
4. Select 2-3 image files
5. Click "Open"
6. **Expected**: Files upload and previews appear

#### Test 2.3: File Size Validation (50MB Limit)
1. Prepare a file larger than 50MB (or use browser DevTools to simulate)
2. Try to upload the large file
3. **Expected**: Client-side validation prevents upload
4. **Expected**: Red error toast: "File 'filename' exceeds 50MB limit"
5. **Expected**: File is NOT added to preview grid

#### Test 2.4: File Type Validation
1. Try to upload a PDF, TXT, or ZIP file
2. **Expected**: Error toast: "File type '...' is not accepted"
3. **Expected**: Only image/* and video/* files are accepted

#### Test 2.5: Multiple Files (Max 10)
1. Try to upload 12 files at once
2. **Expected**: Only first 10 files are processed
3. **Expected**: Toast indicates maximum limit

#### Test 2.6: Preview Thumbnails
1. Upload 3 images
2. **Expected**: Grid layout (2-4 columns depending on screen size)
3. Hover over a thumbnail
4. **Expected**: Remove button (X) appears in top-right corner
5. Click remove button
6. **Expected**: Thumbnail animates out and is removed
7. **Expected**: File is removed from upload list

#### Test 2.7: Backend Upload Error (413)
1. Configure API to return 413 error (or use large file that passes client validation)
2. Try uploading
3. **Expected**: Red error toast: "File '...' is too large (max 50MB)"

---

### Test Suite 3: Visibility Selector 🔒

**Objective**: Verify visibility picker UI and functionality

#### Test 3.1: Toggle Visibility Picker
1. Open Create Post modal
2. Look for the visibility button (should show "Universal" by default)
3. Click the button
4. **Expected**: Visibility picker panel expands below
5. **Expected**: Three cards displayed vertically:
   - Universal (Globe icon) - "Visible to every curator..."
   - Inner Circle (Users icon) - "Only shared with trusted..."
   - Private Drift (Lock icon) - "Stored in your personal archive..."
6. Click button again
7. **Expected**: Panel collapses

#### Test 3.2: Select Different Visibility
1. Open visibility picker
2. Click "Inner Circle" card
3. **Expected**: Card highlights with blue border
4. **Expected**: Blue dot appears on the right
5. **Expected**: Button label updates to "Inner Circle"
6. **Expected**: Button icon changes to Users icon
7. Collapse picker and reopen
8. **Expected**: "Inner Circle" is still selected (state persists)

#### Test 3.3: Post with Different Visibility
1. Set visibility to "Private Drift"
2. Write post content: "This is a private test"
3. Click "Post Now"
4. **Expected**: Post created with PRIVATE visibility
5. Check backend/database to confirm visibility field = "PRIVATE"

---

### Test Suite 4: Post Action Dropdown Menu 📋

**Objective**: Verify dropdown menu interactions and post actions

#### Test 4.1: Open/Close Dropdown
1. Find any post in your feed
2. Click the MoreHorizontal (⋯) button in top-right
3. **Expected**: Dropdown menu appears with:
   - Save Post (Bookmark icon)
   - Hide Post (EyeOff icon)
   - Share (Share2 icon)
4. **Expected**: Menu has glassmorphism blur effect
5. Click outside the dropdown
6. **Expected**: Menu closes
7. Press Escape key when menu is open
8. **Expected**: Menu closes

#### Test 4.2: Save Post Action
1. Open dropdown for a post you haven't saved
2. Click "Save Post"
3. **Expected**: Menu closes immediately
4. **Expected**: Green success toast: "Post saved successfully!"
5. **Expected**: Network tab shows POST request to `/post/save/:postId`

#### Test 4.3: Save Post - Already Saved (409 Conflict)
1. Save a post (as above)
2. Open dropdown for the same post
3. Click "Save Post" again
4. **Expected**: Yellow warning toast: "Post already saved"

#### Test 4.4: Hide Post Action
1. Open dropdown for any post
2. Click "Hide Post"
3. **Expected**: Menu closes
4. **Expected**: Post animates out and disappears from feed
5. **Expected**: Green success toast: "Post hidden from your feed"
6. **Expected**: Post does not reappear on page refresh

#### Test 4.5: Share Post Action
1. Open dropdown for any post
2. Click "Share"
3. **Expected**: Menu closes
4. **Expected**: Link copied to clipboard
5. **Expected**: Green success toast: "Link copied to clipboard!"
6. Paste clipboard content (Ctrl+V)
7. **Expected**: URL format: `http://localhost:5173/post/[postId]`

#### Test 4.6: Menu Alignment
1. Test dropdown on posts at top of screen
2. Test dropdown on posts at bottom of screen
3. **Expected**: Menu always visible (doesn't overflow viewport)
4. **Expected**: Menu aligned to right of trigger button

---

### Test Suite 5: Search Category Filters 🔍

**Objective**: Verify search category selector and filtering

#### Test 5.1: Navigate to Search Screen
1. Click on "Explore" or "Search" in navigation
2. Navigate to `/explore` route
3. **Expected**: Search screen loads
4. **Expected**: Large search input at top
5. **Expected**: Category selector is NOT visible (query is empty)

#### Test 5.2: Activate Category Selector
1. Type a search query: "test"
2. Wait 400ms (debounce)
3. **Expected**: Category selector appears below search bar
4. **Expected**: Four segments visible:
   - All (Globe icon)
   - Users (UserCircle icon)
   - Posts (MessageSquare icon)
   - Groups (UsersRound icon)
5. **Expected**: "All" is selected by default

#### Test 5.3: Switch Categories
1. Click "Users" category
2. **Expected**: Button highlights with primary color
3. **Expected**: Background indicator slides smoothly to "Users"
4. **Expected**: Search results filter to show only users
5. **Expected**: Network tab shows GET request with `?category=users`
6. Click "Posts" category
7. **Expected**: Results update to show only posts
8. **Expected**: Smooth animation between selections

#### Test 5.4: Category Persistence During Query Change
1. Select "Groups" category
2. Change search query from "test" to "demo"
3. **Expected**: "Groups" category remains selected
4. **Expected**: Results update for new query with groups filter
5. **Expected**: No flash/flicker during update

#### Test 5.5: Clear Query (Hide Categories)
1. With categories visible, clear the search input
2. **Expected**: Category selector smoothly fades out
3. **Expected**: Search history appears (if available)
4. Type query again
5. **Expected**: Categories reappear with previous selection

#### Test 5.6: Mobile Responsiveness
1. Resize browser to mobile width (< 768px)
2. Type search query
3. **Expected**: Category segments stack appropriately
4. **Expected**: Text remains readable
5. **Expected**: Icons scale correctly

---

### Test Suite 6: Search History 🕐

**Objective**: Verify search history display and management

#### Test 6.1: View Search History
1. Navigate to Search screen
2. Ensure search input is empty
3. **Expected**: "Recent Searches" section visible
4. **Expected**: If no history: "No recent searches. Discover something new!"
5. Perform a search (type "test" and press Enter or click result)
6. Clear search input
7. **Expected**: "test" appears in recent searches

#### Test 6.2: Click History Item
1. Ensure you have search history
2. Click on a history item
3. **Expected**: Search input populates with that query
4. **Expected**: Search results load automatically
5. **Expected**: Category selector appears

#### Test 6.3: Delete Single History Item
1. Hover over a history item
2. **Expected**: Delete button (X) appears on right
3. Click the X button
4. **Expected**: Item animates out (slide + fade)
5. **Expected**: Item removed from list
6. **Expected**: Network tab shows DELETE request to `/search-history/history/:id`

#### Test 6.4: Clear All History
1. Ensure you have multiple search history items
2. Click "Clear All" button in top-right of history section
3. **Expected**: All items disappear with animation
4. **Expected**: Empty state message appears
5. **Expected**: Network tab shows DELETE request to `/search-history/history`
6. Refresh page
7. **Expected**: History remains empty (persisted to backend)

---

## 🎨 Visual Consistency Checks

### Check 1: Design Tokens
Verify all new components use consistent design tokens:
- [ ] Primary color: `#6B46C0` (purple)
- [ ] Border radius: `2rem` for cards, `1rem` for buttons
- [ ] Font family: Consistent with existing components
- [ ] Spacing: 4px grid system (gap-4, p-4, etc.)

### Check 2: Animations
Verify smooth animations with Framer Motion:
- [ ] Dropdowns fade + scale in
- [ ] Toasts slide in from bottom
- [ ] File previews animate in
- [ ] Category selector slides smoothly
- [ ] Post removal fades out

### Check 3: Hover States
Verify hover effects:
- [ ] Buttons darken/lighten on hover
- [ ] Dropdown items highlight on hover
- [ ] File preview shows remove button on hover
- [ ] Icons scale slightly on hover

### Check 4: Loading States
Verify loading indicators:
- [ ] File upload shows spinner during processing
- [ ] Search shows loading spinner while fetching
- [ ] Disabled buttons during mutations
- [ ] Toast does not flash during state transitions

---

## 🐛 Common Issues & Solutions

### Issue 1: Toasts Not Appearing
**Symptoms**: Actions complete but no toast notification
**Solution**: 
- Check browser console for errors
- Verify ToastProvider is wrapping the app in App.tsx
- Check Network tab to confirm API calls are succeeding/failing

### Issue 2: File Upload Fails Silently
**Symptoms**: Files selected but nothing happens
**Solution**:
- Check browser console for CORS errors
- Verify backend `/media/upload` endpoint is running
- Check FormData field name is 'file' (not 'media' or 'image')
- Verify Content-Type header is 'multipart/form-data'

### Issue 3: Dropdown Menu Doesn't Close
**Symptoms**: Menu stays open after clicking outside
**Solution**:
- Check for JavaScript errors in console
- Verify click-outside handler is registered
- Test Escape key to close

### Issue 4: Category Selector Missing
**Symptoms**: Categories don't appear when searching
**Solution**:
- Ensure query has at least 2 characters
- Check debounce delay (400ms)
- Verify conditional rendering: `{query.trim() && ...}`

### Issue 5: Toast Auto-Dismiss Not Working
**Symptoms**: Toasts don't disappear automatically
**Solution**:
- Check duration prop (default 5000ms)
- Verify setTimeout is not being cleared prematurely
- Check for conflicting animations

---

## ✅ Final Verification Checklist

Before marking testing complete, verify:

- [ ] All 4 toast variants display correctly (success, error, warning, info)
- [ ] File uploads work with both drag-drop and click-browse
- [ ] File size validation blocks files > 50MB
- [ ] File type validation blocks non-image/video files
- [ ] File previews display correctly with remove buttons
- [ ] Visibility selector shows all 3 options with icons
- [ ] Visibility selection persists across modal open/close
- [ ] Dropdown menu opens and closes smoothly
- [ ] Save post triggers success or "already saved" warning
- [ ] Hide post removes post from feed
- [ ] Share post copies link to clipboard
- [ ] Category selector appears when query is active
- [ ] Category switching updates results correctly
- [ ] Search history displays when no query
- [ ] History items can be clicked to populate search
- [ ] Individual history items can be deleted
- [ ] "Clear All" removes all history items
- [ ] All animations are smooth (no jank)
- [ ] No console errors during any test
- [ ] Mobile responsive design works (test at 375px, 768px, 1920px widths)

---

## 📊 Test Results Template

Use this template to record your testing results:

```
Date: _______________
Tester: _______________
Browser: _______________
Screen Size: _______________

Test Suite 1: Toast System
- Test 1.1: ☐ Pass ☐ Fail - Notes: _______
- Test 1.2: ☐ Pass ☐ Fail - Notes: _______
- Test 1.3: ☐ Pass ☐ Fail - Notes: _______
- Test 1.4: ☐ Pass ☐ Fail - Notes: _______

Test Suite 2: File Upload
- Test 2.1: ☐ Pass ☐ Fail - Notes: _______
- Test 2.2: ☐ Pass ☐ Fail - Notes: _______
- Test 2.3: ☐ Pass ☐ Fail - Notes: _______
- Test 2.4: ☐ Pass ☐ Fail - Notes: _______
- Test 2.5: ☐ Pass ☐ Fail - Notes: _______
- Test 2.6: ☐ Pass ☐ Fail - Notes: _______
- Test 2.7: ☐ Pass ☐ Fail - Notes: _______

Test Suite 3: Visibility Selector
- Test 3.1: ☐ Pass ☐ Fail - Notes: _______
- Test 3.2: ☐ Pass ☐ Fail - Notes: _______
- Test 3.3: ☐ Pass ☐ Fail - Notes: _______

Test Suite 4: Dropdown Menu
- Test 4.1: ☐ Pass ☐ Fail - Notes: _______
- Test 4.2: ☐ Pass ☐ Fail - Notes: _______
- Test 4.3: ☐ Pass ☐ Fail - Notes: _______
- Test 4.4: ☐ Pass ☐ Fail - Notes: _______
- Test 4.5: ☐ Pass ☐ Fail - Notes: _______
- Test 4.6: ☐ Pass ☐ Fail - Notes: _______

Test Suite 5: Search Categories
- Test 5.1: ☐ Pass ☐ Fail - Notes: _______
- Test 5.2: ☐ Pass ☐ Fail - Notes: _______
- Test 5.3: ☐ Pass ☐ Fail - Notes: _______
- Test 5.4: ☐ Pass ☐ Fail - Notes: _______
- Test 5.5: ☐ Pass ☐ Fail - Notes: _______
- Test 5.6: ☐ Pass ☐ Fail - Notes: _______

Test Suite 6: Search History
- Test 6.1: ☐ Pass ☐ Fail - Notes: _______
- Test 6.2: ☐ Pass ☐ Fail - Notes: _______
- Test 6.3: ☐ Pass ☐ Fail - Notes: _______
- Test 6.4: ☐ Pass ☐ Fail - Notes: _______

Overall Result: ☐ All Tests Pass ☐ Issues Found
```

---

**Happy Testing! 🚀**

If you find any bugs or unexpected behavior, document them with:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser console errors (if any)
5. Screenshots/video (if helpful)
