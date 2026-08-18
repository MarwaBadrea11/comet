import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, Mail, User, CheckCircle, XCircle, Calendar, Clock, X, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Avatar } from '../ui/Avatar'
import { useGlobalSearch, useSaveSearch, useSearchHistory, useDeleteHistoryItem, useClearAllHistory } from '../../hooks/useSearchQuery'

export function SearchScreen() {
  const navigate = useNavigate()
  const [emailInput, setEmailInput] = useState('')
  const [activeQuery, setActiveQuery] = useState('')

  const { data: results, isLoading, isError, error } = useGlobalSearch(activeQuery)
  const { data: history = [] } = useSearchHistory()
  const saveSearch = useSaveSearch()
  const deleteHistoryItem = useDeleteHistoryItem()
  const clearAllHistory = useClearAllHistory()

  const users = results?.users ?? []

  // Prefer an exact email match; fall back to the first user the query matched.
  const foundUser = activeQuery && users.length > 0
    ? users.find((u) => u.email?.toLowerCase() === activeQuery.toLowerCase()) || users[0]
    : null

  const runSearch = (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return
    setEmailInput(trimmed)
    setActiveQuery(trimmed)
    saveSearch.mutate({ query: trimmed, searchType: 'USERS' })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    runSearch(emailInput)
  }

  const handleClearSearch = () => {
    setEmailInput('')
    setActiveQuery('')
  }

  return (
    <div className="flex-1 min-h-screen bg-surface-container-low/30 backdrop-blur-md pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 px-6 py-6 md:py-8">
        <div className="max-w-3xl w-full mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="text-primary w-6 h-6" />
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">
              Search User by Email
            </h1>
          </div>
          <p className="text-sm text-on-surface-variant/70 mb-6">
            Enter an email address to find and view user profiles
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 w-5 h-5" />
              <Input
                type="email"
                value={emailInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailInput(e.target.value)}
                placeholder="user@example.com"
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
              disabled={!emailInput.trim() || isLoading}
              className="h-14 px-8 rounded-2xl font-bold"
            >
              Search
            </Button>

            {(emailInput || activeQuery) && (
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

          {/* Recent Searches */}
          {!activeQuery && history.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/60">Recent Searches</h3>
                <button
                  onClick={() => clearAllHistory.mutate()}
                  disabled={clearAllHistory.isPending}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-1.5 bg-surface-container-high/50 hover:bg-surface-container-high rounded-full pl-3 pr-1.5 py-1.5 transition-colors"
                    >
                      <button
                        onClick={() => runSearch(item.query)}
                        className="flex items-center gap-1.5 text-sm text-on-surface-variant"
                      >
                        <Clock size={12} className="opacity-50" />
                        {item.query}
                      </button>
                      <button
                        onClick={() => deleteHistoryItem.mutate(item.id)}
                        className="p-1 rounded-full hover:bg-surface-container-highest text-on-surface-variant/50 hover:text-error transition-colors"
                        aria-label="Remove from history"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
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
            <XCircle className="text-error w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-error mb-1">Search Failed</h3>
              <p className="text-sm text-on-surface-variant">
                {error instanceof Error ? error.message : 'Unable to search for user. Please try again.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* No Results State */}
        {!isLoading && !isError && !foundUser && activeQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/40 border border-white/20 rounded-2xl p-12 text-center"
          >
            <User className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-on-surface mb-2">No User Found</h3>
            <p className="text-sm text-on-surface-variant/70 max-w-md mx-auto">
              We couldn't find a user matching <span className="font-semibold text-on-surface">"{activeQuery}"</span>.
              Please check the email and try again.
            </p>
          </motion.div>
        )}

        {/* User Profile Card - Results */}
        {foundUser && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 border border-white/40 rounded-[2rem] shadow-lg overflow-hidden"
          >
            {/* Cover Section */}
            <div className="h-32 md:h-40 bg-gradient-to-br from-primary/20 via-[#00D4FF]/10 to-primary/30 relative">
              <div className="absolute -bottom-16 left-8">
                <Avatar
                  src={foundUser.avatar?.url}
                  alt={foundUser.name || 'User Avatar'}
                  size="xl"
                  className="border-4 border-white shadow-xl w-32 h-32"
                />
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface">
                      {foundUser.name || 'User Name'}
                    </h2>
                    {foundUser.role === 'ADMIN' && (
                      <CheckCircle className="text-primary w-6 h-6" aria-label="Verified" />
                    )}
                  </div>
                  {foundUser.username && (
                    <p className="text-base text-on-surface-variant/70 mb-1">@{foundUser.username}</p>
                  )}
                  {foundUser.email && (
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant/60">
                      <Mail className="w-4 h-4" />
                      <span>{foundUser.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    className="rounded-xl font-bold px-6"
                    onClick={() => navigate(`/profile/${foundUser.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>

              {/* Bio */}
              {foundUser.bio && (
                <div className="mb-6 p-4 bg-surface-container-high/20 rounded-xl">
                  <p className="text-sm text-on-surface-variant leading-relaxed">{foundUser.bio}</p>
                </div>
              )}

              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role */}
                {foundUser.role && (
                  <div className="flex items-start gap-3 p-4 bg-surface-container-high/20 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider mb-1">
                        Role
                      </p>
                      <p className="text-sm font-medium text-on-surface capitalize">
                        {foundUser.role.toLowerCase()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Member Since */}
                {foundUser.createdAt && (
                  <div className="flex items-start gap-3 p-4 bg-surface-container-high/20 rounded-xl">
                    <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-wider mb-1">
                        Member Since
                      </p>
                      <p className="text-sm font-medium text-on-surface">
                        {new Date(foundUser.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State - Initial */}
        {!activeQuery && !foundUser && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">Search for Users</h3>
            <p className="text-sm text-on-surface-variant/70 max-w-md mx-auto">
              Enter an email address above to search for a user and view their profile information.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
