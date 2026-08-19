import { Loader2, UserPlus } from 'lucide-react'
import { Avatar } from './Avatar'
import { useAvatarUrl } from './UserAvatar'
import { Button } from './Button'
import { useIncomingRequests, useApproveFriendRequest, useDeclineFriendRequest } from '../../hooks/useFriendshipQuery'
import { useTranslation } from '../../hooks/useTranslation'
import type { FriendRequest } from '../../types'

function RequestRow({ request, onApprove, onDecline, isPending }: {
  request: FriendRequest
  onApprove: () => void
  onDecline: () => void
  isPending: boolean
}) {
  const t = useTranslation()
  const requester = request.requester
  const avatarSrc = useAvatarUrl({ name: requester.name, avatarMediaId: requester.avatarMediaId })

  return (
    <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors">
      <Avatar src={avatarSrc} alt={requester.name} size="md" className="shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-on-surface truncate">{requester.name || t.friendRequests.unknownUser}</p>
        {requester.username && (
          <p className="text-sm text-on-surface-variant">@{requester.username}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={onApprove} disabled={isPending}>
          {t.friendRequests.accept}
        </Button>
        <Button variant="ghost" size="sm" onClick={onDecline} disabled={isPending}>
          {t.friendRequests.decline}
        </Button>
      </div>
    </div>
  )
}

export function FriendRequestsPanel() {
  const t = useTranslation()
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
        <p className="text-sm text-on-surface-variant">{t.friendRequests.noPending}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <RequestRow
          key={request.friendshipId}
          request={request}
          isPending={approve.isPending || decline.isPending}
          onApprove={() => approve.mutate(request.requester.id)}
          onDecline={() => decline.mutate(request.requester.id)}
        />
      ))}
    </div>
  )
}
