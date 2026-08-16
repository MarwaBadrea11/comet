import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, Users, FileText, Hash, X, Clock, Globe, UserCircle, MessageSquare, UsersRound } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Avatar } from '../ui/Avatar'
import { SegmentedControl } from '../ui/SegmentedControl'
import { useSearch, useSearchHistory, useDeleteHistoryItem, useClearAllHistory } from '../../hooks/useSearchQuery'

const TRENDING = ['#CelestialArt', '#DigitalModernism', '#AestheticTech', '#CreativeCoding', '#MinimalistVibe', '#CuratedLiving']

type SearchCategory = 'all' | 'users' | 'posts' | 'groups'

const CATEGORY_OPTIONS = [
  { value: 'all' as const, label: 'All', icon: <Globe size={16} /> },
  { value: 'users' as const, label: 'Users', icon: <UserCircle size={16} /> },
  { value: 'posts' as const, label: 'Posts', icon: <MessageSquare size={16} /> },
  { value: 'groups' as const, label: 'Groups', icon: <UsersRound size={16} /> },
]

// 400 ms debounce
function useDebounce<T>(value: T, ms: number) {
  const [d, setD] = useState(value)
  useEffect(() => { const t = setTimeout(() => setD(value), ms); return () => clearTimeout(t) }, [value, ms])
  return d
}

export function SearchScreen() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<SearchCategory>('all')
  const [activeTag, setActiveTag] = useState(TRENDING[0])

  const debouncedQuery = useDebounce(query, 400)

  // ── Queries & Mutations ────────────────────────────────────────────────────
  const { data: results, isFetching } = useSearch(debouncedQuery, category)
  const { data: history = [], isLoading: isLoadingHistory } = useSearchHistory()
  
  const deleteHistoryItem = useDeleteHistoryItem()
  const clearAllHistory   = useClearAllHistory()

  const hasResults = results && (
    (results.users?.length ?? 0) + (results.posts?.length ?? 0) +
    (results.groups?.length ?? 0)
  ) > 0

  return (
    <div className="flex-1 min-h-screen bg-surface-container-low/30 backdrop-blur-md pb-24">
      {/* Search Header */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 px-6 py-6 md:py-8 flex flex-col gap-6">
        <div className="max-w-3xl w-full mx-auto relative flex items-center">
          <Search className="absolute left-5 text-on-surface-variant/50 w-5 h-5" />
          <Input
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Search the cosmos for curators, concepts, or constellations..."
            className="w-full pl-14 pr-12 h-14 bg-surface-container-high/40 rounded-2xl border-none text-base focus-visible:ring-2 focus-visible:ring-primary/20 transition-all placeholder:text-on-surface-variant/40"
          />
          {isFetching && (
            <Loader2 className="absolute right-5 animate-spin text-primary w-5 h-5" />
          )}
        </div>

        {/* Category Selector */}
        {query.trim() && (
          <div className="max-w-3xl w-full mx-auto flex justify-center">
            <SegmentedControl
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
              size="md"
            />
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Main Column: Results or History */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* ── CASE 1: Empty Query -> Show Search History ── */}
          {!query.trim() && (
            <section className="bg-white/40 p-6 rounded-[2rem] border border-white/20 shadow-sm backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold font-headline uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                  <Clock size={16} /> Recent Searches
                </h3>
                {history.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => clearAllHistory.mutate()}
                    className="text-xs text-error hover:bg-error/10 font-bold"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {isLoadingHistory ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-primary/40" /></div>
              ) : history.length === 0 ? (
                <p className="text-xs text-on-surface-variant/50 italic p-2">No recent searches. Discover something new!</p>
              ) : (
                <div className="flex flex-col gap-2">
                  <AnimatePresence>
                    {history.map((item) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-high/40 transition-colors group cursor-pointer"
                        onClick={() => setQuery(item.query)}
                      >
                        <span className="text-sm text-on-surface-variant font-medium">{item.query}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHistoryItem.mutate(item.id);
                          }}
                          className="text-on-surface-variant/40 hover:text-error p-1 rounded-md transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>
          )}

          {/* ── CASE 2: Has Active Query & Results found ── */}
          {query.trim() && hasResults && (
            <div className="space-y-8">
              {/* Users Results */}
              {results?.users && results.users.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-xs font-extrabold font-headline uppercase tracking-widest text-on-surface-variant/60 flex items-center gap-2">
                    <Users size={14} /> Curators
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.users.map(u => (
                      <div key={u.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-white/40 shadow-sm hover:shadow-md transition-all duration-300">
                        <Avatar src={u.avatarMediaId || undefined} alt={u.name} size="md" className="border border-outline-variant/10 shadow-sm" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-on-surface">{u.name}</span>
                          <span className="text-xs text-on-surface-variant/60">@{u.username}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Posts Results */}
              {results?.posts && results.posts.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-xs font-extrabold font-headline uppercase tracking-widest text-on-surface-variant/60 flex items-center gap-2">
                    <FileText size={14} /> Content Drift
                  </h3>
                  <div className="space-y-4">
                    {results.posts.map(p => (
                      <div key={p.id} className="p-5 rounded-[2rem] bg-white/60 border border-white/40 shadow-sm hover:shadow-md transition-all duration-300">
                        <p className="text-sm text-on-surface leading-relaxed mb-3">{p.content}</p>
                        {p.user && <span className="text-xs font-bold text-primary">By {p.user.name}</span>}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ── CASE 3: Active Query but No Results ── */}
          {query.trim() && !hasResults && !isFetching && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-base font-bold text-on-surface mb-1">No signals detected</p>
              <p className="text-sm text-on-surface-variant/60 max-w-sm">We couldn't find anything matching "{query}" in this sector of the galaxy.</p>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar (Trending Tags) */}
        <div className="space-y-8">
          <section className="bg-white/40 p-6 rounded-[2rem] border border-white/20 shadow-sm backdrop-blur-sm">
            <h4 className="text-xs font-extrabold font-headline uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
              <Hash size={14} /> Cosmic Frequencies
            </h4>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map(tag => (
                <button
                  key={tag}
                  onClick={() => { setActiveTag(tag); setQuery(tag.replace('#', '')) }}
                  className={`text-xs px-4 py-2.5 rounded-xl font-medium tracking-wide border transition-all duration-300 ${
                    activeTag === tag
                      ? 'bg-primary text-on-primary border-primary shadow-sm shadow-primary/20 scale-[1.02]'
                      : 'bg-white/50 text-on-surface-variant border-outline-variant/20 hover:bg-white hover:border-outline-variant/40'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* Featured/Editorial Card */}
          <section className="bg-gradient-to-br from-primary/10 to-[#00D4FF]/5 p-8 rounded-[2rem] border border-white/40 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h4 className="text-xs font-extrabold font-headline uppercase tracking-widest text-primary mb-4">Editorial</h4>
            <h3 className="text-lg md:text-xl font-headline font-bold mb-3 text-on-surface leading-snug">The Architecture of Digital Light</h3>
            <p className="text-on-surface-variant/80 text-xs md:text-sm leading-relaxed mb-6">How minimalist glassmorphism is shaping backend interfaces for premium technical solutions.</p>
            <Button variant="secondary" size="sm" className="h-9 text-xs font-bold px-4 rounded-xl">Read Drift</Button>
          </section>
        </div>
      </main>
    </div>
  )
}