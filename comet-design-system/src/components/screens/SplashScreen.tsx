import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { motionVariants } from '../../lib/theme'
import logoImg from '../../assets/logo.png'

export function SplashScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface overflow-hidden flex flex-col relative">
      {/* Ambient orbs - enhanced for dark mode */}
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[120px] bg-primary/10 dark:bg-primary/20 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[100px] bg-[#00D4FF]/10 dark:bg-[#00D4FF]/20 pointer-events-none" />

      {/* Nav */}
      <nav className="flex items-center justify-between px-12 py-8 z-10">
        <div className="flex items-center gap-3">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden">
            <img src={logoImg} alt="Comet logo" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="flex items-center">
          <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6">
        {/* Floating card left - Top Curator */}
        <motion.div
          initial={{ opacity: 0, x: -40, rotate: -3 }}
          animate={{ opacity: 1, x: 0, rotate: -3 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute top-[15%] left-[10%] w-64 p-6 bg-surface-container-lowest/90 dark:bg-surface-container-low/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(107,70,192,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-outline-variant/10 dark:border-outline-variant/5 hidden lg:block"
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

        {/* Floating card right - Trending Now */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 2 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute bottom-[20%] right-[10%] w-72 p-6 bg-surface-container-lowest/90 dark:bg-surface-container-low/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(107,70,192,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-outline-variant/10 dark:border-outline-variant/5 hidden lg:block"
        >
          <div className="flex justify-between items-center mb-4">
            <span className="material-symbols-outlined text-secondary dark:text-secondary">auto_awesome</span>
            <span className="text-[10px] font-label font-bold text-secondary dark:text-secondary uppercase tracking-widest">Trending Now</span>
          </div>
          <h3 className="font-headline font-bold text-on-surface text-lg leading-tight mb-2">The Digital Renaissance</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">Exploring the intersection of human touch and AI precision.</p>
        </motion.div>

        {/* Main content */}
        <motion.div {...motionVariants.slideUp} className="text-center relative z-10 max-w-4xl mx-auto">
          <h1 className="font-headline text-[3.5rem] md:text-[5.5rem] font-extrabold leading-none tracking-[-0.04em] mb-0">
            Connect. Create.<br />
            <img src={logoImg} alt="Comet logo" className="inline-block object-contain -mt-24" style={{ height: '4em', width: 'auto' }} />
          </h1>

          <p className="-mt-16 text-lg md:text-xl text-on-surface-variant max-w-xl mx-auto mb-8 leading-relaxed">
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
      <footer className="px-12 py-8 border-t border-outline/5 dark:border-outline/10 bg-surface-container-lowest/30 dark:bg-surface-container-low/20 backdrop-blur-sm">
      </footer>
    </div>
  )
}
