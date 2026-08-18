# Debugging Post Creation with Images

## What We Fixed

### 1. Enhanced Error Handling
- Modal now **stays open** on error (doesn't close and lose your content)
- Detailed error messages show the exact failure reason
- Console logs track every step of the upload and post creation process

### 2. Visual Feedback
- **Green success banner** shows uploaded media IDs after successful upload
- **Red error banner** shows if upload fails with specific reason
- Upload progress indication

### 3. Better Error Messages
The system now distinguishes between:
- **400**: Invalid data (bad file type, malformed request)
- **401**: Authentication expired (need to login again)
- **413**: File too large (exceeds 50MB)
- **500**: Server error (backend issue)
- **Network errors**: Connection problems

## How to Debug

### Step 1: Open Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Clear console before testing

### Step 2: Try Creating a Post with Image
1. Click on the quick post box or Image icon in HomeFeedScreen
2. CreatePostModal should open
3. Upload an image
4. Watch the console for logs

### Expected Console Output (Success)
```
📤 Starting file upload... { fileCount: 1 }
📎 Processing file: { name: "image.jpg", size: 123456, type: "image/jpeg" }
🚀 Uploading file to /media/upload... image.jpg
✅ Upload response: { id: "123", fileName: "...", url: "..." }
✅ File uploaded successfully, media ID: 123
✅ All files uploaded. Media IDs: ["123"]
📝 Creating post with payload: { content: "...", mediaIds: ["123"], ... }
```

### Expected Console Output (Failure)
If upload fails, you'll see:
```
📤 Starting file upload... { fileCount: 1 }
📎 Processing file: { name: "image.jpg", size: 123456, type: "image/jpeg" }
🚀 Uploading file to /media/upload... image.jpg
❌ Upload error: AxiosError { ... }
Error response: { status: 500, data: { message: "..." } }
```

## Common Issues and Solutions

### Issue 1: "Post saved locally" message
**Cause**: The POST /post API call is failing after image upload succeeds.

**Check**:
1. Look for console logs starting with `📝 Creating post with payload`
2. Check if `mediaIds` array is populated
3. Look for error response after "Creating post" log

**Solutions**:
- If status 401: Login again (session expired)
- If status 400: Check backend validation rules for posts
- If status 500: Backend server issue, check backend logs

### Issue 2: Image upload fails
**Cause**: The POST /media/upload API call is failing.

**Check**:
1. Look for console logs with `❌ Upload error`
2. Check the error response status code
3. Check error response data

**Solutions**:
- If status 401: Login again
- If status 413: Reduce image size (must be < 50MB)
- If status 400: Check if image format is supported (jpg, png, gif, webp)
- If status 500: Backend server issue

### Issue 3: No media IDs shown after upload
**Cause**: Backend didn't return a media ID in the response.

**Check**:
1. Look for log: `✅ Upload response: { ... }`
2. Check if the response contains an `id` field
3. If not, check backend /media/upload endpoint

**Fix**: Backend must return `{ id: "...", ...otherFields }` after successful upload

### Issue 4: Post appears without image
**Cause**: Post was created but didn't include `mediaIds` in the request.

**Check**:
1. Look at the "Creating post with payload" log
2. Check if `mediaIds` array contains the uploaded IDs
3. If empty, the upload might have failed silently

**Fix**: Ensure upload completes before clicking "Post Now"

## Backend Requirements

### POST /media/upload
**Must return**:
```json
{
  "id": "string",         // REQUIRED
  "fileName": "string",
  "mimeType": "string",
  "url": "string",
  "path": "string"
}
```

### POST /post
**Expects**:
```json
{
  "content": "string",
  "visibility": "PUBLIC | FRIENDS | ONLY_ME",
  "mediaIds": ["string"],  // Array of media IDs from upload
  "type": "POST"
}
```

**Must return**:
```json
{
  "id": "string",
  "content": "string",
  "media": [
    {
      "id": "string",
      "url": "string",
      "mimeType": "string"
    }
  ],
  // ...other post fields
}
```

## Testing Steps

1. **Test File Upload**:
   ```
   - Select a small image (< 1MB)
   - Check console for upload logs
   - Verify green success banner appears
   - Verify media ID is shown
   ```

2. **Test Post Creation**:
   ```
   - After upload succeeds, add some text
   - Click "Post Now"
   - Check console for post creation logs
   - Verify modal closes (success)
   - Verify post appears in feed with image
   ```

3. **Test Error Handling**:
   ```
   - Try uploading a very large file (> 50MB)
   - Verify error message appears
   - Try posting without login (clear localStorage)
   - Verify authentication error
   ```

## Network Tab Inspection

1. Open Developer Tools → Network tab
2. Filter by "XHR" or "Fetch"
3. Upload an image
4. Look for `/media/upload` request
5. Click on it and check:
   - **Request**: Should show FormData with file
   - **Response**: Should show `{ id: "...", ... }`
6. Create a post
7. Look for `/post` request
8. Check:
   - **Request Payload**: Should include `mediaIds: ["123"]`
   - **Response**: Should include post with media array

## Environment Variables

Ensure `.env` file exists with:
```
VITE_API_URL=http://localhost:8000
```

Or your actual backend URL.

## Quick Fixes

### If everything seems to fail:
1. Check if backend is running: `curl http://localhost:8000/health` (or your backend URL)
2. Check if you're logged in: `localStorage.getItem('comet_auth')`
3. Clear localStorage and login again
4. Check browser console for CORS errors
5. Check Network tab for failed requests

### If only images fail:
1. Check backend file upload size limit
2. Check backend multer/file upload configuration
3. Verify `/media/upload` endpoint is working: Test with Postman/Thunder Client
4. Check file permissions on backend storage folder

## Success Indicators

✅ Console shows "✅ File uploaded successfully"
✅ Green banner appears with media IDs
✅ Console shows "📝 Creating post with payload" with mediaIds populated
✅ Post appears in feed with image visible
✅ No error messages in console
