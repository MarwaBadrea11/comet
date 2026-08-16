import { useState } from 'react'
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

interface Props {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

const VISIBILITY_OPTIONS = [
  { value: 'PUBLIC' as const, label: 'Universal', description: 'Visible to every curator in the galaxy.', icon: <Globe size={18} /> },
  { value: 'FRIENDS' as const, label: 'Inner Circle', description: 'Only shared with your trusted satellite groups.', icon: <Users size={18} /> },
  { value: 'ONLY_ME' as const, label: 'Private Drift', description: 'Stored in your personal archive only.', icon: <Lock size={18} /> },
]

type Visibility = typeof VISIBILITY_OPTIONS[number]['value']

export function CreatePostModal({ open, onClose, onCreated }: Props) {
  const queryClient = useQueryClient()
  const user = useAuthStore(s => s.user)
  const { data: profile } = useMyProfile()

  // Get current user's avatar with proper fallback
  const userAvatarUrl = profile?.avatar || user?.avatar
  const displayName = profile?.name || user?.name || 'Me'
  const myAvatarSrc = userAvatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`

  const [content, setContent] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC')
  const [feeling, setFeeling] = useState('')
  const [location, setLocation] = useState('')
  const [mediaIds, setMediaIds] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [showScheduler, setShowScheduler] = useState(false)
  const [showVisibilityPicker, setShowVisibilityPicker] = useState(false)
  
  const createPost = useCreatePost()
  const schedulePost = useSchedulePost()

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
        toast.success(`${uploadedIds.length} file(s) uploaded successfully`)
      }
    } catch (err) {
      toast.error('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handlePost = () => {
    if (!content.trim() && mediaIds.length === 0) {
      toast.warning('Please add some content or media before posting')
      return
    }
    const pendingText = content.trim()

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
            toast.success('Post scheduled successfully!')
            setContent('')
            setMediaIds([])
            setLocation('')
            setFeeling('')
            setScheduledDate(undefined)
            setShowScheduler(false)
            setShowVisibilityPicker(false)
            onClose()
            onCreated?.()
          },
          onError: (err: any) => {
            if (err.response?.status === 400) {
              toast.error('Invalid scheduled date or content')
            } else {
              toast.error('Failed to schedule post. Please try again.')
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

            toast.success('Post created successfully!')
            setContent('')
            setMediaIds([])
            setLocation('')
            setFeeling('')
            setShowVisibilityPicker(false)
            onClose()
            onCreated?.()
            queryClient.invalidateQueries({ queryKey: ['feed'] }).catch(() => {})
          },
          onError: () => {
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
              location: location || undefined
            }
            localStorage.setItem('comet_global_local_posts', JSON.stringify([fallbackPost, ...currentLocal]))
            
            // 📢 إطلاق الإشارة الكونية حتى في حالة الـ Fallback لضمان الرندر الفوري
            window.dispatchEvent(new Event('comet_posts_updated'))

            toast.warning('Post saved locally (offline mode)')
            setContent('')
            setMediaIds([])
            setShowVisibilityPicker(false)
            onClose()
            onCreated?.()
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
                <h2 className="font-headline text-2xl font-bold text-on-surface">New Cosmic Thread</h2>
                <button onClick={onClose}><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto px-10 py-8">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full h-32 bg-transparent border-none resize-none focus:ring-0 text-lg p-4"
                  placeholder="What's happening in your corner of the universe?"
                />
                
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
                    <Clock size={20} /> {scheduledDate ? 'Scheduled' : 'Schedule'}
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
                    <h4 className="text-sm font-bold text-on-surface mb-4">Who can see this post?</h4>
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
                      label="Schedule Post"
                      placeholder="Pick a future date and time"
                    />
                  </div>
                )}
              </div>

              <div className="px-10 py-6 border-t flex justify-between">
                <button onClick={onClose} className="text-on-surface-variant">Discard</button>
                <Button onClick={handlePost} disabled={createPost.isPending || schedulePost.isPending || isUploading}>
                  {createPost.isPending || schedulePost.isPending ? 'Launching...' : scheduledDate ? 'Schedule Post' : 'Post Now'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}