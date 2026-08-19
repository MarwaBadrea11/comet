import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Share2, Bookmark, MoreHorizontal, ThumbsUp, Loader2, Send, Trash2, CornerDownRight, Edit } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { useAvatarUrl } from '../ui/UserAvatar'
import { Button } from '../ui/Button'
import { ReactionButton } from '../ui/ReactionButton'
import { toast } from '../ui/Toast'
import { motionVariants } from '../../lib/theme'
import { usePost, useReactToPost, useSavePost, useUnsavePost, useSavedPosts, useDeletePost } from '../../hooks/usePostsQuery'
import { usePostComments, useCreateComment } from '../../hooks/useCommentsQuery'
import { useMe } from '../../hooks/useUserQuery'
import { useAuthStore } from '../../stores/authStore'
import { EditPostModal } from './EditPostModal'
import { useTranslation } from '../../hooks/useTranslation'
import type { ReactionType } from '../../types'

// Comment authors only carry avatarMediaId (no nested avatarMedia object) —
// resolve the real URL per item so map() stays rules-of-hooks safe.
function CommentAvatar({ name, avatarMediaId, className }: { name?: string; avatarMediaId?: string | null; className?: string }) {
  const src = useAvatarUrl({ name, avatarMediaId })
  return <Avatar src={src} alt={name} size="md" className={className} />
}

export function PostDetailScreen() {
  const t = useTranslation()
  const navigate = useNavigate()
  const { id }   = useParams<{ id: string }>()
  const user     = useAuthStore(s => s.user)
  const { data: profile } = useMe()

  const [newComment, setNewComment] = useState('')
  const [showMenu, setShowMenu] = useState(false)

  // حالات التحكم بالردود محلياً
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  
  // حالة التحكم بمودال التعديل
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // 1. مزامنة وقراءة الـ Local Storage المشترك لضمان بقاء التفاعلات والتعليقات المحلية محميّة
  const [allLocalPosts, setAllLocalPosts] = useState<any[]>(() => {
    const saved = localStorage.getItem('comet_global_local_posts')
    return saved ? JSON.parse(saved) : []
  })

  // تحديث الـ localStorage فوراً عند حدوث أي تعديل محلي
  useEffect(() => {
    localStorage.setItem('comet_global_local_posts', JSON.stringify(allLocalPosts))
  }, [allLocalPosts])

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: serverPost, isLoading, isError, error } = usePost(id ?? '')
  const { data: serverComments = [], isLoading: loadingComments } = usePostComments(id ?? '')

  // ── Mutations ──────────────────────────────────────────────────────────────
  const reactToPost    = useReactToPost()
  const createComment  = useCreateComment()
  const savePost       = useSavePost()
  const unsavePost     = useUnsavePost()
  const deletePost     = useDeletePost()
  const { data: savedPosts = [] } = useSavedPosts()

  // 2. البحث عن المنشور محلياً أولاً، وإذا لم يوجد نعتمد على داتا السيرفر
  const localPost = allLocalPosts.find((p: any) => String(p.id) === String(id))
  const post = localPost || serverPost

  // دمج التعليقات المحلية المضافة داخل الكاش مع تعليقات السيرفر
  const comments = post?.comments && post.comments.length > (serverComments?.length || 0)
    ? post.comments
    : serverComments

  // ── Derived ────────────────────────────────────────────────────────────────
  const isOwnPost = post?.user?.name === user?.name || post?.userId === user?.id
  const isSaved = !!post && savedPosts.some(p => String(p.id) === String(post.id))

  // 🛠️ دالة التفاعل مع البوست (7 أنواع تفاعل مدعومة من الباك)
  const handleReact = (reactionType: ReactionType) => {
    if (!post || !user?.id) return

    setAllLocalPosts(prev => prev.map(p => {
      if (String(p.id) === String(post.id)) {
        const existing = p.reactions?.find((r: any) => r.userId === user.id)
        let updatedReactions
        if (existing && existing.reactionType === reactionType) {
          updatedReactions = (p.reactions || []).filter((r: any) => r.userId !== user.id)
        } else if (existing) {
          updatedReactions = p.reactions.map((r: any) => r.userId === user.id ? { ...r, reactionType } : r)
        } else {
          updatedReactions = [...(p.reactions || []), { id: `local-react-${Date.now()}`, userId: user.id, reactionType }]
        }
        return { ...p, reactions: updatedReactions }
      }
      return p
    }))

    reactToPost.mutate({
      postId: String(post.id),
      userId: user.id,
      reactableType: 'POST',
      reactionType,
    })
  }

  // 🛠️ دالة حفظ/إلغاء حفظ البوست (متصلة فعلياً بالباك)
  const handleToggleSave = () => {
    if (!post) return
    if (isSaved) {
      unsavePost.mutate(String(post.id), {
        onSuccess: () => toast.success(t.postDetail.removedFromSaved),
        onError: () => toast.error(t.postDetail.unsaveFailed),
      })
    } else {
      savePost.mutate(String(post.id), {
        onSuccess: () => toast.success(t.postDetail.postSaved),
        onError: (err: any) => {
          if (err.response?.status === 409) toast.warning(t.postDetail.postAlreadySaved)
          else toast.error(t.postDetail.saveFailed)
        },
      })
    }
  }

  // 🛠️ دالة اللايك للتعليق محلياً
  const handleLikeComment = (commentId: string) => {
    if (!user) return
    setAllLocalPosts(prev => prev.map(p => {
      if (String(p.id) === String(post.id)) {
        return {
          ...p,
          comments: (p.comments || comments).map((c: any) => {
            if (String(c.id) === String(commentId)) {
              const currentLikes = c.likes || []
              const hasLiked = currentLikes.includes(user.id)
              return {
                ...c,
                likes: hasLiked ? currentLikes.filter((uid: string) => uid !== user.id) : [...currentLikes, user.id]
              }
            }
            return c
          })
        }
      }
      return p
    }))
  }

  // 🛠️ دالة إضافة رد على تعليق محلياً
  const handleAddReply = (commentId: string) => {
    if (!replyText.trim() || !user) return

    const newReply = {
      id: `local-reply-${Date.now()}`,
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
      user: {
        name: user.name,
        avatar: user.avatar || ''
      }
    }

    setAllLocalPosts(prev => prev.map(p => {
      if (String(p.id) === String(post.id)) {
        return {
          ...p,
          comments: (p.comments || comments).map((c: any) => {
            if (String(c.id) === String(commentId)) {
              return {
                ...c,
                replies: [...(c.replies || []), newReply]
              }
            }
            return c
          })
        }
      }
      return p
    }))

    setReplyText('')
    setReplyingToCommentId(null)
  }

  // 🛠️ دالة حذف البوست (فعليًا من الباك، مع تنظيف أي نسخة محلية)
  const handleDeletePost = () => {
    if (!post) return
    const postId = String(post.id)

    if (postId.startsWith('local-')) {
      setAllLocalPosts(prev => prev.filter(p => String(p.id) !== postId))
      navigate(-1)
      return
    }

    deletePost.mutate(postId, {
      onSuccess: () => {
        setAllLocalPosts(prev => prev.filter(p => String(p.id) !== postId))
        toast.success(t.postDetail.postDeleted)
        navigate(-1)
      },
      onError: () => {
        toast.error(t.postDetail.deleteFailed)
      },
    })
  }

  // 🛠️ تفعيل زر الشير
  const handleShare = () => {
    if (!post) return
    const postUrl = window.location.href

    if (navigator.share) {
      navigator.share({
        title: `Check out ${post.user?.name}'s post on Comet!`,
        text: post.content,
        url: postUrl,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(postUrl)
      alert(t.postDetail.linkCopiedAlert)
    }
  }

  // 🛠️ إضافة تعليق رئيسي
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !post || !user) return

    const pendingText = newComment.trim()
    const fallbackComment = {
      id: `local-comment-${Date.now()}`,
      content: pendingText,
      createdAt: new Date().toISOString(),
      likes: [],
      replies: [],
      user: {
        name: user.name,
        avatar: user.avatar || ''
      }
    }

    setAllLocalPosts(prev => prev.map(p => {
      if (String(p.id) === String(post.id)) {
        return { ...p, comments: [...(p.comments || []), fallbackComment] }
      }
      return p
    }))

    setNewComment('')

    createComment.mutate(
      { postId: String(post.id), userId: user.id, content: pendingText },
      { 
        onSuccess: (savedComment) => {
          if (savedComment) {
            setAllLocalPosts(prev => prev.map(p => {
              if (String(p.id) === String(post.id)) {
                return { ...p, comments: p.comments.map((c: any) => c.id === fallbackComment.id ? { ...savedComment, likes: [], replies: [] } : c) }
              }
              return p
            }))
          }
        }
      }
    )
  }

  if (isLoading && !localPost) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
  }

  if ((isError || !post) && !localPost) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-on-surface-variant font-medium">{(error as any)?.response?.data?.message ?? t.postDetail.postNotFound}</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>{t.postDetail.goBack}</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 md:px-8">

      {/* Back */}
      <div className="mb-8 md:mb-10 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <span className="text-sm font-medium text-on-surface-variant">{t.postDetail.backToFeed}</span>
      </div>

      {/* Post card */}
      <motion.article {...motionVariants.fadeIn} className="bg-surface-container-lowest rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative mb-12 md:mb-16 shadow-[0_20px_40px_rgba(107,70,192,0.06)] overflow-visible">
        <div className="absolute -top-5 -left-5 h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-surface-container-lowest p-1 shadow-xl">
          <Avatar
            src={post.user?.avatarMedia?.url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(post.user?.name ?? 'User')}`}
            alt={post.user?.name} size="lg" className="rounded-2xl"
          />
        </div>

        <div className="pl-10 md:pl-12">
          <div className="flex justify-between items-start mb-4 md:mb-6">
            <div>
              <h2 className="text-lg md:text-2xl font-bold font-headline text-on-surface">{post.user?.name}</h2>
              <p className="text-on-surface-variant text-xs md:text-sm">
                {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                {post.location && <> · <span className="text-primary">{post.location}</span></>}
              </p>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)} 
                className={`text-on-surface-variant hover:text-primary p-2 hover:bg-surface rounded-xl transition-colors ${showMenu ? 'text-primary bg-surface' : ''}`}
              >
                <MoreHorizontal size={20} />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-xl p-2 z-50"
                    >
                      {isOwnPost ? (
                        <>
                          <button
                            onClick={() => { setShowMenu(false); setIsEditModalOpen(true); }}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 rounded-xl transition-colors mb-1"
                          >
                            <Edit size={16} />
                            {t.postDetail.editPost}
                          </button>
                          <button
                            onClick={() => { setShowMenu(false); handleDeletePost(); }}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={16} />
                            {t.postDetail.deletePost}
                          </button>
                        </>
                      ) : (
                        <p className="text-xs text-on-surface-variant p-2 text-center">{t.postDetail.noActionsAvailable}</p>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="text-base md:text-lg font-body text-on-surface-variant leading-relaxed mb-6 md:mb-10 whitespace-pre-wrap">{post.content}</p>

          {(post.hashtags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.hashtags!.map((t: any) => <span key={t.id} className="text-xs font-extrabold text-primary hover:underline cursor-pointer">#{t.name}</span>)}
            </div>
          )}

          {(post.media?.length ?? 0) > 0 && (
            <div className="rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-10">
              {post.media!.map((m: any) => <img key={m.id} src={m.url} alt="Post media" className="w-full object-cover max-h-[500px]" />)}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 md:gap-8 py-4 md:py-6 border-t border-surface-container-low">
            <ReactionButton
              reactions={post.reactions}
              userId={user?.id}
              onReact={handleReact}
              className="flex items-center gap-2 group cursor-pointer transition-colors text-on-surface-variant hover:text-primary"
            />

            {[
              { icon: <MessageCircle size={20} />, label: String(comments?.length ?? 0), action: () => {} },
              { icon: <Share2 size={20} />, label: t.postDetail.share, action: handleShare },
            ].map((a, i) => (
              <button key={i} onClick={a.action} className="flex items-center gap-2 group cursor-pointer transition-colors text-on-surface-variant hover:text-primary">
                <div className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-full bg-surface-container-low group-hover:bg-primary/10 transition-colors">{a.icon}</div>
                <span className="font-bold text-on-surface text-sm">{a.label}</span>
              </button>
            ))}

            <div className="ml-auto">
              <Button
                variant={isSaved ? 'primary' : 'secondary'}
                size="sm"
                onClick={handleToggleSave}
                disabled={savePost.isPending || unsavePost.isPending}
                icon={
                  savePost.isPending || unsavePost.isPending
                    ? <Loader2 size={16} className="animate-spin" />
                    : <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                }
              >
                {isSaved ? t.postDetail.saved : t.postDetail.save}
              </Button>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Comment input */}
      <form onSubmit={handleSubmitComment} className="mb-8 md:mb-12 flex gap-3 md:gap-4 items-start">
        <Avatar src={profile?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name ?? 'user')}`} alt="Me" size="sm" className="shrink-0 mt-1" />
        <div className="flex-1 bg-surface-container-lowest rounded-2xl border border-outline-variant/15 shadow-sm flex items-end gap-2 px-4 py-3">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder={t.postDetail.addThoughtsPlaceholder}
            className="flex-1 bg-transparent border-none resize-none focus:ring-0 text-sm outline-none min-h-[40px] max-h-24"
            rows={1}
          />
          <button type="submit" disabled={createComment.isPending || !newComment.trim()} className="p-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0">
            {createComment.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </form>

      {/* Comments section */}
      <section>
        <h3 className="text-2xl md:text-3xl font-extrabold font-headline text-on-surface tracking-tight mb-6 md:mb-8">{t.postDetail.theConversation}</h3>

        {loadingComments && comments.length === 0 ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant text-sm bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/20">
            {t.postDetail.noComments}
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 space-y-6 md:space-y-8">
            {comments.map((c: any) => {
              const commentLikes = c.likes || []
              const hasLikedComment = user ? commentLikes.includes(user.id) : false

              return (
                <div key={c.id} className="space-y-4">
                  {/* التعليق الرئيسي */}
                  <div className="flex gap-4 md:gap-6">
                    <CommentAvatar name={c.user?.name} avatarMediaId={c.user?.avatarMediaId} className="rounded-2xl shrink-0" />
                    <div className="flex-1 bg-surface-container-lowest p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-on-surface text-sm">{c.user?.name ?? t.postDetail.anonymous}</span>
                        {c.createdAt && <span className="text-[10px] text-on-surface-variant">{new Date(c.createdAt).toLocaleDateString()}</span>}
                      </div>
                      <p className="text-on-surface-variant leading-relaxed text-sm">{c.content}</p>
                      
                      {/* أزرار تفاعل التعليق */}
                      <div className="mt-3 flex items-center gap-4">
                        <button 
                          onClick={() => handleLikeComment(c.id)}
                          className={`text-xs font-bold flex items-center gap-1 transition-colors ${hasLikedComment ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                        >
                          <ThumbsUp size={13} fill={hasLikedComment ? 'currentColor' : 'none'} />
                          {t.postDetail.like} {commentLikes.length > 0 && `(${commentLikes.length})`}
                        </button>
                        <button
                          onClick={() => {
                            setReplyingToCommentId(replyingToCommentId === c.id ? null : c.id)
                            setReplyText('')
                          }}
                          className="text-on-surface-variant text-xs font-bold hover:text-primary transition-colors"
                        >
                          {t.postDetail.reply}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* شجرة الردود (Replies Nested Thread) */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="pl-12 md:pl-16 space-y-3">
                      {c.replies.map((reply: any) => (
                        <div key={reply.id} className="flex gap-3 items-start">
                          <CornerDownRight size={16} className="text-outline-variant mt-2 shrink-0" />
                          <Avatar src={reply.user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(reply.user?.name ?? 'user')}`} alt={reply.user?.name} size="sm" className="rounded-xl shrink-0" />
                          <div className="flex-1 bg-surface-container-low/60 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-on-surface text-xs">{reply.user?.name}</span>
                              <span className="text-[9px] text-on-surface-variant">{new Date(reply.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-on-surface-variant text-xs leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* حقل إدخال الرد المفتوح المنبثق */}
                  <AnimatePresence>
                    {replyingToCommentId === c.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-12 md:pl-16 overflow-hidden"
                      >
                        <div className="flex gap-2 items-center bg-surface-container-lowest border border-outline-variant/15 p-2 rounded-xl shadow-inner">
                          <input 
                            type="text"
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder={t.postDetail.replyToPlaceholder.replace('{name}', c.user?.name ?? '')}
                            className="flex-1 bg-transparent border-none text-xs outline-none px-2 py-1"
                            onKeyDown={e => { if(e.key === 'Enter') handleAddReply(c.id) }}
                          />
                          <button 
                            onClick={() => handleAddReply(c.id)}
                            disabled={!replyText.trim()}
                            className="p-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-40 transition-all shrink-0"
                          >
                            <Send size={12} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Edit Post Modal */}
      {isEditModalOpen && post && (
        <EditPostModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          postId={String(post.id)}
          onUpdated={() => {
            setIsEditModalOpen(false)
            // Refetch post data
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}