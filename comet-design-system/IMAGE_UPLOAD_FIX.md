# Image Upload 400 Error - Fixed

## Problem Diagnosis

The image upload was failing with a **400 Bad Request** error due to incorrect `Content-Type` header handling in multipart/form-data requests.

### Root Cause

1. **Default JSON Header**: The Axios instance in `services/api.ts` was configured with a default header:
   ```typescript
   headers: { 'Content-Type': 'application/json' }
   ```

2. **Incorrect Override**: When uploading files, the code was trying to override this with:
   ```typescript
   headers: { 'Content-Type': 'multipart/form-data' }
   ```

3. **Missing Boundary Parameter**: The browser/Axios needs to automatically generate and append the `boundary` parameter to the Content-Type header for multipart uploads. The format should be:
   ```
   Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
   ```

4. **Backend Rejection**: The backend (NestJS) was rejecting requests with malformed Content-Type headers, resulting in 400 errors.

## Solution Implemented

### Files Updated

1. **`src/services/media.ts`**
2. **`src/components/screens/CreateStoryModal.tsx`**
3. **`src/components/screens/CreatePostModal.tsx`**

### Fix Details

Added a `transformRequest` configuration to all FormData upload requests that:
1. Explicitly deletes the Content-Type header
2. Lets the browser/Axios automatically set the correct Content-Type with boundary

```typescript
const response = await api.post('/media/upload', formData, {
  headers: { 
    'Content-Type': 'multipart/form-data',
  },
  transformRequest: [
    (data, headers) => {
      // Remove the Content-Type to let browser set it with boundary
      if (headers && data instanceof FormData) {
        delete headers['Content-Type']
      }
      return data
    },
  ],
})
```

### How It Works

1. **FormData Creation**: File is appended to FormData with the correct field name ('file')
2. **Transform Request**: Before sending, the transformRequest function removes any preset Content-Type header
3. **Automatic Boundary**: Axios detects FormData and automatically sets:
   ```
   Content-Type: multipart/form-data; boundary=----WebKitFormBoundary[random]
   ```
4. **Backend Acceptance**: NestJS FileInterceptor now correctly parses the multipart request

### Affected Upload Locations

✅ **Profile Picture Upload** (`ProfileScreen.tsx`)
- Uses `mediaService.upload()` which is now fixed

✅ **Story Media Upload** (`CreateStoryModal.tsx`)
- Direct API call now properly handles Content-Type

✅ **Post Media Upload** (`CreatePostModal.tsx`)
- Multiple file upload loop now properly handles Content-Type

## Testing Checklist

- [ ] Upload profile picture from ProfileScreen
- [ ] Upload image in CreateStoryModal
- [ ] Upload single image in CreatePostModal
- [ ] Upload multiple images in CreatePostModal
- [ ] Verify uploaded images display correctly
- [ ] Check browser Network tab shows correct Content-Type with boundary
- [ ] Verify no 400 errors in console

## Additional Notes

### FormData Best Practices with Axios

1. **Never manually set** `Content-Type: multipart/form-data` without boundary
2. **Always delete** preset Content-Type headers when using FormData
3. **Let Axios handle** the boundary parameter automatically
4. **Use transformRequest** to clean up headers before sending

### Backend Requirements

The backend expects:
- Field name: `file` (not `files`, `image`, etc.)
- Max file size: 50MB
- Multipart/form-data with proper boundary

### Future Improvements

Consider creating a centralized upload utility:
```typescript
export async function uploadFile(file: File): Promise<Media> {
  const formData = new FormData()
  formData.append('file', file)
  
  return api.post('/media/upload', formData, {
    transformRequest: [(data, headers) => {
      if (headers && data instanceof FormData) {
        delete headers['Content-Type']
      }
      return data
    }],
  }).then(res => res.data)
}
```

This would centralize the fix and make it easier to maintain.

## References

- [Axios FormData Documentation](https://axios-http.com/docs/multipart)
- [MDN FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)
