import { useState, useEffect } from 'react'
import { ChevronRight, Sun, Moon, Globe } from 'lucide-react'
import { Toggle } from '../ui/Toggle'
import { Button } from '../ui/Button'
import { useTranslation } from '../../hooks/useTranslation'
import { useTheme } from '../../hooks/useTheme'
import { useLanguage } from '../../hooks/useLanguage'

interface PrivacySettings {
  msg: boolean
  posts: boolean
  mention: boolean
  data: boolean
}

export function SettingsScreen() {
  const t = useTranslation()
  const { theme, setTheme } = useTheme()
  const { language, changeLanguage } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('privacy')
  
  // Privacy settings with localStorage persistence
  const [toggles, setToggles] = useState<PrivacySettings>(() => {
    const saved = localStorage.getItem('comet-privacy-settings')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return { msg: true, posts: true, mention: false, data: true }
      }
    }
    return { msg: true, posts: true, mention: false, data: true }
  })

  // Persist privacy settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('comet-privacy-settings', JSON.stringify(toggles))
  }, [toggles])

  const handleToggleChange = (key: keyof PrivacySettings, value: boolean) => {
    setToggles(prev => ({ ...prev, [key]: value }))
  }

  const CATEGORIES = [
    { id: 'appearance', label: t.settings.categories.appearance, icon: 'palette' },
    { id: 'privacy', label: t.settings.categories.privacy, icon: 'security' },
    { id: 'account', label: t.settings.categories.account, icon: 'person' },
    { id: 'login', label: t.settings.categories.login, icon: 'lock' },
    { id: 'notifs', label: t.settings.categories.notifs, icon: 'notifications_active' },
  ]

  const PRIVACY_CARDS = [
    { 
      icon: 'chat_bubble', 
      title: t.settings.privacy.whoCanMessage.title, 
      desc: t.settings.privacy.whoCanMessage.desc,
      key: 'msg' as keyof PrivacySettings
    },
    { 
      icon: 'visibility', 
      title: t.settings.privacy.whoCanSeePosts.title, 
      desc: t.settings.privacy.whoCanSeePosts.desc,
      key: 'posts' as keyof PrivacySettings
    },
    { 
      icon: 'alternate_email', 
      title: t.settings.privacy.mentionTagging.title, 
      desc: t.settings.privacy.mentionTagging.desc,
      key: 'mention' as keyof PrivacySettings
    },
    { 
      icon: 'data_usage', 
      title: t.settings.privacy.dataSharing.title, 
      desc: t.settings.privacy.dataSharing.desc,
      key: 'data' as keyof PrivacySettings
    },
  ]

  const SECURITY_ITEMS = [
    { 
      icon: 'password', 
      title: t.settings.security.changePassword.title, 
      sub: t.settings.security.changePassword.sub 
    },
    { 
      icon: 'authenticator', 
      title: t.settings.security.twoFactor.title, 
      sub: t.settings.security.twoFactor.sub, 
      subColor: 'text-green-600' 
    },
    { 
      icon: 'devices', 
      title: t.settings.security.devices.title, 
      sub: t.settings.security.devices.sub 
    },
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

          {/* Upgrade card */}
          <div className="mt-8 p-6 bg-gradient-to-br from-[#6B46C0] to-indigo-700 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h4 className="font-headline font-bold text-lg mb-2 relative z-10">{t.settings.upgrade.title}</h4>
            <p className="text-xs text-white/80 mb-4 relative z-10">{t.settings.upgrade.desc}</p>
            <Button variant="ghost" size="sm" className="bg-white text-primary w-full relative z-10">{t.settings.upgrade.button}</Button>
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
          
          {/* Privacy Section */}
          {activeCategory === 'privacy' && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-headline font-bold text-on-surface">{t.settings.privacy.title}</h3>
                <span className="text-[10px] font-label font-semibold tracking-widest text-primary uppercase bg-primary-fixed px-3 py-1 rounded-full">
                  {t.settings.privacy.tag}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {PRIVACY_CARDS.map((card) => (
                  <div 
                    key={card.key} 
                    className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-[0_20px_40px_rgba(107,70,192,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-xl transition-all duration-500"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-surface-container-low rounded-2xl">
                        <span className="material-symbols-outlined text-primary">{card.icon}</span>
                      </div>
                      <Toggle 
                        checked={toggles[card.key]} 
                        onChange={(v) => handleToggleChange(card.key, v)} 
                      />
                    </div>
                    <h4 className="font-headline font-bold text-on-surface mb-2">{card.title}</h4>
                    <p className="text-sm text-on-surface-variant">{card.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Account & Security */}
          {(activeCategory === 'login' || activeCategory === 'account') && (
            <section className="bg-surface-container-low rounded-[2rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-headline font-bold text-on-surface">{t.settings.security.title}</h3>
                <button className="text-primary font-bold text-sm hover:underline">{t.settings.security.viewLog}</button>
              </div>
              <div className="space-y-4">
                {SECURITY_ITEMS.map(item => (
                  <div key={item.title} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl group cursor-pointer hover:shadow-sm transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">{item.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">{item.title}</p>
                        <p className={`text-xs ${(item as any).subColor || 'text-on-surface-variant'}`}>{item.sub}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-outline-variant group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer */}
          <footer className="pt-8 flex flex-col items-center justify-center border-t border-outline-variant/10">
            <div className="flex items-center gap-2 mb-4 opacity-30">
              <span className="material-symbols-outlined text-2xl">orbit</span>
              <span className="font-headline font-bold text-xl tracking-tight">Comet</span>
            </div>
            <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest text-center">
              {t.settings.footer.version}
            </p>
            <div className="flex gap-6 mt-6">
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">
                {t.settings.footer.terms}
              </a>
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">
                {t.settings.footer.privacy}
              </a>
              <a className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">
                {t.settings.footer.cookies}
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
