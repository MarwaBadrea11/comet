// ─────────────────────────────────────────────
//  Comet Design Tokens — single source of truth
// ─────────────────────────────────────────────

export const colors = {
  // Brand
  primary: '#532aa7',
  primaryContainer: '#6b46c0',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#e1d2ff',

  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #6B46C0 0%, #8E5EFF 100%)',
  gradientSecondary: 'linear-gradient(135deg, #00D4FF 0%, #00BFFF 100%)',
  gradientBrand: 'linear-gradient(to right, #6B46C0, #8E5EFF)',
  gradientLogo: 'linear-gradient(to right, #6B46C0, #00D4FF)',
  gradientStoryRing: 'linear-gradient(to top right, #6B46C0, #00D4FF)',

  // Surface hierarchy
  surface: '#f8f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#eff4ff',
  surfaceContainer: '#e5eeff',
  surfaceContainerHigh: '#dce9ff',
  surfaceContainerHighest: '#d3e4fe',

  // Text
  onSurface: '#0b1c30',
  onSurfaceVariant: '#494453',

  // Utility
  outline: '#7a7484',
  outlineVariant: '#cbc3d5',
  error: '#ba1a1a',
  secondary: '#00677e',
  secondaryContainer: '#00d2fd',
  secondaryFixed: '#b4ebff',
} as const

export const shadows = {
  ambient: '0 20px 40px rgba(107, 70, 192, 0.06)',
  ambientHover: '0 30px 60px rgba(107, 70, 192, 0.1)',
  glow: '0 12px 24px rgba(107, 70, 192, 0.3)',
  glowSm: '0 8px 16px rgba(107, 70, 192, 0.2)',
  glowCyan: '0 12px 24px rgba(0, 212, 255, 0.2)',
  nav: '0 -10px 40px rgba(107, 70, 192, 0.08)',
  navTop: '0 20px 40px rgba(107, 70, 192, 0.06)',
} as const

export const radius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
} as const

export const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const

export const typography = {
  displayLg: { fontFamily: 'Plus Jakarta Sans', fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.02em' },
  headlineMd: { fontFamily: 'Plus Jakarta Sans', fontSize: '1.75rem', fontWeight: 700 },
  titleLg: { fontFamily: 'Inter', fontSize: '1.375rem', fontWeight: 500 },
  bodyLg: { fontFamily: 'Inter', fontSize: '1rem', fontWeight: 400 },
  labelMd: { fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' as const },
} as const

// Framer Motion variants — reusable across all components
export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  slideUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 24 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },
} as const
