import { FriendRequestsPanel } from '../ui/FriendRequestsPanel'

export function FriendRequestsScreen() {
  return (
    <div className="max-w-2xl mx-auto py-8 md:py-12 px-4 md:px-8">
      <h1 className="text-2xl md:text-3xl font-extrabold font-headline text-on-surface tracking-tight mb-8">
        Friend Requests
      </h1>
      <FriendRequestsPanel />
    </div>
  )
}
