# Reactions & Comments - Quick Start Guide

## 🚀 Quick Import Reference

```typescript
// Types
import type {
  Reaction,
  ReactionType,
  ReactableType,
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@/types'

// Services (if needed directly)
import { reactionsService, commentsService } from '@/services'

// Hooks (recommended way)
import {
  useMyReactionsQuery,
  useToggleReactionMutation,
  useUserReactionStatus,
} from '@/hooks/useReactionsQuery'

import {
  useMyComments,
  useComment,
  usePostComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
} from '@/hooks/useCommentsQuery'
```

---

## 🎯 Common Use Cases

### 1. Display Post with Reaction Button

```typescript
import { useToggleReactionMutation, useUserReactionStatus } from '@/hooks/useReactionsQuery'

function Post({ post }: { post: Post }) {
  const toggleReaction = useToggleReactionMutation()
  const { hasReacted, reactionType } = useUserReactionStatus(post.id, 'POST')

  const handleReact = (type: ReactionType) => {
    toggleReaction.mutate({
      reactableId: post.id,
      reactableType: 'POST',
      reactionType: type,
    })
  }

  return (
    <div>
      <p>{post.content}</p>
      
      {/* Single reaction button */}
      <button onClick={() => handleReact('LIKE')}>
        {hasReacted && reactionType === 'LIKE' ? '👍 Liked' : '👍 Like'}
      </button>

      {/* Or multiple reaction types */}
      <div>
        {(['LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY'] as ReactionType[]).map((type) => (
          <button
            key={type}
            onClick={() => handleReact(type)}
            className={reactionType === type ? 'active' : ''}
          >
            {getReactionEmoji(type)}
          </button>
        ))}
      </div>
    </div>
  )
}

// Helper function
const getReactionEmoji = (type: ReactionType) => {
  const emojis: Record<ReactionType, string> = {
    LIKE: '👍',
    LOVE: '❤️',
    CARE: '🤗',
    HAHA: '😂',
    WOW: '😮',
    SAD: '😢',
    ANGRY: '😠',
  }
  return emojis[type]
}
```

---

### 2. Comment Section with Create/Edit/Delete

```typescript
import { usePostComments, useCreateComment, useUpdateComment, useDeleteComment } from '@/hooks/useCommentsQuery'
import { useAuth } from '@/context/AuthContext'

function CommentSection({ postId }: { postId: string }) {
  const { user } = useAuth()
  const { data: comments, isLoading } = usePostComments(postId)
  const createComment = useCreateComment()
  const updateComment = useUpdateComment()
  const deleteComment = useDeleteComment()

  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const handleCreate = () => {
    if (!newComment.trim()) return

    createComment.mutate(
      {
        postId,
        userId: user.id,
        content: newComment,
      },
      {
        onSuccess: () => setNewComment(''),
      },
    )
  }

  const handleEdit = (commentId: string) => {
    if (!editContent.trim()) return

    updateComment.mutate(
      {
        commentId,
        postId,
        content: editContent,
      },
      {
        onSuccess: () => {
          setEditingId(null)
          setEditContent('')
        },
      },
    )
  }

  const handleDelete = (commentId: string) => {
    if (confirm('Delete this comment?')) {
      deleteComment.mutate({ commentId, postId })
    }
  }

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  if (isLoading) return <div>Loading comments...</div>

  return (
    <div className="comment-section">
      {/* Create new comment */}
      <div className="new-comment">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleCreate} disabled={createComment.isPending}>
          {createComment.isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </div>

      {/* Display comments */}
      <div className="comments-list">
        {comments?.map((comment) => (
          <div key={comment.id} className="comment">
            {editingId === comment.id ? (
              // Edit mode
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={() => handleEdit(comment.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              // View mode
              <div>
                <p>{comment.content}</p>
                {comment.isEdited && <span className="edited">(edited)</span>}
                
                {comment.userId === user.id && (
                  <div className="actions">
                    <button onClick={() => startEdit(comment)}>Edit</button>
                    <button onClick={() => handleDelete(comment.id)}>Delete</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

### 3. Nested/Threaded Comments (Replies)

```typescript
import { usePostComments, useCreateComment } from '@/hooks/useCommentsQuery'
import { buildCommentThread } from '@/services/comments'

function ThreadedComments({ postId }: { postId: string }) {
  const { data: comments } = usePostComments(postId)
  const createComment = useCreateComment()

  // Convert flat list to threaded structure
  const threads = comments ? buildCommentThread(comments) : []

  const handleReply = (parentId: string, content: string, userId: string) => {
    createComment.mutate({
      postId,
      userId,
      content,
      parentId, // ← Key for nested reply
    })
  }

  return (
    <div>
      {threads.map((thread) => (
        <CommentThread
          key={thread.comment.id}
          thread={thread}
          onReply={handleReply}
        />
      ))}
    </div>
  )
}

function CommentThread({
  thread,
  onReply,
}: {
  thread: { comment: Comment; replies: any[]; depth: number }
  onReply: (parentId: string, content: string, userId: string) => void
}) {
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const { user } = useAuth()

  const handleReplySubmit = () => {
    onReply(thread.comment.id, replyContent, user.id)
    setReplyContent('')
    setShowReplyBox(false)
  }

  return (
    <div style={{ marginLeft: `${thread.depth * 20}px` }}>
      <div className="comment">
        <p>{thread.comment.content}</p>
        <button onClick={() => setShowReplyBox(!showReplyBox)}>Reply</button>

        {showReplyBox && (
          <div className="reply-box">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
            />
            <button onClick={handleReplySubmit}>Send</button>
            <button onClick={() => setShowReplyBox(false)}>Cancel</button>
          </div>
        )}
      </div>

      {/* Render nested replies */}
      {thread.replies.map((reply) => (
        <CommentThread key={reply.comment.id} thread={reply} onReply={onReply} />
      ))}
    </div>
  )
}
```

---

### 4. Check if User Has Reacted (For UI State)

```typescript
import { useMyReactionsQuery } from '@/hooks/useReactionsQuery'

function PostCard({ post }: { post: Post }) {
  const { data: myReactions } = useMyReactionsQuery()

  // Check if user has reacted to this post
  const userReaction = myReactions?.find(
    (r) => r.reactableId === post.id && r.reactableType === 'POST' && !r.deletedAt,
  )

  return (
    <div>
      <p>{post.content}</p>
      <div>
        {userReaction ? (
          <span>You reacted with {userReaction.reactionType}</span>
        ) : (
          <span>You haven't reacted yet</span>
        )}
      </div>
    </div>
  )
}
```

---

### 5. Optimistic Reaction Toggle (Instant UI Feedback)

```typescript
import { useToggleReactionOptimistic } from '@/hooks/useReactionsQuery'
import { useAuth } from '@/context/AuthContext'

function OptimisticReactionButton({ postId }: { postId: string }) {
  const { user } = useAuth()
  const toggleReaction = useToggleReactionOptimistic()

  const handleReact = () => {
    toggleReaction.mutate({
      reactableId: postId,
      reactableType: 'POST',
      reactionType: 'LIKE',
      userId: user.id, // ← Required for optimistic update
    })
  }

  return (
    <button onClick={handleReact}>
      Like {toggleReaction.isPending && '...'}
    </button>
  )
}
```

---

### 6. React to Comments (Not Just Posts)

```typescript
function CommentWithReactions({ comment }: { comment: Comment }) {
  const toggleReaction = useToggleReactionMutation()
  const { hasReacted, reactionType } = useUserReactionStatus(comment.id, 'COMMENT')

  const handleReact = () => {
    toggleReaction.mutate({
      reactableId: comment.id,
      reactableType: 'COMMENT', // ← Notice COMMENT instead of POST
      reactionType: 'LIKE',
    })
  }

  return (
    <div>
      <p>{comment.content}</p>
      <button onClick={handleReact}>
        {hasReacted ? '👍 Liked' : '👍 Like'}
      </button>
    </div>
  )
}
```

---

## 📋 API Endpoint Summary

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/reaction` | Get all my reactions | Bearer Token ✅ |
| POST | `/reaction` | Toggle reaction (create/update/delete) | Bearer Token ✅ |
| GET | `/comment` | Get accessible comments | Bearer Token ✅ |
| GET | `/comment/:id` | Get single comment | Bearer Token ✅ |
| POST | `/comment` | Create comment | Bearer Token ✅ |
| PATCH | `/comment/:id` | Update comment | Bearer Token ✅ |
| DELETE | `/comment/:id` | Delete comment | Bearer Token ✅ |

---

## ⚠️ Important Notes

### Reactions
1. **Toggle Behavior**: Clicking same reaction type removes it (toggle off)
2. **User ID**: Extracted from JWT token, NOT from request body
3. **Default Type**: If `reactionType` omitted, defaults to 'LIKE'
4. **Reactable Types**: Can react to both 'POST' and 'COMMENT'

### Comments
1. **User ID Security**: Currently required in body (⚠️ security concern, see verification doc)
2. **isEdited Flag**: Backend sets automatically when content changes - don't send it
3. **Nested Replies**: Use `parentId` to create threaded comments
4. **Hashtags**: Backend extracts automatically from content

---

## 🎨 Enum Values Reference

```typescript
// Reaction Types
type ReactionType = 'LIKE' | 'LOVE' | 'CARE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY'

// Reactable Types (what you can react to)
type ReactableType = 'POST' | 'COMMENT'
```

---

## 🧪 Testing Checklist

- [ ] Toggle reaction on post (create)
- [ ] Toggle same reaction again (delete/toggle off)
- [ ] Change reaction type (update)
- [ ] React to comment (not just post)
- [ ] Create top-level comment
- [ ] Create nested reply (with parentId)
- [ ] Edit comment
- [ ] Delete comment
- [ ] Check if user has reacted (UI state)
- [ ] Test with different reaction types

---

## 🐛 Common Issues & Solutions

### Issue: "User ID not found in token"
**Solution:** Ensure Bearer token is set in Axios interceptor (check `src/services/api.ts`)

### Issue: "Invalid enum value for reactableType"
**Solution:** Must be exactly `'POST'` or `'COMMENT'` (case-sensitive, from enum)

### Issue: "Comment not appearing after creation"
**Solution:** Check query invalidation in mutation's `onSettled` callback

### Issue: "Reaction not toggling correctly"
**Solution:** Use `useUserReactionStatus` hook to check current state, backend handles toggle logic

### Issue: "isEdited not updating"
**Solution:** Don't send `isEdited` in PATCH request - backend sets it automatically when content changes

---

## 📚 Further Reading

- Full API Verification: `REACTIONS_COMMENTS_API_VERIFICATION.md`
- Type Definitions: `src/types/reaction.types.ts`, `src/types/comment.types.ts`
- Service Layer: `src/services/reactions.ts`, `src/services/comments.ts`
- React Hooks: `src/hooks/useReactionsQuery.ts`, `src/hooks/useCommentsQuery.ts`
