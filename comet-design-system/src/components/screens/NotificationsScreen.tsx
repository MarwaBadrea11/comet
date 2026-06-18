import { motion } from 'framer-motion'
import { Heart, MessageCircle, UserPlus, AtSign, Star, MoreHorizontal } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { motionVariants } from '../../lib/theme'

const TODAY = [
  { id: 1, type: 'like', icon: <Heart size={14} fill="currentColor" />, iconBg: 'bg-gradient-to-br from-[#6B46C0] to-[#00D4FF]', avatar: 'https://i.pravatar.cc/56?img=12', text: <><strong>Julian Veldt</strong> and <strong>3 others</strong> liked your celestial collection <em className="text-primary">"Stellar Horizons"</em></>, time: '2 hours ago' },
  { id: 2, type: 'comment', icon: <MessageCircle size={14} fill="currentColor" />, iconBg: 'bg-[#00D4FF]', avatar: 'https://i.pravatar.cc/56?img=47', text: <><strong>Sasha K.</strong> commented: <span className="text-on-surface-variant">"The depth in this composition is absolutely breathtaking!"</span></>, time: '5 hours ago', thumb: true },
  { id: 3, type: 'follow', icon: <UserPlus size={14} />, iconBg: 'bg-cyan-400', avatars: ['https://i.pravatar.cc/48?img=33', 'https://i.pravatar.cc/48?img=25'], text: <><strong>Leo Brooks</strong> and <strong>Mila Chen</strong> started following you.</>, time: '8 hours ago', action: true },
]

const YESTERDAY = [
  { id: 4, type: 'mention', icon: <AtSign size={14} fill="currentColor" />, iconBg: 'bg-violet-500', avatar: 'https://i.pravatar.cc/56?img=8', text: <><strong>Marcus T.</strong> mentioned you in <strong>"Design Curators Weekly"</strong>.</>, time: 'Yesterday, 4:12 PM' },
  { id: 5, type: 'achievement', icon: <Star size={14} fill="currentColor" />, iconBg: 'bg-gradient-to-br from-[#6B46C0]/10 to-[#00D4FF]/10', text: <><strong>System Discovery:</strong> Your profile has been viewed over <strong className="text-primary">1,000 times</strong> this week. Keep creating!</>, time: 'Yesterday, 10:45 AM', system: true },
]

function NotifItem({ item, dim = false }: { item: typeof TODAY[0] & { avatars?: string[]; action?: boolean; thumb?: boolean; system?: boolean }; dim?: boolean }) {
  return (
    <motion.div
      {...motionVariants.fadeIn}
      className={`group relative flex items-center gap-6 p-6 bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(107,70,192,0.03)] hover:shadow-[0_20px_40px_rgba(107,70,192,0.08)] transition-all duration-300 ${dim ? 'opacity-75' : ''}`}
    >
      <div className="relative shrink-0">
        {item.avatars ? (
          <div className="flex -space-x-4">
            {item.avatars.map((a, i) => (
              <Avatar key={i} src={a} alt="" size="md" className="border-4 border-surface-container-lowest" />
            ))}
          </div>
        ) : item.system ? (
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary/10 to-[#00D4FF]/10 flex items-center justify-center border-2 border-white">
            <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
        ) : (
          <Avatar src={(item as any).avatar} alt="" size="lg" />
        )}
        <div className={`absolute -bottom-1 -right-1 ${item.iconBg} p-1 rounded-full border-2 border-white text-white`}>
          {item.icon}
        </div>
      </div>

      <div className="flex-grow">
        <p className="text-on-surface">{item.text}</p>
        <span className="text-sm text-on-surface-variant/60 mt-1 block">{item.time}</span>
      </div>

      {item.thumb && (
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-outline-variant/15 shrink-0 bg-gradient-to-br from-primary/20 to-[#00D4FF]/10" />
      )}
      {item.action && (
        <Button variant="secondary" size="sm">Follow back</Button>
      )}

      <button className="hidden group-hover:flex p-2 text-on-surface-variant hover:text-primary transition-colors">
        <MoreHorizontal size={18} />
      </button>
    </motion.div>
  )
}

export function NotificationsScreen() {
  return (
    <div className="pt-12 pb-20 px-12 flex justify-center">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface mb-2">Notifications</h1>
            <p className="text-on-surface-variant text-lg">Your cosmic interactions and updates.</p>
          </div>
          <button className="text-primary font-semibold py-2 px-4 hover:bg-surface-container-low rounded-xl transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">done_all</span>
            Mark all read
          </button>
        </div>

        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Today</span>
            <div className="h-px flex-grow bg-outline-variant/15" />
          </div>
          <div className="flex flex-col gap-4">
            {TODAY.map(item => <NotifItem key={item.id} item={item as any} />)}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Yesterday</span>
            <div className="h-px flex-grow bg-outline-variant/15" />
          </div>
          <div className="flex flex-col gap-4">
            {YESTERDAY.map(item => <NotifItem key={item.id} item={item as any} dim />)}
          </div>
        </section>

        <div className="mt-20 flex flex-col items-center justify-center opacity-30 pointer-events-none">
          <span className="material-symbols-outlined text-7xl text-primary mb-4">star</span>
          <p className="text-xs font-label tracking-widest text-on-surface-variant uppercase">End of celestial log</p>
        </div>
      </div>
    </div>
  )
}
