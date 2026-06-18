import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Toggle } from '../ui/Toggle'

const TABS = ['Portfolio', 'Collections', 'Artifacts']
const STATS = [
  { value: '124', label: 'Artifacts' },
  { value: '18.2k', label: 'Seekers' },
  { value: '842', label: 'Voyages' },
  { value: '4.9', label: 'Radiance' },
]
const GALLERY = [
  { id: 1, title: 'Prism Paradox', span: 'col-span-2 row-span-2', aspect: 'aspect-square' },
  { id: 2, title: 'Fluidity', span: '', aspect: 'aspect-[4/5]' },
  { id: 3, title: 'Monolith', span: '', aspect: 'aspect-[4/5]' },
  { id: 4, title: 'Circuit', span: '', aspect: 'aspect-square' },
  { id: 5, title: 'Cosmos', span: '', aspect: 'aspect-square' },
  { id: 6, title: 'Gradient', span: '', aspect: 'aspect-square' },
]

export function ProfileScreen() {
  const [tab, setTab] = useState('Portfolio')
  const [privateOrbit, setPrivateOrbit] = useState(true)
  const [showStats, setShowStats] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Cover */}
      <section className="relative h-[460px] w-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-primary/40 via-[#6B46C0]/60 to-[#00D4FF]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
      </section>

      {/* Profile identity */}
      <div className="px-16 -mt-32 relative z-10">
        <div className="flex items-end gap-12">
          <Avatar
            src="https://i.pravatar.cc/200?img=47"
            alt="Elena Solstice"
            size="xl"
            ring
            ringVariant="gradient"
            verified
            className="!w-48 !h-48"
          />
          <div className="pb-6 flex-1">
            <h1 className="text-6xl font-bold font-headline tracking-tighter text-on-surface mb-2">Elena Solstice</h1>
            <p className="text-xl font-body text-on-surface-variant max-w-md">Digital Alchemist & Celestial Voyager. Exploring the intersection of light and digital artifacts.</p>
          </div>
          <div className="pb-6 flex gap-3">
            <Button variant="primary" size="md">Follow</Button>
            <Button variant="secondary" size="md">Message</Button>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-12 gap-16 mt-20">
          {/* Left sidebar */}
          <aside className="col-span-3 space-y-10">
            <div className="bg-surface-container-highest/70 backdrop-blur-2xl p-8 rounded-[2rem] border border-outline-variant/15 shadow-[0_20px_40px_rgba(107,70,192,0.06)]">
              <h3 className="text-sm font-label uppercase tracking-widest text-on-surface-variant mb-6">Profile Settings</h3>
              <div className="space-y-5">
                <button className="w-full flex items-center justify-between group">
                  <span className="text-on-surface font-medium group-hover:text-primary transition-colors">Edit Identity</span>
                  <span className="material-symbols-outlined text-on-surface-variant">edit_note</span>
                </button>
                <div className="h-px bg-outline-variant/20" />
                <Toggle checked={privateOrbit} onChange={setPrivateOrbit} label="Private Orbit" description="Only followers can view" />
                <Toggle checked={showStats} onChange={setShowStats} label="Show Statistics" description="Display public metrics" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map(s => (
                <motion.div key={s.label} whileHover={{ y: -2 }} className="bg-surface-container-low p-6 rounded-2xl">
                  <span className="block text-3xl font-bold font-headline text-primary">{s.value}</span>
                  <span className="text-xs font-label uppercase text-on-surface-variant opacity-60">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </aside>

          {/* Gallery */}
          <div className="col-span-9 pb-20">
            <div className="flex items-center justify-between mb-12">
              <div className="flex gap-8">
                {TABS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`pb-2 font-bold transition-colors ${tab === t ? 'text-on-surface border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 text-primary font-bold">
                <Filter size={18} />
                <span className="text-sm uppercase tracking-wider">Sort by Aura</span>
              </button>
            </div>

            {/* Bento gallery */}
            <div className="grid grid-cols-3 gap-8">
              {GALLERY.map(item => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className={`group relative rounded-[2rem] overflow-hidden ${item.span} ${item.aspect} bg-gradient-to-br from-primary/20 to-[#00D4FF]/10 cursor-pointer`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6 flex flex-col justify-end">
                    <h4 className="text-white text-lg font-bold">{item.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative orbs */}
      <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-1/2 -left-32 w-64 h-64 bg-[#00677e]/10 rounded-full blur-[80px] pointer-events-none" />
    </div>
  )
}
