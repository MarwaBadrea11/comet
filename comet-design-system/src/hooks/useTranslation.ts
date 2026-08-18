/**
 * useTranslation — Custom hook for accessing translations
 * 
 * Provides translations based on the current language from uiStore
 * Updates automatically when language changes
 * 
 * Can be used in two ways:
 * 1. As an object: const t = useTranslation() -> t.settings.title
 * 2. As a function: const t = useTranslation() -> t('sidebar.home')
 */

import { useUIStore } from '../stores/uiStore'
import { getTranslations, type Translations } from '../i18n/translations'

type TranslationKey = 
  | 'sidebar.home'
  | 'sidebar.explore'
  | 'sidebar.messages'
  | 'sidebar.friendRequests'
  | 'sidebar.notifications'
  | 'sidebar.settings'
  | 'sidebar.logo'
  | 'sidebar.create'
  | 'sidebar.createPost'
  | 'header.searchPlaceholder'
  | 'header.notifications'

/**
 * Get a nested translation value using dot notation
 */
function getNestedTranslation(obj: any, path: string): string {
  const keys = path.split('.')
  let current = obj
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return path // Return the key itself if not found
    }
  }
  
  return typeof current === 'string' ? current : path
}

export function useTranslation(): Translations & ((key: TranslationKey) => string) {
  const language = useUIStore((state) => state.language)
  const translations = getTranslations(language)
  
  // Create a function that can access nested properties
  const translationFunction = (key: TranslationKey) => {
    return getNestedTranslation(translations, key)
  }
  
  // Merge the translations object with the function
  return Object.assign(translationFunction, translations)
}
