/**
 * Centralized query key factory.
 */

export const queryKeys = {
  // ── Auth / User ───────────────────────────────────────────────────────────
  auth: {
    me: () => ['auth', 'me'] as const,
  },

  user: {
    all:     ()         => ['user'] as const,
    byId:    (id: string) => ['user', id] as const,
    allUsers: (page?: number, limit?: number) => ['users', 'all', page, limit] as const,
  },

  // ── Posts ─────────────────────────────────────────────────────────────────
  posts: {
    all:        ()                              => ['posts'] as const,
    feed:       (page: number, size: number)    => ['posts', 'feed', page, size] as const,
    byId:       (id: string)                    => ['posts', 'detail', id] as const,
    byUsername: (username: string)              => ['posts', 'user', username] as const,
  },

  // ── Comments ──────────────────────────────────────────────────────────────
  comments: {
    all:    ()                   => ['comments'] as const,
    mine:   ()                   => ['comments', 'mine'] as const,
    byId:   (id: string)         => ['comments', 'detail', id] as const,
    byPost: (postId: string)     => ['comments', 'post', postId] as const,
  },

  // ── Reactions ─────────────────────────────────────────────────────────────
  reactions: {
    mine: () => ['reactions', 'mine'] as const,
  },

  // ── Stories ───────────────────────────────────────────────────────────────
  stories: {
    all:  ()                          => ['stories'] as const,
    feed: ()                          => ['stories', 'feed'] as const,
    mine: (includeExpired: boolean)   => ['stories', 'mine', includeExpired] as const,
    byId: (id: string)                => ['stories', 'detail', id] as const,
  },

  // ── Groups ────────────────────────────────────────────────────────────────
  groups: {
    all:   ()           => ['groups'] as const,
    byId:  (id: string) => ['groups', id] as const,
  },

  // ── Conversations & Messages ──────────────────────────────────────────────
  conversations: {
    mine:    ()           => ['conversations', 'mine'] as const,
    byId:    (id: string) => ['conversations', id] as const,
  },

  messages: {
    byConversation: (convId: string) => ['messages', convId] as const,
  },

  // ── Notifications ─────────────────────────────────────────────────────────
  notifications: {
    all: () => ['notifications'] as const,
  },

  // ── Search ────────────────────────────────────────────────────────────────
  search: {
    // Main search with new /search-history endpoint
    query: (query: string, category: string, page: number, limit: number) => 
      ['search', query, category, page, limit] as const,
    // Legacy global search (if /search/global still available)
    global: (query: string, limit: number) => 
      ['search', 'global', query, limit] as const,
    // Search history
    history: () => 
      ['search', 'history'] as const,
  },

  // ── Media ─────────────────────────────────────────────────────────────────
  media: {
    all:  () => ['media'] as const,
    byId: (id: string) => ['media', id] as const,
  },

  // ── Friends ───────────────────────────────────────────────────────────────
  friends: {
    all:              ()                     => ['friends'] as const,
    myFriends:        (take?: number, skip?: number) => ['friends', 'mine', take, skip] as const,
    pendingRequests:  ()                     => ['friends', 'pending'] as const,
    suggestions:      (limit?: number)       => ['friends', 'suggestions', limit] as const,
  },

  // ── Friendship (requests & status) ────────────────────────────────────────
  friendship: {
    friends:      ()                 => ['friendship', 'friends'] as const,
    incoming:     ()                 => ['friendship', 'incoming'] as const,
    outgoing:     ()                 => ['friendship', 'outgoing'] as const,
    suggestions:  ()                 => ['friendship', 'suggestions'] as const,
    status:       (userId: string)   => ['friendship', 'status', userId] as const,
  },

  // ── Block ─────────────────────────────────────────────────────────────────
  block: {
    list:  ()           => ['block', 'list'] as const,
    byId:  (id: string) => ['block', id] as const,
  },
}