/**
 * Media service.
 * Maps to /media/* endpoints for file uploads and management.
 */

import api from './api'
import type { Media } from '../types/media.types'

export const mediaService = {
  /**
   * POST /media/upload
   * Uploads a file using multipart/form-data.
   * CRITICAL: The FormData field name MUST be 'file' (matches FileInterceptor('file') on backend).
   * 
   * Backend accepts:
   * - Max file size: 50MB
   * - Auto-generates unique filename on server
   * - Returns full media record with generated ID
   * 
   * NOTE: Don't set Content-Type header manually - browser will set it with proper boundary
   */
  upload: async (file: File): Promise<Media> => {
    const formData = new FormData()
    formData.append('file', file) // ← MUST be 'file'

    // ✅ FIX: Don't set Content-Type - let browser handle it with boundary
    // The api interceptor will automatically add Authorization header
    const { data } = await api.post('/media/upload', formData)
    return data
  },

  /**
   * GET /media/:id
   * Returns the serialized media record (includes absolute `url`).
   */
  getById: async (mediaId: string): Promise<Media> => {
    const { data } = await api.get(`/media/${mediaId}`)
    return data
  },

  /**
   * DELETE /media/:id
   * Deletes a media file (only if uploaded by current user).
   * Backend checks ownership before deletion.
   */
  delete: async (mediaId: string): Promise<void> => {
    await api.delete(`/media/${mediaId}`)
  },

  /**
   * Upload multiple files sequentially.
   * Returns array of media records.
   */
  uploadMultiple: async (files: File[]): Promise<Media[]> => {
    const uploads = files.map((file) => mediaService.upload(file))
    return Promise.all(uploads)
  },
}
