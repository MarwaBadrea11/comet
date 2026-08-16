/**
 * User query hooks.
 *
 * useMe        — GET /user/profile, enabled only when authenticated.
 * useMyProfile — Alias for useMe (for consistency with other hooks)
 * useUserById  — GET /user/:id
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService, type UpdateProfileRequest } from '../services/user'
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

/**
 * Mutation: Update My Profile
 *
 * PATCH /user/profile — persists to the database. Also syncs the
 * lightweight authStore identity (used by TopBar/AppShell before the
 * profile query refetches) so the new name/avatar shows up immediately.
 */
export function useUpdateProfile() {
  const qc = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)
  const currentUser = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => userService.updateProfile(payload),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.auth.me(), updated)
      if (currentUser) {
        setUser({ ...currentUser, name: updated.name ?? currentUser.name, avatar: updated.avatar })
      }
    },
  })
}

export function useUserById(id: string) {
  return useQuery({
    queryKey: queryKeys.user.byId(id),
    queryFn:  () => userService.getUserById(id),
    enabled:  !!id,
  })
}
