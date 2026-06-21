import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { Input } from '../ui/Input'
import { motionVariants } from '../../lib/theme'
import logoImg from '../../assets/logo.png'

export function LoginScreen() {
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)

  // تعريف الـ States لإدارة البيانات والأخطاء والتحميل
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.')
      setLoading(false)
      return
    }

    try {
      const response = await axios.post('http://localhost:8000/auth/signin', {
        email,
        password,
      })

      console.log('Server Raw Response:', response.data)

      // التعديل الجوهري: مطابقة المفتاح تماماً مع الـ Console (accessToken)
      const token = response.data?.accessToken || response.data?.token

      if (response.data && token) {
        localStorage.setItem('comet_token', token)
        console.log('Login Successful! Token saved.')
        navigate('/home') // التوجيه لصفحة الـ Home بعد النجاح
      } else {
        setErrorMessage('Authentication succeeded but no token was received.')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      if (!error.response) {
        setErrorMessage('Cannot connect to the server. Please check if backend is running.')
      } else {
        setErrorMessage(
          error.response?.data?.message || 'Invalid email or password. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-x-hidden md:overflow-hidden select-none"
      style={{
        background:
          'radial-gradient(circle at 12% 18%, rgba(107,70,192,0.13) 0%, transparent 42%), ' +
          'radial-gradient(circle at 88% 82%, rgba(0,212,255,0.09) 0%, transparent 42%), #f8f9ff',
      }}
    >
      {/* الـ Glow الخلفي */}
      <div className="hidden sm:block fixed top-[10%] right-[8%] w-[20rem] h-[20rem] md:w-[28rem] md:h-[28rem] bg-primary/10 rounded-full blur-[80px] md:blur-[110px] pointer-events-none" />
      <div className="hidden sm:block fixed bottom-[15%] left-[4%] w-[18rem] h-[18rem] md:w-[24rem] md:h-[24rem] bg-[#00D4FF]/8 rounded-full blur-[70px] md:blur-[90px] pointer-events-none" />

      <motion.div 
        {...motionVariants.scaleIn} 
        className="relative z-10 w-full max-w-[420px] my-auto max-h-[95vh] overflow-y-auto no-scrollbar"
      >
        <div className="bg-white/72 backdrop-blur-2xl rounded-[1.75rem] shadow-[0_24px_64px_rgba(107,70,192,0.10)] border border-white/60 overflow-hidden">
          
          <div className="h-1 w-full bg-gradient-to-r from-[#6B46C0] via-[#8E5EFF] to-[#00D4FF]" />

          <div className="px-6 py-8 sm:px-10 sm:p-10 flex flex-col gap-6 sm:gap-8">
            
            <header className="text-center space-y-1.5 sm:space-y-2">
              <div className="flex justify-center mb-1">
                <img src={logoImg} alt="Comet logo" className="h-[90px] w-[90px] sm:h-[120px] sm:w-[120px] object-contain" />
              </div>
              <h1 className="text-[1.5rem] sm:text-[1.75rem] font-headline font-bold text-on-surface tracking-tight leading-tight">
                Welcome Back
              </h1>
              <p className="text-[0.815rem] sm:text-[0.875rem] text-on-surface-variant">
                Return to your celestial sanctuary
              </p>
            </header>

            {/* رسالة الخطأ التفاعلية */}
            {errorMessage && (
              <div className="text-xs sm:text-sm font-semibold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 text-center animate-fade-in">
                {errorMessage}
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <Input
                label="Email Address"
                type="email"
                placeholder="curator@comet.io"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errorMessage) setErrorMessage('')
                }}
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
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errorMessage) setErrorMessage('')
                  }}
                  trailingIcon={
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      aria-label="Toggle password visibility"
                      className="text-outline hover:text-primary transition-colors flex items-center justify-center"
                    >
                      {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
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
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                ].join(' ')}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="relative flex items-center gap-4 py-1">
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

        <div className="mt-5 sm:mt-7 mb-2 flex justify-center gap-6">
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