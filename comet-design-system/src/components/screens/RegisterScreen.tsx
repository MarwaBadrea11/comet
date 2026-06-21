import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Input } from '../ui/Input'
import { motionVariants } from '../../lib/theme'
import logoImg from '../../assets/logo.png'

export function RegisterScreen() {
  const navigate = useNavigate()

  // 1. تعريف حالات المدخلات لتطابق متطلبات الباك إند
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    country: '',
    gender: 'MALE', // القيمة الافتراضية بناءً على ملف البوست مان
    password: '',
    role: 'USER'    // ثابتة للمستخدمين العاديين
  })

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // دالة لتحديث البيانات عند الكتابة
  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (errorMessage) setErrorMessage('') // إعادة تعيين الخطأ عند التعديل
  }

  // 2. دالة إرسال البيانات والربط مع الـ API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(false)
    setErrorMessage('')

    // التحقق الأساسي من إدخال الحقول
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.city || !formData.country) {
      setErrorMessage('Please fill in all fields.')
      return
    }

    try {
      setLoading(true)

      // تجهيز البيانات بالشكل المتوقع في الباك إند (دمج الاسم الأول والأخير)
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        city: formData.city,
        country: formData.country,
        gender: formData.gender,
        password: formData.password,
        role: formData.role
      }

      // إرسال الطلب لـ Endpoint الباك إند
      const response = await axios.post('http://localhost:8000/auth/signup', payload)

      if (response.status === 200 || response.status === 201) {
        // عند نجاح العملية، الانتقال لصفحة تسجيل الدخول أو الـ onboarding مباشرة
        navigate('/login')
      }
    } catch (error: any) {
      console.error('Registration Error:', error)
      // عرض رسالة الخطأ القادمة من الباك إند في حال وجودها
      setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.')
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
      {/* عناصر الـ Blur الخلفية - تم تحسين تفاعلها عبر الشاشات لعدم التسبب بمشاكل في السكرول بالموبايل */}
      <div className="hidden sm:block fixed top-[5%] right-[5%] w-[20rem] h-[20rem] md:w-[28rem] md:h-[28rem] bg-primary/10 rounded-full blur-[80px] md:blur-[110px] pointer-events-none" />
      <div className="hidden sm:block fixed bottom-[10%] left-[2%] w-[18rem] h-[18rem] md:w-[24rem] md:h-[24rem] bg-[#00D4FF]/8 rounded-full blur-[70px] md:blur-[90px] pointer-events-none" />

      {/* حاوية النموذج مع التجاوب لضمان ظهور شريط التمرير الداخلي إذا كانت الشاشة صغيرة جداً */}
      <motion.div 
        {...motionVariants.scaleIn} 
        className="relative z-10 w-full max-w-[460px] my-auto max-h-[95vh] overflow-y-auto no-scrollbar"
      >
        <div className="bg-white/72 backdrop-blur-2xl rounded-[1.75rem] shadow-[0_24px_64px_rgba(107,70,192,0.10)] border border-white/60 overflow-hidden">
          
          {/* الخط العلوي المتدرج المميز للهوية */}
          <div className="h-1 w-full bg-gradient-to-r from-[#6B46C0] via-[#8E5EFF] to-[#00D4FF]" />

          <div className="px-6 py-8 sm:px-10 sm:pt-10 sm:pb-8 flex flex-col gap-6">
            
            <header className="text-center space-y-1.5">
              <div className="flex justify-center mb-1">
                <img src={logoImg} alt="Comet logo" className="h-[90px] w-[90px] sm:h-[110px] sm:w-[110px] object-contain" />
              </div>
              <h1 className="text-[1.5rem] sm:text-[1.75rem] font-headline font-bold text-on-surface tracking-tight leading-tight">
                Create Account
              </h1>
              <p className="text-[0.815rem] sm:text-[0.875rem] text-on-surface-variant">
                Begin your celestial journey
              </p>
            </header>

            {/* عرض رسائل الخطأ في حال حدوثها أثناء الربط */}
            {errorMessage && (
              <div className="text-sm font-semibold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                {errorMessage}
              </div>
            )}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              
              {/* شبكة الحقول المتجاوبة (الاسم الأول والأخير) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input 
                  label="First Name" 
                  placeholder="Elena" 
                  value={formData.firstName}
                  onChange={e => handleChange('firstName', e.target.value)}
                />
                <Input 
                  label="Last Name"  
                  placeholder="Vance" 
                  value={formData.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                />
              </div>

              <Input 
                label="Email" 
                type="email" 
                placeholder="curator@comet.io" 
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
              />

              {/* شبكة الحقول المضافة لتوافق الباك إند بالكامل: المدينة والدولة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input 
                  label="City" 
                  placeholder="New York" 
                  value={formData.city}
                  onChange={e => handleChange('city', e.target.value)}
                />
                <Input 
                  label="Country"  
                  placeholder="United States" 
                  value={formData.country}
                  onChange={e => handleChange('country', e.target.value)}
                />
              </div>

              {/* حقل اختيار الجنس المتوافق مع خيارات الباك إند */}
              <div className="space-y-1">
                <label className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant px-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={e => handleChange('gender', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant/30 bg-white/50 text-on-surface font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none cursor-pointer"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={e => handleChange('password', e.target.value)}
              />

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
                {loading ? 'Creating Account...' : 'Create Account'}
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

        {/* روابط الفوتر السفلي */}
        <div className="mt-6 mb-2 flex justify-center gap-6">
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