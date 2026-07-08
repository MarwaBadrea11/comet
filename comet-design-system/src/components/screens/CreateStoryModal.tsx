import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image as ImageIcon, Loader2, Send } from 'lucide-react'
import { Button } from '../ui/Button'
import { motionVariants } from '../../lib/theme'
import { useAuthStore } from '../../stores/authStore'
import { useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'

interface Props {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

export function CreateStoryModal({ open, onClose, onCreated }: Props) {
  const queryClient = useQueryClient()
  const user = useAuthStore(s => s.user)

  const [content, setContent] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', files[0])
      
      const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': undefined },
      })
      
      if (response.data?.url) {
        setMediaUrl(response.data.url)
      }
    } catch (err) {
      console.error("Story image upload failed", err)
    } finally {
      setIsUploading(false)
    }
  }

  const handlePublishStory = async () => {
    if (!content.trim() && !mediaUrl) return
    setIsPublishing(true)

    const pendingText = content.trim()
    const pendingMedia = mediaUrl

    const fallbackStory = {
      id: `story-local-${Date.now()}`,
      userId: user?.id,
      type: 'STORY',
      createdAt: new Date().toISOString(),
      user: { 
        name: user?.name || 'Me', 
        avatar: user?.avatar || '' 
      },
      content: pendingText || undefined,
      mediaUrl: pendingMedia || undefined,
      media: pendingMedia ? [{ url: pendingMedia }] : [],
      reactions: []
    }

    try {
      const saved = localStorage.getItem('comet_global_local_stories')
      const currentLocal = saved ? JSON.parse(saved) : []
      localStorage.setItem('comet_global_local_stories', JSON.stringify([fallbackStory, ...currentLocal]))

      window.dispatchEvent(new Event('comet_stories_updated'))

      resetForm()
      onClose()
      onCreated?.()

      await api.post('/posts', { 
        content: pendingText, 
        type: 'STORY', 
        mediaIds: pendingMedia ? [pendingMedia] : [] 
      })

      await queryClient.invalidateQueries({ queryKey: ['feed'] })

    } catch (err) {
      console.error("Failed to sync story with server, kept locally.", err)
    } finally {
      setIsPublishing(false)
    }
  }

  const resetForm = () => {
    setContent('')
    setMediaUrl('')
    setIsUploading(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div 
            {...motionVariants.modalBackdrop} 
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md" 
            onClick={onClose} 
          />

          <motion.div 
            {...motionVariants.scaleIn} 
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-[#0D0E12] text-white w-full max-w-md rounded-[2rem] flex flex-col overflow-hidden border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.8)]">
              
              <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
                <h2 className="font-headline text-lg font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  Create Cosmic Story
                </h2>
                <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 flex flex-col items-center justify-center flex-1 min-h-[300px] bg-neutral-950/40 relative">
                
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-xs text-white/40">Uploading media to orbit...</p>
                  </div>
                ) : mediaUrl ? (
                  <div className="relative w-full h-[280px] rounded-2xl overflow-hidden group">
                    <img src={mediaUrl} alt="Story preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setMediaUrl('')} 
                      className="absolute top-3 right-3 bg-black/60 hover:bg-red-600 p-1.5 rounded-full transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-[280px] rounded-2xl bg-gradient-to-tr from-[#6B46C0] to-[#00D4FF] p-6 flex items-center justify-center relative shadow-inner">
                    <textarea
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      maxLength={150}
                      className="w-full bg-transparent border-none resize-none focus:ring-0 text-center text-xl font-bold placeholder-white/60 text-white outline-none"
                      placeholder="Type your stellar status..."
                    />
                    <span className="absolute bottom-3 right-3 text-[10px] text-white/50 font-medium">
                      {content.length}/150
                    </span>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploading || !!mediaUrl}
                  className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-30"
                >
                  <ImageIcon size={18} />
                  <span>Upload Image</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />

                <Button 
                  onClick={handlePublishStory} 
                  disabled={isUploading || isPublishing || (!content.trim() && !mediaUrl)}
                  className="px-5 h-10 rounded-xl bg-primary text-white font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition-transform"
                >
                  {isPublishing ? 'Sharing...' : (
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
