import { UserPlus, UserCheck, Clock, Loader2 } from 'lucide-react'
import { Button } from './Button'
import { useFriendshipStatus, useSendFriendRequest, useDeclineFriendRequest } from '../../hooks/useFriendshipQuery'
import { useAuthStore } from '../../stores/authStore'

interface UserActionButtonProps {
  userId: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserActionButton({ userId, size = 'sm', className }: UserActionButtonProps) {
  const currentUser = useAuthStore(s => s.user)
  const { data: status, isLoading } = useFriendshipStatus(userId)
  const sendRequest = useSendFriendRequest()
  const cancelRequest = useDeclineFriendRequest()

  const isCurrentUser = currentUser?.id === userId
  const isPending = status?.isPending || status?.status === 'PENDING'
  const isOutgoing = status?.isOutgoing
  const isFriend = status?.isFriend || status?.status === 'APPROVED'
  const isProcessing = sendRequest.isPending || cancelRequest.isPending

  if (isCurrentUser || isLoading) return null

  if (isFriend) {
    return (
      <Button
        variant="ghost"
        size={size}
        className={className}
        leftIcon={<UserCheck size={14} />}
        disabled
      >
        Friends
      </Button>
    )
  }

  if (isPending && isOutgoing) {
    return (
      <Button
        variant="ghost"
        size={size}
        className={className}
        onClick={() => cancelRequest.mutate(userId)}
        disabled={isProcessing}
        leftIcon={isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock size={14} />}
      >
        Pending
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size={size}
      className={className}
      onClick={() => sendRequest.mutate(userId)}
      disabled={isProcessing}
      leftIcon={isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus size={14} />}
    >
      Add Friend
    </Button>
  )
}
