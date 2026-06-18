import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Rocket, Trash2, Image } from 'lucide-react'
import { Button } from '../ui/Button'
import { motionVariants } from '../../lib/theme'

interface Props { open: boolean; onClose: () => void }

const VISIBILITY = [
  { id: 'universal', label: 'Universal', desc: 'Visible to every curator in the galaxy.', icon: 'public' },
  { id: 'circle',    label: 'Inner Circle', desc: 'Only shared with your trusted satellite groups.', icon: 'group_work' },
  { id: 'private',   label: 'Private Drift', desc: 'Stored in your personal archive only.', icon: 'lock' },
]

export function CreatePostModal({ open, onClose }: Props) {
  const [visibility, setVisibility] = useState('universal')

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div {...motionVariants.modalBackdrop} className="fixed inset-0 z-[100] bg-on-surface/10 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            {...motionVariants.scaleIn}
            className="fixed inset-0 z-[101] flex items-center justify-center p-8"
          >
            <div className="bg-white/80 backdrop-blur-2xl w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(107,70,192,0.15)] flex flex-col overflow-hidden border border-outline-variant/15">
              {/* Header */}
              <div className="px-10 py-8 flex items-center justify-between border-b border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary-fixed">
                    <span className="material-symbols-outlined text-primary text-3xl">auto_fix_high</span>
                  </div>
                  <div>
                    <h2 className="font-headline text-2xl font-bold text-on-surface">New Cosmic Thread</h2>
                    <p className="text-sm text-on-surface-variant">Staging your masterpiece for the curated feed.</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-12 h-12 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-10 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Left: editor */}
                  <div className="lg:col-span-7 space-y-8">
                    <div className="space-y-3">
                      <label className="font-label text-xs tracking-widest text-on-surface-variant/70 uppercase">Editorial Content</label>
                      <div className="bg-surface-container-low/50 rounded-2xl p-6 focus-within:bg-white focus-within:ring-1 focus-within:ring-primary/20 transition-all min-h-[180px]">
                        <textarea
                          className="w-full h-32 bg-transparent border-none resize-none focus:ring-0 text-lg leading-relaxed placeholder:text-outline/50 font-body outline-none"
                          placeholder="What's happening in your corner of the universe?"
                        />
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-outline-variant/20">
                          {['format_bold', 'format_italic', 'link', 'sentiment_satisfied'].map(icon => (
                            <button key={icon} className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors">
                              <span className="material-symbols-outlined text-xl">{icon}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Media upload */}
                    <div className="space-y-4">
                      <label className="font-label text-xs tracking-widest text-on-surface-variant/70 uppercase">Visual Assets</label>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="aspect-square rounded-2xl bg-surface-container-low border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-surface-container transition-colors group">
                          <Image size={24} className="text-primary/40 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-primary/60">UPLOAD</span>
                        </div>
                        {[1, 2].map(i => (
                          <div key={i} className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-[#00D4FF]/10" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: settings */}
                  <div className="lg:col-span-5 space-y-8">
                    {/* Schedule */}
                    <div className="space-y-5 bg-surface-container-low/30 p-6 rounded-3xl">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                        <h3 className="font-headline font-bold text-lg">Time Capsule</h3>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Schedule your content to align with peak cosmic resonance.</p>
                      <div className="grid grid-cols-2 gap-4">
                        {[{ label: 'DATE', value: 'Oct 24, 2024', icon: 'calendar_today' },
                          { label: 'TIME', value: '09:30 AM', icon: 'alarm' }].map(f => (
                          <div key={f.label} className="space-y-2">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider pl-1">{f.label}</label>
                            <div className="relative">
                              <input className="w-full bg-white border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 shadow-sm outline-none" defaultValue={f.value} />
                              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg">{f.icon}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visibility */}
                    <div className="space-y-4">
                      <label className="font-label text-xs tracking-widest text-on-surface-variant/70 uppercase block">Visibility Radius</label>
                      {VISIBILITY.map(v => (
                        <label key={v.id} className={`flex items-center p-4 bg-white rounded-2xl border cursor-pointer transition-all shadow-sm ${visibility === v.id ? 'border-primary/30' : 'border-transparent hover:border-primary/20'}`}>
                          <input type="radio" name="visibility" checked={visibility === v.id} onChange={() => setVisibility(v.id)} className="w-5 h-5 text-primary" />
                          <div className="ml-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{v.label}</span>
                              <span className="material-symbols-outlined text-sm text-on-surface-variant">{v.icon}</span>
                            </div>
                            <p className="text-[10px] text-on-surface-variant">{v.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-10 py-6 bg-surface-container-low/20 border-t border-outline-variant/10 flex items-center justify-between">
                <button className="flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors font-medium">
                  <Trash2 size={18} /> Discard Draft
                </button>
                <div className="flex items-center gap-6">
                  <button className="text-on-surface font-bold hover:underline underline-offset-4">Save Progress</button>
                  <Button variant="primary" size="md" icon={<Rocket size={18} />} iconPosition="right" onClick={onClose}>
                    Post Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
