import { useState } from 'react'
import { Loader2, Users, UserMinus, X } from 'lucide-react'
import { Avatar } from './Avatar'
import { useAvatarUrl } from './UserAvatar'
import { useMyFriends, useUnfriend } from '../../hooks/useFriendshipQuery'
import { useTranslation } from '../../hooks/useTranslation'

interface FriendRow {
  id: string
  name: string
  username: string
  avatarMediaId?: string | null
}

function FriendListItem({ friend }: { friend: FriendRow }) {
  const t = useTranslation()
  const [confirming, setConfirming] = useState(false)
  const avatarSrc = useAvatarUrl({ name: friend.name, avatarMediaId: friend.avatarMediaId })
  const unfriend = useUnfriend()

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container-low transition-colors">
      <Avatar src={avatarSrc} alt={friend.name} size="md" className="shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-on-surface truncate">{friend.name}</p>
        {friend.username && <p className="text-xs text-on-surface-variant truncate">@{friend.username}</p>}
      </div>
      {confirming ? (
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => unfriend.mutate(friend.id, { onSettled: () => setConfirming(false) })}
            disabled={unfriend.isPending}
            className="text-xs font-bold text-white bg-error px-3 py-1.5 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {unfriend.isPending ? <Loader2 size={12} className="animate-spin" /> : t.common.confirm}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="text-xs font-bold text-on-surface-variant px-2 py-1.5"
          >
            {t.common.cancel}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="shrink-0 p-2 rounded-full text-on-surface-variant/50 hover:text-error hover:bg-error/10 transition-colors"
          aria-label="Unfriend"
        >
          <UserMinus size={16} />
        </button>
      )}
    </div>
  )
}

export function FriendsListModal({ onClose }: { onClose: () => void }) {
  const t = useTranslation()
  const { data: friends = [], isLoading } = useMyFriends()

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div className="bg-surface w-full max-w-sm rounded-[2rem] flex flex-col overflow-hidden shadow-2xl max-h-[75vh] border border-outline-variant/15">
          <div className="px-6 py-5 flex items-center justify-between border-b border-outline-variant/10">
            <h2 className="font-headline text-lg font-bold text-on-surface">
              {t.friendsList.title} {!isLoading && `(${friends.length})`}
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-surface-container-low rounded-full">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            {isLoading && (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            )}

            {!isLoading && friends.length === 0 && (
              <div className="text-center py-10 px-4">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <Users className="w-7 h-7 text-on-surface-variant" />
                </div>
                <p className="text-sm text-on-surface-variant">{t.friendsList.noFriendsYet}</p>
              </div>
            )}

            {friends.map((friend) => (
              <FriendListItem key={friend.id} friend={friend} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
