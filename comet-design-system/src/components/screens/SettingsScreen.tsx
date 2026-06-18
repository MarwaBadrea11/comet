import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Toggle } from '../ui/Toggle'
import { Button } from '../ui/Button'

const CATEGORIES = [
  { id: 'privacy', label: 'Privacy & Safety', icon: 'security' },
  { id: 'account', label: 'Account Center', icon: 'person' },
  { id: 'login', label: 'Login & Security', icon: 'lock' },
  { id: 'notifs', label: 'Notifications', icon: 'notifications_active' },
  { id: 'subs', label: 'Subscriptions', icon: 'payments' },
]

const PRIVACY_CARDS = [
  { icon: 'chat_bubble', title: 'Who can message me', desc: 'Limit direct message requests to only people you follow or verified accounts.' },
  { icon: 'visibility', title: 'Who can see my posts', desc: 'Make your profile private. Only approved followers will see your celestial updates.' },
  { icon: 'alternate_email', title: 'Mention tagging', desc: 'Allow everyone to tag you in posts or restrict it to people you follow.' },
  { icon: 'data_usage', title: 'Data Sharing', desc: 'Control how Comet shares your anonymous usage data with editorial partners.' },
]

const SECURITY_ITEMS = [
  { icon: 'password', title: 'Change Password', sub: 'Last updated 3 months ago' },
  { icon: 'authenticator', title: 'Two-Factor Authentication', sub: 'Currently Enabled', subColor: 'text-green-600' },
  { icon: 'devices', title: 'Recognized Devices', sub: '2 active sessions detected' },
]

export function SettingsScreen() {
  const [activeCategory, setActiveCategory] = useState('privacy')
  const [toggles, setToggles] = useState({ msg: true, posts: true, mention: false, data: true })

  return (
    <div className="max-w-6xl mx-auto px-12 py-12">
      <div className="mb-12">
        <h2 className="text-[3.5rem] font-headline font-extrabold text-on-surface leading-tight tracking-tight bg-gradient-to-r from-on-surface to-on-surface-variant bg-clip-text text-transparent mb-2">
          Settings & Privacy
        </h2>
        <p className="text-on-surface-variant text-lg max-w-2xl">Manage your celestial presence, secure your orbit, and curate who witnesses your journey.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sub-nav */}
        <div className="col-span-3 space-y-2">
          <div className="p-1 bg-surface-container-low rounded-2xl border border-outline-variant/15">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all text-sm ${activeCategory === c.id ? 'bg-surface-container-lowest shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:bg-white/50'}`}
              >
                <span className="material-symbols-outlined" style={activeCategory === c.id ? { fontVariationSettings: "'FILL' 1" } : undefined}>{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Upgrade card */}
          <div className="mt-8 p-6 bg-gradient-to-br from-[#6B46C0] to-indigo-700 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h4 className="font-headline font-bold text-lg mb-2 relative z-10">Comet Pro</h4>
            <p className="text-xs text-white/80 mb-4 relative z-10">Unlock advanced privacy shielding and unique profile signatures.</p>
            <Button variant="ghost" size="sm" className="bg-white text-primary w-full relative z-10">Upgrade Now</Button>
          </div>
        </div>

        {/* Main area */}
        <div className="col-span-9 space-y-8">
          {/* Privacy controls */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-headline font-bold text-on-surface">Privacy Controls</h3>
              <span className="text-[10px] font-label font-semibold tracking-widest text-primary uppercase bg-primary-fixed px-3 py-1 rounded-full">Primary Settings</span>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {PRIVACY_CARDS.map((card, i) => {
                const key = ['msg', 'posts', 'mention', 'data'][i] as keyof typeof toggles
                return (
                  <div key={card.title} className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-[0_20px_40px_rgba(107,70,192,0.06)] hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-surface-container-low rounded-2xl">
                        <span className="material-symbols-outlined text-primary">{card.icon}</span>
                      </div>
                      <Toggle checked={toggles[key]} onChange={v => setToggles(t => ({ ...t, [key]: v }))} />
                    </div>
                    <h4 className="font-headline font-bold text-on-surface mb-2">{card.title}</h4>
                    <p className="text-sm text-on-surface-variant">{card.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Account & Security */}
          <section className="bg-surface-container-low rounded-[2rem] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-headline font-bold text-on-surface">Account & Security</h3>
              <button className="text-primary font-bold text-sm hover:underline">View Security Log</button>
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

          {/* Footer */}
          <footer className="pt-8 flex flex-col items-center justify-center border-t border-outline-variant/10">
            <div className="flex items-center gap-2 mb-4 opacity-30">
              <span className="material-symbols-outlined text-2xl">orbit</span>
              <span className="font-headline font-bold text-xl tracking-tight">Comet</span>
            </div>
            <p className="text-xs font-label text-on-surface-variant uppercase tracking-widest text-center">
              Version 4.2.0-Alpha • Made with stardust in the Digital Ether
            </p>
            <div className="flex gap-6 mt-6">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map(l => (
                <a key={l} className="text-xs text-on-surface-variant hover:text-primary transition-colors" href="#">{l}</a>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
