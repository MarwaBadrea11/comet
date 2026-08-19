import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, Loader2, X, Upload } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { toast } from '../ui/Toast'
import { useMe, useUpdateProfile } from '../../hooks/useUserQuery'
import { mediaService } from '../../services/media'
import type { UpdateProfileRequest } from '../../services/user'
import { useTranslation } from '../../hooks/useTranslation'

export function EditProfileScreen() {
  const t = useTranslation()
  const navigate = useNavigate()
  const { data: profile, isLoading } = useMe()
  const updateProfile = useUpdateProfile()

  // Form state
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: '',
    username: '',
    bio: '',
    city: '',
    country: '',
    gender: 'PREFER_NOT_TO_SAY',
  })

  // Sync form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        city: profile.city || '',
        country: profile.country || '',
        gender: profile.gender || 'PREFER_NOT_TO_SAY',
      })
    }
  }, [profile])

  // Upload states
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  // Derived values
  const displayName = profile?.name || 'User'
  const currentAvatar = avatarPreview || profile?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`
  const currentCover = coverPreview || profile?.coverMedia?.url

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t.editProfile.invalidImageFile)
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast.error(t.editProfile.imageTooLarge10)
      return
    }

    console.log('📸 Avatar upload started:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    })

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
      console.log('✅ Avatar preview loaded')
    }
    reader.onerror = () => {
      console.error('❌ FileReader error')
      toast.error(t.editProfile.readImageFailed)
    }
    reader.readAsDataURL(file)

    // Upload to server
    setIsUploadingAvatar(true)
    try {
      console.log('⬆️ Uploading avatar to server...')
      const media = await mediaService.upload(file)
      console.log('✅ Avatar upload successful:', media)

      setFormData(prev => ({ ...prev, avatarMediaId: media.id }))
      toast.success(t.editProfile.avatarUploaded)
    } catch (error: any) {
      console.error('❌ Avatar upload failed:', error)
      const errorMessage = error?.response?.data?.message || error?.message || t.editProfile.avatarUploadFailed
      toast.error(errorMessage)
      setAvatarPreview(null)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // Handle cover photo upload
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t.editProfile.invalidImageFile)
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast.error(t.editProfile.imageTooLarge10)
      return
    }

    console.log('📸 Cover upload started:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    })

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setCoverPreview(reader.result as string)
      console.log('✅ Cover preview loaded')
    }
    reader.onerror = () => {
      console.error('❌ FileReader error')
      toast.error(t.editProfile.readImageFailed)
    }
    reader.readAsDataURL(file)

    // Upload to server
    setIsUploadingCover(true)
    try {
      console.log('⬆️ Uploading cover to server...')
      const media = await mediaService.upload(file)
      console.log('✅ Cover upload successful:', media)

      setFormData(prev => ({ ...prev, coverMediaId: media.id }))
      toast.success(t.editProfile.coverUploaded)
    } catch (error: any) {
      console.error('❌ Cover upload failed:', error)
      const errorMessage = error?.response?.data?.message || error?.message || t.editProfile.coverUploadFailed
      toast.error(errorMessage)
      setCoverPreview(null)
    } finally {
      setIsUploadingCover(false)
    }
  }

  // Remove avatar
  const handleRemoveAvatar = () => {
    setAvatarPreview(null)
    setFormData(prev => ({ ...prev, avatarMediaId: undefined }))
  }

  // Remove cover
  const handleRemoveCover = () => {
    setCoverPreview(null)
    setFormData(prev => ({ ...prev, coverMediaId: undefined }))
  }

  // Handle form submit
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Validation
    if (!formData.name?.trim()) {
      toast.error(t.editProfile.nameRequired)
      return
    }

    if (!formData.username?.trim()) {
      toast.error(t.editProfile.usernameRequired)
      return
    }

    console.log('💾 Submitting profile update:', {
      ...formData,
      avatarMediaId: formData.avatarMediaId || 'not changed',
      coverMediaId: formData.coverMediaId || 'not changed'
    })

    // Submit update
    updateProfile.mutate(formData, {
      onSuccess: (data) => {
        console.log('✅ Profile update successful:', data)
        toast.success(t.editProfile.profileUpdated)
        navigate('/profile')
      },
      onError: (error: any) => {
        console.error('❌ Profile update failed:', error)
        const message = error?.response?.data?.message || error?.message || t.editProfile.updateFailed
        toast.error(message)
      },
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold font-headline">{t.editProfile.title}</h1>
              <p className="text-sm text-on-surface-variant">{t.editProfile.subtitle}</p>
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={updateProfile.isPending}
            isLoading={updateProfile.isPending}
          >
            {t.editProfile.save}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cover Photo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-on-surface">{t.editProfile.coverPhoto}</label>
              {isUploadingCover && (
                <span className="text-xs text-primary font-medium flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {t.editProfile.uploading}
                </span>
              )}
            </div>
            <div className="relative h-48 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/40 via-[#6B46C0]/60 to-[#00D4FF]/30 group cursor-pointer">
              {currentCover && (
                <img
                  src={currentCover}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
              {!currentCover && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-on-surface-variant/50 mx-auto mb-2" />
                    <p className="text-sm text-on-surface-variant">{t.editProfile.clickToUploadCover}</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-4 bg-surface-container-high rounded-full hover:bg-surface-container-highest disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Upload cover photo"
                >
                  {isUploadingCover ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </button>
                {(currentCover || coverPreview) && !isUploadingCover && (
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-4 bg-error/90 rounded-full hover:bg-error"
                    aria-label="Remove cover photo"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
              disabled={isUploadingCover}
            />
            <p className="text-xs text-on-surface-variant">
              {t.editProfile.coverHint}
            </p>
          </motion.div>

          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-on-surface">{t.editProfile.profilePicture}</label>
              {isUploadingAvatar && (
                <span className="text-xs text-primary font-medium flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {t.editProfile.uploading}
                </span>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar
                  src={currentAvatar}
                  alt={displayName}
                  size="xl"
                  className="!w-32 !h-32"
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 group-hover:bg-black/40 transition-colors disabled:cursor-not-allowed"
                  aria-label="Change profile picture"
                >
                  {isUploadingAvatar ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              </div>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  isLoading={isUploadingAvatar}
                >
                  {isUploadingAvatar ? t.editProfile.uploading : t.editProfile.uploadPhoto}
                </Button>
                {(avatarPreview || profile?.avatarMedia) && !isUploadingAvatar && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveAvatar}
                  >
                    {t.editProfile.remove}
                  </Button>
                )}
                <p className="text-xs text-on-surface-variant">
                  {t.editProfile.avatarHint}
                </p>
              </div>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={isUploadingAvatar}
            />
          </motion.div>

          {/* Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-on-surface">
                {t.editProfile.nameLabel} <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface-container-high rounded-2xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder={t.editProfile.namePlaceholder}
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-on-surface">
                {t.editProfile.usernameLabel} <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-surface-container-high rounded-2xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder={t.editProfile.usernamePlaceholder}
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-semibold text-on-surface">
                {t.editProfile.bioLabel}
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-surface-container-high rounded-2xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                placeholder={t.editProfile.bioPlaceholder}
              />
              <p className="text-xs text-on-surface-variant">
                {formData.bio?.length || 0} {t.editProfile.charactersOf160}
              </p>
            </div>

            {/* Location Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-semibold text-on-surface">
                  {t.editProfile.cityLabel}
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface-container-high rounded-2xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder={t.editProfile.cityPlaceholder}
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label htmlFor="country" className="block text-sm font-semibold text-on-surface">
                  {t.editProfile.countryLabel}
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface-container-high rounded-2xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder={t.editProfile.countryPlaceholder}
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-semibold text-on-surface">
                {t.editProfile.genderLabel}
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface-container-high rounded-2xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="MALE">{t.editProfile.genderMale}</option>
                <option value="FEMALE">{t.editProfile.genderFemale}</option>
                <option value="OTHER">{t.editProfile.genderOther}</option>
                <option value="PREFER_NOT_TO_SAY">{t.editProfile.genderPreferNotToSay}</option>
              </select>
            </div>
          </motion.div>

          {/* Action Buttons - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 pt-6 md:hidden"
          >
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate('/profile')}
              className="flex-1"
            >
              {t.editProfile.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={updateProfile.isPending}
              isLoading={updateProfile.isPending}
              className="flex-1"
            >
              {t.editProfile.saveChanges}
            </Button>
          </motion.div>
        </form>
      </div>

      {/* Decorative Blurs */}
      <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-1/2 -left-32 w-64 h-64 bg-[#00677e]/10 rounded-full blur-[80px] pointer-events-none" />
    </div>
  )
}
