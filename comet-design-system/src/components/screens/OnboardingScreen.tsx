import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'
import { motionVariants } from '../../lib/theme'
import logoImg from '../../assets/logo.png'

const STEPS = [
  { phase: '01', title: 'Connect with the', accent: 'Universe.', body: 'The celestial curator orchestrates your digital existence, weaving threads of connection across infinite social galaxies.' },
  { phase: '02', title: 'Curate your', accent: 'Cosmos.', body: 'Stage your content like a high-end gallery. Every post is a celestial event, every interaction a constellation.' },
  { phase: '03', title: 'Build your', accent: 'Orbit.', body: 'Grow your inner circle with people who resonate with your frequency. Quality over quantity, always.' },
  { phase: '04', title: 'Launch your', accent: 'Legacy.', body: 'Your perspective isn\'t just content — it\'s a signal that travels across the digital void forever.' },
]

export function OnboardingScreen() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  const next = () => step < STEPS.length - 1 ? setStep(s => s + 1) : navigate('/home')

  return (
    <div className="min-h-screen flex w-full relative bg-surface overflow-hidden">
      {/* Left visual panel */}
      <section className="hidden lg:flex lg:w-1/2 h-screen relative items-center justify-center bg-surface-container-low overflow-hidden">
        <div className="absolute top-12 left-12 z-20">
          <img src={logoImg} alt="Comet logo" className="h-[120px] w-[120px] object-contain" />
        </div>
        <div className="relative z-10 w-full max-w-lg aspect-square p-16">
          <div className="w-full h-full rounded-[3rem] bg-gradient-to-br from-primary/20 to-[#00D4FF]/20 shadow-[0_20px_40px_rgba(107,70,192,0.1)] flex items-center justify-center relative overflow-hidden">
            {/* Network Map SVG Graphic */}
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full opacity-30"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Connection lines */}
              <g stroke="currentColor" strokeWidth="1.5" fill="none" className="text-primary" opacity="0.4">
                {/* Lines from center to outer nodes */}
                <line x1="200" y1="200" x2="200" y2="80" />
                <line x1="200" y1="200" x2="320" y2="140" />
                <line x1="200" y1="200" x2="340" y2="240" />
                <line x1="200" y1="200" x2="300" y2="320" />
                <line x1="200" y1="200" x2="180" y2="340" />
                <line x1="200" y1="200" x2="80" y2="300" />
                <line x1="200" y1="200" x2="60" y2="200" />
                <line x1="200" y1="200" x2="100" y2="120" />
                
                {/* Secondary connections between outer nodes */}
                <line x1="200" y1="80" x2="320" y2="140" opacity="0.3" />
                <line x1="320" y1="140" x2="340" y2="240" opacity="0.3" />
                <line x1="340" y1="240" x2="300" y2="320" opacity="0.3" />
                <line x1="100" y1="120" x2="60" y2="200" opacity="0.3" />
                <line x1="60" y1="200" x2="80" y2="300" opacity="0.3" />
              </g>

              {/* Outer nodes */}
              <g className="text-primary">
                <circle cx="200" cy="80" r="8" fill="currentColor" opacity="0.6" />
                <circle cx="320" cy="140" r="7" fill="currentColor" opacity="0.5" />
                <circle cx="340" cy="240" r="6" fill="currentColor" opacity="0.5" />
                <circle cx="300" cy="320" r="7" fill="currentColor" opacity="0.6" />
                <circle cx="180" cy="340" r="8" fill="currentColor" opacity="0.6" />
                <circle cx="80" cy="300" r="6" fill="currentColor" opacity="0.5" />
                <circle cx="60" cy="200" r="7" fill="currentColor" opacity="0.5" />
                <circle cx="100" cy="120" r="7" fill="currentColor" opacity="0.6" />
              </g>

              {/* Central globe node */}
              <g className="text-primary">
                {/* Outer ring */}
                <circle cx="200" cy="200" r="45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
                
                {/* Globe meridians and parallels */}
                <ellipse cx="200" cy="200" rx="45" ry="25" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                <ellipse cx="200" cy="200" rx="25" ry="45" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                <line x1="155" y1="200" x2="245" y2="200" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                
                {/* Central dot */}
                <circle cx="200" cy="200" r="35" fill="currentColor" opacity="0.15" />
                <circle cx="200" cy="200" r="12" fill="currentColor" opacity="0.7" />
              </g>

              {/* Animated pulse effect */}
              <circle cx="200" cy="200" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" opacity="0.3">
                <animate attributeName="r" values="40;55;40" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          {/* Floating card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute -bottom-8 -right-8 bg-white/70 backdrop-blur-2xl p-6 rounded-2xl shadow-[0_20px_40px_rgba(107,70,192,0.06)] border border-outline-variant/15 max-w-xs"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#00D4FF]/20 flex items-center justify-center text-[#00677e]">
                <span className="material-symbols-outlined text-xl">hub</span>
              </div>
              <span className="font-headline font-bold text-sm">Active Nodes</span>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">Connecting over 2.4 million celestial entities across the digital void.</p>
          </motion.div>
        </div>
      </section>

      {/* Right interaction panel */}
      <section className="w-full lg:w-1/2 min-h-screen bg-surface-container-lowest flex flex-col px-8 md:px-20 lg:px-24 py-16 justify-center relative">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

        <div className="max-w-xl space-y-12 relative z-10">
          <div className="lg:hidden mb-8">
            <img src={logoImg} alt="Comet logo" className="h-[120px] w-[120px] object-contain" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} {...motionVariants.slideUp} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-primary font-label text-xs font-semibold tracking-[0.05em] uppercase">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                Phase {current.phase}: Initiation
              </div>
              <h2 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface leading-[1.1]">
                {current.title}{' '}
                <span className="bg-gradient-to-r from-primary to-[#00677e] bg-clip-text text-transparent">{current.accent}</span>
              </h2>
              <p className="text-xl text-on-surface-variant leading-relaxed max-w-lg">{current.body}</p>
            </motion.div>
          </AnimatePresence>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <Button variant="primary" size="lg" icon={<ArrowRight size={20} />} iconPosition="right" onClick={next}>
                {step < STEPS.length - 1 ? 'Explore Next' : 'Enter Comet'}
              </Button>
              <button onClick={() => navigate('/home')} className="text-primary font-headline font-bold text-lg hover:opacity-70 transition-opacity">
                Skip Intro
              </button>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-3">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-12 bg-primary shadow-[0_0_12px_rgba(107,70,192,0.4)]' : 'w-3 bg-surface-container-high'}`}
                />
              ))}
              <span className="ml-4 font-label text-xs font-bold text-outline uppercase tracking-widest">Step {String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-8 md:left-20 lg:left-24 text-outline/40 text-[0.65rem] font-label uppercase tracking-[0.2em] flex items-center gap-4">
          <span>© 2024 Comet Labs</span>
          <div className="w-1 h-1 rounded-full bg-outline/20" />
          <span>Privacy Architecture</span>
        </div>
      </section>
    </div>
  )
}
