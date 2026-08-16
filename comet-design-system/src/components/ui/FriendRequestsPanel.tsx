import { Loader2, UserPlus } from 'lucide-react'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { useIncomingRequests, useApproveFriendRequest, useDeclineFriendRequest } from '../../hooks/useFriendshipQuery'

export function FriendRequestsPanel() {
  const { data: requests = [], isLoading } = useIncomingRequests()
  const approve = useApproveFriendRequest()
  const decline = useDeclineFriendRequest()

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  if (!Array.isArray(requests) || requests.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-container-highest flex items-center justify-center">
          <UserPlus className="w-8 h-8 text-on-surface-variant" />
        </div>
        <p className="text-sm text-on-surface-variant">No pending friend requests</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((request: any) => {
        const requester = request.requester || {}
        const displayName = requester.name || 'Unknown User'
        const avatarSrc = requester.avatar || requester.avatarMedia?.url
        const isPending = approve.isPending || decline.isPending

        return (
          <div
            key={request.id}
            className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors"
          >
            <Avatar
              src={avatarSrc}
              alt={displayName}
              size="md"
              className="shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-on-surface truncate">{displayName}</p>
              {requester.username && (
                <p className="text-sm text-on-surface-variant">@{requester.username}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => approve.mutate(requester.id)}
                disabled={isPending}
                leftIcon={approve.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
              >
                Accept
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => decline.mutate(requester.id)}
                disabled={isPending}
              >
                Decline
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
