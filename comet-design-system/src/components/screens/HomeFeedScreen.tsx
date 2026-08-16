import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, MoreHorizontal, Plus, Image, Smile, Send, CornerDownRight, ChevronDown, Bookmark, EyeOff, Share2 } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { useAvatarUrl } from '../ui/UserAvatar'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { DropdownMenu } from '../ui/DropdownMenu'
import { toast } from '../ui/Toast'
import { motionVariants } from '../../lib/theme'
import { useFeed, useCreatePost, useReactToPost, useSavePost, useHidePost } from '../../hooks/usePostsQuery'
import { useStoriesFeed } from '../../hooks/useStoriesQuery'
import { useMe } from '../../hooks/useUserQuery'
import { useAuthStore } from '../../stores/authStore'
import { useQueryClient } from '@tanstack/react-query'

import { CreateStoryModal } from './CreateStoryModal'

const COSMIC_EMOJIS = ['✨', '🚀', '🪐', '🌌', '☄️', '🔮', '💜', '😎', '😂', '🔥', '👀', '💯']

// Story authors only carry avatarMediaId (no nested avatarMedia object) —
// resolve the real URL per item so map() stays rules-of-hooks safe.
function StoryRingAvatar({ name, avatarMediaId }: { name?: string; avatarMediaId?: string | null }) {
  const src = useAvatarUrl({ name, avatarMediaId })
  return <img src={src} alt={name} className="w-full h-full rounded-full object-cover border-2 border-white" />
}

export function HomeFeedScreen() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore(s => s.user)

  // ── States ────────────────────────────────────────────────────────────────
  const [newPostContent, setNewPostContent] = useState('')
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [expandedCommentReplies, setExpandedCommentReplies] = useState<Record<string, boolean>>({})
  
  // 🌟 إضافة ستيت التحكم بمودال الستوري
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false)

  // ── Local Storage Management (posts only — offline-first fallback) ────────
  const [allLocalPosts, setAllLocalPosts] = useState<any[]>(() => {
    const saved = localStorage.getItem('comet_global_local_posts')
    return saved ? JSON.parse(saved) : []
  })

  // ── API Hooks ──────────────────────────────────────────────────────────────
  const { data: profile } = useMe()
  const { data: feed = [], isLoading } = useFeed()
  const { data: storyGroups = [] } = useStoriesFeed()
  const createPost = useCreatePost()
  const reactToPost = useReactToPost()
  const savePost = useSavePost()
  const hidePost = useHidePost()

  // ── Data Merging (Local + Server) ──────────────────────────────────────────
  const currentAccountLocalPosts = allLocalPosts.filter((p: any) => p.userId === user?.id)
  const posts = [
    ...currentAccountLocalPosts,
    ...feed.filter((sp: any) => !currentAccountLocalPosts.some(lp => String(lp.id) === String(sp.id)))
  ]

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('comet_global_local_posts', JSON.stringify(allLocalPosts))
  }, [allLocalPosts])

  useEffect(() => {
    const handleGlobalPostsUpdate = () => {
      const saved = localStorage.getItem('comet_global_local_posts')
      if (saved) setAllLocalPosts(JSON.parse(saved))
    }

    window.addEventListener('comet_posts_updated', handleGlobalPostsUpdate)

    return () => {
      window.removeEventListener('comet_posts_updated', handleGlobalPostsUpdate)
    }
  }, [])

  // ── Handlers ───────────────────────────────────────────────────────────────
  const toggleReplies = (commentId: string) => {
    setExpandedCommentReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }))
  }

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostContent.trim() || createPost.isPending) return
    const pendingText = newPostContent.trim()

    createPost.mutate(
      { content: pendingText, visibility: 'PUBLIC' },
      { 
        onSuccess: (savedPost) => {
          setNewPostContent('')
          if (savedPost) {
            setAllLocalPosts(prev => [{ ...savedPost, userId: user?.id, comments: [], reactions: [] }, ...prev])
          } else {
            const fallbackPost = {
              id: `local-${Date.now()}`,
              userId: user?.id,
              content: pendingText,
              type: 'POST',
              createdAt: new Date().toISOString(),
              user: { name: user?.name || 'Me', avatar: user?.avatar || '' },
              reactions: [],
              comments: [],
              hashtags: []
            }
            setAllLocalPosts(prev => [fallbackPost, ...prev])
          }
          queryClient.invalidateQueries({ queryKey: ['feed'] }).catch(() => {})
        },
        onError: () => {
          const fallbackPost = {
            id: `local-${Date.now()}`,
            userId: user?.id,
            content: pendingText,
            type: 'POST',
            createdAt: new Date().toISOString(),
            user: { name: user?.name || 'Me', avatar: user?.avatar || '' },
            reactions: [],
            comments: [],
            hashtags: []
          }
          setAllLocalPosts(prev => [fallbackPost, ...prev])
          setNewPostContent('')
        }
      },
    )
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewPostContent(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleReact = (postId: string) => {
    if (!user?.id) return
    setAllLocalPosts(prev => prev.map(post => {
      if (String(post.id) === postId) {
        const hasReacted = post.reactions?.some((r: any) => r.userId === user.id)
        const updatedReactions = hasReacted
          ? post.reactions.filter((r: any) => r.userId !== user.id)
          : [...(post.reactions || []), { id: `react-${Date.now()}`, userId: user.id }]
        return { ...post, reactions: updatedReactions }
      }
      return post
    }))
    reactToPost.mutate({ postId: String(postId), userId: user.id, reactableType: 'POST', reactionType: 'LIKE' })
  }

  const handleSavePost = (postId: string) => {
    savePost.mutate(String(postId), {
      onSuccess: () => {
        toast.success('Post saved successfully!')
      },
      onError: (err: any) => {
        if (err.response?.status === 409) {
          toast.warning('Post already saved')
        } else {
          toast.error('Failed to save post')
        }
      }
    })
  }

  const handleHidePost = (postId: string) => {
    hidePost.mutate(String(postId), {
      onSuccess: () => {
        // Remove from local state
        setAllLocalPosts(prev => prev.filter(p => String(p.id) !== String(postId)))
        toast.success('Post hidden from your feed')
      },
      onError: () => {
        toast.error('Failed to hide post')
      }
    })
  }

  const handleSharePost = (postId: string) => {
    // Copy link to clipboard
    const link = `${window.location.origin}/post/${postId}`
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Link copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy link')
    })
  }

  const handleAddComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault()
    if (!commentText.trim() || !user) return
    const newComment = {
      id: `comment-${Date.now()}`,
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
      likes: [],
      replies: [],
      user: { name: user.name, avatar: user.avatar || '' }
    }
    setAllLocalPosts(prev => prev.map(post => {
      if (String(post.id) === postId) return { ...post, comments: [...(post.comments || []), newComment] }
      return post
    }))
    setCommentText('')
  }

  const avatarSeed = encodeURIComponent(user?.name ?? 'user')
  const myAvatarSrc = profile?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`

  return (
    <div className="min-h-screen bg-[#f8f9ff] py-4 md:py-12 px-4 sm:px-6 md:px-8 lg:px-12 overflow-x-hidden select-none">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 items-start">

        {/* ── Main column ── */}
        <div className="w-full lg:col-span-2 space-y-6 md:space-y-8 overflow-hidden">

          {/* ── Stories strip ── */}
          <div className="flex gap-4 md:gap-5 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x w-full">
            
            {/* زر إضافة ستوري جديدة */}
            <div 
              onClick={() => setIsStoryModalOpen(true)} 
              className="flex flex-col items-center flex-shrink-0 cursor-pointer group snap-start"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-[#6B46C0] to-[#00D4FF] p-[2px] transition-transform group-hover:scale-105 shadow-sm">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Plus size={24} className="text-primary" />
                </div>
              </div>
              <span className="text-[11px] md:text-xs font-bold text-on-surface-variant mt-1.5">Add Story</span>
            </div>

            {/* عرض الستوريز (مجمّعة حسب صاحبها) */}
            {storyGroups.map(group => (
              <div
                key={group.user.id}
                onClick={() => navigate('/stories', { state: { startAuthorId: group.user.id } })}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer group snap-start"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-[#6B46C0] via-[#8E5EFF] to-[#00D4FF] p-[2px] transition-transform group-hover:scale-105 shadow-md">
                  <StoryRingAvatar name={group.user.name} avatarMediaId={group.user.avatarMediaId} />
                </div>
                <span className="text-[11px] md:text-xs font-bold text-on-surface mt-1.5 max-w-[65px] md:max-w-[80px] truncate">
                  {group.user.name || 'Anonymous'}
                </span>
              </div>
            ))}
          </div>

          {/* ── Create Post Box ── */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl md:rounded-[2rem] p-4 md:p-6 border border-white/60 shadow-sm">
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="flex gap-3 md:gap-4 items-start">
                <Avatar src={myAvatarSrc} alt="Me" size="sm" className="md:w-12 md:h-12" />
                <textarea
                  value={newPostContent}
                  onChange={e => setNewPostContent(e.target.value)}
                  placeholder="Share your celestial thoughts..."
                  className="w-full bg-transparent border-none resize-none focus:outline-none text-on-surface placeholder-on-surface-variant/50 pt-1.5 min-h-[60px] md:min-h-[80px] text-sm md:text-base"
                />
              </div>
              <div className="h-px bg-outline-variant/20" />
              <div className="flex justify-between items-center">
                <div className="flex gap-0.5 md:gap-1 text-on-surface-variant/70 relative items-center">
                  <button type="button" className="p-2 hover:bg-surface rounded-xl transition-colors hover:text-primary"><Image size={20} /></button>
                  <div className="relative">
                    <button 
                      type="button" 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`p-2 hover:bg-surface rounded-xl transition-colors hover:text-primary ${showEmojiPicker ? 'text-primary bg-surface/80' : ''}`}
                    >
                      <Smile size={20} />
                    </button>
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full left-0 mb-3 p-2 bg-white/95 backdrop-blur-md border border-outline-variant/20 rounded-2xl shadow-xl z-50 grid grid-cols-4 gap-1.5 w-44"
                          >
                            {COSMIC_EMOJIS.map(emoji => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => handleEmojiSelect(emoji)}
                                className="text-lg hover:bg-primary/10 p-1.5 rounded-xl transition-all active:scale-90"
                              >
                                {emoji}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <Button type="submit" disabled={createPost.isPending || !newPostContent.trim()} className="px-4 md:px-6 h-9 md:h-11 rounded-xl shadow-md bg-gradient-to-r from-[#6B46C0] to-[#8E5EFF] text-white hover:opacity-90">
                  {createPost.isPending ? 'Launching...' : 'Launch'}
                </Button>
              </div>
            </form>
          </div>

          {/* ── Loading State ── */}
          {isLoading && posts.length === 0 && (
            <div className="text-center py-16 space-y-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-on-surface-variant font-semibold">Traversing the cosmos...</p>
            </div>
          )}

          {/* ── Feed List ── */}
          {posts.length > 0 && (
            <div className="space-y-4 md:space-y-6">
              {posts.map(post => {
                const isLiked = post.reactions?.some((r: any) => r.userId === user?.id)
                const isCommentSectionOpen = activeCommentPostId === String(post.id)
                const comments = post.comments || []

                return (
                  <motion.div key={post.id} {...motionVariants.scaleIn} className="bg-white rounded-2xl md:rounded-[2rem] border border-outline-variant/10 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
                    <div className="p-4 md:p-6 flex justify-between items-center">
                      <div className="flex gap-3 md:gap-4 items-center cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                        <img src={post.user?.avatarMedia?.url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(post.user?.name ?? 'User')}`} alt={post.user?.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-sm border border-outline-variant/10" />
                        <div>
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <h3 className="font-bold text-on-surface text-sm md:text-base leading-tight">{post.user?.name || 'Anonymous'}</h3>
                            <Badge variant="secondary" className="text-[9px] md:text-[10px] h-3.5 md:h-4 px-1 font-bold">Curator</Badge>
                          </div>
                          <span className="text-[10px] md:text-xs text-on-surface-variant/70 mt-0.5 inline-block">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}</span>
                        </div>
                      </div>
                      
                      {/* Dropdown Menu */}
                      <DropdownMenu>
                        <DropdownMenu.Trigger>
                          <button className="text-on-surface-variant/50 hover:text-on-surface p-1.5 hover:bg-surface rounded-xl transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content align="right">
                          <DropdownMenu.Item 
                            onClick={() => handleSavePost(String(post.id))}
                            icon={<Bookmark size={16} />}
                          >
                            Save Post
                          </DropdownMenu.Item>
                          <DropdownMenu.Item 
                            onClick={() => handleHidePost(String(post.id))}
                            icon={<EyeOff size={16} />}
                          >
                            Hide Post
                          </DropdownMenu.Item>
                          <DropdownMenu.Item 
                            onClick={() => handleSharePost(String(post.id))}
                            icon={<Share2 size={16} />}
                          >
                            Share
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
                    </div>

                    <div className="px-4 md:px-6 pb-4 text-on-surface text-sm md:text-base leading-relaxed whitespace-pre-wrap cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>{post.content}</div>

                    {(post.media?.length ?? 0) > 0 && (
                      <div className="px-4 md:px-6 pb-4 cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                        <div className="rounded-xl md:rounded-2xl overflow-hidden">
                          {post.media!.map((m: any) => (
                            <img key={m.id} src={m.url} alt="Post media" className="w-full object-cover max-h-[420px]" />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-2 md:p-3 px-4 md:px-6 flex justify-between items-center border-t border-outline-variant/5 text-[11px] font-bold text-on-surface-variant/80">
                      <div className="flex gap-1 md:gap-2 items-center">
                        <button onClick={() => handleReact(String(post.id))} className={`flex items-center gap-1.5 p-2 hover:bg-surface rounded-xl transition-all active:scale-95 group ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
                          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                          <span>{post.reactions?.length ?? 0}</span>
                        </button>
                        <button onClick={() => setActiveCommentPostId(isCommentSectionOpen ? null : String(post.id))} className={`flex items-center gap-1.5 p-2 hover:bg-surface hover:text-primary rounded-xl transition-all active:scale-95 ${isCommentSectionOpen ? 'text-primary' : ''}`}>
                          <MessageCircle size={18} />
                          <span>{comments.length}</span>
                        </button>
                      </div>
                    </div>

                    {/* ── Comments Section ── */}
                    <AnimatePresence>
                      {isCommentSectionOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-outline-variant/10 bg-slate-50/50 p-4 space-y-4">
                          <div className="space-y-4 max-h-[320px] overflow-y-auto no-scrollbar">
                            {comments.map((comment: any) => {
                              const hasReplies = comment.replies && comment.replies.length > 0
                              const isRepliesOpen = !!expandedCommentReplies[comment.id]
                              return (
                                <div key={comment.id} className="space-y-2">
                                  <div className="flex gap-3 items-start text-xs">
                                    <Avatar src={comment.user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(comment.user?.name || 'Anonymous')}`} size="sm" className="w-7 h-7" />
                                    <div className="flex-1">
                                      <div className="bg-white p-2.5 rounded-xl border border-outline-variant/10 shadow-sm inline-block max-w-[95%]">
                                        <span className="font-bold text-on-surface block mb-0.5">{comment.user?.name}</span>
                                        <p className="text-on-surface-variant leading-relaxed">{comment.content}</p>
                                      </div>
                                      {hasReplies && (
                                        <button onClick={() => toggleReplies(comment.id)} className="flex items-center gap-1 mt-1 text-[10px] font-extrabold text-primary hover:underline transition-all">
                                          <ChevronDown size={12} className={`transition-transform duration-200 ${isRepliesOpen ? 'rotate-180' : ''}`} />
                                          <span>{isRepliesOpen ? 'إخفاء الردود' : `عرض الردود (${comment.replies.length})`}</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <AnimatePresence>
                                    {hasReplies && isRepliesOpen && (
                                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-9 space-y-2 overflow-hidden">
                                        {comment.replies.map((reply: any) => (
                                          <div key={reply.id} className="flex gap-2 items-start text-[11px]">
                                            <CornerDownRight size={13} className="text-outline-variant mt-1.5 shrink-0" />
                                            <Avatar src={reply.user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(reply.user?.name ?? 'user')}`} size="sm" className="h-5 w-5 rounded-lg shrink-0" />
                                            <div className="flex-1 bg-white/70 p-2 rounded-xl border border-outline-variant/5 shadow-sm">
                                              <span className="font-bold text-on-surface block mb-0.5">{reply.user?.name}</span>
                                              <p className="text-on-surface-variant">{reply.content}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )
                            })}
                          </div>
                          <form onSubmit={(e) => handleAddComment(e, String(post.id))} className="flex gap-2 items-center pt-2 border-t border-outline-variant/5">
                            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a cosmic comment..." className="w-full bg-white border border-outline-variant/20 rounded-xl px-3 h-9 text-xs focus:outline-none focus:border-primary shadow-sm" />
                            <button type="submit" disabled={!commentText.trim()} className="p-2 bg-primary text-white rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"><Send size={14} /></button>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Story Modal Registration ── */}
      <CreateStoryModal 
        open={isStoryModalOpen} 
        onClose={() => setIsStoryModalOpen(false)} 
      />

    </div>
  )
}