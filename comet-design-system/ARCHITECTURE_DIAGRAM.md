# Stories vs Posts Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              HOME FEED SCREEN                                 │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │                                                               │  │
│  │  ┌────────────────────────────────────────────────────────┐ │  │
│  │  │  📖 StoriesTray Component                              │ │  │
│  │  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                   │ │  │
│  │  │  │  +  │  │ 👤  │  │ 👤  │  │ 👤  │  ← Story Rings    │ │  │
│  │  │  └─────┘  └─────┘  └─────┘  └─────┘                   │ │  │
│  │  │  Add      User1    User2    User3                      │ │  │
│  │  └────────────────────────────────────────────────────────┘ │  │
│  │                                                               │  │
│  │  ─────────────────────────────────────────────────────────  │  │
│  │                                                               │  │
│  │  ┌────────────────────────────────────────────────────────┐ │  │
│  │  │  📝 Posts Feed                                          │ │  │
│  │  │  ┌────────────────────────────────────────────────┐    │ │  │
│  │  │  │ Post Card 1 (Regular Post)                     │    │ │  │
│  │  │  │ 👤 User Name                                   │    │ │  │
│  │  │  │ Content here...                                │    │ │  │
│  │  │  │ ❤️ 👍 💬 🔖                                    │    │ │  │
│  │  │  └────────────────────────────────────────────────┘    │ │  │
│  │  │  ┌────────────────────────────────────────────────┐    │ │  │
│  │  │  │ Post Card 2 (Regular Post)                     │    │ │  │
│  │  │  │ ...                                            │    │ │  │
│  │  │  └────────────────────────────────────────────────┘    │ │  │
│  │  └────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         REACT QUERY LAYER                            │
├──────────────────────────────┬──────────────────────────────────────┤
│    STORIES CACHE             │         POSTS CACHE                  │
│                              │                                      │
│  useStoriesFeed()            │  useFeed()                           │
│  useMyStories()              │  usePost()                           │
│  useStory()                  │  usePostsByUsername()                │
│  useUploadStory()            │  useCreatePost()                     │
│  useCreateStory()            │  useUpdatePost()                     │
│  useUpdateStory()            │  useDeletePost()                     │
│  useDeleteStory()            │  useReactToPost()                    │
│                              │  useSavePost()                       │
│  ❌ NO CROSS-INVALIDATION    │  useHidePost()                       │
└──────────────────────────────┴──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER                                │
├──────────────────────────────┬──────────────────────────────────────┤
│    storiesService            │         postsService                 │
│                              │                                      │
│  uploadStory()               │  getFeed()                           │
│  createStory()               │    ↳ filters out posts with .story   │
│  getFeed()                   │                                      │
│  getMine()                   │  getPost()                           │
│  getById()                   │  getPostsByUsername()                │
│  updateStory()               │    ↳ filters out posts with .story   │
│  deleteStory()               │                                      │
│                              │  createPost()                        │
│                              │  updatePost()                        │
│                              │  deletePost()                        │
│                              │  sharePost()                         │
└──────────────────────────────┴──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         API ENDPOINTS                                │
├──────────────────────────────┬──────────────────────────────────────┤
│    STORY ENDPOINTS           │         POST ENDPOINTS               │
│                              │                                      │
│  POST   /api/story/upload    │  GET    /api/post/feed               │
│  POST   /api/story           │  GET    /api/post/:id                │
│  GET    /api/story/feed      │  GET    /api/post/user/:username     │
│  GET    /api/story/mine      │  POST   /api/post                    │
│  GET    /api/story/:id       │  POST   /api/post/schedule           │
│  PATCH  /api/story/:id       │  PATCH  /api/post/:id                │
│  DELETE /api/story/:id       │  DELETE /api/post/:id                │
│                              │  POST   /api/post/share/:postId      │
│                              │  POST   /api/post/save/:postId       │
│                              │  POST   /api/post/hide/:postId       │
└──────────────────────────────┴──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND DATABASE                             │
├──────────────────────────────┬──────────────────────────────────────┤
│    Story Table               │         Post Table                   │
│                              │                                      │
│  id                          │  id                                  │
│  postId  ────────────────────┼─→ id                                 │
│  duration                    │  userId                              │
│  expiresAt                   │  content                             │
│  createdAt                   │  visibility                          │
│                              │  feeling                             │
│                              │  location                            │
│  ⚠️ Story wraps a Post       │  createdAt                           │
│  ⚠️ Post has story relation  │  ...                                 │
└──────────────────────────────┴──────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════

KEY SEPARATION POINTS:

1. ✅ Different UI Components
   - StoriesTray for stories
   - Posts feed for posts

2. ✅ Different React Query Hooks
   - useStoriesFeed() for stories
   - useFeed() for posts

3. ✅ Different Service Functions
   - storiesService.getFeed()
   - postsService.getFeed()

4. ✅ Different API Endpoints
   - /api/story/* for stories
   - /api/post/* for posts

5. ✅ Filtering at Multiple Layers
   - Backend: /post/feed excludes story-wrapped posts
   - Service: postsService filters .story relation
   - Component: HomeFeedScreen filters client-side

6. ✅ No Cache Cross-Contamination
   - Story mutations → only invalidate story queries
   - Post mutations → only invalidate post queries

═══════════════════════════════════════════════════════════════════════

DATA FLOW EXAMPLES:

┌─ Creating a Story ──────────────────────────────────────────────────┐
│                                                                      │
│  1. User clicks "Add Story" in StoriesTray                          │
│  2. CreateStoryModal opens                                          │
│  3. User uploads image + adds text                                  │
│  4. FormData → POST /api/story/upload                               │
│  5. Backend creates Post + Story wrapper                            │
│  6. Story appears in GET /api/story/feed                            │
│  7. React Query invalidates stories.feed()                          │
│  8. StoriesTray updates with new story                              │
│  9. ✅ Story NEVER appears in posts feed                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─ Creating a Post ───────────────────────────────────────────────────┐
│                                                                      │
│  1. User types in "Share your thoughts..." textbox                  │
│  2. User clicks "Launch"                                            │
│  3. JSON payload → POST /api/post                                   │
│  4. Backend creates Post (NO story wrapper)                         │
│  5. Post appears in GET /api/post/feed                              │
│  6. React Query invalidates posts.feed()                            │
│  7. Posts feed updates with new post                                │
│  8. ✅ Post NEVER appears in stories tray                           │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```
