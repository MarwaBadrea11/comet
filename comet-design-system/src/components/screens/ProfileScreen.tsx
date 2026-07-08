import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, Loader2 } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Toggle } from '../ui/Toggle'
import { useMe } from '../../hooks/useUserQuery'
import { usePostsByUsername } from '../../hooks/usePostsQuery'
import { useAuthStore } from '../../stores/authStore'
import { useUIStore } from '../../stores/uiStore'

const TABS = ['Portfolio', 'Collections', 'Artifacts']

export function ProfileScreen() {
  const user = useAuthStore(s => s.user)
  const { theme } = useUIStore()

  const [tab, setTab]               = useState('Portfolio')
  const [privateOrbit, setPrivateOrbit] = useState(false)
  const [showStats, setShowStats]   = useState(true)

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: profile, isLoading: loadingProfile } = useMe()
  const { data: allPosts = [], isLoading: loadingPosts } = usePostsByUsername(profile?.name ?? '')

  const posts = allPosts.filter(p => p.type === 'POST')

  const displayName = profile?.name ?? user?.name ?? 'Comet User'
  const avatarSrc   = profile?.avatar
    ?? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Cover */}
      <section className="relative h-[460px] w-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-primary/40 via-[#6B46C0]/60 to-[#00D4FF]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
      </section>

      <div className="px-6 md:px-16 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-12">
          <Avatar src={avatarSrc} alt={displayName} size="xl" ring ringVariant="gradient" className="!w-32 !h-32 md:!w-48 md:!h-48" />
          <div className="pb-0 md:pb-6 flex-1">
            <h1 className="text-3xl md:text-6xl font-bold font-headline tracking-tighter text-on-surface mb-2">{displayName}</h1>
            {(profile?.city || profile?.country) && (
              <p className="text-sm md:text-base text-on-surface-variant">{[profile?.city, profile?.country].filter(Boolean).join(', ')}</p>
            )}
            {profile?.email && <p className="text-sm text-on-surface-variant/70 mt-1">{profile.email}</p>}
          </div>
          <div className="pb-0 md:pb-6 flex gap-3">
            <Button variant="primary" size="md">Edit Profile</Button>
            <Button variant="secondary" size="md">Share</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mt-12 md:mt-20">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-10">
            <div className="bg-surface-container-highest/70 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-outline-variant/15 shadow-[0_20px_40px_rgba(107,70,192,0.06)]">
              <h3 className="text-sm font-label uppercase tracking-widest text-on-surface-variant mb-6">Profile Settings</h3>
              <div className="space-y-5">
                <button className="w-full flex items-center justify-between group">
                  <span className="text-on-surface font-medium group-hover:text-primary transition-colors">Edit Identity</span>
                  <span className="material-symbols-outlined text-on-surface-variant">edit_note</span>
                </button>
                <div className="h-px bg-outline-variant/20" />
                <Toggle checked={privateOrbit} onChange={setPrivateOrbit} label="Private Orbit" description="Only followers can view" />
                <Toggle checked={showStats}    onChange={setShowStats}    label="Show Statistics" description="Display public metrics" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: loadingPosts ? '…' : String(posts.length), label: 'Posts'  },
                { value: profile?.gender ?? '–',                    label: 'Gender' },
              ].map(s => (
                <motion.div key={s.label} whileHover={{ y: -2 }} className="bg-surface-container-low p-6 rounded-2xl">
                  <span className="block text-2xl md:text-3xl font-bold font-headline text-primary">{s.value}</span>
                  <span className="text-xs font-label uppercase text-on-surface-variant opacity-60">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </aside>

          {/* Gallery */}
          <div className="lg:col-span-9 pb-20">
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <div className="flex gap-4 md:gap-8">
                {TABS.map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`pb-2 font-bold transition-colors ${tab === t ? 'text-on-surface border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 text-primary font-bold">
                <Filter size={18} />
                <span className="text-sm uppercase tracking-wider hidden sm:inline">Sort by Aura</span>
              </button>
            </div>

            {loadingPosts ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant/20">
                <p className="text-on-surface-variant text-sm font-medium">No posts yet. Start sharing!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                {posts.map(post => (
                  <motion.div key={post.id} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="group relative rounded-[2rem] overflow-hidden aspect-square bg-gradient-to-br from-primary/20 to-[#00D4FF]/10 cursor-pointer">
                    {post.media?.[0] ? (
                      <img src={post.media[0].url} alt={post.content} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <p className="text-xs font-medium text-on-surface-variant text-center line-clamp-4">{post.content}</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4 flex flex-col justify-end">
                      <p className="text-white text-xs font-bold line-clamp-2">{post.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-1/2 -left-32 w-64 h-64 bg-[#00677e]/10 rounded-full blur-[80px] pointer-events-none" />
    </div>
  )
}
