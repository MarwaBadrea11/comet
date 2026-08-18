import { useState } from 'react'
import { Sun, Moon, Globe } from 'lucide-react'
import { useTranslation } from '../../hooks/useTranslation'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'
import { BlockedUsersList } from '../ui/BlockedUsersList'

export function SettingsScreen() {
  const t = useTranslation()
  const { theme, setTheme } = useTheme()
  const { language, changeLanguage } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('appearance')

  const CATEGORIES = [
    { id: 'appearance', label: t.settings.categories.appearance, icon: 'palette' },
    { id: 'privacy', label: t.settings.categories.privacy, icon: 'block' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-12 py-12">
      <div className="mb-12">
        <h2 className="text-[3.5rem] font-headline font-extrabold text-on-surface leading-tight tracking-tight bg-gradient-to-r from-on-surface to-on-surface-variant bg-clip-text text-transparent mb-2">
          {t.settings.title}
        </h2>
        <p className="text-on-surface-variant text-lg max-w-2xl">{t.settings.subtitle}</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sub-nav */}
        <div className="col-span-3 space-y-2">
          <div className="p-1 bg-surface-container-low rounded-2xl border border-outline-variant/15">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all text-sm ${activeCategory === c.id ? 'bg-surface-container-lowest shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:bg-white/50 dark:hover:bg-white/10'}`}
              >
                <span className="material-symbols-outlined" style={activeCategory === c.id ? { fontVariationSettings: "'FILL' 1" } : undefined}>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main area */}
        <div className="col-span-9 space-y-8">
          {/* Appearance & Language Section */}
          {activeCategory === 'appearance' && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-headline font-bold text-on-surface">{t.settings.appearance.title}</h3>
                  <p className="text-sm text-on-surface-variant mt-1">{t.settings.appearance.subtitle}</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Theme Selection */}
                <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-[0_20px_40px_rgba(107,70,192,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-surface-container-low rounded-2xl">
                      {theme === 'dark' ? (
                        <Moon className="w-6 h-6 text-primary" />
                      ) : (
                        <Sun className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <h4 className="font-headline font-bold text-on-surface">{t.settings.appearance.theme.label}</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        theme === 'light'
                          ? 'border-primary bg-primary-fixed text-on-primary-fixed'
                          : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary/50'
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                      <span className="font-bold text-sm">{t.settings.appearance.theme.light}</span>
                    </button>
                    
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        theme === 'dark'
                          ? 'border-primary bg-primary-fixed text-on-primary-fixed'
                          : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary/50'
                      }`}
                    >
                      <Moon className="w-5 h-5" />
                      <span className="font-bold text-sm">{t.settings.appearance.theme.dark}</span>
                    </button>
                  </div>
                </div>

                {/* Language Selection */}
                <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-[0_20px_40px_rgba(107,70,192,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-surface-container-low rounded-2xl">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-headline font-bold text-on-surface">{t.settings.appearance.language.label}</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        language === 'en'
                          ? 'border-primary bg-primary-fixed text-on-primary-fixed'
                          : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary/50'
                      }`}
                    >
                      <span className="font-bold text-sm">{t.settings.appearance.language.english}</span>
                    </button>
                    
                    <button
                      onClick={() => changeLanguage('ar')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        language === 'ar'
                          ? 'border-primary bg-primary-fixed text-on-primary-fixed'
                          : 'border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary/50'
                      }`}
                    >
                      <span className="font-bold text-sm">{t.settings.appearance.language.arabic}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Blocking */}
          {activeCategory === 'privacy' && (
            <section>
              <div className="mb-6">
                <h3 className="text-2xl font-headline font-bold text-on-surface">{t.settings.privacy.title}</h3>
                <p className="text-sm text-on-surface-variant mt-1">{t.settings.privacy.subtitle}</p>
              </div>

              <div className="bg-surface-container-low rounded-[2rem] p-8">
                <h4 className="font-headline font-bold text-on-surface mb-6">{t.settings.privacy.blockedUsers.title}</h4>
                <BlockedUsersList />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
