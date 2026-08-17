import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Users as UsersIcon, Loader2, User, Mail, MapPin } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Avatar } from '../ui/Avatar'
import { UserActions } from '../ui/UserActions'
import { useUsersWithSearch } from '../../hooks/useUsersQuery'
import { useAuthStore } from '../../stores/authStore'

export function UsersScreen() {
  const navigate = useNavigate()
  const currentUser = useAuthStore(s => s.user)
  const { 
    users, 
    total, 
    isLoading, 
    isError, 
    error,
    searchQuery,
    setSearchQuery 
  } = useUsersWithSearch(1, 50)

  const [localSearch, setLocalSearch] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(localSearch)
  }

  const handleClearSearch = () => {
    setLocalSearch('')
    setSearchQuery('')
  }

  // Filter out the current user from the list
  const displayUsers = users.filter(user => user.id !== currentUser?.id)

  return (
    <div className="flex-1 min-h-screen bg-surface-container-low/30 backdrop-blur-md pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 px-6 py-6 md:py-8">
        <div className="max-w-5xl w-full mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <UsersIcon className="text-primary w-6 h-6" />
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">
              Discover Users
            </h1>
          </div>
          <p className="text-sm text-on-surface-variant/70 mb-6">
            Browse all users on the platform and connect with new friends
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
              <Input
                type="text"
                value={localSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalSearch(e.target.value)}
                placeholder="Search by name, username, or email..."
                className="w-full pl-14 pr-12 h-14 bg-surface-container-high/40 rounded-2xl border-none text-base focus-visible:ring-2 focus-visible:ring-primary/20 transition-all placeholder:text-on-surface-variant/40"
              />
              {isLoading && (
                <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 animate-spin text-primary w-5 h-5" />
              )}
            </div>
            
            <Button 
              type="submit" 
              variant="primary" 
              size="lg"
              disabled={isLoading}
              className="h-14 px-8 rounded-2xl font-bold"
            >
              Search
            </Button>
            
            {(localSearch || searchQuery) && (
              <Button 
                type="button"
                variant="ghost" 
                size="lg"
                onClick={handleClearSearch}
                className="h-14 px-6 rounded-2xl font-bold"
              >
                Clear
              </Button>
            )}
          </form>

          {/* Results Count */}
          {!isLoading && (
            <p className="text-sm text-on-surface-variant/60 mt-4">
              {searchQuery ? `${displayUsers.length} users found` : `${total} users registered`}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8">
        {/* Error State */}
        {isError && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-error/10 border border-error/20 rounded-2xl p-6 flex items-start gap-4"
          >
            <User className="text-error w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-error mb-1">Failed to Load Users</h3>
              <p className="text-sm text-on-surface-variant">
                {error instanceof Error ? error.message : 'Unable to load users. Please try again.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        )}

        {/* No Results State */}
        {!isLoading && !isError && displayUsers.length === 0 && searchQuery && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/40 border border-white/20 rounded-2xl p-12 text-center"
          >
            <User className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-on-surface mb-2">No Users Found</h3>
            <p className="text-sm text-on-surface-variant/70 max-w-md mx-auto">
              We couldn't find any users matching <span className="font-semibold text-on-surface">"{searchQuery}"</span>. 
              Try a different search term.
            </p>
          </motion.div>
        )}

        {/* Users Grid */}
        {!isLoading && !isError && displayUsers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/60 border border-white/40 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* User Card Header */}
                <div className="h-24 bg-gradient-to-br from-primary/20 via-[#00D4FF]/10 to-primary/30 relative">
                  <div className="absolute -bottom-10 left-6">
                    <Avatar 
                      src={user.avatar} 
                      alt={user.name} 
                      size="lg" 
                      className="border-4 border-white shadow-lg w-20 h-20"
                    />
                  </div>
                </div>

                {/* User Card Content */}
                <div className="pt-12 px-6 pb-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-xl font-headline font-bold text-on-surface mb-1 truncate cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate(`/profile/${user.id}`)}
                      >
                        {user.name}
                      </h3>
                      <p className="text-sm text-on-surface-variant/70 mb-2">@{user.username}</p>
                      
                      {/* Bio */}
                      {user.bio && (
                        <p className="text-sm text-on-surface-variant/80 line-clamp-2 mb-3">
                          {user.bio}
                        </p>
                      )}

                      {/* User Info */}
                      <div className="flex flex-col gap-1.5">
                        {user.email && (
                          <div className="flex items-center gap-2 text-xs text-on-surface-variant/60">
                            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        )}
                        {(user.city || user.country) && (
                          <div className="flex items-center gap-2 text-xs text-on-surface-variant/60">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">
                              {[user.city, user.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 items-center">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="rounded-xl font-bold flex-1"
                      onClick={() => navigate(`/profile/${user.id}`)}
                    >
                      View Profile
                    </Button>
                    <UserActions userId={user.id} compact />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State - Initial */}
        {!isLoading && !isError && displayUsers.length === 0 && !searchQuery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <UsersIcon className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">No Users Yet</h3>
            <p className="text-sm text-on-surface-variant/70 max-w-md mx-auto">
              Be the first to join the community and start connecting with others!
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
