/**
 * useLanguage — Hook for language management
 * 
 * Syncs language changes with localStorage and DOM
 * Handles RTL direction for Arabic
 */

import { useEffect } from 'react'
import { useUIStore } from '../stores/uiStore'
import type { Language } from '../i18n/translations'

export function useLanguage() {
  const { language, isRTL, setLanguage } = useUIStore()

  // Apply language and direction to document element on mount and language change
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('lang', language)
    root.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
  }, [language, isRTL])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
  }

  return {
    language,
    isRTL,
    changeLanguage,
  }
}
