/**
 * ThemeProvider — thin bridge so legacy `useTheme()` callers keep working.
 *
 * The actual state now lives in uiStore (Zustand, persisted).
 * This provider just applies the stored theme class on mount and re-exports
 * the same API shape so nothing else needs to change.
 */

import { useEffect, type ReactNode } from 'react'
import { useUIStore } from '../stores/uiStore'

/** Keep the existing hook API intact so UserMenu and others need no changes. */
export function useTheme() {
  const theme       = useUIStore((s) => s.theme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)
  return { theme, toggleTheme }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useUIStore((s) => s.theme)

  // Apply the dark class on initial render based on persisted preference
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return <>{children}</>
}
