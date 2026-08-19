/**
 * StoriesTray Component
 * 
 * Displays a horizontal scrollable list of story avatars.
 * Stories are fetched from the dedicated /story/feed endpoint.
 * This component is completely separate from the posts feed.
 */

import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useAvatarUrl } from './UserAvatar'
import { useStoriesFeed } from '../../hooks/useStoriesQuery'
import { useTranslation } from '../../hooks/useTranslation'

interface StoryRingAvatarProps {
  name?: string
  avatarMediaId?: string | null
}

function StoryRingAvatar({ name, avatarMediaId }: StoryRingAvatarProps) {
  const src = useAvatarUrl({ name, avatarMediaId })
  return (
    <img 
      src={src} 
      alt={name} 
      className="w-full h-full rounded-full object-cover border-2 border-white" 
    />
  )
}

interface StoriesTrayProps {
  onCreateStory: () => void
}

export function StoriesTray({ onCreateStory }: StoriesTrayProps) {
  const t = useTranslation()
  const navigate = useNavigate()
  const { data: storyGroups = [], isLoading, isError } = useStoriesFeed()

  // Don't render anything if there are no stories and we're not loading
  // (but still show the "Add Story" button)
  const hasStories = storyGroups.length > 0

  if (isError) {
    // Silently fail - stories are optional
    return null
  }

  return (
    <div className="flex gap-4 md:gap-5 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x w-full">
      
      {/* Add Story Button */}
      <div 
        onClick={onCreateStory} 
        className="flex flex-col items-center flex-shrink-0 cursor-pointer group snap-start"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-[#6B46C0] to-[#00D4FF] p-[2px] transition-transform group-hover:scale-105 shadow-sm">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
            <Plus size={24} className="text-primary" />
          </div>
        </div>
        <span className="text-[11px] md:text-xs font-bold text-on-surface-variant mt-1.5">
          {t.home.addStory}
        </span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Story Groups */}
      {hasStories && storyGroups.map(group => (
        <div
          key={group.user.id}
          onClick={() => navigate('/stories', { state: { startAuthorId: group.user.id } })}
          className="flex flex-col items-center flex-shrink-0 cursor-pointer group snap-start"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-[#6B46C0] via-[#8E5EFF] to-[#00D4FF] p-[2px] transition-transform group-hover:scale-105 shadow-md">
            <StoryRingAvatar 
              name={group.user.name} 
              avatarMediaId={group.user.avatarMediaId} 
            />
          </div>
          <span className="text-[11px] md:text-xs font-bold text-on-surface mt-1.5 max-w-[65px] md:max-w-[80px] truncate">
            {group.user.name || t.storiesScreen.anonymous}
          </span>
        </div>
      ))}
    </div>
  )
}
