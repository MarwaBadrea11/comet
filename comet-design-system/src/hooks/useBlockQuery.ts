import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { blockService } from '../services/user'
import { queryKeys } from '../lib/queryKeys'
import { toast } from '../components/ui/Toast'

export function useBlockedUsers() {
  return useQuery({
    queryKey: queryKeys.block.list(),
    queryFn: () => blockService.getBlockedUsers(),
    staleTime: 60_000,
  })
}

export function useBlockUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (blockedId: string) => blockService.block(blockedId),
    onSuccess: (_, blockedId) => {
      qc.invalidateQueries({ queryKey: queryKeys.block.list() })
      qc.invalidateQueries({ queryKey: queryKeys.friendship.status(blockedId) })
      qc.invalidateQueries({ queryKey: queryKeys.friendship.friends() })
      toast.success('User blocked')
    },
    onError: () => {
      toast.error('Failed to block user')
    },
  })
}

export function useUnblockUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (blockId: string) => blockService.unblock(blockId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.block.list() })
      toast.success('User unblocked')
    },
    onError: () => {
      toast.error('Failed to unblock user')
    },
  })
}

export function useIsBlocked(userId: string | undefined) {
  const { data: blockedUsers = [] } = useBlockedUsers()
  
  if (!userId) return false
  
  return Array.isArray(blockedUsers) && blockedUsers.some((b: any) => b.blockedId === userId)
}
