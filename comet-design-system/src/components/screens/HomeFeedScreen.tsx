import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, MoreHorizontal, Rocket } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { motionVariants } from '../../lib/theme'

const STORIES = [
  { name: 'Elena',  avatar: 'https://i.pravatar.cc/80?img=47', viewed: false },
  { name: 'Marcus', avatar: 'https://i.pravatar.cc/80?img=12', viewed: false },
  { name: 'Julian', avatar: 'https://i.pravatar.cc/80?img=33', viewed: false },
  { name: 'Sophia', avatar: 'https://i.pravatar.cc/80?img=25', viewed: false },
  { name: 'Liam',   avatar: 'https://i.pravatar.cc/80?img=8',  viewed: true  },
]

const FEED = [
  { id: 1, author: 'Elena Vane',   handle: 'Stellar Photographer', time: '2h ago', avatar: 'https://i.pravatar.cc/80?img=47', title: 'Synthetica: The Digital Frontier',              body: 'The evolution of generative aesthetics has reached a boiling point. Today we explore how neural networks are not just mimicking light, but reimagining the physics of color itself.', likes: '1.2k', comments: 84,  shares: 12, tag: 'Curated Art'  },
  { id: 2, author: 'Marcus Sol',   handle: 'Architect & Visionary', time: '4h ago', avatar: 'https://i.pravatar.cc/80?img=12', title: 'Architecture for the Void: Lunar Habitats',     body: 'As we pivot toward permanent lunar settlements, the design language of gravity-neutral living space is being written in real time.',                                                  likes: '892',  comments: 56,  shares: 8,  tag: 'Architecture' },
]

const TRENDING = [
  { tag: '#CelestialDesign',  desc: 'The rise of ethereal interfaces in 2024.',              count: '4.2k'  },
  { tag: '#SyntheticaArt',    desc: 'Artists using the new Flux model for worldbuilding.',   count: '12.8k' },
  { tag: '#MarsColonyOne',    desc: 'Updates from the Bradbury Base deployment.',            count: '894'   },
  { tag: '#GlassMorphism',    desc: 'How transparency is changing mobile depth.',            count: '2.1k'  },
]

export function HomeFeedScreen() {
  const navigate = useNavigate()
  const [liked, setLiked] = useState<Record<number, boolean>>({})

  return (
    // Responsive: single column on mobile, two-column on xl
    <div className="flex flex-col xl:grid xl:grid-cols-12 min-h-screen">

      {/* ── Center feed ── */}
      <div className="xl:col-span-8 px-4 sm:px-6 lg:px-10 xl:px-12 py-6 lg:py-10">
        <div className="max-w-3xl mx-auto flex flex-col gap-10 lg:gap-16">

          {/* Greeting */}
          <motion.div {...motionVariants.fadeIn}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">
              Morning, Alex.
            </h2>
            <p className="text-base lg:text-lg text-on-surface-variant">
              Here is what the universe has curated for you today.
            </p>
          </motion.div>

          {/* Stories tray */}
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 hide-scrollbar">
            <div
              className="flex flex-col items-center gap-2 shrink-0 cursor-pointer"
              onClick={() => navigate('/stories')}
            >
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-surface-container-high flex items-center justify-center border-2 border-dashed border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-lg">add</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-label font-bold uppercase tracking-widest text-on-surface-variant">
                Your Story
              </span>
            </div>
            {STORIES.map(s => (
              <div
                key={s.name}
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer"
                onClick={() => navigate('/stories')}
              >
                <Avatar
                  src={s.avatar}
                  alt={s.name}
                  size="lg"
                  ring
                  ringVariant={s.viewed ? 'viewed' : 'gradient'}
                />
                <span className={`text-[9px] sm:text-[10px] font-label font-bold uppercase tracking-widest ${s.viewed ? 'text-on-surface-variant' : 'text-primary'}`}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>

          {/* Feed items */}
          <div className="flex flex-col gap-16 lg:gap-24">
            {FEED.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="relative group cursor-pointer"
                onClick={() => navigate('/post/1')}
              >
                {/* Asymmetric avatar — hidden on very small screens */}
                <div className="hidden sm:block absolute -left-4 lg:-left-6 -top-4 lg:-top-6 z-10">
                  <Avatar src={post.avatar} alt={post.author} size="lg" />
                </div>

                <div className="bg-surface-container-lowest rounded-2xl lg:rounded-3xl shadow-[0_20px_40px_rgba(107,70,192,0.06)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(107,70,192,0.1)]">
                  <div className="aspect-[16/9] sm:aspect-[16/10] bg-gradient-to-br from-primary/20 to-[#00D4FF]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl lg:text-6xl text-primary/20">image</span>
                  </div>
                  <div className="p-5 sm:p-6 lg:p-8">
                    {/* Mobile: show avatar inline */}
                    <div className="flex items-center gap-3 mb-3 sm:hidden">
                      <Avatar src={post.avatar} alt={post.author} size="sm" />
                      <div>
                        <p className="text-sm font-bold text-on-surface">{post.author}</p>
                        <p className="text-[10px] text-on-surface-variant">{post.time}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-start mb-3 lg:mb-4">
                      <div className="sm:ml-10 lg:ml-12">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-headline font-bold text-on-surface mb-1">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-label font-semibold text-primary uppercase tracking-widest">
                          <span>{post.tag}</span>
                          <span className="w-1 h-1 bg-primary/30 rounded-full" />
                          <span>{post.time}</span>
                        </div>
                      </div>
                      <button
                        className="text-on-surface-variant hover:text-primary transition-colors shrink-0"
                        onClick={e => e.stopPropagation()}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    <p className="text-on-surface-variant leading-relaxed text-sm lg:text-base mb-5 lg:mb-8 line-clamp-3">
                      {post.body}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-surface-container-low">
                      <div className="flex gap-4 lg:gap-6">
                        <button
                          className={`flex items-center gap-1.5 font-bold text-sm transition-colors ${liked[post.id] ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                          onClick={e => { e.stopPropagation(); setLiked(l => ({ ...l, [post.id]: !l[post.id] })) }}
                        >
                          <Heart size={16} fill={liked[post.id] ? 'currentColor' : 'none'} />
                          <span className="hidden sm:inline">{post.likes}</span>
                        </button>
                        <button
                          className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-bold text-sm transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          <MessageCircle size={16} />
                          <span className="hidden sm:inline">{post.comments}</span>
                        </button>
                        <button
                          className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-bold text-sm transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          <Rocket size={16} />
                          <span className="hidden sm:inline">{post.shares}</span>
                        </button>
                      </div>
                      <Badge variant="outline" size="sm">{post.handle}</Badge>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right sidebar — hidden on mobile/tablet, visible on xl ── */}
      <aside className="hidden xl:block xl:col-span-4 px-6 py-10 bg-surface-container-low/50 min-h-screen border-l border-outline-variant/10">
        <div className="flex flex-col gap-8 sticky top-24">

          {/* Time Capsule */}
          <section className="bg-white/70 backdrop-blur-2xl p-5 rounded-2xl border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-sm font-bold font-headline uppercase tracking-widest text-on-surface-variant">Time Capsule</h4>
              <span className="material-symbols-outlined text-primary text-xl">schedule</span>
            </div>
            {[
              { month: 'OCT', day: '24', title: 'Digital Renaissance Keynote', time: '09:00 PM' },
              { month: 'OCT', day: '26', title: 'Vector Void Launch',          time: 'Draft • Edit', dim: true },
            ].map(item => (
              <div key={item.day} className={`flex items-center gap-3 group cursor-pointer mb-4 ${item.dim ? 'opacity-60' : ''}`}>
                <div className="w-11 h-11 rounded-xl bg-primary-fixed flex flex-col items-center justify-center text-primary font-bold shrink-0">
                  <span className="text-[10px]">{item.month}</span>
                  <span className="text-base leading-none">{item.day}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{item.title}</p>
                  <p className="text-xs text-on-surface-variant">{item.time}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Trending */}
          <section>
            <h4 className="text-sm font-bold font-headline uppercase tracking-widest text-on-surface-variant mb-5">Trending in the Cosmos</h4>
            <div className="flex flex-col gap-4">
              {TRENDING.map(t => (
                <div key={t.tag} className="flex flex-col cursor-pointer group">
                  <span className="text-xs text-primary font-bold mb-0.5 group-hover:underline">{t.tag}</span>
                  <span className="text-sm font-medium text-on-surface">{t.desc}</span>
                  <span className="text-[10px] text-on-surface-variant mt-0.5 uppercase font-bold">{t.count} Curations</span>
                </div>
              ))}
            </div>
          </section>

          {/* Suggested */}
          <section className="bg-surface-container-high/40 p-5 rounded-2xl border border-white/20">
            <h4 className="text-sm font-bold font-headline uppercase tracking-widest text-on-surface-variant mb-5">Celestial Curators</h4>
            <div className="flex flex-col gap-4">
              {[
                { name: 'Marcus Sol', avatar: 'https://i.pravatar.cc/40?img=12' },
                { name: 'Luna Ray',   avatar: 'https://i.pravatar.cc/40?img=25' },
              ].map(u => (
                <div key={u.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={u.avatar} alt={u.name} size="sm" />
                    <span className="text-sm font-bold">{u.name}</span>
                  </div>
                  <Button variant="secondary" size="sm">Orbit</Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
