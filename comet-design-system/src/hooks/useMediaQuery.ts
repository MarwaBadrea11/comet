/**
 * Media upload and management hooks.
 *
 * useUploadMedia      — POST /media/upload (single file)
 * useUploadMultiple   — POST /media/upload (multiple files)
 * useDeleteMedia      — DELETE /media/:id
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mediaService } from '../services/media'

/**
 * Upload a single media file.
 * Max size: 50MB (enforced by backend).
 */
export function useUploadMedia() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => mediaService.upload(file),
    onSuccess: (data) => {
      // Cache the uploaded media
      qc.setQueryData(['media', data.id], data)
    },
    onError: (error: any) => {
      // Handle specific errors
      if (error.response?.status === 413) {
        console.error('File too large (max 50MB)')
      }
    },
  })
}

/**
 * Upload multiple files sequentially.
 */
export function useUploadMultiple() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (files: File[]) => mediaService.uploadMultiple(files),
    onSuccess: (mediaList) => {
      // Cache all uploaded media
      mediaList.forEach((media) => {
        qc.setQueryData(['media', media.id], media)
      })
    },
  })
}

/**
 * Delete a media file.
 * Only works if the current user uploaded it.
 */
export function useDeleteMedia() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (mediaId: string) => mediaService.delete(mediaId),
    onSuccess: (_, mediaId) => {
      // Remove from cache
      qc.removeQueries({ queryKey: ['media', mediaId] })
      // Invalidate any queries that might reference this media
      qc.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
