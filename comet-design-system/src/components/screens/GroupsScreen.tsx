import { motion } from 'framer-motion'
import { Plus, Users } from 'lucide-react'
import { Button } from '../ui/Button'

const MY_GROUPS = [
  { id: 1, name: 'Design Thinking Lab', members: '1.2k', role: 'Admin' },
  { id: 2, name: 'The Syntax Society', members: '842', role: 'Moderator' },
  { id: 3, name: 'Architectural Soul', members: '3.5k', role: null },
]

const DISCOVER = [
  { id: 1, name: 'Culinaria Collective', members: '12k', category: 'Culture & Arts', desc: 'A high-end sanctuary for food enthusiasts exploring the intersection of art and gastronomy.' },
  { id: 2, name: 'Nebula Devs', members: '5.2k', category: 'Technology', desc: 'Pushing the boundaries of decentralized experiences through collective celestial engineering.' },
  { id: 3, name: 'Ethereal Nature', members: '8.9k', category: 'Environment', desc: 'Documenting the quiet, atmospheric beauty of our planet\'s most hidden landscapes.' },
]

const FILTERS = ['All', 'Creative', 'Tech', 'Nature']

export function GroupsScreen() {
  return (
    <div className="p-12 min-h-screen">
      {/* My Groups */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-2 block font-label">Your Inner Circles</span>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">My Groups</h2>
          </div>
          <button className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View all <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-6 hide-scrollbar">
          {MY_GROUPS.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex-none w-80 group cursor-pointer"
            >
              <div className="h-56 w-full rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-primary/30 to-[#00D4FF]/20 relative">
                {g.role && (
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 backdrop-blur-md border text-white text-[10px] font-bold uppercase tracking-widest rounded-full ${g.role === 'Admin' ? 'bg-white/20 border-white/20' : 'bg-primary/40 border-primary/30'}`}>
                      {g.role}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="font-headline font-bold text-lg mb-1">{g.name}</h3>
              <p className="text-on-surface-variant text-sm flex items-center gap-2">
                <Users size={14} /> {g.members} Members
              </p>
            </motion.div>
          ))}

          {/* Create placeholder */}
          <div className="flex-none w-80">
            <button className="h-56 w-full rounded-2xl border-2 border-dashed border-outline-variant/30 bg-surface-container-low flex flex-col items-center justify-center gap-4 group hover:bg-surface-container transition-colors duration-300">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={20} />
              </div>
              <span className="text-sm font-bold text-on-surface-variant">Create New Group</span>
            </button>
          </div>
        </div>
      </section>

      {/* Discover */}
      <section>
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-[#00677e] font-semibold tracking-[0.2em] uppercase text-xs mb-2 block font-label">Expand Your Universe</span>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">Discover Communities</h2>
          </div>
          <div className="flex gap-2">
            {FILTERS.map((f, i) => (
              <button key={f} className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${i === 0 ? 'bg-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {DISCOVER.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className="group relative bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              <div className="h-64 bg-gradient-to-br from-primary/20 to-[#00D4FF]/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
              </div>
              <div className="p-8 relative -mt-8 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="w-8 h-8 rounded-full border-2 border-white bg-surface-container-high" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-on-surface-variant">+{g.members} joined</span>
                </div>
                <h4 className="font-headline text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{g.name}</h4>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{g.desc}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{g.category}</span>
                  <Button variant="primary" size="sm">Join Group</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="mt-24 mb-12">
        <div className="bg-surface-container-low rounded-[2rem] p-16 flex flex-col lg:flex-row items-center gap-20 overflow-hidden relative">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
          <div className="lg:w-1/2 relative z-10">
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Curated Focus</span>
            <h2 className="font-headline text-5xl font-extrabold mb-8 leading-tight">Create your own constellation.</h2>
            <p className="text-on-surface-variant mb-12 leading-loose max-w-lg">Bring your community to life with Comet's high-fidelity group tools. Designed for those who value depth and intentional connection.</p>
            <div className="flex gap-6">
              <Button variant="primary" size="lg">Start a Group</Button>
              <Button variant="secondary" size="lg">Learn More</Button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="w-full max-w-sm aspect-square bg-gradient-to-br from-primary/20 to-[#00D4FF]/10 rounded-[3rem] shadow-2xl rotate-3 translate-x-12 translate-y-6" />
          </div>
        </div>
      </section>
    </div>
  )
}
