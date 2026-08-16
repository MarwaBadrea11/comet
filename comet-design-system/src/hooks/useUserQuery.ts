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

export function useMe(options?: { enabled?: boolean }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())
  const setUser = useAuthStore((s) => s.setUser)
  const currentUser = useAuthStore((s) => s.user)

  const query = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn:  () => userService.getMe(),
    enabled:  options?.enabled !== false && isAuthenticated,
    staleTime: 5 * 60_000, // profile data changes rarely
  })

  // Sync the auth store with latest profile data including avatar
  if (query.data && currentUser && query.data.avatar !== currentUser.avatar) {
    setUser({
      ...currentUser,
      name: query.data.name,
      avatar: query.data.avatar,
      email: query.data.email,
    })
  }

  return query
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

export function useUserById(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.user.byId(id),
    queryFn:  () => userService.getUserById(id),
    enabled:  options?.enabled !== false && !!id,
    staleTime: 60_000,
  })
}
