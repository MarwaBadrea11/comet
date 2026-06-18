import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ThumbsUp } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { motionVariants } from '../../lib/theme'

const COMMENTS = [
  {
    id: 1, author: 'Marcus Aris', time: '2h ago', avatar: 'https://i.pravatar.cc/48?img=12',
    text: 'This architectural approach is exactly what modern UI needs. The "No-Line" rule you\'ve implemented here feels so much more organic than the boxed-in grids we\'re used to.',
    likes: 42,
    replies: [
      { id: 11, author: 'Elena S.', time: '1h ago', avatar: 'https://i.pravatar.cc/40?img=47', text: 'Totally agree, Marcus! It\'s the difference between a textbook and an editorial gallery.' },
      { id: 12, author: 'David Chen', time: '45m ago', avatar: 'https://i.pravatar.cc/40?img=33', text: 'The way the shadows are diffused instead of being hard lines is what sells the premium feel for me.' },
    ],
  },
  {
    id: 2, author: 'Sasha Bloom', time: '3h ago', avatar: 'https://i.pravatar.cc/48?img=25',
    text: 'Wait until you see how this looks on high-DPI displays. The tonal shifts from surface to surface_container_low are just *chef\'s kiss*.',
    likes: 12, replies: [],
  },
]

export function PostDetailScreen() {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)

  return (
    <div className="max-w-4xl mx-auto py-12 px-8 pb-32">
      {/* Back */}
      <div className="mb-10 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface-container-low rounded-full transition-colors">
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <span className="text-sm font-medium text-on-surface-variant">Back to Universe Feed</span>
      </div>

      {/* Post card */}
      <motion.article {...motionVariants.fadeIn} className="bg-surface-container-lowest rounded-[2.5rem] p-10 relative mb-16 shadow-[0_20px_40px_rgba(107,70,192,0.06)] overflow-visible">
        {/* Asymmetric avatar */}
        <div className="absolute -top-6 -left-6 h-20 w-20 rounded-3xl bg-surface-container-lowest p-1.5 shadow-xl">
          <Avatar src="https://i.pravatar.cc/80?img=47" alt="Julianne V. Cosmo" size="lg" className="rounded-2xl" />
        </div>

        <div className="pl-12">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold font-headline text-on-surface">Julianne V. Cosmo</h2>
              <p className="text-on-surface-variant text-sm">Posted 4 hours ago in <span className="text-primary font-semibold">Digital Aesthetics</span></p>
            </div>
            <button className="text-on-surface-variant hover:text-primary transition-colors"><MoreHorizontal size={20} /></button>
          </div>

          <h1 className="text-4xl font-extrabold font-headline text-primary mb-6 tracking-tight">
            The Geometry of Silence: A Deep Dive into Celestial Architecture
          </h1>
          <p className="text-lg font-body text-on-surface-variant leading-relaxed mb-10">
            Today I'm exploring how we can use negative space to create a sense of vastness in digital canvases. It's not about what you add, but what you leave out. We often feel the need to fill every pixel, but the eye needs a place to rest—a celestial harbor in a sea of data.
          </p>

          {/* Media */}
          <div className="rounded-3xl overflow-hidden mb-10 bg-gradient-to-br from-primary/20 to-[#00D4FF]/10 aspect-[16/10] flex items-center justify-center">
            <span className="material-symbols-outlined text-8xl text-primary/20">image</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-8 py-6 border-t border-surface-container-low">
            {[
              { icon: <Heart size={20} fill={liked ? 'currentColor' : 'none'} />, label: '1.2k', active: liked, action: () => setLiked(v => !v) },
              { icon: <MessageCircle size={20} />, label: '432', active: false, action: () => {} },
              { icon: <Share2 size={20} />, label: '89', active: false, action: () => {} },
            ].map((a, i) => (
              <button key={i} onClick={a.action} className={`flex items-center gap-2 group cursor-pointer transition-colors ${a.active ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-container-low group-hover:bg-primary/10 transition-colors">
                  {a.icon}
                </div>
                <span className="font-bold text-on-surface">{a.label}</span>
              </button>
            ))}
            <div className="ml-auto">
              <Button variant="secondary" size="sm" icon={<Bookmark size={16} />}>Save for later</Button>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Comments */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight">The Conversation</h3>
          <Button variant="ghost" size="sm" icon={<MessageCircle size={16} />}>Start Discussion</Button>
        </div>

        <div className="bg-surface-container-low rounded-[2.5rem] p-8 space-y-8">
          {COMMENTS.map(c => (
            <div key={c.id}>
              <div className="flex gap-6 mb-4">
                <Avatar src={c.avatar} alt={c.author} size="md" className="rounded-2xl shrink-0" />
                <div className="flex-1">
                  <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-white/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-on-surface">{c.author}</span>
                      <span className="text-xs text-on-surface-variant">{c.time}</span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">{c.text}</p>
                    <div className="mt-4 flex items-center gap-6">
                      <button className="text-primary text-sm font-bold flex items-center gap-1"><ThumbsUp size={14} /> {c.likes}</button>
                      <button className="text-on-surface-variant text-sm font-bold hover:text-primary">Reply</button>
                    </div>
                  </div>

                  {/* Replies */}
                  {c.replies.length > 0 && (
                    <div className="mt-6 ml-12 space-y-6 relative">
                      <div className="absolute left-[-2rem] top-0 bottom-8 w-0.5 bg-gradient-to-b from-primary/20 to-transparent" />
                      {c.replies.map(r => (
                        <div key={r.id} className="flex gap-4">
                          <Avatar src={r.avatar} alt={r.author} size="sm" className="rounded-xl shrink-0" />
                          <div className="flex-1 bg-surface-container-lowest/60 p-5 rounded-2xl shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-on-surface text-sm">{r.author}</span>
                              <span className="text-xs text-on-surface-variant">{r.time}</span>
                            </div>
                            <p className="text-on-surface-variant text-sm leading-relaxed">{r.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button className="text-primary font-bold px-10 py-3 rounded-full hover:bg-white transition-colors">
              View 384 more thoughts
            </button>
          </div>
        </div>
      </section>

      {/* Sticky action bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-[calc(50%-9rem)] z-50">
        <div className="bg-on-surface/90 backdrop-blur-xl text-white px-8 py-4 rounded-full flex items-center gap-10 shadow-2xl shadow-primary/20">
          {[{ icon: <Heart size={18} fill="currentColor" />, label: 'Like' },
            { icon: <MessageCircle size={18} />, label: 'Comment' },
            { icon: <Share2 size={18} />, label: 'Share' }].map((a, i) => (
            <button key={i} className="flex items-center gap-2 hover:text-primary transition-colors">
              {a.icon}
              <span className="text-sm font-bold">{a.label}</span>
              {i < 2 && <div className="w-px h-4 bg-white/20 ml-10" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
