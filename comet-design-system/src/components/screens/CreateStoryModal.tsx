import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image as ImageIcon, Loader2, Send, Globe, Users, Lock } from 'lucide-react'
import { Button } from '../ui/Button'
import { toast } from '../ui/Toast'
import { motionVariants } from '../../lib/theme'
import { useUploadStory } from '../../hooks/useStoriesQuery'
import type { StoryVisibility } from '../../types'

interface Props {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

// Stories always expire after 24 hours — not user-configurable.
const STORY_DURATION_HOURS = 24

const visibilityOptions: Array<{ value: StoryVisibility; label: string; icon: typeof Globe }> = [
  { value: 'PUBLIC', label: 'Public', icon: Globe },
  { value: 'FRIENDS', label: 'Friends', icon: Users },
  { value: 'ONLY_ME', label: 'Only Me', icon: Lock },
]

export function CreateStoryModal({ open, onClose, onCreated }: Props) {
  const [content, setContent] = useState('')
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState('')
  const [visibility, setVisibility] = useState<StoryVisibility>('FRIENDS')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadStory = useUploadStory()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload an image or video.')
      return
    }

    setMediaFile(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      setMediaPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handlePublishStory = async () => {
    if (!content.trim() && !mediaFile) {
      toast.error('Please add content or media to your story')
      return
    }

    const formData = new FormData()

    if (mediaFile) {
      formData.append('files', mediaFile)
    }

    if (content.trim()) {
      formData.append('content', content.trim())
    }

    formData.append('visibility', visibility)
    formData.append('duration', String(STORY_DURATION_HOURS))

    uploadStory.mutate(formData, {
      onSuccess: () => {
        toast.success('Story published! It will be visible for 24 hours.')
        resetForm()
        onClose()
        onCreated?.()
      },
      onError: (err: any) => {
        const status = err.response?.status
        const message = err.response?.data?.message || err.message

        if (status === 400) {
          toast.error(message || 'Invalid story content. Please check your input.')
        } else if (status === 401) {
          toast.error('Session expired. Please login again.')
        } else if (status === 403) {
          toast.error('You do not have permission to create stories.')
        } else if (status === 404) {
          toast.error('Story endpoint not found.')
        } else {
          toast.error('Failed to publish story. Please try again.')
        }
      },
    })
  }

  const resetForm = () => {
    setContent('')
    setMediaFile(null)
    setMediaPreview('')
    setVisibility('FRIENDS')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            {...motionVariants.modalBackdrop}
            className="fixed inset-0 z-[100] bg-on-surface/10 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            {...motionVariants.scaleIn}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-surface w-full max-w-md rounded-[2rem] flex flex-col overflow-hidden border border-outline-variant/15 shadow-[0_24px_60px_rgba(0,0,0,0.12)]">

              <div className="px-6 py-5 flex items-center justify-between border-b border-outline-variant/10">
                <h2 className="font-headline text-lg font-bold text-on-surface">
                  Create Story
                </h2>
                <button onClick={handleClose} className="p-1 hover:bg-surface-container-low rounded-full transition-colors">
                  <X size={18} className="text-on-surface-variant" />
                </button>
              </div>

              <div className="p-6 flex flex-col items-center justify-center flex-1 min-h-[300px] bg-surface-container-low/40 relative">

                {uploadStory.isPending ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-xs text-on-surface-variant">Publishing your story...</p>
                  </div>
                ) : mediaPreview ? (
                  <div className="relative w-full h-[280px] rounded-2xl overflow-hidden group">
                    {mediaFile?.type.startsWith('video/') ? (
                      <video src={mediaPreview} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={mediaPreview} alt="Story preview" className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() => { setMediaPreview(''); setMediaFile(null) }}
                      className="absolute top-3 right-3 bg-black/50 hover:bg-error p-1.5 rounded-full transition-colors"
                    >
                      <X size={14} className="text-white" />
                    </button>
                    {content && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white text-sm font-medium">{content}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-[280px] rounded-2xl bg-gradient-to-tr from-primary/15 to-[#00D4FF]/15 border border-outline-variant/10 p-6 flex items-center justify-center relative">
                    <textarea
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      maxLength={150}
                      className="w-full bg-transparent border-none resize-none focus:ring-0 text-center text-xl font-bold placeholder-on-surface-variant/40 text-on-surface outline-none"
                      placeholder="Type your status..."
                    />
                    <span className="absolute bottom-3 right-3 text-[10px] text-on-surface-variant/60 font-medium">
                      {content.length}/150
                    </span>
                  </div>
                )}
              </div>

              {/* Visibility — duration is fixed at 24h, not user-configurable */}
              <div className="px-6 py-3 bg-surface-container-low/60 border-y border-outline-variant/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-on-surface-variant font-medium">Visibility</span>
                  <span className="text-xs text-on-surface-variant font-medium">Expires in 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  {visibilityOptions.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setVisibility(value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                        visibility === value
                          ? 'bg-primary text-white'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      <Icon size={14} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 flex items-center justify-between">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadStory.isPending || !!mediaPreview}
                  className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-30"
                >
                  <ImageIcon size={18} />
                  <span>Upload Media</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,video/x-msvideo,video/webm"
                />

                <Button
                  onClick={handlePublishStory}
                  disabled={uploadStory.isPending || (!content.trim() && !mediaFile)}
                  className="px-5 h-10 rounded-xl bg-primary text-white font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
                >
                  {uploadStory.isPending ? 'Sharing...' : (
                    <>
                      <span>Share Now</span>
                      <Send size={14} />
                    </>
                  )}
                </Button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
