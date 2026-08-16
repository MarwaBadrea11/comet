/**
 * User query hooks.
 *
 * useMe        — GET /user/profile, enabled only when authenticated.
 * useMyProfile — Alias for useMe (for consistency with other hooks)
 * useUserById  — GET /user/:id
 */

import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/user'
import { useAuthStore } from '../stores/authStore'
import { queryKeys } from '../lib/queryKeys'

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())

  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn:  () => userService.getMe(),
    enabled:  isAuthenticated,
    // Sync the store user name/avatar if the full profile loads
    staleTime: 5 * 60_000, // profile data changes rarely
  })
}

// Alias for useMe - for consistency with other hooks
export const useMyProfile = useMe

export function useUserById(id: string) {
  return useQuery({
    queryKey: queryKeys.user.byId(id),
    queryFn:  () => userService.getUserById(id),
    enabled:  !!id,
  })
}
