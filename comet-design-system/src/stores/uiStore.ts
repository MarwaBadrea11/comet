/**
 * uiStore — Zustand store for global UI preferences.
 *
 * Persisted to localStorage so preferences survive reloads.
 *
 * Owns:
 *  - theme (light / dark)
 *  - sidebar collapsed state (desktop)
 *  - notification badge count
 *  - create-post modal open state
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'
type Language = 'en' | 'ar'

interface UIState {
  // ── Theme ──────────────────────────────────────────────────────────────────
  theme: Theme
  setTheme:    (t: Theme) => void
  toggleTheme: () => void

  // ── Language & RTL ─────────────────────────────────────────────────────────
  language: Language
  isRTL: boolean
  setLanguage: (lang: Language) => void

  // ── Sidebar ────────────────────────────────────────────────────────────────
  sidebarCollapsed: boolean
  toggleSidebar:    () => void
  setSidebar:       (collapsed: boolean) => void

  // ── Notification badge (client-side counter) ───────────────────────────────
  unreadNotifications: number
  setUnreadNotifications: (n: number) => void
  decrementUnread:        () => void

  // ── Create-post modal ──────────────────────────────────────────────────────
  createPostOpen: boolean
  openCreatePost:  () => void
  closeCreatePost: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // ── Theme ──────────────────────────────────────────────────────────────
      theme: 'light',

      setTheme: (t) => {
        document.documentElement.classList.toggle('dark', t === 'dark')
        set({ theme: t })
      },

      toggleTheme: () =>
        set((state) => {
          const next: Theme = state.theme === 'light' ? 'dark' : 'light'
          document.documentElement.classList.toggle('dark', next === 'dark')
          return { theme: next }
        }),

      // ── Language & RTL ─────────────────────────────────────────────────────
      language: 'en',
      isRTL: false,
      setLanguage: (lang) => {
        const isRTL = lang === 'ar'
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
        document.documentElement.setAttribute('lang', lang)
        set({ language: lang, isRTL })
      },

      // ── Sidebar ────────────────────────────────────────────────────────────
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebar:    (collapsed) => set({ sidebarCollapsed: collapsed }),

      // ── Notifications ──────────────────────────────────────────────────────
      unreadNotifications: 0,
      setUnreadNotifications: (n) => set({ unreadNotifications: n }),
      decrementUnread: () =>
        set((s) => ({ unreadNotifications: Math.max(0, s.unreadNotifications - 1) })),

      // ── Modal ──────────────────────────────────────────────────────────────
      createPostOpen: false,
      openCreatePost:  () => set({ createPostOpen: true }),
      closeCreatePost: () => set({ createPostOpen: false }),
    }),
    {
      name: 'comet-ui',
      // Only persist preferences — not ephemeral modal state
      partialize: (state) => ({
        theme:            state.theme,
        language:         state.language,
        isRTL:            state.isRTL,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
)
