import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Users, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { toast } from '../ui/Toast'
import { useGroups, useJoinGroup, useLeaveGroup } from '../../hooks/useGroupsQuery'
import { CreateGroupModal } from './CreateGroupModal'

const FILTERS = ['All', 'Creative', 'Tech', 'Nature']

export function GroupsScreen() {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('All')
  
  const { data: allGroups = [], isLoading, isError, refetch } = useGroups()
  const joinGroup  = useJoinGroup()
  const leaveGroup = useLeaveGroup()

  const myGroups      = allGroups.filter(g => g.role != null)
  const discoverGroups = allGroups.filter(g => g.role == null)

  const handleLeave = (e: React.MouseEvent, groupId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!window.confirm('Are you sure you want to leave this constellation?')) return
    leaveGroup.mutate(groupId, {
      onSuccess: () => toast.success('Left group successfully'),
      onError: () => toast.error('Failed to leave group'),
    })
  }

  const handleJoin = (e: React.MouseEvent, groupId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    joinGroup.mutate(groupId, {
      onSuccess: () => {
        toast.success('Joined group successfully!')
      },
      onError: (error: any) => {
        // Check if it's a 409 conflict (already a member)
        if (error?.response?.status === 409) {
          toast.info('You are already a member of this group')
          // Force refetch to sync UI state
          refetch()
        } else {
          const message = error?.response?.data?.message || error?.message || 'Failed to join group'
          toast.error(message)
        }
      },
    })
  }

  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#f8f9ff]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-on-surface-variant">Mapping the cosmos groups...</p>
      </div>
    )
  }

  return (
    <div className="p-12 min-h-screen bg-[#f8f9ff]">

      {isError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-center text-sm font-semibold text-red-500">
          Failed to load groups.
          <button onClick={() => refetch()} className="block mx-auto mt-1 text-xs text-primary underline">Reload</button>
        </div>
      )}

      {/* My Groups */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="font-headline text-2xl font-extrabold tracking-tight mb-2">My Constellations</h3>
            <p className="text-sm text-on-surface-variant">The communities you shape and guide.</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Create Group
          </Button>
        </div>

        {myGroups.length === 0 ? (
          <div className="text-center py-12 bg-white/40 rounded-2xl border-2 border-dashed border-outline-variant/30">
            <p className="text-on-surface-variant text-sm font-medium">You haven't joined any groups yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGroups.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleGroupClick(g.id)}
                className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Users size={20} />
                    </div>
                    {g.role && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary">{g.role}</span>
                    )}
                  </div>
                  <h4 className="font-headline font-bold text-lg mb-1 text-on-surface">{g.name}</h4>
                  <p className="text-xs text-on-surface-variant/80 line-clamp-2 mb-4">
                    {g.description || 'No description for this celestial space.'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                  <span className="text-xs text-on-surface-variant font-medium">{g.membersCount ?? 0} Members</span>
                  <Button
                    variant="secondary" size="sm"
                    className="text-red-500 hover:bg-red-50"
                    disabled={leaveGroup.isPending}
                    onClick={(e) => handleLeave(e, g.id)}
                  >
                    Leave
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Discover */}
      <section>
        <div className="mb-8">
          <h3 className="font-headline text-2xl font-extrabold tracking-tight mb-2">Discover Communities</h3>
          <p className="text-sm text-on-surface-variant">Expand your horizon. Join new conceptual spaces.</p>
          <div className="flex gap-2 mt-6">
            {FILTERS.map(f => (
              <button 
                key={f} 
                onClick={() => setSelectedFilter(f)}
                className={`px-4 h-9 rounded-xl text-xs font-semibold transition-all ${
                  f === selectedFilter 
                    ? 'bg-gradient-to-r from-[#6B46C0] to-[#8E5EFF] text-white shadow-sm' 
                    : 'bg-white/60 hover:bg-white text-on-surface-variant border border-outline-variant/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {discoverGroups.length === 0 && (
          <div className="text-center py-12 bg-white/40 rounded-2xl border-2 border-dashed border-outline-variant/30">
            <p className="text-on-surface-variant text-sm font-medium">No groups to discover right now.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {discoverGroups.map(g => (
            <motion.div key={g.id} layout className="bg-white rounded-2xl p-6 border border-outline-variant/15 shadow-sm flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h4 className="font-headline font-bold text-xl text-on-surface mb-2">{g.name}</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{g.description || 'Explore collective thinking inside this Comet community.'}</p>
                </div>
                <Button
                  variant="primary" size="sm"
                  disabled={joinGroup.isPending && joinGroup.variables === g.id}
                  onClick={(e) => handleJoin(e, g.id)}
                  className="sm:self-start min-w-[120px] h-9 rounded-xl flex items-center justify-center"
                >
                  {joinGroup.isPending && joinGroup.variables === g.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    'Join'
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant/70 font-semibold pt-4 border-t border-outline-variant/5">
                <Users size={14} />
                <span>{g.membersCount ?? 0} Curators in orbit</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={(groupId) => {
            handleGroupClick(groupId)
          }}
        />
      )}
    </div>
  )
}
