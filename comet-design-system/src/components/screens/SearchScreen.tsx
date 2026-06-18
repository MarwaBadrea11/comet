import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'

const TAGS = ['#CelestialArt', '#DigitalModernism', '#AestheticTech', '#CreativeCoding', '#MinimalistVibe', '#CuratedLiving']

const GRID = [
  { id: 1, title: 'The Fluidity of Motion', author: '@stella_nova', desc: 'Exploring the intersection of generative art and digital textile design.', tall: true },
  { id: 2, title: 'Join the Orbital Design Collective', gradient: true, desc: 'A sanctuary for high-end digital curators. Over 12k active members.' },
  { id: 3, title: 'Architecture for the Void', author: '@julian_v', desc: '"Architecture is about the space inside, but the digital realm is about the light we allow to pass through."' },
  { id: 4, title: 'What lies beyond the horizon?', dark: true, desc: '4.2k Responses', prompt: true },
  { id: 5, title: 'Galaxy Pulse', stats: true },
  { id: 6, title: 'The Monochrome Aesthetic in 2024', author: '@editorial', desc: 'How minimalist color palettes are redefining the social landscape for premium brands.' },
]

export function SearchScreen() {
  const [activeTag, setActiveTag] = useState(TAGS[0])

  return (
    <div className="min-h-screen pb-20">
      {/* Hero */}
      <div className="pt-12 px-12 mb-12">
        <h1 className="text-[3.5rem] font-headline font-extrabold leading-tight tracking-tight bg-gradient-to-br from-on-surface to-primary bg-clip-text text-transparent mb-2">
          Discover the Galaxy
        </h1>
        <p className="text-on-surface-variant text-lg max-w-xl">Explore trending narratives, community pulses, and curated visual stories.</p>
      </div>

      {/* Trending tags */}
      <section className="px-12 mb-16">
        <div className="flex items-center gap-4 mb-6">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <h2 className="text-sm font-label font-bold uppercase tracking-widest text-on-surface-variant">Trending Now</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-8 py-3 rounded-full whitespace-nowrap font-headline font-bold transition-all ${activeTag === tag ? 'bg-white shadow-sm text-primary border border-outline-variant/10' : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry grid */}
      <section className="px-12">
        <div className="columns-3 gap-8">
          {GRID.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`break-inside-avoid mb-8 group relative overflow-hidden rounded-[2rem] cursor-pointer
                ${item.gradient ? 'bg-gradient-to-br from-[#6B46C0] to-indigo-900 p-8 text-white' : ''}
                ${item.dark ? 'relative overflow-hidden' : ''}
                ${item.stats ? 'bg-surface-container-low p-8 border border-white' : ''}
                ${!item.gradient && !item.dark && !item.stats ? 'bg-surface-container-lowest shadow-sm hover:shadow-lg transition-all duration-500' : ''}
              `}
            >
              {/* Visual placeholder */}
              {!item.gradient && !item.stats && (
                <div className={`w-full bg-gradient-to-br from-primary/20 to-[#00D4FF]/10 overflow-hidden ${item.tall ? 'aspect-[4/5]' : item.dark ? 'aspect-square' : 'aspect-video'}`}>
                  {item.dark && (
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-transparent to-transparent opacity-80" />
                  )}
                </div>
              )}

              <div className={`${!item.gradient && !item.stats ? 'p-8' : ''}`}>
                {item.gradient && (
                  <>
                    <span className="material-symbols-outlined text-indigo-200 mb-6 text-4xl block">diversity_2</span>
                    <h3 className="text-2xl font-headline font-extrabold mb-4 leading-tight">{item.title}</h3>
                    <p className="text-indigo-100 mb-8 font-light leading-relaxed">{item.desc}</p>
                    <Button variant="ghost" size="sm" className="w-full bg-white text-primary hover:bg-indigo-50">Apply to Join</Button>
                  </>
                )}

                {item.stats && (
                  <>
                    <div className="flex justify-between items-start mb-8">
                      <h4 className="font-headline font-bold text-lg text-on-surface">{item.title}</h4>
                      <span className="material-symbols-outlined text-[#00677e]" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                    </div>
                    <div className="space-y-5">
                      {[{ label: 'Active Explorers', val: '1.2M', w: '85%', color: 'bg-primary' },
                        { label: 'Visual Narratives', val: '342k', w: '62%', color: 'bg-[#00677e]' }].map(s => (
                        <div key={s.label}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-on-surface-variant">{s.label}</span>
                            <span className="text-sm font-headline font-bold text-primary">{s.val}</span>
                          </div>
                          <div className="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
                            <div className={`h-full ${s.color} rounded-full`} style={{ width: s.w }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {!item.gradient && !item.stats && !item.dark && (
                  <>
                    {item.author && <p className="text-xs font-label font-bold text-primary uppercase tracking-widest mb-3">{item.author}</p>}
                    <h3 className="text-xl font-headline font-bold mb-3 text-on-surface">{item.title}</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
                  </>
                )}

                {item.dark && (
                  <div className="absolute bottom-0 p-8">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-label font-bold text-white uppercase tracking-widest mb-3">Daily Prompt</span>
                    <h3 className="text-2xl font-headline font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/70 text-sm mb-4">{item.desc}</p>
                    <Button variant="ghost" size="sm" className="bg-white text-on-surface">Contribute</Button>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  )
}
