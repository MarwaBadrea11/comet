/**
 * File Dropzone Component with Preview
 * 
 * Features:
 * - Drag and drop support
 * - File size validation (50MB max)
 * - File type validation
 * - Preview thumbnails
 * - Upload progress tracking
 * - Multiple file support
 */

import { useState, useCallback, useRef } from 'react'
import { Upload, X, FileImage, FileVideo, Loader2, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FileWithPreview extends File {
  preview?: string
  progress?: number
  id: string
}

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void
  onUploadComplete?: (mediaIds: string[]) => void
  maxSize?: number // in bytes, default 50MB
  accept?: string
  multiple?: boolean
  maxFiles?: number
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export function FileDropzone({
  onFilesSelected,
  onUploadComplete,
  maxSize = MAX_FILE_SIZE,
  accept = 'image/*,video/*',
  multiple = true,
  maxFiles = 10,
}: FileDropzoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File "${file.name}" exceeds ${maxSize / 1024 / 1024}MB limit`
    }

    const acceptedTypes = accept.split(',').map(t => t.trim())
    const fileType = file.type
    const isAccepted = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return fileType.startsWith(type.replace('/*', ''))
      }
      return fileType === type
    })

    if (!isAccepted) {
      return `File type "${file.type}" is not accepted`
    }

    return null
  }

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles: FileWithPreview[] = []
    const errors: string[] = []

    Array.from(fileList).forEach((file, index) => {
      // Check max files limit
      if (files.length + newFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`)
        return
      }

      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        errors.push(validationError)
        return
      }

      // Create preview for images
      const fileWithPreview: FileWithPreview = Object.assign(file, {
        id: `file-${Date.now()}-${index}`,
        preview: file.type.startsWith('image/') 
          ? URL.createObjectURL(file) 
          : undefined,
        progress: 0,
      })

      newFiles.push(fileWithPreview)
    })

    if (errors.length > 0) {
      setError(errors[0]) // Show first error
      setTimeout(() => setError(null), 5000)
    }

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles])
      onFilesSelected(newFiles)
    }
  }, [files.length, maxFiles, maxSize, accept, onFilesSelected])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [processFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }, [processFiles])

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId)
      // Revoke object URL to prevent memory leaks
      const removed = prev.find(f => f.id === fileId)
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview)
      }
      return updated
    })
  }, [])

  const updateProgress = useCallback((fileId: string, progress: number) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, progress } : f
    ))
  }, [])

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInput}
          accept={accept}
          multiple={multiple}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className={`p-3 rounded-full ${isDragging ? 'bg-primary/10' : 'bg-surface-container'}`}>
            <Upload size={24} className={isDragging ? 'text-primary' : 'text-on-surface-variant'} />
          </div>

          <div>
            <p className="text-sm font-medium text-on-surface">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              or click to browse • Max {maxSize / 1024 / 1024}MB per file
            </p>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-2 left-2 right-2 bg-error/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group aspect-square bg-surface-container rounded-xl overflow-hidden border border-outline-variant/20"
              >
                {/* Preview */}
                {file.preview ? (
                  <img 
                    src={file.preview} 
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {file.type.startsWith('video/') ? (
                      <FileVideo size={32} className="text-on-surface-variant" />
                    ) : (
                      <FileImage size={32} className="text-on-surface-variant" />
                    )}
                  </div>
                )}

                {/* Progress Overlay */}
                {file.progress !== undefined && file.progress < 100 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 size={24} className="text-white animate-spin mx-auto mb-2" />
                      <p className="text-white text-xs font-medium">{file.progress}%</p>
                    </div>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(file.id)
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>

                {/* File Name */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-white text-xs font-medium truncate">{file.name}</p>
                  <p className="text-white/70 text-[10px]">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
