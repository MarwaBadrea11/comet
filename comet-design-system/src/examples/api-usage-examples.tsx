/**
 * API Usage Examples
 * 
 * These examples demonstrate how to use the refactored API services
 * and TanStack Query hooks after the backend cleanup.
 */

import { useState } from 'react'
import {
  useFeed,
  useCreatePost,
  useHidePost,
  useSavePost,
  useSchedulePost,
  useSharePost,
} from '../hooks/usePostsQuery'
import {
  useGlobalSearch,
  useSearchHistory,
  useClearAllHistory,
} from '../hooks/useSearchQuery'
import {
  useUploadMedia,
  useDeleteMedia,
} from '../hooks/useMediaQuery'

// ═══════════════════════════════════════════════════════════════════════════
// EXAMPLE 1: Feed with Pagination
// ═══════════════════════════════════════════════════════════════════════════

export function FeedExample() {
  const [page, setPage] = useState(1)
  const { data: posts, isLoading } = useFeed(page, 20)

  return (
    <div>
      <h2>My Feed</h2>
      {isLoading && <p>Loading...</p>}
      {posts?.map((post: any) => (
        <div key={post.id}>
          <p>{post.content}</p>
          <small>by {post.user?.name}</small>
        </div>
      ))}
      <button onClick={() => setPage(p => p + 1)}>Load More</button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// EXAMPLE 2: Create Post with Media Upload
// ═══════════════════════════════════════════════════════════════════════════

export function CreatePostExample() {
  const [content, setContent] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedMediaIds, setUploadedMediaIds] = useState<string[]>([])

  const { mutate: uploadMedia, isPending: isUploading } = useUploadMedia()
  const { mutate: createPost, isPending: isCreating } = useCreatePost()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = () => {
    selectedFiles.forEach((file) => {
      uploadMedia(file, {
        onSuccess: (media: any) => {
          setUploadedMediaIds((prev) => [...prev, media.id])
        },
      })
    })
  }

  const handleSubmit = () => {
    createPost({
      content,
      visibility: 'PUBLIC',
      feeling: '😊',
      location: 'New York',
      mediaIds: uploadedMediaIds,
      // Hashtags are automatically extracted from content!
      // Backend uses regex: /#[\w\u0600-\u06FF]+/g
    }, {
      onSuccess: () => {
        setContent('')
        setUploadedMediaIds([])
        setSelectedFiles([])
      },
    })
  }

  return (
    <div>
      <h2>Create Post</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind? Use #hashtags"
      />

      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileSelect}
      />

      {selectedFiles.length > 0 && (
        <button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} files`}
        </button>
      )}

      <button onClick={handleSubmit} disabled={isCreating || uploadedMediaIds.length === 0}>
        {isCreating ? 'Creating...' : 'Create Post'}
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// EXAMPLE 3: Schedule Post for Future Publishing
// ═══════════════════════════════════════════════════════════════════════════

export function SchedulePostExample() {
  const [content, setContent] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')

  const { mutate: schedulePost, isPending } = useSchedulePost()

  const handleSchedule = () => {
    const scheduledAt = new Date(scheduledDate).toISOString()

    schedulePost({
      content,
      visibility: 'PUBLIC',
      scheduledAt, // ISO 8601 timestamp
    }, {
      onSuccess: () => {
        alert('Post scheduled successfully!')
        setContent('')
        setScheduledDate('')
      },
    })
  }

  return (
    <div>
      <h2>Schedule Post</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content to post later..."
      />

      <input
        type="datetime-local"
        value={scheduledDate}
        onChange={(e) => setScheduledDate(e.target.value)}
      />

      <button onClick={handleSchedule} disabled={isPending}>
        {isPending ? 'Scheduling...' : 'Schedule Post'}
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// EXAMPLE 4: Search (GET /search/global — the only working search endpoint)
// ═══════════════════════════════════════════════════════════════════════════

export function SearchExample() {
  const [query, setQuery] = useState('')

  // GET /search/global?q=...&limit=... — searches users (incl. email), posts,
  // and groups in one call; no category filter (backend always returns all three).
  const { data: results, isLoading } = useGlobalSearch(query, 20)
  const { data: history } = useSearchHistory()

  return (
    <div>
      <h2>Search</h2>

      {/* Search Input */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />

      {/* Results */}
      {isLoading && <p>Searching...</p>}
      
      {results?.users && (
        <div>
          <h3>Users</h3>
          {results.users.map((user: any) => (
            <div key={user.id}>{user.name} (@{user.username})</div>
          ))}
        </div>
      )}

      {results?.posts && (
        <div>
          <h3>Posts</h3>
          {results.posts.map((post: any) => (
            <div key={post.id}>{post.content}</div>
          ))}
        </div>
      )}

      {/* Search History */}
      <div>
        <h3>Recent Searches</h3>
        {history?.map((item: any) => (
          <div key={item.id} onClick={() => setQuery(item.query)}>
            {item.query}
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// EXAMPLE 5: Post Actions (Hide, Save, Share)
// ═══════════════════════════════════════════════════════════════════════════

export function PostActionsExample({ postId }: { postId: string }) {
  const { mutate: hidePost } = useHidePost()
  const { mutate: savePost } = useSavePost()
  const { mutate: sharePost } = useSharePost()

  const handleHide = () => {
    // ✅ UPDATED: Now uses POST /post/hide/:postId
    hidePost(postId, {
      onSuccess: () => alert('Post hidden from your feed'),
    })
  }

  const handleSave = () => {
    savePost(postId, {
      onSuccess: () => alert('Post saved to your collection'),
      onError: (error: any) => {
        if (error.response?.status === 409) {
          alert('Post already saved')
        }
      },
    })
  }

  const handleShare = () => {
    const quoteContent = prompt('Add a comment (optional):')
    
    sharePost({ postId, quoteContent: quoteContent || undefined }, {
      onSuccess: () => alert('Post shared to your timeline'),
    })
  }

  return (
    <div>
      <button onClick={handleHide}>Hide Post</button>
      <button onClick={handleSave}>Save Post</button>
      <button onClick={handleShare}>Share Post</button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// EXAMPLE 6: Media Management
// ═══════════════════════════════════════════════════════════════════════════

export function MediaManagementExample() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedMediaId, setUploadedMediaId] = useState<string | null>(null)

  const { mutate: uploadMedia, isPending: isUploading } = useUploadMedia()
  const { mutate: deleteMedia, isPending: isDeleting } = useDeleteMedia()

  const handleUpload = () => {
    if (!selectedFile) return

    uploadMedia(selectedFile, {
      onSuccess: (media: any) => {
        setUploadedMediaId(media.id)
        alert(`Media uploaded! ID: ${media.id}`)
      },
      onError: (error: any) => {
        if (error.response?.status === 413) {
          alert('File too large (max 50MB)')
        }
      },
    })
  }

  const handleDelete = () => {
    if (!uploadedMediaId) return

    // ✅ NEW: Uses DELETE /media/:id (not /post/delete-media/:id)
    deleteMedia(uploadedMediaId, {
      onSuccess: () => {
        setUploadedMediaId(null)
        setSelectedFile(null)
        alert('Media deleted')
      },
    })
  }

  return (
    <div>
      <h2>Media Management</h2>
      
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload} disabled={!selectedFile || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadedMediaId && (
        <button onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete Media'}
        </button>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// EXAMPLE 7: Clear Search History
// ═══════════════════════════════════════════════════════════════════════════

export function ClearHistoryExample() {
  const { data: history } = useSearchHistory()
  const { mutate: clearAll } = useClearAllHistory()

  const handleClear = () => {
    if (confirm('Clear all search history?')) {
      // ✅ UPDATED: Now uses DELETE /search-history/history
      clearAll(undefined, {
        onSuccess: () => alert('History cleared'),
      })
    }
  }

  return (
    <div>
      <h2>Search History ({history?.length || 0} items)</h2>
      <button onClick={handleClear}>Clear All History</button>
    </div>
  )
}
