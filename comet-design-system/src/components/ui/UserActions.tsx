import { useState } from 'react'
import { UserPlus, UserMinus, UserCheck, Clock, Ban, Loader2 } from 'lucide-react'
import { Button } from './Button'
import { useFriendshipStatus, useSendFriendRequest, useApproveFriendRequest, useDeclineFriendRequest, useUnfriend } from '../../hooks/useFriendshipQuery'
import { useBlockUser, useUnblockUser, useIsBlocked } from '../../hooks/useBlockQuery'
import { useAuthStore } from '../../stores/authStore'
import { DropdownMenu } from './DropdownMenu'

interface UserActionsProps {
  userId: string
  compact?: boolean
  onBlockComplete?: () => void
}

export function UserActions({ userId, compact = false, onBlockComplete }: UserActionsProps) {
  const currentUser = useAuthStore(s => s.user)
  const [showConfirmBlock, setShowConfirmBlock] = useState(false)
  const [showConfirmUnfriend, setShowConfirmUnfriend] = useState(false)

  const { data: status, isLoading: loadingStatus } = useFriendshipStatus(userId)
  const isBlocked = useIsBlocked(userId)
  
  const sendRequest = useSendFriendRequest()
  const approveRequest = useApproveFriendRequest()
  const declineRequest = useDeclineFriendRequest()
  const unfriend = useUnfriend()
  const blockUser = useBlockUser()
  const unblockUser = useUnblockUser()

  const isCurrentUser = currentUser?.id === userId
  const isPending = status?.isPending || status?.status === 'PENDING'
  const isOutgoing = status?.isOutgoing
  const isFriend = status?.isFriend || status?.status === 'APPROVED'
  const isIncoming = isPending && !isOutgoing

  const isProcessing = sendRequest.isPending || approveRequest.isPending || 
                       declineRequest.isPending || unfriend.isPending || 
                       blockUser.isPending || unblockUser.isPending

  if (isCurrentUser) return null

  const handleSendRequest = () => {
    sendRequest.mutate(userId)
  }

  const handleApprove = () => {
    approveRequest.mutate(userId)
  }

  const handleDecline = () => {
    declineRequest.mutate(userId)
  }

  const handleCancelRequest = () => {
    declineRequest.mutate(userId)
  }

  const handleUnfriend = () => {
    if (showConfirmUnfriend) {
      unfriend.mutate(userId)
      setShowConfirmUnfriend(false)
    } else {
      setShowConfirmUnfriend(true)
    }
  }

  const handleBlock = () => {
    if (showConfirmBlock) {
      blockUser.mutate(userId, {
        onSuccess: () => {
          setShowConfirmBlock(false)
          onBlockComplete?.()
        },
      })
    } else {
      setShowConfirmBlock(true)
    }
  }

  const handleUnblock = () => {
    if (isBlocked) {
      unblockUser.mutate(userId)
    }
  }

  if (loadingStatus) {
    return (
      <Button variant="secondary" size={compact ? 'sm' : 'md'} disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    )
  }

  if (isBlocked) {
    return (
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size={compact ? 'sm' : 'md'}
          onClick={handleUnblock}
          disabled={isProcessing}
          leftIcon={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban size={16} />}
        >
          Unblock
        </Button>
      </div>
    )
  }

  if (showConfirmBlock) {
    return (
      <div className="flex gap-2">
        <Button
          variant="primary"
          size={compact ? 'sm' : 'md'}
          onClick={handleBlock}
          disabled={isProcessing}
          leftIcon={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban size={16} />}
        >
          Confirm Block
        </Button>
        <Button
          variant="ghost"
          size={compact ? 'sm' : 'md'}
          onClick={() => setShowConfirmBlock(false)}
          disabled={isProcessing}
        >
          Cancel
        </Button>
      </div>
    )
  }

  if (showConfirmUnfriend) {
    return (
      <div className="flex gap-2">
        <Button
          variant="primary"
          size={compact ? 'sm' : 'md'}
          onClick={handleUnfriend}
          disabled={isProcessing}
          leftIcon={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus size={16} />}
        >
          Confirm Unfriend
        </Button>
        <Button
          variant="ghost"
          size={compact ? 'sm' : 'md'}
          onClick={() => setShowConfirmUnfriend(false)}
          disabled={isProcessing}
        >
          Cancel
        </Button>
      </div>
    )
  }

  if (isFriend) {
    return (
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size={compact ? 'sm' : 'md'}
          leftIcon={<UserCheck size={16} />}
          disabled
        >
          Friends
        </Button>
        <DropdownMenu>
          <DropdownMenu.Trigger>
            <Button variant="ghost" size={compact ? 'sm' : 'md'} icon>
              <span className="material-symbols-outlined">more_horiz</span>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item icon={<UserMinus size={16} />} onClick={handleUnfriend}>
              Unfriend
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item icon={<Ban size={16} />} onClick={() => setShowConfirmBlock(true)} variant="danger">
              Block
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    )
  }

  if (isIncoming) {
    return (
      <div className="flex gap-2">
        <Button
          variant="primary"
          size={compact ? 'sm' : 'md'}
          onClick={handleApprove}
          disabled={isProcessing}
          leftIcon={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck size={16} />}
        >
          Accept
        </Button>
        <Button
          variant="ghost"
          size={compact ? 'sm' : 'md'}
          onClick={handleDecline}
          disabled={isProcessing}
        >
          Decline
        </Button>
        <DropdownMenu>
          <DropdownMenu.Trigger>
            <Button variant="ghost" size={compact ? 'sm' : 'md'} icon>
              <span className="material-symbols-outlined">more_horiz</span>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item icon={<Ban size={16} />} onClick={() => setShowConfirmBlock(true)} variant="danger">
              Block
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    )
  }

  if (isPending && isOutgoing) {
    return (
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size={compact ? 'sm' : 'md'}
          onClick={handleCancelRequest}
          disabled={isProcessing}
          leftIcon={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock size={16} />}
        >
          Request Sent
        </Button>
        <DropdownMenu>
          <DropdownMenu.Trigger>
            <Button variant="ghost" size={compact ? 'sm' : 'md'} icon>
              <span className="material-symbols-outlined">more_horiz</span>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item icon={<UserMinus size={16} />} onClick={handleCancelRequest}>
              Cancel Request
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item icon={<Ban size={16} />} onClick={() => setShowConfirmBlock(true)} variant="danger">
              Block
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="primary"
        size={compact ? 'sm' : 'md'}
        onClick={handleSendRequest}
        disabled={isProcessing}
        leftIcon={isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus size={16} />}
      >
        Add Friend
      </Button>
      <DropdownMenu>
        <DropdownMenu.Trigger>
          <Button variant="ghost" size={compact ? 'sm' : 'md'} icon>
            <span className="material-symbols-outlined">more_horiz</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item icon={<Ban size={16} />} onClick={() => setShowConfirmBlock(true)} variant="danger">
            Block
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  )
}
