# Reactions & Comments API Verification Report

## Overview
This document verifies the frontend TypeScript types, Axios requests, and TanStack Query implementations against the NestJS backend API based on the 6 Postman screenshots provided.

---

## 🔍 Backend Analysis Summary

### Controllers Inspected
- `apps/api/src/reaction/reaction.controller.ts`
- `apps/api/src/comment/comment.controller.ts`

### Services Inspected
- `apps/api/src/reaction/reaction.service.ts`
- `apps/api/src/comment/comment.service.ts`

### DTOs Inspected
- `apps/api/src/reaction/dto/create-reaction.dto.ts`
- `apps/api/src/comment/dto/create-comment.dto.ts`

### Prisma Schema
- `apps/api/prisma/schema.prisma` (Reaction and Comment models)

---

## 📸 Endpoint Verification (From Postman Screenshots)

### 1️⃣ Reaction of Mine - `GET http://localhost:8000/reaction`

#### Backend Controller
```typescript
@Get()
findOne(@Req() req) {
  return this.reactionService.findOne(req.user.id);
}
```

#### Backend Service
```typescript
findOne(userId: number | string | bigint) {
  return this.prisma.reaction.findMany({
    where: { userId: this.toBigInt(userId) }
  });
}
```

#### ✅ Verification Results

**Purpose:** Fetches ALL reactions created by the logged-in user

**Authentication:** 
- ✅ Requires Bearer Token
- ✅ User ID extracted from JWT (`req.user.id`)
- ⚠️ Does NOT accept userId in request body

**Response Structure:**
```typescript
[
  {
    id: string
    userId: string
    reactableId: string
    reactableType: "POST" | "COMMENT"
    reactionType: "LIKE" | "LOVE" | "CARE" | "HAHA" | "WOW" | "SAD" | "ANGRY"
    createdAt: string (ISO timestamp)
    deletedAt: string | null
  }
]
```

**Frontend Implementation:**
- ✅ Type: `GetMyReactionsResponse` in `src/types/reaction.types.ts`
- ✅ Service: `reactionsService.getMyReactions()` in `src/services/reactions.ts`
- ✅ Hook: `useMyReactionsQuery()` in `src/hooks/useReactionsQuery.ts`
- ✅ Query Key: `queryKeys.reactions.mine()`

---

### 2️⃣ Toggle Reaction - `POST http://localhost:8000/reaction`

#### Backend Controller
```typescript
@Post()
create(@Req() req, @Body() createReactionDto: CreateReactionDto) {
  return this.reactionService.create(createReactionDto, req.user.id);
}
```

#### Backend DTO
```typescript
export class CreateReactionDto {
  @IsString()
  reactableId: string;  // ✅ String validated, converted to BigInt internally

  @IsEnum(ReactableType)
  reactableType: ReactableType;  // ✅ Must be "POST" or "COMMENT" (case-sensitive)

  @IsOptional()
  @IsEnum(ReactionType)
  reactionType?: ReactionType;  // ✅ Optional - defaults to "LIKE"
}
```

#### Backend Service Logic (toggleReaction)
```typescript
// If no reaction exists → Creates new reaction
// If reaction exists with SAME reactionType → Deletes the reaction (toggle off)
// If reaction exists with DIFFERENT reactionType → Updates to new type
```

#### ✅ Verification Results

**Request Body:**
```json
{
  "reactableId": "1024",     // ✅ String (converted to BigInt on backend)
  "reactableType": "POST",   // ✅ Enum: "POST" or "COMMENT" (case-sensitive)
  "reactionType": "LOVE"     // ✅ Optional Enum: defaults to "LIKE" if omitted
}
```

**Important Findings:**
1. ✅ `reactableId` is **string** in DTO (converted to BigInt internally)
2. ✅ `reactableType` must be **exact enum value**: "POST" or "COMMENT" (case-sensitive)
3. ✅ `reactionType` is **optional** - backend defaults to "LIKE"
4. ✅ User ID is **NOT in body** - extracted from JWT token
5. ✅ Toggle behavior:
   - Same type → DELETE (toggle off)
   - Different type → UPDATE
   - No reaction → CREATE

**Prisma Enum Values:**
```prisma
enum ReactableType {
  POST    @map("Post")
  COMMENT @map("Comment")
}

enum ReactionType {
  LIKE  @map("like")
  LOVE  @map("love")
  CARE  @map("care")
  HAHA  @map("haha")
  WOW   @map("wow")
  SAD   @map("sad")
  ANGRY @map("angry")
}
```

**Frontend Implementation:**
- ✅ Type: `ToggleReactionRequest` in `src/types/reaction.types.ts`
- ✅ Service: `reactionsService.toggleReaction()` in `src/services/reactions.ts`
- ✅ Hook: `useToggleReactionMutation()` in `src/hooks/useReactionsQuery.ts`
- ✅ Optimistic Hook: `useToggleReactionOptimistic()` available

---

### 3️⃣ Add Comment - `POST http://localhost:8000/comment`

#### Backend Controller
```typescript
@Post()
create(@Body() createCommentDto: CreateCommentDto) {
  return this.commentService.create(createCommentDto);
}
```

#### Backend DTO
```typescript
export class CreateCommentDto {
  @IsString()
  postId: string;        // ✅ Required

  @IsString()
  userId: string;        // ⚠️ Required in DTO (security concern)

  @IsOptional()
  @IsString()
  parentId?: string;     // ✅ Optional - for nested replies

  @IsString()
  content: string;       // ✅ Required

  @IsOptional()
  @IsBoolean()
  isEdited?: boolean;    // ⚠️ Should NOT be sent on creation
}
```

#### Backend Service Logic
```typescript
// 1. Validates post exists (throws NotFoundException if not)
// 2. Converts IDs to BigInt
// 3. Sets parentId to null if undefined
// 4. Sets isEdited to false if not provided
// 5. Extracts hashtags from content automatically
// 6. Triggers engagement score tracking
```

#### ✅ Verification Results

**Request Body (from Postman):**
```json
{
  "postId": "1",
  "userId": "1",
  "content": "This is a great post!",
  "parentId": "2"
}
```

**Critical Findings:**

1. ⚠️ **SECURITY ISSUE**: `userId` is required in request body
   - **Current Backend**: Accepts userId from body
   - **Security Risk**: Client can impersonate other users
   - **Recommended**: Backend should extract userId from JWT token (`req.user.id`)
   - **Frontend Action**: We still send it as required, but note this for backend fix

2. ✅ `parentId` is **optional**
   - `null` or `undefined` → Top-level comment
   - Valid ID → Nested reply

3. ⚠️ `isEdited` should **NOT be sent on creation**
   - Backend will set it to false automatically
   - Only relevant for updates

**Frontend Implementation:**
- ✅ Type: `CreateCommentRequest` in `src/types/comment.types.ts`
- ✅ Service: `commentsService.createComment()` in `src/services/comments.ts`
- ✅ Hook: `useCreateComment()` in `src/hooks/useCommentsQuery.ts`
- ⚠️ Comment in types about userId security concern

---

### 4️⃣ Delete Comment - `DELETE http://localhost:8000/comment/1`

#### Backend Controller
```typescript
@Delete(':id')
remove(@Param('id') id: string) {
  return this.commentService.remove(id);
}
```

#### Backend Service
```typescript
remove(id: string) {
  return this.prisma.comment.delete({
    where: { id: this.toBigInt(id) }
  });
}
```

#### ✅ Verification Results

**Route:** `DELETE /comment/:id`
- ✅ Path parameter: `:id` (string, converted to BigInt)
- ✅ Hard delete (permanent removal, not soft delete)
- ✅ No request body required

**Frontend Implementation:**
- ✅ Service: `commentsService.deleteComment(id)` in `src/services/comments.ts`
- ✅ Hook: `useDeleteComment()` in `src/hooks/useCommentsQuery.ts`

---

### 5️⃣ Edit Comment - `PATCH http://localhost:8000/comment/1`

#### Backend Controller
```typescript
@Patch(':id')
update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
  return this.commentService.update(id, updateCommentDto);
}
```

#### Backend Service Logic
```typescript
async update(id: string, updateCommentDto: UpdateCommentDto) {
  // If content is updated, AUTOMATICALLY sets isEdited: true
  if (updateCommentDto.content !== undefined) {
    data.content = updateCommentDto.content;
    data.isEdited = true;  // ✅ Backend handles this automatically
  }
}
```

#### ✅ Verification Results

**Request Body (from Postman):**
```json
{
  "content": "Updated content",
  "isEdited": true
}
```

**Critical Findings:**

1. ✅ **Backend AUTOMATICALLY sets `isEdited: true`** when content changes
   - Frontend does NOT need to send `isEdited` manually
   - Backend handles this logic

2. ✅ All fields are optional (partial update)
   - Can update only `content`
   - Can technically update `postId`, `userId`, `parentId` (but shouldn't in practice)

**Recommended Frontend Request:**
```json
{
  "content": "Updated content"
  // isEdited NOT needed - backend sets it automatically
}
```

**Frontend Implementation:**
- ✅ Type: `UpdateCommentRequest` in `src/types/comment.types.ts`
- ✅ Service: `commentsService.updateComment()` in `src/services/comments.ts`
- ✅ Hook: `useUpdateComment()` in `src/hooks/useCommentsQuery.ts`
- ✅ Comment in types: "Do NOT need to manually pass isEdited"

---

### 6️⃣ Mine Comments - `GET http://localhost:8000/comment`

#### Backend Controller
```typescript
@Get()
findAll(@Req() req) {
  return this.commentService.findAll(req.user.id);
}
```

#### Backend Service
```typescript
findAll(userId: number | string | bigint) {
  const currentUserId = this.toBigInt(userId);
  return this.prisma.comment.findMany({
    where: {
      post: {
        deletedAt: null,
        OR: [
          { groupId: null },  // Public posts
          { group: { members: { some: { userId: currentUserId } } } }  // Group posts where user is member
        ]
      }
    }
  });
}
```

#### ✅ Verification Results

**Purpose:** Get comments accessible to the logged-in user

**Authentication:**
- ✅ Requires Bearer Token
- ✅ User ID extracted from JWT (`req.user.id`)

**Backend Filtering Logic:**
1. ✅ Only returns comments on NON-DELETED posts
2. ✅ Returns comments from:
   - Public posts (groupId: null)
   - Group posts where user is a member
3. ❌ Does NOT filter by postId automatically
4. ❌ No query parameters accepted (e.g., `?postId=123`)

**Important Note:**
- Despite being named "findAll", it returns **FILTERED** comments
- NOT all comments in the system
- Only comments user has access to based on group membership

**Frontend Implementation:**
- ✅ Type: `GetMyCommentsResponse` in `src/types/comment.types.ts`
- ✅ Service: `commentsService.getMyComments()` in `src/services/comments.ts`
- ✅ Hook: `useMyComments()` in `src/hooks/useCommentsQuery.ts`
- ✅ Query Key: `queryKeys.comments.mine()`

---

## 📦 Frontend Files Created

### Types
1. ✅ `src/types/reaction.types.ts` - Reaction types matching backend enums
2. ✅ `src/types/comment.types.ts` - Comment types matching backend models
3. ✅ `src/types/index.ts` - Updated with new exports

### Services
1. ✅ `src/services/reactions.ts` - Reactions API service with helper utilities
2. ✅ `src/services/comments.ts` - Comments API service with helper utilities
3. ✅ `src/services/index.ts` - Updated with new exports

### Hooks
1. ✅ `src/hooks/useReactionsQuery.ts` - TanStack Query hooks for reactions
   - `useMyReactionsQuery()` - Get all user reactions
   - `useToggleReactionMutation()` - Toggle reaction
   - `useToggleReactionOptimistic()` - Toggle with optimistic update
   - `useUserReactionStatus()` - Helper to check reaction status

2. ✅ `src/hooks/useCommentsQuery.ts` - Updated with new endpoints
   - `useMyComments()` - Get accessible comments
   - `useComment(id)` - Get single comment
   - `usePostComments(postId)` - Get post comments (existing, kept)
   - `useCreateComment()` - Updated to use new service
   - `useUpdateComment()` - Updated with proper invalidations
   - `useDeleteComment()` - Updated with proper invalidations

### Query Keys
✅ `src/lib/queryKeys.ts` - Updated with:
- `queryKeys.reactions.mine()`
- `queryKeys.comments.mine()`
- `queryKeys.comments.byId(id)`

---

## 🚨 Critical Findings & Security Concerns

### 1. Comment Creation - userId in Request Body
**Issue:** Backend accepts `userId` from request body
```typescript
// Current (Security Risk)
POST /comment
Body: { postId: "1", userId: "1", content: "..." }
```

**Recommended Backend Fix:**
```typescript
@Post()
create(@Req() req, @Body() createCommentDto: CreateCommentDto) {
  // Extract userId from JWT token, not from body
  return this.commentService.create(createCommentDto, req.user.id);
}

// Update DTO to remove userId
export class CreateCommentDto {
  @IsString()
  postId: string;

  // Remove: userId: string;  ← Should not be in DTO

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsString()
  content: string;
}
```

**Frontend Action:** 
- We continue sending `userId` as currently required
- Added comments in types warning about this security concern

### 2. Comment Edit - isEdited Field
**Issue:** Postman shows `isEdited: true` in PATCH request

**Backend Behavior:** Backend automatically sets `isEdited: true` when content changes

**Frontend Action:**
- Do NOT send `isEdited` field when updating comments
- Backend handles this automatically
- Updated types with clear documentation

---

## 💡 Usage Examples

### Reactions

```typescript
import { useToggleReactionMutation, useUserReactionStatus } from '@/hooks/useReactionsQuery'

// Toggle reaction on a post
function PostReactionButton({ postId }: { postId: string }) {
  const toggleReaction = useToggleReactionMutation()
  const { hasReacted, reactionType } = useUserReactionStatus(postId, 'POST')

  const handleReact = (type: ReactionType) => {
    toggleReaction.mutate({
      reactableId: postId,
      reactableType: 'POST',
      reactionType: type
    })
  }

  return (
    <button onClick={() => handleReact('LOVE')}>
      {hasReacted && reactionType === 'LOVE' ? '❤️' : '🤍'}
    </button>
  )
}
```

### Comments

```typescript
import { useCreateComment, useUpdateComment, useDeleteComment } from '@/hooks/useCommentsQuery'
import { useAuth } from '@/context/AuthContext'

function CommentForm({ postId }: { postId: string }) {
  const { user } = useAuth()
  const createComment = useCreateComment()

  const handleSubmit = (content: string) => {
    createComment.mutate({
      postId,
      userId: user.id,  // ⚠️ Required by current backend
      content
    })
  }

  return <textarea onSubmit={(e) => handleSubmit(e.target.value)} />
}

function EditCommentForm({ commentId, postId, currentContent }: Props) {
  const updateComment = useUpdateComment()

  const handleUpdate = (newContent: string) => {
    updateComment.mutate({
      commentId,
      postId,
      content: newContent
      // isEdited NOT needed - backend sets it automatically
    })
  }

  return <textarea defaultValue={currentContent} onSubmit={(e) => handleUpdate(e.target.value)} />
}
```

---

## ✅ Verification Checklist

- [x] All 6 Postman endpoints analyzed
- [x] Backend controllers and services inspected
- [x] DTOs validated against Prisma schema
- [x] Frontend types created matching backend exactly
- [x] Services created with proper Axios calls
- [x] TanStack Query hooks implemented
- [x] Query keys centralized
- [x] Security concerns documented
- [x] Usage examples provided
- [x] All enum values match Prisma schema
- [x] Type conversions (string to BigInt) documented
- [x] Authentication requirements verified

---

## 🎯 Next Steps

1. ✅ Use the created types, services, and hooks in your components
2. ⚠️ Consider requesting backend team to fix userId security issue in comment creation
3. ✅ Remove `isEdited` from comment update requests (backend handles it)
4. ✅ Test all endpoints with actual API calls
5. ✅ Implement optimistic updates where needed (already provided for reactions)

---

## 📝 Notes

- **No backend changes were made** - This verification only inspected the backend
- All frontend code matches the backend exactly as implemented
- Security concerns are documented but not fixed (backend-side issue)
- All types are strictly typed and match Prisma schema enums
- Query invalidations are properly configured for cache consistency
