import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { blockService } from '../services/user'
import { queryKeys } from '../lib/queryKeys'
import { toast } from '../components/ui/Toast'
import { useAuthStore } from '../stores/authStore'

export function useBlockedUsers() {
  return useQuery({
    queryKey: queryKeys.block.list(),
    queryFn: () => blockService.getAll(),
    staleTime: 60_000,
  })
}

/**
 * POST /block toggles: blocks the user if not already blocked, unblocks if
 * they are. Used for both "Block" and "Unblock" actions — same call either way.
 */
export function useToggleBlock() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => blockService.toggle(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.block.list() })
      qc.invalidateQueries({ queryKey: queryKeys.friendship.friends() })
      toast.success('Updated block status')
    },
    onError: () => {
      toast.error('Failed to update block status')
    },
  })
}

// Aliases kept for call sites that name the action explicitly — both point
// at the same toggle endpoint.
export const useBlockUser = useToggleBlock
export const useUnblockUser = useToggleBlock

/** True only if the CURRENT user is the one who blocked `userId` (not the reverse). */
export function useIsBlocked(userId: string | undefined): boolean {
  const currentUser = useAuthStore((s) => s.user)
  const { data: blockedUsers = [] } = useBlockedUsers()

  if (!userId || !currentUser) return false

  return blockedUsers.some(
    (b) => String(b.blockerId) === String(currentUser.id) && String(b.blockedId) === String(userId),
  )
}
