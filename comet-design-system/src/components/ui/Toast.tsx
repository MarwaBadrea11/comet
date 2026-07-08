/**
 * Toast Notification System
 * 
 * Usage:
 * import { toast } from '@/components/ui/Toast'
 * toast.success('Post created!')
 * toast.error('File too large (max 50MB)')
 * toast.warning('Post already saved')
 */

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((type: ToastType, message: string, duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    const newToast: Toast = { id, type, message, duration }
    
    setToasts(prev => [...prev, newToast])

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [removeToast])

  // Listen for global toast events
  useEffect(() => {
    const handleToastEvent = ((event: CustomEvent) => {
      const { type, message, duration } = event.detail
      addToast(type, message, duration)
    }) as EventListener

    window.addEventListener('show-toast', handleToastEvent)
    return () => window.removeEventListener('show-toast', handleToastEvent)
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => onRemove(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />,
  }

  const styles = {
    success: 'bg-green-500/95 text-white',
    error: 'bg-red-500/95 text-white',
    warning: 'bg-amber-500/95 text-white',
    info: 'bg-blue-500/95 text-white',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      className={`${styles[toast.type]} px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm pointer-events-auto flex items-center gap-3 min-w-[320px] max-w-md`}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onRemove}
        className="shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  )
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// Convenient toast API
export const toast = {
  success: (message: string, duration?: number) => {
    const event = new CustomEvent('show-toast', { detail: { type: 'success', message, duration } })
    window.dispatchEvent(event)
  },
  error: (message: string, duration?: number) => {
    const event = new CustomEvent('show-toast', { detail: { type: 'error', message, duration } })
    window.dispatchEvent(event)
  },
  warning: (message: string, duration?: number) => {
    const event = new CustomEvent('show-toast', { detail: { type: 'warning', message, duration } })
    window.dispatchEvent(event)
  },
  info: (message: string, duration?: number) => {
    const event = new CustomEvent('show-toast', { detail: { type: 'info', message, duration } })
    window.dispatchEvent(event)
  },
}
