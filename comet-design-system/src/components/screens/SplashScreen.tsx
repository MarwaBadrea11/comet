import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { motionVariants } from '../../lib/theme'

export function SplashScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface overflow-hidden flex flex-col relative">
      {/* Ambient orbs */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[120px] bg-primary/10 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[100px] bg-[#00D4FF]/10 pointer-events-none" />

      {/* Nav */}
      <nav className="flex items-center justify-between px-12 py-8 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#6B46C0] to-[#00D4FF] rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(107,70,192,0.2)]">
            <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
          </div>
          <span className="font-headline font-extrabold text-2xl tracking-tighter text-on-surface">Comet</span>
        </div>
        <div className="flex items-center gap-10">
          <a className="text-sm font-label font-semibold tracking-widest text-on-surface-variant hover:text-primary transition-colors uppercase" href="#">Explore</a>
          <a className="text-sm font-label font-semibold tracking-widest text-on-surface-variant hover:text-primary transition-colors uppercase" href="#">Curations</a>
          <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6">
        {/* Floating card left */}
        <motion.div
          initial={{ opacity: 0, x: -40, rotate: -3 }}
          animate={{ opacity: 1, x: 0, rotate: -3 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute top-[15%] left-[10%] w-64 p-6 bg-white/70 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(107,70,192,0.06)] border border-white/20 hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden">
              <img src="https://i.pravatar.cc/40?img=5" alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-label font-bold text-on-surface uppercase tracking-wider">Top Curator</p>
              <p className="text-xs text-on-surface-variant">@celestial_eye</p>
            </div>
          </div>
          <div className="h-24 w-full rounded-xl bg-gradient-to-br from-primary/20 to-[#00D4FF]/20" />
        </motion.div>

        {/* Floating card right */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 2 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-[20%] right-[10%] w-72 p-6 bg-white/70 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(107,70,192,0.06)] border border-white/20 hidden lg:block"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="material-symbols-outlined text-[#00677e]">auto_awesome</span>
            <span className="text-[10px] font-label font-bold text-[#00677e] uppercase tracking-widest">Trending Now</span>
          </div>
          <h3 className="font-headline font-bold text-on-surface text-lg leading-tight mb-2">The Digital Renaissance</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">Exploring the intersection of human touch and AI precision.</p>
        </motion.div>

        {/* Main content */}
        <motion.div {...motionVariants.slideUp} className="text-center relative z-10 max-w-4xl mx-auto">
          <div className="mb-12 inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full border border-outline/5">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-[10px] font-label font-bold tracking-[0.2em] text-primary uppercase">The New Standard for Curators</span>
          </div>

          <h1 className="font-headline text-[3.5rem] md:text-[5.5rem] font-extrabold leading-[0.95] tracking-[-0.04em] mb-8">
            Connect. Create.<br />
            <span className="bg-gradient-to-r from-[#6B46C0] via-primary to-[#00D4FF] bg-clip-text text-transparent">Comet.</span>
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant max-w-xl mx-auto mb-12 leading-relaxed">
            Step into a digital gallery designed for depth. A space where your perspective isn't just content—it's a celestial event.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={20} />}
              iconPosition="right"
              onClick={() => navigate('/onboarding')}
            >
              Launch Experience
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-outline/5 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-error relative">
            <span className="absolute inset-0 rounded-full bg-error animate-ping" />
          </span>
          <span className="text-xs font-bold text-on-surface">Modern Minimalism Summit — Live</span>
        </div>
        <div className="flex items-center gap-8 text-xs font-label font-bold text-on-surface-variant/70 tracking-widest uppercase">
          {['Terms', 'Privacy', 'Twitter', 'Instagram'].map(l => (
            <a key={l} className="hover:text-primary transition-colors" href="#">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
