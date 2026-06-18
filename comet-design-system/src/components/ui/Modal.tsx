import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { motionVariants } from '../../lib/theme'
import type { ModalProps } from '../../types'

export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            {...motionVariants.modalBackdrop}
            className="fixed inset-0 z-50 bg-on-surface/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            {...motionVariants.scaleIn}
            className={cn(
              'fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-full max-w-md',
              'bg-surface-container-highest/80 backdrop-blur-2xl',
              'rounded-3xl border border-outline-variant/15',
              'shadow-[0_20px_40px_rgba(107,70,192,0.12)]',
              'p-8',
              className,
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            {/* Header */}
            {(title || description) && (
              <div className="mb-6 pr-8">
                {title && (
                  <h2 id="modal-title" className="font-headline font-bold text-xl text-on-surface">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">{description}</p>
                )}
              </div>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
