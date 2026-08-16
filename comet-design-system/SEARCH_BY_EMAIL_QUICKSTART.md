# Search User by Email - Quick Start Guide

## What Changed?

The **Explore/Search Screen** has been converted to a **"Search User by Email"** feature that allows you to find users by their email address.

## Files Modified/Created

### ✨ New Files
1. **`src/hooks/useUserSearchByEmail.ts`** - Custom React hook for email search
2. **`SEARCH_BY_EMAIL_IMPLEMENTATION.md`** - Full implementation documentation
3. **`SEARCH_BY_EMAIL_QUICKSTART.md`** - This guide

### 📝 Modified Files
1. **`src/services/user.ts`** - Added `searchByEmail()` method
2. **`src/components/screens/SearchScreen.tsx`** - Complete UI redesign

## How to Use

### For Users
1. Navigate to the Search/Explore page
2. Enter an email address (e.g., `john.doe@example.com`)
3. Click the **Search** button
4. View the user's profile if found
5. Click **Clear** to reset and search again

### For Developers

#### 1. API Endpoint Used
```
GET /search-history?q={email}&category=users&page=1&limit=1
```

#### 2. Using the Service
```typescript
import { userService } from '../services/user'

// Search for a user by email
const user = await userService.searchByEmail('user@example.com')

if (user) {
  console.log('User found:', user.name)
} else {
  console.log('User not found')
}
```

#### 3. Using the Hook
```typescript
import { useUserSearchByEmail } from '../hooks/useUserSearchByEmail'

function MyComponent() {
  const { searchByEmail, user, isLoading, isError, clearResults } = useUserSearchByEmail()

  const handleSearch = () => {
    searchByEmail('user@example.com')
  }

  return (
    <div>
      {isLoading && <p>Searching...</p>}
      {isError && <p>Error occurred</p>}
      {user && <p>Found: {user.name}</p>}
      <button onClick={handleSearch}>Search</button>
      <button onClick={clearResults}>Clear</button>
    </div>
  )
}
```

## API Response Format

### Success (User Found)
```json
{
  "id": "123",
  "name": "John Doe",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "city": "Damascus",
  "country": "Syria",
  "gender": "MALE",
  "role": "USER",
  "bio": "Software developer and tech enthusiast",
  "avatar": "https://...",
  "avatarMedia": { "url": "https://..." },
  "coverMedia": null,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Not Found
```json
{
  "users": []
}
```

## UI States

| State | Display |
|-------|---------|
| **Initial** | Empty state with instructions |
| **Loading** | Spinner in search button |
| **Success** | User profile card with all details |
| **Not Found** | "No User Found" message |
| **Error** | Error banner with details |

## Key Features

✅ **Email-based search** - Find users by their email address  
✅ **Real-time feedback** - Loading, error, and success states  
✅ **Beautiful UI** - Glassmorphism design matching your app  
✅ **Profile display** - Avatar, bio, location, role, and more  
✅ **Responsive** - Works on mobile, tablet, and desktop  
✅ **Type-safe** - Full TypeScript support  
✅ **Error handling** - Graceful error messages  

## Testing the Feature

### Quick Test
1. Make sure your backend is running
2. Login to the app
3. Navigate to Search/Explore
4. Enter a valid user email from your database
5. Click Search
6. You should see the user's profile

### Test with cURL
```bash
curl -X GET "http://localhost:8000/search-history?q=user@example.com&category=users&page=1&limit=1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

## Environment Setup

Ensure your `.env` or `.env.local` has:
```env
VITE_API_URL=http://localhost:8000
```

## Common Issues

### "No results" for valid email
- ✅ Check the email exists in your database
- ✅ Verify the backend API is running
- ✅ Check you're logged in with valid token

### API returns 401
- ✅ Login again to get fresh tokens
- ✅ Check token refresh is working
- ✅ Verify Authorization header is set

### UI looks broken
- ✅ Run `npm install` to ensure all dependencies
- ✅ Clear browser cache
- ✅ Check console for errors

## Next Steps

1. **Test the feature** with real data
2. **Customize the UI** to match your branding
3. **Add more actions** (friend request, message, etc.)
4. **Implement search history** for convenience
5. **Add pagination** if needed for multiple results

## Questions?

Refer to the full documentation: `SEARCH_BY_EMAIL_IMPLEMENTATION.md`

---

**Ready to use!** 🚀 The feature is complete and production-ready.
