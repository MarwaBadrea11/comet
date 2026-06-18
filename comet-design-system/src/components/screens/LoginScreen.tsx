import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '../ui/Input'
import { motionVariants } from '../../lib/theme'

export function LoginScreen() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 12% 18%, rgba(107,70,192,0.13) 0%, transparent 42%), ' +
          'radial-gradient(circle at 88% 82%, rgba(0,212,255,0.09) 0%, transparent 42%), #f8f9ff',
      }}
    >
      
      <div className="fixed top-[10%] right-[8%]  w-[28rem] h-[28rem] bg-primary/10    rounded-full blur-[110px] pointer-events-none" />
      <div className="fixed bottom-[15%] left-[4%] w-[24rem] h-[24rem] bg-[#00D4FF]/8 rounded-full blur-[90px]  pointer-events-none" />

      <motion.div {...motionVariants.scaleIn} className="relative z-10 w-full max-w-[440px]">
     
        <div className="bg-white/72 backdrop-blur-2xl rounded-[1.75rem] shadow-[0_24px_64px_rgba(107,70,192,0.10)] border border-white/60 overflow-hidden">

     
          <div className="h-1 w-full bg-gradient-to-r from-[#6B46C0] via-[#8E5EFF] to-[#00D4FF]" />

          <div className="px-10 pt-10 pb-10 flex flex-col gap-8">

           
            <header className="text-center space-y-2">
              <span className="block text-[28px] font-headline font-extrabold bg-gradient-to-r from-[#6B46C0] to-[#00D4FF] bg-clip-text text-transparent tracking-tighter leading-none">
                Comet
              </span>
              <h1 className="text-[1.75rem] font-headline font-bold text-on-surface tracking-tight leading-tight">
                Welcome Back
              </h1>
              <p className="text-[0.875rem] text-on-surface-variant">
                Return to your celestial sanctuary
              </p>
            </header>

          
            <form
              className="flex flex-col gap-4"
              onSubmit={e => { e.preventDefault(); navigate('/home') }}
            >
              <Input
                label="Email Address"
                type="email"
                placeholder="curator@comet.io"
              />

              <div className="space-y-1">
                <div className="flex justify-between items-center px-1">
                  <label className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[11px] font-semibold text-primary hover:opacity-75 transition-opacity"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  trailingIcon={
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      aria-label="Toggle password visibility"
                      className="text-outline hover:text-primary transition-colors"
                    >
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  }
                />
              </div>

             
              <button
                type="submit"
                className={[
                  'w-full h-14 mt-2 rounded-2xl',
                  'bg-gradient-to-r from-[#6B46C0] to-[#8E5EFF]',
                  'text-white font-headline font-bold text-[1rem] tracking-wide',
                  'shadow-[0_8px_24px_rgba(107,70,192,0.32)]',
                  'hover:shadow-[0_12px_32px_rgba(107,70,192,0.42)]',
                  'hover:brightness-105',
                  'active:scale-[0.98]',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                ].join(' ')}
              >
                Sign In
              </button>
            </form>

          
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-outline-variant/25" />
              <span className="text-[10px] font-label font-semibold uppercase tracking-[0.18em] text-on-surface-variant/60 whitespace-nowrap">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-outline-variant/25" />
            </div>

          
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Google', icon: 'G' },
                { label: 'Apple',  icon: '' },
              ].map(p => (
                <button
                  key={p.label}
                  type="button"
                  className={[
                    'h-12 flex items-center justify-center gap-2.5',
                    'rounded-xl border border-outline-variant/20',
                    'bg-white/50 hover:bg-white/80',
                    'text-on-surface font-semibold text-sm',
                    'transition-all duration-200',
                    'shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
                    'hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                  ].join(' ')}
                >
                  {p.label === 'Apple' && (
                    <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
                  )}
                  {p.label}
                </button>
              ))}
            </div>

           
            <p className="text-center text-[0.875rem] text-on-surface-variant">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-primary font-bold hover:underline decoration-2 underline-offset-4 transition-all"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

      
        <div className="mt-7 flex justify-center gap-6">
          {['Privacy Policy', 'Support', 'Terms'].map(l => (
            <a
              key={l}
              href="#"
              className="text-[10px] font-label font-semibold tracking-widest uppercase text-on-surface-variant/50 hover:text-primary transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
