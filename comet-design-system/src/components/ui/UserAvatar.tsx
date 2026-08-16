import { useQuery } from '@tanstack/react-query'
import { Avatar } from './Avatar'
import { mediaService } from '../../services/media'
import { queryKeys } from '../../lib/queryKeys'
import type { AvatarProps } from '../../types'

interface ResolveAvatarUrlArgs {
  name?: string
  /** Already-known absolute URL (e.g. post.user.avatarMedia?.url) — used as-is, no network call. */
  avatarUrl?: string | null
  /** Fallback: resolve to a URL by fetching the media record when no avatarUrl is embedded. */
  avatarMediaId?: string | null
}

/**
 * Resolves a user's real uploaded avatar wherever the backend only gives us
 * an avatarMediaId (not a nested avatarMedia object) — e.g. story authors,
 * comment authors. Falls back to a dicebear placeholder while resolving or
 * when the user has no avatar at all.
 *
 * Returns a plain URL string so it can drop into any existing `<img src>`
 * or `<Avatar src>` without changing surrounding markup/sizing.
 */
export function useAvatarUrl({ name, avatarUrl, avatarMediaId }: ResolveAvatarUrlArgs): string {
  const shouldFetch = !avatarUrl && !!avatarMediaId

  const { data: media } = useQuery({
    queryKey: queryKeys.media.byId(avatarMediaId ?? ''),
    queryFn: () => mediaService.getById(avatarMediaId as string),
    enabled: shouldFetch,
    staleTime: 5 * 60_000,
  })

  return (
    avatarUrl ||
    media?.url ||
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name || 'User')}`
  )
}

interface UserAvatarProps extends Omit<AvatarProps, 'src'>, ResolveAvatarUrlArgs {}

/** Same resolution as useAvatarUrl(), wrapped in the shared <Avatar> component. */
export function UserAvatar({ name, avatarUrl, avatarMediaId, alt, ...rest }: UserAvatarProps) {
  const resolvedUrl = useAvatarUrl({ name, avatarUrl, avatarMediaId })
  return <Avatar src={resolvedUrl} alt={alt ?? name} {...rest} />
}
