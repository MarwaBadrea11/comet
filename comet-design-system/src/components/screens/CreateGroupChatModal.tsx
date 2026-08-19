/**
 * Create Group Chat Modal
 * 
 * Features:
 * - Group name and description input
 * - Group avatar/image picker
 * - Multi-select user picker with search
 * - Validation (requires name and at least 1 member)
 * - Loading states and error handling
 * - Auto-navigation to new group after creation
 */

import { useState, useCallback, useRef } from 'react'
import { X, Users, Loader2, Search, Upload, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar } from '../ui/Avatar'
import { useAvatarUrl } from '../ui/UserAvatar'
import { Input } from '../ui/Input'
import { toast } from '../ui/Toast'
import { useMyFriends } from '../../hooks/useFriendsQuery'
import { useCreateConversation } from '../../hooks/useMessagesQuery'
import { useUploadMedia } from '../../hooks/useMediaQuery'
import { useTranslation } from '../../hooks/useTranslation'

interface CreateGroupChatModalProps {
  onClose: () => void
  onGroupCreated?: (conversationId: string) => void
}

// Avatar component for participants
function ParticipantAvatar({ 
  name, 
  avatarMediaId, 
  size = 'sm', 
  className 
}: { 
  name?: string
  avatarMediaId?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string 
}) {
  const src = useAvatarUrl({ name, avatarMediaId })
  return <Avatar src={src} alt={name} size={size} className={className} />
}

export function CreateGroupChatModal({ onClose, onGroupCreated }: CreateGroupChatModalProps) {
  const t = useTranslation()
  // Form state
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  
  // Validation state
  const [errors, setErrors] = useState<{ name?: string; members?: string }>({})
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Queries and mutations
  const { data: friends = [], isLoading: loadingFriends } = useMyFriends()
  const createConversation = useCreateConversation()
  const uploadMedia = useUploadMedia()

  // Filter friends by search query
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (friend.username && friend.username.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Toggle member selection
  const toggleMember = useCallback((userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
    // Clear members error when user selects someone
    if (errors.members) {
      setErrors(prev => ({ ...prev, members: undefined }))
    }
  }, [errors.members])

  // Handle avatar file selection
  const handleAvatarSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t.createGroupModal.imageTooLarge)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t.createGroupModal.selectImageFile)
      return
    }

    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }, [])

  // Remove avatar
  const removeAvatar = useCallback(() => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview)
    }
    setAvatarFile(null)
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [avatarPreview])

  // Validate form
  const validate = useCallback(() => {
    const newErrors: { name?: string; members?: string } = {}

    if (!groupName.trim()) {
      newErrors.name = t.createGroupModal.nameRequired
    } else if (groupName.trim().length < 3) {
      newErrors.name = t.createGroupModal.nameTooShort
    } else if (groupName.trim().length > 50) {
      newErrors.name = t.createGroupModal.nameTooLong
    }

    if (selectedMembers.length === 0) {
      newErrors.members = t.createGroupModal.selectAtLeastOne
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [groupName, selectedMembers])

  // Handle form submission
  const handleCreate = async () => {
    if (!validate()) return

    try {
      // Upload avatar if selected
      let avatarMediaId: string | undefined
      if (avatarFile) {
        try {
          const media = await uploadMedia.mutateAsync(avatarFile)
          avatarMediaId = media.id
        } catch (error) {
          toast.error(t.createGroupModal.avatarUploadFailed)
          return
        }
      }

      // Create group conversation
      createConversation.mutate(
        {
          participantIds: selectedMembers,
          type: 'GROUP',
          name: groupName.trim(),
          description: description.trim() || undefined,
          avatarMediaId,
        },
        {
          onSuccess: (conversation) => {
            toast.success(t.createGroupModal.groupCreated)
            onGroupCreated?.(conversation.id)
            onClose()
          },
          onError: (error: any) => {
            const message = error?.response?.data?.message || t.createGroupModal.createFailed
            toast.error(message)
          },
        }
      )
    } catch (error) {
      toast.error(t.createGroupModal.unexpectedError)
    }
  }

  const isLoading = createConversation.isPending || uploadMedia.isPending

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface-container-lowest w-full max-w-2xl rounded-[2rem] flex flex-col overflow-hidden shadow-2xl max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-outline-variant/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-[#00D4FF] flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <h2 className="font-headline text-lg font-bold text-on-surface">{t.createGroupModal.title}</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-surface rounded-full transition-colors"
              disabled={isLoading}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Group Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {avatarPreview ? (
                    <div className="relative">
                      <img 
                        src={avatarPreview} 
                        alt="Group avatar" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-surface-container"
                      />
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                        disabled={isLoading}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary/10 to-[#00D4FF]/10 flex items-center justify-center border-2 border-dashed border-primary/30">
                      <ImageIcon size={32} className="text-primary/50" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-semibold text-primary hover:underline"
                  disabled={isLoading}
                >
                  {avatarPreview ? t.createGroupModal.changePhoto : t.createGroupModal.addPhoto}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
              </div>

              {/* Group Name */}
              <div>
                <Input
                  label={t.createGroupModal.groupNameLabel}
                  placeholder={t.createGroupModal.groupNamePlaceholder}
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value)
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
                  }}
                  error={errors.name}
                  maxLength={50}
                  disabled={isLoading}
                />
                <p className="text-xs text-on-surface-variant mt-1 px-1">
                  {groupName.length}/50 {t.createGroupModal.charactersCount}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant px-1 block mb-1.5">
                  {t.createGroupModal.descriptionLabel}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.createGroupModal.descriptionPlaceholder}
                  maxLength={200}
                  rows={3}
                  disabled={isLoading}
                  className="w-full bg-surface-container-low rounded-2xl p-4 border-none outline-none font-body text-on-surface placeholder:text-outline/50 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest resize-none"
                />
                <p className="text-xs text-on-surface-variant mt-1 px-1">
                  {description.length}/200 {t.createGroupModal.charactersCount}
                </p>
              </div>

              {/* Member Selection */}
              <div>
                <label className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant px-1 block mb-3">
                  {t.createGroupModal.addMembers} {selectedMembers.length > 0 && `(${selectedMembers.length})`}
                </label>

                {errors.members && (
                  <p className="text-sm text-error mb-3 px-1">{errors.members}</p>
                )}

                {/* Search */}
                <div className="mb-4">
                  <Input
                    variant="search"
                    placeholder={t.createGroupModal.searchFriends}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leadingIcon={<Search size={18} />}
                    disabled={isLoading}
                  />
                </div>

                {/* Friends List */}
                <div className="bg-surface-container/30 rounded-2xl p-3 max-h-64 overflow-y-auto space-y-1.5">
                  {loadingFriends && (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                  )}

                  {!loadingFriends && filteredFriends.length === 0 && (
                    <p className="text-center text-sm text-on-surface-variant py-8">
                      {searchQuery ? t.createGroupModal.noFriendsMatching : t.createGroupModal.noFriendsToAdd}
                    </p>
                  )}

                  {!loadingFriends && filteredFriends.map((friend) => {
                    const isSelected = selectedMembers.includes(friend.id)
                    return (
                      <button
                        key={friend.id}
                        onClick={() => toggleMember(friend.id)}
                        disabled={isLoading}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-primary/10 border-2 border-primary/30'
                            : 'hover:bg-surface-container-low border-2 border-transparent'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <ParticipantAvatar
                          name={friend.name}
                          avatarMediaId={(friend as any).avatarMediaId}
                          size="sm"
                        />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold text-on-surface">{friend.name}</p>
                          {friend.username && (
                            <p className="text-xs text-on-surface-variant">@{friend.username}</p>
                          )}
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-primary border-primary'
                              : 'border-outline-variant/40'
                          }`}
                        >
                          {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-outline-variant/10 shrink-0">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 h-11 rounded-xl bg-surface-container text-on-surface font-bold hover:bg-surface-container-low transition-colors disabled:opacity-40"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleCreate}
                disabled={isLoading || selectedMembers.length === 0 || !groupName.trim()}
                className="flex-1 h-11 rounded-xl bg-primary text-white font-bold disabled:opacity-40 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t.createGroupModal.creating}
                  </>
                ) : (
                  <>
                    <Users size={16} />
                    {t.createGroupModal.createGroup}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
