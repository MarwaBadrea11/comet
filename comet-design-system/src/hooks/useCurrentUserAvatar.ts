/**
 * Hook to get the current authenticated user's avatar URL.
 * Combines auth store and profile query for the most up-to-date avatar.
 */

import { useAuthStore } from '../stores/authStore'
import { useMyProfile } from './useUserQuery'

export function useCurrentUserAvatar(): string {
  const authUser = useAuthStore((s) => s.user)
  const { data: profile } = useMyProfile()
  
  // Priority: profile.avatar > authUser.avatar > fallback to dicebear
  const avatarUrl = profile?.avatar || authUser?.avatar
  const displayName = profile?.name || authUser?.name || 'User'
  
  return avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`
}
