/**
 * Create Group Modal
 * 
 * Allows users to create a new group with:
 * - Group name
 * - Description
 * - Posts need approval option
 */

import { useState } from 'react'
import { X, Users, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '../ui/Input'
import { toast } from '../ui/Toast'
import { useCreateGroup } from '../../hooks/useGroupsQuery'

interface CreateGroupModalProps {
  onClose: () => void
  onGroupCreated?: (groupId: string) => void
}

export function CreateGroupModal({ onClose, onGroupCreated }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('')
  const [description, setDescription] = useState('')
  const [postsNeedApproval, setPostsNeedApproval] = useState(false)
  const [errors, setErrors] = useState<{ name?: string }>({})

  const createGroup = useCreateGroup()

  const validate = () => {
    const newErrors: { name?: string } = {}

    if (!groupName.trim()) {
      newErrors.name = 'Group name is required'
    } else if (groupName.trim().length < 3) {
      newErrors.name = 'Group name must be at least 3 characters'
    } else if (groupName.trim().length > 100) {
      newErrors.name = 'Group name must be less than 100 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    createGroup.mutate(
      {
        name: groupName.trim(),
        description: description.trim() || undefined,
        privacy: 'PUBLIC',
        postsNeedApproval,
      },
      {
        onSuccess: (group) => {
          toast.success('Group created successfully!')
          onGroupCreated?.(group.id)
          onClose()
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || 'Failed to create group'
          toast.error(message)
        },
      }
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white w-full max-w-lg rounded-[2rem] flex flex-col overflow-hidden shadow-2xl max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-outline-variant/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6B46C0] to-[#8E5EFF] flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <h2 className="font-headline text-lg font-bold text-on-surface">Create Group</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-surface rounded-full transition-colors"
              disabled={createGroup.isPending}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Group Name */}
              <div>
                <Input
                  label="Group Name"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value)
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
                  }}
                  error={errors.name}
                  maxLength={100}
                  disabled={createGroup.isPending}
                />
                <p className="text-xs text-on-surface-variant mt-1 px-1">
                  {groupName.length}/100 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant px-1 block mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your group's purpose..."
                  maxLength={500}
                  rows={4}
                  disabled={createGroup.isPending}
                  className="w-full bg-surface-container-low rounded-2xl p-4 border-none outline-none font-body text-on-surface placeholder:text-outline/50 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest resize-none"
                />
                <p className="text-xs text-on-surface-variant mt-1 px-1">
                  {description.length}/500 characters
                </p>
              </div>

              {/* Posts Need Approval */}
              <div className="flex items-start gap-3 p-4 bg-surface-container/30 rounded-xl">
                <input
                  type="checkbox"
                  id="postsNeedApproval"
                  checked={postsNeedApproval}
                  onChange={(e) => setPostsNeedApproval(e.target.checked)}
                  disabled={createGroup.isPending}
                  className="mt-0.5 w-5 h-5 rounded border-2 border-outline-variant text-primary focus:ring-2 focus:ring-primary/20"
                />
                <label htmlFor="postsNeedApproval" className="flex-1 cursor-pointer">
                  <p className="text-sm font-semibold text-on-surface">Approve posts before publishing</p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    All posts will need admin approval before appearing in the group
                  </p>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-outline-variant/10 shrink-0">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={createGroup.isPending}
                  className="flex-1 h-11 rounded-xl bg-surface-container text-on-surface font-bold hover:bg-surface-container-low transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createGroup.isPending || !groupName.trim()}
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#6B46C0] to-[#8E5EFF] text-white font-bold disabled:opacity-40 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  {createGroup.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Users size={16} />
                      Create Group
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  )
}
