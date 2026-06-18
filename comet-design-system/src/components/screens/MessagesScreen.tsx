import { useState } from 'react'
import { Search, Phone, Video, Info, Send, Image, Mic, Plus, ArrowLeft } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Input } from '../ui/Input'

const CONVERSATIONS = [
  { id: 1, name: 'Lyra Nova',    avatar: 'https://i.pravatar.cc/48?img=47', online: true,  lastMsg: 'That piece you posted is unreal! ✨',          time: '12:45 PM', unread: 2, active: true  },
  { id: 2, name: 'Atlas Thorne', avatar: 'https://i.pravatar.cc/48?img=12', online: false, lastMsg: 'Sent a gallery invite for next Thursday.',       time: '09:12 AM', unread: 0              },
  { id: 3, name: 'Luna Vane',    avatar: 'https://i.pravatar.cc/48?img=25', online: true,  lastMsg: 'Sent a photo',                                  time: 'Yesterday', unread: 5             },
  { id: 4, name: 'Cyrus Orion',  avatar: 'https://i.pravatar.cc/48?img=33', online: false, lastMsg: "Let's connect soon.",                           time: 'May 12',   unread: 0              },
]

const MESSAGES = [
  { id: 1, from: 'other', text: 'Hey! I just saw the "Nebula Dreams" piece you published. The way you handled the subsurface scattering on the glass textures is actually insane.', time: '12:42 PM' },
  { id: 2, from: 'me',    text: 'Thank you so much Lyra! That means a lot coming from you. I spent about three days just refining those nodes in Blender. 😅',                       time: '12:44 PM' },
  { id: 3, from: 'other', text: 'That piece you posted is unreal! ✨ We should definitely collaborate on the next curation for the Celestial Exhibit.',                               time: '12:45 PM' },
]

export function MessagesScreen() {
  const [active, setActive]   = useState(1)
  const [msg, setMsg]         = useState('')
  const [showChat, setShowChat] = useState(false)   // mobile: toggle between list and chat
  const conv = CONVERSATIONS.find(c => c.id === active)!

  const openChat = (id: number) => { setActive(id); setShowChat(true) }

  return (
    // Full height minus topbar
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] overflow-hidden">

      {/* ── Conversations list ── */}
      {/* On mobile: full width, hidden when chat is open */}
      <section
        className={`
          flex flex-col bg-surface border-r border-outline-variant/15
          w-full sm:w-80 lg:w-96 shrink-0
          ${showChat ? 'hidden sm:flex' : 'flex'}
        `}
      >
        <div className="p-5 lg:p-8 pb-3 lg:pb-4">
          <h1 className="text-xl lg:text-2xl font-extrabold font-headline text-on-surface tracking-tight mb-4 lg:mb-6">
            Direct Messages
          </h1>
          <Input variant="search" placeholder="Search conversations..." leadingIcon={<Search size={18} />} />
        </div>

        <div className="flex-1 overflow-y-auto px-3 lg:px-4 pb-6 space-y-1.5">
          {CONVERSATIONS.map(c => (
            <div
              key={c.id}
              onClick={() => openChat(c.id)}
              className={`flex items-center gap-3 p-3 lg:p-4 rounded-2xl cursor-pointer transition-all ${c.id === active ? 'bg-surface-container-lowest shadow-sm border border-primary/10' : 'hover:bg-surface-container-low'}`}
            >
              <div className="relative shrink-0">
                <Avatar src={c.avatar} alt={c.name} size="md" />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${c.online ? 'bg-green-500' : 'bg-slate-300'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="font-bold text-on-surface text-sm truncate">{c.name}</h3>
                  <span className="text-[10px] text-on-surface-variant/60 font-semibold uppercase tracking-wider shrink-0 ml-2">{c.time}</span>
                </div>
                <p className={`text-xs truncate ${c.unread ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>{c.lastMsg}</p>
              </div>
              {c.unread > 0 && (
                <div className="w-5 h-5 bg-[#00D4FF] flex items-center justify-center rounded-full shrink-0">
                  <span className="text-[10px] font-bold text-white">{c.unread}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Chat window ── */}
      {/* On mobile: full width, shown when chat is open */}
      <section
        className={`
          flex-1 bg-surface-container-low flex flex-col relative min-w-0
          ${showChat ? 'flex' : 'hidden sm:flex'}
        `}
      >
        {/* Chat header */}
        <header className="h-14 lg:h-16 flex items-center justify-between px-4 lg:px-8 bg-white/70 backdrop-blur-2xl z-10 border-b border-outline-variant/10 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile back button */}
            <button
              onClick={() => setShowChat(false)}
              className="sm:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors mr-1"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="relative">
              <Avatar src={conv.avatar} alt={conv.name} size="sm" />
              {conv.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
            </div>
            <div>
              <h2 className="font-headline font-bold text-on-surface text-sm lg:text-base">{conv.name}</h2>
              {conv.online && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Active Now</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 lg:gap-5">
            {[<Phone size={18} />, <Video size={18} />, <Info size={18} />].map((icon, i) => (
              <button key={i} className="text-on-surface-variant hover:text-primary transition-colors hidden sm:block">{icon}</button>
            ))}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col gap-5 lg:gap-8">
          <div className="text-center">
            <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Today</span>
          </div>

          {MESSAGES.map(m => (
            <div key={m.id} className={`flex gap-3 max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] ${m.from === 'me' ? 'self-end flex-row-reverse' : ''}`}>
              {m.from === 'other' && (
                <Avatar src={conv.avatar} alt={conv.name} size="sm" className="shrink-0 mt-auto" />
              )}
              <div>
                <div className={`p-4 rounded-2xl shadow-sm ${m.from === 'me' ? 'bg-gradient-to-br from-primary to-primary-container rounded-br-none' : 'bg-surface-container-lowest rounded-bl-none'}`}>
                  <p className={`text-sm leading-relaxed ${m.from === 'me' ? 'text-white' : 'text-on-surface'}`}>{m.text}</p>
                </div>
                <span className={`text-[10px] text-on-surface-variant/50 mt-1 block ${m.from === 'me' ? 'text-right' : ''}`}>{m.time}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          <div className="flex gap-3 max-w-[70%]">
            <Avatar src={conv.avatar} alt={conv.name} size="sm" className="shrink-0" />
            <div className="bg-surface-container-lowest px-4 py-3 rounded-2xl flex gap-1 items-center">
              {[0, 0.2, 0.4].map((d, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-on-surface-variant/30 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Input */}
        <footer className="p-3 lg:p-6 shrink-0">
          <div className="bg-surface-container-lowest rounded-2xl lg:rounded-[2rem] p-2 lg:p-3 shadow-lg flex items-end gap-2 border border-outline-variant/10">
            <div className="flex gap-0.5 mb-0.5">
              {[<Plus size={18} />, <Image size={18} />, <Mic size={18} />].map((icon, i) => (
                <button key={i} className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all">{icon}</button>
              ))}
            </div>
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 py-2 text-sm resize-none max-h-28 outline-none"
              placeholder="Type your celestial message..."
              rows={1}
            />
            <button className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-full shadow-md hover:scale-105 active:scale-95 transition-all shrink-0">
              <Send size={16} />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-[0.3em]">
            Encrypted End-to-End
          </p>
        </footer>
      </section>
    </div>
  )
}
