/**
 * useTranslation — Custom hook for accessing translations
 * 
 * Provides translations based on the current language from uiStore
 * Updates automatically when language changes
 */

import { useUIStore } from '../stores/uiStore'
import { getTranslations, type Translations } from '../i18n/translations'

export function useTranslation(): Translations {
  const language = useUIStore((state) => state.language)
  return getTranslations(language)
}
