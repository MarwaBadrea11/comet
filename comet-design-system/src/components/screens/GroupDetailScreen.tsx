import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Loader2, Plus, Heart, MessageCircle, MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { toast } from '../ui/Toast'
import { useGroup, useGroupPosts, useJoinGroup, useLeaveGroup } from '../../hooks/useGroupsQuery'
import { useAuthStore } from '../../stores/authStore'
import { CreatePostModal } from './CreatePostModal'

export function GroupDetailScreen() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const [showCreatePost, setShowCreatePost] = useState(false)
  const user = useAuthStore(s => s.user)

  const { data: group, isLoading: groupLoading, isError: groupError } = useGroup(groupId!)
  const { data: posts = [], isLoading: postsLoading, isError: postsError, refetch: refetchPosts } = useGroupPosts(groupId!)
  const joinGroup = useJoinGroup()
  const leaveGroup = useLeaveGroup()

  const isMember = group?.role != null
  const isLoading = groupLoading || postsLoading

  const handleJoin = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!groupId) return

    joinGroup.mutate(groupId, {
      onSuccess: () => {
        toast.success('Joined group successfully!')
      },
      onError: (error: any) => {
        if (error?.response?.status === 409) {
          toast.info('You are already a member of this group')
        } else {
          const message = error?.response?.data?.message || error?.message || 'Failed to join group'
          toast.error(message)
        }
      },
    })
  }

  const handleLeave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!groupId) return
    if (!window.confirm('Are you sure you want to leave this group?')) return

    leaveGroup.mutate(groupId, {
      onSuccess: () => {
        toast.success('Left group successfully')
        navigate('/groups')
      },
      onError: () => toast.error('Failed to leave group'),
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#f8f9ff]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-on-surface-variant">Loading group...</p>
      </div>
    )
  }

  if (groupError || !group) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#f8f9ff] p-4">
        <p className="text-red-500 font-semibold">Failed to load group</p>
        <Button variant="secondary" onClick={() => navigate('/groups')}>
          Back to Groups
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Header with back button */}
      <div className="bg-white border-b border-outline-variant/10 sticky top-16 lg:top-20 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/groups')}
            className="p-2 hover:bg-surface rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-headline text-xl font-bold text-on-surface flex-1">
            {group.name}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Group Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/15 shadow-sm mb-6"
        >
          {/* Group Avatar & Info */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-[#00D4FF]/10 flex items-center justify-center shrink-0">
              <Users size={32} className="text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-2">
                {group.name}
              </h2>
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                {group.description || 'No description available.'}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <Users size={16} />
                <span className="font-semibold">{group.membersCount ?? 0} members</span>
                {group.role && (
                  <>
                    <span className="text-outline-variant">•</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                      {group.role}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              {isMember ? (
                <>
                  <Button
                    variant="primary"
                    onClick={() => setShowCreatePost(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Create Post
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleLeave}
                    disabled={leaveGroup.isPending}
                    className="text-red-500 hover:bg-red-50"
                  >
                    {leaveGroup.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Leave'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleJoin}
                  disabled={joinGroup.isPending}
                  className="flex items-center gap-2"
                >
                  {joinGroup.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Join Group'}
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Posts Section */}
        <div className="space-y-4">
          <h3 className="font-headline text-xl font-bold text-on-surface px-2">
            Group Posts
          </h3>

          {postsError && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center text-sm text-red-500 font-semibold">
              Failed to load posts
              <button onClick={() => refetchPosts()} className="block mx-auto mt-1 text-xs text-primary underline">
                Retry
              </button>
            </div>
          )}

          {!isMember && posts.length === 0 && (
            <div className="text-center py-12 bg-white/60 rounded-2xl border-2 border-dashed border-outline-variant/30">
              <Users className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-3" />
              <p className="text-on-surface-variant text-sm font-medium mb-2">
                Join this group to see posts
              </p>
              <p className="text-xs text-on-surface-variant/60">
                Group content is only visible to members
              </p>
            </div>
          )}

          {isMember && posts.length === 0 && (
            <div className="text-center py-12 bg-white/60 rounded-2xl border-2 border-dashed border-outline-variant/30">
              <p className="text-on-surface-variant text-sm font-medium mb-2">
                No posts yet
              </p>
              <p className="text-xs text-on-surface-variant/60 mb-4">
                Be the first to share something!
              </p>
              <Button variant="primary" size="sm" onClick={() => setShowCreatePost(true)}>
                Create Post
              </Button>
            </div>
          )}

          {posts.map((post: any) => {
            const isLiked = post.reactions?.some((r: any) => r.userId === user?.id)
            const comments = post.comments || []

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden cursor-pointer"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <div className="p-4 md:p-6 flex justify-between items-center">
                  <div className="flex gap-3 md:gap-4 items-center">
                    <img
                      src={post.user?.avatarMedia?.url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(post.user?.name ?? 'User')}`}
                      alt={post.user?.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-sm border border-outline-variant/10"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <h3 className="font-bold text-on-surface text-sm md:text-base leading-tight">
                          {post.user?.name || 'Anonymous'}
                        </h3>
                        <Badge variant="secondary" className="text-[9px] md:text-[10px] h-3.5 md:h-4 px-1 font-bold">
                          Member
                        </Badge>
                      </div>
                      <span className="text-[10px] md:text-xs text-on-surface-variant/70 mt-0.5 inline-block">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>

                  <button className="text-on-surface-variant/50 hover:text-on-surface p-1.5 hover:bg-surface rounded-xl transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="px-4 md:px-6 pb-4 text-on-surface text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </div>

                {(post.media?.length ?? 0) > 0 && (
                  <div className="px-4 md:px-6 pb-4">
                    <div className="rounded-xl md:rounded-2xl overflow-hidden">
                      {post.media!.map((m: any) => (
                        <img key={m.id} src={m.url} alt="Post media" className="w-full object-cover max-h-[420px]" />
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-2 md:p-3 px-4 md:px-6 flex justify-between items-center border-t border-outline-variant/5 text-[11px] font-bold text-on-surface-variant/80">
                  <div className="flex gap-1 md:gap-2 items-center">
                    <button
                      className={`flex items-center gap-1.5 p-2 hover:bg-surface rounded-xl transition-all ${
                        isLiked ? 'text-red-500' : 'hover:text-red-500'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                      <span>{post.reactions?.length ?? 0}</span>
                    </button>
                    <button
                      className="flex items-center gap-1.5 p-2 hover:bg-surface hover:text-primary rounded-xl transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle size={18} />
                      <span>{comments.length}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePostModal
          open={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          groupId={groupId}
          onSuccess={() => {
            setShowCreatePost(false)
            refetchPosts()
          }}
        />
      )}
    </div>
  )
}
