import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Smile, Globe, Users, Lock, Loader2 } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { Button } from '../ui/Button'
import { FileDropzone } from '../ui/FileDropzone'
import { SegmentedControlVertical } from '../ui/SegmentedControl'
import { toast } from '../ui/Toast'
import { motionVariants } from '../../lib/theme'
import { useUpdatePost, usePost } from '../../hooks/usePostsQuery'
import { useAuthStore } from '../../stores/authStore'
import { useMyProfile } from '../../hooks/useUserQuery'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { useTranslation } from '../../hooks/useTranslation'

interface Props {
  open: boolean
  onClose: () => void
  postId: string
  onUpdated?: () => void
}

type Visibility = 'PUBLIC' | 'FRIENDS' | 'ONLY_ME'

export function EditPostModal({ open, onClose, postId, onUpdated }: Props) {
  const t = useTranslation()
  const queryClient = useQueryClient()
  const user = useAuthStore(s => s.user)
  const { data: profile } = useMyProfile()

  const VISIBILITY_OPTIONS = [
    { value: 'PUBLIC' as const, label: t.createPost.visibilityUniversal, description: t.createPost.visibilityUniversalDesc, icon: <Globe size={18} /> },
    { value: 'FRIENDS' as const, label: t.createPost.visibilityInnerCircle, description: t.createPost.visibilityInnerCircleDesc, icon: <Users size={18} /> },
    { value: 'ONLY_ME' as const, label: t.createPost.visibilityPrivate, description: t.createPost.visibilityPrivateDesc, icon: <Lock size={18} /> },
  ]

  // Fetch the existing post data
  const { data: post, isLoading: isLoadingPost } = usePost(postId)
  const updatePost = useUpdatePost()

  // Get current user's avatar with proper fallback
  const userAvatarUrl = profile?.avatar || user?.avatar
  const displayName = profile?.name || user?.name || 'Me'
  const myAvatarSrc = userAvatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`

  const [content, setContent] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC')
  const [feeling, setFeeling] = useState('')
  const [location, setLocation] = useState('')
  const [mediaIds, setMediaIds] = useState<string[]>([])
  const [existingMedia, setExistingMedia] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showVisibilityPicker, setShowVisibilityPicker] = useState(false)

  // Pre-fill the form when post data is loaded
  useEffect(() => {
    if (post) {
      setContent(post.content || '')
      setVisibility((post.visibility as Visibility) || 'PUBLIC')
      setFeeling(post.feeling || '')
      setLocation(post.location || '')
      setExistingMedia(post.media || [])
      setMediaIds(post.media?.map((m: any) => String(m.id)) || [])
    }
  }, [post])

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return
    setIsUploading(true)
    
    try {
      const uploadedIds: string[] = []
      
      for (const file of files) {
        // Client-side validation: 50MB max
        if (file.size > 50 * 1024 * 1024) {
          toast.error(`File "${file.name}" exceeds 50MB limit`)
          continue
        }

        const formData = new FormData()
        formData.append('file', file)
        
        try {
          const response = await api.post('/media/upload', formData, {
            headers: { 
              'Content-Type': 'multipart/form-data',
            },
            transformRequest: [
              (data, headers) => {
                // Remove Content-Type to let browser set it with boundary
                if (headers && data instanceof FormData) {
                  delete headers['Content-Type']
                }
                return data
              },
            ],
          })
          if (response.data?.id) uploadedIds.push(String(response.data.id))
        } catch (err: any) {
          // Handle specific error codes
          if (err.response?.status === 413) {
            toast.error(`File "${file.name}" is too large (max 50MB)`)
          } else if (err.response?.status === 400) {
            toast.error(`Invalid file type: ${file.name}`)
          } else {
            toast.error(`Upload failed: ${file.name}`)
          }
        }
      }
      
      if (uploadedIds.length > 0) {
        setMediaIds(prev => [...prev, ...uploadedIds])
        toast.success(`${uploadedIds.length} ${t.createPost.filesUploaded}`)
      }
    } catch (err) {
      toast.error(t.createPost.uploadFailedGeneric)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveMedia = (mediaId: string) => {
    setMediaIds(prev => prev.filter(id => id !== mediaId))
    setExistingMedia(prev => prev.filter(m => String(m.id) !== mediaId))
  }

  const handleUpdatePost = () => {
    if (!content.trim() && mediaIds.length === 0) {
      toast.warning(t.createPost.needContentWarningUpdate)
      return
    }
    
    const pendingText = content.trim()

    updatePost.mutate(
      { 
        id: postId,
        content: pendingText, 
        visibility, 
        feeling: feeling || undefined,
        location: location || undefined,
      },
      {
        onSuccess: () => {
          toast.success(t.createPost.postUpdated)
          
          // Update local storage if this is a local post
          const saved = localStorage.getItem('comet_global_local_posts')
          if (saved) {
            const localPosts = JSON.parse(saved)
            const updatedPosts = localPosts.map((p: any) => 
              String(p.id) === postId 
                ? { ...p, content: pendingText, visibility, feeling, location, updatedAt: new Date().toISOString() }
                : p
            )
            localStorage.setItem('comet_global_local_posts', JSON.stringify(updatedPosts))
          }
          
          // Trigger global update event
          window.dispatchEvent(new Event('comet_posts_updated'))
          
          onClose()
          onUpdated?.()
          queryClient.invalidateQueries({ queryKey: ['feed'] }).catch(() => {})
          queryClient.invalidateQueries({ queryKey: ['posts', postId] }).catch(() => {})
        },
        onError: (err: any) => {
          if (err.response?.status === 403) {
            toast.error(t.createPost.permissionDenied)
          } else if (err.response?.status === 404) {
            toast.error(t.createPost.postNotFound)
          } else if (err.response?.status === 400) {
            toast.error(t.createPost.invalidPostSettings)
          } else {
            toast.error(t.createPost.updateFailed)
          }
        }
      }
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div {...motionVariants.modalBackdrop} className="fixed inset-0 z-[100] bg-on-surface/10 backdrop-blur-sm" onClick={onClose} />
          <motion.div {...motionVariants.scaleIn} className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8">
            <div className="bg-surface w-full max-w-4xl max-h-[90vh] rounded-[2rem] flex flex-col overflow-visible border border-outline-variant/15">
              <div className="px-10 py-8 flex items-center justify-between border-b border-outline-variant/10">
                <h2 className="font-headline text-2xl font-bold text-on-surface">{t.createPost.editTitle}</h2>
                <button onClick={onClose} className="p-2 hover:bg-surface-variant/10 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              {isLoadingPost ? (
                <div className="flex-1 flex items-center justify-center py-16">
                  <div className="text-center space-y-4">
                    <Loader2 size={32} className="animate-spin mx-auto text-primary" />
                    <p className="text-sm text-on-surface-variant font-medium">{t.createPost.loadingPost}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto px-10 py-8">
                    <textarea
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      className="w-full h-32 bg-transparent border-none resize-none focus:ring-0 text-lg p-4"
                      placeholder={t.createPost.placeholder}
                    />
                    
                    {/* Existing Media Preview */}
                    {existingMedia.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h4 className="text-sm font-bold text-on-surface">{t.createPost.currentMedia}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {existingMedia.map((media) => (
                            <div key={media.id} className="relative group">
                              <img 
                                src={media.url} 
                                alt="Post media" 
                                className="w-full h-32 object-cover rounded-xl border border-outline-variant/10"
                              />
                              <button
                                onClick={() => handleRemoveMedia(String(media.id))}
                                className="absolute top-2 right-2 bg-error text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* File Upload Dropzone */}
                    <div className="mt-6">
                      <h4 className="text-sm font-bold text-on-surface mb-3">{t.createPost.addNewMedia}</h4>
                      <FileDropzone
                        onFilesSelected={handleFilesSelected}
                        maxSize={50 * 1024 * 1024}
                        accept="image/*,video/*"
                        multiple={true}
                        maxFiles={10}
                      />
                    </div>

                    <div className="flex gap-4 mt-6 items-center relative">
                      <button 
                        onClick={() => setShowVisibilityPicker(!showVisibilityPicker)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                          showVisibilityPicker ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface'
                        }`}
                      >
                        {VISIBILITY_OPTIONS.find(v => v.value === visibility)?.icon}
                        <span className="text-sm font-medium">
                          {VISIBILITY_OPTIONS.find(v => v.value === visibility)?.label}
                        </span>
                      </button>
                      
                      <button 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                        className="p-2 hover:bg-surface rounded-xl transition-colors text-primary"
                      >
                        <Smile size={20} />
                      </button>

                      {showEmojiPicker && (
                        <div className="absolute top-10 left-0 z-[105]">
                          <EmojiPicker 
                            onEmojiClick={(e) => { 
                              setContent(c => c + e.emoji); 
                              setShowEmojiPicker(false) 
                            }} 
                          />
                        </div>
                      )}
                    </div>

                    {/* Visibility Picker */}
                    {showVisibilityPicker && (
                      <div className="mt-6 p-4 bg-surface-container rounded-xl border border-outline-variant/15">
                        <h4 className="text-sm font-bold text-on-surface mb-4">{t.createPost.whoCanSee}</h4>
                        <SegmentedControlVertical
                          value={visibility}
                          onChange={(val) => setVisibility(val as Visibility)}
                          options={VISIBILITY_OPTIONS}
                        />
                      </div>
                    )}

                    {/* Additional Fields */}
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-on-surface mb-2">{t.createPost.feelingLabel}</label>
                        <input
                          type="text"
                          value={feeling}
                          onChange={(e) => setFeeling(e.target.value)}
                          placeholder={t.createPost.feelingPlaceholder}
                          className="w-full px-4 py-2 bg-surface-container border border-outline-variant/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-on-surface mb-2">{t.createPost.locationLabel}</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder={t.createPost.locationPlaceholder}
                          className="w-full px-4 py-2 bg-surface-container border border-outline-variant/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-10 py-6 border-t flex justify-between">
                    <button 
                      onClick={onClose} 
                      className="text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                      {t.common.cancel}
                    </button>
                    <Button
                      onClick={handleUpdatePost}
                      disabled={updatePost.isPending || isUploading}
                    >
                      {updatePost.isPending ? t.createPost.saving : t.createPost.saveChanges}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
