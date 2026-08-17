import { useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, Loader2, Users, FileText } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { UserActions } from '../ui/UserActions'
import { toast } from '../ui/Toast'
import { useMe, useUpdateProfile, useUserById } from '../../hooks/useUserQuery'
import { usePostsByUsername } from '../../hooks/usePostsQuery'
import { useAuthStore } from '../../stores/authStore'
import { mediaService } from '../../services/media'

const TABS = ['Portfolio']

export function ProfileScreen() {
  const { userId } = useParams<{ userId?: string }>()
  const navigate = useNavigate()
  const currentUser = useAuthStore(s => s.user)

  const [tab, setTab]               = useState('Portfolio')
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  // ── Queries ────────────────────────────────────────────────────────────────
  const isOwnProfile = !userId || userId === currentUser?.id
  const { data: myProfile, isLoading: loadingMe } = useMe({ enabled: isOwnProfile })
  const { data: otherProfile, isLoading: loadingOther } = useUserById(userId ?? '', { enabled: !isOwnProfile })
  
  const profile = isOwnProfile ? myProfile : otherProfile
  const isLoading = isOwnProfile ? loadingMe : loadingOther
  
  const { data: posts = [], isLoading: loadingPosts } = usePostsByUsername(profile?.username ?? '')
  const updateProfile = useUpdateProfile()

  const displayName = profile?.name ?? currentUser?.name ?? 'Comet User'
  const avatarSrc   = profile?.avatar
    ?? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`
  const coverSrc = profile?.coverMedia?.url

  // Debug: Log profile data to verify cover image
  if (profile) {
    console.log('📸 Profile Data:', {
      hasProfile: !!profile,
      hasCoverMedia: !!profile.coverMedia,
      coverUrl: profile.coverMedia?.url || 'none',
      coverMediaId: profile.coverMedia?.id || 'none'
    })
  }

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setIsUploadingAvatar(true)
    try {
      const media = await mediaService.upload(file)
      updateProfile.mutate(
        { avatarMediaId: media.id },
        {
          onSuccess: () => toast.success('Profile picture updated!'),
          onError: () => toast.error('Failed to save profile picture. Please try again.'),
        },
      )
    } catch {
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Cover */}
      <section className="relative h-[460px] w-full overflow-hidden">
        {/* Cover Image or Gradient Fallback */}
        {coverSrc ? (
          <img 
            src={coverSrc} 
            alt="Cover" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to gradient if image fails to load
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/40 via-[#6B46C0]/60 to-[#00D4FF]/30" />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
      </section>

      <div className="px-6 md:px-16 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-12">
          <div className="relative group">
            <Avatar src={avatarSrc} alt={displayName} size="xl" ring ringVariant="gradient" className="!w-32 !h-32 md:!w-48 md:!h-48" />
            {isOwnProfile && (
              <>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/40 transition-colors"
                  aria-label="Change profile picture"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </>
            )}
          </div>
          <div className="pb-0 md:pb-6 flex-1">
            <h1 className="text-3xl md:text-6xl font-bold font-headline tracking-tighter text-on-surface mb-2">{displayName}</h1>
            {(profile?.city || profile?.country) && (
              <p className="text-sm md:text-base text-on-surface-variant">{[profile?.city, profile?.country].filter(Boolean).join(', ')}</p>
            )}
            {isOwnProfile && profile?.email && <p className="text-sm text-on-surface-variant/70 mt-1">{profile.email}</p>}
            
            {/* Stats Metrics */}
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-lg font-bold text-on-surface">{loadingPosts ? '…' : posts.length}</span>
                <span className="text-sm text-on-surface-variant">Posts</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-lg font-bold text-on-surface">{profile?.friendsCount ?? 0}</span>
                <span className="text-sm text-on-surface-variant">Friends</span>
              </div>
            </div>
          </div>
          <div className="pb-0 md:pb-6 flex gap-3">
            {isOwnProfile ? (
              <>
                <Button variant="primary" size="md" onClick={() => navigate('/profile/edit')}>
                  Edit Profile
                </Button>
                <Button variant="secondary" size="md">Share</Button>
              </>
            ) : profile?.id ? (
              <UserActions userId={profile.id} />
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mt-12 md:mt-20">
          {/* Gallery */}
          <div className="lg:col-span-12 pb-20">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div className="flex gap-4 md:gap-8">
                {TABS.map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`pb-2 font-bold transition-colors ${tab === t ? 'text-on-surface border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {loadingPosts ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant/20">
                <p className="text-on-surface-variant text-sm font-medium">No posts yet. Start sharing!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                {posts.map(post => (
                  <motion.div key={post.id} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="group relative rounded-[2rem] overflow-hidden aspect-square bg-gradient-to-br from-primary/20 to-[#00D4FF]/10 cursor-pointer">
                    {post.media?.[0] ? (
                      <img src={post.media[0].url} alt={post.content ?? ''} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <p className="text-xs font-medium text-on-surface-variant text-center line-clamp-4">{post.content}</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4 flex flex-col justify-end">
                      <p className="text-white text-xs font-bold line-clamp-2">{post.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-1/2 -left-32 w-64 h-64 bg-[#00677e]/10 rounded-full blur-[80px] pointer-events-none" />
    </div>
  )
}
