import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { X, ChevronLeft, ChevronRight, Heart, Share2, Bookmark, Send } from 'lucide-react'
import { Avatar } from '../ui/Avatar'

const STORIES = [
  { id: 1, name: 'Elena Thorne', handle: '@elena_t', avatar: 'https://i.pravatar.cc/80?img=47', time: '2 hours ago', views: '1.2k', segments: 3, current: 1 },
  { id: 2, name: 'Marcus Sol', handle: '@marcus_sol', avatar: 'https://i.pravatar.cc/80?img=12', time: '4 hours ago', views: '892', segments: 2, current: 0 },
  { id: 3, name: 'Julian Voss', handle: '@julian_v', avatar: 'https://i.pravatar.cc/80?img=33', time: '6 hours ago', views: '445', segments: 4, current: 2 },
  { id: 4, name: 'Sophia Ray', handle: '@sophia_r', avatar: 'https://i.pravatar.cc/80?img=25', time: '8 hours ago', views: '2.1k', segments: 2, current: 0 },
  { id: 5, name: 'Liam Chen', handle: '@liam_c', avatar: 'https://i.pravatar.cc/80?img=8', time: '12 hours ago', views: '334', segments: 1, current: 0, viewed: true },
]

export function StoriesScreen() {
  const navigate = useNavigate()
  const [activeStory, setActiveStory] = useState(0)
  const story = STORIES[activeStory]

  return (
    <div className="min-h-screen bg-surface">
      {/* Story tray */}
      <section className="px-12 py-8">
        <div className="flex items-center gap-6 overflow-x-auto pb-4 hide-scrollbar">
          {/* Add story */}
          <div className="flex flex-col items-center gap-3 shrink-0 cursor-pointer">
            <div className="relative p-1 rounded-full bg-surface-container-highest">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white bg-surface-container-high flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 border-2 border-white">
                <span className="material-symbols-outlined text-sm">add</span>
              </div>
            </div>
            <span className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">Your Story</span>
          </div>

          {STORIES.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveStory(i)}>
              <Avatar src={s.avatar} alt={s.name} size="xl" ring ringVariant={s.viewed ? 'viewed' : 'gradient'} />
              <span className={`text-xs font-label font-bold uppercase tracking-widest ${s.viewed ? 'text-on-surface-variant' : 'text-primary'}`}>{s.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Story viewer overlay */}
      <AnimatePresence>
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-8 bg-black/80 backdrop-blur-[24px]"
        >
          {/* Close */}
          <button onClick={() => navigate(-1)} className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors">
            <X size={36} />
          </button>

          {/* Prev */}
          <button
            onClick={() => setActiveStory(s => Math.max(0, s - 1))}
            className="absolute left-12 p-4 rounded-full bg-[rgba(0,210,253,0.15)] backdrop-blur-xl border border-[rgba(0,210,253,0.2)] text-[#b4ebff] hover:scale-110 transition-transform"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next */}
          <button
            onClick={() => setActiveStory(s => Math.min(STORIES.length - 1, s + 1))}
            className="absolute right-12 p-4 rounded-full bg-[rgba(0,210,253,0.15)] backdrop-blur-xl border border-[rgba(0,210,253,0.2)] text-[#b4ebff] hover:scale-110 transition-transform"
          >
            <ChevronRight size={28} />
          </button>

          {/* Story card */}
          <div className="relative w-full max-w-lg aspect-[9/16] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/40 flex flex-col">
            {/* BG */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-[#00D4FF]/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

            {/* Progress bars */}
            <div className="relative z-10 p-6 flex gap-1">
              {Array.from({ length: story.segments }).map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div className={`h-full bg-white rounded-full ${i < story.current ? 'w-full' : i === story.current ? 'w-2/3' : 'w-0'}`} />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="relative z-10 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-headline font-bold text-sm">{story.name}</h4>
                  <span className="text-white/70 text-xs font-label">{story.time}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {[{ icon: 'visibility', val: story.views }, { icon: 'schedule', val: '14h' }].map(b => (
                  <div key={b.icon} className="bg-[rgba(0,210,253,0.15)] backdrop-blur-xl border border-[rgba(0,210,253,0.2)] px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#b4ebff]" style={{ fontVariationSettings: "'FILL' 1" }}>{b.icon}</span>
                    <span className="text-[#b4ebff] text-xs font-bold font-label">{b.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-grow" />

            {/* Reply */}
            <div className="relative z-10 p-6 pb-10">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-2 pl-5 rounded-full">
                <input className="bg-transparent border-none text-white placeholder-white/50 focus:ring-0 text-sm flex-grow font-body outline-none" placeholder="Send a reply..." />
                <button className="bg-primary text-white p-2.5 rounded-full flex items-center justify-center shadow-lg">
                  <Send size={16} />
                </button>
              </div>
              <div className="flex justify-around mt-6 text-white/80">
                {[{ icon: <Heart size={22} />, label: 'Like' },
                  { icon: <Share2 size={22} />, label: 'Share' },
                  { icon: <Bookmark size={22} />, label: 'Save' }].map(a => (
                  <button key={a.label} className="flex flex-col items-center gap-1 hover:text-white transition-colors group">
                    <span className="group-hover:scale-110 transition-transform">{a.icon}</span>
                    <span className="text-[10px] font-label font-bold uppercase tracking-tighter">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  )
}
