import { Loader2, ShieldOff, Ban } from 'lucide-react'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { useBlockedUsers, useToggleBlock } from '../../hooks/useBlockQuery'
import { useUserById } from '../../hooks/useUserQuery'
import { useAuthStore } from '../../stores/authStore'
import { useTranslation } from '../../hooks/useTranslation'

function BlockedUserRow({ blockedId }: { blockedId: string }) {
  const t = useTranslation()
  const { data: user, isLoading } = useUserById(blockedId)
  const toggleBlock = useToggleBlock()
  const avatarSrc = user?.avatar ?? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name ?? blockedId)}`

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-2xl">
        <div className="w-10 h-10 rounded-full bg-surface-container-low animate-pulse" />
        <div className="h-4 w-32 bg-surface-container-low rounded animate-pulse" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-2xl">
      <Avatar src={avatarSrc} alt={user.name} size="md" className="shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-on-surface text-sm truncate">{user.name}</p>
        {user.username && <p className="text-xs text-on-surface-variant truncate">@{user.username}</p>}
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => toggleBlock.mutate(blockedId)}
        disabled={toggleBlock.isPending}
        leftIcon={toggleBlock.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldOff size={16} />}
      >
        {t.settings.privacy.blockedUsers.unblock}
      </Button>
    </div>
  )
}

export function BlockedUsersList() {
  const t = useTranslation()
  const currentUser = useAuthStore((s) => s.user)
  const { data: blocks = [], isLoading } = useBlockedUsers()

  // GET /block returns rows in both directions (people who blocked you too) —
  // only show ones where the current user is the blocker.
  const blockedByMe = blocks.filter((b) => String(b.blockerId) === String(currentUser?.id))

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  if (blockedByMe.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-surface-container-lowest rounded-2xl">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-surface-container-low flex items-center justify-center">
          <Ban className="w-7 h-7 text-on-surface-variant" />
        </div>
        <p className="text-sm text-on-surface-variant">{t.settings.privacy.blockedUsers.empty}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {blockedByMe.map((b) => (
        <BlockedUserRow key={b.id} blockedId={b.blockedId} />
      ))}
    </div>
  )
}
