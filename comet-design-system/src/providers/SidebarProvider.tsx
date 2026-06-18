import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

interface SidebarContextValue {
  /** Desktop: icon-only rail. Mobile: sidebar is hidden */
  collapsed: boolean
  /** Mobile only: drawer is open over content */
  mobileOpen: boolean
  isMobile: boolean
  toggle: () => void
  expand: () => void
  collapse: () => void
  openMobile: () => void
  closeMobile: () => void
  toggleMobile: () => void
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  mobileOpen: false,
  isMobile: false,
  toggle: () => {},
  expand: () => {},
  collapse: () => {},
  openMobile: () => {},
  closeMobile: () => {},
  toggleMobile: () => {},
})

const MOBILE_BP = 1024 // px — matches Tailwind `lg`

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [isMobile,    setIsMobile]    = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BP : false,
  )

  // Track viewport width
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BP - 1}px)`)
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (!e.matches) setMobileOpen(false) // close drawer when going desktop
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Close mobile drawer on route change (handled externally via closeMobile)
  const toggle       = useCallback(() => setCollapsed(v => !v), [])
  const expand       = useCallback(() => setCollapsed(false), [])
  const collapse     = useCallback(() => setCollapsed(true), [])
  const openMobile   = useCallback(() => setMobileOpen(true), [])
  const closeMobile  = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen(v => !v), [])

  return (
    <SidebarContext.Provider
      value={{ collapsed, mobileOpen, isMobile, toggle, expand, collapse, openMobile, closeMobile, toggleMobile }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
