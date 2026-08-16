import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { X, ChevronLeft, ChevronRight, Heart, Pause, Play } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { useAvatarUrl } from '../ui/UserAvatar'
import { useStoriesFeed } from '../../hooks/useStoriesQuery'
import { getStoryMediaUrl } from '../../services/stories'

const STORY_DURATION = 5000 // 5 seconds per story

interface DisplayStory {
  id: string
  content: string | null
  createdAt: string
  mediaUrl?: string
  user: { id: string; name: string; avatarMediaId?: string | null }
}

export function StoriesScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const startAuthorId = (location.state as { startAuthorId?: string } | null)?.startAuthorId

  const { data: storyGroups = [] } = useStoriesFeed()

  // ── Flatten grouped stories into one ordered playback list ──
  const stories = useMemo<DisplayStory[]>(() => {
    return storyGroups.flatMap(group =>
      group.stories.map(story => ({
        id: String(story.id),
        content: story.post.content,
        createdAt: story.createdAt,
        mediaUrl: getStoryMediaUrl(story),
        user: { id: String(group.user.id), name: group.user.name, avatarMediaId: group.user.avatarMediaId },
      })),
    )
  }, [storyGroups])

  // ── States ──
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const progressInterval = useRef<number | undefined>(undefined)

  // Jump to the first story of the author that was tapped from the home feed strip.
  useEffect(() => {
    if (!startAuthorId || stories.length === 0) return
    const idx = stories.findIndex(s => s.user.id === startAuthorId)
    if (idx >= 0) setCurrentIndex(idx)
  }, [startAuthorId, stories])

  const currentStory = stories[currentIndex]
  const currentAuthorAvatarUrl = useAvatarUrl({
    name: currentStory?.user?.name,
    avatarMediaId: currentStory?.user?.avatarMediaId,
  })

  // ── Progress Timer ──
  useEffect(() => {
    if (!currentStory || isPaused) return

    const startTime = Date.now()
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        handleNext()
      }
    }, 50)

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [currentIndex, isPaused, currentStory])

  // ── Handlers ──
  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setProgress(0)
      setIsLiked(false)
    } else {
      navigate('/home')
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setProgress(0)
      setIsLiked(false)
    }
  }

  const handleClose = () => {
    navigate('/home')
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const handleLike = () => {
    // Story reactions aren't a backend concept (ReactableType is POST | COMMENT only) —
    // this is a local, cosmetic-only heart toggle.
    setIsLiked(!isLiked)
  }

  // ── Empty State ──
  if (!stories || stories.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[200]">
        <div className="text-center space-y-4">
          <p className="text-white/60 text-lg">No stories yet</p>
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-[200] flex items-center justify-center overflow-hidden select-none">

      {/* ── Background Blur Effect ── */}
      {currentStory?.mediaUrl && (
        <div
          className="absolute inset-0 opacity-30 blur-3xl scale-110"
          style={{
            backgroundImage: `url(${currentStory.mediaUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      {/* ── Main Story Container ── */}
      <div className="relative w-full max-w-md h-full md:h-[90vh] md:rounded-3xl overflow-hidden shadow-2xl">

        {/* ── Progress Bars ── */}
        <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-3">
          {stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: '0%' }}
                animate={{
                  width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%'
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          ))}
        </div>

        {/* ── Header ── */}
        <div className="absolute top-8 left-0 right-0 z-10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={currentAuthorAvatarUrl}
              alt={currentStory?.user?.name}
              size="sm"
              className="w-10 h-10 border-2 border-white shadow-lg"
            />
            <div>
              <h3 className="font-bold text-white text-sm drop-shadow-lg">
                {currentStory?.user?.name || 'Anonymous'}
              </h3>
              <p className="text-white/70 text-xs drop-shadow-md">
                {currentStory?.createdAt ? new Date(currentStory.createdAt).toLocaleDateString() : 'Recent'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={togglePause}
              className="p-2 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white rounded-full transition-colors"
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              onClick={handleClose}
              className="p-2 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Story Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory?.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center relative"
          >
            {currentStory?.mediaUrl ? (
              /* Image Story */
              <img
                src={currentStory.mediaUrl}
                alt="Story content"
                className="w-full h-full object-contain"
                draggable={false}
              />
            ) : (
              /* Text Story with Gradient Background */
              <div className="w-full h-full bg-gradient-to-br from-[#6B46C0] via-[#8E5EFF] to-[#00D4FF] flex items-center justify-center p-8">
                <p className="text-white text-2xl md:text-3xl font-bold text-center leading-relaxed drop-shadow-2xl">
                  {currentStory?.content || 'No content'}
                </p>
              </div>
            )}

            {/* Text Overlay for Image Stories */}
            {currentStory?.mediaUrl && currentStory?.content && (
              <div className="absolute bottom-20 left-0 right-0 px-6">
                <p className="text-white text-lg font-semibold text-center drop-shadow-2xl bg-black/30 backdrop-blur-sm rounded-2xl p-4">
                  {currentStory.content}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation Areas ── */}
        <div className="absolute inset-0 flex">
          {/* Left tap area */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex-1 flex items-center justify-start pl-4 disabled:opacity-0"
          >
            <div className="p-2 bg-black/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft size={24} className="text-white" />
            </div>
          </button>

          {/* Right tap area */}
          <button
            onClick={handleNext}
            disabled={currentIndex === stories.length - 1}
            className="flex-1 flex items-center justify-end pr-4"
          >
            <div className="p-2 bg-black/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={24} className="text-white" />
            </div>
          </button>
        </div>

        {/* ── Bottom Actions ── */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <button
              onClick={handleLike}
              className={`p-3 rounded-full transition-all active:scale-90 ${
                isLiked
                  ? 'bg-red-500 text-white'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              <Heart
                size={24}
                fill={isLiked ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
