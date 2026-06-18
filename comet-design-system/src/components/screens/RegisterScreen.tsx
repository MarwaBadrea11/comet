import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Input } from '../ui/Input'
import { motionVariants } from '../../lib/theme'

export function RegisterScreen() {
  const navigate = useNavigate()

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

          <div className="px-10 pt-10 pb-10 flex flex-col gap-7">

        
            <header className="text-center space-y-2">
              <span className="block text-[28px] font-headline font-extrabold bg-gradient-to-r from-[#6B46C0] to-[#00D4FF] bg-clip-text text-transparent tracking-tighter leading-none">
                Comet
              </span>
              <h1 className="text-[1.75rem] font-headline font-bold text-on-surface tracking-tight leading-tight">
                Create Account
              </h1>
              <p className="text-[0.875rem] text-on-surface-variant">
                Begin your celestial journey
              </p>
            </header>

       
            <form
              className="flex flex-col gap-4"
              onSubmit={e => { e.preventDefault(); navigate('/onboarding') }}
            >
       
              <div className="grid grid-cols-2 gap-3">
                <Input label="First Name" placeholder="Elena" />
                <Input label="Last Name"  placeholder="Vance" />
              </div>

              <Input label="Username"  placeholder="@celestial_curator" />
              <Input label="Email"     type="email"    placeholder="curator@comet.io" />
              <Input label="Password"  type="password" placeholder="••••••••" />

     
              <button
                type="submit"
                className={[
                  'w-full h-14 mt-1 rounded-2xl',
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
                Create Account
              </button>
            </form>

        
            <p className="text-center text-[11px] text-on-surface-variant/60 leading-relaxed px-2">
              By creating an account you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>

     
            <p className="text-center text-[0.875rem] text-on-surface-variant -mt-1">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary font-bold hover:underline decoration-2 underline-offset-4 transition-all"
              >
                Sign In
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
