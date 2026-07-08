# Reactions & Comments - Architecture Diagram

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              REACT COMPONENTS (UI Layer)                │    │
│  │  • PostCard                                             │    │
│  │  • CommentSection                                       │    │
│  │  • ReactionButton                                       │    │
│  │  • CommentForm                                          │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
│                     ├──── useToggleReactionMutation()           │
│                     ├──── useUserReactionStatus()               │
│                     ├──── useCreateComment()                    │
│                     └──── usePostComments()                     │
│                     │                                            │
│  ┌──────────────────▼──────────────────────────────────────┐    │
│  │        TANSTACK QUERY HOOKS (State Management)          │    │
│  │                                                          │    │
│  │  src/hooks/useReactionsQuery.ts                         │    │
│  │  ├─ useMyReactionsQuery()          [GET /reaction]     │    │
│  │  ├─ useToggleReactionMutation()    [POST /reaction]    │    │
│  │  ├─ useToggleReactionOptimistic()  (with optimistic)   │    │
│  │  └─ useUserReactionStatus()        (helper)            │    │
│  │                                                          │    │
│  │  src/hooks/useCommentsQuery.ts                          │    │
│  │  ├─ useMyComments()                [GET /comment]      │    │
│  │  ├─ useComment(id)                 [GET /comment/:id]  │    │
│  │  ├─ usePostComments(postId)        (cached/derived)    │    │
│  │  ├─ useCreateComment()             [POST /comment]     │    │
│  │  ├─ useUpdateComment()             [PATCH /comment/:id]│    │
│  │  └─ useDeleteComment()             [DELETE /comment/:id]    │
│  │                                                          │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
│  ┌──────────────────▼──────────────────────────────────────┐    │
│  │           API SERVICES (HTTP Layer)                     │    │
│  │                                                          │    │
│  │  src/services/reactions.ts                              │    │
│  │  └─ reactionsService                                    │    │
│  │     ├─ toggleReaction(payload)                          │    │
│  │     └─ getMyReactions()                                 │    │
│  │                                                          │    │
│  │  src/services/comments.ts                               │    │
│  │  └─ commentsService                                     │    │
│  │     ├─ createComment(payload)                           │    │
│  │     ├─ updateComment(id, payload)                       │    │
│  │     ├─ deleteComment(id)                                │    │
│  │     ├─ getMyComments()                                  │    │
│  │     └─ getComment(id)                                   │    │
│  │                                                          │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
│  ┌──────────────────▼──────────────────────────────────────┐    │
│  │                 AXIOS CLIENT                            │    │
│  │  src/services/api.ts                                    │    │
│  │  • Base URL: http://localhost:8000                      │    │
│  │  • Bearer Token Auth                                    │    │
│  │  • Request/Response Interceptors                        │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
└─────────────────────┼────────────────────────────────────────────┘
                      │ HTTP (Axios)
                      │
┌─────────────────────▼────────────────────────────────────────────┐
│                      BACKEND (NestJS)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   CONTROLLERS                           │    │
│  │                                                          │    │
│  │  ReactionController                                     │    │
│  │  ├─ GET  /reaction        → findOne(@Req req)          │    │
│  │  └─ POST /reaction        → create(@Body dto)          │    │
│  │                                                          │    │
│  │  CommentController                                      │    │
│  │  ├─ GET    /comment       → findAll(@Req req)          │    │
│  │  ├─ GET    /comment/:id   → findOne(@Param id)         │    │
│  │  ├─ POST   /comment       → create(@Body dto)          │    │
│  │  ├─ PATCH  /comment/:id   → update(@Param id, @Body)   │    │
│  │  └─ DELETE /comment/:id   → remove(@Param id)          │    │
│  │                                                          │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
│  ┌──────────────────▼──────────────────────────────────────┐    │
│  │                   SERVICES                              │    │
│  │                                                          │    │
│  │  ReactionService                                        │    │
│  │  ├─ toggleReaction() - Create/Update/Delete logic      │    │
│  │  └─ findOne() - Get user reactions                     │    │
│  │                                                          │    │
│  │  CommentService                                         │    │
│  │  ├─ create() - With hashtag extraction                 │    │
│  │  ├─ update() - Auto-sets isEdited flag                 │    │
│  │  ├─ remove() - Hard delete                             │    │
│  │  ├─ findAll() - Filter by group membership             │    │
│  │  └─ findOne() - Get single comment                     │    │
│  │                                                          │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
│  ┌──────────────────▼──────────────────────────────────────┐    │
│  │              PRISMA ORM (Database Layer)                │    │
│  │                                                          │    │
│  │  Models:                                                │    │
│  │  ├─ Reaction                                            │    │
│  │  │  ├─ id: BigInt                                       │    │
│  │  │  ├─ userId: BigInt                                   │    │
│  │  │  ├─ reactableId: BigInt                              │    │
│  │  │  ├─ reactableType: ReactableType (POST/COMMENT)     │    │
│  │  │  ├─ reactionType: ReactionType (LIKE/LOVE/etc)      │    │
│  │  │  └─ @@unique([userId, reactableId, reactableType])  │    │
│  │  │                                                       │    │
│  │  └─ Comment                                             │    │
│  │     ├─ id: BigInt                                       │    │
│  │     ├─ postId: BigInt                                   │    │
│  │     ├─ userId: BigInt                                   │    │
│  │     ├─ parentId: BigInt? (for nested replies)          │    │
│  │     ├─ content: String                                  │    │
│  │     └─ isEdited: Boolean                                │    │
│  │                                                          │    │
│  └──────────────────┬──────────────────────────────────────┘    │
│                     │                                            │
└─────────────────────┼────────────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │  MySQL/MariaDB│
              └───────────────┘
```

---

## 🔄 Data Flow Examples

### 1. Toggle Reaction Flow

```
User clicks "Like" button
         │
         ▼
┌────────────────────────────────────────────┐
│ Component: <LikeButton />                  │
│ Calls: toggleReaction.mutate()             │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ Hook: useToggleReactionMutation()          │
│ • onMutate: Cancel queries (optional)      │
│ • mutationFn: Call API service             │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ Service: reactionsService.toggleReaction() │
│ • Build payload: {                         │
│     reactableId: "1024",                   │
│     reactableType: "POST",                 │
│     reactionType: "LIKE"                   │
│   }                                        │
│ • POST /reaction with Axios                │
└─────────────────┬──────────────────────────┘
                  │
                  ▼  HTTP Request
┌────────────────────────────────────────────┐
│ Backend: ReactionController.create()       │
│ • Extract user ID from JWT token           │
│ • Call service.toggleReaction()            │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ Backend: ReactionService.toggleReaction()  │
│ • Check if reaction exists                 │
│ • If same type → DELETE                    │
│ • If different type → UPDATE               │
│ • If no reaction → CREATE                  │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ Prisma: prisma.reaction.create/update/delete│
│ • Execute database query                   │
│ • Return reaction object                   │
└─────────────────┬──────────────────────────┘
                  │
                  ▼  Response
┌────────────────────────────────────────────┐
│ Hook: onSuccess callback                   │
│ • Invalidate reactions.mine()              │
│ • Invalidate posts.feed()                  │
│ • UI re-renders with new data              │
└────────────────────────────────────────────┘
```

---

### 2. Create Comment Flow

```
User submits comment form
         │
         ▼
┌────────────────────────────────────────────┐
│ Component: <CommentForm />                 │
│ Calls: createComment.mutate()              │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ Hook: useCreateComment()                   │
│ • onMutate: Optimistic update (optional)   │
│ • mutationFn: Call API service             │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ Service: commentsService.createComment()   │
│ • Build payload: {                         │
│     postId: "1",                           │
│     userId: "1",                           │
│     content: "Great post!",                │
│     parentId: null                         │
│   }                                        │
│ • POST /comment with Axios                 │
└─────────────────┬──────────────────────────┘
                  │
                  ▼  HTTP Request
┌────────────────────────────────────────────┐
│ Backend: CommentController.create()        │
│ • Validate DTO                             │
│ • Call service.create()                    │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ Backend: CommentService.create()           │
│ • Validate post exists                     │
│ • Convert IDs to BigInt                    │
│ • Extract hashtags from content            │
│ • Set isEdited = false                     │
│ • Trigger engagement tracking              │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────┐
│ Prisma: prisma.comment.create()            │
│ • Insert into database                     │
│ • Return comment object                    │
└─────────────────┬──────────────────────────┘
                  │
                  ▼  Response
┌────────────────────────────────────────────┐
│ Hook: onSettled callback                   │
│ • Invalidate comments.byPost(postId)       │
│ • Invalidate posts.byId(postId)            │
│ • Invalidate comments.mine()               │
│ • UI re-renders with new comment           │
└────────────────────────────────────────────┘
```

---

## 🗂️ File Organization

```
comet-design-system/
├── src/
│   ├── types/
│   │   ├── index.ts                    (exports all types)
│   │   ├── reaction.types.ts           ✅ NEW - Reaction types
│   │   ├── comment.types.ts            ✅ NEW - Comment types
│   │   ├── post.types.ts               (existing)
│   │   └── ...
│   │
│   ├── services/
│   │   ├── index.ts                    (exports all services)
│   │   ├── api.ts                      (Axios instance)
│   │   ├── reactions.ts                ✅ NEW - Reactions API
│   │   ├── comments.ts                 ✅ NEW - Comments API
│   │   ├── posts.ts                    (existing)
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── useReactionsQuery.ts        ✅ NEW - Reaction hooks
│   │   ├── useCommentsQuery.ts         ✅ UPDATED - Comment hooks
│   │   ├── usePostsQuery.ts            (existing)
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── queryKeys.ts                ✅ UPDATED - Query keys
│   │   └── ...
│   │
│   └── components/
│       └── ... (your UI components use the hooks)
│
├── REACTIONS_COMMENTS_API_VERIFICATION.md    ✅ NEW
├── REACTIONS_COMMENTS_QUICK_START.md         ✅ NEW
├── REACTIONS_COMMENTS_SUMMARY.md             ✅ NEW
└── REACTIONS_COMMENTS_ARCHITECTURE.md        ✅ NEW (this file)
```

---

## 🎯 Type Safety Flow

```
Frontend Types                Backend Validation              Database Schema
─────────────                ──────────────────              ───────────────

ReactionType enum     →     @IsEnum(ReactionType)    →     enum ReactionType
├─ LIKE                     in CreateReactionDto           ├─ LIKE @map("like")
├─ LOVE                                                     ├─ LOVE @map("love")
└─ ...                                                      └─ ...

ReactableType enum    →     @IsEnum(ReactableType)   →     enum ReactableType
├─ POST                     in CreateReactionDto           ├─ POST @map("Post")
└─ COMMENT                                                  └─ COMMENT @map("Comment")

ToggleReactionRequest →     CreateReactionDto        →     Reaction model
├─ reactableId: string      ├─ @IsString()                 ├─ reactableId: BigInt
├─ reactableType            ├─ @IsEnum()                   ├─ reactableType
└─ reactionType?            └─ @IsOptional()               └─ reactionType

Comment interface     →     CreateCommentDto         →     Comment model
├─ postId: string           ├─ @IsString()                 ├─ postId: BigInt
├─ userId: string           ├─ @IsString()                 ├─ userId: BigInt
├─ content: string          ├─ @IsString()                 ├─ content: String
└─ parentId?: string        └─ @IsOptional()               └─ parentId: BigInt?
```

---

## 🔐 Authentication Flow

```
                   Frontend                                Backend
                   ────────                                ───────

User logs in   →   Store JWT token        →   Validate JWT in guard
                   (localStorage/cookie)       Extract user.id from token
                                                        │
Request made   →   Axios interceptor      →            │
                   Add Bearer token                     │
                   to Authorization header              │
                                                        │
                                                        ▼
API call       →   GET /reaction          →   @Req() req parameter
                   Headers: {                  req.user.id available
                     Authorization:            (no userId in body needed)
                     "Bearer eyJhbG..."
                   }
```

---

## 🔄 Cache Invalidation Strategy

```
Action                    Invalidates Cache Keys
──────                    ─────────────────────

Toggle Reaction    →      ├─ reactions.mine()
                          ├─ posts.feed(page, size)
                          └─ posts.all()

Create Comment     →      ├─ comments.byPost(postId)
                          ├─ posts.byId(postId)
                          └─ comments.mine()

Update Comment     →      ├─ comments.byPost(postId)
                          ├─ comments.byId(commentId)
                          ├─ posts.byId(postId)
                          └─ comments.mine()

Delete Comment     →      ├─ comments.byPost(postId)
                          ├─ comments.byId(commentId)
                          ├─ posts.byId(postId)
                          └─ comments.mine()
```

---

## 📊 State Management Layers

```
┌────────────────────────────────────────────────────────────┐
│ Layer 1: React Component State (useState, useReducer)     │
│ • Local UI state (input values, modals, dropdowns)        │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│ Layer 2: TanStack Query Cache (Server State)              │
│ • API response data cached here                            │
│ • Automatic background refetching                          │
│ • Optimistic updates                                       │
│ • Query Keys:                                              │
│   - reactions.mine()                                       │
│   - comments.byPost(id)                                    │
│   - comments.mine()                                        │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────┐
│ Layer 3: Backend Database (Source of Truth)               │
│ • MySQL/MariaDB via Prisma ORM                             │
│ • Reactions table                                          │
│ • Comments table                                           │
└────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Integration Pattern

```typescript
// ✅ Recommended Pattern

function PostCard({ post }: { post: Post }) {
  // 1. Fetch data with hooks
  const { hasReacted, reactionType } = useUserReactionStatus(post.id, 'POST')
  const { data: comments } = usePostComments(post.id)
  
  // 2. Get mutation functions
  const toggleReaction = useToggleReactionMutation()
  const createComment = useCreateComment()
  
  // 3. Handle user actions
  const handleReact = (type: ReactionType) => {
    toggleReaction.mutate({
      reactableId: post.id,
      reactableType: 'POST',
      reactionType: type
    })
  }
  
  // 4. Render UI
  return (
    <div>
      <PostContent post={post} />
      <ReactionButtons 
        hasReacted={hasReacted}
        currentType={reactionType}
        onReact={handleReact}
      />
      <CommentList comments={comments} />
      <CommentForm onSubmit={(content) => createComment.mutate(...)} />
    </div>
  )
}
```

---

This architecture ensures type safety, optimal caching, and clean separation of concerns! 🎉
