/**
 * Thin compatibility layer over useFriendshipQuery.ts — kept so existing call
 * sites (AppShell's pending-request badge, MessagesScreen's friend picker)
 * don't need to change imports. useFriendshipQuery.ts is the single source
 * of truth for friendship data; don't duplicate query logic here.
 */

export {
  useIncomingRequests as usePendingRequests,
  useMyFriends,
  useFriendSuggestions,
  useSendFriendRequest,
  useApproveFriendRequest,
  useDeclineFriendRequest,
  useUnfriend,
} from './useFriendshipQuery'

export type { FriendRequest } from '../types'

export interface Friend {
  id: string
  name: string
  username: string
  avatarMediaId?: string | null
  avatar?: string
  mutualFriends?: number
}
