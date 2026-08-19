import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Smile, Clock, Globe, Users, Lock } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { Button } from '../ui/Button'
import { DateTimePicker } from '../ui/DateTimePicker'
import { FileDropzone } from '../ui/FileDropzone'
import { SegmentedControlVertical } from '../ui/SegmentedControl'
import { toast } from '../ui/Toast'
import { motionVariants } from '../../lib/theme'
import { useCreatePost, useSchedulePost } from '../../hooks/usePostsQuery'
import { useAuthStore } from '../../stores/authStore'
import { useMyProfile } from '../../hooks/useUserQuery'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { useTranslation } from '../../hooks/useTranslation'

interface Props {
  open: boolean
  onClose: () => void
  onCreated?: () => void
  groupId?: string
  onSuccess?: () => void
}

type Visibility = 'PUBLIC' | 'FRIENDS' | 'ONLY_ME'

export function CreatePostModal({ open, onClose, onCreated, onSuccess }: Props) {
  const t = useTranslation()
  const queryClient = useQueryClient()
  const user = useAuthStore(s => s.user)
  const { data: profile } = useMyProfile()

  const VISIBILITY_OPTIONS = [
    { value: 'PUBLIC' as const, label: t.createPost.visibilityUniversal, description: t.createPost.visibilityUniversalDesc, icon: <Globe size={18} /> },
    { value: 'FRIENDS' as const, label: t.createPost.visibilityInnerCircle, description: t.createPost.visibilityInnerCircleDesc, icon: <Users size={18} /> },
    { value: 'ONLY_ME' as const, label: t.createPost.visibilityPrivate, description: t.createPost.visibilityPrivateDesc, icon: <Lock size={18} /> },
  ]

  // Get current user's avatar with proper fallback
  const userAvatarUrl = profile?.avatar || user?.avatar
  const displayName = profile?.name || user?.name || 'Me'
  const myAvatarSrc = userAvatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`

  const [content, setContent] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC')
  const [feeling, setFeeling] = useState('')
  const [location, setLocation] = useState('')
  const [mediaIds, setMediaIds] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; file: File; previewUrl?: string }>>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [showScheduler, setShowScheduler] = useState(false)
  const [showVisibilityPicker, setShowVisibilityPicker] = useState(false)
  
  const createPost = useCreatePost()
  const schedulePost = useSchedulePost()

  // Cleanup: Revoke preview URLs when modal closes or component unmounts
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl)
        }
      })
    }
  }, [uploadedFiles])

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return
    setIsUploading(true)
    setUploadError(null) // Clear previous errors
    
    console.log('📤 Starting file upload...', { fileCount: files.length })
    
    try {
      const uploadedIds: string[] = []
      const newUploadedFiles: Array<{ id: string; file: File; previewUrl?: string }> = []
      
      for (const file of files) {
        console.log('📎 Processing file:', { name: file.name, size: file.size, type: file.type })
        
        // Client-side validation: 50MB max
        if (file.size > 50 * 1024 * 1024) {
          const errorMsg = `File "${file.name}" exceeds 50MB limit`
          console.error('❌', errorMsg)
          toast.error(errorMsg)
          continue
        }

        // Create preview URL ONLY for local display during upload
        const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined

        const formData = new FormData()
        // CRITICAL: Append the actual File object, NOT the preview URL
        formData.append('file', file)
        
        console.log('🚀 Uploading file to /media/upload...', file.name)
        
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
          
          console.log('✅ Upload response:', response.data)
          
          // Extract the media ID from backend response
          if (response.data?.id) {
            const mediaId = String(response.data.id)
            uploadedIds.push(mediaId)
            newUploadedFiles.push({
              id: mediaId,
              file,
              previewUrl
            })
            console.log('✅ File uploaded successfully, media ID:', mediaId)
          } else {
            console.error('❌ Upload response missing ID:', response.data)
            toast.error(`Upload failed: No media ID returned for ${file.name}`)
          }
          
          // CRITICAL: Clean up preview URL after successful upload
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
          }
        } catch (err: any) {
          console.error('❌ Upload error:', err)
          console.error('Error response:', err.response)
          
          // Clean up preview URL on error
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
          }
          
          // Handle specific error codes
          const status = err.response?.status
          const message = err.response?.data?.message || err.message
          
          if (status === 413) {
            toast.error(`File "${file.name}" is too large (max 50MB)`)
          } else if (status === 400) {
            toast.error(`Invalid file type: ${file.name}`)
          } else if (status === 401) {
            toast.error('Session expired. Please login again.')
            setUploadError('Authentication required. Please login.')
          } else if (status === 500) {
            toast.error(`Server error uploading ${file.name}`)
            setUploadError('Server error. Please try again later.')
          } else {
            toast.error(`Upload failed: ${file.name} - ${message}`)
            setUploadError(`Upload failed: ${message}`)
          }
        }
      }
      
      if (uploadedIds.length > 0) {
        // Store ONLY the media IDs returned from the server, NOT preview URLs
        setMediaIds(prev => [...prev, ...uploadedIds])
        setUploadedFiles(prev => [...prev, ...newUploadedFiles])
        toast.success(`${uploadedIds.length} ${t.createPost.filesUploaded}`)
        console.log('✅ All files uploaded. Media IDs:', uploadedIds)
      } else {
        console.warn('⚠️ No files were uploaded successfully')
      }
    } catch (err) {
      console.error('❌ Upload process error:', err)
      toast.error(t.createPost.uploadFailedGeneric)
      setUploadError(t.createPost.uploadFailedGeneric)
    } finally {
      setIsUploading(false)
    }
  }

  const handlePost = () => {
    if (!content.trim() && mediaIds.length === 0) {
      toast.warning(t.createPost.needContentWarning)
      return
    }
    const pendingText = content.trim()

    console.log('📝 Creating post with payload:', {
      content: pendingText,
      visibility,
      mediaIds,
      feeling,
      location,
      mediaCount: mediaIds.length
    })

    // Determine if we're scheduling or posting immediately
    const isScheduled = scheduledDate && scheduledDate.getTime() > Date.now()

    if (isScheduled) {
      // Schedule the post
      schedulePost.mutate(
        {
          content: pendingText,
          visibility,
          mediaIds,
          feeling,
          location,
          scheduledAt: scheduledDate.toISOString(),
        },
        {
          onSuccess: () => {
            toast.success(t.createPost.postScheduled)
            setContent('')
            setMediaIds([])
            setUploadedFiles([]) // Clear uploaded files
            setLocation('')
            setFeeling('')
            setScheduledDate(undefined)
            setShowScheduler(false)
            setShowVisibilityPicker(false)
            onClose()
            onCreated?.()
            onSuccess?.()
          },
          onError: (err: any) => {
            if (err.response?.status === 400) {
              toast.error(t.createPost.invalidScheduledData)
            } else {
              toast.error(t.createPost.scheduleFailed)
            }
          }
        }
      )
    } else {
      // Post immediately
      createPost.mutate(
        { content: pendingText, visibility, mediaIds, feeling, location },
        {
          onSuccess: (savedPost) => {
            const saved = localStorage.getItem('comet_global_local_posts')
            const currentLocal = saved ? JSON.parse(saved) : []

            if (savedPost) {
              const updated = [
                { ...savedPost, userId: user?.id, comments: [], reactions: [] },
                ...currentLocal
              ]
              localStorage.setItem('comet_global_local_posts', JSON.stringify(updated))
            } else {
              const fallbackPost = {
                id: `local-${Date.now()}`,
                userId: user?.id,
                content: pendingText,
                type: 'POST',
                createdAt: new Date().toISOString(),
                user: { 
                  name: displayName, 
                  avatar: myAvatarSrc,
                  avatarMedia: myAvatarSrc ? { url: myAvatarSrc } : null
                },
                reactions: [],
                comments: [],
                hashtags: [],
                location: location || undefined
              }
              localStorage.setItem('comet_global_local_posts', JSON.stringify([fallbackPost, ...currentLocal]))
            }

            // 📢 إطلاق الإشارة الكونية لكي تقوم شاشة الهوم فيد بتحديث نفسها فوراً
            window.dispatchEvent(new Event('comet_posts_updated'))

            toast.success(t.createPost.postCreated)
            setContent('')
            setMediaIds([])
            setUploadedFiles([]) // Clear uploaded files
            setLocation('')
            setFeeling('')
            setShowVisibilityPicker(false)
            onClose()
            onCreated?.()
            onSuccess?.()
            queryClient.invalidateQueries({ queryKey: ['feed'] }).catch(() => {})
          },
          onError: (err: any) => {
            // Log the actual error for debugging
            console.error('Post creation failed:', err)
            console.error('Error response:', err.response)
            console.error('Payload was:', { content: pendingText, visibility, mediaIds, feeling, location })
            
            // Show user-friendly error message
            const status = err.response?.status
            const message = err.response?.data?.message || err.message
            
            if (status === 400) {
              toast.error(`Invalid post data: ${message}`)
            } else if (status === 401) {
              toast.error(t.createPost.sessionExpired)
            } else if (status === 413) {
              toast.error(t.createPost.postTooLarge)
            } else if (status === 500) {
              toast.error(t.createPost.serverError)
            } else {
              toast.error(`Failed to create post: ${message || 'Unknown error'}`)
            }
            
            // Create local fallback ONLY if user wants offline support
            // Include mediaIds in the fallback post
            const saved = localStorage.getItem('comet_global_local_posts')
            const currentLocal = saved ? JSON.parse(saved) : []
            
            const fallbackPost = {
              id: `local-${Date.now()}`,
              userId: user?.id,
              content: pendingText,
              type: 'POST',
              createdAt: new Date().toISOString(),
              user: { 
                name: displayName, 
                avatar: myAvatarSrc,
                avatarMedia: myAvatarSrc ? { url: myAvatarSrc } : null
              },
              reactions: [],
              comments: [],
              hashtags: [],
              location: location || undefined,
              // CRITICAL: Include media IDs in fallback post
              mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
              _isLocalOnly: true, // Mark as local-only post
              _failedUpload: true // Mark that this post failed to upload
            }
            localStorage.setItem('comet_global_local_posts', JSON.stringify([fallbackPost, ...currentLocal]))
            
            // 📢 إطلاق الإشارة الكونية حتى في حالة الـ Fallback لضمان الرندر الفوري
            window.dispatchEvent(new Event('comet_posts_updated'))

            // Don't close modal on error - let user retry or fix the issue
            // toast.warning('Post saved locally (offline mode)')
            // setContent('')
            // setMediaIds([])
            // setUploadedFiles([]) // Clear uploaded files
            // setShowVisibilityPicker(false)
            // onClose()
            // onCreated?.()
          }
        }
      )
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div {...motionVariants.modalBackdrop} className="fixed inset-0 z-[100] bg-on-surface/10 backdrop-blur-sm" onClick={onClose} />
          <motion.div {...motionVariants.scaleIn} className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8">
            <div className="bg-surface w-full max-w-4xl max-h-[90vh] rounded-[2rem] flex flex-col overflow-visible border border-outline-variant/15">
              <div className="px-10 py-8 flex items-center justify-between border-b border-outline-variant/10">
                <h2 className="font-headline text-2xl font-bold text-on-surface">{t.createPost.title}</h2>
                <button onClick={onClose}><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-10 py-8">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full h-32 bg-transparent border-none resize-none focus:ring-0 text-lg p-4"
                  placeholder={t.createPost.placeholder}
                />
                
                {/* Upload Error Banner */}
                {uploadError && (
                  <div className="mt-4 p-4 bg-error/10 border border-error/30 rounded-xl text-error text-sm flex items-center justify-between">
                    <span>{uploadError}</span>
                    <button onClick={() => setUploadError(null)} className="text-error hover:text-error/80">
                      <X size={16} />
                    </button>
                  </div>
                )}
                
                {/* Uploaded Media IDs Display */}
                {mediaIds.length > 0 && (
                  <div className="mt-4 p-4 bg-success/10 border border-success/30 rounded-xl">
                    <p className="text-sm font-semibold text-success mb-2">
                      ✓ {mediaIds.length} file(s) uploaded successfully
                    </p>
                    <div className="text-xs text-success/70 font-mono">
                      Media IDs: {mediaIds.join(', ')}
                    </div>
                  </div>
                )}
                
                {/* File Upload Dropzone */}
                <div className="mt-6">
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
                  
                  <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 hover:bg-surface rounded-xl transition-colors text-primary">
                    <Smile size={20} />
                  </button>

                  <button 
                    onClick={() => setShowScheduler(!showScheduler)} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                      scheduledDate ? 'bg-primary/10 text-primary font-medium' : 'text-on-surface-variant hover:bg-surface'
                    }`}
                  >
                    <Clock size={20} /> {scheduledDate ? t.createPost.scheduled : t.createPost.schedule}
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute top-10 left-0 z-[105]">
                      <EmojiPicker onEmojiClick={(e) => { setContent(c => c + e.emoji); setShowEmojiPicker(false) }} />
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

                {/* Scheduler */}
                {showScheduler && (
                  <div className="mt-6 p-4 bg-surface-container rounded-xl border border-outline-variant/15">
                    <DateTimePicker
                      value={scheduledDate}
                      onChange={setScheduledDate}
                      label={t.createPost.schedulePostLabel}
                      placeholder={t.createPost.schedulePlaceholder}
                    />
                  </div>
                )}
              </div>

              <div className="px-10 py-6 border-t flex justify-between">
                <button onClick={onClose} className="text-on-surface-variant">{t.createPost.discard}</button>
                <Button onClick={handlePost} disabled={createPost.isPending || schedulePost.isPending || isUploading}>
                  {createPost.isPending || schedulePost.isPending ? t.createPost.launching : scheduledDate ? t.createPost.schedulePostLabel : t.createPost.postNow}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}