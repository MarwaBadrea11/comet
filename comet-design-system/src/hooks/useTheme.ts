/**
 * useTheme — Hook for theme management
 * 
 * Syncs theme changes with localStorage and DOM
 * Applies theme class to document element
 */

import { useEffect } from 'react'
import { useUIStore } from '../stores/uiStore'

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useUIStore()

  // Apply theme class to document element on mount and theme change
  useEffect(() => {
    const root = document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return {
    theme,
    setTheme,
    toggleTheme,
  }
}
